import { useCallback } from 'react'
import enCommon from '@/i18n/en/common.json'
import esCommon from '@/i18n/es/common.json'
import arCommon from '@/i18n/ar/common.json'

export type Language = 'en' | 'es' | 'ar'

const translations = {
  en: enCommon,
  es: esCommon,
  ar: arCommon,
}

export const useTranslation = (language: Language = 'en') => {
  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.')
    let value: any = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== 'string') {
      value = keys.reduce<any>((entry, part) => entry?.[part], translations.en)
    }

    if (typeof value !== 'string') {
      return key
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => String(params[paramKey] ?? ''))
    }

    return value
  }, [language])

  return { t, language }
}
