import axios from 'axios'
import { getDb } from '../database/init'

const db = getDb()

/**
 * HABERLER - ENHANSEDMENTİ
 *
 * Kaynaklar (Aktif Yapılması):
 * 1. NewsAPI - Key kurulması
 * 2. BBC Feeds - XML parse
 * 3. Guardian API - Debug + retry
 * 4. Calcio Web - İtalyan futbolu
 * 5. Marca - İspanyol futbolu
 * 6. Ekip - Türk futbolu
 *
 * Hedef: 200+ haber
 */

const GUARDIAN_KEY = process.env.GUARDIAN_API_KEY || 'REPLACE_WITH_GUARDIAN_API_KEY'
const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const BBC_FEED_URL = 'http://feeds.bbc.co.uk/sport/rss.xml'

let newsCount = 0

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 1. GUARDIAN API - IMPROVED
async function fetchFromGuardianAPI() {
  console.log('\n📰 GUARDIAN API - GELIŞTIRILMIŞ')

  const queries = [
    { q: 'injury report', section: 'sport' },
    { q: 'transfer news', section: 'sport' },
    { q: 'football match', section: 'sport' },
    { q: 'team news', section: 'sport' },
    { q: 'player performance', section: 'sport' }
  ]

  for (const query of queries) {
    try {
      console.log(`  🔍 Query: ${query.q}...`)

      const response = await axios.get('https://open-platform.theguardian.com/search', {
        params: {
          q: query.q,
          section: query.section,
          'api-key': GUARDIAN_KEY,
          format: 'json',
          'page-size': 20,
          'show-fields': 'headline,byline,standfirst,thumbnail'
        },
        timeout: 10000
      })

      if (response.data?.response?.results) {
        for (const article of response.data.response.results) {
          try {
            // Haber türünü belirle
            let newsType = 'news'
            const title = article.webTitle?.toLowerCase() || ''

            if (title.includes('injury') || title.includes('injured')) newsType = 'injury'
            else if (title.includes('transfer')) newsType = 'transfer'
            else if (title.includes('result') || title.includes('beat')) newsType = 'match_result'
            else if (title.includes('preview') || title.includes('preview')) newsType = 'preview'

            await new Promise<void>((resolve) => {
              db.run(
                `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
                 SELECT s.id, ?, ?, ?, ?, ?
                 FROM sports s
                 WHERE s.slug = 'football'`,
                [
                  article.webTitle?.slice(0, 200),
                  article.webUrl,
                  'guardian',
                  newsType,
                  article.webPublicationDate
                ],
                () => {
                  newsCount++
                  resolve()
                }
              )
            })
          } catch (error) {
            // continue
          }
        }

        console.log(`    ✅ ${Math.min(response.data.response.results.length, 20)} haber`)
      }
    } catch (error) {
      console.log(`    ⚠️  Hata: ${(error as any).message.slice(0, 50)}`)
    }

    await delay(500)
  }

  console.log(`  📊 Guardian toplamı: ${newsCount} haber`)
}

// 2. NEWSAPI
async function fetchFromNewsAPI() {
  console.log('\n📰 NEWSAPI')

  if (!NEWSAPI_KEY) {
    console.log('  ⚠️  Key yok. Kurulmak için:')
    console.log('     1. https://newsapi.org/register')
    console.log('     2. .env dosyasına: NEWSAPI_KEY=...')
    return
  }

  try {
    const queries = ['football injury', 'football transfer', 'soccer news']

    for (const query of queries) {
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          sortBy: 'publishedAt',
          language: 'en',
          apiKey: NEWSAPI_KEY,
          pageSize: 20
        },
        timeout: 10000
      })

      if (response.data?.articles) {
        for (const article of response.data.articles) {
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
               SELECT s.id, ?, ?, ?, ?, ?
               FROM sports s
               WHERE s.slug = 'football'`,
              [
                article.title?.slice(0, 200),
                article.url,
                'newsapi',
                'news',
                article.publishedAt
              ],
              () => {
                newsCount++
                resolve()
              }
            )
          })
        }

        console.log(`  ✅ ${query}: ${Math.min(response.data.articles.length, 20)} haber`)
      }
    }
  } catch (error) {
    console.log(`  ⚠️  NewsAPI hatası`)
  }
}

// 3. BBC FEEDS - IMPROVED XML PARSING
async function fetchFromBBCFeed() {
  console.log('\n📰 BBC SPORTS FEED')

  try {
    const response = await axios.get(BBC_FEED_URL, {
      timeout: 10000
    })

    // İlkel XML parsing
    const titleMatches = response.data?.match(/<title>([^<]+)<\/title>/g) || []
    const linkMatches = response.data?.match(/<link>([^<]+)<\/link>/g) || []
    const pubDateMatches = response.data?.match(/<pubDate>([^<]+)<\/pubDate>/g) || []

    let bbcCount = 0

    for (let i = 1; i < Math.min(titleMatches.length, 30); i++) {
      try {
        const title = titleMatches[i]?.replace(/<[^>]*>/g, '') || ''
        const link = linkMatches[i]?.replace(/<[^>]*>/g, '') || ''
        const pubDate = pubDateMatches[i]?.replace(/<[^>]*>/g, '') || new Date().toISOString()

        if (title && title.toLowerCase().includes('football')) {
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
               SELECT s.id, ?, ?, ?, ?, ?
               FROM sports s
               WHERE s.slug = 'football'`,
              [
                title.slice(0, 200),
                link,
                'bbc',
                'news',
                pubDate
              ],
              () => {
                bbcCount++
                newsCount++
                resolve()
              }
            )
          })
        }
      } catch (error) {
        // continue
      }
    }

    console.log(`  ✅ BBC: ${bbcCount} haber`)
  } catch (error) {
    console.log(`  ⚠️  BBC Feed hatası`)
  }
}

// 4. SPOR HABERLERİ SITELERI
async function fetchFromSportNews() {
  console.log('\n📰 SPOR HABERLERİ SİTELERİ')

  const sportSites = [
    { name: 'Sky Sports', url: 'https://www.skysports.com/football/news' },
    { name: 'ESPN', url: 'https://www.espn.com/soccer/' },
    { name: 'L\'Équipe', url: 'https://www.lequipe.fr/Football/' },
    { name: 'Mundo Deportivo', url: 'https://www.mundodeportivo.com/' },
    { name: 'Ekip (Türkiye)', url: 'https://www.ekip.tv/' }
  ]

  for (const site of sportSites) {
    try {
      console.log(`  🌐 ${site.name}...`)

      const response = await axios.get(site.url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      })

      // Başlıkları ara
      const titleMatches = response.data?.match(/<h[1-3][^>]*>([^<]+)<\/h/gi) || []

      let siteCount = 0
      for (const match of titleMatches.slice(0, 10)) {
        const title = match.replace(/<[^>]*>/g, '').trim()

        if (title.length > 10) {
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
               SELECT s.id, ?, ?, ?, ?, datetime('now')
               FROM sports s
               WHERE s.slug = 'football'`,
              [
                title.slice(0, 200),
                site.url,
                site.name.toLowerCase().replace(/\s+/g, '-'),
                'news'
              ],
              () => {
                siteCount++
                newsCount++
                resolve()
              }
            )
          })
        }
      }

      console.log(`    ✅ ${siteCount} haber`)
    } catch (error) {
      console.log(`    ⚠️  Hata`)
    }
  }
}

// 5. TAKIM RESMİ HABERLERİ
async function fetchFromClubOfficialNews() {
  console.log('\n📰 TAKIM RESMİ HABERLERİ')

  const clubFeeds = [
    { name: 'Manchester United', url: 'https://www.manutd.com/en/news' },
    { name: 'Manchester City', url: 'https://www.mancity.com/news' },
    { name: 'Liverpool', url: 'https://www.liverpoolfc.com/news' },
    { name: 'Arsenal', url: 'https://www.arsenal.com/news' },
    { name: 'Chelsea', url: 'https://www.chelseafc.com/en/news' },
    { name: 'Real Madrid', url: 'https://www.realmadrid.com/en/news' },
    { name: 'Barcelona', url: 'https://www.fcbarcelona.com/en/news' }
  ]

  for (const club of clubFeeds) {
    try {
      console.log(`  🏟️  ${club.name}...`)

      const response = await axios.get(club.url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      })

      // Article başlıklarını ara
      const titleMatches = response.data?.match(/<a[^>]*href[^>]*>([^<]{10,100})<\/a>/gi) || []

      let clubCount = 0
      for (const match of titleMatches.slice(0, 15)) {
        const title = match.replace(/<[^>]*>/g, '').trim()

        if (title.length > 10 && !title.includes('Menu') && !title.includes('Shop')) {
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
               SELECT s.id, ?, ?, ?, ?, datetime('now')
               FROM sports s
               WHERE s.slug = 'football'`,
              [
                title.slice(0, 200),
                club.url,
                club.name.toLowerCase().replace(/\s+/g, '-'),
                'team_news'
              ],
              () => {
                clubCount++
                newsCount++
                resolve()
              }
            )
          })
        }
      }

      console.log(`    ✅ ${clubCount} haber`)
    } catch (error) {
      console.log(`    ⚠️  Hata`)
    }
  }
}

// 6. GOOGLE NEWS ALTERNATİFİ
async function fetchFromGoogleNewsJSON() {
  console.log('\n📰 GOOGLE NEWS ALTERNATİFİ')

  try {
    // Google News RSS feed
    const response = await axios.get('https://news.google.com/rss/search?q=football', {
      timeout: 10000
    })

    const titleMatches = response.data?.match(/<title>([^<]+)<\/title>/g) || []
    const linkMatches = response.data?.match(/<link>([^<]+)<\/link>/g) || []

    let googleCount = 0

    for (let i = 1; i < Math.min(titleMatches.length, 25); i++) {
      const title = titleMatches[i]?.replace(/<[^>]*>/g, '') || ''
      const link = linkMatches[i]?.replace(/<[^>]*>/g, '') || ''

      if (title.length > 5) {
        await new Promise<void>((resolve) => {
          db.run(
            `INSERT OR IGNORE INTO news (sport_id, title, content, source, news_type, published_at)
             SELECT s.id, ?, ?, ?, ?, datetime('now')
             FROM sports s
             WHERE s.slug = 'football'`,
            [title.slice(0, 200), link, 'google-news', 'news'],
            () => {
              googleCount++
              newsCount++
              resolve()
            }
          )
        })
      }
    }

    console.log(`  ✅ Google News: ${googleCount} haber`)
  } catch (error) {
    console.log(`  ⚠️  Google News hatası`)
  }
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  PHASE 3B: HABERLER - ENHANSEDMENT')
  console.log('  Kaynaklar: Guardian, NewsAPI, BBC, Google, Club Sites')
  console.log('='.repeat(70))

  try {
    // 1. Guardian
    await fetchFromGuardianAPI()

    // 2. NewsAPI
    await fetchFromNewsAPI()

    // 3. BBC
    await fetchFromBBCFeed()

    // 4. Spor Siteleri
    await fetchFromSportNews()

    // 5. Takım Haberleri
    await fetchFromClubOfficialNews()

    // 6. Google News
    await fetchFromGoogleNewsJSON()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ HABER ÇEKME TAMAMLANDI!')
    console.log('='.repeat(70))
    console.log(`\n📊 Toplam: ${newsCount} haber`)

    setTimeout(() => {
      db.all(
        `SELECT source, COUNT(*) as count FROM news GROUP BY source ORDER BY count DESC`,
        (err, rows: any) => {
          console.log('\n📈 HABERLER (KAYNAKLARA GÖRE):')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.source}: ${row.count}`)
            })
          }

          db.get(
            `SELECT COUNT(*) as total FROM news`,
            (err, row: any) => {
              console.log(`\n📰 TOPLAM HABER: ${row?.total || 0}`)
              console.log('\n✅ Başarıyla tamamlandı!')
              process.exit(0)
            }
          )
        }
      )
    }, 1000)

  } catch (error) {
    console.error('❌ ERROR:', error)
    process.exit(1)
  }
}

main()
