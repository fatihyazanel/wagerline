import LanguageLinks from './LanguageLinks'
import Link from 'next/link'
import SiteHeader from './SiteHeader'
import Footer from './Footer'
import StructuredData from './StructuredData'
import {absolute} from '@/lib/seo'
export default function PublicRecord({title,path,children}:{title:string;path:string;children:React.ReactNode}){
 const crumbs=[{name:'Home',url:'/'},{name:'Sports directory',url:'/discover'},...(path==='/discover'?[]:[{name:title,url:path}])]
 return <><SiteHeader/><main id="main-content" className="desk public-record" lang="en" tabIndex={-1}><nav aria-label="Breadcrumb"><ol>{crumbs.map((c,i)=><li key={c.url}>{i===crumbs.length-1?<span aria-current="page">{c.name}</span>:<Link href={c.url}>{c.name}</Link>}</li>)}</ol></nav><h1>{title}</h1><nav aria-label="Hub navigation" className="public-discovery-nav"><Link href="/discover">All sports</Link><Link href="/teams">Teams</Link><Link href="/players">Players</Link><Link href="/insights">Insights</Link><Link href="/tags">Topics</Link></nav><LanguageLinks path={path}/>{children}{absolute('/')&&<StructuredData value={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:crumbs.map((c,i)=>({'@type':'ListItem',position:i+1,name:c.name,item:absolute(c.url)}))}}/>}</main><Footer/></>
}
