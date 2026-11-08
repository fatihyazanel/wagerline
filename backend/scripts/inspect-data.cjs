const sqlite3=require('sqlite3');
const db=new sqlite3.Database('data/wagerline.db',sqlite3.OPEN_READONLY);
for(const sql of ["SELECT id,slug,external_provider,external_id FROM competitions","SELECT id,slug,external_id,logo_url FROM teams WHERE logo_url IS NULL OR logo_url=''","SELECT sql FROM sqlite_master WHERE name IN ('sync_logs','betting_odds')"]){db.all(sql,(e,r)=>console.log(e?.message||JSON.stringify(r)))}
db.close();
