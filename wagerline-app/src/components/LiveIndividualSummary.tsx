'use client'
import Link from 'next/link'
import {useResource} from '@/hooks/useResource'
import SportMark from './SportMark'
type Contest={id:string;title:string;freshness?:string;payload:{home?:string;away?:string;home_score?:number;away_score?:number;status_text?:string;home_sets?:{displayValue?:string;value?:number}[];away_sets?:{displayValue?:string;value?:number}[]}}
type Feed={data:Contest[];meta:{total:number}}
function score(c:Contest,side:'home'|'away'){
 const sets=c.payload[`${side}_sets`]
 if(sets?.length)return sets.map(s=>s.displayValue??s.value??'\u2013').join('  ')
 if(Number(c.payload.home_score)===0&&Number(c.payload.away_score)===0&&/[2-5](nd|rd|th) set/i.test(c.payload.status_text||''))return '\u2013'
 return c.payload[`${side}_score`]??'\u2013'
}
function SportLive({sport}:{sport:string}){
 const r=useResource<Feed>(`workspace/individual?sport=${sport}&status=live&limit=40`,15000)
 if(r.error)return <p className="desk-caption" role="status">{sport==='tennis'?'Tennis':'Formula 1'} live updates unavailable. <button onClick={r.retry}>Retry</button></p>
 const rows=(r.data?.data||[]).filter(c=>c.freshness==='current')
 if(!rows.length)return null
 return <section className="desk-panel individual-live"><div className="desk-panel-title"><h2><SportMark name={sport} size={24}/>{sport==='tennis'?'Tennis':'Formula 1'} <small className="individual-live-badge">LIVE</small></h2><Link href={`/sports/${sport}`}>All events &rarr;</Link></div><div className="individual-live-grid">{rows.map(c=><Link className="individual-live-card" key={c.id} href={`/contests/${encodeURIComponent(c.id)}`}><small>{c.title}</small>{c.payload.home&&c.payload.away?<><span>{c.payload.home}<b>{score(c,'home')}</b></span><span>{c.payload.away}<b>{score(c,'away')}</b></span></>:<strong>{c.title}</strong>}<em>{c.payload.status_text||'Live'} &middot; Match centre &rarr;</em></Link>)}</div></section>
}
export default function LiveIndividualSummary(){return <><SportLive sport="tennis"/><SportLive sport="formula-1"/></>}
