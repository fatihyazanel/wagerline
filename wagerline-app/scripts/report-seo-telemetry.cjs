const fs=require('fs'),path=require('path');
const dir=path.resolve(process.env.SEO_LOG_DIR||'../artifacts/seo-telemetry');
const cutoff=Date.now()-28*86400000,records=[];
if(fs.existsSync(dir))for(const name of fs.readdirSync(dir).filter(n=>/^seo-\d{4}-\d{2}-\d{2}\.jsonl$/.test(n)))for(const line of fs.readFileSync(path.join(dir,name),'utf8').split('\n')){try{const r=JSON.parse(line);if(Date.parse(r.at)>=cutoff)records.push(r)}catch{}}
const groups=new Map(),seen=new Map();for(const r of records.filter(r=>r.kind==='web-vital'))seen.set(`${r.environment}:${r.id}`,r);
for(const r of seen.values()){const key=`${r.environment}|${r.device}|${r.route}|${r.name}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r.value)}
const vitals=[...groups].map(([key,values])=>{values.sort((a,b)=>a-b);const p75=values[Math.max(0,Math.ceil(values.length*.75)-1)],name=key.split('|').at(-1),target={LCP:2500,INP:200,CLS:.1}[name];return {key,samples:values.length,p75,target,status:values.length<50?'insufficient-sample':target===undefined?'diagnostic':p75<=target?'within-target':'needs-improvement'}});
const bots=records.filter(r=>r.kind==='crawler-request').reduce((a,r)=>(a[r.claimedBot]=(a[r.claimedBot]||0)+1,a),{});
const report={checkedAt:new Date().toISOString(),windowDays:28,vitals,claimedCrawlerRequests:bots,serverErrors:records.filter(r=>r.kind==='server-error').length,limitations:'Client-reported metrics; bot user-agent claims are not identity verification. Preview data is separate. No field conclusion without adequate real production samples.'};
fs.writeFileSync('../artifacts/seo-telemetry-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
