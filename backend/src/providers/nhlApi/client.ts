import axios, { AxiosInstance } from 'axios'
import { SimpleRateLimiter } from '../../utils/simpleRateLimiter'

// statsapi.web.nhl.com was retired by the NHL; api-web.nhle.com / api.nhle.com
// are the current official public NHL API domains.
const STATS_BASE_URL = 'https://api.nhle.com/stats/rest/en'
const WEB_BASE_URL = 'https://api-web.nhle.com/v1'

// Dedicated limiter — NOT the shared quotaManager, whose 100/day + 10/min budget is tuned for
// API-Football and gets exhausted almost instantly by NHL's real per-team schedule/roster
// fetches (up to ~65 calls in one sync), silently starving other sports that run afterward.
const nhlRateLimiter = new SimpleRateLimiter(200)

interface NhlTeam {
  id: number
  fullName: string
  triCode?: string
  franchiseId?: number
}

class NhlApiClient {
  private statsClient: AxiosInstance
  private webClient: AxiosInstance

  constructor() {
    this.statsClient = axios.create({ baseURL: STATS_BASE_URL, timeout: 10000 })
    this.webClient = axios.create({ baseURL: WEB_BASE_URL, timeout: 10000 })
  }

  private async request<T>(
    client: AxiosInstance,
    endpoint: string
  ): Promise<T | null> {
    try {
      await nhlRateLimiter.throttle()
      const response = await client.get(endpoint)
      return response.data as T
    } catch (error: any) {
      console.warn(`NHL API error for ${endpoint}:`, error.message)
      return null
    }
  }

  // Get all teams (full historical + active team list)
  async getTeams(): Promise<NhlTeam[]> {
    const result = await this.request<any>(this.statsClient, '/team')
    return result?.data || []
  }

  // Get current standings (includes team + division/conference info)
  async getStandings(): Promise<any> {
    return this.request<any>(this.webClient, '/standings/now')
  }

  // Get a team's current roster (forwards/defensemen/goalies), by 3-letter code e.g. "TOR"
  async getTeamRoster(teamAbbrev: string): Promise<any> {
    return this.request<any>(this.webClient, `/roster/${teamAbbrev}/current`)
  }

  // Get a team's full season schedule, by 3-letter code
  async getSchedule(teamAbbrev?: string): Promise<any[]> {
    if (teamAbbrev) {
      const result = await this.request<any>(
        this.webClient,
        `/club-schedule-season/${teamAbbrev}/now`
      )
      return result?.games || []
    }
    const result = await this.request<any>(this.webClient, '/score/now')
    return result?.games || []
  }

  // Get games/scores for a specific date (YYYY-MM-DD) or "now"
  async getScoreboard(date: string = 'now'): Promise<any[]> {
    const result = await this.request<any>(this.webClient, `/score/${date}`)
    return result?.games || []
  }

  // Get live/finished game boxscore
  async getGameBoxscore(gameId: number): Promise<any> {
    return this.request<any>(this.webClient, `/gamecenter/${gameId}/boxscore`)
  }

  // Get play-by-play for a game
  async getGamePlayByPlay(gameId: number): Promise<any> {
    return this.request<any>(this.webClient, `/gamecenter/${gameId}/play-by-play`)
  }

  getStatus(): Record<string, any> {
    return {
      name: 'NHL Official API',
      baseUrl: `${WEB_BASE_URL} / ${STATS_BASE_URL}`,
      auth: 'NO KEY REQUIRED',
      sport: 'icehockey',
      rateLimit: 'Unlimited (public)',
      status: 'operational',
    }
  }
}

export const nhlApiClient = new NhlApiClient()
