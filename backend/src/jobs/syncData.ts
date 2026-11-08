throw new Error('Legacy synthetic-data job disabled. Use npm run sync:verified.');
import sqlite3 from 'sqlite3'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_PATH || './data/wagerline.db'
const dataDir = path.dirname(dbPath)

// Create data dir
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Initialize database
const db = new sqlite3.Database(dbPath)
db.configure('busyTimeout', 10000)

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

const exec = (sql: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err)
      else resolve()
    })
  })
}

// Initialize schema
async function initSchema() {
  console.log('📋 Initializing schema...')
  const schemaPath = path.join(__dirname, '../database/schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')

  const statements = schema.split(';').filter(s => s.trim())

  for (const statement of statements) {
    try {
      await exec(statement + ';')
    } catch (error) {
      // Ignore duplicate table errors
      if (error instanceof Error && !error.message.includes('already exists')) {
        console.error('Schema error:', error.message)
      }
    }
  }

  console.log('✅ Schema initialized\n')
}

// Sync sports
async function syncSports() {
  console.log('🔄 Syncing sports...')
  const SPORTS = [
    { slug: 'football', name_key: 'sports.football', icon: '⚽' },
    { slug: 'basketball', name_key: 'sports.basketball', icon: '🏀' },
    { slug: 'american-football', name_key: 'sports.american_football', icon: '🏈' },
    { slug: 'ice-hockey', name_key: 'sports.ice_hockey', icon: '🏒' },
    { slug: 'formula-1', name_key: 'sports.formula_1', icon: '🏎️' },
  ]

  let created = 0
  for (const sport of SPORTS) {
    try {
      const existing = await get('SELECT id FROM sports WHERE slug = ?', [sport.slug])
      if (!existing) {
        await run(
          'INSERT INTO sports (slug, name_key, icon, status) VALUES (?, ?, ?, ?)',
          [sport.slug, sport.name_key, sport.icon, 'active']
        )
        created++
        console.log(`  ✅ ${sport.slug}`)
      }
    } catch (error) {
      console.error(`  ❌ ${sport.slug}: ${error instanceof Error ? error.message : error}`)
    }
  }

  console.log(`  Created: ${created}\n`)
  return created
}

// Sync competitions
async function syncCompetitions() {
  console.log('🔄 Syncing competitions...')
  const COMPETITIONS = [
    { sport_slug: 'football', slug: 'premier-league', name_key: 'competitions.premier_league', external_id: 'pl' },
    { sport_slug: 'football', slug: 'la-liga', name_key: 'competitions.la_liga', external_id: 'es1' },
    { sport_slug: 'football', slug: 'serie-a', name_key: 'competitions.serie_a', external_id: 'it1' },
    { sport_slug: 'football', slug: 'bundesliga', name_key: 'competitions.bundesliga', external_id: 'de1' },
    { sport_slug: 'football', slug: 'ligue-1', name_key: 'competitions.ligue_1', external_id: 'fr1' },
    { sport_slug: 'football', slug: 'super-lig', name_key: 'competitions.super_lig', external_id: 'tr1' },
    { sport_slug: 'basketball', slug: 'nba', name_key: 'competitions.nba', external_id: 'nba' },
    { sport_slug: 'american-football', slug: 'nfl', name_key: 'competitions.nfl', external_id: 'nfl' },
    { sport_slug: 'ice-hockey', slug: 'nhl', name_key: 'competitions.nhl', external_id: 'nhl' },
    { sport_slug: 'formula-1', slug: 'formula-1', name_key: 'competitions.formula_1', external_id: 'f1' },
  ]

  let created = 0
  for (const comp of COMPETITIONS) {
    try {
      const sport = await get('SELECT id FROM sports WHERE slug = ?', [comp.sport_slug])
      if (!sport) continue

      const existing = await get('SELECT id FROM competitions WHERE slug = ?', [comp.slug])
      if (!existing) {
        await run(
          `INSERT INTO competitions (sport_id, slug, name_key, external_provider, external_id, active)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [sport.id, comp.slug, comp.name_key, 'sportscore', comp.external_id]
        )
        created++
        console.log(`  ✅ ${comp.slug}`)
      }
    } catch (error) {
      console.error(`  ❌ ${comp.slug}: ${error instanceof Error ? error.message : error}`)
    }
  }

  console.log(`  Created: ${created}\n`)
  return created
}

// Fetch teams from API
async function syncTeams() {
  console.log('🔄 Syncing sample teams...')
  let created = 0

  try {
    const SAMPLE_TEAMS = [
      { slug: 'arsenal', en: 'Arsenal FC', es: 'Arsenal FC', ar: 'أرسنال' },
      { slug: 'liverpool', en: 'Liverpool FC', es: 'Liverpool FC', ar: 'ليفربول' },
      { slug: 'manchester-city', en: 'Manchester City', es: 'Manchester City', ar: 'مانشستر سيتي' },
      { slug: 'manchester-united', en: 'Manchester United', es: 'Manchester United', ar: 'مانشستر يونايتد' },
      { slug: 'tottenham', en: 'Tottenham Hotspur', es: 'Tottenham Hotspur', ar: 'توتنهام' },
      { slug: 'chelsea', en: 'Chelsea FC', es: 'Chelsea FC', ar: 'تشيلسي' },
      { slug: 'real-madrid', en: 'Real Madrid', es: 'Real Madrid', ar: 'ريال مدريد' },
      { slug: 'barcelona', en: 'FC Barcelona', es: 'FC Barcelona', ar: 'برشلونة' },
      { slug: 'ac-milan', en: 'AC Milan', es: 'AC Milan', ar: 'ميلان' },
      { slug: 'juventus', en: 'Juventus', es: 'Juventus', ar: 'يوفنتوس' },
    ]

    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) throw new Error('Football sport not found')

    for (const team of SAMPLE_TEAMS) {
      const existing = await get('SELECT id FROM teams WHERE slug = ?', [team.slug])
      if (!existing) {
        const result = await run(
          'INSERT INTO teams (sport_id, slug, active) VALUES (?, ?, 1)',
          [sport.id, team.slug]
        )

        const teamId = result.lastID
        if (teamId) {
          await run('INSERT INTO team_translations (team_id, language, name) VALUES (?, ?, ?)', [
            teamId,
            'en',
            team.en,
          ])
          await run('INSERT INTO team_translations (team_id, language, name) VALUES (?, ?, ?)', [
            teamId,
            'es',
            team.es,
          ])
          await run('INSERT INTO team_translations (team_id, language, name) VALUES (?, ?, ?)', [
            teamId,
            'ar',
            team.ar,
          ])

          created++
          console.log(`  ✅ ${team.slug}`)
        }
      }
    }
  } catch (error) {
    console.error('Team sync error:', error instanceof Error ? error.message : error)
  }

  console.log(`  Created: ${created}\n`)
  return created
}

// Sync sample events
async function syncEvents() {
  console.log('🔄 Creating sample events...')
  let created = 0

  try {
    const competition = await get("SELECT id FROM competitions WHERE slug = 'premier-league'")
    if (!competition) return created

    const SAMPLE_EVENTS = [
      {
        home_slug: 'arsenal',
        away_slug: 'liverpool',
        status: 'scheduled',
        start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        home_slug: 'manchester-city',
        away_slug: 'manchester-united',
        status: 'scheduled',
        start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        home_slug: 'tottenham',
        away_slug: 'chelsea',
        status: 'live',
        start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ]

    for (const event of SAMPLE_EVENTS) {
      const homeTeam = await get('SELECT id FROM teams WHERE slug = ?', [event.home_slug])
      const awayTeam = await get('SELECT id FROM teams WHERE slug = ?', [event.away_slug])

      if (homeTeam && awayTeam) {
        const result = await run(
          `INSERT INTO events (sport_id, competition_id, event_type, start_time, status)
           VALUES (1, ?, 'match', ?, ?)`,
          [competition.id, event.start_time, event.status]
        )

        if (result.lastID) {
          // Add participants
          await run(
            'INSERT INTO event_participants (event_id, participant_type, participant_id, role) VALUES (?, ?, ?, ?)',
            [result.lastID, 'team', homeTeam.id, 'HOME']
          )
          await run(
            'INSERT INTO event_participants (event_id, participant_type, participant_id, role) VALUES (?, ?, ?, ?)',
            [result.lastID, 'team', awayTeam.id, 'AWAY']
          )

          // Add sample scores
          if (event.status === 'live') {
            await run(
              'INSERT INTO event_scores (event_id, participant_id, score, period) VALUES (?, ?, ?, 0)',
              [result.lastID, homeTeam.id, Math.floor(Math.random() * 3)]
            )
            await run(
              'INSERT INTO event_scores (event_id, participant_id, score, period) VALUES (?, ?, ?, 0)',
              [result.lastID, awayTeam.id, Math.floor(Math.random() * 3)]
            )
          }

          created++
          console.log(`  ✅ ${event.home_slug} vs ${event.away_slug} (${event.status})`)
        }
      }
    }
  } catch (error) {
    console.error('Event sync error:', error instanceof Error ? error.message : error)
  }

  console.log(`  Created: ${created}\n`)
  return created
}

// Main sync
async function main() {
  console.log('\n📦 ====== WAGERLINE DATA SYNC ======\n')

  try {
    await initSchema()

    const sportCount = await syncSports()
    const compCount = await syncCompetitions()
    const teamCount = await syncTeams()
    const eventCount = await syncEvents()

    console.log('📊 ====== SYNC SUMMARY ======\n')
    console.log(`  Sports:       ${sportCount}`)
    console.log(`  Competitions: ${compCount}`)
    console.log(`  Teams:        ${teamCount}`)
    console.log(`  Events:       ${eventCount}`)

    // Show database stats
    const sports = await all('SELECT COUNT(*) as count FROM sports')
    const competitions = await all('SELECT COUNT(*) as count FROM competitions')
    const teams = await all('SELECT COUNT(*) as count FROM teams')
    const events = await all('SELECT COUNT(*) as count FROM events')
    const translations = await all('SELECT COUNT(*) as count FROM team_translations')

    console.log('\n📈 ====== DATABASE STATS ======\n')
    console.log(`  Total Sports:       ${sports[0]?.count || 0}`)
    console.log(`  Total Competitions: ${competitions[0]?.count || 0}`)
    console.log(`  Total Teams:        ${teams[0]?.count || 0}`)
    console.log(`  Total Events:       ${events[0]?.count || 0}`)
    console.log(`  Total Translations: ${translations[0]?.count || 0}`)

    console.log('\n✨ Data sync completed! Ready to serve API requests.\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Sync failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    db.close()
  }
}

main()
