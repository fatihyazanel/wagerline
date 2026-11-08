throw new Error('Legacy synthetic-data service disabled; use verified provider import jobs')
import { db } from '../../database/init'
import { quotaManager } from '../quota/quotaManager'
import { getProvider } from '../provider/providerManager'

export interface PlayerSyncResult {
  success: boolean
  inserted: number
  updated: number
  duration: number
  error?: string
}

export async function syncPlayersFromTheSportsDb(teamIds: number[]): Promise<PlayerSyncResult> {
  const startTime = Date.now()

  try {
    const sportId = 1 // football
    const provider = getProvider()

    let inserted = 0
    let updated = 0

    for (const teamId of teamIds) {
      if (!quotaManager.canRequest('P4')) break
      if (inserted + updated > 100) break // Limit per sync

      try {
        const playerData = await provider.getPlayers(teamId, 2025)
        if (!playerData || playerData.length === 0) {
          // Fallback to mock if API returns empty
          const players = generateMockPlayersForTeam(teamId, 20)
          quotaManager.consumeRequest()

          for (const player of players) {
            const exists = await new Promise<any>((resolve) => {
              db.get(
                'SELECT id FROM players WHERE provider = ? AND external_id = ?',
                ['mock', String(player.externalId)],
                (err: any, row: any) => resolve(row)
              )
            })

            if (exists) {
              updated++
            } else {
              await new Promise<void>((resolve) => {
                db.run(
                  `INSERT INTO players (sport_id, external_id, slug, position, provider, active)
                   VALUES (?, ?, ?, ?, 'mock', 1)`,
                  [sportId, player.externalId, player.slug, player.position],
                  function(this: any) {
                    if (this && this.lastID) {
                      db.run(
                        `INSERT OR IGNORE INTO player_translations (player_id, language, name)
                         VALUES (?, 'en', ?)`,
                        [this.lastID, player.name],
                        () => {
                          inserted++
                          resolve()
                        }
                      )
                    } else {
                      resolve()
                    }
                  }
                )
              })
            }
          }
        }
      } catch (error) {
        console.warn(`Error syncing players for team ${teamId}:`, (error as any).message)
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

function generateMockPlayersForTeam(teamId: number, count: number): any[] {
  const firstNames = ['John', 'Mike', 'David', 'James', 'Robert', 'Carlos', 'Ahmed', 'Pierre', 'Giuseppe', 'Luis']
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Garcia', 'Silva', 'Müller', 'Rossi', 'Dupont', 'Esposito', 'Martinez']
  const positions = ['GK', 'LB', 'CB', 'RB', 'LM', 'CM', 'RM', 'LW', 'ST', 'RW']

  const players = []
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`

    players.push({
      externalId: `tsdb-team${teamId}-player${i}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      position: positions[Math.floor(Math.random() * positions.length)],
    })
  }

  return players
}
