const sqlite3=require('sqlite3'),axios=require('axios'),path=require('path'),fs=require('fs');
const db=new sqlite3.Database(path.join(__dirname,'../data/wagerline.db'));db.configure('busyTimeout',10000);
const all=(sql,p=[])=>new Promise((a,b)=>db.all(sql,p,(e,r)=>e?b(e):a(r)));
const run=(sql,p=[])=>new Promise((a,b)=>db.run(sql,p,function(e){e?b(e):a(this.changes)}));
const get=async(sql,p=[])=>(await all(sql,p))[0];
const report={updated:[],unmapped:[],errors:[]};
async function update(provider,id,date,state,home,away,hs,as){
 const e=await get(`SELECT e.id,e.home_team_id,e.away_team_id,h.external_id AS home_external,a.external_id AS away_external FROM events e JOIN teams h ON h.id=e.home_team_id JOIN teams a ON a.id=e.away_team_id WHERE e.external_id=?`,[`${provider}-${id}`]);
 if(!e||String(e.home_external)!==String(home)||String(e.away_external)!==String(away)){report.unmapped.push({provider,id});return}
 if(state!=='finished'||!Number.isInteger(hs)||!Number.isInteger(as)||hs<0||as<0)return;
 await run('BEGIN IMMEDIATE');try{
  await run("UPDATE events SET status='finished',start_time=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",[date,e.id]);
  for(const [team,score]of[[e.home_team_id,hs],[e.away_team_id,as]]){const row=await get('SELECT id FROM event_scores WHERE event_id=? AND participant_id=? ORDER BY id DESC LIMIT 1',[e.id,team]);if(row)await run('UPDATE event_scores SET score=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[score,row.id]);else await run('INSERT INTO event_scores(event_id,participant_id,score,period) VALUES(?,?,?,0)',[e.id,team,score])}
  await run('COMMIT');report.updated.push({provider,id,event_id:e.id,date,home:hs,away:as});
 }catch(e){await run('ROLLBACK');throw e}
}
async function main(){
 await run('PRAGMA foreign_keys=ON');const now=new Date();
 await run('VACUUM INTO ?',[path.join(__dirname,`../artifacts/before-results-${Date.now()}.db`)]);
 for(let days=56;days>=0;days-=7){const date=new Date(now.getTime()-days*86400000).toISOString().slice(0,10);try{
  const data=(await axios.get(`https://api-web.nhle.com/v1/schedule/${date}`,{timeout:20000})).data;
  if(!Array.isArray(data.gameWeek))throw Error('Invalid schedule response');
  for(const week of data.gameWeek)for(const g of week.games)await update('nhl',g.id,g.startTimeUTC,['OFF','FINAL'].includes(g.gameState)?'finished':'scheduled',g.homeTeam.id,g.awayTeam.id,g.homeTeam.score,g.awayTeam.score);
  console.log(`NHL ${date}: ${report.updated.length} verified results`);
 }catch(e){report.errors.push({date,error:e.message})}}
 try{const startDate=new Date(now.getTime()-60*86400000).toISOString().slice(0,10),endDate=now.toISOString().slice(0,10);
  const data=(await axios.get(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=${startDate}&endDate=${endDate}`,{timeout:20000})).data;
  for(const day of data.dates||[])for(const g of day.games)await update('mlb',g.gamePk,g.gameDate,g.status.abstractGameState==='Final'?'finished':'scheduled',g.teams.home.team.id,g.teams.away.team.id,g.teams.home.score,g.teams.away.score);
 }catch(e){report.errors.push({provider:'mlb',error:e.message})}
 for(const match of report.updated.filter(r=>r.provider==='nhl').slice(-8)){try{
  const r=(await axios.get(`https://api-web.nhle.com/v1/gamecenter/${match.id}/boxscore`,{timeout:20000})).data;
  const e=await get('SELECT home_team_id,away_team_id FROM events WHERE id=?',[match.event_id]);
  for(const [side,team]of[['homeTeam',e.home_team_id],['awayTeam',e.away_team_id]]){
   if(Number.isInteger(r[side]?.sog)){const old=await get("SELECT id FROM event_statistics WHERE event_id=? AND participant_id=? AND metric='shots_on_goal'",[match.event_id,team]);if(old)await run('UPDATE event_statistics SET value=? WHERE id=?',[String(r[side].sog),old.id]);else await run("INSERT INTO event_statistics(event_id,participant_id,metric,value,source) VALUES(?,?,'shots_on_goal',?,'nhl')",[match.event_id,team,String(r[side].sog)])}
   const ps=r.playerByGameStats?.[side];const players=ps?[...(ps.forwards||[]),...(ps.defense||[]),...(ps.goalies||[])].map(p=>({name:p.name?.default,number:p.sweaterNumber})).filter(p=>p.name):[];
   if(players.length){const old=await get('SELECT id FROM event_lineups WHERE event_id=? AND team_id=?',[match.event_id,team]);if(old)await run('UPDATE event_lineups SET lineup_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[JSON.stringify(players),old.id]);else await run("INSERT INTO event_lineups(event_id,team_id,lineup_json,lineup_type) VALUES(?,?,?,'game_roster')",[match.event_id,team,JSON.stringify(players)])}
  }
 }catch(e){report.errors.push({game:match.id,error:e.message})}}
 await run("INSERT INTO sync_logs(provider,resource,status,request_count) VALUES('official-sports','results',?,?)",[report.errors.length?'partial':'success',10]);
 fs.writeFileSync(path.join(__dirname,'../artifacts/official-results-sync.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({updated:report.updated.length,unmapped:report.unmapped.length,errors:report.errors}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());
