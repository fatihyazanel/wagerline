'use client'

import {lt,useUiLanguage} from '@/lib/localeText'
import Link from 'next/link'
import {useResource} from '@/hooks/useResource'
import TeamLogo from './TeamLogo'
import {label} from './Workspace'
export default function CompetitionNav(){
 const uiLanguage=useUiLanguage()
const r=useResource<{data:{competitions:{id:number;slug:string;logo_url:string|null}[]}}>('workspace/catalog');return <nav className="competition-nav" aria-label={lt("Competition shortcuts",uiLanguage)}><div><span className="competition-nav-label">LEAGUES</span>{r.data?.data.competitions.filter(c=>c.logo_url).slice(0,18).map(c=><Link key={c.id} href={`/leagues?league=${encodeURIComponent(c.slug)}`}><TeamLogo src={c.logo_url} name={label(c.slug)} size={28} eager/><span>{label(c.slug)}</span></Link>)}</div></nav>}
