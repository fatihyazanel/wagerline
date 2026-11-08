'use client'


import {lt,useUiLanguage} from '@/lib/localeText'
import Link from 'next/link'
import SportMark from './SportMark'
import CompetitionNav from './CompetitionNav'
import { usePathname } from 'next/navigation'
import { Globe2, ArrowUpRight, Trophy } from 'lucide-react'
import { useLanguage, type Language } from '@/context/LanguageContext'
import { useTranslation } from '@/hooks/useTranslation'

export default function SiteHeader() {
 const uiLanguage=useUiLanguage()

  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation(language)
  return (
    <><header className="site-header">
      <a className="skip-link" href="#main-content">{lt("Skip to content",uiLanguage)}</a>
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="Wagerline home"><span className="brand-mark" aria-hidden="true"><Trophy size={22} strokeWidth={2.3} /></span>WAGER<span className="wordmark-light">line</span></Link>
        <nav className="main-nav" aria-label={lt("Main navigation",uiLanguage)}>
          {['home', 'live', 'sports', 'leagues', 'predictions', 'news', 'rewards', 'shop'].map(item => {
            const href = item === 'home' ? '/' : `/${item}`
            return <Link key={item} href={href} aria-current={pathname === href ? 'page' : undefined}><SportMark name={item} size={19}/>{item === 'live' && <span className="live-dot" />}{item==='shop'?'Shop':t(`nav.${item}`)}</Link>
          })}
        </nav>
        <div className="header-tools"><Link href="/login" className="header-account">Account</Link>
          <label className="language-control"><Globe2 size={15} /><span className="sr-only">{lt("Language",uiLanguage)}</span><select aria-label={lt("Language",uiLanguage)} value={language} onChange={e => setLanguage(e.target.value as Language)}><option value="en">EN</option><option value="es">ES</option><option value="ar">AR</option></select></label>
          <Link href="/predictions" className="header-live">{lt("Play now",uiLanguage)}{' '}<ArrowUpRight size={14} /></Link>
        </div>
      </div>
    </header><CompetitionNav/></>
  )
}

