import Link from 'next/link'
import {headers} from 'next/headers'
import {hasTranslations,localizedPath,publicLanguages} from '@/lib/locale-routing'
export default async function LanguageLinks({path}:{path:string}){const page=(await headers()).get('x-wagerline-page');const target=!path.includes('?')&&page&&/^[1-9]\d*$/.test(page)&&Number(page)>1?`${path}?page=${page}`:path;return hasTranslations(path)?<nav aria-label="Language" className="public-discovery-nav">{publicLanguages.map(lang=><Link key={lang} href={localizedPath(target,lang)} hrefLang={lang} lang={lang}>{({en:'English',es:'Español',ar:'العربية'})[lang]}</Link>)}</nav>:null}
