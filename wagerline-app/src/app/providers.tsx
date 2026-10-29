'use client'

import { LanguageProvider } from '@/context/LanguageContext'
import { ApiProvider } from '@/context/ApiContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApiProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ApiProvider>
  )
}
