import {headers} from 'next/headers'
import WebVitals from '@/components/WebVitals'
import type {Metadata} from 'next'
import Link from 'next/link'
import {Inter} from 'next/font/google'
import './globals.css'
import {Providers} from './providers'
import {siteOrigin,absolute} from '@/lib/seo'
import StructuredData from '@/components/StructuredData'
const inter=Inter({subsets:['latin']})
export const metadata:Metadata={
 ...(siteOrigin?{metadataBase:new URL(siteOrigin)}:{}),
 title:{default:'WAGERline — Live Sport, Picks & Rewards',template:'%s | WAGERline'},
 description:'Follow your teams, make match predictions and unlock your matchday rewards.',
 robots:{index:!!siteOrigin,follow:true},
 ...(process.env.GOOGLE_SITE_VERIFICATION?{verification:{google:process.env.GOOGLE_SITE_VERIFICATION}}:{})
}
export default async function RootLayout({children}:{children:React.ReactNode}){const raw=(await headers()).get("x-wagerline-locale");const lang=raw==="es"||raw==="ar"?raw:"en";return <html lang={lang} dir={lang==="ar"?"rtl":"ltr"}><body className={inter.className}><Providers>{children}</Providers>{siteOrigin&&<WebVitals/>}<nav className="public-discovery-nav" aria-label="Public sports reference" lang="en"><Link href="/discover">Sports directory</Link><Link href="/teams">Teams</Link><Link href="/players">Players</Link><Link href="/insights">Insights</Link><Link href="/tags">Topics</Link><Link href="/about/data">Data sources &amp; methodology</Link></nav>{siteOrigin&&<StructuredData value={{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':absolute('/#organization'),name:'WAGERline',url:siteOrigin},{'@type':'WebSite','@id':absolute('/#website'),name:'WAGERline',url:siteOrigin,publisher:{'@id':absolute('/#organization')}}]}}/>}</body></html>}
