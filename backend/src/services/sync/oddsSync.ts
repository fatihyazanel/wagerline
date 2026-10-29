import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { getProvider } from '../provider/providerManager'

export interface OddsSyncResult {
  success: boolean
  inserted: number
  updated: number
  duration: number
  error?: string
}

export async function syncOddsForFixtures(fixtureIds: number[]): Promise<OddsSyncResult> {
  const startTime = Date.now()

  try {
    let inserted = 0
    let updated = 0

    for (const fixtureId of fixtureIds) {
      if (!quotaManager.canRequest('P2')) break

      try {
        quotaManager.consumeRequest()

        // Generate mock odds from major bookmakers
        const bookmakers = ['Betfair', 'Bet365', 'William Hill', 'Paddy Power', '888sport']

        for (const bookmaker of bookmakers) {
          // Home win odds
          const homeOdds = (Math.random() * 2 + 1.2).toFixed(2)
          const drawOdds = (Math.random() * 1.5 + 2.8).toFixed(2)
          const awayOdds = (Math.random() * 3 + 2).toFixed(2)

          const odds = [
            {
              fixtureId,
              bookmaker,
              market: 'match_winner',
              selection: 'home',
              odds: parseFloat(homeOdds),
            },
            {
              fixtureId,
              bookmaker,
              market: 'match_winner',
              selection: 'draw',
              odds: parseFloat(drawOdds),
            },
            {
              fixtureId,
              bookmaker,
              market: 'match_winner',
              selection: 'away',
              odds: parseFloat(awayOdds),
            },
          ]

          for (const odd of odds) {
            const externalId = `${fixtureId}-${bookmaker}-${odd.selection}`

            const exists = await new Promise<any>((resolve) => {
              db.get(
                'SELECT id FROM betting_odds WHERE event_id = ? AND provider = ? AND selection = ?',
                [fixtureId, bookmaker, odd.selection],
                (err, row) => resolve(row)
              )
            })

            if (exists) {
              updated++
            } else {
              await new Promise<void>((resolve) => {
                db.run(
                  `INSERT INTO betting_odds (event_id, provider, bookmaker, market, selection, odds, timestamp)
                   VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
                  [fixtureId, 'external', bookmaker, odd.market, odd.selection, odd.odds],
                  () => {
                    inserted++
                    resolve()
                  }
                )
              })
            }
          }
        }
      } catch (error) {
        console.warn(`Error syncing odds for fixture ${fixtureId}:`, (error as any).message)
      }
    }

    return {
      success: true,
      inserted,
      updated,
      duration: Date.now() - startTime,
    }
  } catch (error) {
    return {
      success: false,
      inserted: 0,
      updated: 0,
      error: (error as any).message,
      duration: Date.now() - startTime,
    }
  }
}
