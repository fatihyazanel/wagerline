import * as sqlite3 from 'sqlite3'
import { getDb } from '../database/init'

const db = getDb()

async function assignPlayersToTeams() {
  console.log('\n' + '='.repeat(70))
  console.log('  TAKIMLARA OYUNCU ATAMA')
  console.log('='.repeat(70) + '\n')

  // Get the 2025-26 season
  const season = await new Promise<any>((resolve) => {
    db.get('SELECT id FROM seasons WHERE name = ? LIMIT 1', ['2025-26'], (err, row) => {
      resolve(row)
    })
  })

  if (!season) {
    console.log('❌ Sezon bulunamadı!')
    process.exit(1)
  }

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker']

  // Get all teams and all players
  const teams = await new Promise<any[]>((resolve) => {
    db.all('SELECT id FROM teams WHERE active = 1', (err, rows) => {
      resolve(rows || [])
    })
  })

  const allPlayers = await new Promise<any[]>((resolve) => {
    db.all('SELECT id FROM players WHERE active = 1 ORDER BY RANDOM()', (err, rows) => {
      resolve(rows || [])
    })
  })

  console.log(`📊 ${teams.length} takıma ${allPlayers.length} oyuncu atanacak`)
  console.log(`📅 Sezon ID: ${season.id}\n`)

  let totalAssignments = 0
  let playerIndex = 0

  for (const team of teams) {
    // Her takıma 20-25 oyuncu ata
    const playersPerTeam = 20 + Math.floor(Math.random() * 6)

    for (let i = 0; i < playersPerTeam && playerIndex < allPlayers.length; i++) {
      const player = allPlayers[playerIndex++]
      const position = positions[Math.floor(Math.random() * positions.length)]
      const shirtNumber = Math.floor(Math.random() * 99) + 1

      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO player_team_assignments
           (player_id, team_id, season_id, position, shirt_number)
           VALUES (?, ?, ?, ?, ?)`,
          [player.id, team.id, season.id, position, shirtNumber],
          () => {
            totalAssignments++
            resolve()
          }
        )
      })
    }

    if (teams.indexOf(team) % 20 === 0 && teams.indexOf(team) > 0) {
      console.log(`  ✅ ${teams.indexOf(team)} takım tamamlandı (${totalAssignments} atama)`)
    }
  }

  console.log(`\n  📊 Toplam ${totalAssignments} oyuncu-takım ataması yapılmıştır`)
  console.log('\n' + '='.repeat(70))
  console.log('  ✨ Atamalar başarıyla tamamlandı!')
  console.log('='.repeat(70) + '\n')

  // Final verification
  db.all(
    `SELECT
      COUNT(DISTINCT team_id) as teams_with_players,
      COUNT(*) as total_assignments,
      COUNT(DISTINCT player_id) as players_assigned
     FROM player_team_assignments
     WHERE season_id = ?`,
    [season.id],
    (err, rows: any) => {
      if (rows && rows[0]) {
        const r = rows[0]
        console.log(`📈 Sezon ${season.id} Özetí:`)
        console.log(`  Oyuncu atanan takımlar: ${r.teams_with_players}`)
        console.log(`  Toplam atamalar: ${r.total_assignments}`)
        console.log(`  Atanan oyuncular: ${r.players_assigned}`)
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
         SELECT 'Puan Durumları', COUNT(*) FROM standings`,
        (err, rows: any) => {
          console.log('\n📊 VERITABANI ÖZET:')
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

assignPlayersToTeams().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
