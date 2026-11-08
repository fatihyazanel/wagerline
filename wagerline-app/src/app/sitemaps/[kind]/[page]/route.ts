import {siteOrigin,publicPages} from '@/lib/seo'
import {apiRead} from '@/lib/seo-data'
import {sitemapUrls} from '@/lib/sitemap-xml'
import {hubMatches,topics} from '@/lib/hubs'
import {editorial} from '@/lib/editorial'
import {hasTranslations,localizedPath} from '@/lib/locale-routing'
export const revalidate=3600
export async function GET(_request:Request,{params}:{params:Promise<{kind:string;page:string}>}){
 const {kind:rawKind,page}=await params
 const language=rawKind.endsWith('-es')?'es':rawKind.endsWith('-ar')?'ar':'en'
 const kind=language==='en'?rawKind:rawKind.slice(0,-3)
 if(!siteOrigin||!['hubs','sports','teams','leagues','matches','contests','players'].includes(kind)||!/^([1-9]\d*)\.xml$/.test(page))return new Response('Not found',{status:404})
 const number=Number(page.slice(0,-4));if(number>10000||(kind==='hubs'&&number!==1))return new Response('Not found',{status:404})
 try{
  let rows:{path:string;updated?:string|null}[]=[]
  if(kind==='hubs'){
   rows=[...publicPages.map(([path])=>({path})),{path:'/teams'},{path:'/tags'},{path:'/players'},{path:'/insights'},{path:'/about/editorial'},...editorial.map(g=>({path:`/insights/${g.slug}`}))]
   for(const topic of topics){const feed=await hubMatches({topic:topic.slug});if(feed?.meta.total)rows.push({path:`/tags/${topic.slug}`})}
  }else{const r=await apiRead<{data:typeof rows}>(`discovery/index?kind=${kind}&page=${number}`);if(!r)return new Response('Not found',{status:404});rows=r.data}
  if(language!=='en')rows=rows.filter(r=>hasTranslations(r.path)).map(r=>({...r,path:localizedPath(r.path,language)}))
  return new Response(sitemapUrls(siteOrigin,rows),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}})
 }catch{return new Response('Sitemap temporarily unavailable',{status:503,headers:{'Retry-After':'300'}})}
}
