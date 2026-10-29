import axios, { AxiosInstance } from 'axios'
import { quotaManager } from '../../services/quota/quotaManager'

const BASE_URL = 'https://site.api.espn.com/site/api/site/v2/sports'

interface EspnTeam {
  id: string
  uid: string
  name: string
  abbreviation: string
  displayName: string
  logo?: string
  links?: Array<{ text: string; href: string }>
}

interface EspnEvent {
  id: string
  uid: string
  date: string
  name: string
  shortName: string
  status: { type: string; description: string }
  competitors?: Array<{ id: string; displayName: string; score?: number }>
}

class EspnApiClient {
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
      console.warn(`⚠️ Quota exceeded for ${endpoint}`)
      return null
    }

    try {
      const response = await this.client.get(endpoint)
      quotaManager.consumeRequest()
      return response.data as T
    } catch (error: any) {
      console.warn(`ESPN API error for ${endpoint}:`, error.message)
      return null
    }
  }

  // ======= BASKETBALL (NBA) =======
  async getBasketballTeams(): Promise<EspnTeam[]> {
    const result = await this.request<any>(
      '/basketball/nba/leagues/d/teams',
      'P2'
    )
    return result?.sports?.[0]?.leagues?.[0]?.teams || []
  }

  async getBasketballStandings(): Promise<any> {
    return this.request<any>(
      '/basketball/nba/leagues/d/standings',
      'P2'
    )
  }

  async getBasketballSchedule(): Promise<EspnEvent[]> {
    const result = await this.request<any>(
      '/basketball/nba/leagues/d/events',
      'P2'
    )
    return result?.sports?.[0]?.leagues?.[0]?.events || []
  }

  async getBasketballTeamRoster(teamId: string): Promise<any[]> {
    const result = await this.request<any>(
      `/basketball/nba/teams/${teamId}`,
      'P4'
    )
    return result?.athletes || []
  }

  // ======= AMERICAN FOOTBALL (NFL) =======
  async getNflTeams(): Promise<EspnTeam[]> {
    const result = await this.request<any>(
      '/football/nfl/leagues/d/teams',
      'P2'
    )
    return result?.sports?.[0]?.leagues?.[0]?.teams || []
  }

  async getNflStandings(): Promise<any> {
    return this.request<any>(
      '/football/nfl/leagues/d/standings',
      'P2'
    )
  }

  async getNflSchedule(): Promise<EspnEvent[]> {
    const result = await this.request<any>(
      '/football/nfl/leagues/d/events',
      'P2'
    )
    return result?.sports?.[0]?.leagues?.[0]?.events || []
  }

  async getNflTeamRoster(teamId: string): Promise<any[]> {
    const result = await this.request<any>(
      `/football/nfl/teams/${teamId}`,
      'P4'
    )
    return result?.athletes || []
  }

  // ======= BASEBALL (MLB) =======
  async getBaseballTeams(): Promise<EspnTeam[]> {
    const result = await this.request<any>(
      '/baseball/mlb/leagues/d/teams',
      'P2'
    )
    return result?.sports?.[0]?.leagues?.[0]?.teams || []
  }

  async getBaseballStandings(): Promise<any> {
    return this.request<any>(
      '/baseball/mlb/leagues/d/standings',
      'P2'
    )
  }

  async getBaseballSchedule(): Promise<EspnEvent[]> {
    const result = await this.request<any>(
      '/baseball/mlb/leagues/d/events',
      'P2'
    )
    return result?.sports?.[0]?.leagues?.[0]?.events || []
  }

  async getBaseballTeamRoster(teamId: string): Promise<any[]> {
    const result = await this.request<any>(
      `/baseball/mlb/teams/${teamId}`,
      'P4'
    )
    return result?.athletes || []
  }

  // ======= GOLF (PGA) =======
  async getGolfTournaments(): Promise<any[]> {
    const result = await this.request<any>(
      '/golf/pga/leagues/d/events',
      'P3'
    )
    return result?.sports?.[0]?.leagues?.[0]?.events || []
  }

  async getGolfStandings(tournamentId: string): Promise<any> {
    return this.request<any>(
      `/golf/pga/events/${tournamentId}/standings`,
      'P3'
    )
  }

  // ======= MMA / UFC =======
  async getUfcEvents(): Promise<EspnEvent[]> {
    const result = await this.request<any>(
      '/mma/ufc/leagues/d/events',
      'P3'
    )
    return result?.sports?.[0]?.leagues?.[0]?.events || []
  }

  // ======= RUGBY =======
  async getRugbyTeams(leagueId: string): Promise<EspnTeam[]> {
    const result = await this.request<any>(
      `/rugby/league/d/${leagueId}/teams`,
      'P3'
    )
    return result?.sports?.[0]?.leagues?.[0]?.teams || []
  }

  async getRugbyStandings(leagueId: string): Promise<any> {
    return this.request<any>(
      `/rugby/league/d/${leagueId}/standings`,
      'P3'
    )
  }

  // ======= GENERIC METHOD =======
  async getSport(
    sport: string,
    league: string,
    endpoint: string,
    priority: string = 'P3'
  ): Promise<any> {
    return this.request<any>(
      `/${sport}/${league}/leagues/d/${endpoint}`,
      priority
    )
  }

  getStatus(): Record<string, any> {
    return {
      name: 'ESPN API',
      baseUrl: BASE_URL,
      auth: 'NO KEY REQUIRED',
      sports: ['basketball', 'americanfootball', 'baseball', 'golf', 'mma', 'rugby'],
      status: 'operational',
    }
  }
}

export const espnApiClient = new EspnApiClient()
