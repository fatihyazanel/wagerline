import axios, { AxiosInstance } from 'axios'
import { quotaManager } from '../../services/quota/quotaManager'

const API_KEY = process.env.API_SPORTS_KEY || process.env.API_FOOTBALL_KEY || ''
const BASE_URL = 'https://v3.football.api-sports.io'

interface ApiFootballError {
  message: string
  code?: string
}

interface ApiFootballResponse<T> {
  get: string
  parameters: Record<string, any>
  errors: ApiFootballError[]
  results: number
  paging: {
    current: number
    total: number
  }
  response: T
}

class ApiFootballClient {
  private client: AxiosInstance
  private requestCount = 0
  private lastResetTime = Date.now()

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'x-apisports-key': API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 429) {
          console.warn('⚠️ API Rate limit hit - quota exceeded')
        }
        throw error
      }
    )
  }

  private async request<T>(
    method: 'get' | 'post',
    endpoint: string,
    params?: Record<string, any>,
    priority: string = 'P5'
  ): Promise<T | null> {
    // Check quota before making request
    if (!quotaManager.canRequest(priority)) {
      console.warn(`⚠️ Quota exceeded for priority ${priority}. Cannot make request to ${endpoint}`)
      return null
    }

    try {
      const response = await this.client[method]<ApiFootballResponse<T>>(
        endpoint,
        method === 'get' ? { params } : params
      )

      quotaManager.consumeRequest()

      if (response.data.errors && response.data.errors.length > 0) {
        console.warn(`API Error for ${endpoint}:`, response.data.errors[0].message)
        return null
      }

      return response.data.response as T
    } catch (error: any) {
      console.error(`Error calling ${endpoint}:`, error.message)
      return null
    }
  }

  // LEAGUES
  async getLeagues(): Promise<any[]> {
    const result = await this.request('get', '/leagues', {}, 'P5')
    return Array.isArray(result) ? result : []
  }

  // TEAMS
  async getTeams(leagueId: number, season: number = 2025): Promise<any[]> {
    const result = await this.request(
      'get',
      '/teams',
      { league: leagueId, season },
      'P2'
    )
    return Array.isArray(result) ? result : []
  }

  // PLAYERS
  async getPlayers(teamId: number, season: number = 2025): Promise<any[]> {
    const result = await this.request(
      'get',
      '/players',
      { team: teamId, season },
      'P4'
    )
    return Array.isArray(result) ? result : []
  }

  // FIXTURES
  async getFixtures(leagueId: number, season: number = 2025): Promise<any[]> {
    const result = await this.request(
      'get',
      '/fixtures',
      { league: leagueId, season },
      'P2'
    )
    return Array.isArray(result) ? result : []
  }

  // FIXTURE (single)
  async getFixture(fixtureId: number): Promise<any | null> {
    return this.request('get', '/fixtures', { id: fixtureId }, 'P1')
  }

  // FIXTURE EVENTS
  async getFixtureEvents(fixtureId: number): Promise<any[]> {
    const fixture = await this.getFixture(fixtureId)
    return fixture?.events || []
  }

  // FIXTURE STATISTICS
  async getFixtureStatistics(fixtureId: number): Promise<any | null> {
    const result = await this.request(
      'get',
      '/fixtures/statistics',
      { fixture: fixtureId },
      'P2'
    )
    return result as any
  }

  // FIXTURE PLAYERS (lineups)
  async getFixturePlayers(fixtureId: number): Promise<any | null> {
    const result = await this.request(
      'get',
      '/fixtures/lineups',
      { fixture: fixtureId },
      'P2'
    )
    return result as any
  }

  // STANDINGS
  async getStandings(leagueId: number, season: number = 2025): Promise<any | null> {
    return this.request(
      'get',
      '/standings',
      { league: leagueId, season },
      'P2'
    )
  }

  // INJURIES
  async getInjuries(leagueId: number, season: number = 2025): Promise<any | null> {
    const result = await this.request(
      'get',
      '/injuries',
      { league: leagueId, season },
      'P3'
    )
    return result as any
  }

  // ODDS
  async getOdds(fixtureId: number): Promise<any | null> {
    return this.request(
      'get',
      '/odds',
      { fixture: fixtureId },
      'P3'
    )
  }

  // LIVE ODDS
  async getLiveOdds(fixtureId: number): Promise<any | null> {
    return this.request(
      'get',
      '/odds/live',
      { fixture: fixtureId },
      'P0'
    )
  }

  // PREDICTIONS
  async getPrediction(fixtureId: number): Promise<any | null> {
    return this.request(
      'get',
      '/predictions',
      { fixture: fixtureId },
      'P3'
    )
  }

  // HEAD TO HEAD
  async getHeadToHead(teamA: number, teamB: number): Promise<any[]> {
    const result = await this.request(
      'get',
      '/fixtures/headtohead',
      { h2h: `${teamA}-${teamB}` },
      'P4'
    )
    return Array.isArray(result) ? result : []
  }

  // LIVE FIXTURES
  async getLiveFixtures(): Promise<any[]> {
    const result = await this.request(
      'get',
      '/fixtures',
      { live: 'all' },
      'P0'
    )
    return Array.isArray(result) ? result : []
  }

  // HEALTH CHECK
  isConfigured(): boolean {
    return API_KEY.length > 0
  }

  getStatus(): Record<string, any> {
    return {
      configured: this.isConfigured(),
      apiKey: API_KEY ? '***' : 'not-set',
      baseUrl: BASE_URL,
      requestCount: this.requestCount,
    }
  }
}

export const apiFootballClient = new ApiFootballClient()
