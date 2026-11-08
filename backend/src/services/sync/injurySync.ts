throw new Error('Legacy synthetic-data service disabled; use verified provider import jobs')
import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { getProvider } from '../provider/providerManager'

export interface InjurySyncResult {
  success: boolean
  inserted: number
  updated: number
  duration: number
  error?: string
}

export async function syncInjuriesForLeagues(leagueIds: number[]): Promise<InjurySyncResult> {
  const startTime = Date.now()

  try {
    let inserted = 0
    let updated = 0

    for (const leagueId of leagueIds) {
      if (!quotaManager.canRequest('P3')) break

      try {
        quotaManager.consumeRequest()

        // Get random players that could have injuries
        const players = await new Promise<any[]>((resolve) => {
          db.all(
            'SELECT id, slug FROM players ORDER BY RANDOM() LIMIT 5',
            [],
            (err, rows) => resolve(rows || [])
          )
        })

        // Get random teams
        const teams = await new Promise<any[]>((resolve) => {
          db.all(
            'SELECT id FROM teams ORDER BY RANDOM() LIMIT 5',
            [],
            (err, rows) => resolve(rows || [])
          )
        })

        // Create injury records randomly
        for (let i = 0; i < Math.min(players.length, 3); i++) {
          const player = players[i]
          const team = teams[Math.floor(Math.random() * teams.length)]

          if (!player || !team) continue

          const injuries = ['Muscle strain', 'Ankle injury', 'Hamstring', 'Groin', 'Knee injury']
          const reason = injuries[Math.floor(Math.random() * injuries.length)]

          const externalId = `injury-${player.id}-${team.id}`

          const exists = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM injuries WHERE player_id = ? AND status = ?',
              [player.id, 'active'],
              (err, row) => resolve(row)
            )
          })

          if (!exists) {
            await new Promise<void>((resolve) => {
              const today = new Date()
              const endDate = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) // 2 weeks

              db.run(
                `INSERT INTO injuries (player_id, team_id, type, reason, start_date, end_date, status)
                 VALUES (?, ?, 'injury', ?, datetime('now'), ?, 'active')`,
                [player.id, team.id, reason, endDate.toISOString().split('T')[0]],
                () => {
                  inserted++
                  resolve()
                }
              )
            })
          }
        }
      } catch (error) {
        console.warn(`Error syncing injuries for league ${leagueId}:`, (error as any).message)
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
