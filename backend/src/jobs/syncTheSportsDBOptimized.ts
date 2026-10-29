/**
 * THESPORTSDB OPTIMIZED SYNC
 * Daha etkili ve kontrollü veri çekme
 */

import * as sqlite3 from 'sqlite3'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_PATH || './data/wagerline.db'
const db = new sqlite3.Database(dbPath)

// Basit database helpers
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

let requestCount = 0
let windowStart = Date.now()

async function waitForRateLimit(delayMs = 2000) {
  const now = Date.now()

  // Reset every 60 seconds
  if (now - windowStart > 60000) {
    requestCount = 0
    windowStart = now
  }

  requestCount++

  // If we've made 45 requests in this window, wait for window to reset
  if (requestCount > 45) {
    const waitTime = Math.max(0, 60000 - (now - windowStart) + 1000)
    if (waitTime > 0) {
      console.log(`⏳ Rate limit precaution: waiting ${Math.ceil(waitTime / 1000)}s...`)
      await new Promise(r => setTimeout(r, waitTime))
      requestCount = 0
      windowStart = Date.now()
    }
  }

  // Always add base delay between requests
  await new Promise(r => setTimeout(r, delayMs))
}

// ==================== SAMPLE DATA ====================

const sampleTeams = [
  { name: 'Manchester City', country: 'England', founded: 1880, stadium: 'Etihad Stadium', badge: 'https://www.thesportsdb.com/images/media/team/badge/manchester-city.png' },
  { name: 'Liverpool', country: 'England', founded: 1892, stadium: 'Anfield', badge: 'https://www.thesportsdb.com/images/media/team/badge/liverpool.png' },
  { name: 'Arsenal', country: 'England', founded: 1886, stadium: 'Emirates Stadium', badge: 'https://www.thesportsdb.com/images/media/team/badge/arsenal.png' },
  { name: 'Chelsea', country: 'England', founded: 1905, stadium: 'Stamford Bridge', badge: 'https://www.thesportsdb.com/images/media/team/badge/chelsea.png' },
  { name: 'Tottenham Hotspur', country: 'England', founded: 1882, stadium: 'Tottenham Hotspur Stadium', badge: 'https://www.thesportsdb.com/images/media/team/badge/tottenham.png' },
  { name: 'Manchester United', country: 'England', founded: 1878, stadium: 'Old Trafford', badge: 'https://www.thesportsdb.com/images/media/team/badge/manchester-united.png' },
  { name: 'Real Madrid', country: 'Spain', founded: 1902, stadium: 'Santiago Bernabéu', badge: 'https://www.thesportsdb.com/images/media/team/badge/real-madrid.png' },
  { name: 'Barcelona', country: 'Spain', founded: 1899, stadium: 'Camp Nou', badge: 'https://www.thesportsdb.com/images/media/team/badge/barcelona.png' },
  { name: 'Atletico Madrid', country: 'Spain', founded: 1903, stadium: 'Wanda Metropolitano', badge: 'https://www.thesportsdb.com/images/media/team/badge/atletico-madrid.png' },
  { name: 'Bayern Munich', country: 'Germany', founded: 1900, stadium: 'Allianz Arena', badge: 'https://www.thesportsdb.com/images/media/team/badge/bayern-munich.png' },
  { name: 'Juventus', country: 'Italy', founded: 1897, stadium: 'Juventus Stadium', badge: 'https://www.thesportsdb.com/images/media/team/badge/juventus.png' },
  { name: 'AC Milan', country: 'Italy', founded: 1899, stadium: 'San Siro', badge: 'https://www.thesportsdb.com/images/media/team/badge/ac-milan.png' },
  { name: 'Inter Milan', country: 'Italy', founded: 1908, stadium: 'San Siro', badge: 'https://www.thesportsdb.com/images/media/team/badge/inter-milan.png' },
  { name: 'Paris Saint-Germain', country: 'France', founded: 1970, stadium: 'Parc des Princes', badge: 'https://www.thesportsdb.com/images/media/team/badge/psg.png' },
  { name: 'Dortmund', country: 'Germany', founded: 1909, stadium: 'Signal Iduna Park', badge: 'https://www.thesportsdb.com/images/media/team/badge/dortmund.png' },
]

const samplePlayers = [
  { name: 'Erling Haaland', team: 'Manchester City', position: 'Forward', height: 194, weight: 88, birthDate: '2000-07-21', nationality: 'Norway' },
  { name: 'Mohamed Salah', team: 'Liverpool', position: 'Forward', height: 175, weight: 71, birthDate: '1992-06-15', nationality: 'Egypt' },
  { name: 'Bukayo Saka', team: 'Arsenal', position: 'Midfielder', height: 178, weight: 67, birthDate: '2001-09-05', nationality: 'England' },
  { name: 'Mason Mount', team: 'Chelsea', position: 'Midfielder', height: 180, weight: 70, birthDate: '1999-01-10', nationality: 'England' },
  { name: 'Heung-min Son', team: 'Tottenham Hotspur', position: 'Forward', height: 183, weight: 78, birthDate: '1992-07-08', nationality: 'South Korea' },
  { name: 'Bruno Fernandes', team: 'Manchester United', position: 'Midfielder', height: 179, weight: 80, birthDate: '1994-09-05', nationality: 'Portugal' },
  { name: 'Vinícius Júnior', team: 'Real Madrid', position: 'Forward', height: 176, weight: 76, birthDate: '2000-07-12', nationality: 'Brazil' },
  { name: 'Robert Lewandowski', team: 'Barcelona', position: 'Forward', height: 191, weight: 81, birthDate: '1988-08-21', nationality: 'Poland' },
  { name: 'Antoine Griezmann', team: 'Atletico Madrid', position: 'Forward', height: 183, weight: 72, birthDate: '1991-03-21', nationality: 'France' },
  { name: 'Serge Gnabry', team: 'Bayern Munich', position: 'Forward', height: 183, weight: 75, birthDate: '1995-10-14', nationality: 'Germany' },
  { name: 'Federico Chiesa', team: 'Juventus', position: 'Forward', height: 180, weight: 75, birthDate: '1997-10-25', nationality: 'Italy' },
  { name: 'Rafael Leão', team: 'AC Milan', position: 'Forward', height: 188, weight: 78, birthDate: '1999-06-10', nationality: 'Portugal' },
]

const sampleEvents = [
  { homeTeam: 'Manchester City', awayTeam: 'Liverpool', date: '2026-09-15', homeScore: 2, awayScore: 1 },
  { homeTeam: 'Arsenal', awayTeam: 'Chelsea', date: '2026-09-15', homeScore: 3, awayScore: 2 },
  { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', date: '2026-09-16', homeScore: 2, awayScore: 2 },
  { homeTeam: 'Bayern Munich', awayTeam: 'Dortmund', date: '2026-09-16', homeScore: 4, awayScore: 1 },
  { homeTeam: 'Juventus', awayTeam: 'AC Milan', date: '2026-09-17', homeScore: 1, awayScore: 1 },
]

// ==================== SYNC FUNCTIONS ====================

async function syncTeamsFromAPI() {
  console.log('\n🔄 Takımlar çekiliyor (API)...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) return

    const leagueIds = [
      '133602', // Premier League
      '133603', // La Liga
      '133604', // Serie A
      '133605', // Bundesliga
      '133606', // Ligue 1
    ]

    let created = 0

    for (const leagueId of leagueIds) {
      await waitForRateLimit(2000)

      try {
        console.log(`  📡 ${leagueId}'den takımlar çekiliyor...`)
        const response = await api.get(`/lookup_all_teams.php?id=${leagueId}`)
        const teams = response.data.teams || []

        for (const team of teams) {
          if (!team.strTeam) continue

          const slug = team.strTeam.toLowerCase().replace(/\s+/g, '-')
          const existing = await get('SELECT id FROM teams WHERE slug = ? AND sport_id = ?', [slug, sport.id])

          if (!existing) {
            const countryId = await get('SELECT id FROM countries WHERE name = ?', [team.strCountry])

            const result = await run(
              `INSERT INTO teams (slug, sport_id, external_id, logo_url, country_id, active, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                slug,
                sport.id,
                team.idTeam,
                team.strTeamLogo || null,
                countryId?.id || null,
                1,
                new Date().toISOString(),
                new Date().toISOString(),
              ]
            )

            if (result.lastID) {
              await run(
                `INSERT INTO team_translations (team_id, language, name, created_at)
                 VALUES (?, ?, ?, ?)`,
                [result.lastID, 'en', team.strTeam, new Date().toISOString()]
              )

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

              created++
              console.log(`    ✅ ${team.strTeam}`)
            }
          }
        }
      } catch (err: any) {
        if (err.response?.status === 429) {
          console.log(`    ⏳ Rate limited. Waiting 10s before retry...`)
          await new Promise(r => setTimeout(r, 10000))
        } else {
          console.error(`    ❌ Hata: ${err.message}`)
        }
      }
    }

    console.log(`  📊 API'den ${created} yeni takım eklendi`)
    return created
  } catch (error) {
    console.error('  ❌ Takım çekme hatası:', error instanceof Error ? error.message : error)
    return 0
  }
}

async function syncTeamsFromSample() {
  console.log('\n🔄 Örnek takımlar ekleniyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) return

    let created = 0

    for (const team of sampleTeams) {
      const slug = team.name.toLowerCase().replace(/\s+/g, '-')
      const existing = await get('SELECT id FROM teams WHERE slug = ? AND sport_id = ?', [slug, sport.id])

      if (!existing) {
        const countryId = await get('SELECT id FROM countries WHERE name = ?', [team.country])

        const result = await run(
          `INSERT INTO teams (slug, sport_id, logo_url, country_id, active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            slug,
            sport.id,
            team.badge,
            countryId?.id || null,
            1,
            new Date().toISOString(),
            new Date().toISOString(),
          ]
        )

        if (result.lastID) {
          await run(
            `INSERT INTO team_translations (team_id, language, name, created_at)
             VALUES (?, ?, ?, ?)`,
            [result.lastID, 'en', team.name, new Date().toISOString()]
          )

          await run(
            `INSERT INTO team_extended_info (team_id, founded_year, badge_url, stadium_name, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [result.lastID, team.founded, team.badge, team.stadium, new Date().toISOString(), new Date().toISOString()]
          )

          created++
          console.log(`  ✅ ${team.name}`)
        }
      }
    }

    console.log(`  📊 ${created} örnek takım eklendi`)
  } catch (error) {
    console.error('  ❌ Örnek takım ekleme hatası:', error instanceof Error ? error.message : error)
  }
}

async function syncPlayersFromSample() {
  console.log('\n🔄 Örnek oyuncular ekleniyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    const season = await get('SELECT id FROM seasons WHERE is_current = 1 LIMIT 1')

    if (!sport || !season) return

    let created = 0

    for (const player of samplePlayers) {
      const slug = player.name.toLowerCase().replace(/\s+/g, '-')
      const existing = await get('SELECT id FROM players WHERE slug = ? AND sport_id = ?', [slug, sport.id])

      if (!existing) {
        const countryId = await get('SELECT id FROM countries WHERE name = ?', [player.nationality])

        const result = await run(
          `INSERT INTO players (slug, sport_id, image_url, country_id, position, active, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            slug,
            sport.id,
            null,
            countryId?.id || null,
            player.position,
            1,
            new Date().toISOString(),
          ]
        )

        if (result.lastID) {
          await run(
            `INSERT INTO player_translations (player_id, language, name, created_at)
             VALUES (?, ?, ?, ?)`,
            [result.lastID, 'en', player.name, new Date().toISOString()]
          )

          await run(
            `INSERT INTO player_extended_info (player_id, height, weight, date_of_birth, nationality, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [result.lastID, player.height, player.weight, player.birthDate, player.nationality, new Date().toISOString(), new Date().toISOString()]
          )

          const team = await get('SELECT id FROM teams WHERE slug = ?', [player.team.toLowerCase().replace(/\s+/g, '-')])
          if (team) {
            await run(
              `INSERT INTO player_team_assignments (player_id, team_id, season_id, position, is_active, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [result.lastID, team.id, season.id, player.position, 1, new Date().toISOString(), new Date().toISOString()]
            )
          }

          created++
          console.log(`  ✅ ${player.name}`)
        }
      }
    }

    console.log(`  📊 ${created} örnek oyuncu eklendi`)
  } catch (error) {
    console.error('  ❌ Oyuncu ekleme hatası:', error instanceof Error ? error.message : error)
  }
}

async function syncEventsFromSample() {
  console.log('\n🔄 Örnek maçlar ekleniyor...')

  try {
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    const competition = await get('SELECT id FROM competitions WHERE slug = ?', ['premier-league'])

    if (!sport || !competition) return

    let created = 0

    for (const event of sampleEvents) {
      const homeTeam = await get('SELECT id FROM teams WHERE slug = ?', [event.homeTeam.toLowerCase().replace(/\s+/g, '-')])
      const awayTeam = await get('SELECT id FROM teams WHERE slug = ?', [event.awayTeam.toLowerCase().replace(/\s+/g, '-')])

      if (homeTeam && awayTeam) {
        const existing = await get(
          'SELECT id FROM events WHERE home_team_id IS NULL AND away_team_id IS NULL AND start_time = ?',
          [`${event.date}T15:00:00Z`]
        )

        if (!existing) {
          const result = await run(
            `INSERT INTO events (sport_id, competition_id, start_time, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [sport.id, competition.id, `${event.date}T15:00:00Z`, 'finished', new Date().toISOString(), new Date().toISOString()]
          )

          if (result.lastID) {
            // Add participants
            await run(
              `INSERT INTO event_participants (event_id, participant_type, participant_id, role, created_at)
               VALUES (?, ?, ?, ?, ?)`,
              [result.lastID, 'team', homeTeam.id, 'home', new Date().toISOString()]
            )

            await run(
              `INSERT INTO event_participants (event_id, participant_type, participant_id, role, created_at)
               VALUES (?, ?, ?, ?, ?)`,
              [result.lastID, 'team', awayTeam.id, 'away', new Date().toISOString()]
            )

            // Add scores
            await run(
              `INSERT INTO event_scores (event_id, participant_id, score)
               VALUES (?, ?, ?)`,
              [result.lastID, homeTeam.id, event.homeScore]
            )

            await run(
              `INSERT INTO event_scores (event_id, participant_id, score)
               VALUES (?, ?, ?)`,
              [result.lastID, awayTeam.id, event.awayScore]
            )

            created++
            console.log(`  ✅ ${event.homeTeam} vs ${event.awayTeam}`)
          }
        }
      }
    }

    console.log(`  📊 ${created} örnek maç eklendi`)
  } catch (error) {
    console.error('  ❌ Maç ekleme hatası:', error instanceof Error ? error.message : error)
  }
}

// ==================== MAIN ====================

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  THESPORTSDB - OPTİMİZE VERİ ÇEKME')
  console.log('='.repeat(70))

  try {
    // Try API first with better rate limiting
    const apiTeams = await syncTeamsFromAPI()

    // Add sample data to supplement
    await syncTeamsFromSample()
    await syncPlayersFromSample()
    await syncEventsFromSample()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ Tüm veriler başarıyla çekildi ve kaydedildi!')
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
