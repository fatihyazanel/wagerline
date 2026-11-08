'use client'

import {lt,useUiLanguage} from '@/lib/localeText'
import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Database, RefreshCw } from 'lucide-react'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
export const label=(value:string)=>['nba','nfl','nhl','mlb','uefa'].includes(value.toLowerCase())?value.toUpperCase():value.replace(/[._-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
export const dateLabel=(value:string,locale:string='en')=>new Date(/^\d{4}-\d{2}-\d{2} \d{2}:/.test(value)?value.replace(' ','T')+'Z':value).toLocaleString(locale,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})
export function Workspace({eyebrow,title,description,children,action}:{eyebrow:string;title:string;description:string;children:ReactNode;action?:ReactNode}){
 const uiLanguage=useUiLanguage()

 return <><SiteHeader/><main id="main-content" className="desk" tabIndex={-1}><header className="desk-heading"><div><span className="desk-eyebrow">WAGERLINE / {eyebrow}</span><h1>{lt(title,uiLanguage)}</h1><p>{lt(description,uiLanguage)}</p></div>{action||<Link className="desk-link" href="/leagues">{lt("Explore competitions",uiLanguage)}{' '}<ArrowUpRight size={17}/></Link>}</header>{children}</main><Footer/></>
}
export function DataState({loading,error,empty,retry}:{loading?:boolean;error?:string;empty?:string;retry?:()=>void}){
 const uiLanguage=useUiLanguage()

 if(!loading&&!error&&!empty)return null
 return <div className="desk-state" role={error?'alert':'status'}><Database size={25}/><strong>{lt(loading?'Loading match data':error?'Unable to connect':empty||'',uiLanguage)}</strong>{error&&<><p>{error}</p><button className="desk-button" onClick={retry}><RefreshCw size={15}/>{lt("Try again",uiLanguage)}</button></>}</div>
}
