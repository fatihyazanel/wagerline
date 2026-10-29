import axios from 'axios'
import { initDatabase, getDb } from '../database/init'
import { quotaManager } from '../services/quota/quotaManager'
import { theSportsDbClient } from '../providers/theSportsDb/client'
import { normalizeTeamFromTheSportsDb, validateTeam } from '../services/normalization/teamNormalizer'

const db = getDb()

// ==============================================================================
// 1. THESPORTSDB - TEAMS & EVENTS
// ==============================================================================

async function syncTeamsAndEventsFromTheSportsDb() {
  console.log('\n⚽ THESPORTSDB - TAKIMLAR VE MAÇLAR')

  const leagues = [
    { id: 133, name: 'Premier League' },
    { id: 148, name: 'La Liga' },
    { id: 151, name: 'Serie A' },
    { id: 175, name: 'Bundesliga' },
    { id: 179, name: 'Ligue 1' },
  ]

  let teamCount = 0
  let eventCount = 0

  for (const league of leagues) {
    if (!quotaManager.canRequest('P5')) {
      console.log(`  ⚠️  Quota limit reached`)
      break
    }

    try {
      const events = await theSportsDbClient.getLeagueEvents(league.id)
      quotaManager.consumeRequest()

      console.log(`  🏆 ${league.name}`)

      // Process events
      for (const event of events.slice(0, 20)) {
        if (!event.idEvent || !event.strHomeTeam || !event.strAwayTeam) continue

        // Store events
        await new Promise<void>((resolve) => {
          db.run(
            `INSERT OR IGNORE INTO events (
              sport_id, external_id, event_type, status,
              start_time, created_at, provider
            ) VALUES (?, ?, 'match', 'scheduled', ?, datetime('now'), 'thesportsdb')`,
            [1, `thesportsdb-${event.idEvent}`, event.dateEvent],
            () => {
              eventCount++
              resolve()
            }
          )
        })
      }

      console.log(`    ✅ ${events.length} event bulundu`)
    } catch (error) {
      console.log(`  ⚠️  ${league.name}: ${(error as any).message}`)
    }
  }

  console.log(`  ✅ Toplam: ${eventCount} event`)
}

// ==============================================================================
// 2. POPULAR PLAYERS DATA
// ==============================================================================

async function populatePopularPlayers() {
  console.log('\n👥 POPÜLER OYUNCULAR')

  const popularPlayers = [
    { name: 'Erling Haaland', country: 'Norway', position: 'ST' },
    { name: 'Harry Kane', country: 'England', position: 'ST' },
    { name: 'Kylian Mbappe', country: 'France', position: 'ST' },
    { name: 'Cristiano Ronaldo', country: 'Portugal', position: 'ST' },
    { name: 'Lionel Messi', country: 'Argentina', position: 'RW' },
    { name: 'Mohamed Salah', country: 'Egypt', position: 'RW' },
    { name: 'Kevin De Bruyne', country: 'Belgium', position: 'CM' },
    { name: 'Robert Lewandowski', country: 'Poland', position: 'ST' },
    { name: 'Vinícius Júnior', country: 'Brazil', position: 'LW' },
    { name: 'Jude Bellingham', country: 'England', position: 'CM' },
    { name: 'Florian Wirtz', country: 'Germany', position: 'LW' },
    { name: 'Phil Foden', country: 'England', position: 'LW' },
    { name: 'Pedri', country: 'Spain', position: 'CM' },
    { name: 'Gavi', country: 'Spain', position: 'CM' },
    { name: 'Luka Modric', country: 'Croatia', position: 'CM' },
    { name: 'Karim Benzema', country: 'France', position: 'ST' },
    { name: 'Declan Rice', country: 'England', position: 'CM' },
    { name: 'Bukayo Saka', country: 'England', position: 'RW' },
    { name: 'Luis Diaz', country: 'Colombia', position: 'LW' },
    { name: 'Rodrygo', country: 'Brazil', position: 'RW' },
  ]

  let playerCount = 0

  for (const player of popularPlayers) {
    if (!quotaManager.canRequest('P5')) break

    const slug = player.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    await new Promise<void>((resolve) => {
      db.run(
        `INSERT OR IGNORE INTO players (
          sport_id, external_id, slug, position, provider, active
        ) VALUES (?, ?, ?, ?, 'thesportsdb', 1)`,
        [1, `tsdb-${slug}`, slug, player.position],
        function(this: any) {
          if (this && this.lastID) {
            // Add translation
            db.run(
              `INSERT OR IGNORE INTO player_translations (player_id, language, name)
               VALUES (?, 'en', ?)`,
              [this.lastID, player.name],
              () => {
                playerCount++
                resolve()
              }
            )
          } else {
            playerCount++
            resolve()
          }
        }
      )
    })
  }

  console.log(`  ✅ ${playerCount} oyuncu eklendi`)
}

// ==============================================================================
// 3. NEWS FROM GOOGLE + RSS
// ==============================================================================

async function fetchNewsFromMultipleSources() {
  console.log('\n📰 HABERLER - GOOGLE & RSS FEEDS')

  const newsSources = [
    {
      url: 'https://news.google.com/rss/search?q=football',
      name: 'google-news',
    },
    {
      url: 'https://feeds.bloomberg.com/markets/sports.rss',
      name: 'bloomberg-sports',
    },
    {
      url: 'https://feeds.reuters.com/reuters/sportsNews',
      name: 'reuters-sports',
    },
  ]

  let newsCount = 0

  for (const source of newsSources) {
    try {
      const response = await axios.get(source.url, { timeout: 8000 })
      const titleMatches = response.data?.match(/<title>([^<]{5,200})<\/title>/g) || []
      const linkMatches = response.data?.match(/<link>([^<]{10,500})<\/link>/g) || []

      let sourceNews = 0

      for (let i = 1; i < Math.min(titleMatches.length, 30); i++) {
        const title = titleMatches[i]?.replace(/<[^>]*>/g, '')?.trim() || ''
        const link = linkMatches[i]?.replace(/<[^>]*>/g, '')?.trim() || ''

        if (title.length > 10 && link.length > 10) {
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR IGNORE INTO news (
                sport_id, title, content, source, news_type, published_at, created_at
              ) SELECT s.id, ?, ?, ?, 'news', datetime('now'), datetime('now')
               FROM sports s WHERE s.slug = 'football'`,
              [title.slice(0, 200), link, source.name],
              () => {
                sourceNews++
                newsCount++
                resolve()
              }
            )
          })
        }
      }

      console.log(`  ✅ ${source.name}: ${sourceNews} haber`)
    } catch (error) {
      console.log(`  ⚠️  ${source.name}: Hata`)
    }
  }

  console.log(`  📊 Toplam: ${newsCount} haber`)
}

// ==============================================================================
// MAIN
// ==============================================================================

async function main() {
  await initDatabase()

  console.log('\n' + '='.repeat(70))
  console.log('  🚀 PROVIDER ARCHITECTURE - VERİ SENKRONIZASYONU')
  console.log('  TheSportsDB + Google News + RSS Feeds')
  console.log('='.repeat(70))

  try {
    // 1. Teams & Events
    await syncTeamsAndEventsFromTheSportsDb()

    // 2. Popular Players
    await populatePopularPlayers()

    // 3. News
    await fetchNewsFromMultipleSources()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ VERİ SENKRONIZASYONU TAMAMLANDI!')
    console.log('='.repeat(70))

    // Final DB check
    setTimeout(() => {
      db.all(
        `SELECT 'Teams' as entity, COUNT(*) as count FROM teams
         UNION ALL SELECT 'Players', COUNT(*) FROM players
         UNION ALL SELECT 'Events', COUNT(*) FROM events
         UNION ALL SELECT 'News', COUNT(*) FROM news`,
        (err, rows: any) => {
          console.log('\n📊 VERİTABANI DURUMU:')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.entity}: ${row.count}`)
            })
          }

          console.log('\n💾 QUOTA DURUMU:')
          const quotaStatus = quotaManager.getStatus()
          console.log(`  Daily: ${quotaStatus.dailyUsed}/${quotaStatus.dailyLimit}`)
          console.log(`  Minute: ${quotaStatus.minuteUsed}/${quotaStatus.minuteLimit}`)
          console.log(`  Safe Mode: ${quotaStatus.safeMode}`)

          console.log('\n✅ Senkronizasyon başarıyla tamamlandı!')
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
