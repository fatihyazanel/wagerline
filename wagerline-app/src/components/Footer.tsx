'use client'

import {lt,useUiLanguage} from '@/lib/localeText'
import Link from 'next/link'

export default function Footer() {
 const uiLanguage=useUiLanguage()

  return <footer className="site-footer"><div className="footer-inner"><div><Link className="wordmark" href="/">WAGER<span className="wordmark-light">line</span></Link><p>{lt("Sport, with perspective.",uiLanguage)}</p></div><nav aria-label={lt("Footer navigation",uiLanguage)}><Link href="/sports">{lt("Sports",uiLanguage)}</Link><Link href="/leagues">{lt("Leagues",uiLanguage)}</Link><Link href="/news">{lt("News",uiLanguage)}</Link></nav><span>© {new Date().getFullYear()} WAGERline</span></div></footer>
}
