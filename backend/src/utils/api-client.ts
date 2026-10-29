import { providerService } from '../services/provider.service'
import { config } from '../config'

/**
 * High-level API client for fetching sports data
 * Automatically handles fallback between providers
 */
export class SportsAPIClient {
  /**
   * Get matches/fixtures from any sport with fallback
   */
  async getMatches(sport: string = 'football', params?: any) {
    return providerService.executeWithFallback('matches', sport, params)
  }

  /**
   * Get competitions for a sport
   */
  async getCompetitions(sport: string = 'football', params?: any) {
    return providerService.executeWithFallback('competitions', sport, params)
  }

  /**
   * Get flashscore data (live matches)
   */
  async getFlashscore() {
    return providerService.executeWithFallback('flashscore', 'football')
  }

  /**
   * Get team data
   */
  async getTeams(sport: string = 'football', params?: any) {
    return providerService.executeWithFallback('teams', sport, params)
  }

  /**
   * Get standings/table
   */
  async getStandings(competitionId: string, season: number) {
    return providerService.executeWithFallback('standings', 'football', {
      competitionId,
      season,
    })
  }

  /**
   * Get match statistics
   */
  async getStatistics(matchId: string) {
    return providerService.executeWithFallback('statistics', 'football', {
      matchId,
    })
  }

  /**
   * Get provider health status
   */
  getProviderStatus() {
    return providerService.getProviderStatus()
  }

  /**
   * Get enabled providers
   */
  getEnabledProviders() {
    return providerService.getEnabledProviders()
  }

  /**
   * Get provider priority for sport
   */
  getProviderPriority(sport: string) {
    return config.providerPriority[sport as keyof typeof config.providerPriority] || []
  }
}

export const sportsAPIClient = new SportsAPIClient()
