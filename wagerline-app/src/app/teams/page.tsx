import Link from 'next/link'
import {catalog} from '@/lib/hubs'
import PublicRecord from '@/components/PublicRecord'
import {pageMetadata,readable} from '@/lib/seo'
export const metadata=pageMetadata('/teams','Team Directory','Browse active sports teams, rosters and match records by sport.')
export default async function Page(){const c=await catalog();if(!c)throw Error('Team directory unavailable');return <PublicRecord title="Team directory" path="/teams"><p>Active teams from the sports database. Open a team to browse its supplied roster and match records.</p>{c.data.sports.filter(s=>c.data.teams.some(t=>t.sport===s.slug)).map(s=><section key={s.slug}><h2><Link href={`/sports/${s.slug}`}>{readable(s.slug)}</Link></h2><ul className="public-link-grid">{c.data.teams.filter(t=>t.sport===s.slug).map(t=><li key={t.slug}><Link href={`/teams/${encodeURIComponent(t.slug)}`}>{t.name}</Link></li>)}</ul></section>)}</PublicRecord>}
