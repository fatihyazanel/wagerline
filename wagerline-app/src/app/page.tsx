import HomeDesk,{type HomeInitial} from '@/components/HomeDesk'
import {namedMetadata} from '@/lib/seo'
import {apiRead} from '@/lib/seo-data'
export const metadata=namedMetadata('/')
export const revalidate=60
export default async function Page(){
 const [news,live,scheduled,finished]=await Promise.all([
  apiRead<NonNullable<HomeInitial['news']>>('news?limit=3'),
  apiRead<NonNullable<HomeInitial['live']>>('workspace/matches?status=live&limit=3'),
  apiRead<NonNullable<HomeInitial['scheduled']>>('workspace/matches?status=scheduled&limit=3&sport=football&featured=1'),
  apiRead<NonNullable<HomeInitial['finished']>>('workspace/matches?status=finished&limit=3')
 ].map(p=>p.catch(()=>null)))
 return <HomeDesk initial={{news:news as HomeInitial['news'],live:live as HomeInitial['live'],scheduled:scheduled as HomeInitial['scheduled'],finished:finished as HomeInitial['finished']}}/>
}
