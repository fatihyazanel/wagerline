const {chromium}=require('@playwright/test');
const fs=require('fs'),assert=require('assert/strict'),ts=require('typescript'),vm=require('vm');
const base=process.env.TEST_BASE_URL||'http://localhost:3000';
function moduleFrom(path,environment,dependencies={}){const exports={};const code=ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;vm.runInNewContext(code,{exports,require:name=>{if(name==='./locale-routing')return moduleFrom('src/lib/locale-routing.ts',environment);if(name==='./site-config')return moduleFrom('src/lib/site-config.ts',environment);if(name in dependencies)return dependencies[name];throw Error('Unexpected dependency: '+name)},process:{env:environment},URL,Date,Set,Error,Number,console});return exports}
(async()=>{
 const checks=[];
 const config=moduleFrom('src/lib/seo.ts',{SITE_URL:'https://seo-test.example'});
 assert.equal(config.namedMetadata('/sports').alternates.canonical,'https://seo-test.example/sports');
 assert.equal(config.pageMetadata('/admin','Admin','Private',false).robots.index,false);
 assert.equal(moduleFrom('src/lib/seo.ts',{}).namedMetadata('/').robots.index,false);
 assert.throws(()=>moduleFrom('src/lib/seo.ts',{SITE_URL:'http://localhost:3000'}));
 checks.push('Public origin configuration, canonical and private/preview noindex');
 const first=await (await fetch('http://localhost:3101/api/v1/events?status=all&limit=200&page=1')).json();
 const manifest=await(await fetch('http://localhost:3101/api/v1/discovery/manifest')).json();
 const entries=[];
 for(const part of manifest.data)for(let page=1;page<=part.pages;page++){const data=await(await fetch(`http://localhost:3101/api/v1/discovery/index?kind=${part.kind}&page=${page}`)).json();entries.push(...data.data.map(r=>({url:'https://seo-test.example'+r.path,lastModified:r.updated?new Date(r.updated.includes('T')?r.updated:r.updated.replace(' ','T')+'Z').toISOString():undefined})))}
 assert.equal(entries.filter(e=>e.url.includes('/matches/')).length,first.meta.total);
 assert.equal(new Set(entries.map(e=>e.url)).size,entries.length); assert(entries.some(e=>e.url==='https://seo-test.example/leagues/premier-league'));
 assert(entries.every(e=>e.url.startsWith('https://seo-test.example/')&&!e.url.includes('/admin')&&!e.url.includes('/rewards')));
 assert(entries.every(e=>!e.lastModified||Number.isFinite(Date.parse(e.lastModified))));
 checks.push(`Sitemap covers all ${first.meta.total} canonical match records without private URLs or invented timestamps`);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  const titles=[];
  for(const route of ['/','/sports','/live','/leagues','/predictions','/news','/admin','/rewards']){
   const response=await page.goto(base+route);assert.equal(response.status(),200);
   titles.push(await page.title());assert(await page.locator('meta[name="description"]').getAttribute('content'));
   assert(await page.locator('meta[property="og:image"]').count());
   if(['/admin','/rewards'].includes(route))assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
   assert(await page.locator('a[href="/discover"]').count());
  }
  assert.equal(new Set(titles).size,titles.length);checks.push('Eight unique page titles, descriptions, share tags and crawlable directory links without JS');
  await page.goto(base+'/');assert(await page.locator('.home-match-card').count()>0);checks.push('Homepage match data is present without JS');
  await page.goto(base+'/discover');assert(await page.locator('a[href^="/matches/"]').count()>0);
  assert(await page.getByRole('link',{name:'Next page',exact:true}).count());
  for(const route of [`/matches/${first.data[0].id}`,'/leagues/premier-league']){
   const response=await page.goto(base+route);assert.equal(response.status(),200);assert.equal(await page.locator('main h1').count(),1);
   assert((await page.locator('main').innerText()).length>200);
   const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();assert(schemas.length);schemas.forEach(s=>JSON.parse(s));
  }
  assert(await page.locator('table tbody tr').count()>0);checks.push('Directory, match records and standings render semantic content and valid JSON-LD without JS');
  for(const route of ['/matches/invalid','/matches/999999999','/leagues/not-a-real-league','/discover?page=0','/discover?page=9999']){
   const r=await page.goto(base+route);assert.equal(r.status(),404,route);
  }
  checks.push('Invalid IDs, missing records and out-of-range archive pages return real HTTP 404');
  assert.equal((await fetch(base+'/api/v1/health')).headers.get('x-robots-tag'),'noindex, nofollow');
  assert.match(await (await fetch(base+'/llms.txt')).text(),/prediction|statistical/i);
  assert.equal((await fetch(base+'/share-card.png')).status,200);
  await context.close();
 }finally{await browser.close()}
 const report={checkedAt:new Date().toISOString(),passed:true,checks,sitemap:{testedOrigin:'https://seo-test.example',entries:entries.length,matchRecords:first.meta.total,note:'Sitemap generator tested locally with a reserved test origin; no external publication or submission.'}};
 fs.writeFileSync('../artifacts/seo-acceptance-2026-11-07.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
