import axios from 'axios'
import { getDb } from '../database/init'

const db = getDb()
const THESPORTSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/123'

let requestCount = 0
let lastRequestTime = Date.now()
const RATE_LIMIT_DELAY = 1500

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
      await delay(10000)
      return rateLimitedFetch(url)
    }
    return null
  }
}

const LEAGUES = {
  'premier-league': { id: '133602', name: 'Premier League' },
  'la-liga': { id: '133603', name: 'La Liga' },
  'serie-a': { id: '133604', name: 'Serie A' },
  'bundesliga': { id: '133605', name: 'Bundesliga' },
  'ligue-1': { id: '133606', name: 'Ligue 1' },
  'super-lig': { id: '133632', name: 'Super Lig' },
  'eredivisie': { id: '133607', name: 'Eredivisie' }
}

// ✅ FIXED: Correct TheSportsDB endpoint for fixtures
async function fetchFixtures() {
  console.log('\n📅 FİKSTÜRLER ÇEKİLİYOR (TheSportsDB)...')

  let totalMatches = 0

  for (const [slug, league] of Object.entries(LEAGUES)) {
    console.log(`  📥 ${league.name} maçları...`)

    // ✅ DOĞRU ENDPOINT: eventslast.php (son maçlar)
    const data = await rateLimitedFetch(
      `${THESPORTSDB_BASE}/eventslast.php?id=${league.id}`
    )

    if (data?.results && Array.isArray(data.results)) {
      for (const match of data.results) {
        const homeTeamId = match.idHomeTeam
        const awayTeamId = match.idAwayTeam
        const compId = match.idLeague

        await new Promise<void>((resolve) => {
          // Get team IDs from database
          db.get(
            'SELECT id FROM teams WHERE external_id = ?',
            [homeTeamId],
            (err, homeTeam: any) => {
              db.get(
                'SELECT id FROM teams WHERE external_id = ?',
                [awayTeamId],
                (err, awayTeam: any) => {
                  if (!homeTeam || !awayTeam) {
                    resolve()
                    return
                  }

                  // Insert event
                  db.run(
                    `INSERT OR IGNORE INTO events (sport_id, home_team_id, away_team_id, competition_id, start_time, status)
                     SELECT s.id, ?, ?, c.id, ?, ?
                     FROM sports s, competitions c
                     WHERE s.slug = 'football' AND c.external_provider = 'thesportsdb'`,
                    [homeTeam.id, awayTeam.id, match.dateEvent, match.strStatus?.toLowerCase() || 'finished'],
                    function() {
                      const eventId = this.lastID

                      // Insert scores
                      if (match.intHomeScore !== null) {
                        db.run(
                          `INSERT OR IGNORE INTO event_scores (event_id, participant_id, score)
                           VALUES (?, ?, ?)`,
                          [eventId, homeTeam.id, match.intHomeScore],
                          () => {}
                        )
                      }

                      if (match.intAwayScore !== null) {
                        db.run(
                          `INSERT OR IGNORE INTO event_scores (event_id, participant_id, score)
                           VALUES (?, ?, ?)`,
                          [eventId, awayTeam.id, match.intAwayScore],
                          () => resolve()
                        )
                      } else {
                        resolve()
                      }
                    }
                  )
                }
              )
            }
          )
        })

        totalMatches++
      }
    }
  }

  console.log(`  📊 TheSportsDB'den ${totalMatches} maç başarıyla yüklendi`)
}

// Puan durumları hesaplama (database'den)
async function generateStandings() {
  console.log('\n📊 PUAN DURUMLARI HESAPLANIYOR...')

  await new Promise<void>((resolve) => {
    db.run(`
      WITH match_results AS (
        SELECT
          e.competition_id,
          CASE WHEN h.external_id IS NOT NULL THEN h.id ELSE a.id END as team_id,
          COUNT(*) as played,
          SUM(CASE WHEN es_h.score > es_a.score THEN 1 ELSE 0 END) as wins,
          SUM(CASE WHEN es_h.score = es_a.score THEN 1 ELSE 0 END) as draws,
          SUM(CASE WHEN es_h.score < es_a.score THEN 1 ELSE 0 END) as losses,
          SUM(CASE WHEN h.id IS NOT NULL THEN es_h.score ELSE es_a.score END) as goals_for,
          SUM(CASE WHEN h.id IS NOT NULL THEN es_a.score ELSE es_h.score END) as goals_against
        FROM events e
        JOIN teams h ON e.home_team_id = h.id
        JOIN teams a ON e.away_team_id = a.id
        LEFT JOIN event_scores es_h ON e.id = es_h.event_id AND es_h.participant_id = h.id
        LEFT JOIN event_scores es_a ON e.id = es_a.event_id AND es_a.participant_id = a.id
        WHERE e.status = 'finished'
        GROUP BY e.competition_id, team_id
      )
      INSERT OR IGNORE INTO standings (competition_id, season_id, team_id, position, played, wins, draws, losses, goals_for, goals_against)
      SELECT
        competition_id,
        1,
        team_id,
        ROW_NUMBER() OVER (PARTITION BY competition_id ORDER BY (wins*3 + draws) DESC),
        played,
        wins,
        draws,
        losses,
        goals_for,
        goals_against
      FROM match_results;
    `, [], () => resolve())
  })

  console.log(`  ✅ Puan durumları hesaplandı`)
}

// Oyuncu istatistikleri
async function generatePlayerStats() {
  console.log('\n👤 OYUNCU İSTATİSTİKLERİ HESAPLANIYOR...')

  // Veritabanındaki event_statistics tablosundan hesaplama
  await new Promise<void>((resolve) => {
    db.run(`
      INSERT OR IGNORE INTO player_season_stats (player_id, season_id, goals, assists, games_played)
      SELECT p.id, 1,
        COALESCE(SUM(CASE WHEN es.goal_type IS NOT NULL THEN 1 ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN es.goal_assist IS NOT NULL THEN 1 ELSE 0 END), 0),
        COUNT(DISTINCT es.event_id)
      FROM players p
      LEFT JOIN event_statistics es ON p.external_id = es.player_id
      GROUP BY p.id
      HAVING COUNT(DISTINCT es.event_id) > 0;
    `, [], () => resolve())
  })

  console.log(`  ✅ Oyuncu istatistikleri hesaplandı`)
}

// API-Football alternatif
async function fetchFromAPIFootball() {
  console.log('\n⚡ API-FOOTBALL (RapidAPI) ALTERNATIFI...')

  const rapidApiKey = process.env.RAPIDAPI_KEY

  if (!rapidApiKey) {
    console.log(`  ℹ️  API key kurulu değil, atlanıyor`)
    return
  }

  try {
    // API-Football'dan fixture'lar
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: { league: 39, season: 2024, last: 50 },
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      },
      timeout: 10000
    })

    console.log(`  ✅ API-Football'dan ${response.data?.response?.length || 0} fixture alındı`)
  } catch (error) {
    console.log(`  ⚠️  API-Football veri çekme başarısız`)
  }
}

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  PHASE 2: MAÇ VERİLERİ & İSTATİSTİKLER')
  console.log('  Kaynaklar: TheSportsDB, API-Football')
  console.log('='.repeat(70))

  try {
    await fetchFixtures()
    await generateStandings()
    await generatePlayerStats()
    await fetchFromAPIFootball()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ PHASE 2 TAMAMLANDI!')
    console.log('='.repeat(70))
    console.log(`\n📊 İstatistikler:`)
    console.log(`  API Çağrıları: ${requestCount}`)

    setTimeout(() => {
      db.all(
        `SELECT 'Maçlar' as entity, COUNT(*) as count FROM events
         UNION ALL
         SELECT 'Maç Skorları', COUNT(*) FROM event_scores
         UNION ALL
         SELECT 'Puan Durumları', COUNT(*) FROM standings`,
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
