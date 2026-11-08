const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
globalThis.AsyncLocalStorage=require('node:async_hooks').AsyncLocalStorage;
const {unstable_getResponseFromNextConfig,getRedirectUrl}=require('next/experimental/testing/server');
(async()=>{
 const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/site-config.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,URL,process:{env:{}}});
 const nextConfig={redirects:async()=>exports.domainRedirects({SITE_URL:'https://new.example',PREVIOUS_SITE_URLS:'https://old.example'})};
 const r=await unstable_getResponseFromNextConfig({url:'https://old.example/es/discover?page=2',nextConfig});assert.equal(r.status,308);assert.equal(getRedirectUrl(r),'https://new.example/es/discover?page=2');
 const no=await unstable_getResponseFromNextConfig({url:'https://oldXexample/es/discover?page=2',nextConfig});assert.notEqual(no.status,308);
 const fixture=Array.from({length:100},(_,i)=>({at:new Date().toISOString(),kind:'web-vital',environment:'configured-site',device:'mobile',route:'/discover',id:String(i),name:'LCP',value:(i+1)*100}));fixture.push({...fixture[0]});fixture.push({...fixture[0],environment:'preview',value:1});fixture.push({at:new Date().toISOString(),kind:'crawler-request',claimedBot:'Googlebot'});let report;
 vm.runInNewContext(fs.readFileSync('scripts/report-seo-telemetry.cjs','utf8'),{require:n=>n==='fs'?{existsSync:()=>true,readdirSync:()=>['seo-2026-11-07.jsonl'],readFileSync:()=>fixture.map(r=>JSON.stringify(r)).join('\n'),writeFileSync:(_p,s)=>{report=JSON.parse(s)}}:require(n),process:{env:{SEO_LOG_DIR:'synthetic-fixture'}},console:{log:()=>{}}});
 const production=report.vitals.find(r=>r.key.startsWith('configured-site'));assert.equal(production.samples,100);assert.equal(production.p75,7500);assert.equal(production.status,'needs-improvement');assert.equal(report.vitals.find(r=>r.key.startsWith('preview')).status,'insufficient-sample');
 fs.writeFileSync('../artifacts/seo-operations-test.json',JSON.stringify({passed:true,checks:['Next redirect engine preserves locale path and page query with 308','Lookalike host does not match','Synthetic in-memory fixture verifies p75, deduplication and preview separation; no synthetic production log written']},null,2));console.log('SEO operations tests passed');
})().catch(e=>{console.error(e);process.exitCode=1});
