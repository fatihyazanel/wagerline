'use client'
import {useEffect,useSyncExternalStore,type ReactNode} from 'react'
export type Language='en'|'es'|'ar'
const listeners=new Set<()=>void>()
const valid=(value:string|null):value is Language=>!!value&&['en','es','ar'].includes(value)
const serverSnapshot=():Language=>'en'
const clientSnapshot=():Language=>{try{const saved=localStorage.getItem('wagerline_language');if(valid(saved))return saved}catch{}const detected=navigator.language.split('-')[0];return valid(detected)?detected:'en'}
const subscribe=(callback:()=>void)=>{listeners.add(callback);window.addEventListener('storage',callback);return()=>{listeners.delete(callback);window.removeEventListener('storage',callback)}}
const setLanguage=(language:Language)=>{if(!valid(language))return;try{localStorage.setItem('wagerline_language',language)}catch{}listeners.forEach(callback=>callback())}
export function useLanguage(){const language=useSyncExternalStore(subscribe,clientSnapshot,serverSnapshot);return {language,setLanguage}}
export function LanguageProvider({children}:{children:ReactNode}){const {language}=useLanguage();useEffect(()=>{document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr'},[language]);return children}
