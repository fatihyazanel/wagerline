import {ensureTheSportsDbDetails} from '../services/thesportsdb-details'
import {ensureSportscoreDetails} from '../services/sportscore-details'
import {ensureEspnDetails} from '../services/espn-details'
import {recordFreshness} from '../services/data-freshness'
import {ensureSportdbDetails} from '../services/sportdb-details'
import { FastifyInstance } from 'fastify'
import { db } from '../database/init'
const matchSelect = `SELECT e.id,e.start_time,e.status,e.updated_at,e.home_team_id,e.away_team_id,
 COALESCE(hn.name,h.slug) AS home_team_name,COALESCE(an.name,a.slug) AS away_team_name,
 h.logo_url AS home_logo,a.logo_url AS away_logo,c.slug AS competition_slug,s.slug AS sport,
 (SELECT score FROM event_scores WHERE event_id=e.id AND participant_id=e.home_team_id ORDER BY id DESC LIMIT 1) AS home_score,
 (SELECT score FROM event_scores WHERE event_id=e.id AND participant_id=e.away_team_id ORDER BY id DESC LIMIT 1) AS away_score
 FROM events e JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id
 LEFT JOIN team_translations hn ON hn.team_id=h.id AND hn.language='en'
 LEFT JOIN team_translations an ON an.team_id=a.id AND an.language='en'
 JOIN competitions c ON c.id=e.competition_id JOIN sports s ON s.id=e.sport_id`
export async function workspaceRoutes(app:FastifyInstance) {
 app.get('/catalog',async()=>({data:{
  sports:await db.prepare('SELECT id,slug FROM sports ORDER BY id').all(),
  competitions:await db.prepare('SELECT c.id,c.slug,(SELECT logo_url FROM competition_assets WHERE competition_id=c.id) AS logo_url,s.slug AS sport FROM competitions c JOIN sports s ON s.id=c.sport_id WHERE c.active=1 ORDER BY c.id').all()
 }}))
 app.get('/matches',async (request,reply)=>{
  const q=request.query as Record<string,string>
  if(q.status&&!['scheduled','live','finished'].includes(q.status))return reply.code(400).send({error:'Invalid match status'})
  const conditions:string[]=['NOT EXISTS(SELECT 1 FROM event_aliases ea WHERE ea.alias_event_id=e.id)']; const params:unknown[]=[]
  if(q.status==='live') conditions.push("e.status IN ('live','halftime','ht','1h','2h','et','period_break')")
  else if(q.status==='finished') conditions.push("e.status='finished'")
  else conditions.push("e.status='scheduled' AND datetime(e.start_time)>=datetime('now')")
  if(q.featured==='1')conditions.push('EXISTS(SELECT 1 FROM provider_standings ps WHERE ps.competition_id=c.id)')
  if(q.sport){conditions.push('s.slug=?');params.push(q.sport)}
  if(q.competition){conditions.push('c.slug=?');params.push(q.competition)}
  if(q.ids!==undefined){const ids=q.ids.split(',').filter(v=>/^\d+$/.test(v)).slice(0,1000);conditions.push(ids.length?`e.id IN (SELECT COALESCE((SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=value),value) FROM json_each(?))`:'0=1');if(ids.length)params.push(JSON.stringify(ids))}
  const where=conditions.join(' AND ')
  const limit=Math.max(1,Math.min(40,Number(q.limit)||40)); const page=Math.max(1,Math.min(10000,Number(q.page)||1))
  const count=await db.prepare(`SELECT COUNT(*) AS total FROM (${matchSelect} WHERE ${where})`).get(...params)
  const rows=await db.prepare(`${matchSelect} WHERE ${where} ORDER BY e.start_time ${q.status==='finished'?'DESC':'ASC'},e.id LIMIT ? OFFSET ?`).all(...params,limit,(page-1)*limit)
  reply.header('Cache-Control','no-store')
  return {data:rows.map(r=>({...r,...recordFreshness(r.status,r.updated_at)})),meta:{total:count.total,page,pages:Math.ceil(count.total/limit),timestamp:new Date().toISOString()}}
 })
 app.get('/matches/:id',async(request,reply)=>{
  let {id}=request.params as {id:string}
  const alias=await db.prepare('SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=?').get(id)
  if(alias)id=String(alias.canonical_event_id)
  let event=await db.prepare(`${matchSelect} WHERE e.id=?`).get(id)
  if(!event)return reply.code(404).send({error:'Event not found'})
  void ensureSportdbDetails(Number(id)).catch(error=>request.log.warn({message:error.message},'Provider match detail refresh failed'))
  const primary=await ensureEspnDetails(Number(id))
  const secondary=await ensureSportscoreDetails(Number(id))
  let espn=primary?.fetched_at?{...primary,...Object.fromEntries(['statistics','timeline','lineups','performers','h2h','odds'].map(k=>[k,primary[k]?.length?primary[k]:secondary?.[k]||[]]))}:secondary?.fetched_at?secondary:primary||secondary
  if(!espn?.statistics?.length||!espn?.lineups?.length||!espn?.timeline?.length){const extra=await ensureTheSportsDbDetails(Number(id));if(extra?.fetched_at){if(!espn?.fetched_at)espn=extra;else{const added=['statistics','timeline','lineups'].filter(k=>!espn[k]?.length&&extra[k]?.length);for(const k of added)espn[k]=extra[k];if(added.length)espn.source=[espn.source,extra.source].filter(Boolean).join(' / ')}}}
  event=await db.prepare(`${matchSelect} WHERE e.id=?`).get(id)
  reply.header('Cache-Control','no-store')
    const cached=await db.prepare('SELECT payload_json,fetched_at FROM provider_match_details WHERE event_id=?').get(id)
  const supplied=cached?JSON.parse(cached.payload_json):null
  const mapped=await db.prepare("SELECT 1 present FROM provider_event_records WHERE provider='sportdb' AND event_id=?").get(id)
  const [statistics,timeline,lineups,performers,h2h,odds]=await Promise.all([
   db.prepare('SELECT participant_id,metric,value,period FROM event_statistics WHERE event_id=?').all(id),
   db.prepare(`SELECT i.type,i.detail,i.elapsed,pt.name AS player FROM event_incidents i LEFT JOIN player_translations pt ON pt.player_id=i.player_id AND pt.language='en' WHERE i.event_id=? ORDER BY i.elapsed`).all(id),
   db.prepare('SELECT team_id,formation,lineup_json,lineup_type FROM event_lineups WHERE event_id=?').all(id),
   db.prepare(`SELECT p.name,st.goals,st.assists,st.rating FROM event_player_statistics st LEFT JOIN player_translations p ON p.player_id=st.player_id AND p.language='en' WHERE st.event_id=? ORDER BY st.rating DESC`).all(id),
   db.prepare(`${matchSelect} WHERE e.status='finished' AND datetime(e.start_time)<datetime(?) AND NOT EXISTS(SELECT 1 FROM event_aliases ea WHERE ea.alias_event_id=e.id) AND ((e.home_team_id=? AND e.away_team_id=?) OR (e.home_team_id=? AND e.away_team_id=?)) ORDER BY e.start_time DESC LIMIT 10`).all(event.start_time,event.home_team_id,event.away_team_id,event.away_team_id,event.home_team_id),
   db.prepare('SELECT * FROM betting_odds WHERE event_id=?').all(id)
  ])
  const form=await Promise.all([event.home_team_id,event.away_team_id].map(async teamId=>({team_id:teamId,matches:await db.prepare(`${matchSelect} WHERE e.status='finished' AND (e.home_team_id=? OR e.away_team_id=?) AND datetime(e.start_time)<datetime(?) AND NOT EXISTS(SELECT 1 FROM event_aliases ea WHERE ea.alias_event_id=e.id) ORDER BY e.start_time DESC LIMIT 5`).all(teamId,teamId,event.start_time)})))
  const detailChecks=await db.prepare('SELECT resource,status,http_status,checked_at FROM provider_detail_checks WHERE event_id=?').all(id);const stale=cached&&Date.now()-Date.parse(cached.fetched_at.replace(' ','T')+'Z')>(['live','halftime','period_break'].includes(event.status)?60000:3600000);
  return {data:{event:{...event,...recordFreshness(event.status,event.updated_at)},form:form.map(f=>({...f,matches:f.matches.filter(m=>m.home_score!==null&&m.away_score!==null)})),detail_checks:detailChecks,detail_updated_at:espn?.fetched_at||cached?.fetched_at,statistics:espn?.statistics?.length?espn.statistics:supplied?.statistics?.length?supplied.statistics:statistics,timeline:espn?.timeline?.length?espn.timeline:supplied?.timeline?.length?supplied.timeline:timeline,lineups:espn?.lineups?.length?espn.lineups:lineups,performers:espn?.performers?.length?espn.performers:performers,h2h:[...h2h.filter(m=>m.home_score!==null&&m.away_score!==null),...(espn?.h2h||[]).filter((m:any)=>!h2h.some(r=>r.home_team_id===m.home_team_id&&r.away_team_id===m.away_team_id&&r.start_time.slice(0,10)===m.start_time.slice(0,10)))].sort((a,b)=>Date.parse(b.start_time)-Date.parse(a.start_time)).slice(0,10),odds:espn?.odds?.length?espn.odds:odds,venue:espn?.venue||supplied?.venue,source:espn?.source||supplied?.source,detail_state:espn?.stale?'stale':espn?.fetched_at?'cached':espn?.failed?'failed':stale?'stale':cached?'cached':detailChecks.some(r=>r.status==='failed')?'failed':mapped?'pending':'not-supported',updated_at:event.updated_at}}
 })
 app.get('/coverage',async()=>{
  const tables=['sports','competitions','teams','players','events','predictions','news','users','badges','levels','event_statistics','event_lineups','betting_odds','personal_profiles','personal_picks','personal_challenges','personal_claims','competition_assets']
  const counts=await Promise.all(tables.map(async table=>[table,(await db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get()).count]))
  const freshness=await db.prepare(`SELECT (SELECT MAX(start_time) FROM events WHERE status='finished') AS latest_result,(SELECT MAX(published_at) FROM news) AS latest_news,(SELECT COUNT(*) FROM teams WHERE active=1 AND (logo_url IS NULL OR logo_url='')) AS missing_logos`).get()
  const raw=Object.fromEntries(counts);const canonical=await db.prepare("SELECT (SELECT COUNT(*) FROM events e WHERE NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id)) events,(SELECT COUNT(*) FROM teams WHERE active=1) teams,(SELECT COUNT(*) FROM players WHERE active=1) players,(SELECT COUNT(*) FROM competitions WHERE active=1) competitions,(SELECT COUNT(*) FROM predictions p WHERE NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=p.event_id)) predictions,(SELECT COUNT(*) FROM individual_picks) individual_picks").get();const roster=await db.prepare('SELECT status,COUNT(*) teams,SUM(players) players FROM roster_coverage GROUP BY status').all();return {data:{counts:{...raw,...canonical},raw_counts:raw,definitions:{events:'Canonical team events; aliases excluded',teams:'Active teams',players:'Active players',competitions:'Active competitions',predictions:'Model outputs for canonical events',personal_picks:'Saved team selections',individual_picks:'Saved tennis and F1 selections'},roster,...freshness},meta:{timestamp:new Date().toISOString()}}
 })
 app.get('/rewards',async()=>({data:{badges:await db.prepare('SELECT slug,name_key,description_key,requirement_type,requirement_value,points_reward,xp_reward FROM badges').all(),levels:await db.prepare('SELECT level_number,name,min_xp,max_xp FROM levels ORDER BY level_number').all()}}))
}
