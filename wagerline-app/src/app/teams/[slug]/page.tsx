import F1TeamDrivers from '@/components/F1TeamDrivers'
import Link from 'next/link'
import {notFound,permanentRedirect} from 'next/navigation'
import PublicRecord from '@/components/PublicRecord'
import StructuredData from '@/components/StructuredData'
import {MatchLinks} from '@/components/HubLinks'
import {apiRead} from '@/lib/seo-data'
import {hubMatches} from '@/lib/hubs'
import {pageMetadata,readable,absolute} from '@/lib/seo'
import {pageNumber,pagePath} from '@/lib/hub-params'
type Team={id:number;slug:string;name:string;sport:string;logo_url:string|null;roster_size:number;external_id?:string}
type Props={params:Promise<{slug:string}>;searchParams:Promise<{page?:string}>}
async function load(p:Props){const {slug}=await p.params;if(slug.length>180)notFound();const r=await apiRead<{data:Team}>(`teams/${encodeURIComponent(slug)}`);if(!r)notFound();const page=pageNumber((await p.searchParams).page);if(r.data.slug!==slug)permanentRedirect(pagePath(`/teams/${encodeURIComponent(r.data.slug)}`,page));return {t:r.data,page}}
export async function generateMetadata(p:Props){const {t,page}=await load(p);return pageMetadata(pagePath(`/teams/${encodeURIComponent(t.slug)}`,page),`${t.name} — Roster & Matches${page>1?` · Page ${page}`:''}`,`${t.name} ${readable(t.sport)} team profile, supplied roster and match records.`)}
export default async function Page(p:Props){const {t,page}=await load(p),path=`/teams/${encodeURIComponent(t.slug)}`;const [roster,feed]=await Promise.all([apiRead<{data:{players:{id:number;name:string;position:string|null;shirt_number:number|null}[]}}>(`teams/${encodeURIComponent(t.slug)}/players`),hubMatches({team:t.slug,page:String(page)})]);if(!feed)notFound();return <PublicRecord title={t.name} path={path}><p><Link href={`/sports/${t.sport}`}>{readable(t.sport)} hub</Link> · <Link href="/teams">All teams</Link></p>{t.logo_url&&<img src={t.logo_url} alt={`${t.name} crest`} width="80" height="80"/>}<section><h2>Roster</h2>{roster?.data.players.length?<ul className="public-link-grid">{roster.data.players.map(x=><li key={x.id}><Link href={`/players/${x.id}`}>{x.name}</Link><small>{x.position||'Position not supplied'}{x.shirt_number!=null?` · #${x.shirt_number}`:''}</small></li>)}</ul>:<p>No team roster is supplied in this feed. For Formula 1 driver and constructor standings, open the <Link href="/sports/formula-1">Formula 1 hub</Link>.</p>}</section>{t.sport==='formula-1'&&<F1TeamDrivers id={t.external_id||''}/>}<section><h2>Match records</h2><MatchLinks feed={feed} path={path}/></section><p><Link href="/about/data">Sources and data coverage</Link></p><StructuredData value={{'@context':'https://schema.org','@type':'SportsTeam','@id':absolute(path),url:absolute(path),name:t.name,sport:t.sport}}/></PublicRecord>}
