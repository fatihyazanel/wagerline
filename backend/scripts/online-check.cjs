const fs=require('fs');
require('dotenv').config({quiet:true});
const axios=require('axios');
const checks=[
 ['TheSportsDB','https://www.thesportsdb.com/api/v1/json/123/all_leagues.php',{},d=>Array.isArray(d.leagues)&&d.leagues.length>0],
 ['ESPN','https://site.api.espn.com/site/api/site/v2/sports/soccer/eng.1/scoreboard',{},d=>Array.isArray(d.events)],
 ['MLB','https://statsapi.mlb.com/api/v1/sports',{},d=>Array.isArray(d.sports)],
 ['NHL','https://api-web.nhle.com/v1/standings/now',{},d=>Array.isArray(d.standings)],
 ['Formula 1','https://api.jolpi.ca/ergast/f1/current/driverStandings/',{},d=>!!d.MRData],
];
const key=process.env.API_FOOTBALL_KEY||process.env.API_SPORTS_KEY;
if(key&&!/your_|placeholder/i.test(key)) checks.push(['API-Football','https://v3.football.api-sports.io/status',{'x-apisports-key':key},d=>Object.keys(d.errors||{}).length===0]);
if(process.env.SPORTSCORE_KEY) checks.push(['SportScore','https://sportscore.com/api/widget/matches?limit=1',{Authorization:`Bearer ${process.env.SPORTSCORE_KEY}`},d=>!!d&&typeof d==='object'&&Array.isArray(d.matches)]);
if(process.env.SPORTDB_KEY) checks.push(['SportDB','https://api.sportdb.dev/api/flashscore/football',{'X-API-Key':process.env.SPORTDB_KEY},d=>!!d&&typeof d==='object']);
(async()=>{
 const results=await Promise.all(checks.map(async([name,url,headers,validate])=>{
  const start=Date.now();
  try {const r=await axios.get(url,{headers,timeout:15000});return {name,status:r.status,valid:validate(r.data),elapsedMs:Date.now()-start};}
  catch(e){return {name,status:e.response?.status||null,code:e.code||'UNKNOWN',elapsedMs:Date.now()-start};}
 }));
 fs.writeFileSync('../artifacts/online-audit.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
 console.log(JSON.stringify(results,null,2));
 if(results.some(r=>!r.status))process.exitCode=1;
})();
