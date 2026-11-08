import {db} from '../database/init'
export async function initPlayerSnapshots(){await db.prepare('CREATE TABLE IF NOT EXISTS provider_player_snapshots(player_id INTEGER,provider TEXT,competition_key TEXT,season_name TEXT,season_year INTEGER,payload_json TEXT,fetched_at TEXT DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(player_id,provider,competition_key,season_year))').run()}
export function suppliedPlayerStats(a:any){return (a.statistics?.splits?.categories||[]).flatMap((c:any)=>(c.stats||[]).filter((s:any)=>typeof s.name==='string'&&typeof s.value==='number'&&Number.isFinite(s.value)).map((s:any)=>({name:s.name,label:s.displayName||s.name,value:s.value,display:s.displayValue??String(s.value)})))}
export async function persistEspnPlayer(playerId:number,teamId:number,sport:string,league:string,season:any,a:any){
 const birth=typeof a.dateOfBirth==='string'&&Number.isFinite(Date.parse(a.dateOfBirth))?a.dateOfBirth.slice(0,10):null
 const nationality=typeof a.citizenship==='string'?a.citizenship:null
 await db.prepare('INSERT INTO player_extended_info(player_id,date_of_birth,nationality) VALUES(?,?,?) ON CONFLICT(player_id) DO UPDATE SET date_of_birth=COALESCE(excluded.date_of_birth,player_extended_info.date_of_birth),nationality=COALESCE(excluded.nationality,player_extended_info.nationality),updated_at=CURRENT_TIMESTAMP').run(playerId,birth,nationality)
 if(!Number.isInteger(season?.year))return
 const stats=suppliedPlayerStats(a)
 await db.prepare("INSERT INTO provider_player_snapshots(player_id,provider,competition_key,season_name,season_year,payload_json) VALUES(?,'espn',?,?,?,?) ON CONFLICT(player_id,provider,competition_key,season_year) DO UPDATE SET season_name=excluded.season_name,payload_json=excluded.payload_json,fetched_at=CURRENT_TIMESTAMP").run(playerId,`${sport}/${league}`,season.displayName||String(season.year),season.year,JSON.stringify({athlete_id:String(a.id),name:a.fullName,stats}))
 if(sport!=='soccer'||!stats.length)return
 const slugs:Record<string,string>={'eng.1':'premier-league','esp.1':'la-liga','ita.1':'serie-a','ger.1':'bundesliga','fra.1':'ligue-1','tur.1':'super-lig','ned.1':'eredivisie','uefa.champions':'uefa-champions-league'}
 const c=await db.prepare('SELECT id FROM competitions WHERE slug=?').get(slugs[league]);if(!c)return
 const seasons=await db.prepare('SELECT id,name FROM seasons WHERE competition_id=? AND substr(name,1,4)=?').all(c.id,String(season.year));if(seasons.length!==1)return
 const value=(name:string)=>{const n=stats.find((s:any)=>s.name===name)?.value;return Number.isInteger(n)&&n>=0?n:null}
 await db.prepare('INSERT INTO player_season_stats(player_id,team_id,season_id,competition_id,appearances,goals,assists,yellow_cards,red_cards,minutes_played) VALUES(?,?,?,?,?,?,?,?,?,?) ON CONFLICT(player_id,team_id,season_id,competition_id) DO UPDATE SET appearances=excluded.appearances,goals=excluded.goals,assists=excluded.assists,yellow_cards=excluded.yellow_cards,red_cards=excluded.red_cards,minutes_played=excluded.minutes_played,updated_at=CURRENT_TIMESTAMP').run(playerId,teamId,seasons[0].id,c.id,value('appearances'),value('totalGoals'),value('goalAssists'),value('yellowCards'),value('redCards'),value('minutesPlayed'))
}
