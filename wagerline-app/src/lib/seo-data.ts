import 'server-only'
import {cache} from 'react'
export type MatchRecord={id:number;start_time:string;status:string;updated_at:string;home_team_name:string;away_team_name:string;home_team_slug?:string;away_team_slug?:string;home_logo:string|null;away_logo:string|null;competition_slug:string;home_score:number|null;away_score:number|null}
export type MatchPage={data:MatchRecord[];meta:{page:number;pages:number;total:number}}
export type LeagueRecord={teams?:{slug:string;name:string}[];slug:string;name:string;sport:string;season:{name:string}|null;standings_source:string;standings_updated_at?:string;standings:{team_id:number;team_name:string;position:number;played:number;wins:number;points:number|null}[];matches:MatchRecord[];coverage:{matches:number;teams:number;players:number}}
export const apiRead=cache(async <T,>(path:string):Promise<T|null>=>{
 const base=(process.env.API_INTERNAL_URL||'http://127.0.0.1:3101').replace(/\/+$/,'')
 const response=await fetch(`${base}/api/v1/${path}`,{next:{revalidate:/^(events\/|discovery\/(matches|contests)|workspace\/individual)/.test(path)?30:300},signal:AbortSignal.timeout(10000)})
 if(response.status===404)return null
 if(!response.ok)throw Error('Sports data temporarily unavailable')
 return response.json() as Promise<T>
})
export const matchPage=(page=1)=>apiRead<MatchPage>(`events?status=all&limit=200&page=${page}`)
export const matchRecord=(id:string)=>apiRead<{data:MatchRecord}>(`events/${encodeURIComponent(id)}`)
export const leagueRecord=(slug:string)=>apiRead<{data:LeagueRecord}>(`competitions/${encodeURIComponent(slug)}/overview?preview=1`)
