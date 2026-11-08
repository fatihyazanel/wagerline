import axios from 'axios'
import {db} from '../database/init'
const leagues:Record<string,string>={'premier-league':'eng.1','la-liga':'esp.1','serie-a':'ita.1',bundesliga:'ger.1','ligue-1':'fra.1','super-lig':'tur.1',eredivisie:'ned.1','uefa-champions-league':'uefa.champions','japanese-j1-league':'jpn.1','j1-league':'jpn.1','australia-a-league':'aus.1','a-league':'aus.1',nba:'nba',nfl:'nfl',nhl:'nhl',mlb:'mlb'}
const pending=new Map<number,Promise<any>>()
export function decimalOdds(n:unknown){const v=Number(n);return n!=null&&Number.isFinite(v)&&v!==0?Number((v>0?1+v/100:1+100/Math.abs(v)).toFixed(3)):null}
export function normalizeSummary(data:any,teams:Record<string,number>,startTime?:string){
 const statistics:any[]=[],timeline:any[]=[],lineups:any[]=[],performers:any[]=[],odds:any[]=[],h2h:any[]=[]
 for(const t of data.boxscore?.teams||[])if(teams[t.team?.id])for(const s of t.statistics||[])if(s.displayValue!=null)statistics.push({participant_id:teams[t.team.id],metric:s.label||s.name,value:String(s.displayValue),period:'Match'})
 for(const p of data.keyEvents||data.plays||[])timeline.push({type:p.type?.text||'Play',detail:p.text||p.shortText||'',elapsed:null,time:p.clock?.displayValue||'',period:p.period?.displayValue||String(p.period?.number||''),player:(p.participants||[]).map((v:any)=>v.athlete?.displayName).filter(Boolean).join(', ')})
 for(const t of data.rosters||[])if(teams[t.team?.id]){lineups.push({team_id:teams[t.team.id],formation:t.formation||'',lineup_json:JSON.stringify((t.roster||[]).filter((p:any)=>p.starter).map((p:any)=>({name:p.athlete?.displayName,number:p.jersey})))});for(const p of t.roster||[]){const metrics=(p.stats||[]).filter((s:any)=>s.displayValue!=null).map((s:any)=>({label:s.displayName||s.name,value:String(s.displayValue)}));if(metrics.length)performers.push({name:p.athlete?.displayName,team_id:teams[t.team.id],metrics})}}
 for(const t of data.boxscore?.players||[])if(teams[t.team?.id])for(const group of t.statistics||[]){const players=group.athletes||[];lineups.push({team_id:teams[t.team.id],formation:'',lineup_json:JSON.stringify(players.filter((p:any)=>p.starter).map((p:any)=>({name:p.athlete?.displayName,number:p.athlete?.jersey})))});for(const p of players)if(!p.didNotPlay&&p.stats?.length)performers.push({name:p.athlete?.displayName,team_id:teams[t.team.id],metrics:p.stats.map((value:string,i:number)=>({label:group.labels?.[i]||group.names?.[i]||String(i),value}))})}
 for(const o of [...(data.odds||[]),...(data.pickcenter||[])]){const home=decimalOdds(o.homeTeamOdds?.moneyLine),away=decimalOdds(o.awayTeamOdds?.moneyLine);if(home&&away&&o.provider?.name&&!odds.some(r=>r.bookmaker===o.provider.name))odds.push({bookmaker:o.provider.name,home_odds:home,away_odds:away,draw_odds:decimalOdds(o.drawOdds?.moneyLine),source:'ESPN',timestamp:new Date().toISOString()})}
 const cutoff=Date.parse(startTime||data.header?.competitions?.[0]?.date||'')
 for(const series of data.seasonseries||[])for(const e of series.events||[]){
 const home=e.competitors?.find((c:any)=>c.homeAway==='home'),away=e.competitors?.find((c:any)=>c.homeAway==='away')
 if(!e.statusType?.completed||!(Date.parse(e.date)<cutoff)||!teams[home?.team?.id]||!teams[away?.team?.id]||home.team.id===away.team.id||!/^\d+$/.test(String(home.score))||!/^\d+$/.test(String(away.score))||h2h.some(r=>r.id===`espn:${e.id}`))continue
 h2h.push({id:`espn:${e.id}`,start_time:e.date,status:'finished',home_team_id:teams[home.team.id],away_team_id:teams[away.team.id],home_team_name:home.team.displayName,away_team_name:away.team.displayName,home_score:Number(home.score),away_score:Number(away.score),source:'ESPN'})
 }
 h2h.sort((a,b)=>Date.parse(b.start_time)-Date.parse(a.start_time))
 return {version:2,h2h,statistics,timeline,lineups:lineups.filter(r=>JSON.parse(r.lineup_json).length),performers,odds,source:'ESPN',venue:data.gameInfo?.venue?.fullName}
}
export async function ensureEspnDetails(eventId:number):Promise<any>{
 if(pending.has(eventId))return pending.get(eventId)
 const work=(async()=>{
 await db.prepare('CREATE TABLE IF NOT EXISTS espn_match_details(event_id INTEGER PRIMARY KEY,payload_json TEXT NOT NULL,fetched_at TEXT NOT NULL)').run()
 const record=await db.prepare("SELECT p.external_id,e.home_team_id,e.away_team_id,e.status,e.start_time,c.slug FROM provider_event_records p JOIN events e ON e.id=p.event_id JOIN competitions c ON c.id=e.competition_id WHERE p.provider='espn' AND p.event_id=?").get(eventId)
 if(!record)return null
 const [sport,id]=record.external_id.split(':');const league=leagues[record.slug];if(!league||!['soccer','basketball','football','hockey','baseball'].includes(sport)||!/^\d+$/.test(id))return null
 const cached=await db.prepare('SELECT * FROM espn_match_details WHERE event_id=?').get(eventId)
 const ttl=['live','halftime','period_break'].includes(record.status)?30000:3600000
 if(cached&&JSON.parse(cached.payload_json).version===2&&Date.now()-Date.parse(cached.fetched_at)<ttl)return {...JSON.parse(cached.payload_json),fetched_at:cached.fetched_at}
 try{
 const {data}=await axios.get(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/summary`,{params:{event:id},timeout:7000})
 const competition=data.header?.competitions?.[0];if(String(data.header?.id)!==id||String(competition?.id)!==id)throw Error('ESPN event identity mismatch')
 const teams:Record<string,number>={}
 for(const role of ['home','away']){const remote=competition.competitors?.find((c:any)=>c.homeAway===role)?.team?.id;const mapped=await db.prepare("SELECT team_id FROM provider_team_ids WHERE provider='espn' AND external_id=?").get(`${sport}:${remote}`);if(!mapped||mapped.team_id!==record[`${role}_team_id`])throw Error('ESPN team identity mismatch');teams[String(remote)]=mapped.team_id}
 const result=normalizeSummary(data,teams,record.start_time),fetched_at=new Date().toISOString()
 await db.prepare('INSERT INTO espn_match_details(event_id,payload_json,fetched_at) VALUES(?,?,?) ON CONFLICT(event_id) DO UPDATE SET payload_json=excluded.payload_json,fetched_at=excluded.fetched_at').run(eventId,JSON.stringify(result),fetched_at)
 return {...result,fetched_at}
 }catch{return cached?{...JSON.parse(cached.payload_json),fetched_at:cached.fetched_at,stale:true}:{failed:true}}
 })();pending.set(eventId,work);try{return await work}finally{pending.delete(eventId)}
}
export async function refreshEspnDetails(){
 const rows=await db.prepare("SELECT DISTINCT e.id FROM events e JOIN provider_event_records p ON p.event_id=e.id AND p.provider='espn' WHERE datetime(e.start_time) BETWEEN datetime('now','-1 day') AND datetime('now','+1 day') ORDER BY CASE WHEN e.status='live' THEN 0 ELSE 1 END,e.start_time DESC LIMIT 80").all()
 let updated=0;for(const row of rows){const result=await ensureEspnDetails(row.id);if(result?.failed||result?.stale)throw Error('ESPN match summary refresh failed');if(result)updated++}return updated
}
