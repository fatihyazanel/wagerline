import { apiFootballClient } from './apiFootball/client'
import { theSportsDbClient } from './theSportsDb/client'
import { espnApiClient } from './espnApi/client'
import { nhlApiClient } from './nhlApi/client'
import { mlbStatsApiClient } from './mlbStatsApi/client'
import { ergastApiClient } from './ergastApi/client'
import { tennisDataApiClient } from './tennisDataApi/client'

/**
 * Provider Registry - Maps sports to their data providers
 * Each sport can have multiple providers (primary + fallbacks)
 */

interface ProviderEntry {
  primary: any
  fallbacks?: any[]
  name: string
  auth: boolean
}

// Map of all providers by sport
const sportProviders: Record<string, ProviderEntry> = {
  // Football - PRIMARY: API-Football, FALLBACK: TheSportsDB
  football: {
    primary: apiFootballClient,
    fallbacks: [theSportsDbClient],
    name: 'Football (Soccer)',
    auth: false,
  },

  // Basketball - PRIMARY: ESPN
  basketball: {
    primary: espnApiClient,
    fallbacks: [],
    name: 'Basketball (NBA, EuroLeague)',
    auth: false,
  },

  // American Football - PRIMARY: ESPN
  americanfootball: {
    primary: espnApiClient,
    fallbacks: [],
    name: 'American Football (NFL)',
    auth: false,
  },

  // Ice Hockey - PRIMARY: NHL, FALLBACK: ESPN
  icehockey: {
    primary: nhlApiClient,
    fallbacks: [espnApiClient],
    name: 'Ice Hockey (NHL)',
    auth: false,
  },

  // Baseball - PRIMARY: MLB Stats API, FALLBACK: ESPN
  baseball: {
    primary: mlbStatsApiClient,
    fallbacks: [espnApiClient],
    name: 'Baseball (MLB)',
    auth: false,
  },

  // Formula 1 - PRIMARY: Ergast
  formula1: {
    primary: ergastApiClient,
    fallbacks: [],
    name: 'Formula 1',
    auth: false,
  },

  // Tennis - PRIMARY: Tennis Data API
  tennis: {
    primary: tennisDataApiClient,
    fallbacks: [],
    name: 'Tennis (ATP, WTA)',
    auth: false,
  },

  // Golf - PRIMARY: ESPN
  golf: {
    primary: espnApiClient,
    fallbacks: [],
    name: 'Golf (PGA Tour)',
    auth: false,
  },

  // MMA / Boxing - PRIMARY: ESPN
  mma: {
    primary: espnApiClient,
    fallbacks: [],
    name: 'MMA / Boxing (UFC)',
    auth: false,
  },

  // Rugby - PRIMARY: ESPN
  rugby: {
    primary: espnApiClient,
    fallbacks: [],
    name: 'Rugby',
    auth: false,
  },

  // ⏳ Phase 2 - To be implemented
  cricket: {
    primary: null,
    fallbacks: [],
    name: 'Cricket (IPL)',
    auth: false,
  },

  volleyball: {
    primary: null,
    fallbacks: [],
    name: 'Volleyball',
    auth: false,
  },
}

/**
 * Get provider for a specific sport
 * Tries primary first, then fallbacks
 */
export function getProviderForSport(sport: string): any {
  const entry = sportProviders[sport.toLowerCase()]

  if (!entry) {
    throw new Error(`Sport '${sport}' not supported`)
  }

  if (!entry.primary) {
    throw new Error(`No provider available for ${sport}`)
  }

  return entry.primary
}

/**
 * Get all fallback providers for a sport
 */
export function getFallbackProvidersForSport(sport: string): any[] {
  const entry = sportProviders[sport.toLowerCase()]
  return entry?.fallbacks || []
}

/**
 * Get all available sports
 */
export function getAvailableSports(): Array<{ slug: string; name: string }> {
  return Object.entries(sportProviders)
    .filter(([_, entry]) => entry.primary !== null)
    .map(([slug, entry]) => ({
      slug,
      name: entry.name,
    }))
}

/**
 * Get all planned sports (including unimplemented)
 */
export function getAllPlannedSports(): Array<{
  slug: string
  name: string
  status: 'implemented' | 'planned'
}> {
  return Object.entries(sportProviders).map(([slug, entry]) => ({
    slug,
    name: entry.name,
    status: entry.primary !== null ? 'implemented' : 'planned',
  }))
}

/**
 * Get provider status for all sports
 */
export function getProviderStatus(): Record<string, any> {
  const status: Record<string, any> = {}

  for (const [sport, entry] of Object.entries(sportProviders)) {
    status[sport] = {
      name: entry.name,
      implemented: entry.primary !== null,
      primary: entry.primary?.getStatus?.() || null,
      fallbacks: entry.fallbacks?.map((p) => p.getStatus?.()) || [],
      authRequired: entry.auth,
    }
  }

  return status
}

/**
 * Test connectivity of all providers
 */
export async function testAllProviders(): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}

  // Test Football
  try {
    await apiFootballClient.getLeagues()
    results['football'] = true
  } catch {
    results['football'] = false
  }

  // Test Basketball
  try {
    await espnApiClient.getBasketballTeams()
    results['basketball'] = true
  } catch {
    results['basketball'] = false
  }

  // Test American Football
  try {
    await espnApiClient.getNflTeams()
    results['americanfootball'] = true
  } catch {
    results['americanfootball'] = false
  }

  // Test Ice Hockey
  try {
    await nhlApiClient.getTeams()
    results['icehockey'] = true
  } catch {
    results['icehockey'] = false
  }

  // Test Baseball
  try {
    await mlbStatsApiClient.getTeams()
    results['baseball'] = true
  } catch {
    results['baseball'] = false
  }

  // Test Formula 1
  try {
    await ergastApiClient.getDrivers(2025)
    results['formula1'] = true
  } catch {
    results['formula1'] = false
  }

  // Test Tennis
  try {
    await tennisDataApiClient.getAtpRankings()
    results['tennis'] = true
  } catch {
    results['tennis'] = false
  }

  return results
}

// Export provider instances for direct access
export {
  apiFootballClient,
  theSportsDbClient,
  espnApiClient,
  nhlApiClient,
  mlbStatsApiClient,
  ergastApiClient,
  tennisDataApiClient,
}
