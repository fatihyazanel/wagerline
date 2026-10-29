import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { getProvider } from '../provider/providerManager'
import { normalizeTeamFromTheSportsDb, normalizeTeamFromApiFootball, validateTeam } from '../normalization/teamNormalizer'

interface SyncResult {
  success: boolean
  inserted: number
  updated: number
  error?: string
  duration: number
}

export async function syncTeamsFromTheSportsDb(): Promise<SyncResult> {
  const startTime = Date.now()

  try {
    const sportId = 1 // football
    const provider = getProvider()
    const leagues = [39, 140, 135, 78, 61, 203, 88] // League IDs from flow.md section 5

    let inserted = 0
    let updated = 0

    for (const leagueId of leagues) {
      if (!quotaManager.canRequest('P2')) {
        console.log('Quota limit reached, stopping team sync')
        break
      }

      try {
        const teamData = await provider.getTeams(leagueId, 2025)
        if (!teamData || teamData.length === 0) {
          console.log(`No teams found for league ${leagueId}`)
          continue
        }

        const teams = Array.isArray(teamData) ? teamData : [teamData]

        for (const apiTeam of teams) {
          // Determine provider and use appropriate normalizer
          let normalized: any
          let providerName: string

          // Try to detect provider based on response structure
          if (apiTeam.team?.id || apiTeam.venue) {
            // API-Football response
            normalized = normalizeTeamFromApiFootball(apiTeam)
            providerName = 'api-football'
          } else {
            // TheSportsDB response
            normalized = normalizeTeamFromTheSportsDb(apiTeam)
            providerName = 'thesportsdb'
          }

          if (!validateTeam(normalized)) continue

          // UPSERT logic
          const exists = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM teams WHERE provider = ? AND external_id = ?',
              [providerName, String(normalized.externalId)],
              (err: any, row: any) => resolve(row)
            )
          })

          if (exists) {
            // UPDATE
            await new Promise<void>((resolve) => {
              db.run(
                `UPDATE teams
                 SET logo_url = ?, country_id = ?, updated_at = datetime('now')
                 WHERE id = ?`,
                [normalized.logo, normalized.country, exists.id],
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
                `INSERT INTO teams (sport_id, external_id, slug, logo_url, country_id, active, provider)
                 VALUES (?, ?, ?, ?, ?, 1, ?)`,
                [sportId, normalized.externalId, normalized.slug, normalized.logo, normalized.country, providerName],
                function(this: any) {
                  if (this && this.lastID) {
                    inserted++
                    // Add team name translation
                    db.run(
                      `INSERT OR IGNORE INTO team_translations (team_id, language, name)
                       VALUES (?, 'en', ?)`,
                      [this.lastID, normalized.name],
                      () => resolve()
                    )
                  } else {
                    resolve()
                  }
                }
              )
            })
          }
        }
      } catch (error) {
        console.warn(`Error syncing league ${leagueId}:`, (error as any).message)
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
