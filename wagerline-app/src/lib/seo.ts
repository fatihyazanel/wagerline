import type {Metadata} from 'next'
import {hasTranslations,localizedPath,publicLanguages} from './locale-routing'

import {siteOrigin} from './site-config'
export {siteOrigin} from './site-config'
export const absolute=(path:string)=>siteOrigin?new URL(path,siteOrigin).href:undefined
export const publicPages=[['/','Live Sport, Picks & Rewards','Follow sports fixtures, results, match predictions and your personal rewards.'],['/live','Live Scores','Follow live matches and provider updates across supported sports.'],['/sports','Sports Fixtures & Results','Explore football, basketball, American football, ice hockey, Formula 1, baseball and tennis.'],['/leagues','Leagues & Standings','Explore competition tables, fixtures and team rosters.'],['/predictions','Match Predictions','Compare statistical match probabilities and save your own picks.'],['/news','Sports News','Browse sports headlines and follow links to the original publishers.'],['/discover','Sports Directory','Browse leagues and match records with permanent links.'],['/about/data','Data Sources & Prediction Method','How WAGERline uses provider data, statistical forecasts and source updates.']] as const
export function pageMetadata(path:string,title:string,description:string,index=true):Metadata{
 const url=absolute(path)
 return {title,description,alternates:url?{canonical:url,...(hasTranslations(path)?{languages:Object.fromEntries([...publicLanguages.map(lang=>[lang,absolute(localizedPath(path,lang))]),["x-default",absolute(localizedPath(path,"en"))]])}:{})}:undefined,robots:{index:!!siteOrigin&&index,follow:true},openGraph:{type:'website',siteName:'WAGERline',title,description,...(url?{url}:{}),images:[{url:'/share-card.png',width:1200,height:630,alt:'WAGERline — sport, picks and rewards'}]},twitter:{card:'summary_large_image',title,description,images:['/share-card.png']}}
}
export function namedMetadata(path:string){const row=publicPages.find(p=>p[0]===path);if(!row)throw Error('Unknown public page');return pageMetadata(row[0],row[1],row[2])}
export const readable=(slug:string)=>['nba','nfl','nhl','mlb'].includes(slug)?slug.toUpperCase():slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
export function isoDate(value:string){const date=new Date(/^\d{4}-\d{2}-\d{2} /.test(value)?value.replace(' ','T')+'Z':value);return Number.isNaN(date.getTime())?undefined:date.toISOString()}
