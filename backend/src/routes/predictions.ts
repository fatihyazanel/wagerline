import {accountFor} from '../services/personal-accounts'
import {createHash} from 'crypto'
import { FastifyInstance } from 'fastify'
import { db } from '../database/init'

// Missing model output stays null; never manufacture probabilities or scores.
const selection = `SELECT e.id AS event_id, e.start_time, e.status,
 e.home_team_id, e.away_team_id, COALESCE(hn.name,h.slug) AS home_team,
 COALESCE(an.name,a.slug) AS away_team, h.logo_url AS home_team_logo,
 a.logo_url AS away_team_logo, c.slug AS competition_slug, c.name_key AS competition_name,
 s.slug AS sport, p.id AS prediction_id, p.home_probability, p.draw_probability,
 p.away_probability, p.confidence, p.model_version, p.generated_at
 FROM events e JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id
 LEFT JOIN team_translations hn ON hn.team_id=h.id AND hn.language='en'
 LEFT JOIN team_translations an ON an.team_id=a.id AND an.language='en'
 JOIN competitions c ON c.id=e.competition_id JOIN sports s ON s.id=e.sport_id
 LEFT JOIN predictions p ON p.id=(SELECT id FROM predictions WHERE event_id=e.id ORDER BY generated_at DESC,id DESC LIMIT 1)`
function present(row: any) {
 const { prediction_id, home_probability, draw_probability, away_probability, confidence, model_version, generated_at, ...event } = row
 const probabilities = [home_probability, draw_probability, away_probability]
 const valid = prediction_id && probabilities.every(n => typeof n === 'number' && n >= 0 && n <= 1) && Math.abs(probabilities.reduce((a,b)=>a+b,0)-1)<0.01
 return { ...event, prediction: valid ? { home_win_probability:home_probability, draw_probability, away_win_probability:away_probability, confidence, model_version, generated_at } : null }
}
export async function predictionsRoutes(app: FastifyInstance) {
 app.get('/', async request => {
  const q = request.query as Record<string,string>
  const limit = Math.max(1,Math.min(200,Math.floor(Number(q.limit))||100))
  const page = Math.max(1,Math.min(10000,Math.floor(Number(q.page))||1))
  const conditions=["NOT EXISTS(SELECT 1 FROM event_aliases ea WHERE ea.alias_event_id=e.id)","e.status='scheduled'", "datetime(e.start_time)>=datetime('now')"]
  const params:unknown[]=[]
  if(q.competition_id){conditions.push('e.competition_id=?');params.push(q.competition_id)}
  if(q.sport){conditions.push('s.slug=?');params.push(q.sport)}
  if(q.date){conditions.push('date(e.start_time)=?');params.push(q.date)}
  if(q.confidence){conditions.push('p.confidence>=?');params.push(Number(q.confidence)/100)}
  if(q.ids!==undefined){const ids=q.ids.split(',').map(Number).filter(n=>Number.isInteger(n)&&n>0).slice(0,500);conditions.push(ids.length?`e.id IN (${ids.map(()=>'?').join(',')})`:'0=1');params.push(...ids)}
  if(q.ids!==undefined||q.mine==='1')conditions.splice(1,2)
  if(q.mine==='1'){const token=request.headers.cookie?.split(';').map(s=>s.trim()).find(s=>s.startsWith('wl_profile='))?.slice(11)||'';conditions.push('EXISTS(SELECT 1 FROM personal_picks pp WHERE pp.profile_id=? AND COALESCE((SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=pp.event_id),pp.event_id)=e.id)');const account=await accountFor(request);const raw=createHash('sha256').update(token).digest('hex');params.push(account?.profile_id||(await db.prepare('SELECT id FROM personal_accounts WHERE profile_id=?').get(raw)?'':raw))}
  const query=`${selection} WHERE ${conditions.join(' AND ')}`
  const totals=await db.prepare(`SELECT COUNT(*) AS total,SUM(CASE WHEN prediction_id IS NOT NULL THEN 1 ELSE 0 END) AS published FROM (${query})`).get(...params)
  const rows = await db.prepare(`${query} ORDER BY e.start_time,e.id LIMIT ? OFFSET ?`).all(...params,limit,(page-1)*limit)
  return { data:rows.map(present), meta:{count:rows.length,total:totals.total,published:totals.published||0,page,pages:Math.ceil(totals.total/limit),source:'database',model_available:(totals.published||0)>0,timestamp:new Date().toISOString()} }
 })
 app.get('/:event_id', async (request,reply) => {
  let { event_id } = request.params as {event_id:string}
  const alias=await db.prepare('SELECT canonical_event_id FROM event_aliases WHERE alias_event_id=?').get(event_id);if(alias)event_id=String(alias.canonical_event_id)
  const row = await db.prepare(`${selection} WHERE e.id=?`).get(event_id)
  if (!row) return reply.code(404).send({error:'Event not found'})
  const factors = row.prediction_id ? await db.prepare('SELECT factor,value,impact FROM prediction_factors WHERE prediction_id=?').all(row.prediction_id) : []
  return {data:{...present(row), factors}}
 })
}
