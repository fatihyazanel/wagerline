'use client'
import dictionary from '@/i18n/workspace.json'
import {useLanguage} from '@/context/LanguageContext'
const entries=dictionary as Record<string,{es:string;ar:string}>
const insensitive=new Map(Object.keys(entries).map(k=>[k.toLowerCase(),k]))
export const lt=(text:string,language:string):string=>{if(language==='en')return text;const key=entries[text]?text:insensitive.get(text.toLowerCase());return key?entries[key][language as 'es'|'ar']||text:text}
export const useUiLanguage=()=>useLanguage().language
