/**
 * NEWS SYNC SERVICE
 *
 * Haberleri şu kaynaklardan çeker:
 * 1. Guardian API (Sports section)
 * 2. BBC Sport RSS (alternative)
 * 3. ESPN API (future)
 *
 * Bağlantılar:
 * - Sports ile ilişkilendirme
 * - Takımlarla eşleştirme
 * - Full-text search indexing
 */

import sqlite3 from 'sqlite3'
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_PATH || './data/wagerline.db'
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

// Guardian API Client
const guardianApi = axios.create({
  baseURL: 'https://content.guardianapis.com',
  timeout: 15000,
})

// ==================== GUARDIAN SYNC ====================

async function syncGuardianNews() {
  console.log('\n🔄 Syncing news from Guardian...')
  let created = 0

  try {
    // Guardian API key from .env
    const guardianKey = process.env.GUARDIAN_API_KEY || 'test'

    if (!guardianKey || guardianKey === 'test') {
      console.log('  ⚠️  Guardian API key not configured')
      console.log('  Get key: https://open-platform.theguardian.com/')
      console.log('  Add to .env: GUARDIAN_API_KEY=your_key')
      return 0
    }

    console.log('  📡 Fetching articles from Guardian API...')

    const response = await guardianApi.get('/search', {
      params: {
        'api-key': guardianKey,
        section: 'sport',
        'order-by': 'newest',
        'page-size': 50,
        'show-fields': 'headline,standfirst,bylineImageUrl,thumbnail',
        'show-tags': 'contributor,keyword,tone',
      },
    })

    const articles = response.data.response.results || []
    console.log(`  Found ${articles.length} articles`)

    // Get football sport ID
    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) throw new Error('Football sport not found')

    for (const article of articles) {
      try {
        // Check if already exists
        const existing = await get('SELECT id FROM news WHERE external_url = ?', [
          article.webUrl,
        ])

        if (!existing) {
          // Parse publication date
          const publishedAt = new Date(article.webPublicationDate).toISOString()

          // Generate slug from title
          const slug = article.webTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 100)

          // Insert news
          const result = await run(
            `INSERT INTO news
             (title, slug, description, content, image_url, external_url, source,
              sport_id, published_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              article.webTitle,
              slug,
              article.fields?.standfirst || '',
              article.webUrl,
              article.fields?.thumbnail || '',
              article.webUrl,
              'guardian',
              sport.id,
              publishedAt,
              new Date().toISOString(),
            ]
          )

          if (result.lastID) {
            // Try to match with teams
            const teams = await all(
              `SELECT id, slug FROM teams WHERE sport_id = ? LIMIT 10`,
              [sport.id]
            )

            const title = article.webTitle.toLowerCase()
            for (const team of teams) {
              if (title.includes(team.slug.replace('-', ' ')) ||
                  title.includes(team.slug)) {
                await run(
                  'INSERT OR IGNORE INTO news_entities (news_id, entity_type, entity_id) VALUES (?, ?, ?)',
                  [result.lastID, 'team', team.id]
                ).catch(() => {}) // Ignore if table doesn't exist
              }
            }

            created++
            console.log(`  ✅ ${article.webTitle.substring(0, 50)}...`)
          }
        }
      } catch (err) {
        console.error(`  Error: ${err}`)
      }
    }

    console.log(`  Created: ${created}`)
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      console.log('  ⚠️  Guardian API returned 404 - Check API key')
    } else {
      console.error('  ❌ Error:', error instanceof Error ? error.message : error)
    }
  }

  return created
}

// ==================== BBC SPORT SYNC ====================

async function syncBBCNews() {
  console.log('\n🔄 Syncing news from BBC Sport...')
  let created = 0

  try {
    console.log('  📡 Fetching articles from BBC Sport...')

    // Try BBC Sport RSS Feed (alternative URL)
    let response
    try {
      response = await axios.get('https://www.bbc.com/sport/rss.xml', {
        timeout: 15000,
      })
    } catch (err) {
      console.log('  ℹ️  BBC primary feed unavailable, trying alternative...')
      response = await axios.get('http://feeds.bbc.co.uk/sport/football/rss.xml', {
        timeout: 15000,
      })
    }

    const xml = response.data

    // Simple XML parsing for RSS
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const items = [...xml.matchAll(itemRegex)]

    console.log(`  Found ${items.length} items`)

    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) throw new Error('Football sport not found')

    for (const match of items.slice(0, 30)) {
      try {
        const item = match[1]

        // Extract fields using regex
        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/)
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/)
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/)
        const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
        const imageMatch = item.match(/<image><url>([\s\S]*?)<\/url><\/image>/) ||
                          item.match(/<media:thumbnail[^>]*url="([^"]*)"/) ||
                          item.match(/<media:content[^>]*url="([^"]*)"/)

        if (!titleMatch) continue

        const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
        const description = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '') : ''
        const link = linkMatch ? linkMatch[1].trim() : ''
        const imageUrl = imageMatch ? imageMatch[1].trim() : ''
        const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString()

        // Check if exists
        const existing = await get('SELECT id FROM news WHERE external_url = ?', [
          link,
        ])

        if (!existing && title && link) {
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 100)

          const result = await run(
            `INSERT INTO news
             (title, slug, description, content, image_url, external_url, source,
              sport_id, published_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              title,
              slug,
              description,
              link,
              imageUrl,
              link,
              'bbc',
              sport.id,
              publishedAt,
              new Date().toISOString(),
            ]
          )

          if (result.lastID) {
            created++
            console.log(`  ✅ ${title.substring(0, 50)}...`)
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }
    }

    console.log(`  Created: ${created}`)
  } catch (error) {
    console.error('  ❌ BBC Error:', error instanceof Error ? error.message : error)
  }

  return created
}

// ==================== NEWSAPI SYNC ====================

async function syncNewsAPINews() {
  console.log('\n🔄 Syncing news from NewsAPI...')
  let created = 0

  try {
    // NewsAPI - Free tier doesn't require key for sports
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'sports',
        sortBy: 'publishedAt',
        language: 'en',
        pageSize: 50,
      },
      timeout: 15000,
    })

    const articles = response.data.articles || []
    console.log(`  Found ${articles.length} articles`)

    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) throw new Error('Football sport not found')

    for (const article of articles.slice(0, 30)) {
      try {
        const existing = await get('SELECT id FROM news WHERE external_url = ?', [
          article.url,
        ])

        if (!existing && article.title && article.url) {
          const slug = article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 100)

          const result = await run(
            `INSERT INTO news
             (title, slug, description, content, image_url, external_url, source,
              sport_id, published_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              article.title,
              slug,
              article.description || '',
              article.url,
              article.urlToImage || '',
              article.url,
              'newsapi',
              sport.id,
              new Date(article.publishedAt).toISOString(),
              new Date().toISOString(),
            ]
          )

          if (result.lastID) {
            created++
            console.log(`  ✅ ${article.title.substring(0, 50)}...`)
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }
    }

    console.log(`  Created: ${created}`)
  } catch (error) {
    console.error('  ❌ NewsAPI Error:', error instanceof Error ? error.message : error)
  }

  return created
}

// ==================== ESPNFC SYNC (Alternative) ====================

async function syncESPNNews() {
  console.log('\n🔄 Syncing news from ESPNFC...')
  let created = 0

  try {
    console.log('  📡 Fetching articles from ESPNFC...')

    // ESPNFC RSS
    const response = await axios.get('https://www.espnfc.us/index/rss', {
      timeout: 15000,
    })

    const xml = response.data
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    const items = [...xml.matchAll(itemRegex)]

    console.log(`  Found ${items.length} items`)

    const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
    if (!sport) throw new Error('Football sport not found')

    for (const match of items.slice(0, 20)) {
      try {
        const item = match[1]

        const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/)
        const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/)
        const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
        const descMatch = item.match(/<description>([\s\S]*?)<\/description>/)

        if (!titleMatch) continue

        const title = titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
        const link = linkMatch ? linkMatch[1].trim() : ''
        const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString()
        const description = descMatch ? descMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '') : ''

        const existing = await get('SELECT id FROM news WHERE external_id = ?', [link])

        if (!existing && title && link) {
          const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 100)

          const result = await run(
            `INSERT INTO news
             (title, slug, description, content, external_url, source,
              sport_id, published_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              title,
              slug,
              description,
              link,
              link,
              'espnfc',
              sport.id,
              publishedAt,
              new Date().toISOString(),
            ]
          )

          if (result.lastID) {
            created++
            console.log(`  ✅ ${title.substring(0, 50)}...`)
          }
        }
      } catch (err) {
        // Ignore parsing errors
      }
    }

    console.log(`  Created: ${created}`)
  } catch (error) {
    console.error('  ❌ ESPNFC Error:', error instanceof Error ? error.message : error)
  }

  return created
}

// ==================== MAIN SYNC ====================

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('  WAGERLINE - NEWS SYNC')
  console.log('='.repeat(60))

  try {
    const guardianCount = await syncGuardianNews()
    const bbcCount = await syncBBCNews()
    const espnCount = await syncESPNNews()
    const newsapiCount = await syncNewsAPINews()

    console.log('\n' + '='.repeat(60))
    console.log('  📊 NEWS SYNC SUMMARY')
    console.log('='.repeat(60))
    console.log(`  Guardian:        ${guardianCount}`)
    console.log(`  BBC Sport:       ${bbcCount}`)
    console.log(`  ESPNFC:          ${espnCount}`)
    console.log(`  NewsAPI:         ${newsapiCount}`)
    console.log(`  Total Created:   ${guardianCount + bbcCount + espnCount + newsapiCount}`)

    // Show database stats
    const totalNews = await get('SELECT COUNT(*) as count FROM news')
    const bySource = await all(`
      SELECT source, COUNT(*) as count FROM news GROUP BY source
    `)

    console.log('\n' + '='.repeat(60))
    console.log('  📈 DATABASE STATS')
    console.log('='.repeat(60))
    console.log(`  Total News:      ${totalNews?.count || 0}`)
    console.log('\n  By Source:')
    for (const row of bySource) {
      console.log(`    - ${row.source}: ${row.count}`)
    }

    console.log('\n✨ News sync completed!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Sync failed:', error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    db.close()
  }
}

main()
