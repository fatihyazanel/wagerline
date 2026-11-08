// Read-only public deployment checks. Never derives an origin from a request.
const fs=require('fs'),dns=require('dns/promises');
(async()=>{const raw=process.env.SITE_URL,report={checkedAt:new Date().toISOString(),checks:[],blocked:[]};
 if(!raw)report.blocked.push('SITE_URL: final HTTPS domain required');else{
 const origin=new URL(raw);if(origin.protocol!=='https:'||origin.pathname!=='/'||origin.search||origin.hash||origin.username||origin.password)throw Error('SITE_URL must be an HTTPS origin');
 try{await dns.lookup(origin.hostname);report.checks.push({check:'DNS',passed:true})}catch{report.checks.push({check:'DNS',passed:false})}
 for(const path of ['/','/discover','/es/discover','/ar/discover','/robots.txt','/sitemap.xml','/llms.txt']){try{const r=await fetch(new URL(path,origin),{signal:AbortSignal.timeout(20000),headers:{'User-Agent':'WAGERline-Release-Check/1.0'}}),body=await r.text();report.checks.push({path,status:r.status,passed:r.ok&&(!path.includes('.')?!/content="[^"]*noindex/i.test(body):path==='/sitemap.xml'?body.includes('<sitemap>'):path==='/robots.txt'?!/^Disallow:\s*\/$/m.test(body):true)})}catch{report.checks.push({path,passed:false,error:'Network/TLS/timeout'})}}
 for(const previous of (process.env.PREVIOUS_SITE_URLS||'').split(',').filter(Boolean)){try{const from=new URL('/discover?page=2',previous),r=await fetch(from,{redirect:'manual',signal:AbortSignal.timeout(20000)});report.checks.push({check:'domain-migration',host:from.hostname,status:r.status,passed:[301,308].includes(r.status)&&r.headers.get('location')===new URL('/discover?page=2',origin).href})}catch{report.checks.push({check:'domain-migration',passed:false})}}
 }
 if(!process.env.GSC_SITE_URL||!process.env.GSC_ACCESS_TOKEN)report.blocked.push('Search Console property and OAuth access required');
 report.passed=!report.blocked.length&&report.checks.every(c=>c.passed);fs.writeFileSync('../artifacts/seo-release-readiness.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(!report.passed)process.exitCode=2;
})().catch(e=>{console.error(e.message);process.exitCode=1});
