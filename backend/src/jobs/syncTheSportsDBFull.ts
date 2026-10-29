/**
 * THESPORTSDB COMPLETE SYNC
 * Ligler, takımlar, oyuncular, maçlar ve istatistikleri TheSportsDB'den çeker ve kaydeder
 */

import * as sqlite3 from 'sqlite3'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_PATH || './data/wagerline.db'
const db = new sqlite3.Database(dbPath)

const run = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err)
      else resolve({ lastID: this.lastID, changes: this.changes })
    })
  })
}

const get = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

const all = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows || [])
    })
  })
}

const api = axios.create({
  baseURL: 'https://www.thesportsdb.com/api/v1/json/123',
  timeout: 30000,
})

// Better rate limiting
let requestCount = 0
let lastResetTime = Date.now()
const MAX_REQUESTS_PER_MINUTE = 50

async function checkRateLimit() {
  const now = Date.now()
  if (now - lastResetTime > 60000) {
    requestCount = 0
    lastResetTime = now
  }

  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    const waitTime = 60000 - (now - lastResetTime)
    console.log(`⏳ Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`)
    await new Promise(resolve => setTimeout(resolve, waitTime))
    requestCount = 0
    lastResetTime = Date.now()
  }

  requestCount++
}

// ==================== UTILITIES ====================

async function getCountryId(countryName: string) {
  if (!countryName) return null
  const country = await get(
    'SELECT id FROM countries WHERE name = ? OR code = ?',
    [countryName, countryName.toUpperCase()]
  )
  return country?.id
}

async function getTeamId(teamName: string, sportId: number) {
  const slug = teamName.toLowerCase().replace(/\s+/g, '-')
  const team = await get(
    'SELECT id FROM teams WHERE slug = ? AND sport_id = ?',
    [slug, sportId]
  )
  return team?.id
}

function parseLineup(lineupString: string) {
  if (!lineupString) return []
  const players = lineupString.split(',').map((p: string) => p.trim()).filter((p: string) => p)
  return players
}

// ==================== LEAGUES/COMPETITIONS ====================

async function syncLeagues() {
  console.log('\n🔄 TheSportsDB Ligleri çekiliyor...')

  try {
    const leagueIds = [
      { name: 'Premier League', theSportsDbId: '133602', country: 'England' },
      { name: 'La Liga', theSportsDbId: '133603', country: 'Spain' },
      { name: 'Serie A', theSportsDbId: '133604', country: 'Italy' },
      { name: 'Bundesliga', theSportsDbId: '133605', country: 'Germany' },
      { name: 'Ligue 1', theSportsDbId: '133606', country: 'France' },
      { name: 'Turkish Super League', theSportsDbId: '133860', country: 'Turkey' },
      { name: 'UEFA Champions League', theSportsDbId: '133601', country: null },
    ]

    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) {
      console.log('  ⚠️  Football sport bulunamadı')
      return
    }

    for (const league of leagueIds) {
      try {
        const slug = league.name.toLowerCase().replace(/\s+/g, '-')
        const existing = await get(
          'SELECT id FROM competitions WHERE slug = ?',
          [slug]
        )

        if (!existing) {
          await run(
            `INSERT INTO competitions (name_key, slug, sport_id, external_provider, external_id, active, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              league.name,
              slug,
              sport.id,
              'thesportsdb',
              league.theSportsDbId,
              1,
              new Date().toISOString(),
            ]
          )
          console.log(`  ✅ ${league.name} eklendi`)
        } else {
          console.log(`  ℹ️  ${league.name} zaten var`)
        }
      } catch (err) {
        console.error(`  ❌ ${league.name}: ${err}`)
      }
    }
  } catch (error) {
    console.error('  ❌ Lig çekme hatası:', error instanceof Error ? error.message : error)
  }
}

// ==================== TEAMS ====================

async function syncTeams() {
  console.log('\n🔄 Takımlar çekiliyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) return

    const leagueIds = ['133602', '133603', '133604', '133605', '133606', '133860']

    let totalCreated = 0

    for (const leagueId of leagueIds) {
      try {
        await checkRateLimit()
        const response = await api.get(`/lookup_all_teams.php?id=${leagueId}`)
        const teams = response.data.teams || []

        for (const team of teams) {
          if (!team.strTeam) continue

          const slug = team.strTeam.toLowerCase().replace(/\s+/g, '-')
          const existing = await get(
            'SELECT id FROM teams WHERE slug = ? AND sport_id = ?',
            [slug, sport.id]
          )

          if (!existing) {
            const countryId = await getCountryId(team.strCountry)

            const result = await run(
              `INSERT INTO teams (slug, sport_id, external_id, logo_url, country_id, active, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                slug,
                sport.id,
                team.idTeam,
                team.strTeamLogo || null,
                countryId,
                1,
                new Date().toISOString(),
                new Date().toISOString(),
              ]
            )

            if (result.lastID) {
              // Add team translation
              await run(
                `INSERT INTO team_translations (team_id, language, name, created_at)
                 VALUES (?, ?, ?, ?)`,
                [result.lastID, 'en', team.strTeam, new Date().toISOString()]
              )

              // Add extended team info
              await run(
                `INSERT INTO team_extended_info (team_id, external_id, founded_year, badge_url, stadium_name, stadium_capacity, stadium_city, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  result.lastID,
                  team.idTeam,
                  team.intFormedYear ? parseInt(team.intFormedYear) : null,
                  team.strTeamBadge || null,
                  team.strStadium || null,
                  team.strStadiumCapacity ? parseInt(team.strStadiumCapacity) : null,
                  team.strStadiumLocation || null,
                  new Date().toISOString(),
                  new Date().toISOString(),
                ]
              )

              totalCreated++
              console.log(`  ✅ ${team.strTeam}`)
            }
          }
        }
      } catch (err) {
        console.error(`  ❌ League ${leagueId} çekme hatası:`, err instanceof Error ? err.message : err)
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log(`  📊 Toplam ${totalCreated} yeni takım eklendi`)
  } catch (error) {
    console.error('  ❌ Takım çekme hatası:', error instanceof Error ? error.message : error)
  }
}

// ==================== PLAYERS ====================

async function syncPlayers() {
  console.log('\n🔄 Oyuncular çekiliyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) return

    // Get all teams
    const teams = await all('SELECT id, external_id FROM teams WHERE sport_id = ? LIMIT 20', [sport.id])

    let totalCreated = 0

    for (const team of teams) {
      try {
        await checkRateLimit()
        const response = await api.get(`/lookup_all_players.php?id=${team.external_id}`)
        const players = response.data.player || []

        for (const player of players) {
          if (!player.strPlayer) continue

          const slug = player.strPlayer.toLowerCase().replace(/\s+/g, '-')
          const existing = await get(
            'SELECT id FROM players WHERE slug = ? AND sport_id = ?',
            [slug, sport.id]
          )

          if (!existing) {
            const countryId = await getCountryId(player.strNationality)

            const result = await run(
              `INSERT INTO players (slug, sport_id, external_id, image_url, country_id, position, active, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                slug,
                sport.id,
                player.idPlayer,
                player.strThumb || null,
                countryId,
                player.strPosition || null,
                1,
                new Date().toISOString(),
              ]
            )

            if (result.lastID) {
              // Add player translation
              await run(
                `INSERT INTO player_translations (player_id, language, name, created_at)
                 VALUES (?, ?, ?, ?)`,
                [result.lastID, 'en', player.strPlayer, new Date().toISOString()]
              )

              // Add extended player info
              await run(
                `INSERT INTO player_extended_info (player_id, external_id, height, weight, date_of_birth, nationality, cutout_image_url, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  result.lastID,
                  player.idPlayer,
                  player.intHeight ? parseInt(player.intHeight) : null,
                  player.intWeight ? parseInt(player.intWeight) : null,
                  player.dateBorn || null,
                  player.strNationality || null,
                  player.strCutout || null,
                  new Date().toISOString(),
                  new Date().toISOString(),
                ]
              )

              // Add player team assignment
              const season = await get('SELECT id FROM seasons WHERE is_current = 1 LIMIT 1')
              if (season) {
                await run(
                  `INSERT INTO player_team_assignments (player_id, team_id, season_id, position, shirt_number, is_active, created_at, updated_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
                    result.lastID,
                    team.id,
                    season.id,
                    player.strPosition || null,
                    player.intNumber ? parseInt(player.intNumber) : null,
                    1,
                    new Date().toISOString(),
                    new Date().toISOString(),
                  ]
                )
              }

              totalCreated++
            }
          }
        }
      } catch (err) {
        console.error(`  ❌ Team ${team.id} oyuncuları çekme hatası:`, err instanceof Error ? err.message : err)
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    console.log(`  📊 Toplam ${totalCreated} yeni oyuncu eklendi`)
  } catch (error) {
    console.error('  ❌ Oyuncu çekme hatası:', error instanceof Error ? error.message : error)
  }
}

// ==================== EVENTS/FIXTURES ====================

async function syncEvents() {
  console.log('\n🔄 Maçlar çekiliyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    const leagueIds = [
      { id: '133602', compId: 'premier-league' },
      { id: '133603', compId: 'la-liga' },
      { id: '133604', compId: 'serie-a' },
      { id: '133605', compId: 'bundesliga' },
      { id: '133606', compId: 'ligue-1' },
    ]

    if (!sport) return

    let totalCreated = 0

    for (const league of leagueIds) {
      try {
        const competition = await get(
          'SELECT id FROM competitions WHERE slug = ?',
          [league.compId]
        )

        if (!competition) continue

        await checkRateLimit()
        const response = await api.get(`/eventslast.php?id=${league.id}`)
        const events = response.data.results || []

        for (const event of events) {
          if (!event.idEvent || !event.strHomeTeam || !event.strAwayTeam) continue

          const existing = await get(
            'SELECT id FROM events WHERE external_id = ?',
            [event.idEvent]
          )

          if (!existing) {
            const homeTeamId = await getTeamId(event.strHomeTeam, sport.id)
            const awayTeamId = await getTeamId(event.strAwayTeam, sport.id)

            if (homeTeamId && awayTeamId) {
              const startTime = event.dateEvent && event.strTime
                ? new Date(`${event.dateEvent}T${event.strTime}:00Z`).toISOString()
                : null

              const result = await run(
                `INSERT INTO events (sport_id, competition_id, external_id, start_time, status, round, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  sport.id,
                  competition.id,
                  event.idEvent,
                  startTime,
                  event.strStatus ? event.strStatus.toLowerCase().includes('finished') ? 'finished' : 'scheduled' : 'scheduled',
                  event.intRound ? parseInt(event.intRound) : null,
                  new Date().toISOString(),
                  new Date().toISOString(),
                ]
              )

              if (result.lastID) {
                // Add event participants
                await run(
                  `INSERT INTO event_participants (event_id, participant_type, participant_id, role, created_at)
                   VALUES (?, ?, ?, ?, ?)`,
                  [result.lastID, 'team', homeTeamId, 'home', new Date().toISOString()]
                )

                await run(
                  `INSERT INTO event_participants (event_id, participant_type, participant_id, role, created_at)
                   VALUES (?, ?, ?, ?, ?)`,
                  [result.lastID, 'team', awayTeamId, 'away', new Date().toISOString()]
                )

                // Add scores if available
                if (event.intHomeScore !== undefined) {
                  await run(
                    `INSERT INTO event_scores (event_id, participant_id, score, created_at)
                     VALUES (?, ?, ?, ?)`,
                    [result.lastID, homeTeamId, parseInt(event.intHomeScore), new Date().toISOString()]
                  )
                }

                if (event.intAwayScore !== undefined) {
                  await run(
                    `INSERT INTO event_scores (event_id, participant_id, score, created_at)
                     VALUES (?, ?, ?, ?)`,
                    [result.lastID, awayTeamId, parseInt(event.intAwayScore), new Date().toISOString()]
                  )
                }

                // Add attendance
                if (event.intAttendance) {
                  await run(
                    `INSERT INTO event_attendance (event_id, attendance, created_at)
                     VALUES (?, ?, ?)`,
                    [result.lastID, parseInt(event.intAttendance), new Date().toISOString()]
                  )
                }

                // Add lineups if available
                if (event.strHomeTeamLineupGoalkeeper) {
                  const homeLineup = {
                    goalkeeper: event.strHomeTeamLineupGoalkeeper,
                    defense: event.strHomeTeamLineupDefense,
                    midfield: event.strHomeTeamLineupMidfield,
                    forward: event.strHomeTeamLineupForward,
                  }
                  await run(
                    `INSERT INTO event_lineups (event_id, team_id, lineup_json, lineup_type, created_at)
                     VALUES (?, ?, ?, ?, ?)`,
                    [result.lastID, homeTeamId, JSON.stringify(homeLineup), 'starting_xi', new Date().toISOString()]
                  )
                }

                if (event.strAwayTeamLineupGoalkeeper) {
                  const awayLineup = {
                    goalkeeper: event.strAwayTeamLineupGoalkeeper,
                    defense: event.strAwayTeamLineupDefense,
                    midfield: event.strAwayTeamLineupMidfield,
                    forward: event.strAwayTeamLineupForward,
                  }
                  await run(
                    `INSERT INTO event_lineups (event_id, team_id, lineup_json, lineup_type, created_at)
                     VALUES (?, ?, ?, ?, ?)`,
                    [result.lastID, awayTeamId, JSON.stringify(awayLineup), 'starting_xi', new Date().toISOString()]
                  )
                }

                totalCreated++
                console.log(`  ✅ ${event.strHomeTeam} vs ${event.strAwayTeam}`)
              }
            }
          }
        }
      } catch (err) {
        console.error(`  ❌ League ${league.id} maçları çekme hatası:`, err instanceof Error ? err.message : err)
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log(`  📊 Toplam ${totalCreated} yeni maç eklendi`)
  } catch (error) {
    console.error('  ❌ Maç çekme hatası:', error instanceof Error ? error.message : error)
  }
}

// ==================== STANDINGS ====================

async function syncStandings() {
  console.log('\n🔄 Sıralamalar çekiliyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    const leagueIds = [
      { id: '133602', compId: 'premier-league' },
      { id: '133603', compId: 'la-liga' },
      { id: '133604', compId: 'serie-a' },
      { id: '133605', compId: 'bundesliga' },
      { id: '133606', compId: 'ligue-1' },
    ]

    if (!sport) return

    let totalCreated = 0

    for (const league of leagueIds) {
      try {
        const competition = await get('SELECT id FROM competitions WHERE slug = ?', [league.compId])
        const season = await get('SELECT id FROM seasons WHERE is_current = 1 LIMIT 1')

        if (!competition || !season) continue

        await checkRateLimit()
        const response = await api.get(`/eventstand.php?id=${league.id}&season=2024-2025`)
        const table = response.data.table || []

        // Create standings record
        const standingsResult = await run(
          `INSERT INTO standings (competition_id, season_id, created_at)
           VALUES (?, ?, ?)`,
          [competition.id, season.id, new Date().toISOString()]
        )

        if (standingsResult.lastID) {
          for (const entry of table) {
            const teamId = await getTeamId(entry.name, sport.id)
            if (!teamId) continue

            await run(
              `INSERT INTO standing_entries (standing_id, team_id, position, played, won, drawn, lost, points, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                standingsResult.lastID,
                teamId,
                parseInt(entry.position || 0),
                parseInt(entry.played || 0),
                parseInt(entry.win || 0),
                parseInt(entry.draw || 0),
                parseInt(entry.loss || 0),
                parseInt(entry.total || 0),
                new Date().toISOString(),
              ]
            )
          }

          totalCreated++
          console.log(`  ✅ ${league.compId} sıralaması eklendi`)
        }
      } catch (err) {
        console.error(`  ❌ League ${league.id} sıralaması çekme hatası:`, err instanceof Error ? err.message : err)
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    console.log(`  📊 Toplam ${totalCreated} sıralama eklendi`)
  } catch (error) {
    console.error('  ❌ Sıralama çekme hatası:', error instanceof Error ? error.message : error)
  }
}

// ==================== MAIN ====================

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  THESPORTSDB - KAPSAMLI VERİ ÇEKME VE KAYDETME')
  console.log('='.repeat(70))

  try {
    await syncLeagues()
    await syncTeams()
    await syncPlayers()
    await syncEvents()
    await syncStandings()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ TheSportsDB verileri başarıyla çekildi ve kaydedildi!')
    console.log('='.repeat(70))

    process.exit(0)
  } catch (error) {
    console.error('❌ Hata:', error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    db.close()
  }
}

main()
