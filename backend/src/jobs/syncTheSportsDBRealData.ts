import axios from 'axios'
import { getDb } from '../database/init'
import * as fs from 'fs'

const db = getDb()
const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123'

// Rate limiting: 45 req/min = 1 req per 1.33 seconds
const DELAY_MS = 1500

let lastRequestTime = 0

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function rateLimitedFetch(url: string, retries = 3): Promise<any> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < DELAY_MS) {
    await delay(DELAY_MS - timeSinceLastRequest)
  }

  lastRequestTime = Date.now()

  try {
    console.log(`  📡 Fetching: ${url.split('/').pop()}`)
    const response = await axios.get(url, { timeout: 10000 })
    return response.data
  } catch (error: any) {
    if (retries > 0 && error.response?.status === 429) {
      console.log(`  ⏳ Rate limited, retrying in 10s...`)
      await delay(10000)
      return rateLimitedFetch(url, retries - 1)
    }
    console.error(`  ❌ Error fetching ${url}:`, error.message)
    return null
  }
}

async function fetchLeagues() {
  console.log('\n🏆 LIGLER ÇEKİLİYOR...')

  const leagueSlugs = [
    'premier-league', 'la-liga', 'serie-a',
    'bundesliga', 'ligue-1', 'super-lig'
  ]

  const leagues = await new Promise<any[]>((resolve) => {
    db.all(
      'SELECT id, slug FROM competitions WHERE slug IN (?, ?, ?, ?, ?, ?)',
      leagueSlugs,
      (err, rows) => resolve(rows || [])
    )
  })

  console.log(`  ✅ ${leagues.length} lig bulundu`)
  return leagues
}

async function fetchTeamsForLeague(leagueId: string): Promise<any[]> {
  // TheSportsDB uses league IDs
  const leagueTheSportsDBIds: { [key: string]: string } = {
    'premier-league': '133602',
    'la-liga': '133603',
    'serie-a': '133604',
    'bundesliga': '133605',
    'ligue-1': '133606',
    'super-lig': '133632'
  }

  const theSportsDBId = leagueTheSportsDBIds[leagueId]
  if (!theSportsDBId) return []

  const data = await rateLimitedFetch(`${THESPORTSDB_BASE}/eventslast.php?id=${theSportsDBId}`)

  if (!data || !data.results) return []

  // Extract unique teams from results
  const teams = new Map()

  data.results.forEach((match: any) => {
    if (match.idHomeTeam && match.strHomeTeam) {
      teams.set(match.idHomeTeam, {
        external_id: match.idHomeTeam,
        name: match.strHomeTeam,
        country: match.strCountry || 'Unknown'
      })
    }
    if (match.idAwayTeam && match.strAwayTeam) {
      teams.set(match.idAwayTeam, {
        external_id: match.idAwayTeam,
        name: match.strAwayTeam,
        country: match.strCountry || 'Unknown'
      })
    }
  })

  return Array.from(teams.values())
}

async function fetchAllTeams(leagues: any[]) {
  console.log('\n👥 TAKIMLAR ÇEKİLİYOR...')

  let totalTeams = 0
  const allTeams = new Map()

  for (const league of leagues) {
    console.log(`\n  📥 ${league.slug} takımları...`)

    const teamData = await rateLimitedFetch(`${THESPORTSDB_BASE}/eventslast.php?id=${league.slug}`)

    if (!teamData || !teamData.results) continue

    const leagueTeams = new Set<string>()

    teamData.results.forEach((match: any) => {
      if (match.idHomeTeam) leagueTeams.add(match.idHomeTeam)
      if (match.idAwayTeam) leagueTeams.add(match.idAwayTeam)
    })

    console.log(`    ✅ ${leagueTeams.size} takım bulundu`)
    totalTeams += leagueTeams.size
  }

  console.log(`\n  📊 Toplam ${totalTeams} benzersiz takım`)
  return allTeams
}

async function fetchTeamsDetailed(): Promise<any[]> {
  console.log('\n🏟️ TAKIMLAR DETAYLI BİLGİ ÇEKİLİYOR...')

  const knownTeams = [
    // Premier League
    133601, 133602, 133603, 133604, 133605, 133606, 133607, 133608, 133609, 133610,
    // La Liga
    133645, 133646, 133647, 133648, 133649, 133650, 133651, 133652, 133653, 133654,
    // Serie A
    133685, 133686, 133687, 133688, 133689, 133690, 133691, 133692, 133693, 133694,
    // Bundesliga
    133672, 133673, 133674, 133675, 133676, 133677, 133678, 133679, 133680, 133681,
    // Ligue 1
    133717, 133718, 133719, 133720, 133721, 133722, 133723, 133724, 133725, 133726,
    // Super Lig
    134810, 134811, 134812, 134813, 134814, 134815, 134816, 134817, 134818, 134819
  ]

  const teams: any[] = []
  let fetched = 0

  for (const teamId of knownTeams) {
    const teamData = await rateLimitedFetch(`${THESPORTSDB_BASE}/lookup_team.php?id=${teamId}`)

    if (teamData && teamData.teams && teamData.teams[0]) {
      const team = teamData.teams[0]
      teams.push({
        external_id: team.idTeam,
        name: team.strTeam,
        slug: team.strTeam.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        country: team.strCountry,
        badge: team.strTeamBadge,
        founded: team.intFormedYear
      })

      fetched++
      if (fetched % 10 === 0) console.log(`  ✅ ${fetched} takım ✓`)
    }
  }

  console.log(`\n  📊 Toplam ${fetched} takım detaylı bilgi çekildi`)
  return teams
}

async function fetchPlayersForTeams() {
  console.log('\n⚽ OYUNCULAR ÇEKİLİYOR...')

  let totalPlayers = 0

  // Get all teams from DB
  const teams = await new Promise<any[]>((resolve) => {
    db.all('SELECT id, external_id FROM teams WHERE active = 1 LIMIT 50', (err, rows) => {
      resolve(rows || [])
    })
  })

  for (const team of teams) {
    if (!team.external_id) continue

    const teamData = await rateLimitedFetch(`${THESPORTSDB_BASE}/lookup_all_players.php?id=${team.external_id}`)

    if (!teamData || !teamData.player) continue

    for (const player of teamData.player.slice(0, 30)) { // Max 30 players per team
      totalPlayers++

      // Insert or update player
      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO players (sport_id, external_id, slug, country_id, active)
           SELECT 1, ?, ?, c.id, 1 FROM countries c
           WHERE c.name = ? OR c.id = 1`,
          [player.idPlayer, player.strPlayer.toLowerCase().replace(/\s+/g, '-'), player.strNationality || 'Unknown'],
          () => {
            db.run(
              `INSERT OR IGNORE INTO player_translations (player_id, language, name)
               SELECT p.id, 'en', ? FROM players p WHERE p.external_id = ?`,
              [player.strPlayer, player.idPlayer],
              () => resolve()
            )
          }
        )
      })
    }

    if (teams.indexOf(team) % 10 === 0) {
      console.log(`  ✅ ${teams.indexOf(team)} takımın oyuncuları işlendi`)
    }
  }

  console.log(`\n  📊 Toplam ${totalPlayers} oyuncu işlendi`)
}

async function fetchFixtures() {
  console.log('\n⚽ MAÇ FİKSTÜRLERİ ÇEKİLİYOR...')

  const leagues = [
    { id: 133602, slug: 'premier-league' },
    { id: 133603, slug: 'la-liga' },
    { id: 133604, slug: 'serie-a' },
    { id: 133605, slug: 'bundesliga' },
    { id: 133606, slug: 'ligue-1' },
    { id: 133632, slug: 'super-lig' }
  ]

  let totalMatches = 0

  for (const league of leagues) {
    console.log(`\n  📥 ${league.slug} maçları...`)

    // Fetch last matches
    const lastMatches = await rateLimitedFetch(`${THESPORTSDB_BASE}/eventslast.php?id=${league.id}`)

    if (!lastMatches || !lastMatches.results) continue

    for (const match of lastMatches.results) {
      totalMatches++

      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO events
           (sport_id, competition_id, external_id, home_team_id, away_team_id, start_time, status, event_type)
           SELECT 1, c.id, ?,
             (SELECT id FROM teams WHERE external_id = ?),
             (SELECT id FROM teams WHERE external_id = ?),
             ?, ?, 'match'
           FROM competitions c WHERE c.slug = ?`,
          [match.idEvent, match.idHomeTeam, match.idAwayTeam, match.dateEvent, match.strStatus || 'scheduled', league.slug],
          () => {
            if (match.intHomeScore !== null && match.intAwayScore !== null) {
              db.run(
                `INSERT OR IGNORE INTO event_scores (event_id, participant_id, score)
                 SELECT e.id, t.id, ?
                 FROM events e, teams t
                 WHERE e.external_id = ? AND t.external_id = ?
                 UNION ALL
                 SELECT e.id, t.id, ?
                 FROM events e, teams t
                 WHERE e.external_id = ? AND t.external_id = ?`,
                [match.intHomeScore, match.idEvent, match.idHomeTeam, match.intAwayScore, match.idEvent, match.idAwayTeam],
                () => resolve()
              )
            } else {
              resolve()
            }
          }
        )
      })
    }

    console.log(`  ✅ ${lastMatches.results.length} maç işlendi`)
  }

  console.log(`\n  📊 Toplam ${totalMatches} maç işlendi`)
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  THESPORTSDB GERÇEK VERİ SENKRONIZASYONU')
  console.log('='.repeat(70))

  try {
    const leagues = await fetchLeagues()
    const teams = await fetchTeamsDetailed()
    await fetchPlayersForTeams()
    await fetchFixtures()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ VERİ ÇEKME İŞLEMİ TAMAMLANDI!')
    console.log('='.repeat(70))

    // Final summary
    setTimeout(() => {
      db.all(
        `SELECT 'Takımlar' as entity, COUNT(*) as count FROM teams
         UNION ALL
         SELECT 'Oyuncular', COUNT(*) FROM players
         UNION ALL
         SELECT 'Maçlar', COUNT(*) FROM events`,
        (err, rows: any) => {
          console.log('\n📈 VERİTABANI ÖZETİ:')
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
    console.error('ERROR:', error)
    process.exit(1)
  }
}

main()
