'use client'

import {lt,useUiLanguage} from '@/lib/localeText'
import Link from 'next/link'
import { ArrowUpRight, Trophy, Radio, Target, Newspaper } from 'lucide-react'
import { useResource } from '@/hooks/useResource'
import { Workspace, DataState, label, dateLabel } from './Workspace'
import TeamLogo from './TeamLogo'
import NewsImage from './NewsImage'
import type { Match } from './MatchCentre'
type Personal = {data:{profile:{name:string;team_logo:string|null};xp:number;picks:{event_id:number}[];levels:{name:string;min_xp:number}[];challenges:{name:string;target:number;xp:number;claimed:number}[]}}
type News = {data:{id:number;title:string;image_url:string|null;source:string;published_at:string}[]}
function Heading({title,href,link}:{title:string;href:string;link:string}){return <header className="home-section-heading"><h2>{title}</h2><Link href={href}>{link}<ArrowUpRight size={16}/></Link></header>}
export type HomeInitial={news?:News|null;live?:{data:Match[]}|null;scheduled?:{data:Match[]}|null;finished?:{data:Match[]}|null}
function MatchPreview({status,title,href,initial}:{status:string;title:string;href:string;initial?:{data:Match[]}|null}){
 const uiLanguage=useUiLanguage()

 const resource=useResource<{data:Match[]}>(`workspace/matches?status=${status}&limit=3${status==='scheduled'?'&sport=football&featured=1':''}`,status==='live'?30000:0,initial||null)
 return <section className={`home-match-section home-${status}`} aria-label={title}><Heading title={title} href={href} link={status==='live'?'Live centre':'Explore matches'}/><DataState {...resource} empty={!resource.loading&&!resource.error&&!resource.data?.data.length?(status==='live'?'No matches live right now. Explore the next kick-offs below.':'No matches available right now.'):undefined}/><div className="home-match-grid">{resource.data?.data.map(m=><Link className="home-match-card" key={m.id} href={status==='scheduled'?`/predictions?match=${m.id}`:`${href}${href.includes('?')?'&':'?'}match=${m.id}`}><small><span>{lt(label(m.competition_slug),uiLanguage)}</span><span>{status==='live'?'● LIVE':status==='finished'?'FULL TIME':dateLabel(m.start_time,uiLanguage)}</span></small><div><TeamLogo src={m.home_logo} name={m.home_team_name} size={32}/><strong>{m.home_team_name}</strong><b>{status==='scheduled'?'':m.home_score??'–'}</b></div><div><TeamLogo src={m.away_logo} name={m.away_team_name} size={32}/><strong>{m.away_team_name}</strong><b>{status==='scheduled'?'':m.away_score??'–'}</b></div>{status==='scheduled'&&<footer>{lt("Make your pick",uiLanguage)}{' '}<ArrowUpRight size={15}/></footer>}</Link>)}</div></section>
}
export default function HomeDesk({initial={}}:{initial?:HomeInitial}){
 const uiLanguage=useUiLanguage()

 const personal=useResource<Personal>('personal/',30000),news=useResource<News>('news?limit=3',0,initial.news||null),d=personal.data?.data
 const level=d?.levels.filter(l=>l.min_xp<=d.xp).at(-1),next=d?.levels.find(l=>l.min_xp>d.xp),challenge=d?.challenges.find(c=>!c.claimed)
 const progress=d&&level?(next?Math.min(100,100*(d.xp-level.min_xp)/(next.min_xp-level.min_xp)):100):0
 return <Workspace eyebrow="HOME" title={lt("Your matchday, at a glance.",uiLanguage)} description={lt("Catch the action. Make your picks. Discover your next reward.",uiLanguage)} action={<Link className="desk-button" href="/sports">{lt("Explore sports",uiLanguage)}{' '}<ArrowUpRight size={17}/></Link>}>
 <div className="home-overview"><section className="home-welcome"><span>{lt("WELCOME TO THE CLUB",uiLanguage)}</span><h2>{lt("One home.",uiLanguage)}<br/>{lt("Every part of the game.",uiLanguage)}</h2><p>{lt("Your next match, latest stories and personal rewards — ready when you are.",uiLanguage)}</p><Link href="/predictions">{lt("Find your next pick",uiLanguage)}{' '}<ArrowUpRight size={18}/></Link></section><section className="home-personal" aria-label={lt("Your clubhouse",uiLanguage)}><div className="home-personal-heading"><Trophy size={29}/><span>{lt("YOUR CLUBHOUSE",uiLanguage)}</span>{d?.profile.team_logo&&<TeamLogo src={d.profile.team_logo} name="Your favourite club" size={36}/>}</div><DataState {...personal}/>{d&&<><h2>{d.profile.name}</h2><div className="home-xp"><strong>{d.xp} <small>XP</small></strong><span>{level?.name}</span></div><div className="home-progress" role="progressbar" aria-label={lt("Level progress",uiLanguage)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{width:progress+'%'}}/></div><p>{next?`${next.min_xp-d.xp} XP to ${next.name}`:'Top level reached'} · {d.picks.length} {lt("picks",uiLanguage)}</p>{challenge&&<div className="home-challenge"><b>{challenge.name}</b><small>{Math.min(d.picks.length,challenge.target)} / {challenge.target} picks · +{challenge.xp} XP</small></div>}<Link href="/rewards">{lt(challenge&&d.picks.length>=challenge.target?'Claim your achievement':'Open your rewards',uiLanguage)}<ArrowUpRight size={17}/></Link></>}</section></div>
 <nav className="home-shortcuts" aria-label={lt("Explore Wagerline",uiLanguage)}>{[{href:'/live',name:'Live',detail:'Follow the action',Icon:Radio},{href:'/predictions',name:'Predictions',detail:'Back your instincts',Icon:Target},{href:'/leagues',name:'Leagues',detail:'Teams & standings',Icon:Trophy},{href:'/news',name:'News',detail:'Around the grounds',Icon:Newspaper}].map(({href,name,detail,Icon})=><Link href={href} key={href}><Icon size={23}/><span><b>{name}</b><small>{detail}</small></span><ArrowUpRight size={16}/></Link>)}</nav>
 <MatchPreview initial={initial.live} status="live" title={lt("Happening now",uiLanguage)} href="/live"/><MatchPreview initial={initial.scheduled} status="scheduled" title={lt("Next up · make your call",uiLanguage)} href="/sports"/>
 <section className="home-stories" aria-label={lt("Latest stories",uiLanguage)}><Heading title={lt("Around the grounds",uiLanguage)} href="/news" link="All news"/><DataState {...news} empty={!news.loading&&!news.error&&!news.data?.data.length?'No stories available yet.':undefined}/><div className="home-news-grid">{news.data?.data.map(a=><Link href={`/news?article=${a.id}`} key={a.id} className="home-story"><NewsImage src={a.image_url||''} alt={a.title} style={{width:'100%',height:155,objectFit:'cover'}}/><div><small>{a.source} · {dateLabel(a.published_at,uiLanguage)}</small><h3>{a.title.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&')}</h3><span>{lt("Read the news",uiLanguage)}{' '}<ArrowUpRight size={15}/></span></div></Link>)}</div></section>
 <MatchPreview initial={initial.finished} status="finished" title={lt("Final whistle",uiLanguage)} href="/sports?status=finished"/>
 </Workspace>
}
