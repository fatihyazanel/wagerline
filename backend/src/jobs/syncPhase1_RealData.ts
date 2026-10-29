import axios from 'axios'
import { getDb } from '../database/init'

const db = getDb()
const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123'

let requestCount = 0
let lastRequestTime = Date.now()
const RATE_LIMIT_DELAY = 1500 // 45 req/min = 1.33 sec

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function rateLimitedFetch(url: string): Promise<any> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await delay(RATE_LIMIT_DELAY - timeSinceLastRequest)
  }

  lastRequestTime = Date.now()
  requestCount++

  try {
    const response = await axios.get(url, { timeout: 15000 })
    return response.data
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.log(`  ⏳ Rate limited - waiting 10s`)
      await delay(10000)
      return rateLimitedFetch(url)
    }
    return null
  }
}

// TheSportsDB League IDs
const LEAGUES = {
  'premier-league': { id: '133602', name: 'Premier League' },
  'la-liga': { id: '133603', name: 'La Liga' },
  'serie-a': { id: '133604', name: 'Serie A' },
  'bundesliga': { id: '133605', name: 'Bundesliga' },
  'ligue-1': { id: '133606', name: 'Ligue 1' },
  'super-lig': { id: '133632', name: 'Super Lig' },
  'eredivisie': { id: '133607', name: 'Eredivisie' }
}

async function fetchAndInsertLeagues() {
  console.log('\n🏆 LIGLER İŞLENİYOR...')

  for (const [slug, league] of Object.entries(LEAGUES)) {
    await new Promise<void>((resolve) => {
      db.run(
        `INSERT OR IGNORE INTO competitions (sport_id, slug, name_key, active)
         SELECT s.id, ?, ?, 1 FROM sports s WHERE s.slug = 'football'`,
        [slug, league.name],
        () => resolve()
      )
    })
  }

  console.log(`  ✅ ${Object.keys(LEAGUES).length} lig kayıtlı`)
}

async function fetchTeamsForLeague(leagueName: string, theSportsDBId: string): Promise<any[]> {
  const data = await rateLimitedFetch(`${THESPORTSDB_BASE}/eventslastleague.php?id=${theSportsDBId}`)

  if (!data || !data.results) return []

  const teams = new Map()

  data.results.forEach((match: any) => {
    if (match.idHomeTeam && match.strHomeTeam) {
      teams.set(match.idHomeTeam, {
        external_id: match.idHomeTeam,
        name: match.strHomeTeam,
        country: match.strCountry || match.strHomeTeam.split(' ').pop() || 'Unknown'
      })
    }
    if (match.idAwayTeam && match.strAwayTeam) {
      teams.set(match.idAwayTeam, {
        external_id: match.idAwayTeam,
        name: match.strAwayTeam,
        country: match.strCountry || match.strAwayTeam.split(' ').pop() || 'Unknown'
      })
    }
  })

  return Array.from(teams.values())
}

async function fetchAllTeamsDetailed(): Promise<void> {
  console.log('\n👥 TAKIMLAR ÇEKİLİYOR...')

  const teams = new Map()
  let fetched = 0

  for (const [leagueKey, league] of Object.entries(LEAGUES)) {
    console.log(`  📥 ${league.name} takımları çekiliyor...`)
    const leagueTeams = await fetchTeamsForLeague(league.name, league.id)

    for (const team of leagueTeams) {
      if (!teams.has(team.external_id)) {
        teams.set(team.external_id, team)
      }
    }
  }

  for (const [externalId, team] of teams) {
    const slug = (team.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    await new Promise<void>((resolve) => {
      db.run(
        `INSERT OR IGNORE INTO teams (sport_id, external_id, slug, active)
         SELECT s.id, ?, ?, 1
         FROM sports s
         WHERE s.slug = 'football'`,
        [externalId, slug],
        function() {
          const teamDbId = this.lastID

          db.run(
            `INSERT OR IGNORE INTO team_translations (team_id, language, name)
             SELECT ?, 'en', ?
             FROM teams WHERE external_id = ?`,
            [teamDbId || null, team.name, externalId],
            () => resolve()
          )
        }
      )
    })

    fetched++
    if (fetched % 10 === 0) console.log(`    ✅ ${fetched} takım işlendi`)
  }

  console.log(`  📊 Toplam ${fetched} takım başarıyla yüklendi`)
}

async function fetchAllPlayersDetailed(): Promise<void> {
  console.log('\n⚽ OYUNCULAR ÇEKİLİYOR...')

  const teams = await new Promise<any[]>((resolve) => {
    db.all('SELECT id, external_id FROM teams WHERE external_id IS NOT NULL LIMIT 100', (err, rows) => {
      resolve(rows || [])
    })
  })

  let totalPlayers = 0

  for (let i = 0; i < teams.length; i++) {
    const team = teams[i]
    if (!team.external_id) continue

    const playerData = await rateLimitedFetch(`${THESPORTSDB_BASE}/lookup_all_players.php?id=${team.external_id}`)

    if (!playerData?.player) continue

    for (const player of playerData.player.slice(0, 30)) {
      const playerSlug = (player.strPlayer || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO players (sport_id, external_id, slug, country_id, active)
           SELECT s.id, ?, ?, c.id, 1
           FROM sports s, countries c
           WHERE s.slug = 'football' AND c.name LIKE ?`,
          [player.idPlayer, playerSlug, player.strNationality || 'Unknown'],
          function() {
            const playerDbId = this.lastID

            db.run(
              `INSERT OR IGNORE INTO player_translations (player_id, language, name)
               SELECT ?, 'en', ? FROM players WHERE external_id = ?`,
              [playerDbId || null, player.strPlayer, player.idPlayer],
              () => {
                db.run(
                  `INSERT OR IGNORE INTO player_extended_info (player_id, height, weight, date_of_birth)
                   SELECT ?, ?, ?, ? FROM players WHERE id = ?`,
                  [playerDbId || null, player.strHeight || null, player.strWeight || null, player.dateBorn || null, playerDbId || null],
                  () => {
                    db.run(
                      `INSERT OR IGNORE INTO player_team_assignments (player_id, team_id, season_id, position, shirt_number)
                       SELECT ?, ?, s.id, ?, ? FROM seasons s WHERE s.name = '2025-26'`,
                      [playerDbId || null, team.id, player.strPosition || 'MID', player.strNumber || null],
                      () => resolve()
                    )
                  }
                )
              }
            )
          }
        )
      })

      totalPlayers++
    }

    if ((i + 1) % 10 === 0) console.log(`  ✅ ${i + 1}/${teams.length} takımın oyuncuları işlendi (${totalPlayers} oyuncu)`)
  }

  console.log(`  📊 Toplam ${totalPlayers} oyuncu başarıyla yüklendi`)
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  PHASE 1: GERÇEK VERİ ÇEKME (TAKIMLAR & OYUNCULAR)')
  console.log('='.repeat(70))

  try {
    await fetchAndInsertLeagues()
    await fetchAllTeamsDetailed()
    await fetchAllPlayersDetailed()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ PHASE 1 TAMAMLANDI!')
    console.log('='.repeat(70))
    console.log(`\n📊 İstatistikler:`)
    console.log(`  API Çağrıları: ${requestCount}`)
    console.log(`  Zaman: ${((Date.now() - (lastRequestTime - RATE_LIMIT_DELAY * requestCount)) / 1000 / 60).toFixed(1)} dakika`)

    // Summary
    setTimeout(() => {
      db.all(
        `SELECT 'Takımlar' as entity, COUNT(*) as count FROM teams
         UNION ALL
         SELECT 'Oyuncular', COUNT(*) FROM players
         UNION ALL
         SELECT 'Oyuncu-Takım', COUNT(*) FROM player_team_assignments`,
        (err, rows: any) => {
          console.log('\n📈 VERITABANI DURUMU:')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.entity}: ${row.count}`)
            })
          }
          process.exit(0)
        }
      )
    }, 1000)

  } catch (error) {
    console.error('❌ ERROR:', error)
    process.exit(1)
  }
}

main()
