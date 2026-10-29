'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'es' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('wagerline_language') as Language | null
    if (saved && ['en', 'es', 'ar'].includes(saved)) {
      setLanguageState(saved)
      if (typeof document !== 'undefined') {
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = saved
      }
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (['en', 'es', 'ar'].includes(browserLang)) {
        const detectedLang = browserLang as Language
        setLanguageState(detectedLang)
        if (typeof document !== 'undefined') {
          document.documentElement.dir = detectedLang === 'ar' ? 'rtl' : 'ltr'
          document.documentElement.lang = detectedLang
        }
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    console.log('Language changing from', language, 'to', lang)
    setLanguageState(lang)
    localStorage.setItem('wagerline_language', lang)
    // Update HTML dir for RTL
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
      document.documentElement.lang = lang
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    console.warn('useLanguage must be used within LanguageProvider')
    // During SSR, return default without throwing
    return { language: 'en' as Language, setLanguage: () => {} }
  }
  return context
}
