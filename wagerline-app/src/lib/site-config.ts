/** Trusted deployment settings; never derive canonical URLs from request headers. */
export function publicOrigin(value:string|undefined){
 if(!value?.trim())return undefined
 const url=new URL(value.trim())
 const host=url.hostname
 if(url.protocol!=='https:'||url.pathname!=='/'||url.search||url.hash||url.username||url.password||url.port||host==='localhost'||host.endsWith('.localhost')||!host.includes('.')||/^\d+\.\d+\.\d+\.\d+$/.test(host)||host.includes(':'))throw Error('Public site URLs must be HTTPS domain origins without paths, ports or credentials')
 return url.origin
}
export function domainSettings(env:Record<string,string|undefined>){
 const origin=publicOrigin(env.SITE_URL)
 const previous=[...new Set((env.PREVIOUS_SITE_URLS||'').split(',').map(s=>s.trim()).filter(Boolean).map(s=>publicOrigin(s)!))]
 if(previous.length&&!origin)throw Error('SITE_URL is required when PREVIOUS_SITE_URLS is configured')
 return {origin,previous:previous.filter(url=>url!==origin)}
}
export function domainRedirects(env:Record<string,string|undefined>){
 const {origin,previous}=domainSettings(env)
 return previous.map(url=>({source:'/:path*',has:[{type:'host' as const,value:new URL(url).hostname.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}],destination:`${origin}/:path*`,permanent:true}))
}
export const siteOrigin=domainSettings(process.env).origin
