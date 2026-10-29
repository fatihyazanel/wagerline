import axios, { AxiosInstance } from 'axios'
import { config } from '../config'

interface ProviderResponse<T> {
  data: T | null
  source: string | null
  error?: string
  retryCount?: number
}

interface RateLimitState {
  count: number
  resetTime: number
}

class ProviderService {
  private clients: Map<string, AxiosInstance> = new Map()
  private rateLimitState: Map<string, RateLimitState> = new Map()

  constructor() {
    this.initializeClients()
  }

  private initializeClients() {
    // SportDB
    if (config.providers.sportdb.enabled) {
      this.clients.set(
        'sportdb',
        axios.create({
          baseURL: config.providers.sportdb.baseUrl,
          headers: {
            'X-API-Key': config.providers.sportdb.apiKey,
          },
          timeout: 10000,
        })
      )
    }

    // SportScore
    if (config.providers.sportscore.enabled) {
      this.clients.set(
        'sportscore',
        axios.create({
          baseURL: config.providers.sportscore.baseUrl,
          headers: {
            'Authorization': `Bearer ${config.providers.sportscore.apiKey}`,
          },
          timeout: 10000,
        })
      )
    }

    // TheSportsDB
    this.clients.set(
      'thesportsdb',
      axios.create({
        baseURL: config.providers.thesportsdb.baseUrl,
        timeout: 10000,
      })
    )

    // API-Sports
    if (config.providers.apisports.enabled) {
      this.clients.set(
        'apisports',
        axios.create({
          baseURL: config.providers.apisports.baseUrl,
          headers: {
            'x-apisports-key': config.providers.apisports.apiKey,
          },
          timeout: 10000,
        })
      )
    }
  }

  private async checkRateLimit(provider: string): Promise<boolean> {
    const state = this.rateLimitState.get(provider)
    const now = Date.now()

    if (!state || now > state.resetTime) {
      this.rateLimitState.set(provider, {
        count: 1,
        resetTime: now + 60000, // 1 minute window
      })
      return true
    }

    const limit = config.providers[provider as keyof typeof config.providers]?.rateLimit || 100
    if (state.count >= limit) {
      return false
    }

    state.count++
    return true
  }

  async executeWithFallback<T>(
    method: string,
    sport: string = 'football',
    params?: any
  ): Promise<ProviderResponse<T>> {
    const priority = config.providerPriority[sport as keyof typeof config.providerPriority] || [
      'sportscore',
      'apisports',
      'thesportsdb',
    ]

    const errors: string[] = []

    for (const providerName of priority) {
      if (!this.clients.has(providerName)) {
        errors.push(`${providerName} not initialized`)
        continue
      }

      // Check rate limit
      const canProceed = await this.checkRateLimit(providerName)
      if (!canProceed) {
        errors.push(`${providerName} rate limit exceeded`)
        continue
      }

      try {
        const client = this.clients.get(providerName)!
        const result = await this.callProvider(providerName, method, params)

        if (result) {
          return {
            data: result as T,
            source: providerName,
          }
        }
      } catch (error) {
        errors.push(
          `${providerName}: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
        console.error(`Provider ${providerName} failed:`, error)
      }
    }

    return {
      data: null,
      source: null,
      error: `All providers failed: ${errors.join('; ')}`,
    }
  }

  private async callProvider(provider: string, method: string, params?: any): Promise<any> {
    const client = this.clients.get(provider)!

    switch (provider) {
      case 'sportdb':
        return this.callSportDB(method, params)
      case 'sportscore':
        return this.callSportScore(method, params)
      case 'thesportsdb':
        return this.callTheSportsDB(method, params)
      case 'apisports':
        return this.callAPISports(method, params)
      default:
        throw new Error(`Unknown provider: ${provider}`)
    }
  }

  private async callSportDB(method: string, params?: any): Promise<any> {
    const client = this.clients.get('sportdb')!
    switch (method) {
      case 'flashscore':
        const res = await client.get('/flashscore/football')
        return res.data
      case 'countries':
        const res2 = await client.get('/transfermarkt/countries')
        return res2.data
      default:
        throw new Error(`SportDB method not implemented: ${method}`)
    }
  }

  private async callSportScore(method: string, params?: any): Promise<any> {
    const client = this.clients.get('sportscore')!
    switch (method) {
      case 'matches':
        const res = await client.get('/matches', { params })
        return res.data
      case 'competitions':
        const res2 = await client.get('/competitions', { params })
        return res2.data
      default:
        throw new Error(`SportScore method not implemented: ${method}`)
    }
  }

  private async callTheSportsDB(method: string, params?: any): Promise<any> {
    const client = this.clients.get('thesportsdb')!
    const apiKey = config.providers.thesportsdb.apiKey
    switch (method) {
      case 'eventslast':
        const res = await client.get(`/${apiKey}/eventslast.php`, { params })
        return res.data
      case 'teams':
        const res2 = await client.get(`/${apiKey}/teams.php`, { params })
        return res2.data
      default:
        throw new Error(`TheSportsDB method not implemented: ${method}`)
    }
  }

  private async callAPISports(method: string, params?: any): Promise<any> {
    const client = this.clients.get('apisports')!
    switch (method) {
      case 'fixtures':
        const res = await client.get('/fixtures', { params })
        return res.data.response
      case 'standings':
        const res2 = await client.get('/standings', { params })
        return res2.data.response
      case 'statistics':
        const res3 = await client.get('/fixtures/statistics', { params })
        return res3.data.response
      case 'teams':
        const res4 = await client.get('/teams', { params })
        return res4.data.response
      default:
        throw new Error(`API-Sports method not implemented: ${method}`)
    }
  }

  getEnabledProviders(): string[] {
    return Array.from(this.clients.keys())
  }

  getProviderStatus() {
    return {
      total: this.clients.size,
      providers: this.getEnabledProviders().map(name => ({
        name,
        enabled: true,
        rateLimitState: this.rateLimitState.get(name),
      })),
    }
  }
}

export const providerService = new ProviderService()
