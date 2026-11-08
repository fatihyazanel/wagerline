throw new Error('Legacy synthetic-data job disabled. Use npm run sync:verified.');
import * as sqlite3 from 'sqlite3'
import { getDb } from '../database/init'

const db = getDb()

// ============================================================================
// KAPSAMLI VERI GENERATÖRİ - 7 Lig, 150+ Takım, 1000+ Oyuncu, 300+ Maç
// ============================================================================

const leagueConfigs = {
  'premier-league': {
    name: 'Premier League',
    country: 'England',
    teams: 20,
    teamsData: [
      'Manchester United', 'Manchester City', 'Liverpool', 'Arsenal', 'Chelsea',
      'Tottenham', 'Newcastle United', 'Brighton', 'Aston Villa', 'West Ham',
      'Fulham', 'Brentford', 'Crystal Palace', 'Ipswich Town', 'Everton',
      'Leicester City', 'Nottingham Forest', 'Southampton', 'Bournemouth', 'Wolverhampton'
    ]
  },
  'la-liga': {
    name: 'La Liga',
    country: 'Spain',
    teams: 20,
    teamsData: [
      'Real Madrid', 'Barcelona', 'Atlético Madrid', 'Sevilla', 'Real Sociedad',
      'Villarreal', 'Athletic Bilbao', 'Valencia', 'Getafe', 'Rayo Vallecano',
      'Mallorca', 'Real Betis', 'Las Palmas', 'Cádiz', 'Girona',
      'Osasuna', 'Alavés', 'Leganés', 'Real Valladolid', 'Eibar'
    ]
  },
  'serie-a': {
    name: 'Serie A',
    country: 'Italy',
    teams: 20,
    teamsData: [
      'Juventus', 'Inter Milan', 'AC Milan', 'AS Roma', 'Napoli',
      'Lazio', 'Fiorentina', 'Atalanta', 'Torino', 'Bologna',
      'Sassuolo', 'Sampdoria', 'Genoa', 'Cagliari', 'Hellas Verona',
      'Udinese', 'Empoli', 'Monza', 'Como', 'Lecce'
    ]
  },
  'bundesliga': {
    name: 'Bundesliga',
    country: 'Germany',
    teams: 18,
    teamsData: [
      'Bayern Munich', 'Borussia Dortmund', 'Bayer Leverkusen', 'RB Leipzig', 'VfB Stuttgart',
      'Eintracht Frankfurt', 'Werder Bremen', 'Wolfsburg', 'TSG Hoffenheim', 'Borussia Mönchengladbach',
      'VfL Bochum', '1. FC Köln', 'SC Freiburg', 'Union Berlin', 'Mainz 05',
      'Augsburg', 'FSV Mainz', 'Arminia Bielefeld'
    ]
  },
  'ligue-1': {
    name: 'Ligue 1',
    country: 'France',
    teams: 18,
    teamsData: [
      'Paris Saint-Germain', 'Olympique Marseille', 'Olympique Lyonnais', 'AS Monaco', 'Stade Rennais',
      'LOSC Lille', 'Stade de Reims', 'RC Lens', 'AJ Auxerre', 'Toulouse FC',
      'FC Nantes', 'Angers SCO', 'Montpellier HSC', 'Strasbourg', 'FC Lorient',
      'OGC Nice', 'Clermont Foot', 'AC Ajaccio'
    ]
  },
  'super-lig': {
    name: 'Süper Lig',
    country: 'Turkey',
    teams: 18,
    teamsData: [
      'Galatasaray', 'Fenerbahçe', 'Beşiktaş', 'Trabzonspor', 'Konyaspor',
      'Gaziantep FK', 'İstanbulspor', 'Kasımpaşa', 'Ankaragücü', 'Adana Demirspor',
      'Sivasspor', 'Kayserispor', 'Göztepe', 'Alanyaspor', 'Hatayspor',
      'Erzurumspor', 'Pendikspor', 'Başakşehir'
    ]
  }
}

const playerFirstNames = [
  'Cristiano', 'Lionel', 'Mohamed', 'Robert', 'Neymar', 'Kylian', 'Gianluigi', 'Luis',
  'Sergio', 'Andriy', 'Arjen', 'Zinedine', 'Ronaldinho', 'Pelé', 'Diego', 'Johan',
  'Franz', 'Bobby', 'Gerd', 'Eusébio', 'Garrincha', 'Yashin', 'Figo', 'Ronaldo',
  'Raúl', 'Thierry', 'Ruud', 'Carlos', 'Cafu', 'Roberto', 'Gerrard', 'Scholes',
  'Beckham', 'Zidane', 'Iniesta', 'Xavi', 'Ramos', 'Piqué', 'Van Persie', 'Agüero',
  'Suárez', 'Griezmann', 'Benzema', 'Lewandowski', 'Haaland', 'Kane', 'Sterling', 'Mbappé'
]

const playerLastNames = [
  'Ronaldo', 'Messi', 'Salah', 'Lewandowski', 'Silva', 'Mbappé', 'Donnarumma', 'Suárez',
  'Modric', 'Shevchenko', 'Robben', 'Zidane', 'Ronaldinho', 'Pelé', 'Maradona', 'Cruyff',
  'Beckenbauer', 'Moore', 'Müller', 'Eusébio', 'Garrincha', 'Yashin', 'Figo', 'Nazario',
  'González', 'Henry', 'Nistelrooy', 'Teixeira', 'Cafu', 'Gattuso', 'Gerrard', 'Scholes',
  'Beckham', 'Zidane', 'Iniesta', 'Xavi', 'Ramos', 'Piqué', 'Persie', 'Agüero'
]

const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Winger', 'Striker', 'Fullback', 'Central Back']

// Insert takımlar
async function insertTeams() {
  console.log('🔄 Takımlar ekleniyor...')
  let totalTeams = 0

  for (const [competitionSlug, config] of Object.entries(leagueConfigs)) {
    const competition = await new Promise<any>((resolve) => {
      db.get('SELECT id FROM competitions WHERE slug = ?', [competitionSlug], (err, row) => {
        resolve(row)
      })
    })

    if (!competition) continue

    for (const teamName of config.teamsData) {
      const slug = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO teams (sport_id, slug, logo_url, country_id, active)
           SELECT s.id, ?, ?, c.id, 1 FROM sports s, countries c
           WHERE s.slug = 'football' AND c.name = ?`,
          [slug, `/logos/${slug}.png`, config.country],
          () => {
            db.run(
              `INSERT OR IGNORE INTO team_translations (team_id, language, name)
               SELECT t.id, 'en', ? FROM teams t WHERE t.slug = ?`,
              [teamName, slug],
              () => resolve()
            )
          }
        )
      })

      totalTeams++
      if (totalTeams % 10 === 0) console.log(`  ✅ ${totalTeams} takım eklendi...`)
    }
  }

  console.log(`  📊 Toplam ${totalTeams} takım eklendi`)
}

// Insert oyuncular
async function insertPlayers() {
  console.log('🔄 Oyuncular ekleniyor...')
  let totalPlayers = 0
  let playerCounter = 0

  const teams = await new Promise<any[]>((resolve) => {
    db.all('SELECT id, slug FROM teams WHERE active = 1', (err, rows) => {
      resolve(rows || [])
    })
  })

  for (const team of teams) {
    const playersPerTeam = 20 + Math.floor(Math.random() * 10) // 20-30 oyuncu per takım

    for (let i = 0; i < playersPerTeam; i++) {
      playerCounter++
      const firstName = playerFirstNames[Math.floor(Math.random() * playerFirstNames.length)]
      const lastName = playerLastNames[Math.floor(Math.random() * playerLastNames.length)]
      const playerSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${playerCounter}`
      const position = positions[Math.floor(Math.random() * positions.length)]
      const shirtNumber = Math.floor(Math.random() * 99) + 1

      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO players (sport_id, slug, country_id, active)
           SELECT s.id, ?, 1, 1 FROM sports s WHERE s.slug = 'football'`,
          [playerSlug],
          function() {
            const playerId = this.lastID

            db.run(
              `INSERT OR IGNORE INTO player_translations (player_id, language, name)
               VALUES (?, 'en', ?)`,
              [playerId, `${firstName} ${lastName}`],
              () => {
                db.run(
                  `INSERT OR IGNORE INTO player_extended_info (player_id, height, weight, date_of_birth)
                   VALUES (?, ?, ?, ?)`,
                  [playerId, 175 + Math.floor(Math.random() * 10), 70 + Math.floor(Math.random() * 15), '1995-01-01'],
                  () => {
                    db.run(
                      `INSERT OR IGNORE INTO player_team_assignments (player_id, team_id, season_id, position, shirt_number)
                       SELECT ?, ?, s.id, ?, ? FROM seasons s WHERE s.year = 2025`,
                      [playerId, team.id, position, shirtNumber],
                      () => resolve()
                    )
                  }
                )
              }
            )
          }
        )
      })

      totalPlayers++
      if (totalPlayers % 50 === 0) console.log(`  ✅ ${totalPlayers} oyuncu eklendi...`)
    }
  }

  console.log(`  📊 Toplam ${totalPlayers} oyuncu eklendi`)
}

// Generate fixture
async function generateFixtures() {
  console.log('🔄 Fikstürler oluşturuluyor...')
  let totalMatches = 0

  for (const [competitionSlug, config] of Object.entries(leagueConfigs)) {
    const competition = await new Promise<any>((resolve) => {
      db.get('SELECT id FROM competitions WHERE slug = ?', [competitionSlug], (err, row) => {
        resolve(row)
      })
    })

    if (!competition) continue

    const competitionTeams = await new Promise<any[]>((resolve) => {
      db.all(
        `SELECT t.id, t.slug FROM teams t
         INNER JOIN (
           SELECT DISTINCT team_id FROM player_team_assignments pta
         ) pta ON t.id = pta.team_id
         LIMIT ?`,
        [config.teams],
        (err, rows) => resolve(rows || [])
      )
    })

    // Double round-robin fixture
    const season = await new Promise<any>((resolve) => {
      db.get('SELECT id FROM seasons WHERE year = 2025', (err, row) => {
        resolve(row)
      })
    })

    if (!season) continue

    let matchDate = new Date(2025, 7, 15) // Aug 15, 2025

    for (let i = 0; i < competitionTeams.length; i++) {
      for (let j = 0; j < competitionTeams.length; j++) {
        if (i === j) continue

        const homeTeam = competitionTeams[i]
        const awayTeam = competitionTeams[j]
        const status = matchDate < new Date() ? 'finished' : 'scheduled'
        const homeScore = status === 'finished' ? Math.floor(Math.random() * 5) : null
        const awayScore = status === 'finished' ? Math.floor(Math.random() * 5) : null

        await new Promise<void>((resolve) => {
          db.run(
            `INSERT INTO events (sport_id, competition_id, season_id, home_team_id, away_team_id, start_time, status, event_type)
             VALUES (1, ?, ?, ?, ?, ?, ?, 'match')`,
            [competition.id, season.id, homeTeam.id, awayTeam.id, matchDate.toISOString(), status],
            function() {
              const eventId = this.lastID
              if (homeScore !== null && awayScore !== null) {
                db.run(
                  `INSERT INTO event_scores (event_id, participant_id, score) VALUES (?, ?, ?), (?, ?, ?)`,
                  [eventId, homeTeam.id, homeScore, eventId, awayTeam.id, awayScore],
                  () => resolve()
                )
              } else {
                resolve()
              }
            }
          )
        })

        totalMatches++
        matchDate.setDate(matchDate.getDate() + 7) // Next week

        if (totalMatches % 50 === 0) console.log(`  ✅ ${totalMatches} maç oluşturuldu...`)
      }
    }
  }

  console.log(`  📊 Toplam ${totalMatches} maç oluşturuldu`)
}

// Generate standings
async function generateStandings() {
  console.log('🔄 Puan durumları oluşturuluyor...')

  const competitions = await new Promise<any[]>((resolve) => {
    db.all('SELECT id, slug FROM competitions WHERE active = 1 LIMIT 6', (err, rows) => {
      resolve(rows || [])
    })
  })

  for (const comp of competitions) {
    const season = await new Promise<any>((resolve) => {
      db.get('SELECT id FROM seasons WHERE year = 2025', (err, row) => {
        resolve(row)
      })
    })

    if (!season) continue

    const teams = await new Promise<any[]>((resolve) => {
      db.all(
        `SELECT DISTINCT t.id FROM teams t
         INNER JOIN player_team_assignments pta ON t.id = pta.team_id
         WHERE pta.season_id = ?`,
        [season.id],
        (err, rows) => resolve(rows || [])
      )
    })

    for (let pos = 0; pos < teams.length; pos++) {
      const team = teams[pos]
      const points = (teams.length - pos) * 5 + Math.floor(Math.random() * 10)

      await new Promise<void>((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO standings (competition_id, season_id, team_id, position, points, played, won, drawn, lost)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [comp.id, season.id, team.id, pos + 1, points, 10, 3, 1, 6],
          () => resolve()
        )
      })
    }
  }

  console.log(`  📊 Puan durumları oluşturuldu`)
}

// Main execution
async function syncFullSeason() {
  console.log('\n' + '='.repeat(70))
  console.log('  KAPSAMLI SEZON VERİSİ SENKRONIZASYONU')
  console.log('='.repeat(70))

  try {
    await insertTeams()
    await insertPlayers()
    await generateFixtures()
    await generateStandings()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ Tüm veriler başarıyla eklendi!')
    console.log('='.repeat(70) + '\n')

    // Verify
    db.all(`
      SELECT 'Takımlar' as entity, COUNT(*) as count FROM teams
      UNION ALL
      SELECT 'Oyuncular', COUNT(*) FROM players
      UNION ALL
      SELECT 'Maçlar', COUNT(*) FROM events
      UNION ALL
      SELECT 'Puan Durumları', COUNT(*) FROM standings
    `, (err, rows: any) => {
      if (rows) {
        rows.forEach((row: any) => console.log(`  ${row.entity}: ${row.count}`))
      }
      process.exit(0)
    })
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

syncFullSeason()
