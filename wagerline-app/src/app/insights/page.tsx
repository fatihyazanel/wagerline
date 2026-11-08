import Link from 'next/link'
import PublicRecord from '@/components/PublicRecord'
import {editorial} from '@/lib/editorial'
import {pageMetadata} from '@/lib/seo'
export const metadata=pageMetadata('/insights','Sports Data Guides & Analysis','Original guides to match probabilities, fair form comparisons and provider data quality.')
export default function Page(){return <PublicRecord title="Sports data guides and analysis" path="/insights"><p>WAGERline explanatory guides and automated, source-linked match context. Imported news remains attributed to its original publisher.</p><ul className="public-link-grid">{editorial.map(a=><li key={a.slug}><h2><Link href={`/insights/${a.slug}`}>{a.title}</Link></h2><p>{a.description}</p></li>)}</ul><p><Link href="/about/editorial">Editorial standards</Link> · <Link href="/discover">Explore match and league records</Link></p></PublicRecord>}
