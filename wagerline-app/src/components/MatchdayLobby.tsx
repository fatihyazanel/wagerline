'use client'

import {lt,useUiLanguage} from '@/lib/localeText'
import Link from 'next/link'
import {ArrowRight,Flame,Gift,Target} from 'lucide-react'
import {useResource} from '@/hooks/useResource'
import TeamLogo from './TeamLogo'
import {label,dateLabel} from './Workspace'
import type {Match} from './MatchCentre'
export default function MatchdayLobby(){
 const uiLanguage=useUiLanguage()
const r=useResource<{data:Match[]}>('workspace/matches?status=scheduled&sport=football&featured=1');const matches=r.data?.data.slice(0,3)||[];return <section className="matchday-lobby"><div className="matchday-stage"><img className="matchday-art" src="/logo/sportspage.webp" alt="Football, basketball, American football, hockey and racing"/><div className="matchday-copy"><span><Flame size={15}/>{lt("THE MATCHDAY CLUB",uiLanguage)}</span><h2>{lt("Pick your side.",uiLanguage)}<br/><em>{lt("Own the moment.",uiLanguage)}</em></h2><p>{lt("Your teams. Your predictions. Your next achievement.",uiLanguage)}</p><Link href="/predictions" className="play-button">{lt("Make your pick",uiLanguage)}<ArrowRight size={18}/></Link><Link href="/rewards" className="stage-rewards"><Gift size={17}/>{lt("Explore your rewards",uiLanguage)}</Link></div></div><div className="lobby-fixtures"><header><span><Target size={17}/>{lt("NEXT TO PLAY",uiLanguage)}</span><Link href="/predictions">{lt("All matches",uiLanguage)}<ArrowRight size={14}/></Link></header>{matches.map(m=><Link key={m.id} className="lobby-match" href={`/predictions?match=${m.id}`}><small>{label(m.competition_slug)}<time>{dateLabel(m.start_time)}</time></small><span><TeamLogo src={m.home_logo} name={m.home_team_name} size={36}/><b>{m.home_team_name}</b><i>VS</i><b>{m.away_team_name}</b><TeamLogo src={m.away_logo} name={m.away_team_name} size={36}/></span><em>{lt("Choose your winner",uiLanguage)}<ArrowRight size={13}/></em></Link>)}{r.loading&&<p className="lobby-loading">{lt("Loading the next fixtures…",uiLanguage)}</p>}{r.error&&<button className="desk-button" onClick={r.retry}>{lt("Reload fixtures",uiLanguage)}</button>}{!r.loading&&!r.error&&!matches.length&&<Link className="play-button" href="/sports">{lt("Explore match schedules",uiLanguage)}</Link>}</div></section>}
