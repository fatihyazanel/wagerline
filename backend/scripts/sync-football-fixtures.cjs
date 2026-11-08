const sqlite3=require('sqlite3'),axios=require('axios'),path=require('path'),fs=require('fs');
const db=new sqlite3.Database(path.join(__dirname,'../data/wagerline.db'));db.configure('busyTimeout',10000);
const all=(sql,p=[])=>new Promise((a,b)=>db.all(sql,p,(e,r)=>e?b(e):a(r)));
const run=(sql,p=[])=>new Promise((a,b)=>db.run(sql,p,function(e){e?b(e):a({id:this.lastID,changes:this.changes})}));
const get=async(sql,p=[])=>(await all(sql,p))[0];
const norm=s=>(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
async function main(){
 const leagues={'premier-league':'4328','la-liga':'4335','serie-a':'4332','bundesliga':'4331','ligue-1':'4334','super-lig':'4339','eredivisie':'4337'};
 const report={updated:[],skipped:[],errors:[]};await run('PRAGMA foreign_keys=ON');await run('VACUUM INTO ?',[path.join(__dirname,`../artifacts/before-football-${Date.now()}.db`)]);
 for(const [slug,league]of Object.entries(leagues)){
  const c=await get('SELECT id,sport_id FROM competitions WHERE slug=?',[slug]);if(!c)continue;
  for(const endpoint of ['eventsnextleague.php','eventspastleague.php']){try{
   const {data}=await axios.get(`https://www.thesportsdb.com/api/v1/json/123/${endpoint}?id=${league}`,{timeout:20000});
   const events=data.events||data.results;if(!Array.isArray(events))throw Error('No event list');
   for(const r of events){
    if(String(r.idLeague)!==league||!r.idHomeTeam||!r.idAwayTeam){report.skipped.push(r.idEvent);continue}
    const home=await get(`SELECT t.id,n.name,t.slug FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' WHERE t.external_id=? AND t.sport_id=?`,[r.idHomeTeam,c.sport_id]);
    const away=await get(`SELECT t.id,n.name,t.slug FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' WHERE t.external_id=? AND t.sport_id=?`,[r.idAwayTeam,c.sport_id]);
    if(!home||!away||![home.name,home.slug].some(n=>norm(n)===norm(r.strHomeTeam))||![away.name,away.slug].some(n=>norm(n)===norm(r.strAwayTeam))){report.skipped.push(r.idEvent);continue}
    const time=r.strTimestamp?`${r.strTimestamp.replace(/Z$/,'')}Z`:`${r.dateEvent}T${r.strTime||'00:00:00'}Z`;if(!Number.isFinite(Date.parse(time)))continue;
    const finished=r.strStatus==='FT'||r.strStatus==='Match Finished';const hs=r.intHomeScore==null?null:Number(r.intHomeScore),as=r.intAwayScore==null?null:Number(r.intAwayScore);if(finished&&(!Number.isInteger(hs)||!Number.isInteger(as)))continue;
    const status=finished?'finished':r.strPostponed==='yes'?'postponed':r.strStatus==='NS'?'scheduled':null;if(!status)continue;
    await run('BEGIN IMMEDIATE');try{
     let season=await get('SELECT id FROM seasons WHERE competition_id=? AND name=?',[c.id,r.strSeason]);if(!season){const inserted=await run('INSERT INTO seasons(competition_id,name,is_current) VALUES(?,?,0)',[c.id,r.strSeason]);season={id:inserted.id}}
     let event=await get('SELECT id FROM events WHERE external_id=?',[`tsdb-${r.idEvent}`]);
     if(event)await run('UPDATE events SET start_time=?,status=?,round=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[time,status,Number(r.intRound)||null,event.id]);
     else{const inserted=await run("INSERT INTO events(sport_id,competition_id,season_id,external_id,event_type,start_time,status,round,home_team_id,away_team_id) VALUES(?,?,?,?,'match',?,?,?,?,?)",[c.sport_id,c.id,season.id,`tsdb-${r.idEvent}`,time,status,Number(r.intRound)||null,home.id,away.id]);event={id:inserted.id}}
     for(const [team,score,role,logo]of[[home.id,hs,'home',r.strHomeTeamBadge],[away.id,as,'away',r.strAwayTeamBadge]]){
      await run("INSERT INTO event_participants(event_id,participant_type,participant_id,role) SELECT ?,'team',?,? WHERE NOT EXISTS(SELECT 1 FROM event_participants WHERE event_id=? AND participant_id=?)",[event.id,team,role,event.id,team]);
      if(logo)await run("UPDATE teams SET logo_url=? WHERE id=? AND (logo_url IS NULL OR logo_url='')",[logo,team]);
      if(finished){const old=await get('SELECT id FROM event_scores WHERE event_id=? AND participant_id=? ORDER BY id DESC LIMIT 1',[event.id,team]);if(old)await run('UPDATE event_scores SET score=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[score,old.id]);else await run('INSERT INTO event_scores(event_id,participant_id,score,period) VALUES(?,?,?,0)',[event.id,team,score])}
     }
     await run('COMMIT');report.updated.push({id:event.id,external_id:r.idEvent,status,slug});
    }catch(e){await run('ROLLBACK');throw e}
   }
   console.log(`${slug} ${endpoint}: ${events.length} provider events`);
  }catch(e){report.errors.push({slug,endpoint,error:e.message})}await new Promise(r=>setTimeout(r,7000))}
 }
 fs.writeFileSync(path.join(__dirname,'../artifacts/football-fixture-sync.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({updated:report.updated.length,skipped:report.skipped.length,errors:report.errors}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());
