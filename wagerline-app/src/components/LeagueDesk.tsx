'use client'

import AccessibleTabs from './AccessibleTabs'
import {lt,useUiLanguage} from '@/lib/localeText'
import {useSearchParams} from 'next/navigation'
import {useEffect,useState} from 'react'
import {Trophy,Users,CalendarDays,Shield,ArrowRight} from 'lucide-react'
import {Workspace,DataState,label,dateLabel} from './Workspace'
import {useResource} from '@/hooks/useResource'
import TeamLogo from './TeamLogo'
import {MatchDetail} from './MatchCentre'
import IndividualSports from './IndividualSports'
type Competition={id:number;slug:string;name:string;country:string|null;logo_url:string|null}
type Team={id:number;slug:string;name:string;logo_url:string|null;roster_size:number}
type Standing={team_id:number;team_name:string;team_slug:string;team_logo:string|null;position:number;played:number;wins:number;draws:number;losses:number;goals_for:number;goals_against:number;goal_difference:number;points:number|null;group?:string;percentage?:number|null}
type Match={id:number;start_time:string;status:string;home_team_name:string;away_team_name:string;home_score:number|null;away_score:number|null}
type Overview=Competition&{standings_source:string;latest_result?:string|null;standings_updated_at?:string;season:{id:number;name:string}|null;standings:Standing[];teams:Team[];matches:Match[];coverage:{teams:number;teams_with_rosters:number;players:number;matches:number}}
type Player={id:number;name:string;shirt_number:number|null;position:string|null;image_url:string|null;nationality:string|null}
export default function LeagueDesk(){
 const uiLanguage=useUiLanguage()

 const searchParams=useSearchParams()
 const [sport,setSport]=useState('football'),[slug,setSlug]=useState(''),[team,setTeam]=useState(''),[tab,setTab]=useState('Standings'),[status,setStatus]=useState('all'),[match,setMatch]=useState<number|null>(null)
 useEffect(()=>{const requested=searchParams.get('league');if(requested)setSlug(requested)},[searchParams])
 const catalog=useResource<{data:{sports:{id:number;slug:string}[];competitions:{slug:string;sport:string}[]}}>('workspace/catalog')
 const competitions=useResource<{data:Competition[]}>(`competitions?sport=${sport}`)
 useEffect(()=>{if(!slug)return;const found=catalog.data?.data.competitions?.find((c:{slug:string;sport:string})=>c.slug===slug);if(found)setSport(found.sport)},[catalog.data,slug])
 const selected=slug?competitions.data?.data.find(c=>c.slug===slug):competitions.data?.data[0]
 const overview=useResource<{data:Overview}>(selected?`competitions/${selected.slug}/overview?preview=1`:null)
 const [fixturePage,setFixturePage]=useState(1)
 const fixtureFeed=useResource<{data:Match[];meta:{total:number;pages:number}}>(selected&&tab==='Fixtures'?`competitions/${selected.slug}/fixtures?status=${status}&page=${fixturePage}&limit=25`:null,status==='live'?30000:0)
 useEffect(()=>setFixturePage(1),[selected?.slug,status])
 const d=overview.data?.data
 const selectedTeam=d?.teams.find(t=>t.slug===team)??d?.teams[0]
 const roster=useResource<{data:{players:Player[]}}>(selectedTeam?`teams/${selectedTeam.slug}/players`:null)
 const matches=fixtureFeed.data?.data||[]
 return <Workspace eyebrow="COMPETITIONS" title={lt("Follow the season.",uiLanguage)} description={lt("The table, the teams and the players shaping every competition.",uiLanguage)} action={<select className="league-sport-select" aria-label={lt("League sport",uiLanguage)} value={sport} onChange={e=>{setSport(e.target.value);setSlug('');setTeam('');setMatch(null)}}>{catalog.data?.data.sports.map(s=><option key={s.id} value={s.slug}>{lt(label(s.slug),uiLanguage)}</option>)}</select>}>
 <DataState loading={competitions.loading} error={competitions.error} retry={competitions.retry} empty={!competitions.loading&&!competitions.error&&!competitions.data?.data.length?'No competitions are available for this sport.':undefined}/>
 {['tennis','formula-1'].includes(sport)?<IndividualSports sport={sport}/>:<div className="league-workspace"><aside className="league-directory desk-panel"><div className="desk-panel-title"><span className="desk-eyebrow">COMPETITIONS</span><Trophy size={16}/></div><nav>{competitions.data?.data.map(c=><button key={c.id} aria-pressed={selected?.slug===c.slug} onClick={()=>{setSlug(c.slug);setTeam('');setMatch(null)}}><TeamLogo src={c.logo_url} name={c.name} size={36}/><span>{lt(c.name,uiLanguage)}<small>{c.country||label(sport)}</small></span><ArrowRight size={13}/></button>)}</nav></aside><div className="league-main"><DataState {...overview}/>{slug&&!competitions.loading&&!selected&&<DataState empty={lt("The requested competition is not available.",uiLanguage)}/>}{d&&<>
 <section className="league-season"><div className="season-mark"><TeamLogo src={d.logo_url} name={d.name} size={64}/></div><div><span className="desk-eyebrow">{d.country||label(sport)} / {d.season?.name||'Season unavailable'}</span><h2>{d.name}</h2><p>{lt("Season overview",uiLanguage)}</p></div><div className="season-count"><b>{d.coverage.teams}</b><span>{lt("teams",uiLanguage)}</span></div></section>
 <div className="league-kpis">{[{label:'Fixtures',value:d.coverage.matches,icon:CalendarDays},{label:'Players',value:d.coverage.players,icon:Users},{label:'Squads available',value:d.coverage.teams_with_rosters,icon:Shield}].map(k=><div key={k.label}><k.icon size={19}/><span>{lt(k.label,uiLanguage)}<strong>{k.value.toLocaleString()}</strong></span></div>)}</div>
 <div className="league-content-grid"><section className="desk-panel"><AccessibleTabs options={['Standings','Fixtures','Teams']} value={tab} onChange={setTab}>
 {tab==='Standings'&&<><div className="standings-scroll"><table className="standings-table"><thead><tr>{['#','Club','P','W',sport==='football'?'D':'Group','L',sport==='football'?'GF':'For',sport==='football'?'GA':'Against','Diff',sport==='basketball'||sport==='american-football'||sport==='baseball'?'Win %':'Pts'].map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{d.standings.map(r=><tr key={r.team_id}><td>{r.position}</td><td><button onClick={()=>setTeam(r.team_slug)}><TeamLogo src={r.team_logo} name={r.team_name} size={25}/>{r.team_name}</button></td><td>{r.played}</td><td>{r.wins}</td><td>{sport==='football'?r.draws:r.group||'—'}</td><td>{r.losses}</td><td>{r.goals_for}</td><td>{r.goals_against}</td><td>{lt(r.goal_difference>0?'+':'',uiLanguage)}{r.goal_difference}</td><td><b>{['basketball','american-football','baseball'].includes(sport)?r.percentage==null?'—':(r.percentage*100).toFixed(1)+'%':r.points??'—'}</b></td></tr>)}</tbody></table></div>{!d.standings.length&&<DataState empty={lt("Standings are not available for this season.",uiLanguage)}/>}<p className="standings-note">{d.standings_source}{lt(". Latest result:",uiLanguage)}{' '}{d.latest_result?dateLabel(d.latest_result,uiLanguage):'unavailable'}.</p></>}
 {tab==='Fixtures'&&<><div className="desk-filters league-fixture-filter"><select aria-label={lt("Fixture status",uiLanguage)} value={status} onChange={e=>setStatus(e.target.value)}><option value="all">{lt("All fixtures",uiLanguage)}</option><option value="scheduled">{lt("Scheduled",uiLanguage)}</option><option value="finished">{lt("Results",uiLanguage)}</option><option value="live">{lt("Live",uiLanguage)}</option></select></div><DataState {...fixtureFeed}/>{matches.map(m=><button className="league-match-row" key={m.id} onClick={()=>setMatch(m.id)}><span>{dateLabel(m.start_time,uiLanguage)}<small>{lt(label(m.status),uiLanguage)}</small></span><span>{m.home_team_name}<small>{m.away_team_name}</small></span><b>{m.home_score??'–'} : {m.away_score??'–'}</b></button>)}{!fixtureFeed.loading&&!fixtureFeed.error&&!matches.length&&<DataState empty={lt("No fixtures match this selection.",uiLanguage)}/>}{(fixtureFeed.data?.meta.pages||0)>1&&<div className="desk-pagination"><button disabled={fixturePage===1} onClick={()=>setFixturePage(p=>p-1)}>{lt("Previous",uiLanguage)}</button><span>{fixturePage} / {fixtureFeed.data?.meta.pages}</span><button disabled={fixturePage>=(fixtureFeed.data?.meta.pages||1)} onClick={()=>setFixturePage(p=>p+1)}>{lt("Next",uiLanguage)}</button></div>}</>}
 {tab==='Teams'&&d.teams.map(t=><button className="league-team-row" key={t.id} onClick={()=>setTeam(t.slug)}><TeamLogo src={t.logo_url} name={t.name}/><span>{t.name}<small>{t.roster_size} {lt("players recorded",uiLanguage)}</small></span><ArrowRight size={16}/></button>)}
 </AccessibleTabs></section><aside className="desk-panel roster-panel"><div className="desk-panel-title"><h3>{lt("Squad spotlight",uiLanguage)}</h3><Users size={17}/></div><div className="roster-selection"><select aria-label={lt("Team roster",uiLanguage)} value={selectedTeam?.slug||''} onChange={e=>setTeam(e.target.value)}>{d.teams.map(t=><option key={t.id} value={t.slug}>{t.name}</option>)}</select>{selectedTeam&&<div><TeamLogo src={selectedTeam.logo_url} name={selectedTeam.name} size={48}/><span><strong>{selectedTeam.name}</strong><small>{roster.data?.data.players.length??'—'} {lt("players",uiLanguage)}</small></span></div>}</div><DataState {...roster} empty={!roster.loading&&!roster.error&&!roster.data?.data.players.length?'Squad information is not available.':undefined}/><div className="roster-list" tabIndex={0} role="region" aria-label={lt("Team players",uiLanguage)}>{roster.data?.data.players.map(p=><div key={p.id} className="roster-player"><TeamLogo src={p.image_url} name={p.name} size={32}/><b>{p.shirt_number??'–'}</b><span>{p.name}<small>{p.nationality||'Nationality unavailable'}</small></span><em>{p.position||'—'}</em></div>)}</div></aside></div>
 {match&&<div className="league-match-detail"><MatchDetail id={match}/></div>}
 </>}</div></div>}</Workspace>
}

