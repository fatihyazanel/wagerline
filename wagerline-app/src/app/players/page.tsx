import Link from 'next/link'
import {notFound} from 'next/navigation'
import PublicRecord from '@/components/PublicRecord'
import {apiRead} from '@/lib/seo-data'
import {pageNumber,pagePath} from '@/lib/hub-params'
import {pageMetadata} from '@/lib/seo'
type Props={searchParams:Promise<{page?:string}>}
export async function generateMetadata(p:Props){const page=pageNumber((await p.searchParams).page);return pageMetadata(pagePath('/players',page),`Player Directory${page>1?` — Page ${page}`:''}`,'Player profiles, current team memberships and supplied biographical data.')}
export default async function Page(p:Props){const page=pageNumber((await p.searchParams).page);const r=await apiRead<{data:{id:number;name:string;team_name:string;position:string}[];pagination:{pages:number;total:number}}>(`players?limit=50&page=${page}`);if(!r||page>Math.max(1,r.pagination.pages))notFound();return <PublicRecord title="Player directory" path="/players"><p>{r.pagination.total} player records. Missing biography or statistics are shown as unavailable.</p><ul className="public-link-grid">{r.data.map(x=><li key={x.id}><Link href={`/players/${x.id}`}>{x.name}</Link><small>{x.team_name} · {x.position}</small></li>)}</ul><nav aria-label="Player pages" className="desk-pagination">{page>1&&<Link href={pagePath('/players',page-1)}>Previous page</Link>}{page<r.pagination.pages&&<Link href={pagePath('/players',page+1)}>Next page</Link>}</nav></PublicRecord>}
