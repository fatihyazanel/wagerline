export const LIVE_MAX_AGE_SECONDS=300
export const liveStatuses=['live','halftime','ht','1h','2h','et','period_break']
export function recordFreshness(status:string,updated:string|null,now=Date.now()){
 const parsed=updated?Date.parse(updated.includes('T')?updated:updated.replace(' ','T')+'Z'):NaN
 const age=Number.isFinite(parsed)?Math.max(0,Math.floor((now-parsed)/1000)):null
 return {updated_at:updated,age_seconds:age,freshness:age===null?'unknown':liveStatuses.includes(status)&&age>LIVE_MAX_AGE_SECONDS?'delayed':'current'}
}
