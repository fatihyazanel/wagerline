const sqlite3=require('sqlite3');const axios=require('axios');const fs=require('fs');const path=require('path');
const db=new sqlite3.Database(path.join(__dirname,'../data/wagerline.db'));db.configure('busyTimeout',10000);
const all=(sql,p=[])=>new Promise((yes,no)=>db.all(sql,p,(e,r)=>e?no(e):yes(r)));
const run=(sql,p=[])=>new Promise((yes,no)=>db.run(sql,p,function(e){e?no(e):yes(this.changes)}));
const normalize=s=>(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
async function main(){
 const teams=await all(`SELECT t.id,t.external_id,t.slug,t.logo_url,n.name,s.slug AS sport FROM teams t JOIN sports s ON s.id=t.sport_id LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en'`);
 const before=teams.filter(t=>!t.logo_url).length;const report={before,updated:[],unmatched:[],errors:[]};
 fs.mkdirSync(path.join(__dirname,'../artifacts'),{recursive:true});
 const backup=path.join(__dirname,`../artifacts/before-logo-sync-${Date.now()}.db`);await run('VACUUM INTO ?', [backup]);
 // Provider league identifiers are configuration, never internal database IDs.
 const leagues=['4328','4329','4330','4331','4332','4334','4335','4337','4387','4388','4380','4424','4370','4391'];
 for(const id of leagues){try{
  const {data}=await axios.get('https://www.thesportsdb.com/api/v1/json/123/lookup_all_teams.php',{params:{id},timeout:20000});
  if(!Array.isArray(data.teams)){report.errors.push({league:id,error:'No team array'});continue}
  let count=0;
  for(const t of data.teams){const names=[t.strTeam,t.strTeamAlternate?.split(';')].flat().filter(Boolean).map(normalize);const candidates=teams.filter(local=>!local.logo_url&&(String(local.external_id)===String(t.idTeam)||names.includes(normalize(local.name))||names.includes(normalize(local.slug))));
   for(const local of candidates){
    // Reject conflicting names even when an unscoped historical provider ID matches.
    if(!names.includes(normalize(local.name))&&!names.includes(normalize(local.slug)))continue;
    const url=t.strBadge||t.strTeamBadge;if(!url)continue;const asset=new URL(url);if(asset.protocol!=='https:'||!(asset.hostname==='thesportsdb.com'||asset.hostname.endsWith('.thesportsdb.com')))continue;
    await run('UPDATE teams SET logo_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND (logo_url IS NULL OR logo_url=?)',[url,local.id,'']);local.logo_url=url;count++;report.updated.push({id:local.id,name:local.name,url});
   }
  }console.log(`League ${id}: ${count} logos completed`);
 }catch(e){report.errors.push({league:id,error:e.code||e.message});console.log(`League ${id}: ${e.code||e.message}`)}await new Promise(r=>setTimeout(r,7000))}
 report.unmatched=teams.filter(t=>!t.logo_url).map(t=>({id:t.id,name:t.name,slug:t.slug}));report.after=report.unmatched.length;
 fs.writeFileSync(path.join(__dirname,'../artifacts/logo-sync.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({before,updated:report.updated.length,remaining:report.after,errors:report.errors}));
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());

