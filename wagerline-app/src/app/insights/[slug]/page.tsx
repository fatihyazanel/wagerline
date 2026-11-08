import {notFound} from 'next/navigation'
import Link from 'next/link'
import PublicRecord from '@/components/PublicRecord'
import StructuredData from '@/components/StructuredData'
import {editorial,editorialDate} from '@/lib/editorial'
import {pageMetadata,absolute} from '@/lib/seo'
type Props={params:Promise<{slug:string}>}
async function load(p:Props){const {slug}=await p.params;const a=editorial.find(x=>x.slug===slug);if(!a)notFound();return a}
export async function generateMetadata(p:Props){const a=await load(p);return pageMetadata(`/insights/${a.slug}`,a.title,a.description)}
export default async function Page(p:Props){const a=await load(p),path=`/insights/${a.slug}`;return <PublicRecord title={a.title} path={path}><article><p>WAGERline explanatory guide · Published <time dateTime={editorialDate}>{editorialDate}</time></p>{a.paragraphs.map((text,i)=><p key={i}>{text}</p>)}<p><Link href="/about/editorial">Editorial standards and attribution</Link> · <Link href="/about/data">Data sources and methodology</Link></p></article><StructuredData value={{'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.description,datePublished:editorialDate,url:absolute(path),author:{'@type':'Organization',name:'WAGERline'},publisher:{'@type':'Organization',name:'WAGERline'}}}/></PublicRecord>}
