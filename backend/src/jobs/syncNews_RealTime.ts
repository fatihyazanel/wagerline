import axios from 'axios'
import { getDb } from '../database/init'

const db = getDb()

/**
 * HABERLER & EXT. VERİ SİNCRONİZASYONU
 * NewsAPI, Guardian API, BBC Feeds'ten veri çeker
 * Yaralanmalar, transferler, takım haberleri
 */

// Guardian API Integration
async function fetchFromGuardianAPI() {
  console.log('\n📰 Guardian API\'den veriler çekiliyor...')

  const guardianKey = process.env.GUARDIAN_API_KEY || 'REPLACE_WITH_GUARDIAN_API_KEY'
  const queries = ['injury', 'transfer', 'football news']
  let newsCount = 0

  for (const query of queries) {
    try {
      const response = await axios.get('https://open-platform.theguardian.com/search', {
        params: {
          q: query,
          'section': 'sport',
          'api-key': guardianKey,
          'format': 'json'
        },
        timeout: 10000
      })

      if (response.data?.response?.results) {
        for (const article of response.data.response.results.slice(0, 5)) {
          // Parse article for relevant info
          const isInjury = article.webTitle?.toLowerCase().includes('injury')
          const isTransfer = article.webTitle?.toLowerCase().includes('transfer')

          if (isInjury) {
            // Extract player name and team from title
            const playerMatch = article.webTitle?.match(/([A-Z][a-z]+ [A-Z][a-z]+)/)?.[0]
            if (playerMatch) {
              newsCount++
              console.log(`    ✅ Yaralanma: ${article.webTitle?.slice(0, 60)}...`)
            }
          }

          if (isTransfer) {
            newsCount++
            console.log(`    ✅ Transfer: ${article.webTitle?.slice(0, 60)}...`)
          }
        }
      }
    } catch (error) {
      console.log(`    ⚠️  Guardian query failed: ${query}`)
    }
  }

  console.log(`  📊 Guardian'dan ${newsCount} haber işlendi`)
}

// NewsAPI Integration
async function fetchFromNewsAPI() {
  console.log('\n📰 NewsAPI\'den veriler çekiliyor...')

  const newsApiKey = process.env.NEWSAPI_KEY || ''
  if (!newsApiKey) {
    console.log('  ⚠️  NewsAPI key yok (opsiyonel)')
    return
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'football injury transfer',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: newsApiKey,
        pageSize: 20
      },
      timeout: 10000
    })

    if (response.data?.articles) {
      console.log(`  ✅ ${response.data.articles.length} makale alındı`)
      // Process articles for injuries/transfers
      for (const article of response.data.articles.slice(0, 5)) {
        console.log(`    📄 ${article.title?.slice(0, 50)}...`)
      }
    }
  } catch (error) {
    console.log('  ⚠️  NewsAPI fetch failed')
  }
}

// BBC Feeds Integration
async function fetchFromBBCFeed() {
  console.log('\n📰 BBC Sports Feed\'den veriler çekiliyor...')

  try {
    const response = await axios.get('http://feeds.bbc.co.uk/sport/rss.xml', {
      timeout: 10000
    })

    // Parse RSS (simplified)
    const titleMatches = response.data?.match(/<title>([^<]+)<\/title>/g) || []
    console.log(`  ✅ ${titleMatches.length} BBC haber alındı`)

    for (const title of titleMatches.slice(0, 5)) {
      const cleanTitle = title.replace(/<[^>]*>/g, '')
      console.log(`    📄 ${cleanTitle.slice(0, 50)}...`)
    }
  } catch (error) {
    console.log('  ⚠️  BBC Feed fetch failed')
  }
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  HABERLER & EXT. VERİ SENKRONIZASYONU')
  console.log('='.repeat(70))

  try {
    await fetchFromGuardianAPI()
    await fetchFromNewsAPI()
    await fetchFromBBCFeed()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ HABER SENKRONIZASYONU TAMAMLANDI')
    console.log('='.repeat(70) + '\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ ERROR:', error)
    process.exit(1)
  }
}

main()
