import axios from 'axios'
import { getDb, initDatabase } from '../database/init'

let db = getDb()

/**
 * ÇALIŞAN API'lerden veri çek
 * ✅ Wikipedia (oyuncu detayları)
 * ✅ OpenFootball (maç detayları)
 * ✅ Google News (haberler)
 */

async function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

// =============================================================================
// 1. WIKIPEDIA - OYUNCU BİLGİLERİ ÇEKMEK
// =============================================================================

async function enrichPlayersFromWikipedia() {
  console.log('\n📚 WIKIPEDIA\'DAN OYUNCU BİLGİLERİ')

  const players = [
    'Erling Haaland', 'Harry Kane', 'Kylian Mbappe', 'Cristiano Ronaldo', 'Lionel Messi',
    'Mohamed Salah', 'Kevin De Bruyne', 'Robert Lewandowski', 'Luka Modric', 'Gianluigi Donnarumma'
  ]

  let updated = 0

  for (const playerName of players) {
    try {
      const res = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          format: 'json',
          titles: playerName,
          prop: 'extracts',
          exintro: true,
          explaintext: true
        },
        timeout: 8000
      })

      const pages = res.data.query?.pages || {}
      const page = Object.values(pages)[0] as any

      if (page?.extract) {
        // Oyuncu bulup güncelle
        const player = await new Promise<any>((resolve) => {
          db.get(
            'SELECT id FROM players WHERE slug = ?',
            [playerName.toLowerCase().replace(/\s+/g, '-')],
            (err, row) => resolve(row)
          )
        })

        if (player) {
          // Height/weight çıkartmaya çalış
          const heightMatch = page.extract.match(/(\d{1,3})\s*cm/)
          const weightMatch = page.extract.match(/(\d{2,3})\s*kg/)

          await new Promise<void>((resolve) => {
            db.run(
              `UPDATE player_extended_info SET height = ?, weight = ? WHERE player_id = ?`,
              [heightMatch ? heightMatch[1] : null, weightMatch ? weightMatch[1] : null, player.id],
              () => {
                updated++
                resolve()
              }
            )
          })
        }
      }

      await delay(500)
    } catch (error) {
      // continue
    }
  }

  console.log(`  ✅ ${updated} oyuncu güncellendi`)
}

// =============================================================================
// 2. OPENFOOTBALL - MAÇ VE TAKIM DETAYLARİ
// =============================================================================

async function enrichDataFromOpenFootball() {
  console.log('\n⚽ OPENFOOTBALL JSON - LİG VERİLERİ')

  try {
    // Premier League verisi
    const res = await axios.get(
      'https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/en.1.json',
      { timeout: 10000 }
    )

    const data = res.data

    if (data.matches) {
      let matchCount = 0

      // Maçları kontrol et
      for (const match of data.matches.slice(0, 50)) {
        const exists = await new Promise<any>((resolve) => {
          db.get(
            'SELECT id FROM events WHERE start_time = ? LIMIT 1',
            [match.date],
            (err, row) => resolve(row)
          )
        })

        if (!exists) {
          // Yeni maç ekle (basit)
          const homeTeam = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM teams WHERE LOWER(slug) LIKE ? LIMIT 1',
              ['%' + match.home_team.toLowerCase() + '%'],
              (e, r) => resolve(r)
            )
          })

          const awayTeam = await new Promise<any>((resolve) => {
            db.get(
              'SELECT id FROM teams WHERE LOWER(slug) LIKE ? LIMIT 1',
              ['%' + match.away_team.toLowerCase() + '%'],
              (e, r) => resolve(r)
            )
          })

          if (homeTeam && awayTeam) {
            matchCount++
          }
        }
      }

      console.log(`  ✅ ${matchCount} maç kontrol edildi`)
    }

    if (data.clubs) {
      console.log(`  ✅ ${data.clubs.length} takım veri bulundu`)
    }
  } catch (error) {
    console.log(`  ⚠️  HATA: ${(error as any).message}`)
  }
}

// =============================================================================
// 3. GOOGLE NEWS - HABERLERİ ÇEKMEK
// =============================================================================

async function fetchNewsFromGoogle() {
  console.log('\n🔍 GOOGLE NEWS - HABERLER')

  try {
    const res = await axios.get('https://news.google.com/rss/search?q=football', {
      timeout: 10000,
      maxRedirects: 5
    })

    const titleMatches = res.data?.match(/<title>([^<]{10,300})<\/title>/g) || []
    const linkMatches = res.data?.match(/<link>([^<]{10,500})<\/link>/g) || []

    let newsCount = 0

    for (let i = 1; i < Math.min(titleMatches.length, 100); i++) {
      const title = titleMatches[i]?.replace(/<[^>]*>/g, '')?.trim() || ''
      const link = linkMatches[i]?.replace(/<[^>]*>/g, '')?.trim() || ''

      if (title.length > 10 && !title.includes('Google')) {
        await new Promise<void>((resolve) => {
          db.run(
            `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
             SELECT s.id, ?, ?, 'google-news', 'news', datetime('now')
             FROM sports s
             WHERE s.slug = 'football'`,
            [title.slice(0, 200), link],
            () => {
              newsCount++
              resolve()
            }
          )
        })
      }
    }

    console.log(`  ✅ ${newsCount} haber eklendi`)
  } catch (error) {
    console.log(`  ⚠️  HATA: ${(error as any).message}`)
  }
}

// =============================================================================
// 4. WIKIPEDIA - HABERLER ARAMASI
// =============================================================================

async function searchNewsOnWikipedia() {
  console.log('\n📖 WIKIPEDIA - SPOR HABERLERİ ARAMA')

  const queries = ['football', 'soccer news', 'sports']

  let newsCount = 0

  for (const query of queries) {
    try {
      const res = await axios.get('https://en.wikipedia.org/w/api.php', {
        params: {
          action: 'query',
          list: 'search',
          srsearch: query,
          format: 'json'
        },
        timeout: 8000
      })

      const results = res.data.query?.search || []

      for (const result of results.slice(0, 20)) {
        await new Promise<void>((resolve) => {
          db.run(
            `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
             SELECT s.id, ?, ?, 'wikipedia', 'analysis', datetime('now')
             FROM sports s
             WHERE s.slug = 'football'`,
            [
              (result.title || '').slice(0, 200),
              'https://en.wikipedia.org/wiki/' + (result.title || '').replace(/\s+/g, '_')
            ],
            () => {
              newsCount++
              resolve()
            }
          )
        })
      }

      await delay(500)
    } catch (error) {
      // continue
    }
  }

  console.log(`  ✅ ${newsCount} Wikipedia haber eklendi`)
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  await initDatabase()

  console.log('\n' + '='.repeat(70))
  console.log('  🔗 ÇALIŞAN API\'LERDEN VERİ ÇEKİŞİ')
  console.log('  Wikipedia + OpenFootball + Google News')
  console.log('='.repeat(70))

  try {
    // 1. Wikipedia oyuncu bilgileri
    await enrichPlayersFromWikipedia()

    // 2. OpenFootball maçlar
    await enrichDataFromOpenFootball()

    // 3. Google News haberler
    await fetchNewsFromGoogle()

    // 4. Wikipedia haberler
    await searchNewsOnWikipedia()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ VERİ ÇEKİŞİ TAMAMLANDI!')
    console.log('='.repeat(70))

    // Final status
    setTimeout(() => {
      db.all(
        `SELECT 'Players' as entity, COUNT(*) as count FROM players
         UNION ALL SELECT 'News', COUNT(*) FROM news
         UNION ALL SELECT 'Player Stats', COUNT(*) FROM player_season_stats
         UNION ALL SELECT 'Events', COUNT(*) FROM events`,
        (err, rows: any) => {
          console.log('\n📊 FINAL DURUM:')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.entity}: ${row.count}`)
            })
          }
          process.exit(0)
        }
      )
    }, 2000)

  } catch (error) {
    console.error('❌ ERROR:', error)
    process.exit(1)
  }
}

main()
