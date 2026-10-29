import { initDatabase, getDb } from '../database/init'
import { quotaManager } from '../services/quota/quotaManager'
import { syncTeamsFromTheSportsDb } from '../services/sync/teamSync'
import { syncPlayersFromTheSportsDb } from '../services/sync/playerSync'
import { syncFixturesFromTheSportsDb } from '../services/sync/fixtureSync'
import { syncStatisticsForFixtures } from '../services/sync/statisticsSync'
import { syncStandingsForLeagues } from '../services/sync/standingsSync'
import { syncInjuriesForLeagues } from '../services/sync/injurySync'
import { syncOddsForFixtures } from '../services/sync/oddsSync'
import { syncPredictionsForFixtures } from '../services/sync/predictionSync'
import axios from 'axios'

const db = getDb()

async function main() {
  await initDatabase()

  console.log('\n' + '='.repeat(80))
  console.log('  🚀 WAGERLINE - COMPLETE DATA SYNCHRONIZATION')
  console.log('  ALL PHASES (1-9) - Teams, Players, Fixtures, Stats, News, Odds, Predictions')
  console.log('='.repeat(80))

  try {
    const startTime = Date.now()

    // PHASE 1: Teams
    console.log('\n📋 PHASE 1: TEAMS')
    const teamResult = await syncTeamsFromTheSportsDb()
    console.log(`  ✅ Inserted: ${teamResult.inserted}, Updated: ${teamResult.updated}, Duration: ${teamResult.duration}ms`)

    // Get team IDs for later syncs
    const teams = await new Promise<any[]>((resolve) => {
      db.all('SELECT id FROM teams LIMIT 50', [], (err, rows) => resolve(rows || []))
    })
    const teamIds = teams.map((t: any) => t.id)

    // PHASE 2: Players
    console.log('\n👥 PHASE 2: PLAYERS')
    const playerResult = await syncPlayersFromTheSportsDb(teamIds)
    console.log(`  ✅ Inserted: ${playerResult.inserted}, Updated: ${playerResult.updated}, Duration: ${playerResult.duration}ms`)

    // PHASE 3: Fixtures
    console.log('\n⚽ PHASE 3: FIXTURES')
    const fixtureResult = await syncFixturesFromTheSportsDb([133, 148, 151, 175, 179])
    console.log(`  ✅ Inserted: ${fixtureResult.inserted}, Updated: ${fixtureResult.updated}, Duration: ${fixtureResult.duration}ms`)

    // Get fixture IDs for stats/odds/predictions
    const fixtures = await new Promise<any[]>((resolve) => {
      db.all('SELECT id FROM events LIMIT 50', [], (err, rows) => resolve(rows || []))
    })
    const fixtureIds = fixtures.map((f: any) => f.id)

    // PHASE 4: Statistics
    console.log('\n📊 PHASE 4: STATISTICS')
    const statsResult = await syncStatisticsForFixtures(fixtureIds)
    console.log(`  ✅ Inserted: ${statsResult.inserted}, Updated: ${statsResult.updated}, Duration: ${statsResult.duration}ms`)

    // PHASE 5: Standings
    console.log('\n🏆 PHASE 5: STANDINGS')
    const standingsResult = await syncStandingsForLeagues([133, 148, 151, 175, 179])
    console.log(`  ✅ Inserted: ${standingsResult.inserted}, Updated: ${standingsResult.updated}, Duration: ${standingsResult.duration}ms`)

    // PHASE 6: Injuries
    console.log('\n🏥 PHASE 6: INJURIES')
    const injuryResult = await syncInjuriesForLeagues([133, 148, 151, 175, 179])
    console.log(`  ✅ Inserted: ${injuryResult.inserted}, Updated: ${injuryResult.updated}, Duration: ${injuryResult.duration}ms`)

    // PHASE 7: Odds
    console.log('\n💰 PHASE 7: ODDS')
    const oddsResult = await syncOddsForFixtures(fixtureIds)
    console.log(`  ✅ Inserted: ${oddsResult.inserted}, Updated: ${oddsResult.updated}, Duration: ${oddsResult.duration}ms`)

    // PHASE 8: Predictions
    console.log('\n🔮 PHASE 8: PREDICTIONS (Poisson ML)')
    const predictionResult = await syncPredictionsForFixtures(fixtureIds)
    console.log(`  ✅ Inserted: ${predictionResult.inserted}, Updated: ${predictionResult.updated}, Duration: ${predictionResult.duration}ms`)

    // PHASE 9: News
    console.log('\n📰 PHASE 9: NEWS')
    let newsCount = 0
    const newsSources = [
      'https://news.google.com/rss/search?q=football',
      'https://feeds.bloomberg.com/markets/sports.rss',
      'https://feeds.reuters.com/reuters/sportsNews',
    ]

    for (const url of newsSources) {
      try {
        const response = await axios.get(url, { timeout: 8000 })
        const titleMatches = response.data?.match(/<title>([^<]{5,200})<\/title>/g) || []
        const linkMatches = response.data?.match(/<link>([^<]{10,500})<\/link>/g) || []

        for (let i = 1; i < Math.min(titleMatches.length, 15); i++) {
          const title = titleMatches[i]?.replace(/<[^>]*>/g, '')?.trim() || ''
          const link = linkMatches[i]?.replace(/<[^>]*>/g, '')?.trim() || ''

          if (title.length > 10 && link.length > 10) {
            await new Promise<void>((resolve) => {
              db.run(
                `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
                 SELECT 1, ?, ?, 'feed', 'news', datetime('now')`,
                [title.slice(0, 200), link],
                () => {
                  newsCount++
                  resolve()
                }
              )
            })
          }
        }
      } catch (error) {
        console.log(`  ⚠️  News source error: ${(error as any).message}`)
      }
    }
    console.log(`  ✅ Added: ${newsCount} news articles`)

    // Summary
    console.log('\n' + '='.repeat(80))
    console.log('  ✨ SYNCHRONIZATION COMPLETE!')
    console.log('='.repeat(80))

    setTimeout(() => {
      db.all(
        `SELECT 'Teams' as entity, COUNT(*) as count FROM teams
         UNION ALL SELECT 'Players', COUNT(*) FROM players
         UNION ALL SELECT 'Fixtures', COUNT(*) FROM events
         UNION ALL SELECT 'News', COUNT(*) FROM news
         UNION ALL SELECT 'Standings', COUNT(*) FROM standings
         UNION ALL SELECT 'Injuries', COUNT(*) FROM injuries
         UNION ALL SELECT 'Odds', COUNT(*) FROM betting_odds
         UNION ALL SELECT 'Predictions', COUNT(*) FROM predictions`,
        (err, rows: any) => {
          console.log('\n📊 FINAL DATABASE STATE:')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.entity.padEnd(15)}: ${row.count}`)
            })
          }

          const quotaStatus = quotaManager.getStatus()
          console.log('\n💾 QUOTA STATUS:')
          console.log(`  Daily: ${quotaStatus.dailyUsed}/${quotaStatus.dailyLimit} (Remaining: ${quotaStatus.dailyRemaining})`)
          console.log(`  Minute: ${quotaStatus.minuteUsed}/${quotaStatus.minuteLimit} (Remaining: ${quotaStatus.minuteRemaining})`)
          console.log(`  Mode: ${quotaStatus.safeMode}`)

          const duration = ((Date.now() - startTime) / 1000).toFixed(2)
          console.log(`\n⏱️  Total Duration: ${duration}s`)
          console.log('\n✅ All data ready for live engine and frontend!')

          process.exit(0)
        }
      )
    }, 2000)
  } catch (error) {
    console.error('❌ SYNC ERROR:', error)
    process.exit(1)
  }
}

main()
