const {chromium}=require('@playwright/test');
const {default:AxeBuilder}=require('@axe-core/playwright');
const fs=require('fs'),assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const rows=[];
 try{
  const first=await(await fetch('http://localhost:3101/api/v1/events?limit=1')).json();
  const contests=await(await fetch('http://localhost:3101/api/v1/discovery/index?kind=contests')).json();
  const contestPaths=[contests.data[0].path,contests.data.find(r=>r.path.startsWith('/contests/f1:')).path];
  const catalog=await(await fetch('http://localhost:3101/api/v1/discovery/catalog')).json();
  const f1TeamPath='/teams/'+catalog.data.teams.find(t=>t.sport==='formula-1').slug;
  for(const width of [390,1440]){
   const context=await browser.newContext({viewport:{width,height:900}});
   const page=await context.newPage();
   for(const path of ['/discover','/leagues/premier-league',`/matches/${first.data[0].id}`,'/about/data','/sports/football','/sports/tennis','/teams/arsenal',f1TeamPath,'/tags','/tags/results',...contestPaths]){
    const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
    const response=await page.goto('http://localhost:3000'+path);assert.equal(response.status(),200,path);
    const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    rows.push({width,path,errors,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),violations:scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    page.off('pageerror',listener);
   }
   await context.close();
  }
 }finally{await browser.close();fs.writeFileSync('../artifacts/seo-accessibility-2026-11-07.json',JSON.stringify(rows,null,2))}
 console.log(JSON.stringify(rows,null,2));
 assert(rows.every(r=>!r.overflow&&!r.errors.length&&!r.violations.length));
})().catch(e=>{console.error(e.message);process.exitCode=1});
