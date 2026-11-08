export const publicLanguages=['en','es','ar'] as const
export type PublicLanguage=typeof publicLanguages[number]
export function englishPath(path:string){return path.replace(/^\/(es|ar)(?=\/|\?|$)/,'')||'/'}
export function localizedPath(path:string,lang:PublicLanguage){const base=englishPath(path);return lang==='en'?base:`/${lang}${base==='/'?'':base}`}
export function hasTranslations(path:string){const base=englishPath(path).split('?')[0];return /^\/(teams|players|tags|insights)(\/[^/]+)?$/.test(base)||/^\/(sports|leagues|matches|contests)\/[^/]+$/.test(base)||['/discover','/about/data','/about/editorial'].includes(base)}
