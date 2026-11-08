import {siteOrigin} from '@/lib/seo'
import {apiRead} from '@/lib/seo-data'
import {sitemapIndex} from '@/lib/sitemap-xml'
export const revalidate=3600
export async function GET(){try{
 const manifest=siteOrigin?await apiRead<{data:{kind:string;pages:number}[]}>('discovery/manifest'):null
 if(siteOrigin&&!manifest)throw Error('Unavailable')
 const parts=[{kind:'hubs',pages:1},...(manifest?.data||[])]
 return new Response(sitemapIndex(siteOrigin,parts.flatMap(p=>[p,{...p,kind:p.kind+'-es'},{...p,kind:p.kind+'-ar'}])),{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=3600'}})
 }catch{return new Response('Sitemap temporarily unavailable',{status:503,headers:{'Retry-After':'300'}})}}
