const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('assert/strict');
function load(environment){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/site-config.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,{exports,URL,process:{env:environment}});return exports}
const config=load({});assert.equal(config.siteOrigin,undefined);
const settings={SITE_URL:'https://new.example/',PREVIOUS_SITE_URLS:'https://old.example,https://www.old.example,https://new.example,https://old.example/'};
const redirects=config.domainRedirects(settings);assert.equal(redirects.length,2);assert(redirects.every(r=>r.permanent&&r.destination==='https://new.example/:path*'));
assert(new RegExp('^'+redirects[0].has[0].value+'$').test('old.example'));assert(!new RegExp('^'+redirects[0].has[0].value+'$').test('oldXexample'));
for(const SITE_URL of ['http://new.example','https://new.example/path','https://name:secret@new.example','https://localhost','https://127.0.0.1','https://new.example/?query=1'])assert.throws(()=>config.domainSettings({SITE_URL}));
assert.throws(()=>config.domainSettings({PREVIOUS_SITE_URLS:'https://old.example'}));
fs.writeFileSync('../artifacts/domain-settings-test.json',JSON.stringify({passed:true,checks:['One canonical origin','Exact old-host matching','Duplicate and self-redirect removal','Permanent path-preserving redirects','Invalid origins rejected','Preview without public origin']},null,2));console.log('Domain settings passed');
