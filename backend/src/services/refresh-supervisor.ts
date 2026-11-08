import {refreshTheSportsDbDetails} from './thesportsdb-details'
import {refreshSportscoreDetails} from './sportscore-details'
import {refreshEspnDetails} from './espn-details'
import {FastifyInstance} from 'fastify'
import axios from 'axios'
import {db} from '../database/init'
import {refreshOfficial,officialRefreshStatus} from './official-refresh'
import {refreshSportscore,sportscoreStatus} from './sportscore-refresh'
import {refreshEspn,espnRefreshStatus} from './espn-refresh'
import {refreshEspnTennis} from '../jobs/syncEspnTennis'
import {refreshTennis} from '../jobs/syncIndividualSports'
export async function startRefreshes(app:FastifyInstance){
 await db.prepare('CREATE TABLE IF NOT EXISTS provider_refresh_health(name TEXT PRIMARY KEY,status TEXT,attempted_at TEXT,success_at TEXT,finished_at TEXT,next_attempt_at TEXT,failures INTEGER DEFAULT 0,records INTEGER,error TEXT)').run()
 const jobs=[{name:'thesportsdb-match-details',interval:300000,run:refreshTheSportsDbDetails},{name:'sportscore-match-details',interval:120000,run:refreshSportscoreDetails},{name:'espn-match-details',interval:120000,run:refreshEspnDetails},{name:'official',interval:60000,run:async()=>{await refreshOfficial();if(officialRefreshStatus.errors.length)throw Error('Partial official source failure');return officialRefreshStatus.updated}},
 {name:'sportscore-football',interval:120000,run:async()=>{if(!sportscoreStatus.configured)throw Error('Provider not configured');await refreshSportscore();if(sportscoreStatus.error)throw Error('SportScore request failed');return sportscoreStatus.imported}},
 {name:'espn-scoreboards',interval:120000,run:async()=>{await refreshEspn();if(espnRefreshStatus.errors.length)throw Error('Partial ESPN scoreboard failure');return espnRefreshStatus.updated}},
 {name:'espn-tennis',interval:120000,run:refreshEspnTennis},{name:'sportscore-tennis',interval:120000,run:refreshTennis}]
 let closed=false;const timers=new Set<ReturnType<typeof setTimeout>>();const running=new Set<Promise<void>>()
 for(const job of jobs){let failures=0;const tick=async()=>{
 if(closed)return;await db.prepare("INSERT INTO provider_refresh_health(name,status,attempted_at) VALUES(?,'running',CURRENT_TIMESTAMP) ON CONFLICT(name) DO UPDATE SET status='running',attempted_at=CURRENT_TIMESTAMP").run(job.name)
 let count:number|null=null,error:string|null=null;try{count=await job.run();failures=0}catch(e){failures++;error=axios.isAxiosError(e)?`HTTP ${e.response?.status||'network'} ${e.code||''}`:e instanceof Error?e.message:'Refresh failed'}
 const delay=Math.min(300000,job.interval*2**Math.min(failures,3)),next=new Date(Date.now()+delay).toISOString()
 await db.prepare("UPDATE provider_refresh_health SET status=?,finished_at=CURRENT_TIMESTAMP,success_at=CASE WHEN ? IS NULL THEN CURRENT_TIMESTAMP ELSE success_at END,next_attempt_at=?,failures=?,records=?,error=? WHERE name=?").run(error?'failed':'success',error,next,failures,count,error,job.name)
 if(!closed){const timer=setTimeout(()=>{timers.delete(timer);launch()},delay);timer.unref();timers.add(timer)}
 };const launch=()=>{const work=tick().catch(e=>{app.log.error({message:e.message},'Refresh supervisor');if(!closed){const timer=setTimeout(()=>{timers.delete(timer);launch()},300000);timer.unref();timers.add(timer)}}).finally(()=>running.delete(work));running.add(work)};if(process.env.ENABLE_PROVIDER_REFRESH!=='0')launch()}
 app.addHook('onClose',async()=>{closed=true;for(const timer of timers)clearTimeout(timer);await Promise.allSettled([...running])})
}
