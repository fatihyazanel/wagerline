import { apiFootballClient } from '../../providers/apiFootball/client'
import { theSportsDbClient } from '../../providers/theSportsDb/client'
import type { SportsDataProvider } from '../../providers/SportsDataProvider'

type ProviderType = 'api-football' | 'thesportsdb'

class ProviderManager {
  private primary: ProviderType = 'api-football'
  private fallback: ProviderType = 'thesportsdb'
  private currentProvider: ProviderType = 'api-football'

  constructor() {
    this.selectProvider()
  }

  private selectProvider(): void {
    // Check if API-Football is configured
    if (apiFootballClient.isConfigured()) {
      this.currentProvider = 'api-football'
      console.log('✅ Using API-Football (PRIMARY)')
    } else {
      this.currentProvider = 'thesportsdb'
      console.log('⚠️ Using TheSportsDB (FALLBACK - API_FOOTBALL_KEY not set)')
    }
  }

  getProvider(): any {
    if (this.currentProvider === 'api-football') {
      return apiFootballClient
    }
    return theSportsDbClient
  }

  getCurrentProvider(): ProviderType {
    return this.currentProvider
  }

  setFallback(): void {
    if (this.currentProvider !== this.fallback) {
      console.log(`🔄 Switching to ${this.fallback}...`)
      this.currentProvider = this.fallback
    }
  }

  isPrimary(): boolean {
    return this.currentProvider === 'api-football'
  }

  isFallback(): boolean {
    return this.currentProvider === 'thesportsdb'
  }

  getStatus(): Record<string, any> {
    return {
      current: this.currentProvider,
      primary: this.primary,
      fallback: this.fallback,
      isPrimary: this.isPrimary(),
      apiFootballConfigured: apiFootballClient.isConfigured(),
      primaryStatus: apiFootballClient.getStatus(),
    }
  }
}

export const providerManager = new ProviderManager()

// Convenience function
export const getProvider = () => providerManager.getProvider()
export const getCurrentProviderType = () => providerManager.getCurrentProvider()
