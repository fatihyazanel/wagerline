import {siteOrigin} from '@/lib/site-config'
import {publicRoute,recordSeoEvent} from '@/lib/seo-observability'
export async function POST(request:Request){
 if(request.headers.get('sec-fetch-site')==='cross-site'||(siteOrigin&&request.headers.get('origin')&&request.headers.get('origin')!==siteOrigin))return new Response(null,{status:403})
 const reader=request.body?.getReader();if(!reader)return new Response(null,{status:400});let text='',size=0;const decoder=new TextDecoder()
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>2048){await reader.cancel();return new Response(null,{status:413})}text+=decoder.decode(value,{stream:true})}
 let body;try{body=JSON.parse(text)}catch{return new Response(null,{status:400})}
 if(!body||typeof body!=='object'||!['LCP','INP','CLS','FCP','TTFB'].includes(body.name)||typeof body.value!=='number'||!Number.isFinite(body.value)||body.value<0||body.value>3600000||typeof body.id!=='string'||body.id.length>100||typeof body.route!=='string'||!publicRoute(body.route)||!['mobile','desktop'].includes(body.device))return new Response(null,{status:400})
 await recordSeoEvent({kind:'web-vital',name:body.name,value:body.value,id:body.id,route:publicRoute(body.route),device:body.device})
 return new Response(null,{status:204,headers:{'X-Robots-Tag':'noindex, nofollow'}})
}
