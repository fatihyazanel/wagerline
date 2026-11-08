import {config} from '../config'
import {db} from '../database/init'
const leagues:Record<string,string>={'premier-league':'4328','la-liga':'4335','serie-a':'4332',bundesliga:'4331','ligue-1':'4334','super-lig':'4339',eredivisie:'4337'}
const normal=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')
const catalogs=new Map<string,{at:number;events:any[]}>(),pending=new Map<number,Promise<any>>()
let nextRequestAt=0,blockedUntil=0
async function request(path:string){
 if(Date.now()<blockedUntil)throw Error('TheSportsDB rate limit cooldown')
 const slot=Math.max(Date.now(),nextRequestAt);nextRequestAt=slot+2500
 await new Promise(resolve=>setTimeout(resolve,Math.max(0,slot-Date.now())))
 if(Date.now()<blockedUntil)throw Error('TheSportsDB rate limit cooldown')
 const r=await fetch(`${config.providers.thesportsdb.baseUrl}/${config.providers.thesportsdb.apiKey}/${path}`,{signal:AbortSignal.timeout(8000)})
 if(r.status===429){const retry=Number(r.headers.get('retry-after'));blockedUntil=Date.now()+Math.max(120,Number.isFinite(retry)?retry:0)*1000}
 if(!r.ok)throw Error(`TheSportsDB HTTP ${r.status}`)
 return r.json() as Promise<any>
}
export function parseTheSportsDbDetails(event:any,home:number,away:number,parts:any){
 const statistics:any[]=[],timeline:any[]=[],lineups:any[]=[]
 for(const row of parts.stats?.eventstats||[])if(String(row.idEvent)===String(event.idEvent))for(const [participant_id,value]of [[home,row.intHome],[away,row.intAway]])if(value!=null&&String(value).trim()!==''&&/^[-\d.%]+$/.test(String(value)))statistics.push({participant_id,metric:row.strStat,value:String(value),period:'Match'})
 for(const row of parts.timeline?.timeline||[])if(String(row.idEvent)===String(event.idEvent))timeline.push({type:row.strTimeline,detail:row.strTimelineDetail||'',player:row.strPlayer||'',time:row.intTime?`${row.intTime}'`:'',elapsed:row.intTime?parseInt(row.intTime):null,period:row.strPeriod||''})
 for(const [side,id]of [['Yes',home],['No',away]]){const players=(parts.lineups?.lineup||[]).filter((r:any)=>String(r.idEvent)===String(event.idEvent)&&r.strHome===side&&r.strSubstitute==='No'&&r.strPlayer).map((r:any)=>({name:r.strPlayer,number:r.intSquadNumber,position:r.strPosition}));if(players.length)lineups.push({team_id:id,formation:'',lineup_json:JSON.stringify(players)})}
 return {statistics,timeline,lineups,source:'TheSportsDB',venue:event.strVenue||null}
}
export async function ensureTheSportsDbDetails(id:number):Promise<any>{
 if(pending.has(id))return pending.get(id)
 const work=(async()=>{
 await db.prepare('CREATE TABLE IF NOT EXISTS thesportsdb_match_details(event_id INTEGER PRIMARY KEY,payload_json TEXT NOT NULL,fetched_at TEXT NOT NULL)').run()
 const e=await db.prepare('SELECT e.*,c.slug competition FROM events e JOIN competitions c ON c.id=e.competition_id WHERE e.id=?').get(id);if(!e||!leagues[e.competition])return null
 const cache=await db.prepare('SELECT * FROM thesportsdb_match_details WHERE event_id=?').get(id)
 if(cache&&Date.now()-Date.parse(cache.fetched_at)<(e.status==='finished'?3600000:120000))return {...JSON.parse(cache.payload_json),fetched_at:cache.fetched_at}
 try{
 let mapped=await db.prepare("SELECT payload_json FROM provider_event_records WHERE provider='thesportsdb' AND event_id=?").get(id),event:any
 if(mapped)event=JSON.parse(mapped.payload_json)
 else{
 const league=leagues[e.competition];let catalog=catalogs.get(league)
 if(!catalog||Date.now()-catalog.at>300000){const past=await request(`eventspastleague.php?id=${league}`),next=await request(`eventsnextleague.php?id=${league}`);catalog={at:Date.now(),events:[...(past.events||[]),...(next.events||[])]};catalogs.set(league,catalog)}
 const names=async(team:number)=>(await db.prepare("SELECT name value FROM team_translations WHERE team_id=? UNION SELECT alias value FROM team_aliases WHERE team_id=? UNION SELECT slug value FROM teams WHERE id=?").all(team,team,team)).map(r=>normal(r.value))
 const home=await names(e.home_team_id),away=await names(e.away_team_id)
 const matches=catalog.events.filter(r=>r.dateEvent===e.start_time.slice(0,10)&&home.includes(normal(r.strHomeTeam||''))&&away.includes(normal(r.strAwayTeam||'')))
 const unique=[...new Map(matches.map(r=>[r.idEvent,r])).values()];if(unique.length!==1)return null;event=unique[0]
 await db.prepare("INSERT INTO provider_event_records(provider,external_id,event_id,payload_json) VALUES('thesportsdb',?,?,?) ON CONFLICT(provider,external_id) DO UPDATE SET event_id=excluded.event_id,payload_json=excluded.payload_json,updated_at=CURRENT_TIMESTAMP").run(String(event.idEvent),id,JSON.stringify(event))
 }
 if(!/^\d+$/.test(String(event.idEvent)))return null
 const parts:any={},checks:any[]=[]
 for(const [key,path]of [['stats','lookupeventstats'],['timeline','lookuptimeline'],['lineups','lookuplineup']])try{parts[key]=await request(`${path}.php?id=${event.idEvent}`);checks.push({resource:`thesportsdb-${key}`,status:'checked'})}catch{checks.push({resource:`thesportsdb-${key}`,status:'failed'})}
 if(checks.every(c=>c.status==='failed'))throw Error('TheSportsDB detail requests failed')
 const data={...parseTheSportsDbDetails(event,e.home_team_id,e.away_team_id,parts),checks},fetched_at=new Date().toISOString()
 await db.prepare('INSERT INTO thesportsdb_match_details VALUES(?,?,?) ON CONFLICT(event_id) DO UPDATE SET payload_json=excluded.payload_json,fetched_at=excluded.fetched_at').run(id,JSON.stringify(data),fetched_at)
 return {...data,fetched_at}
 }catch{return cache?{...JSON.parse(cache.payload_json),fetched_at:cache.fetched_at,stale:true}:{failed:true}}
 })();pending.set(id,work);try{return await work}finally{pending.delete(id)}
}
export async function refreshTheSportsDbDetails(){const rows=await db.prepare("SELECT e.id FROM events e JOIN competitions c ON c.id=e.competition_id WHERE c.slug IN (SELECT value FROM json_each(?)) AND datetime(e.start_time) BETWEEN datetime('now','-1 day') AND datetime('now','+1 day') ORDER BY e.start_time DESC LIMIT 30").all(JSON.stringify(Object.keys(leagues)));let count=0,failed=0;for(const row of rows){const r=await ensureTheSportsDbDetails(row.id);if(r?.fetched_at&&!r.stale)count++;if(r?.failed||r?.stale)failed++;if(Date.now()<blockedUntil)break}if(failed)throw Error(`TheSportsDB details: ${failed} failed, ${count} refreshed`);return count}
