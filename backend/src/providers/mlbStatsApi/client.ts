import axios, { AxiosInstance } from 'axios'
import { SimpleRateLimiter } from '../../utils/simpleRateLimiter'

const BASE_URL = 'https://statsapi.mlb.com/api/v1'

// Dedicated limiter — NOT the shared quotaManager, whose 100/day + 10/min budget is tuned for
// API-Football and gets exhausted almost instantly by MLB's real per-team roster fetches
// (up to 30 calls in one sync), silently starving other sports that run afterward.
const mlbRateLimiter = new SimpleRateLimiter(150)

interface MlbTeam {
  id: number
  name: string
  teamName: string
  clubName: string
  shortName: string
  seasonStatistics?: Array<{ type: { displayName: string }; stats: any }>
}

interface MlbGame {
  gamePk: number
  gameDateTime: string
  status: { abstractGameState: string; detailedState: string }
  teams: {
    away: { team: MlbTeam; score: number }
    home: { team: MlbTeam; score: number }
  }
  venue?: { id: number; name: string }
}

class MlbStatsApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    })
  }

  private async request<T>(endpoint: string): Promise<T | null> {
    try {
      await mlbRateLimiter.throttle()
      const response = await this.client.get(endpoint)
      return response.data as T
    } catch (error: any) {
      console.warn(`MLB API error for ${endpoint}:`, error.message)
      return null
    }
  }

  // Get all teams. sportId=1 restricts to the real 30 active MLB clubs — omitting it
  // (as the code previously did) returns ~990 rows across every minor-league/historical
  // affiliate MLB Stats API tracks, which is real data but not what "MLB teams" means here.
  async getTeams(season?: number, sportId: number = 1): Promise<MlbTeam[]> {
    const year = season || new Date().getFullYear()
    const result = await this.request<any>(`/teams?season=${year}&sportId=${sportId}`)
    return result?.teams || []
  }

  // Get specific team
  async getTeam(teamId: number): Promise<MlbTeam | null> {
    const result = await this.request<any>(`/teams/${teamId}`)
    return result?.teams?.[0] || null
  }

  // Get team roster. The dedicated /roster endpoint is required — `?hydrate=roster` on
  // /teams/{id} (used previously) silently omits the roster field entirely (verified live).
  async getTeamRoster(teamId: number): Promise<any[]> {
    const result = await this.request<any>(`/teams/${teamId}/roster`)
    return result?.roster || []
  }

  // Get standings
  async getStandings(season?: number): Promise<any> {
    const year = season || new Date().getFullYear()
    return this.request<any>(`/standings?leagueId=103,104&season=${year}`)
  }

  // Get schedule. /schedule requires sportId — omitting it is what caused the prior 400 error.
  async getSchedule(teamId?: number, season?: number): Promise<MlbGame[]> {
    const year = season || new Date().getFullYear()
    const endpoint = teamId
      ? `/schedule?teamId=${teamId}&sportId=1&season=${year}`
      : `/schedule?sportId=1&season=${year}`
    const result = await this.request<any>(endpoint)
    const dates = result?.dates || []
    return dates.flatMap((d: any) => d.games || [])
  }

  // Get divisions
  async getDivisions(): Promise<any[]> {
    const result = await this.request<any>('/divisions')
    return result?.divisions || []
  }

  // Get leagues
  async getLeagues(): Promise<any[]> {
    const result = await this.request<any>('/leagues')
    return result?.leagues || []
  }

  // Get game data
  async getGame(gameId: number): Promise<any> {
    return this.request<any>(`/game/${gameId}`)
  }

  // Get live game data
  async getLiveGame(gameId: number): Promise<any> {
    return this.request<any>(`/game/${gameId}/live`)
  }

  // Get game box score
  async getGameBoxscore(gameId: number): Promise<any> {
    const result = await this.request<any>(`/game/${gameId}`)
    return result?.liveData?.boxscore || null
  }

  // Get team stats
  async getTeamStats(teamId: number, season?: number): Promise<any> {
    const year = season || new Date().getFullYear()
    return this.request<any>(`/teams/${teamId}?season=${year}&hydrate=stats`)
  }

  getStatus(): Record<string, any> {
    return {
      name: 'MLB Stats API',
      baseUrl: BASE_URL,
      auth: 'NO KEY REQUIRED',
      sport: 'baseball',
      rateLimit: 'Very Generous (unlimited)',
      status: 'operational',
    }
  }
}

export const mlbStatsApiClient = new MlbStatsApiClient()
