import {reserveSportdb} from './provider-slot'
import axios from 'axios'
import {db} from '../database/init'
import {config} from '../config'
const pending=new Map<number,Promise<void>>()
let nextAllowed=0
export async function persistProviderDetails(eventId:number,statistics:any[],timeline:any[]){
 for(const stat of statistics){
  const old=await db.prepare("SELECT id FROM event_statistics WHERE event_id=? AND participant_id=? AND metric=? AND period='Match' AND source='sportdb'").get(eventId,stat.participant_id,stat.metric)
  if(old)await db.prepare('UPDATE event_statistics SET value=? WHERE id=?').run(stat.value,old.id)
  else await db.prepare("INSERT INTO event_statistics(event_id,participant_id,metric,value,period,source) VALUES(?,?,?,?,'Match','sportdb')").run(eventId,stat.participant_id,stat.metric,stat.value)
 }
 for(const incident of timeline)await db.prepare("INSERT INTO event_incidents(event_id,type,detail,elapsed,comments) SELECT ?,?,?,?,'sportdb' WHERE NOT EXISTS(SELECT 1 FROM event_incidents WHERE event_id=? AND type=? AND detail=? AND elapsed=? AND comments='sportdb')").run(eventId,incident.type,incident.detail,incident.elapsed,eventId,incident.type,incident.detail,incident.elapsed)
}
export async function ensureSportdbDetails(eventId:number){
 if(!config.providers.sportdb.enabled)return
 if(pending.has(eventId))return pending.get(eventId)
 const work=(async()=>{
  const record=await db.prepare("SELECT external_id,payload_json FROM provider_event_records WHERE provider='sportdb' AND event_id=?").get(eventId)
  if(!record||!/^[a-zA-Z0-9]+$/.test(record.external_id))return
  const state=await db.prepare('SELECT status FROM events WHERE id=?').get(eventId)
  const ttl=['live','halftime','1h','2h','period_break'].includes(state?.status)?20000:3600000
  const cached=await db.prepare('SELECT fetched_at FROM provider_match_details WHERE event_id=?').get(eventId)
  if(cached&&Date.now()-Date.parse(cached.fetched_at+'Z')<ttl)return
  // Keep interactive requests within the provider's per-minute allowance.
  if(Date.now()<nextAllowed)return
  nextAllowed=Date.now()+20000
  const raw=JSON.parse(record.payload_json)
  const parts:Record<string,any>={}
  for(const kind of ['stats','details','odds']){
   try{await reserveSportdb();const {data}=await axios.get(`${config.providers.sportdb.baseUrl}/flashscore/match/${record.external_id}/${kind}`,{headers:{'X-API-Key':config.providers.sportdb.apiKey},timeout:8000})
   parts[kind]=data
   const available=Array.isArray(data)?data.length>0:!!data;await db.prepare("INSERT INTO provider_detail_checks(event_id,resource,status) VALUES(?,?,?) ON CONFLICT(event_id,resource) DO UPDATE SET status=excluded.status,http_status=200,checked_at=CURRENT_TIMESTAMP").run(eventId,kind,available?'available':'not-published')
   }catch(e){const code=axios.isAxiosError(e)?e.response?.status:null;await db.prepare("INSERT INTO provider_detail_checks(event_id,resource,status,http_status) VALUES(?,?,?,?) ON CONFLICT(event_id,resource) DO UPDATE SET status=excluded.status,http_status=excluded.http_status,checked_at=CURRENT_TIMESTAMP").run(eventId,kind,code===402?'subscription-required':code===401||code===403?'access-denied':code===404?'not-supported':'failed',code||null);if([401,402,403,429].includes(code||0)){nextAllowed=Date.now()+300000;break}}
  }
  if(!parts.details)return
  if(parts.details.homeId!==raw.homeParticipantIds||parts.details.awayId!==raw.awayParticipantIds)throw Error('Match provider identities do not agree')
  const event=await db.prepare('SELECT home_team_id,away_team_id FROM events WHERE id=?').get(eventId)
  const statistics:any[]=[]
  const used=new Set<string>()
  for(const period of Array.isArray(parts.stats)?parts.stats:[])for(const st of period.stats||[]){if(period.period!=='Match'||used.has(st.statId))continue;used.add(st.statId);for(const [id,value]of [[event.home_team_id,st.homeValue],[event.away_team_id,st.awayValue]])if(value!=null)statistics.push({participant_id:id,metric:st.statName,value:String(value),period:'Match'})}
  const timeline=(parts.details.events||[]).map((i:any)=>({type:Array.isArray(i.incidentTypeName)?i.incidentTypeName.join(' / '):i.incidentTypeName,detail:Array.isArray(i.incidentPlayerName)?i.incidentPlayerName.join(' / '):i.incidentPlayerName,elapsed:parseInt(i.incidentTime)||0,time:i.incidentTime,player:''}))
  await persistProviderDetails(eventId,statistics,timeline)
  const odds=(Array.isArray(parts.odds)?parts.odds:[]).find((o:any)=>o.bettingScope==='FULL_TIME'&&o.bettingType==='HOME_DRAW_AWAY'&&o.odds?.length===3)
  if(odds){const home=odds.odds.find((o:any)=>o.eventParticipantId===raw.homeEventParticipantId),away=odds.odds.find((o:any)=>o.eventParticipantId===raw.awayEventParticipantId),draw=odds.odds.find((o:any)=>o.eventParticipantId===null);if([home,away,draw].every(o=>o&&Number(o.value)>1))await db.prepare("INSERT INTO betting_odds(event_id,bookmaker,home_odds,draw_odds,away_odds,timestamp,source) VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,'sportdb') ON CONFLICT(event_id) DO UPDATE SET bookmaker=excluded.bookmaker,home_odds=excluded.home_odds,draw_odds=excluded.draw_odds,away_odds=excluded.away_odds,timestamp=CURRENT_TIMESTAMP,source='sportdb'").run(eventId,odds.bookmakerName,Number(home.value),Number(draw.value),Number(away.value))}
  await db.prepare("INSERT INTO provider_match_details(event_id,payload_json) VALUES(?,?) ON CONFLICT(event_id) DO UPDATE SET payload_json=excluded.payload_json,fetched_at=CURRENT_TIMESTAMP").run(eventId,JSON.stringify({statistics,timeline,venue:parts.details.venue,attendance:parts.details.attendance,source:'SportDB / Flashscore'}))
 })()
 pending.set(eventId,work)
 try{await work}finally{pending.delete(eventId)}
}
