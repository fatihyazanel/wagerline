import {FastifyInstance} from 'fastify'
import {timingSafeEqual} from 'crypto'
export function registerGuards(app:FastifyInstance){
 app.addHook('onRequest',async(req,reply)=>{
  const pathname=req.url.split('?')[0]
  const protectedRoute=/^\/(test(?:\/|$)|api\/v1\/(admin(?:\/|$)|jobs(?:\/|$)|providers\/(sync|[^/]+\/test)$|live\/broadcast$))/.test(pathname)
  if(!protectedRoute)return
  if(pathname.startsWith('/test')&&process.env.NODE_ENV==='production')return reply.code(404).send({error:'Not found'})
  const expected=process.env.ADMIN_API_TOKEN||'',provided=(req.headers.authorization||'').replace(/^Bearer /,'')
  if(!expected||Buffer.byteLength(provided)!==Buffer.byteLength(expected)||!timingSafeEqual(Buffer.from(provided),Buffer.from(expected)))return reply.code(401).send({error:'Administrator sign-in required'})
 })
 app.addHook('preValidation',async(req,reply)=>{
  const q=req.query as Record<string,unknown>
  for(const [key,value]of Object.entries(req.params as Record<string,unknown>||{}))if(['id','event_id','eventId','team_id','player_id'].includes(key)&&(!/^\d+$/.test(String(value))||Number(value)<1||!Number.isSafeInteger(Number(value))))return reply.code(400).send({error:'Invalid '+key})
  for(const key of ['team_1','team_2','team_id','competition_id','season_id'])if(q[key]!==undefined&&(!/^\d+$/.test(String(q[key]))||Number(q[key])<1||!Number.isSafeInteger(Number(q[key]))))return reply.code(400).send({error:'Invalid '+key})
  for(const key of ['limit','page'])if(q[key]!==undefined&&(!/^\d+$/.test(String(q[key]))||Number(q[key])<1||Number(q[key])>10000))return reply.code(400).send({error:`${key} must be an integer from 1 to 10000`})
  if(q.confidence!==undefined&&q.confidence!==''&&(!/^\d+$/.test(String(q.confidence))||Number(q.confidence)>100))return reply.code(400).send({error:'Confidence must be an integer from 0 to 100'})
  if(q.date!==undefined&&q.date!==''&&(!/^\d{4}-\d{2}-\d{2}$/.test(String(q.date))||!Number.isFinite(Date.parse(String(q.date)))||new Date(String(q.date)).toISOString().slice(0,10)!==String(q.date)))return reply.code(400).send({error:'Invalid date'})
 })
}
