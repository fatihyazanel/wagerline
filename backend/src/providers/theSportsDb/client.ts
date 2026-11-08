import {config} from '../../config'
import axios from 'axios'
import { theSportsDbRateLimiter } from './rateLimiter'

const BASE_URL = `${config.providers.thesportsdb.baseUrl}/${config.providers.thesportsdb.apiKey}`

/**
 * TheSportsDB Client - FALLBACK PROVIDER
 * Note: TheSportsDB has limited real-time data and rate limits
 * Preferred to use API-Football when available
 */
export const theSportsDbClient = {
  async getLeagueEvents(leagueId: number): Promise<any[]> {
    const info = await this.getLeagueSeasonInfo(leagueId)
    if (!info) return []
    return this.getEventsBySeason(leagueId, info.strCurrentSeason)
  },
  async getLeagues(): Promise<any[]> {
    try {
      const { data } = await axios.get(`${BASE_URL}/all_leagues.php`, {
        timeout: 8000,
      })
      return data?.leagues || []
    } catch (error) {
      console.warn('TheSportsDB getLeagues error:', (error as any).message)
      return []
    }
  },

  async getTeams(leagueId: number, season: number = 2025): Promise<any[]> {
    try {
      await theSportsDbRateLimiter.throttle()
      const { data } = await axios.get(`${BASE_URL}/lookup_all_teams.php`, {
        params: { id: leagueId }, timeout: 8000,
      })
      return data?.teams || []
    } catch (error) {
      console.warn(`TheSportsDB getTeams error:`, (error as any).message)
      return []
    }
  },

  async getPlayers(teamId: number, season: number = 2025): Promise<any[]> {
    try {
      await theSportsDbRateLimiter.throttle()
      const { data } = await axios.get(`${BASE_URL}/lookup_all_players.php?id=${teamId}`, {
        timeout: 8000,
      })
      return data?.player || []
    } catch (error) {
      console.warn(`TheSportsDB getPlayers error:`, (error as any).message)
      return []
    }
  },

  // LEGACY/LIMITED: eventslast.php is not season-filterable and only returns a handful of
  // most-recent events. Use getEventsBySeason() below for real bulk season ingestion.
  async getFixtures(leagueId: number, season: number = 2025): Promise<any[]> {
    try {
      const { data } = await axios.get(`${BASE_URL}/eventslast.php?id=${leagueId}`, {
        timeout: 8000,
      })
      return data?.results || []
    } catch (error) {
      console.warn(`TheSportsDB getFixtures error:`, (error as any).message)
      return []
    }
  },

  // Real, verified: lookupleague.php returns per-league metadata including strCurrentSeason,
  // which lets callers avoid hardcoding a (potentially stale) season string.
  async getLeagueSeasonInfo(
    leagueId: number
  ): Promise<{ strSport: string; strLeague: string; strCurrentSeason: string } | null> {
    try {
      await theSportsDbRateLimiter.throttle()
      const { data } = await axios.get(`${BASE_URL}/lookupleague.php?id=${leagueId}`, {
        timeout: 8000,
      })
      const league = data?.leagues?.[0]
      if (!league?.strCurrentSeason) return null
      return {
        strSport: league.strSport,
        strLeague: league.strLeague,
        strCurrentSeason: league.strCurrentSeason,
      }
    } catch (error) {
      console.warn(`TheSportsDB getLeagueSeasonInfo error:`, (error as any).message)
      return null
    }
  },

  // Real, verified: eventsseason.php returns real bulk fixtures for a given league+season,
  // each including idHomeTeam/strHomeTeam/idAwayTeam/strAwayTeam/intHomeScore/intAwayScore.
  // Free tier caps the result at a small batch (~15) per call with no working pagination —
  // this is an accepted, documented limitation, not a bug to hide.
  async getEventsBySeason(leagueId: number, season: string): Promise<any[]> {
    try {
      await theSportsDbRateLimiter.throttle()
      const { data } = await axios.get(
        `${BASE_URL}/eventsseason.php?id=${leagueId}&s=${encodeURIComponent(season)}`,
        { timeout: 8000 }
      )
      return data?.events || []
    } catch (error) {
      console.warn(`TheSportsDB getEventsBySeason error:`, (error as any).message)
      return []
    }
  },

  // Real, verified: lookuptable.php returns real standings (intRank, intPlayed, intWin,
  // intDraw, intLoss, intGoalsFor, intGoalsAgainst, intPoints confirmed live for Premier League).
  async getLeagueTable(leagueId: number): Promise<any[]> {
    try {
      await theSportsDbRateLimiter.throttle()
      const { data } = await axios.get(`${BASE_URL}/lookuptable.php?l=${leagueId}`, {
        timeout: 8000,
      })
      return data?.table || []
    } catch (error) {
      console.warn(`TheSportsDB getLeagueTable error:`, (error as any).message)
      return []
    }
  },

  async getFixture(fixtureId: number): Promise<any | null> {
    await theSportsDbRateLimiter.throttle()
    const {data}=await axios.get(`${BASE_URL}/lookupevent.php`,{params:{id:fixtureId},timeout:8000})
    return data?.events?.[0]||null
  },
  async getFixtureEvents(fixtureId: number): Promise<any[]> {
    await theSportsDbRateLimiter.throttle()
    const {data}=await axios.get(`${BASE_URL}/lookuptimeline.php`,{params:{id:fixtureId},timeout:8000})
    return data?.timeline||[]
  },
  async getFixtureStatistics(fixtureId: number): Promise<any[]> {
    await theSportsDbRateLimiter.throttle()
    const {data}=await axios.get(`${BASE_URL}/lookupeventstats.php`,{params:{id:fixtureId},timeout:8000})
    return data?.eventstats||[]
  },
  async getFixturePlayers(fixtureId: number): Promise<any[]> {
    await theSportsDbRateLimiter.throttle()
    const {data}=await axios.get(`${BASE_URL}/lookuplineup.php`,{params:{id:fixtureId},timeout:8000})
    return data?.lineup||[]
  },

  async getStandings(leagueId: number, season: number = 2025): Promise<any | null> {
    try {
      // TheSportsDB league standings endpoint is limited
      console.warn('⚠️ TheSportsDB has limited standings data')
      return null
    } catch (error) {
      console.warn(`TheSportsDB getStandings error:`, (error as any).message)
      return null
    }
  },

  async getInjuries(leagueId: number, season: number = 2025): Promise<any | null> {
    try {
      // TheSportsDB doesn't provide injury data
      console.warn('⚠️ TheSportsDB does not provide injury information')
      return null
    } catch (error) {
      console.warn(`TheSportsDB getInjuries error:`, (error as any).message)
      return null
    }
  },

  async getOdds(fixtureId: number): Promise<any | null> {
    try {
      // TheSportsDB doesn't provide betting odds
      console.warn('⚠️ TheSportsDB does not provide odds data')
      return null
    } catch (error) {
      console.warn(`TheSportsDB getOdds error:`, (error as any).message)
      return null
    }
  },

  async getLiveOdds(fixtureId: number): Promise<any | null> {
    try {
      // TheSportsDB doesn't provide live odds
      console.warn('⚠️ TheSportsDB does not provide live odds')
      return null
    } catch (error) {
      console.warn(`TheSportsDB getLiveOdds error:`, (error as any).message)
      return null
    }
  },

  async getPrediction(fixtureId: number): Promise<any | null> {
    try {
      // TheSportsDB doesn't provide predictions
      console.warn('⚠️ TheSportsDB does not provide predictions')
      return null
    } catch (error) {
      console.warn(`TheSportsDB getPrediction error:`, (error as any).message)
      return null
    }
  },

  async getHeadToHead(teamA: number, teamB: number): Promise<any[]> {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/eventslast.php?id=${Math.max(teamA, teamB)}`,
        { timeout: 8000 }
      )
      return data?.results || []
    } catch (error) {
      console.warn(`TheSportsDB getHeadToHead error:`, (error as any).message)
      return []
    }
  },

  async getLiveFixtures(): Promise<any[]> {
    try {
      // TheSportsDB doesn't provide live fixtures API
      console.warn('⚠️ TheSportsDB does not provide live fixtures endpoint')
      return []
    } catch (error) {
      console.warn(`TheSportsDB getLiveFixtures error:`, (error as any).message)
      return []
    }
  },

  // LEGACY/BROKEN: lookup_all_teams.php ignores its id/name param on the free tier and always
  // returns the same static wrong data (verified live). Do not use for bulk team ingestion —
  // see upsertTeam() in syncComplete_AllSports.ts, which derives teams from event payloads.
  async searchTeam(teamName: string): Promise<any[]> {
    try {
      const { data } = await axios.get(`${BASE_URL}/lookup_all_teams.php?id=${teamName}`, {
        timeout: 8000,
      })
      return data?.teams || []
    } catch (error) {
      console.warn(`TheSportsDB searchTeam error:`, (error as any).message)
      return []
    }
  },
}
