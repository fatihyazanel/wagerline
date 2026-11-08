require('dotenv').config({quiet:true});
const sqlite3=require('sqlite3'),axios=require('axios'),path=require('path'),fs=require('fs');
const db=new sqlite3.Database(path.resolve(__dirname,'..',process.env.DATABASE_PATH||'data/wagerline.db'));db.configure('busyTimeout',10000);
const all=(sql,p=[])=>new Promise((a,b)=>db.all(sql,p,(e,r)=>e?b(e):a(r)));
const run=(sql,p=[])=>new Promise((a,b)=>db.run(sql,p,function(e){e?b(e):a(this.changes)}));
async function main(){
 const folder=path.join(__dirname,'../../wagerline-app/public/team-logos');fs.mkdirSync(folder,{recursive:true});
 await run('CREATE TABLE IF NOT EXISTS team_logo_sources(team_id INTEGER PRIMARY KEY REFERENCES teams(id),source_url TEXT NOT NULL,local_url TEXT NOT NULL,fetched_at TEXT DEFAULT CURRENT_TIMESTAMP)');
 const rows=await all("SELECT id,logo_url FROM teams WHERE logo_url LIKE 'https://%'");let cached=0;const errors=[];
 let index=0;await Promise.all(Array.from({length:4},async()=>{while(index<rows.length){const t=rows[index++];try{
  const response=await axios.get(t.logo_url,{responseType:'arraybuffer',timeout:15000,maxContentLength:2000000});const bytes=Buffer.from(response.data),type=response.headers['content-type']||'';
  const extension=type.includes('svg')&&bytes.toString().includes('<svg')?'svg':bytes[0]===137&&bytes[1]===80?'png':bytes[0]===255&&bytes[1]===216?'jpg':bytes.toString('ascii',0,4)==='RIFF'?'webp':null;
  if(!extension)throw Error('Invalid image');const file=`${t.id}.${extension}`,url=`/team-logos/${file}`;fs.writeFileSync(path.join(folder,file),bytes);
  await run('INSERT INTO team_logo_sources(team_id,source_url,local_url) VALUES(?,?,?) ON CONFLICT(team_id) DO UPDATE SET source_url=excluded.source_url,local_url=excluded.local_url,fetched_at=CURRENT_TIMESTAMP',[t.id,t.logo_url,url]);
  await run('UPDATE teams SET logo_url=? WHERE id=? AND logo_url=?',[url,t.id,t.logo_url]);cached++;
 }catch(e){errors.push({id:t.id,error:e.message})}}}));
 fs.writeFileSync(path.join(__dirname,'../artifacts/logo-cache.json'),JSON.stringify({cached,errors},null,2));console.log(JSON.stringify({cached,errors}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());
