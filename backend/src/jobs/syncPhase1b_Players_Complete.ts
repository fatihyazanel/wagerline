import axios from 'axios'
import { getDb } from '../database/init'

const db = getDb()

/**
 * OYUNCU VERİSİ - KAPSAMLI ÇEKME
 *
 * Kaynaklar (Sırada):
 * 1. API-Football (RapidAPI) - Çok kapsamlı
 * 2. Transfermarkt Web Scraping - Tarihsel veriler
 * 3. Wikidata - Oyuncu bilgileri
 * 4. TheSportsDB - Mevcut veriler (zaten alınmış)
 *
 * Hedef: 1000+ oyuncu (50-100 per team × 20 team)
 */

const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123'
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const RAPIDAPI_HOST = 'api-football-v1.p.rapidapi.com'

let requestCount = 0
let lastRequestTime = Date.now()
const RATE_LIMIT_DELAY = 1000 // 1 saniye

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function rateLimitedFetch(url: string, headers?: any): Promise<any> {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime

  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await delay(RATE_LIMIT_DELAY - timeSinceLastRequest)
  }

  lastRequestTime = Date.now()
  requestCount++

  try {
    const response = await axios.get(url, {
      headers: headers || {},
      timeout: 15000
    })
    return response.data
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.log(`  ⏳ Rate limited - waiting 5s`)
      await delay(5000)
      return rateLimitedFetch(url, headers)
    }
    console.log(`  ⚠️  Fetch error: ${error.message.slice(0, 100)}`)
    return null
  }
}

// 1. API-FOOTBALL İLE OYUNCU ÇEKME
async function fetchPlayersFromAPIFootball() {
  console.log('\n⚡ API-FOOTBALL\'DAN OYUNCULAR ÇEKİLİYOR...')

  if (!RAPIDAPI_KEY) {
    console.log('  ℹ️  API-Football key yok (opsiyonel)')
    return
  }

  const leagues = [
    { name: 'Premier League', id: 39 },
    { name: 'La Liga', id: 140 },
    { name: 'Serie A', id: 135 },
    { name: 'Bundesliga', id: 78 },
    { name: 'Ligue 1', id: 61 }
  ]

  let totalPlayers = 0
  const season = 2024

  for (const league of leagues) {
    console.log(`  📥 ${league.name} oyuncuları...`)

    try {
      // Step 1: Ligin takımlarını getir
      const teamsResponse = await rateLimitedFetch(
        `https://${RAPIDAPI_HOST}/v3/teams?league=${league.id}&season=${season}`,
        {
          'x-rapidapi-key': RAPIDAPI_KEY,
          'x-rapidapi-host': RAPIDAPI_HOST
        }
      )

      if (!teamsResponse?.response) continue

      const teams = teamsResponse.response.slice(0, 5) // İlk 5 takımdan oyuncu çek

      for (const team of teams) {
        try {
          // Step 2: Takımın oyuncularını getir
          const playersResponse = await rateLimitedFetch(
            `https://${RAPIDAPI_HOST}/v3/teams/${team.team.id}?season=${season}`,
            {
              'x-rapidapi-key': RAPIDAPI_KEY,
              'x-rapidapi-host': RAPIDAPI_HOST
            }
          )

          if (!playersResponse?.response?.players) continue

          // Step 3: Oyuncuları DB'ye yaz
          for (const player of playersResponse.response.players.slice(0, 30)) {
            const playerSlug = (player.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

            await new Promise<void>((resolve) => {
              db.run(
                `INSERT OR IGNORE INTO players (sport_id, external_id, slug, country_id, active)
                 SELECT s.id, ?, ?, c.id, 1
                 FROM sports s
                 LEFT JOIN countries c ON c.name LIKE ?
                 WHERE s.slug = 'football'`,
                [player.id || `api-football-${player.name}`, playerSlug, player.nationality || 'Unknown'],
                function() {
                  const playerDbId = this.lastID

                  db.run(
                    `INSERT OR IGNORE INTO player_translations (player_id, language, name)
                     VALUES (?, 'en', ?)`,
                    [playerDbId, player.name],
                    () => {
                      db.run(
                        `INSERT OR IGNORE INTO player_extended_info (player_id, height, weight, date_of_birth)
                         VALUES (?, ?, ?, ?)`,
                        [playerDbId, player.height || null, player.weight || null, player.birth?.date || null],
                        () => resolve()
                      )
                    }
                  )
                }
              )
            })

            totalPlayers++
          }
        } catch (error) {
          // continue
        }
      }
    } catch (error) {
      console.log(`  ⚠️  ${league.name} hata`)
    }
  }

  console.log(`  📊 API-Football'dan ${totalPlayers} oyuncu eklendi`)
}

// 2. TRANSFERMARKT WEB SCRAPING
async function fetchPlayersFromTransfermarkt() {
  console.log('\n🌐 TRANSFERMARKT\'TEN OYUNCULAR ÇEKİLİYOR...')

  try {
    // Transfermarkt doğrudan API yok, HTML scraping gerekli
    // Cheerio veya Puppeteer ile yapılabilir

    const clubData = [
      { name: 'Manchester United', url: 'manchester-united' },
      { name: 'Manchester City', url: 'manchester-city' },
      { name: 'Liverpool', url: 'liverpool-fc' },
      { name: 'Arsenal', url: 'arsenal-fc' },
      { name: 'Chelsea', url: 'chelsea-fc' },
      { name: 'Tottenham', url: 'tottenham-hotspur' },
      { name: 'Newcastle', url: 'newcastle-united' },
      { name: 'Brighton', url: 'brighton-hove-albion' }
    ]

    let totalPlayers = 0

    for (const club of clubData) {
      try {
        // Transfermarkt club page'ine eriş
        const response = await axios.get(
          `https://www.transfermarkt.com/${club.url}/kader/verein/`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0'
            },
            timeout: 10000
          }
        )

        // HTML'den oyuncu adlarını çıkar (basit regex)
        const playerMatches = response.data.match(/<a href="\/(.+?)\/profil\/" class="spielprofil_tooltip" title="(.+?)"/g) || []

        for (const match of playerMatches.slice(0, 50)) {
          const nameMatch = match.match(/title="(.+?)"/)
          if (nameMatch) {
            const playerName = nameMatch[1]
            const playerSlug = playerName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

            await new Promise<void>((resolve) => {
              db.run(
                `INSERT OR IGNORE INTO players (sport_id, external_id, slug, country_id, active)
                 SELECT s.id, ?, ?, c.id, 1
                 FROM sports s
                 LEFT JOIN countries c ON c.name = 'England'
                 WHERE s.slug = 'football'`,
                [`tm-${club.url}-${playerSlug}`, playerSlug],
                function() {
                  const playerDbId = this.lastID

                  db.run(
                    `INSERT OR IGNORE INTO player_translations (player_id, language, name)
                     VALUES (?, 'en', ?)`,
                    [playerDbId, playerName],
                    () => resolve()
                  )
                }
              )
            })

            totalPlayers++
          }
        }

        console.log(`  ✅ ${club.name}: ${Math.min(playerMatches.length, 50)} oyuncu`)
      } catch (error) {
        console.log(`  ⚠️  ${club.url} scraping başarısız`)
      }
    }

    console.log(`  📊 Transfermarkt'ten ${totalPlayers} oyuncu eklendi`)
  } catch (error) {
    console.log(`  ⚠️  Transfermarkt hata`)
  }
}

// 3. WIKIDATA İLE OYUNCU BİLGİLERİ ZENGINLEŞTIRME
async function enrichPlayerDataFromWikidata() {
  console.log('\n📚 WIKIDATA\'DAN OYUNCU BİLGİLERİ ZENGINLEŞTIRILİYOR...')

  try {
    // Top 50 oyuncuyu getir
    const players = await new Promise<any[]>((resolve) => {
      db.all(
        'SELECT id, name FROM player_translations WHERE language = "en" LIMIT 50',
        (err, rows) => resolve(rows || [])
      )
    })

    let enrichedCount = 0

    for (const player of players) {
      try {
        // Wikidata API'den oyuncu arama
        const wdResponse = await axios.get('https://www.wikidata.org/w/api.php', {
          params: {
            action: 'wbsearchentities',
            search: player.name,
            language: 'en',
            type: 'item',
            format: 'json'
          },
          timeout: 5000
        })

        if (wdResponse.data?.search?.length > 0) {
          const entity = wdResponse.data.search[0]

          // Wikidata item details'i çek
          const detailsResponse = await axios.get('https://www.wikidata.org/wiki/Special:EntityData/' + entity.id + '.json', {
            timeout: 5000
          })

          const claims = detailsResponse.data?.entities?.[entity.id]?.claims || {}

          // Height (P2048), Weight (P2067), Birth date (P569)
          const height = claims.P2048?.[0]?.mainsnak?.datavalue?.value?.amount
          const weight = claims.P2067?.[0]?.mainsnak?.datavalue?.value?.amount
          const birthDate = claims.P569?.[0]?.mainsnak?.datavalue?.value?.time

          if (height || weight || birthDate) {
            db.run(
              `UPDATE player_extended_info SET height = ?, weight = ?, date_of_birth = ? WHERE player_id = ?`,
              [height || null, weight || null, birthDate ? birthDate.split('-').slice(0, 3).join('-') : null, player.id],
              () => {}
            )
            enrichedCount++
          }
        }
      } catch (error) {
        // continue
      }
    }

    console.log(`  ✅ ${enrichedCount} oyuncu zenginleştirildi`)
  } catch (error) {
    console.log(`  ⚠️  Wikidata zenginleştirme hata`)
  }
}

// 4. OYUNCU-TAKIM ATAMALARINI GÜNCELLE
async function updatePlayerTeamAssignments() {
  console.log('\n🔗 OYUNCU-TAKIM ATAMALAR GÜNCELLENIYOR...')

  try {
    const teams = await new Promise<any[]>((resolve) => {
      db.all(
        'SELECT id, external_id FROM teams WHERE external_id IS NOT NULL LIMIT 50',
        (err, rows) => resolve(rows || [])
      )
    })

    let assignmentCount = 0

    for (const team of teams) {
      if (!team.external_id) continue

      // TheSportsDB'den oyuncuları getir
      const playerData = await rateLimitedFetch(
        `${THESPORTSDB_BASE}/lookup_all_players.php?id=${team.external_id}`
      )

      if (!playerData?.player || !Array.isArray(playerData.player)) continue

      for (const player of playerData.player.slice(0, 100)) {
        const playerSlug = (player.strPlayer || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

        // Oyuncuyu bul veya oluştur
        const existingPlayer = await new Promise<any>((resolve) => {
          db.get(
            'SELECT id FROM players WHERE slug = ? AND active = 1',
            [playerSlug],
            (err, row) => resolve(row)
          )
        })

        if (existingPlayer) {
          // Atama yap
          await new Promise<void>((resolve) => {
            db.run(
              `INSERT OR IGNORE INTO player_team_assignments (player_id, team_id, season_id, position, shirt_number)
               VALUES (?, ?, 1, ?, ?)`,
              [existingPlayer.id, team.id, player.strPosition || 'MID', player.strNumber || null],
              () => {
                assignmentCount++
                resolve()
              }
            )
          })
        }
      }
    }

    console.log(`  ✅ ${assignmentCount} oyuncu-takım ataması oluşturuldu`)
  } catch (error) {
    console.log(`  ⚠️  Atama güncelleme hata`)
  }
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  PHASE 1B: OYUNCU VERİSİ - KAPSAMLI ÇEKME')
  console.log('  Kaynaklar: API-Football, Transfermarkt, Wikidata')
  console.log('='.repeat(70))

  try {
    // 1. API-Football
    if (RAPIDAPI_KEY) {
      await fetchPlayersFromAPIFootball()
    } else {
      console.log('\n⚠️  API-Football key kurulu değil (opsiyonel)')
      console.log('   Kurulmak için: https://rapidapi.com/api-sports/api/api-football')
      console.log('   Sonra .env dosyasına: RAPIDAPI_KEY=...')
    }

    // 2. Transfermarkt (her durumda dene)
    await fetchPlayersFromTransfermarkt()

    // 3. Wikidata zenginleştirmesi
    await enrichPlayerDataFromWikidata()

    // 4. Atamalar
    await updatePlayerTeamAssignments()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ OYUNCU VERİSİ ÇEKME TAMAMLANDI!')
    console.log('='.repeat(70))
    console.log(`\n📊 İstatistikler:`)
    console.log(`  API Çağrıları: ${requestCount}`)

    setTimeout(() => {
      db.all(
        `SELECT 'Oyuncular' as entity, COUNT(*) as count FROM players
         UNION ALL SELECT 'Oyuncu-Takım Ataması', COUNT(*) FROM player_team_assignments`,
        (err, rows: any) => {
          console.log('\n📈 VERITABANI DURUMU:')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.entity}: ${row.count}`)
            })
          }
          console.log('\n✅ Başarıyla tamamlandı!')
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
