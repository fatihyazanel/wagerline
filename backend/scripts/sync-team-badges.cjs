const sqlite3=require('sqlite3'),axios=require('axios'),path=require('path'),fs=require('fs');
const db=new sqlite3.Database(path.join(__dirname,'../data/wagerline.db'));db.configure('busyTimeout',10000);
const all=(sql,p=[])=>new Promise((a,b)=>db.all(sql,p,(e,r)=>e?b(e):a(r)));
const run=(sql,p=[])=>new Promise((a,b)=>db.run(sql,p,function(e){e?b(e):a(this.changes)}));
const norm=s=>(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
async function main(){
 const teams=await all(`SELECT t.id,t.external_id,t.slug,t.logo_url,n.name FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' WHERE (t.logo_url IS NULL OR t.logo_url='' OR t.logo_url LIKE '/logos/%') AND length(t.external_id)=6 AND t.external_id NOT GLOB '*[^0-9]*' ORDER BY (SELECT MIN(e.start_time) FROM events e WHERE (e.home_team_id=t.id OR e.away_team_id=t.id) AND datetime(e.start_time)>datetime('now')) IS NULL,t.id`);
 const report={updated:[],skipped:[],errors:[]};
 for(const t of teams){if(t.logo_url?.startsWith('/logos/')&&fs.existsSync(path.join(__dirname,'../../wagerline-app/public',t.logo_url.slice(1))))continue;try{
  const {data}=await axios.get(`https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=${encodeURIComponent(t.external_id)}`,{timeout:15000});
  const r=data.teams?.find(r=>String(r.idTeam)===String(t.external_id));const names=[r?.strTeam,...(r?.strTeamAlternate||'').split(';')].map(norm);const url=r?.strBadge||r?.strTeamBadge;
  if(r&&url&&(names.includes(norm(t.name))||names.includes(norm(t.slug)))){await run('UPDATE teams SET logo_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[url,t.id]);report.updated.push({id:t.id,name:t.name,url});console.log(`Logo: ${t.name}`)}else report.skipped.push({id:t.id,name:t.name,providerName:r?.strTeam});
 }catch(e){report.errors.push({id:t.id,status:e.response?.status,error:e.code});if(e.response?.status===429)await new Promise(r=>setTimeout(r,30000))}
 fs.writeFileSync(path.join(__dirname,'../artifacts/team-badge-sync.json'),JSON.stringify(report,null,2));await new Promise(r=>setTimeout(r,6500));
 }
 console.log(JSON.stringify({updated:report.updated.length,skipped:report.skipped.length,errors:report.errors.length}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());
