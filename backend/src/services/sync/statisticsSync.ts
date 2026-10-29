import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'

export interface StatisticsSyncResult {
  success: boolean
  inserted: number
  updated: number
  duration: number
  error?: string
}

export async function syncStatisticsForFixtures(fixtureIds: number[]): Promise<StatisticsSyncResult> {
  const startTime = Date.now()

  try {
    let inserted = 0
    let updated = 0

    for (const fixtureId of fixtureIds) {
      if (!quotaManager.canRequest('P2')) break

      try {
        // Get fixture with team IDs
        const fixture = await new Promise<any>((resolve) => {
          db.get(
            `SELECT e.id, ep.participant_id FROM events e
             LEFT JOIN event_participants ep ON e.id = ep.event_id AND ep.role = 'home'
             WHERE e.id = ?`,
            [fixtureId],
            (err, row) => resolve(row)
          )
        })

        if (!fixture) continue
        quotaManager.consumeRequest()

        // Generate mock statistics
        const stats = [
          {
            fixtureId,
            teamId: 1,
            shotsOnGoal: Math.floor(Math.random() * 15),
            shotsOffGoal: Math.floor(Math.random() * 10),
            totalShots: Math.floor(Math.random() * 25),
            fouls: Math.floor(Math.random() * 20),
            cornerKicks: Math.floor(Math.random() * 12),
            ballPossession: Math.floor(Math.random() * 60) + 30,
            yellowCards: Math.floor(Math.random() * 5),
            totalPasses: Math.floor(Math.random() * 400) + 200,
            passAccuracy: Math.floor(Math.random() * 30) + 65,
          },
          {
            fixtureId,
            teamId: 2,
            shotsOnGoal: Math.floor(Math.random() * 15),
            shotsOffGoal: Math.floor(Math.random() * 10),
            totalShots: Math.floor(Math.random() * 25),
            fouls: Math.floor(Math.random() * 20),
            cornerKicks: Math.floor(Math.random() * 12),
            ballPossession: Math.floor(Math.random() * 60) + 30,
            yellowCards: Math.floor(Math.random() * 5),
            totalPasses: Math.floor(Math.random() * 400) + 200,
            passAccuracy: Math.floor(Math.random() * 30) + 65,
          },
        ]

        for (const stat of stats) {
          const exists = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM event_statistics WHERE event_id = ? AND participant_id = ?',
              [stat.fixtureId, stat.teamId],
              (err, row) => resolve(row)
            )
          })

          if (exists) {
            updated++
          } else {
            await new Promise<void>((resolve) => {
              db.run(
                `INSERT INTO event_statistics (event_id, participant_id, metric, value)
                 VALUES (?, ?, 'shots_on_goal', ?)`,
                [stat.fixtureId, stat.teamId, stat.shotsOnGoal],
                () => {
                  // Insert other stats
                  const metrics = [
                    { key: 'shots_off_goal', val: stat.shotsOffGoal },
                    { key: 'total_shots', val: stat.totalShots },
                    { key: 'fouls', val: stat.fouls },
                    { key: 'corner_kicks', val: stat.cornerKicks },
                    { key: 'possession', val: stat.ballPossession },
                    { key: 'yellow_cards', val: stat.yellowCards },
                    { key: 'total_passes', val: stat.totalPasses },
                    { key: 'pass_accuracy', val: stat.passAccuracy },
                  ]

                  let completed = 0
                  metrics.forEach((m) => {
                    db.run(
                      `INSERT INTO event_statistics (event_id, participant_id, metric, value)
                       VALUES (?, ?, ?, ?)`,
                      [stat.fixtureId, stat.teamId, m.key, m.val],
                      () => {
                        completed++
                        if (completed === metrics.length) {
                          inserted++
                          resolve()
                        }
                      }
                    )
                  })
                }
              )
            })
          }
        }
      } catch (error) {
        console.warn(`Error syncing stats for fixture ${fixtureId}:`, (error as any).message)
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
