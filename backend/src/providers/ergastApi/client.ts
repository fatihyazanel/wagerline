import axios, { AxiosInstance } from 'axios'
import { SimpleRateLimiter } from '../../utils/simpleRateLimiter'

// ergast.com shut down permanently at the end of 2024; api.jolpi.ca is its official
// community-run successor, mirroring the exact same request/response format.
const BASE_URL = 'https://api.jolpi.ca/ergast/f1'

// Dedicated limiter — NOT the shared quotaManager, whose 100/day + 10/min budget is tuned for
// API-Football and can get exhausted by other sports' sync calls running earlier in the same
// job, silently starving F1 even though Jolpica's real limit is a generous 4 req/sec.
const jolpicaRateLimiter = new SimpleRateLimiter(300)

interface F1Driver {
  driverId: string
  permanentNumber: string
  code: string
  givenName: string
  familyName: string
  dateOfBirth: string
  nationality: string
}

interface F1Constructor {
  constructorId: string
  name: string
  nationality: string
}

interface F1Race {
  season: string
  round: string
  raceName: string
  date: string
  time: string
  circuit: { circuitId: string; circuitName: string }
}

class ErgastApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    })
  }

  private async request<T>(endpoint: string): Promise<T | null> {
    try {
      await jolpicaRateLimiter.throttle()
      const response = await this.client.get(endpoint, {
        params: { limit: 1000 },
      })
      return response.data as T
    } catch (error: any) {
      console.warn(`Ergast API error for ${endpoint}:`, error.message)
      return null
    }
  }

  // Get drivers for season
  async getDrivers(season: number = 2025): Promise<F1Driver[]> {
    const result = await this.request<any>(
      `/${season}/drivers.json`
    )
    return result?.MRData?.DriverTable?.Drivers || []
  }

  // Get constructors for season
  async getConstructors(season: number = 2025): Promise<F1Constructor[]> {
    const result = await this.request<any>(
      `/${season}/constructors.json`
    )
    return result?.MRData?.ConstructorTable?.Constructors || []
  }

  // Get races for season
  async getRaces(season: number = 2025): Promise<F1Race[]> {
    const result = await this.request<any>(
      `/${season}/races.json`
    )
    return result?.MRData?.RaceTable?.Races || []
  }

  // Get driver standings for season
  async getDriverStandings(season: number = 2025): Promise<any> {
    const result = await this.request<any>(
      `/${season}/driverstandings.json`
    )
    return result?.MRData?.StandingsTable?.StandingsLists?.[0] || null
  }

  // Get constructor standings for season
  async getConstructorStandings(season: number = 2025): Promise<any> {
    const result = await this.request<any>(
      `/${season}/constructorstandings.json`
    )
    return result?.MRData?.StandingsTable?.StandingsLists?.[0] || null
  }

  // Get qualifying results for race
  async getQualifyingResults(
    season: number = 2025,
    round: number = 1
  ): Promise<any> {
    const result = await this.request<any>(
      `/${season}/${round}/qualifying.json`
    )
    return result?.MRData?.RaceTable?.Races?.[0]?.QualifyingResults || []
  }

  // Get race results
  async getRaceResults(
    season: number = 2025,
    round: number = 1
  ): Promise<any> {
    const result = await this.request<any>(
      `/${season}/${round}/results.json`
    )
    return result?.MRData?.RaceTable?.Races?.[0]?.Results || []
  }

  // Get pit stops for race
  async getPitStops(
    season: number = 2025,
    round: number = 1
  ): Promise<any[]> {
    const result = await this.request<any>(
      `/${season}/${round}/pitstops.json`
    )
    return result?.MRData?.RaceTable?.Races?.[0]?.PitStops || []
  }

  // Get driver statistics
  async getDriverStats(driverId: string): Promise<any> {
    return this.request<any>(`/drivers/${driverId}.json`)
  }

  // Get circuits
  async getCircuits(season: number = 2025): Promise<any[]> {
    const result = await this.request<any>(
      `/${season}/circuits.json`
    )
    return result?.MRData?.CircuitTable?.Circuits || []
  }

  getStatus(): Record<string, any> {
    return {
      name: 'Jolpica F1 API (Ergast successor)',
      baseUrl: BASE_URL,
      auth: 'NO KEY REQUIRED',
      sport: 'formula1',
      rateLimit: '4 req/sec',
      dataType: 'Historical + Current Season',
      status: 'operational',
    }
  }
}

export const ergastApiClient = new ErgastApiClient()
