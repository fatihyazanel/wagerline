const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');
require('dotenv').config({quiet:true});
const db = new sqlite3.Database(path.resolve(process.env.DATABASE_PATH || 'data/wagerline.db'), sqlite3.OPEN_READONLY);
const all = sql => new Promise((resolve,reject)=>db.all(sql,(error,rows)=>error?reject(error):resolve(rows)));
(async()=>{
  const contests = await all(`SELECT sport,status,COUNT(*) count,MAX(fetched_at) refreshed_at FROM individual_contests c WHERE NOT EXISTS(SELECT 1 FROM individual_aliases WHERE alias_id=c.id) GROUP BY sport,status`);
  const standings = await all(`SELECT sport,category,json_array_length(payload_json,'$.DriverStandings') drivers,json_array_length(payload_json,'$.ConstructorStandings') constructors,fetched_at FROM individual_standings`);
  const missingRosters = await all(`SELECT s.slug sport,COUNT(*) teams FROM teams t JOIN sports s ON s.id=t.sport_id WHERE t.active=1 AND s.slug!='formula-1' AND NOT EXISTS(SELECT 1 FROM players WHERE team_id=t.id AND active=1) GROUP BY s.slug`);
  const result={checkedAt:new Date().toISOString(),contests,standings,missingRosters,note:'F1 and tennis contests use individual_contests; F1 drivers and constructors are in individual_standings payloads. Team-roster gaps exclude F1.'};
  fs.writeFileSync('../artifacts/individual-data-audit.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1}).finally(()=>db.close());
