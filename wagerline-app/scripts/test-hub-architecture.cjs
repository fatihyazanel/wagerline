const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
const {chromium}=require('@playwright/test');
const apiBase='http://localhost:3101/api/v1/',base='http://localhost:3000',origin='https://seo-test.example';
async function apiRead(path){const r=await fetch(apiBase+path);if(r.status===404)return null;assert(r.ok,`${path}: ${r.status}`);return r.json()}
function sourceModule(path,deps={}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:name=>{if(name==='./locale-routing')return sourceModule('src/lib/locale-routing.ts');if(name==='./site-config')return sourceModule('src/lib/site-config.ts');assert(name in deps,name);return deps[name]},Response,Request,URL,Date,Set,Array,Number,Error,encodeURIComponent,process:{env:{SITE_URL:origin}}});return exports}
(async()=>{
 const checks=[],catalog=(await apiRead('discovery/catalog')).data,manifest=(await apiRead('discovery/manifest')).data;
 assert.equal(catalog.sports.length,7);
 for(const path of ['discovery/index?kind=constructor','discovery/index?kind=unknown','discovery/matches?topic=constructor','discovery/matches?sport=bad','discovery/matches?page=1.5','discovery/matches?team=arsenal&team=chelsea'])assert.equal((await fetch(apiBase+path)).status,400,path);
 checks.push('Discovery API rejects malformed pages, unknown taxonomy and duplicate scalar filters');
 const seo=sourceModule('src/lib/seo.ts'),xml=sourceModule('src/lib/sitemap-xml.ts');
 const indexRoute=sourceModule('src/app/sitemap.xml/route.ts',{'@/lib/seo':seo,'@/lib/seo-data':{apiRead},'@/lib/sitemap-xml':xml});
 const topics=['fixtures','results','live'].map(slug=>({slug}));
 const partRoute=sourceModule('src/app/sitemaps/[kind]/[page]/route.ts',{'@/lib/seo':seo,'@/lib/seo-data':{apiRead},'@/lib/sitemap-xml':xml,'@/lib/editorial':sourceModule('src/lib/editorial.ts'),'@/lib/locale-routing':sourceModule('src/lib/locale-routing.ts'),'@/lib/hubs':{topics,hubMatches:q=>apiRead('discovery/matches?'+new URLSearchParams(q))}});
 const index=await(await indexRoute.GET()).text();assert.equal((index.match(/<sitemap>/g)||[]).length,3*(1+manifest.reduce((n,m)=>n+m.pages,0)));
 const paths=new Set(),parts=[],xmlBodies=[index];
 for(const m of [{kind:'hubs',pages:1},...manifest].flatMap(p=>[p,{...p,kind:p.kind+'-es'},{...p,kind:p.kind+'-ar'}])){
  let count=0;
  for(let page=1;page<=m.pages;page++){
   const response=await partRoute.GET(new Request(base),{params:Promise.resolve({kind:m.kind,page:`${page}.xml`})});assert.equal(response.status,200);
   const body=await response.text();xmlBodies.push(body);const urls=[...body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert(urls.length<=1000);
   for(const url of urls){assert(url.startsWith(origin+'/'));assert(!paths.has(url),'Duplicate sitemap URL '+url);paths.add(url);assert(!/\/(admin|rewards)(\/|$)/.test(url));}
   count+=urls.length;
  }
  if(m.total!==undefined)assert.equal(count,m.total,m.kind);parts.push({kind:m.kind,count,pages:m.pages});
 }
 assert(!paths.has(origin+'/leagues/formula-1'));assert(paths.has(origin+'/sports/formula-1'));assert([...paths].some(p=>p.includes('/contests/espn%3Atennis')));
 assert.equal((await partRoute.GET(new Request(base),{params:Promise.resolve({kind:'matches',page:'9999.xml'})})).status,404);
 const unavailable=sourceModule('src/app/sitemap.xml/route.ts',{'@/lib/seo':seo,'@/lib/seo-data':{apiRead:async()=>{throw Error('outage')}},'@/lib/sitemap-xml':xml});assert.equal((await unavailable.GET()).status,503);
 checks.push('All sitemap partitions match DB totals, have unique canonical URLs, omit private/redirect pages, and return 503 on source failure');
 const browser=await chromium.launch({channel:'msedge',headless:true});const routes=[];
 try{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  const contest=(await apiRead('discovery/index?kind=contests')).data[0].path;
  const f1=(await apiRead('discovery/index?kind=contests')).data.find(x=>x.path.startsWith('/contests/f1:')).path;
  const urls=['/discover','/tags','/teams',...catalog.sports.map(s=>'/sports/'+s.slug),...topics.map(t=>'/tags/'+t.slug),'/teams/arsenal','/leagues/premier-league',contest,f1];
  for(const path of urls){const start=Date.now();const r=await page.goto(base+path);assert.equal(r.status(),200,path);assert.equal(await page.locator('main h1').count(),1,path);assert((await page.locator('main').innerText()).length>100,path);routes.push({path,status:r.status(),ms:Date.now()-start})}
  const parsePage=await context.newPage();for(const body of xmlBodies)assert(await parsePage.evaluate(xml=>!new DOMParser().parseFromString(xml,'application/xml').querySelector('parsererror'),body));
  for(const [path,to]of [['/tags/football','/sports/football'],['/tags/premier-league','/leagues/premier-league'],['/leagues/formula-1','/sports/formula-1']]){const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,308,path);assert.equal(new URL(r.headers.get('location'),base).pathname,to)}
  for(const path of ['/tags/arbitrary-keyword','/sports/invalid','/teams/not-a-team','/contests/invalid','/sports/football?page=9999','/tags/results?page=9999'])assert.equal((await fetch(base+path)).status,404,path);
  await page.goto(base+'/sports/football');assert(await page.locator('a[href^="/teams/"]').count()>0);assert(await page.locator('a[href^="/leagues/"]').count()>0);assert(await page.locator('a[href^="/matches/"]').count()>0);
  await page.goto(base+'/tags/results');await page.getByRole('link',{name:'Next page',exact:true}).click();assert(new URL(page.url()).searchParams.get('page')==='2');
  checks.push('All seven sport hubs, teams, league, topics and tennis/F1 records render without JS; aliases redirect; unknown/empty pagination returns 404; crawlable pagination works');
  await context.close();
 }finally{await browser.close()}
 const report={passed:true,checkedAt:new Date().toISOString(),checks,sitemap:{origin,parts,total:paths.size},routes};fs.writeFileSync('../artifacts/hub-acceptance-2026-11-07.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
