const {spawnSync}=require('child_process');
const path=require('path');
const sqlite3=require('sqlite3');
const filename=path.resolve('../artifacts/fresh-install-'+Date.now()+'.db');
for(const script of ['dist/jobs/migrate.js','dist/jobs/migrate.js','dist/seeds/seed.js','dist/seeds/seed.js']){
 const result=spawnSync(process.execPath,[script],{env:{...process.env,DATABASE_PATH:filename},encoding:'utf8'});
 if(result.status!==0){console.error(result.stderr,result.stdout);process.exit(1)}
}
const db=new sqlite3.Database(filename,sqlite3.OPEN_READONLY);
db.all('PRAGMA foreign_key_check',(error,rows)=>{
 if(error||rows.length){console.error(error||rows);process.exitCode=1}
 else console.log('Fresh database migration and repeated seeding passed; no foreign key violations.');
 db.close();
});
