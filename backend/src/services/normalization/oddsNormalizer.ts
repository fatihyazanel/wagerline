export interface NormalizedOdds {
  provider: string
  externalId: string
  fixtureId: number
  bookmaker: string
  market: string
  betType: string
  selection: string
  odds: number
  isLive: boolean
  timestamp: string
}

export function normalizeOddsFromApiFootball(fixtureId: number, oddsData: any[]): NormalizedOdds[] {
  return oddsData.flatMap((odd: any) =>
    (odd.values || []).map((value: any) => ({
      provider: 'api-football',
      externalId: `${fixtureId}-${odd.bookmaker}-${value.value}`,
      fixtureId,
      bookmaker: odd.bookmaker,
      market: odd.name || 'match_winner',
      betType: value.value || 'home',
      selection: value.value || 'home',
      odds: value.odd ? parseFloat(value.odd) : 0,
      isLive: false,
      timestamp: new Date().toISOString(),
    }))
  )
}

export function normalizeOddsFromTheSportsDb(fixtureId: number, oddsData: any): NormalizedOdds[] {
  const odds: NormalizedOdds[] = []

  if (oddsData.dblHomeOdds) {
    odds.push({
      provider: 'thesportsdb',
      externalId: `${fixtureId}-home`,
      fixtureId,
      bookmaker: 'thesportsdb',
      market: 'match_winner',
      betType: 'home',
      selection: 'home',
      odds: parseFloat(oddsData.dblHomeOdds),
      isLive: false,
      timestamp: new Date().toISOString(),
    })
  }

  if (oddsData.dblDrawOdds) {
    odds.push({
      provider: 'thesportsdb',
      externalId: `${fixtureId}-draw`,
      fixtureId,
      bookmaker: 'thesportsdb',
      market: 'match_winner',
      betType: 'draw',
      selection: 'draw',
      odds: parseFloat(oddsData.dblDrawOdds),
      isLive: false,
      timestamp: new Date().toISOString(),
    })
  }

  if (oddsData.dblAwayOdds) {
    odds.push({
      provider: 'thesportsdb',
      externalId: `${fixtureId}-away`,
      fixtureId,
      bookmaker: 'thesportsdb',
      market: 'match_winner',
      betType: 'away',
      selection: 'away',
      odds: parseFloat(oddsData.dblAwayOdds),
      isLive: false,
      timestamp: new Date().toISOString(),
    })
  }

  return odds
}

export function validateOdds(odds: NormalizedOdds): boolean {
  return !!(odds.fixtureId && odds.bookmaker && odds.odds > 0)
}
