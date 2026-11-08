import axios from 'axios'
import {db} from '../database/init'
const leagues=[['basketball','nba','basketball','nba'],['football','nfl','american-football','nfl'],['hockey','nhl','ice-hockey','nhl'],['baseball','mlb','baseball','mlb'],...Object.entries({'eng.1':'premier-league','esp.1':'la-liga','ita.1':'serie-a','ger.1':'bundesliga','fra.1':'ligue-1','tur.1':'super-lig','ned.1':'eredivisie','uefa.champions':'uefa-champions-league','jpn.1':'j1-league','aus.1':'a-league'}).map(([remote,local])=>['soccer',remote,'football',local])]
const normal=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'')
export const espnRefreshStatus={running:false,last_attempt:null as string|null,last_success:null as string|null,received:0,updated:0,skipped:0,errors:[] as string[],interval_seconds:120}
export function espnState(type:any){if(/cancel|abandon/i.test(type?.name||''))return 'cancelled';if(/postpon|delay|suspend/i.test(type?.name||''))return 'postponed';if(type?.completed===true)return 'finished';if(type?.state==='in')return 'live';if(type?.state==='pre')return 'scheduled';return null}
async function resolveTeam(sportId:number,remoteSport:string,t:any){
 const known=await db.prepare("SELECT t.id FROM provider_team_ids p JOIN teams t ON t.id=p.team_id WHERE p.provider='espn' AND p.external_id=? AND t.sport_id=?").get(`${remoteSport}:${t.id}`,sportId);if(known)return known.id
 const names=[t.displayName,t.shortDisplayName,t.name,t.slug].filter(Boolean).map(normal)
 const rows=await db.prepare("SELECT DISTINCT t.id,t.slug,n.name,a.alias FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' LEFT JOIN team_aliases a ON a.team_id=t.id WHERE t.sport_id=? AND t.active=1 AND NOT EXISTS(SELECT 1 FROM canonical_team_aliases c WHERE c.alias_team_id=t.id)").all(sportId)
 const ids=[...new Set(rows.filter(r=>[r.slug,r.name,r.alias].filter(Boolean).some(n=>names.includes(normal(n)))).map(r=>r.id))];if(ids.length!==1)return null
 await db.prepare("INSERT OR IGNORE INTO provider_team_ids(provider,external_id,team_id) VALUES('espn',?,?)").run(`${remoteSport}:${t.id}`,ids[0]);return ids[0]
}
export async function importEspnEvent(remoteSport:string,localSport:string,localLeague:string,event:any){
 const competition=event.competitions?.[0],state=espnState(competition?.status?.type||event.status?.type),start=competition?.date||event.date
 const home=competition?.competitors?.find((c:any)=>c.homeAway==='home'),away=competition?.competitors?.find((c:any)=>c.homeAway==='away')
 if(!state||!Number.isFinite(Date.parse(start))||!home?.team?.id||!away?.team?.id||!/^\d+$/.test(String(event.id)))return false
 const score=(v:unknown)=>/^\d+$/.test(String(v))?Number(v):null,hs=score(home.score),as=score(away.score)
 if(['live','finished'].includes(state)&&(hs===null||as===null))return false
 const sport=await db.prepare('SELECT id FROM sports WHERE slug=?').get(localSport);if(!sport)return false
 const h=await resolveTeam(sport.id,remoteSport,home.team),a=await resolveTeam(sport.id,remoteSport,away.team);if(!h||!a||h===a)return false
 const key=`${remoteSport}:${event.id}`;let e=await db.prepare("SELECT e.* FROM provider_event_records p JOIN events e ON e.id=p.event_id WHERE p.provider='espn' AND p.external_id=?").get(key)
 if(!e){const candidates=await db.prepare("SELECT e.* FROM events e WHERE sport_id=? AND home_team_id=? AND away_team_id=? AND ABS(julianday(start_time)-julianday(?))<0.125 AND NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id)").all(sport.id,h,a,start);if(candidates.length>1)return false;e=candidates[0]}
 if(e&&(e.home_team_id!==h||e.away_team_id!==a))return false
 // Do not let a delayed pre-game feed erase an observed live/final state.
 if(e&&((state==='scheduled'&&['live','halftime','finished'].includes(e.status))||(state==='live'&&e.status==='finished')))return false
 if(!e){const c=await db.prepare('SELECT id FROM competitions WHERE slug=? AND sport_id=? AND active=1').get(localLeague,sport.id);if(!c)return false;const season=await db.prepare('SELECT id FROM seasons WHERE competition_id=? AND is_current=1 ORDER BY id DESC LIMIT 1').get(c.id);e={id:(await db.prepare("INSERT INTO events(sport_id,competition_id,season_id,external_id,event_type,start_time,status,home_team_id,away_team_id) VALUES(?,?,?,?,'match',?,'scheduled',?,?)").run(sport.id,c.id,season?.id||null,`espn:${key}`,new Date(start).toISOString(),h,a)).lastID}}
 for(const [id,role,value]of [[h,'home',hs],[a,'away',as]]){await db.prepare("INSERT INTO event_participants(event_id,participant_type,participant_id,role) SELECT ?,'team',?,? WHERE NOT EXISTS(SELECT 1 FROM event_participants WHERE event_id=? AND participant_id=? AND role=?)").run(e.id,id,role,e.id,id,role);if(['live','finished'].includes(state)&&value!==null)await db.prepare('INSERT INTO event_scores(event_id,participant_id,score,period) VALUES(?,?,?,0) ON CONFLICT(event_id,participant_id) DO UPDATE SET score=excluded.score,updated_at=CURRENT_TIMESTAMP').run(e.id,id,value)}
 await db.prepare("INSERT INTO provider_event_records(provider,external_id,event_id,payload_json) VALUES('espn',?,?,?) ON CONFLICT(provider,external_id) DO UPDATE SET event_id=excluded.event_id,payload_json=excluded.payload_json,updated_at=CURRENT_TIMESTAMP").run(key,e.id,JSON.stringify(event))
 await db.prepare('UPDATE events SET status=?,start_time=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(state,new Date(start).toISOString(),e.id)
 return true
}
export async function refreshEspn(){if(espnRefreshStatus.running)return;Object.assign(espnRefreshStatus,{running:true,last_attempt:new Date().toISOString(),received:0,updated:0,skipped:0,errors:[]});try{
 const date=(offset:number)=>new Date(Date.now()+offset*86400000).toISOString().slice(0,10).replace(/-/g,'')
 for(const [remoteSport,remoteLeague,localSport,localLeague]of leagues)for(const offset of [-1,0,1]){try{
 const {data}=await axios.get(`https://site.api.espn.com/apis/site/v2/sports/${remoteSport}/${remoteLeague}/scoreboard`,{params:{dates:date(offset),limit:1000},timeout:12000});if(!Array.isArray(data.events))throw Error('Invalid scoreboard schema')
 espnRefreshStatus.received+=data.events.length;for(const e of data.events){if(await importEspnEvent(remoteSport,localSport,localLeague,e))espnRefreshStatus.updated++;else espnRefreshStatus.skipped++}
 }catch(e){espnRefreshStatus.errors.push(`${remoteSport}/${remoteLeague}: ${axios.isAxiosError(e)?e.response?.status||e.code||'network':'invalid-data'}`)}}
 if(!espnRefreshStatus.errors.length)espnRefreshStatus.last_success=new Date().toISOString()
 await db.prepare("INSERT INTO sync_logs(provider,resource,status,request_count) VALUES('espn','scoreboards',?,?)").run(espnRefreshStatus.errors.length?'partial':espnRefreshStatus.skipped?'partial':'success',leagues.length*3)
 }finally{espnRefreshStatus.running=false}}
