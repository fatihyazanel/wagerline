import axios from 'axios'
import {db} from '../database/init'
export const officialRefreshStatus={running:false,last_attempt:null as string|null,last_success:null as string|null,updated:0,errors:[] as string[],interval_seconds:60}
export async function refreshOfficial(){
 if(officialRefreshStatus.running)return
 Object.assign(officialRefreshStatus,{running:true,last_attempt:new Date().toISOString(),updated:0,errors:[]})
 async function save(provider:string,id:number,start:string,status:string,home:number,away:number,hs:unknown,as:unknown,homeName?:string,awayName?:string,seasonName?:string){
  let e=await db.prepare(`SELECT e.id,e.home_team_id,e.away_team_id FROM events e JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id WHERE e.external_id=? AND h.external_id=? AND a.external_id=?`).get(`${provider}-${id}`,String(home),String(away))
  if(!Number.isFinite(Date.parse(start)))return
  if(status==='finished'&&(!Number.isInteger(hs)||!Number.isInteger(as)))return
  if(!e){const c=await db.prepare('SELECT id,sport_id FROM competitions WHERE slug=?').get(provider);if(!c)return;const h=await db.prepare('SELECT id FROM teams WHERE sport_id=? AND external_id=? AND active=1').get(c.sport_id,String(home)),a=await db.prepare('SELECT id FROM teams WHERE sport_id=? AND external_id=? AND active=1').get(c.sport_id,String(away));if(!h||!a)return
   let season=seasonName?await db.prepare('SELECT id FROM seasons WHERE competition_id=? AND name=?').get(c.id,seasonName):await db.prepare('SELECT id FROM seasons WHERE competition_id=? AND is_current=1 ORDER BY id DESC LIMIT 1').get(c.id)
   if(!season&&seasonName)season={id:(await db.prepare('INSERT INTO seasons(competition_id,name,is_current) VALUES(?,?,1)').run(c.id,seasonName)).lastID}
   if(!season)return
   e={id:(await db.prepare("INSERT INTO events(sport_id,competition_id,season_id,external_id,event_type,start_time,status,home_team_id,away_team_id) VALUES(?,?,?,?,'match',?,?,?,?)").run(c.sport_id,c.id,season.id,provider+'-'+id,start,status,h.id,a.id)).lastID,home_team_id:h.id,away_team_id:a.id}
   for(const [team,role]of [[h.id,'home'],[a.id,'away']])await db.prepare("INSERT INTO event_participants(event_id,participant_type,participant_id,role) VALUES(?,'team',?,?)").run(e.id,team,role)
  }
  if(status==='finished'&&(!Number.isInteger(hs)||!Number.isInteger(as)))return
  for(const [team,score] of [[e.home_team_id,hs],[e.away_team_id,as]])if(Number.isInteger(score)&&Number(score)>=0){const existing=await db.prepare('SELECT id FROM event_scores WHERE event_id=? AND participant_id=? ORDER BY id DESC LIMIT 1').get(e.id,team);if(existing)await db.prepare('UPDATE event_scores SET score=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(score,existing.id);else await db.prepare('INSERT INTO event_scores(event_id,participant_id,score,period) VALUES(?,?,?,0)').run(e.id,team,score)}
  await db.prepare('UPDATE events SET status=?,start_time=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status,start,e.id);officialRefreshStatus.updated++
 }
 try{
  for(const provider of ['nhl','mlb'])try{
   if(provider==='nhl'){
    const {data}=await axios.get('https://api-web.nhle.com/v1/schedule/now',{timeout:15000});if(!Array.isArray(data.gameWeek))throw Error('Invalid NHL payload')
    for(const day of data.gameWeek)for(const g of day.games){const state=g.gameScheduleState==='PPD'?'postponed':g.gameScheduleState==='CNCL'?'cancelled':['OFF','FINAL'].includes(g.gameState)?'finished':['LIVE','CRIT'].includes(g.gameState)?'live':['FUT','PRE'].includes(g.gameState)?'scheduled':null;if(state)await save('nhl',g.id,g.startTimeUTC,state,g.homeTeam.id,g.awayTeam.id,g.homeTeam.score,g.awayTeam.score,undefined,undefined,g.season?String(g.season).slice(0,4)+'-'+String(g.season).slice(4):undefined)}
   }else{
    const date=new Date().toISOString().slice(0,10);const {data}=await axios.get(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}`,{timeout:15000});if(!Array.isArray(data.dates))throw Error('Invalid MLB payload')
    for(const day of data.dates)for(const g of day.games){const state=/cancel/i.test(g.status.detailedState||'')?'cancelled':/postpon/i.test(g.status.detailedState||'')?'postponed':g.status.abstractGameState==='Final'?'finished':g.status.abstractGameState==='Live'?'live':g.status.abstractGameState==='Preview'?'scheduled':null;if(state)await save('mlb',g.gamePk,g.gameDate,state,g.teams.home.team.id,g.teams.away.team.id,g.teams.home.score,g.teams.away.score,g.teams.home.team.name,g.teams.away.team.name,g.season?String(g.season):undefined)}
   }
  }catch(e){officialRefreshStatus.errors.push(`${provider}: ${e instanceof Error?e.message:'Request failed'}`)}
  if(!officialRefreshStatus.errors.length)officialRefreshStatus.last_success=new Date().toISOString()
  await db.prepare("INSERT INTO sync_logs(provider,resource,status,request_count) VALUES('official-sports','live-schedule',?,2)").run(officialRefreshStatus.errors.length?'partial':'success')
 }finally{officialRefreshStatus.running=false}
}
