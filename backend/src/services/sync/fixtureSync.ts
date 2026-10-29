import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { getProvider } from '../provider/providerManager'

export interface FixtureSyncResult {
  success: boolean
  inserted: number
  updated: number
  duration: number
  error?: string
}

export async function syncFixturesFromTheSportsDb(leagues: number[]): Promise<FixtureSyncResult> {
  const startTime = Date.now()

  try {
    const sportId = 1
    const competitionId = 1 // Default competition
    const seasonId = 1 // Default season
    const provider = getProvider()

    let inserted = 0
    let updated = 0

    for (const leagueId of leagues) {
      if (!quotaManager.canRequest('P2')) break

      try {
        const fixtures = await provider.getFixtures(leagueId, 2025)
        quotaManager.consumeRequest()

        const fixtureList = Array.isArray(fixtures) ? fixtures : []

        for (const event of fixtureList.slice(0, 100)) {
          const eventId = event.id || event.idEvent
          if (!eventId || !event.teams?.home?.id || !event.teams?.away?.id) continue

          const exists = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM events WHERE external_id = ?',
              [String(eventId)],
              (err: any, row: any) => resolve(row)
            )
          })

          // Get team IDs
          const homeTeam = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM teams WHERE slug LIKE ?',
              [`%${event.strHomeTeam.toLowerCase()}%`],
              (err, row) => resolve(row)
            )
          })

          const awayTeam = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM teams WHERE slug LIKE ?',
              [`%${event.strAwayTeam.toLowerCase()}%`],
              (err, row) => resolve(row)
            )
          })

          if (!homeTeam || !awayTeam) continue

          const startTime = event.dateEvent ? `${event.dateEvent}T${event.strTime || '00:00:00'}` : new Date().toISOString()

          if (exists) {
            // UPDATE
            await new Promise<void>((resolve) => {
              db.run(
                `UPDATE events SET status = ?, updated_at = datetime('now')
                 WHERE id = ?`,
                [determineStatus(event.strStatus), exists.id],
                () => {
                  updated++
                  resolve()
                }
              )
            })
          } else {
            // INSERT
            await new Promise<void>((resolve) => {
              db.run(
                `INSERT INTO events (sport_id, competition_id, season_id, external_id, provider, status, start_time)
                 VALUES (?, ?, ?, ?, 'thesportsdb', ?, ?)`,
                [sportId, competitionId, seasonId, String(event.idEvent), determineStatus(event.strStatus), startTime],
                function() {
                  if (this.lastID) {
                    inserted++
                  }
                  resolve()
                }
              )
            })
          }
        }
      } catch (error) {
        console.warn(`Error syncing fixtures for league ${leagueId}:`, (error as any).message)
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

function determineStatus(theSportsDbStatus: string): string {
  if (!theSportsDbStatus) return 'NS'
  if (theSportsDbStatus.includes('Final')) return 'FT'
  if (theSportsDbStatus.includes('Half')) return 'HT'
  if (theSportsDbStatus.includes('Live')) return 'LIVE'
  if (theSportsDbStatus.includes('Postp')) return 'PPD'
  return 'NS'
}
