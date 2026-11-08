import {FastifyInstance} from 'fastify'
import {db} from '../database/init'
import {officialRefreshStatus} from '../services/official-refresh'
import {sportscoreStatus} from '../services/sportscore-refresh'
import {espnRefreshStatus} from '../services/espn-refresh'
import {LIVE_MAX_AGE_SECONDS} from '../services/data-freshness'
export async function dataHealthRoutes(app:FastifyInstance){app.get('/data-health',async(_req,reply)=>{
 reply.header('Cache-Control','no-store')
 const sports=await db.prepare(`SELECT s.slug,COUNT(e.id) records,SUM(CASE WHEN e.status IN ('live','halftime','ht','1h','2h','et','period_break') THEN 1 ELSE 0 END) live,SUM(CASE WHEN e.status IN ('live','halftime','ht','1h','2h','et','period_break') AND (e.updated_at IS NULL OR datetime(e.updated_at)<datetime('now','-5 minutes')) THEN 1 ELSE 0 END) delayed_live,MAX(e.updated_at) latest_record_update,SUM(CASE WHEN e.status='scheduled' AND datetime(e.start_time)<datetime('now','-6 hours') THEN 1 ELSE 0 END) overdue_scheduled FROM sports s LEFT JOIN events e ON e.sport_id=s.id AND NOT EXISTS(SELECT 1 FROM event_aliases a WHERE a.alias_event_id=e.id) GROUP BY s.id`).all()
 const individual=await db.prepare("SELECT sport,COUNT(*) records,SUM(status='live') live,SUM(status='live' AND datetime(fetched_at)<datetime('now','-5 minutes')) delayed_live,MAX(fetched_at) latest_record_update FROM individual_contests WHERE NOT EXISTS(SELECT 1 FROM individual_aliases a WHERE a.alias_id=individual_contests.id) GROUP BY sport").all()
 const jobs=await db.prepare('SELECT kind,status,COUNT(*) count,MAX(finished_at) last_finished FROM operation_jobs GROUP BY kind,status').all()
 return {data:{sports,individual,jobs,refreshes:await db.prepare('SELECT * FROM provider_refresh_health ORDER BY name').all(),providers:{official:officialRefreshStatus,sportscore:sportscoreStatus,espn:espnRefreshStatus},live_max_age_seconds:LIVE_MAX_AGE_SECONDS,refresh_enabled:process.env.ENABLE_PROVIDER_REFRESH!=='0',scheduler_enabled:process.env.ENABLE_OPERATION_JOBS!=='0'},meta:{checked_at:new Date().toISOString(),meaning:'Database update times are not provider observation times. Delayed records retain their last known status; no final scores are inferred.'}}
 })}
