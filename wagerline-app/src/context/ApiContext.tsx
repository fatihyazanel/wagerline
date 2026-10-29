'use client'

import { createContext, useContext, useCallback } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

interface ApiContextType {
  get: (endpoint: string, params?: Record<string, any>) => Promise<any>
  post: (endpoint: string, data?: any) => Promise<any>
}

const ApiContext = createContext<ApiContextType | undefined>(undefined)

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const get = useCallback(async (endpoint: string, params?: Record<string, any>) => {
    const url = new URL(`${API_URL}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  }, [])

  const post = useCallback(async (endpoint: string, data?: any) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error(`API error: ${response.statusText}`)
    return response.json()
  }, [])

  return <ApiContext.Provider value={{ get, post }}>{children}</ApiContext.Provider>
}

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within ApiProvider')
  }
  return context
}
