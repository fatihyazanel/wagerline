import {NextResponse,type NextRequest,type NextFetchEvent} from 'next/server'
import {claimedBot,publicRoute,recordSeoEvent} from './lib/seo-observability'
export function proxy(request:NextRequest,event:NextFetchEvent){
 const headers=new Headers(request.headers),locale=/^\/(es|ar)(\/|$)/.exec(request.nextUrl.pathname)?.[1]||'en'
 headers.set('x-wagerline-locale',locale)
 headers.set('x-wagerline-page',request.nextUrl.searchParams.get('page')||'1')
 const route=publicRoute(request.nextUrl.pathname),bot=claimedBot(request.headers.get('user-agent')||'')
 if(route&&bot)event.waitUntil(recordSeoEvent({kind:'crawler-request',route,claimedBot:bot,verified:false}))
 return NextResponse.next({request:{headers}})
}
export const config={matcher:['/((?!api|_next|telemetry|team-logos|league-logos|images|share-card|favicon).*)']}
