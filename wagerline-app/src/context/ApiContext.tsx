'use client'

import { createContext, useContext, useCallback, useMemo } from 'react'
import { apiUrl } from '@/lib/api'

interface ApiContextType {
  get: (endpoint: string, params?: Record<string, any>) => Promise<any>
  post: (endpoint: string, data?: any) => Promise<any>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const get = useCallback(async (endpoint: string, params?: Record<string, any>) => {
    const url = new URL(apiUrl(endpoint), window.location.origin)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString(), { signal: AbortSignal.timeout(15000) })
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  }, [])

  const post = useCallback(async (endpoint: string, data?: any) => {
    const response = await fetch(apiUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  }, [])

  const value = useMemo(() => ({ get, post }), [get, post])
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}
