const sqlite3=require('sqlite3'),path=require('path'),fs=require('fs');
require('dotenv').config({quiet:true});
const db=new sqlite3.Database(path.resolve(process.env.DATABASE_PATH||'data/wagerline.db'),sqlite3.OPEN_READONLY);
const all=sql=>new Promise((resolve,reject)=>db.all(sql,(e,r)=>e?reject(e):resolve(r)));
(async()=>{
 const inactiveTeams=await all(`SELECT t.slug,COUNT(DISTINCT e.id) matches FROM teams t JOIN events e ON e.home_team_id=t.id OR e.away_team_id=t.id WHERE t.active<>1 AND NOT EXISTS(SELECT 1 FROM canonical_team_aliases a WHERE a.alias_team_id=t.id) AND NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id) GROUP BY t.id`);
 const inactiveLeagues=await all(`SELECT c.slug,COUNT(*) matches FROM competitions c JOIN events e ON e.competition_id=c.id WHERE c.active<>1 AND NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id) GROUP BY c.id`);
 const r={checkedAt:new Date().toISOString(),inactiveTeams,inactiveLeagues};fs.writeFileSync('../artifacts/hub-link-audit.json',JSON.stringify(r,null,2));console.log(JSON.stringify(r,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());
