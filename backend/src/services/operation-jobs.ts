import {FastifyInstance} from 'fastify'
import {spawn,ChildProcess} from 'child_process'
import path from 'path'
import {db} from '../database/init'
const commands:Record<string,string[]>={f1logos:['scripts/sync-f1-logos.cjs'],espnstandings:['node_modules/tsx/dist/cli.mjs','src/jobs/syncEspnStandings.ts'],espnrosters:['node_modules/tsx/dist/cli.mjs','src/jobs/syncEspnRosters.ts'],probes:['node_modules/tsx/dist/cli.mjs','src/jobs/checkProviders.ts'],model:['node_modules/tsx/dist/cli.mjs','src/jobs/generateValidatedPredictions.ts'],rosters:['node_modules/tsx/dist/cli.mjs','src/jobs/syncVerifiedRosters.ts'],standings:['scripts/sync-official-standings.cjs'],expanded:['node_modules/tsx/dist/cli.mjs','src/jobs/syncExpandedSeasons.ts'],individual:['node_modules/tsx/dist/cli.mjs','src/jobs/syncIndividualSports.ts'],sportdb:['scripts/sync-sportdb-seasons.cjs'],news:['node_modules/tsx/dist/cli.mjs','src/jobs/syncNews.ts'],logos:['scripts/cache-team-logos.cjs'],competitions:['scripts/cache-competition-logos.cjs'],official:['node_modules/tsx/dist/cli.mjs','src/jobs/runVerifiedSync.ts']}
let processing=false,stopping=false
let activeChild:ChildProcess|null=null
export async function enqueueJob(kind:string){
 if(!commands[kind])throw Error('Unsupported job kind')
 const existing=await db.prepare("SELECT id FROM operation_jobs WHERE kind=? AND status IN ('queued','running') ORDER BY id LIMIT 1").get(kind)
 if(existing)return existing.id
 await db.prepare("INSERT OR IGNORE INTO operation_jobs(kind,status) VALUES(?,'queued')").run(kind)
 return (await db.prepare("SELECT id FROM operation_jobs WHERE kind=? AND status IN ('queued','running') ORDER BY id LIMIT 1").get(kind)).id
}
async function processNext(){
 if(processing||stopping)return;processing=true
 try{const job=await db.prepare("SELECT * FROM operation_jobs WHERE status='queued' AND datetime(run_after)<=datetime('now') ORDER BY CASE kind WHEN 'probes' THEN 0 WHEN 'news' THEN 1 WHEN 'standings' THEN 2 WHEN 'espnstandings' THEN 2 WHEN 'rosters' THEN 9 WHEN 'espnrosters' THEN 9 ELSE 5 END,id LIMIT 1").get();if(!job)return
 await db.prepare("UPDATE operation_jobs SET status='running',started_at=CURRENT_TIMESTAMP,attempts=attempts+1 WHERE id=?").run(job.id)
 const code=await new Promise<number>(resolve=>{const child=spawn(process.execPath,commands[job.kind],{cwd:path.resolve(__dirname,'../..'),windowsHide:true,stdio:'ignore',env:process.env});activeChild=child;const timer=setTimeout(()=>child.kill(),30*60000);child.once('error',()=>{clearTimeout(timer);resolve(-1)});child.once('exit',c=>{activeChild=null;clearTimeout(timer);resolve(c??-1)})})
 const retry=code!==0&&job.attempts<2
 await db.prepare("UPDATE operation_jobs SET status=?,finished_at=CURRENT_TIMESTAMP,error=?,run_after=datetime('now','+5 minutes') WHERE id=?").run(retry?'queued':code===0?'completed':'failed',code===0?null:`Worker exit ${code}`,job.id)
 }finally{processing=false}
}
export async function startJobs(app:FastifyInstance){
 await db.prepare("CREATE TABLE IF NOT EXISTS operation_jobs(id INTEGER PRIMARY KEY,kind TEXT NOT NULL,status TEXT NOT NULL,attempts INTEGER DEFAULT 0,created_at TEXT DEFAULT CURRENT_TIMESTAMP,run_after TEXT DEFAULT CURRENT_TIMESTAMP,started_at TEXT,finished_at TEXT,error TEXT)").run()
 await db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS operation_jobs_one_active_kind ON operation_jobs(kind) WHERE status IN ('queued','running')").run()
 await db.prepare("UPDATE operation_jobs SET status='queued',error='Recovered after restart' WHERE status='running'").run()
 const worker=setInterval(()=>void (process.env.ENABLE_OPERATION_JOBS==='0'?Promise.resolve():processNext()).catch(e=>app.log.error({message:e.message},'Job worker')),2000);worker.unref()
 const schedule=async()=>{for(const [kind,hours] of [['f1logos',24],['espnstandings',1],['espnrosters',24],['probes',1],['model',6],['rosters',24],['standings',1],['expanded',6],['individual',.25],['sportdb',6],['news',.5],['logos',24],['competitions',24]] as [string,number][]){const recent=await db.prepare("SELECT id FROM operation_jobs WHERE kind=? AND datetime(created_at)>datetime('now',?) LIMIT 1").get(kind,`-${hours*60} minutes`);if(!recent)await enqueueJob(kind)}}
 const timer=setInterval(()=>void (process.env.ENABLE_OPERATION_JOBS==='0'?Promise.resolve():schedule()).catch(e=>app.log.error({message:e.message},'Job scheduler')),60000);timer.unref();if(process.env.ENABLE_OPERATION_JOBS!=='0')await schedule()
 app.addHook('onClose',async()=>{stopping=true;activeChild?.kill();clearInterval(worker);clearInterval(timer)})
 app.get('/api/v1/jobs',async()=>({data:await db.prepare('SELECT * FROM operation_jobs ORDER BY id DESC LIMIT 100').all(),kinds:Object.keys(commands)}))
 app.get('/api/v1/jobs/:id',async(req,reply)=>{const job=await db.prepare('SELECT * FROM operation_jobs WHERE id=?').get((req.params as {id:string}).id);return job?{data:job}:reply.code(404).send({error:'Job not found'})})
 app.post('/api/v1/jobs',async(req,reply)=>{const kind=(req.body as {kind?:string})?.kind;if(!kind||!commands[kind])return reply.code(400).send({error:'Unsupported job kind'});return reply.code(202).send({data:{id:await enqueueJob(kind),status:'queued'}})})
}
