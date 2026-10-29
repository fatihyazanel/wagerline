import axios, { AxiosInstance } from 'axios'
import { quotaManager } from '../../services/quota/quotaManager'

const BASE_URL = 'https://tennis-data.co.uk'

interface TennisMatch {
  ATP?: string
  Location?: string
  Tournament?: string
  Date?: string
  Court?: string
  Surface?: string
  Round?: string
  Winner?: string
  Loser?: string
  WRank?: number
  LRank?: number
  WPts?: number
  LPts?: number
  Series?: string
  Comment?: string
  B365W?: number
  B365L?: number
}

interface TennisRanking {
  rank: number
  player: string
  points: number
  tournaments: number
}

class TennisDataApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    })
  }

  private async request<T>(
    endpoint: string,
    priority: string = 'P3'
  ): Promise<T | null> {
    if (!quotaManager.canRequest(priority)) {
      console.warn(`⚠️ Quota exceeded for Tennis Data ${endpoint}`)
      return null
    }

    try {
      const response = await this.client.get(endpoint)
      quotaManager.consumeRequest()
      return response.data as T
    } catch (error: any) {
      console.warn(
        `Tennis Data API error for ${endpoint}:`,
        error.message
      )
      return null
    }
  }

  // Get ATP matches for year and month
  async getAtpMatches(
    year: number,
    month: number
  ): Promise<TennisMatch[]> {
    const monthStr = String(month).padStart(2, '0')
    const result = await this.request<any[]>(
      `/data/matches/${year}/${monthStr}.json`,
      'P2'
    )
    return result || []
  }

  // Get WTA matches for year and month
  async getWtaMatches(
    year: number,
    month: number
  ): Promise<TennisMatch[]> {
    const monthStr = String(month).padStart(2, '0')
    const result = await this.request<any[]>(
      `/data/wta_matches/${year}/${monthStr}.json`,
      'P2'
    )
    return result || []
  }

  // Get ATP rankings
  async getAtpRankings(): Promise<TennisRanking[]> {
    const result = await this.request<any[]>(
      '/rankings/atp.json',
      'P3'
    )
    return result || []
  }

  // Get WTA rankings
  async getWtaRankings(): Promise<TennisRanking[]> {
    const result = await this.request<any[]>(
      '/rankings/wta.json',
      'P3'
    )
    return result || []
  }

  // Get ATP historical data (all years available)
  async getAtpHistoricalMatches(): Promise<any> {
    const matches: TennisMatch[] = []
    const currentYear = new Date().getFullYear()

    // Get last 2 years of data
    for (let year = currentYear - 1; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthStr = String(month).padStart(2, '0')
        const data = await this.request<any[]>(
          `/data/matches/${year}/${monthStr}.json`,
          'P2'
        )
        if (data) {
          matches.push(...data)
        }
      }
    }

    return matches
  }

  // Get WTA historical data
  async getWtaHistoricalMatches(): Promise<any> {
    const matches: TennisMatch[] = []
    const currentYear = new Date().getFullYear()

    // Get last 2 years of data
    for (let year = currentYear - 1; year <= currentYear; year++) {
      for (let month = 1; month <= 12; month++) {
        const monthStr = String(month).padStart(2, '0')
        const data = await this.request<any[]>(
          `/data/wta_matches/${year}/${monthStr}.json`,
          'P2'
        )
        if (data) {
          matches.push(...data)
        }
      }
    }

    return matches
  }

  // Get Grand Slam matches (if available)
  async getGrandSlamMatches(year: number): Promise<any[]> {
    const result = await this.request<any[]>(
      `/data/grandslams/${year}.json`,
      'P2'
    )
    return result || []
  }

  // Get tournaments list
  async getTournaments(): Promise<any[]> {
    const result = await this.request<any[]>(
      '/tournaments.json',
      'P3'
    )
    return result || []
  }

  getStatus(): Record<string, any> {
    return {
      name: 'Tennis Data API',
      baseUrl: BASE_URL,
      auth: 'NO KEY REQUIRED',
      sport: 'tennis',
      dataType: 'Historical matches, rankings',
      rateLimit: 'Generous',
      tours: ['ATP', 'WTA', 'Grand Slams'],
      status: 'operational',
    }
  }
}

export const tennisDataApiClient = new TennisDataApiClient()
