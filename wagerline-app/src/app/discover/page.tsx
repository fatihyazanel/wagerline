import Link from 'next/link'
import {notFound} from 'next/navigation'
import PublicRecord from '@/components/PublicRecord'
import {pageMetadata,readable} from '@/lib/seo'
import {matchPage} from '@/lib/seo-data'
import {catalog as hubCatalog} from '@/lib/hubs'
type Props={searchParams:Promise<{page?:string}>}
function pageNumber(raw?:string){if(raw!==undefined&&(!/^[1-9]\d*$/.test(raw)||Number(raw)>10000))notFound();return Number(raw)||1}
export async function generateMetadata({searchParams}:Props){const page=pageNumber((await searchParams).page);return pageMetadata(page===1?'/discover':`/discover?page=${page}`,`Sports Directory${page===1?'':` — Page ${page}`}`,'Browse permanent league and match records, fixtures and results.')}
export default async function Page({searchParams}:Props){
 const page=pageNumber((await searchParams).page)
 const [feed,catalog]=await Promise.all([matchPage(page),hubCatalog()])
 if(!feed||page>Math.max(1,feed.meta.pages))notFound()
 return <PublicRecord title="Sports directory" path="/discover"><p>Browse competition records and fixtures. Match records include provider status and update times. Data coverage varies by competition.</p><section><h2>Sport hubs</h2><ul className="public-link-grid">{catalog?.data.sports.map(s=><li key={s.slug}><Link href={`/sports/${s.slug}`}>{readable(s.slug)}</Link><small>{s.matches} event records</small></li>)}</ul><p><Link href="/tags">Explore topics</Link> · <Link href="/teams">Browse teams</Link></p></section><section><h2>Competitions</h2><ul className="public-link-grid">{catalog?.data.leagues.map(c=><li key={c.slug}><Link href={`/leagues/${c.slug}`}>{readable(c.slug)}</Link> <small>{readable(c.sport)}</small></li>)}</ul></section><section><h2>Match archive — page {page}</h2><p>{feed.meta.total.toLocaleString('en')} match records</p><ul className="public-link-grid">{feed.data.map(m=><li key={m.id}><Link href={`/matches/${m.id}`}>{m.home_team_name} vs {m.away_team_name}</Link><small><time dateTime={m.start_time}>{m.start_time.slice(0,10)}</time> · {m.status}</small></li>)}</ul><nav aria-label="Match archive pages" className="desk-pagination">{page>1&&<Link href={page===2?'/discover':`/discover?page=${page-1}`}>Previous page</Link>}{page<feed.meta.pages&&<Link href={`/discover?page=${page+1}`}>Next page</Link>}</nav></section></PublicRecord>
}
