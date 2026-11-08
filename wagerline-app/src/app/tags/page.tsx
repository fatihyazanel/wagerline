import Link from 'next/link'
import TopicSchema from '@/components/TopicSchema'
import PublicRecord from '@/components/PublicRecord'
import {catalog,topics} from '@/lib/hubs'
import {pageMetadata,readable} from '@/lib/seo'
export const metadata=pageMetadata('/tags','Sports Topics & Tags','Explore fixtures, results, live matches and sport-specific hubs.')
export default async function Page(){const c=await catalog();return <PublicRecord title="Sports topics and tags" path="/tags"><p>Browse a defined set of sports topics. Sport tags lead to their canonical sport hub; each match belongs to a competition and its participating teams.</p><section><h2>Match topics</h2><ul className="public-link-grid">{topics.map(t=><li key={t.slug}><Link href={`/tags/${t.slug}`}>{t.name}</Link><p>{t.description}</p></li>)}</ul></section><section><h2>Sports</h2><ul className="public-link-grid">{c?.data.sports.map(s=><li key={s.slug}><Link href={`/sports/${s.slug}`}>{readable(s.slug)}</Link><small>{s.matches} event records</small></li>)}</ul></section><TopicSchema/></PublicRecord>}
