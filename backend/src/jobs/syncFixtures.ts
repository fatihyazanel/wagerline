throw new Error('Legacy synthetic-data job disabled. Use npm run sync:verified.');
import * as sqlite3 from 'sqlite3'
import { getDb } from '../database/init'

const db = getDb()

async function generateFixtures() {
  console.log('🔄 Fikstürler oluşturuluyor...\n')
  let totalMatches = 0

  // Get all competitions
  const competitions = await new Promise<any[]>((resolve) => {
    db.all('SELECT id, slug FROM competitions WHERE slug IN (?, ?, ?, ?, ?, ?)',
      ['premier-league', 'la-liga', 'serie-a', 'bundesliga', 'ligue-1', 'super-lig'],
      (err, rows) => resolve(rows || [])
    )
  })

  const season = await new Promise<any>((resolve) => {
    db.get('SELECT id FROM seasons WHERE name = ? LIMIT 1', ['2025-26'], (err, row) => {
      resolve(row)
    })
  })

  if (!season) {
    console.log('❌ Season 2025-26 not found!')
    process.exit(1)
  }

  for (const comp of competitions) {
    console.log(`📅 ${comp.slug} fikstürü oluşturuluyor...`)

    // Get teams for this competition (via player assignments)
    const teams = await new Promise<any[]>((resolve) => {
      db.all(
        `SELECT DISTINCT t.id, t.slug FROM teams t
         INNER JOIN player_team_assignments pta ON t.id = pta.team_id
         INNER JOIN players p ON pta.player_id = p.id
         WHERE pta.season_id = ?
         LIMIT 20`,
        [season.id],
        (err, rows) => resolve(rows || [])
      )
    })

    if (teams.length === 0) {
      console.log(`  ⚠️  Takım bulunamadı (yalnız player assignments var değil)`)
      continue
    }

    let competitionMatches = 0
    let matchDate = new Date(2025, 7, 15) // Aug 15, 2025

    // Double round-robin: Her takım her takımla 2 kez oynar
    for (let i = 0; i < teams.length; i++) {
      for (let j = 0; j < teams.length; j++) {
        if (i === j) continue

        const homeTeam = teams[i]
        const awayTeam = teams[j]

        // Determine if match is finished or scheduled
        const today = new Date()
        const status = matchDate < today ? 'finished' : 'scheduled'

        // Generate scores only for finished matches
        const homeScore = status === 'finished' ? Math.floor(Math.random() * 5) : 0
        const awayScore = status === 'finished' ? Math.floor(Math.random() * 5) : 0

        await new Promise<void>((resolve) => {
          db.run(
            `INSERT INTO events (sport_id, competition_id, season_id, home_team_id, away_team_id, start_time, status, event_type)
             VALUES (1, ?, ?, ?, ?, ?, ?, 'match')`,
            [comp.id, season.id, homeTeam.id, awayTeam.id, matchDate.toISOString(), status],
            function(err) {
              if (err) {
                resolve()
                return
              }

              const eventId = this.lastID

              // Only insert scores for finished matches
              if (status === 'finished' && (homeScore > 0 || awayScore > 0 || Math.random() > 0.3)) {
                db.run(
                  `INSERT INTO event_scores (event_id, participant_id, score)
                   VALUES (?, ?, ?), (?, ?, ?)`,
                  [eventId, homeTeam.id, homeScore, eventId, awayTeam.id, awayScore],
                  () => resolve()
                )
              } else {
                resolve()
              }
            }
          )
        })

        competitionMatches++
        totalMatches++

        // Advance date by ~3-4 days for next match
        const daysToAdd = 3 + Math.floor(Math.random() * 2)
        matchDate.setDate(matchDate.getDate() + daysToAdd)

        if (competitionMatches % 50 === 0) {
          console.log(`  ✅ ${competitionMatches} maç oluşturuldu`)
        }
      }
    }

    console.log(`  📊 ${comp.slug}: ${competitionMatches} maç oluşturuldu\n`)
  }

  console.log('='.repeat(70))
  console.log(`✨ Toplam ${totalMatches} fikstür maçı başarıyla oluşturuldu!`)
  console.log('='.repeat(70))

  // Verify
  db.all(
    `SELECT c.slug, COUNT(e.id) as match_count
     FROM competitions c
     LEFT JOIN events e ON c.id = e.competition_id
     WHERE c.slug IN (?, ?, ?, ?, ?, ?)
     GROUP BY c.id
     ORDER BY match_count DESC`,
    ['premier-league', 'la-liga', 'serie-a', 'bundesliga', 'ligue-1', 'super-lig'],
    (err, rows: any) => {
      console.log('\n📊 Lig Bazlı Maç Sayıları:')
      if (rows) {
        rows.forEach((row: any) => {
          console.log(`  ${row.slug}: ${row.match_count} maç`)
        })
      }

      db.all(
        `SELECT 'Takımlar' as entity, COUNT(*) as count FROM teams
         UNION ALL
         SELECT 'Oyuncular', COUNT(*) FROM players
         UNION ALL
         SELECT 'Oyuncu-Takım Atama', COUNT(*) FROM player_team_assignments
         UNION ALL
         SELECT 'Maçlar', COUNT(*) FROM events
         UNION ALL
         SELECT 'Maç Skorları', COUNT(*) FROM event_scores`,
        (err, rows: any) => {
          console.log('\n📈 Veritabanı Özeti:')
          if (rows) {
            rows.forEach((row: any) => {
              console.log(`  ${row.entity}: ${row.count}`)
            })
          }
          process.exit(0)
        }
      )
    }
  )
}

console.log('\n' + '='.repeat(70))
console.log('  FIKSTÜR VERİSİ OLUŞTURUCU')
console.log('='.repeat(70) + '\n')

generateFixtures().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
