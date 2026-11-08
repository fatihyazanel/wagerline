import {appendFile,mkdir,stat} from 'node:fs/promises'
import path from 'node:path'
export function publicRoute(value:string){const p=value.split(/[?#]/)[0],base=p.replace(/^\/(es|ar)(?=\/)/,'');if(!/^\/(?:$|(?:discover|sports|leagues|teams|players|matches|contests|tags|insights|about|live|news|predictions|sitemaps)(?:\/|$)|sitemap\.xml$|llms\.txt$)/.test(base)||p.length>250)return null;return p}
export function claimedBot(agent:string){return /OAI-SearchBot/i.test(agent)?'OAI-SearchBot':/GPTBot/i.test(agent)?'GPTBot':/Googlebot/i.test(agent)?'Googlebot':/bingbot/i.test(agent)?'bingbot':/PerplexityBot/i.test(agent)?'PerplexityBot':/ClaudeBot/i.test(agent)?'ClaudeBot':null}
export async function recordSeoEvent(event:Record<string,unknown>){
 const record={...event,at:new Date().toISOString(),environment:process.env.SITE_URL?'configured-site':'preview'}
 const root=path.resolve(/* turbopackIgnore: true */ process.env.SEO_LOG_DIR||'../artifacts/seo-telemetry')
 try{await mkdir(root,{recursive:true});const file=path.join(root,`seo-${new Date().toISOString().slice(0,10)}.jsonl`);const size=await stat(file).then(s=>s.size).catch(()=>0);if(size>20*1024*1024){console.warn('SEO telemetry daily file limit reached');return}await appendFile(file,JSON.stringify(record)+'\n','utf8')}catch{console.info(JSON.stringify({kind:'seo-telemetry-fallback',record}))}
}
