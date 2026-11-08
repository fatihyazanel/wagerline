// OAuth token remains server-side. Usage: node scripts/search-console.cjs status|submit|inspect|performance
const fs=require('fs');
(async()=>{const action=process.argv[2]||'status',token=process.env.GSC_ACCESS_TOKEN,property=process.env.GSC_SITE_URL,origin=process.env.SITE_URL;
 if(!['status','submit','inspect','performance'].includes(action))throw Error('Unknown action');
 if(!token||!property||!origin)throw Error('Required: SITE_URL, GSC_SITE_URL, GSC_ACCESS_TOKEN. No external request was sent.');
 const site=new URL(origin);if(site.protocol!=='https:'||site.pathname!=='/')throw Error('HTTPS origin required');
 const base='https://www.googleapis.com/webmasters/v3/sites/'+encodeURIComponent(property);let url=base,method='GET',body;
 if(action==='submit'){url=base+'/sitemaps/'+encodeURIComponent(new URL('/sitemap.xml',site).href);method='PUT'}
 if(action==='inspect'){url='https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';method='POST';const inspect=new URL(process.env.GSC_INSPECT_PATH||'/discover',site);if(inspect.origin!==site.origin)throw Error('Inspection URL must use SITE_URL');body={inspectionUrl:inspect.href,siteUrl:property,languageCode:'en-US'}}
 if(action==='performance'){url=base+'/searchAnalytics/query';method='POST';const end=new Date(Date.now()-3*86400000),start=new Date(end.getTime()-28*86400000);body={startDate:start.toISOString().slice(0,10),endDate:end.toISOString().slice(0,10),dimensions:['page','query'],rowLimit:25000}}
 const r=await fetch(url,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Search Console returned HTTP '+r.status+'; check property permission and token scopes');
 const text=await r.text(),data=text?JSON.parse(text):{submitted:true};fs.writeFileSync('../artifacts/search-console-'+action+'.json',JSON.stringify({checkedAt:new Date().toISOString(),data},null,2));console.log('Search Console '+action+' completed; report written.');
})().catch(e=>{console.error(e.message);process.exitCode=1});
