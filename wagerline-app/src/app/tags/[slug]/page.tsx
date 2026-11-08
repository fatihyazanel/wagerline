import {notFound,permanentRedirect} from 'next/navigation'
import PublicRecord from '@/components/PublicRecord'
import {MatchLinks,TopicLinks} from '@/components/HubLinks'
import {catalog,hubMatches,topics} from '@/lib/hubs'
import {pageMetadata} from '@/lib/seo'
import {pageNumber,pagePath} from '@/lib/hub-params'
type Props={params:Promise<{slug:string}>;searchParams:Promise<{page?:string}>}
async function load(p:Props){const {slug}=await p.params,page=pageNumber((await p.searchParams).page);const topic=topics.find(t=>t.slug===slug);if(!topic){const c=await catalog();if(c?.data.sports.some(s=>s.slug===slug))permanentRedirect(pagePath(`/sports/${slug}`,page));if(c?.data.leagues.some(l=>l.slug===slug))permanentRedirect(`/leagues/${slug}`);notFound()}const feed=await hubMatches({topic:slug,page:String(page)});if(!feed)notFound();return {topic,page,feed}}
export async function generateMetadata(p:Props){const {topic,page,feed}=await load(p);return pageMetadata(pagePath(`/tags/${topic.slug}`,page),`${topic.name}${page>1?` — Page ${page}`:''}`,topic.description,feed.meta.total>0)}
export default async function Page(p:Props){const {topic,feed}=await load(p);return <PublicRecord title={topic.name} path={`/tags/${topic.slug}`}><p>{topic.description}</p><TopicLinks/><MatchLinks feed={feed} path={`/tags/${topic.slug}`}/></PublicRecord>}
