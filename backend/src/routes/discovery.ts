import {FastifyInstance} from 'fastify'
import {db} from '../database/init'

const canonicalEvent="NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id)"
const canonicalContest="NOT EXISTS(SELECT 1 FROM individual_aliases a WHERE a.alias_id=i.id)"
const confirmedContest="(i.sport<>'tennis' OR (length(trim(COALESCE(json_extract(i.payload_json,'$.home'),'')))>0 AND length(trim(COALESCE(json_extract(i.payload_json,'$.away'),'')))>0 AND lower(json_extract(i.payload_json,'$.home')) NOT GLOB 'wqf[0-9]*' AND lower(json_extract(i.payload_json,'$.away')) NOT GLOB 'wqf[0-9]*'))"
const activeTeam="t.active=1 AND NOT EXISTS(SELECT 1 FROM canonical_team_aliases a WHERE a.alias_team_id=t.id)"
const leagueEligible=`c.active=1 AND (EXISTS(SELECT 1 FROM events e WHERE e.competition_id=c.id AND ${canonicalEvent}) OR EXISTS(SELECT 1 FROM individual_contests i WHERE i.sport=s.slug))`
const indexes:Record<string,string>={
 players:`SELECT '/players/'||p.id path,NULL updated FROM players p WHERE p.active=1 AND EXISTS(SELECT 1 FROM provider_player_ids pi WHERE pi.player_id=p.id)`,
 matches:`SELECT '/matches/'||e.id path,e.updated_at updated FROM events e WHERE ${canonicalEvent}`,
 contests:`SELECT '/contests/'||i.id path,i.fetched_at updated FROM individual_contests i WHERE ${canonicalContest} AND ${confirmedContest}`,
 teams:`SELECT '/teams/'||t.slug path,NULL updated FROM teams t WHERE ${activeTeam}`,
 leagues:`SELECT '/leagues/'||c.slug path,NULL updated FROM competitions c JOIN sports s ON s.id=c.sport_id WHERE ${leagueEligible} AND s.slug NOT IN ('formula-1','tennis')`,
 sports:"SELECT '/sports/'||slug path,NULL updated FROM sports",
}
export async function discoveryRoutes(app:FastifyInstance){
 app.get('/catalog',async()=>({data:{
  sports:await db.prepare(`SELECT s.slug,(SELECT COUNT(*) FROM events e WHERE e.sport_id=s.id AND ${canonicalEvent})+(SELECT COUNT(*) FROM individual_contests i WHERE i.sport=s.slug AND ${canonicalContest}) matches FROM sports s ORDER BY s.id`).all(),
  leagues:await db.prepare(`SELECT c.slug,c.name_key,s.slug sport FROM competitions c JOIN sports s ON s.id=c.sport_id WHERE ${leagueEligible} ORDER BY c.id`).all(),
  teams:await db.prepare(`SELECT t.id,t.slug,t.logo_url,COALESCE(tt.name,t.slug) name,s.slug sport FROM teams t JOIN sports s ON s.id=t.sport_id LEFT JOIN team_translations tt ON tt.team_id=t.id AND tt.language='en' WHERE ${activeTeam} ORDER BY name`).all(),
 }}))
 app.get('/manifest',async()=>{const data=[];for(const [kind,query]of Object.entries(indexes)){const r=await db.prepare(`SELECT COUNT(*) total FROM (${query})`).get();data.push({kind,total:r.total,pages:Math.ceil(r.total/1000)})}return {data}})
 app.get('/index',async(req,reply)=>{const q=req.query as Record<string,string>;if(!Object.prototype.hasOwnProperty.call(indexes,q.kind))return reply.code(400).send({error:'Invalid index kind'});const page=Number(q.page)||1;const query=indexes[q.kind];const total=(await db.prepare(`SELECT COUNT(*) total FROM (${query})`).get()).total;if(page>Math.max(1,Math.ceil(total/1000)))return reply.code(404).send({error:'Index page not found'});return {data:await db.prepare(query+' ORDER BY path LIMIT 1000 OFFSET ?').all((page-1)*1000),meta:{page,total,pages:Math.ceil(total/1000)}}})
 app.get('/matches',async(req,reply)=>{
  const q=req.query as Record<string,string>;for(const k of ['sport','team','topic'])if(q[k]!==undefined&&typeof q[k]!=='string')return reply.code(400).send({error:'Invalid '+k});const conditions=[canonicalEvent],args:unknown[]=[];
  if(q.sport){if(!await db.prepare('SELECT id FROM sports WHERE slug=?').get(q.sport))return reply.code(400).send({error:'Invalid sport'});conditions.push('s.slug=?');args.push(q.sport)}
  if(q.team){const t=await db.prepare('SELECT id FROM teams WHERE slug=? AND active=1').get(q.team);if(!t)return reply.code(404).send({error:'Team not found'});conditions.push('(e.home_team_id=? OR e.away_team_id=?)');args.push(t.id,t.id)}
  if(q.topic){const statuses:Record<string,string>={fixtures:"e.status='scheduled' AND datetime(e.start_time)>=datetime('now')",results:"e.status='finished'",live:"datetime(e.updated_at)>=datetime('now','-5 minutes') AND e.status IN ('live','halftime','ht','1h','2h','et','period_break')"};if(!Object.prototype.hasOwnProperty.call(statuses,q.topic))return reply.code(400).send({error:'Invalid topic'});conditions.push(statuses[q.topic])}
  const from=`FROM events e JOIN sports s ON s.id=e.sport_id JOIN competitions c ON c.id=e.competition_id JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id LEFT JOIN team_translations hn ON hn.team_id=h.id AND hn.language='en' LEFT JOIN team_translations an ON an.team_id=a.id AND an.language='en' WHERE ${conditions.join(' AND ')}`
  const total=(await db.prepare('SELECT COUNT(*) total '+from).get(...args)).total,page=Number(q.page)||1;
  if(page>Math.max(1,Math.ceil(total/40)))return reply.code(404).send({error:'Page not found'})
  const data=await db.prepare(`SELECT e.id,e.start_time,e.status,e.updated_at,c.slug competition_slug,COALESCE(hn.name,h.slug) home_team_name,COALESCE(an.name,a.slug) away_team_name ${from} ORDER BY ${q.topic==='fixtures'?'datetime(e.start_time) ASC':"CASE WHEN datetime(e.start_time)<=datetime('now') THEN 0 ELSE 1 END, CASE WHEN datetime(e.start_time)<=datetime('now') THEN -julianday(e.start_time) ELSE julianday(e.start_time) END"},e.id LIMIT 40 OFFSET ?`).all(...args,(page-1)*40)
  return {data,meta:{total,page,pages:Math.ceil(total/40)}}
 })
 app.get('/contests/:key',async(req,reply)=>{const {key}=req.params as {key:string};if(key.length>150)return reply.code(400).send({error:'Invalid contest key'});const row=await db.prepare('SELECT * FROM individual_contests WHERE id=COALESCE((SELECT canonical_id FROM individual_aliases WHERE alias_id=?),?)').get(key,key);if(!row)return reply.code(404).send({error:'Contest not found'});const payload=JSON.parse(row.payload_json);const indexable=row.sport!=='tennis'||[payload.home,payload.away].every(n=>typeof n==='string'&&n.trim().length>0&&!/^wqf[0-9]/i.test(n));return {data:{...row,indexable,payload,payload_json:undefined}}})
}
