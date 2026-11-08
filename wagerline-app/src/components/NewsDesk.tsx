'use client'

import {lt,useUiLanguage} from '@/lib/localeText'
import {useSearchParams} from 'next/navigation'
import {useEffect,useRef,useState} from 'react'
import {Search,ArrowUpRight,X,Newspaper} from 'lucide-react'
import {Workspace,DataState,label,dateLabel} from './Workspace'
import {useResource} from '@/hooks/useResource'
import NewsImage from './NewsImage'
import {useLanguage} from '@/context/LanguageContext'
import {useTranslation} from '@/hooks/useTranslation'
type Article={id:number;title:string;description:string;content:string;image_url:string|null;source:string;external_url:string;published_at:string;sport:string|null;competition:string|null}
function plain(value:string){return (value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"')}
export default function NewsDesk(){
 const uiLanguage=useUiLanguage()

 const searchParams=useSearchParams()
 const {language}=useLanguage();const {t}=useTranslation(language)

 const [search,setSearch]=useState(''),[sport,setSport]=useState(''),[league,setLeague]=useState(''),[source,setSource]=useState(''),[selected,setSelected]=useState<Article|null>(null)
 const [page,setPage]=useState(1),[articles,setArticles]=useState<Article[]>([])
 const resource=useResource<{data:Article[];meta:{total:number;pages:number};facets:{sports:{slug:string}[];competitions:{slug:string}[];sources:{source:string}[]}}>('news?'+new URLSearchParams({page:String(page),limit:'13',q:search,sport,competition:league,source}))
 const directId=searchParams.get('article')
 const direct=useResource<{data:Article}>(directId?'news/'+directId:null)
 useEffect(()=>{if(direct.data?.data)setSelected(direct.data.data)},[direct.data])
 useEffect(()=>{setPage(1);setArticles([])},[search,sport,league,source])
 useEffect(()=>{if(resource.data)setArticles(old=>page===1?resource.data!.data:[...old,...resource.data!.data.filter(a=>!old.some(b=>b.id===a.id))])},[resource.data])
 const dialog=useRef<HTMLDialogElement>(null)
 useEffect(()=>{if(selected)dialog.current?.showModal();else dialog.current?.close()},[selected])

 const rows=articles.filter(a=>(!search||`${a.title} ${plain(a.description)}`.toLowerCase().includes(search.toLowerCase()))&&(!sport||a.sport===sport)&&(!league||a.competition===league)&&(!source||a.source===source))
 const featured=rows[0]
 return <Workspace eyebrow="THE PRESS BOX" title={t('news_page.title')} description={t('news_page.subtitle')} action={<div className="news-search"><Search size={17}/><input aria-label={lt("Search news",uiLanguage)} placeholder={t('news_page.search_placeholder')} value={search} onChange={e=>setSearch(e.target.value)}/></div>}>
 <div className="news-toolbar"><div className="desk-filters"><select aria-label={lt("News sport",uiLanguage)} value={sport} onChange={e=>setSport(e.target.value)}><option value="">{lt("All sports",uiLanguage)}</option>{(resource.data?.facets.sports.map(s=>s.slug)||[]).map(s=><option key={s} value={s!}>{label(s!)}</option>)}</select><select aria-label={lt("News league",uiLanguage)} value={league} onChange={e=>setLeague(e.target.value)}><option value="">{lt("All leagues",uiLanguage)}</option>{(resource.data?.facets.competitions.map(s=>s.slug)||[]).map(s=><option key={s} value={s!}>{label(s!)}</option>)}</select><select aria-label={lt("News source",uiLanguage)} value={source} onChange={e=>setSource(e.target.value)}><option value="">{lt("All sources",uiLanguage)}</option>{(resource.data?.facets.sources.map(s=>s.source)||[]).map(s=><option key={s} value={s}>{label(s)}</option>)}</select></div><span>{rows.length} {lt("stories ·",uiLanguage)}{' '}{[...new Set(articles.map(a=>a.source))].length} {lt("sources",uiLanguage)}</span></div>
 <DataState {...resource} empty={!resource.loading&&!resource.error&&!rows.length?'No stories match these filters.':undefined}/>
 {featured&&<section className="press-feature"><button className="press-feature-image" aria-label={`Read ${featured.title}`} onClick={()=>setSelected(featured)}><NewsImage src={featured.image_url||''} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></button><div><span className="desk-eyebrow">{lt("LEAD STORY /",uiLanguage)}{' '}{label(featured.source)}</span><h2><button onClick={()=>setSelected(featured)}>{featured.title}</button></h2><p>{plain(featured.description).slice(0,240)}</p><time>{dateLabel(featured.published_at,uiLanguage)}</time><button className="desk-link" onClick={()=>setSelected(featured)}>{lt("Read the story",uiLanguage)}<ArrowUpRight size={17}/></button></div></section>}
 {!!rows.length&&<div className="desk-section-heading"><h2>{t('news_page.latest_news')}</h2><span>{lt("Independent reporting from original publishers",uiLanguage)}</span></div>}
 <div className="press-grid">{rows.slice(1).map(a=><article key={a.id} className="press-card"><button className="press-card-image" aria-label={`Read ${a.title}`} onClick={()=>setSelected(a)}><NewsImage src={a.image_url||''} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></button><div><span className="desk-eyebrow">{label(a.source)} {a.sport?`/ ${label(a.sport)}`:''}</span><h3><button onClick={()=>setSelected(a)}>{a.title}</button></h3><p>{plain(a.description)}</p><footer><time>{dateLabel(a.published_at,uiLanguage)}</time><button aria-label={`Read ${a.title}`} onClick={()=>setSelected(a)}><ArrowUpRight size={17}/></button></footer></div></article>)}</div>
 {(resource.data?.meta.pages||0)>page&&<div className="load-more"><button className="desk-button" disabled={resource.loading} onClick={()=>setPage(page+1)}>{lt("Load more stories (",uiLanguage)}{(resource.data?.meta.total||0)-rows.length})</button></div>}
 <dialog ref={dialog} className="prediction-dialog article-dialog" onCancel={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)setSelected(null)}}>{selected&&<><div className="desk-panel-title"><span className="desk-eyebrow">{label(selected.source)} / {dateLabel(selected.published_at,uiLanguage)}</span><button className="desk-icon-button" aria-label={lt("Close article",uiLanguage)} onClick={()=>setSelected(null)}><X/></button></div><NewsImage src={selected.image_url||''} alt="" className="article-detail-image" style={{width:'100%',height:300,objectFit:'cover'}}/><div className="article-copy"><h2>{selected.title}</h2><p>{plain(selected.description)}</p>{selected.content&&!/^https?:\/\//i.test(selected.content)&&<p>{plain(selected.content)}</p>}{/^https?:\/\//i.test(selected.external_url||selected.content)&&<a className="desk-button" href={selected.external_url||selected.content} target="_blank" rel="noopener noreferrer">{lt("Read on",uiLanguage)}{' '}{label(selected.source)}<ArrowUpRight size={17}/></a>}</div></>}</dialog>
 </Workspace>
}

