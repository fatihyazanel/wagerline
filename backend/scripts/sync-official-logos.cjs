const sqlite3=require('sqlite3'),axios=require('axios'),path=require('path'),fs=require('fs');
const db=new sqlite3.Database(path.join(__dirname,'../data/wagerline.db'));db.configure('busyTimeout',10000);
const all=(sql,p=[])=>new Promise((a,b)=>db.all(sql,p,(e,r)=>e?b(e):a(r)));
const run=(sql,p=[])=>new Promise((a,b)=>db.run(sql,p,function(e){e?b(e):a(this.changes)}));
const norm=s=>(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
async function main(){const report=[];const teams=await all(`SELECT t.*,n.name,s.slug AS sport FROM teams t LEFT JOIN team_translations n ON n.team_id=t.id AND n.language='en' JOIN sports s ON s.id=t.sport_id`);
 const save=async(team,url,source)=>{if(!url||team.logo_url)return;await run('UPDATE teams SET logo_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',[url,team.id]);team.logo_url=url;report.push({id:team.id,name:team.name,url,source})};
 const nhl=(await axios.get('https://api-web.nhle.com/v1/standings/now',{timeout:20000})).data.standings;
 for(const r of nhl){const team=teams.find(t=>t.sport==='ice-hockey'&&norm(t.name)===norm(r.teamName.default));if(team)await save(team,r.teamLogo,'nhl')}
 const mlb=(await axios.get('https://statsapi.mlb.com/api/v1/teams?sportId=1',{timeout:20000})).data.teams;
 for(const r of mlb){const team=teams.find(t=>t.sport==='baseball'&&String(t.external_id)===String(r.id)&&norm(t.name)===norm(r.name));if(team){const url=`https://www.mlbstatic.com/team-logos/${r.id}.svg`;try{const check=await axios.get(url,{timeout:10000});if(String(check.data).includes('<svg'))await save(team,url,'mlb')}catch{}}}
 fs.writeFileSync(path.join(__dirname,'../artifacts/official-logo-sync.json'),JSON.stringify(report,null,2));console.log(`Verified official logos: ${report.length}`);
}
main().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>db.close());
