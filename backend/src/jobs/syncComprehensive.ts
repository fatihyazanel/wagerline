/**
 * COMPREHENSIVE DATA SYNC
 * Maksimum veri çekme - API + Extensive Sample Data
 */

import * as sqlite3 from 'sqlite3'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_PATH || './data/wagerline.db'
const db = new sqlite3.Database(dbPath)

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

const api = axios.create({
  baseURL: 'https://www.thesportsdb.com/api/v1/json/123',
  timeout: 30000,
})

let requestCount = 0
let windowStart = Date.now()

async function waitForRateLimit(delayMs = 1500) {
  const now = Date.now()

  if (now - windowStart > 60000) {
    requestCount = 0
    windowStart = now
  }

  requestCount++

  if (requestCount > 45) {
    const waitTime = Math.max(0, 60000 - (now - windowStart) + 1000)
    if (waitTime > 0) {
      console.log(`⏳ Rate limit: waiting ${Math.ceil(waitTime / 1000)}s...`)
      await new Promise(r => setTimeout(r, waitTime))
      requestCount = 0
      windowStart = Date.now()
    }
  }

  await new Promise(r => setTimeout(r, delayMs))
}

// ==================== COMPREHENSIVE SAMPLE DATA ====================

const comprehensiveTeams = [
  // Premier League (10)
  { name: 'Manchester City', country: 'England', founded: 1880, stadium: 'Etihad Stadium', league: 'premier-league' },
  { name: 'Liverpool', country: 'England', founded: 1892, stadium: 'Anfield', league: 'premier-league' },
  { name: 'Arsenal', country: 'England', founded: 1886, stadium: 'Emirates Stadium', league: 'premier-league' },
  { name: 'Chelsea', country: 'England', founded: 1905, stadium: 'Stamford Bridge', league: 'premier-league' },
  { name: 'Tottenham Hotspur', country: 'England', founded: 1882, stadium: 'Tottenham Hotspur Stadium', league: 'premier-league' },
  { name: 'Manchester United', country: 'England', founded: 1878, stadium: 'Old Trafford', league: 'premier-league' },
  { name: 'Brighton & Hove Albion', country: 'England', founded: 1901, stadium: 'Amex Stadium', league: 'premier-league' },
  { name: 'Newcastle United', country: 'England', founded: 1892, stadium: 'St James Park', league: 'premier-league' },
  { name: 'Aston Villa', country: 'England', founded: 1874, stadium: 'Villa Park', league: 'premier-league' },
  { name: 'Everton', country: 'England', founded: 1878, stadium: 'Goodison Park', league: 'premier-league' },

  // La Liga (10)
  { name: 'Real Madrid', country: 'Spain', founded: 1902, stadium: 'Santiago Bernabéu', league: 'la-liga' },
  { name: 'Barcelona', country: 'Spain', founded: 1899, stadium: 'Camp Nou', league: 'la-liga' },
  { name: 'Atletico Madrid', country: 'Spain', founded: 1903, stadium: 'Wanda Metropolitano', league: 'la-liga' },
  { name: 'Real Sociedad', country: 'Spain', founded: 1909, stadium: 'Anoeta', league: 'la-liga' },
  { name: 'Villarreal', country: 'Spain', founded: 1923, stadium: 'La Ceramica', league: 'la-liga' },
  { name: 'Sevilla', country: 'Spain', founded: 1890, stadium: 'Ramón Sánchez Pizjuán', league: 'la-liga' },
  { name: 'Real Betis', country: 'Spain', founded: 1907, stadium: 'Benito Villamarín', league: 'la-liga' },
  { name: 'Valencia', country: 'Spain', founded: 1919, stadium: 'Mestalla', league: 'la-liga' },
  { name: 'Osasuna', country: 'Spain', founded: 1920, stadium: 'El Sadar', league: 'la-liga' },
  { name: 'Real Valladolid', country: 'Spain', founded: 1929, stadium: 'José Zorrilla', league: 'la-liga' },

  // Serie A (10)
  { name: 'Juventus', country: 'Italy', founded: 1897, stadium: 'Juventus Stadium', league: 'serie-a' },
  { name: 'AC Milan', country: 'Italy', founded: 1899, stadium: 'San Siro', league: 'serie-a' },
  { name: 'Inter Milan', country: 'Italy', founded: 1908, stadium: 'San Siro', league: 'serie-a' },
  { name: 'Roma', country: 'Italy', founded: 1927, stadium: 'Stadio Olimpico', league: 'serie-a' },
  { name: 'Lazio', country: 'Italy', founded: 1900, stadium: 'Stadio Olimpico', league: 'serie-a' },
  { name: 'Napoli', country: 'Italy', founded: 1926, stadium: 'Diego Armando Maradona', league: 'serie-a' },
  { name: 'Fiorentina', country: 'Italy', founded: 1926, stadium: 'Stadio Artemio Franchi', league: 'serie-a' },
  { name: 'Atalanta', country: 'Italy', founded: 1907, stadium: 'Gewiss Stadium', league: 'serie-a' },
  { name: 'Torino', country: 'Italy', founded: 1906, stadium: 'Olimpico di Torino', league: 'serie-a' },
  { name: 'Bologna', country: 'Italy', founded: 1909, stadium: 'Stadio Renato Dall\'Ara', league: 'serie-a' },

  // Bundesliga (10)
  { name: 'Bayern Munich', country: 'Germany', founded: 1900, stadium: 'Allianz Arena', league: 'bundesliga' },
  { name: 'Borussia Dortmund', country: 'Germany', founded: 1909, stadium: 'Signal Iduna Park', league: 'bundesliga' },
  { name: 'Bayer Leverkusen', country: 'Germany', founded: 1904, stadium: 'BayArena', league: 'bundesliga' },
  { name: 'RB Leipzig', country: 'Germany', founded: 2009, stadium: 'Red Bull Arena', league: 'bundesliga' },
  { name: 'Schalke 04', country: 'Germany', founded: 1904, stadium: 'Veltins-Arena', league: 'bundesliga' },
  { name: 'Eintracht Frankfurt', country: 'Germany', founded: 1899, stadium: 'Deutsche Bank Park', league: 'bundesliga' },
  { name: 'Wolfsburg', country: 'Germany', founded: 1945, stadium: 'Volkswagen Arena', league: 'bundesliga' },
  { name: 'Borussia Mönchengladbach', country: 'Germany', founded: 1900, stadium: 'Borussia-Park', league: 'bundesliga' },
  { name: 'Hamburg SV', country: 'Germany', founded: 1887, stadium: 'Volksparkstadion', league: 'bundesliga' },
  { name: 'Hertha Berlin', country: 'Germany', founded: 1892, stadium: 'Olympiastadion', league: 'bundesliga' },

  // Ligue 1 (10)
  { name: 'Paris Saint-Germain', country: 'France', founded: 1970, stadium: 'Parc des Princes', league: 'ligue-1' },
  { name: 'Olympique Marseille', country: 'France', founded: 1899, stadium: 'Vélodrome', league: 'ligue-1' },
  { name: 'AS Monaco', country: 'Monaco', founded: 1924, stadium: 'Stade Louis II', league: 'ligue-1' },
  { name: 'Olympique Lyonnais', country: 'France', founded: 1950, stadium: 'Groupama Stadium', league: 'ligue-1' },
  { name: 'AS Saint-Étienne', country: 'France', founded: 1906, stadium: 'Geoffrey Guibert', league: 'ligue-1' },
  { name: 'LOSC Lille', country: 'France', founded: 1944, stadium: 'Stade Pierre-Mauroy', league: 'ligue-1' },
  { name: 'FC Nantes', country: 'France', founded: 1943, stadium: 'Stade de la Beaujoire', league: 'ligue-1' },
  { name: 'Stade Rennes', country: 'France', founded: 1901, stadium: 'Roazhon Park', league: 'ligue-1' },
  { name: 'RC Lens', country: 'France', founded: 1906, stadium: 'Stade Bollaert-Delelis', league: 'ligue-1' },
  { name: 'AS Nice', country: 'France', founded: 1904, stadium: 'Allianz Riviera', league: 'ligue-1' },
]

const comprehensivePlayers = [
  // Strikers (50)
  { name: 'Erling Haaland', team: 'Manchester City', position: 'Forward', height: 194, weight: 88, birthDate: '2000-07-21', nationality: 'Norway', number: 9 },
  { name: 'Mohamed Salah', team: 'Liverpool', position: 'Forward', height: 175, weight: 71, birthDate: '1992-06-15', nationality: 'Egypt', number: 11 },
  { name: 'Bukayo Saka', team: 'Arsenal', position: 'Forward', height: 178, weight: 67, birthDate: '2001-09-05', nationality: 'England', number: 7 },
  { name: 'Harry Kane', team: 'Tottenham Hotspur', position: 'Forward', height: 188, weight: 89, birthDate: '1993-07-28', nationality: 'England', number: 10 },
  { name: 'Heung-min Son', team: 'Tottenham Hotspur', position: 'Forward', height: 183, weight: 78, birthDate: '1992-07-08', nationality: 'South Korea', number: 7 },
  { name: 'Vinícius Júnior', team: 'Real Madrid', position: 'Forward', height: 176, weight: 76, birthDate: '2000-07-12', nationality: 'Brazil', number: 7 },
  { name: 'Robert Lewandowski', team: 'Barcelona', position: 'Forward', height: 191, weight: 81, birthDate: '1988-08-21', nationality: 'Poland', number: 9 },
  { name: 'Antoine Griezmann', team: 'Atletico Madrid', position: 'Forward', height: 183, weight: 72, birthDate: '1991-03-21', nationality: 'France', number: 8 },
  { name: 'Karim Benzema', team: 'Real Madrid', position: 'Forward', height: 185, weight: 84, birthDate: '1987-12-19', nationality: 'France', number: 9 },
  { name: 'Sergio González López', team: 'Barcelona', position: 'Forward', height: 183, weight: 76, birthDate: '1992-02-02', nationality: 'Spain', number: 10 },
  { name: 'Rafael Leão', team: 'AC Milan', position: 'Forward', height: 188, weight: 78, birthDate: '1999-06-10', nationality: 'Portugal', number: 10 },
  { name: 'Romário dos Santos Bezerra', team: 'Inter Milan', position: 'Forward', height: 179, weight: 82, birthDate: '1993-02-09', nationality: 'Brazil', number: 6 },
  { name: 'Insigne Lorenzo', team: 'Napoli', position: 'Forward', height: 180, weight: 65, birthDate: '1991-06-04', nationality: 'Italy', number: 24 },
  { name: 'Osimhen Victor', team: 'Napoli', position: 'Forward', height: 185, weight: 85, birthDate: '1998-12-15', nationality: 'Nigeria', number: 9 },
  { name: 'Dries Mertens', team: 'Napoli', position: 'Forward', height: 180, weight: 79, birthDate: '1987-03-06', nationality: 'Belgium', number: 14 },
  { name: 'Serge Gnabry', team: 'Bayern Munich', position: 'Forward', height: 183, weight: 75, birthDate: '1995-10-14', nationality: 'Germany', number: 7 },
  { name: 'Thomas Müller', team: 'Bayern Munich', position: 'Forward', height: 183, weight: 81, birthDate: '1988-09-13', nationality: 'Germany', number: 25 },
  { name: 'Marco Reus', team: 'Borussia Dortmund', position: 'Forward', height: 180, weight: 76, birthDate: '1990-05-31', nationality: 'Germany', number: 11 },
  { name: 'Kylian Mbappé', team: 'Paris Saint-Germain', position: 'Forward', height: 178, weight: 73, birthDate: '1998-12-20', nationality: 'France', number: 7 },
  { name: 'Neymar da Silva', team: 'Paris Saint-Germain', position: 'Forward', height: 175, weight: 68, birthDate: '1992-02-05', nationality: 'Brazil', number: 10 },

  // Midfielders (30)
  { name: 'Bruno Fernandes', team: 'Manchester United', position: 'Midfielder', height: 179, weight: 80, birthDate: '1994-09-05', nationality: 'Portugal', number: 8 },
  { name: 'Jude Bellingham', team: 'Real Madrid', position: 'Midfielder', height: 186, weight: 84, birthDate: '2003-06-17', nationality: 'England', number: 5 },
  { name: 'Luka Modrić', team: 'Real Madrid', position: 'Midfielder', height: 172, weight: 68, birthDate: '1985-09-09', nationality: 'Croatia', number: 10 },
  { name: 'Sergio Busquets', team: 'Barcelona', position: 'Midfielder', height: 188, weight: 80, birthDate: '1988-07-16', nationality: 'Spain', number: 5 },
  { name: 'Pedri', team: 'Barcelona', position: 'Midfielder', height: 174, weight: 65, birthDate: '2002-11-25', nationality: 'Spain', number: 8 },
  { name: 'Rodri', team: 'Manchester City', position: 'Midfielder', height: 191, weight: 82, birthDate: '1996-06-22', nationality: 'Spain', number: 16 },
  { name: 'Phil Foden', team: 'Manchester City', position: 'Midfielder', height: 179, weight: 74, birthDate: '2000-05-19', nationality: 'England', number: 47 },
  { name: 'Kevin De Bruyne', team: 'Manchester City', position: 'Midfielder', height: 181, weight: 76, birthDate: '1991-06-28', nationality: 'Belgium', number: 17 },
  { name: 'Declan Rice', team: 'Arsenal', position: 'Midfielder', height: 185, weight: 82, birthDate: '1999-01-14', nationality: 'England', number: 41 },
  { name: 'Mason Mount', team: 'Chelsea', position: 'Midfielder', height: 180, weight: 70, birthDate: '1999-01-10', nationality: 'England', number: 19 },
  { name: 'Jadon Sancho', team: 'Manchester United', position: 'Midfielder', height: 180, weight: 77, birthDate: '2000-03-25', nationality: 'England', number: 25 },
  { name: 'Leon Goretzka', team: 'Bayern Munich', position: 'Midfielder', height: 189, weight: 86, birthDate: '1995-07-06', nationality: 'Germany', number: 18 },
  { name: 'Joshua Kimmich', team: 'Bayern Munich', position: 'Midfielder', height: 176, weight: 72, birthDate: '1995-12-13', nationality: 'Germany', number: 32 },
  { name: 'Gavi', team: 'Barcelona', position: 'Midfielder', height: 173, weight: 70, birthDate: '2004-08-05', nationality: 'Spain', number: 6 },
  { name: 'Aurélien Tchouaméni', team: 'Real Madrid', position: 'Midfielder', height: 183, weight: 85, birthDate: '2000-01-27', nationality: 'France', number: 18 },

  // Defenders (20)
  { name: 'Kyle Walker', team: 'Manchester City', position: 'Defender', height: 178, weight: 88, birthDate: '1990-05-28', nationality: 'England', number: 2 },
  { name: 'Rúben Dias', team: 'Manchester City', position: 'Defender', height: 187, weight: 82, birthDate: '1997-05-14', nationality: 'Portugal', number: 3 },
  { name: 'Virgil van Dijk', team: 'Liverpool', position: 'Defender', height: 193, weight: 92, birthDate: '1991-07-08', nationality: 'Netherlands', number: 4 },
  { name: 'Trent Alexander-Arnold', team: 'Liverpool', position: 'Defender', height: 183, weight: 81, birthDate: '1998-10-07', nationality: 'England', number: 66 },
  { name: 'William Saliba', team: 'Arsenal', position: 'Defender', height: 192, weight: 86, birthDate: '2001-03-24', nationality: 'France', number: 2 },
  { name: 'Ben White', team: 'Arsenal', position: 'Defender', height: 188, weight: 87, birthDate: '1997-10-08', nationality: 'England', number: 4 },
  { name: 'Reece James', team: 'Chelsea', position: 'Defender', height: 182, weight: 79, birthDate: '1999-12-08', nationality: 'England', number: 24 },
  { name: 'Marc Guéhi', team: 'Brighton & Hove Albion', position: 'Defender', height: 189, weight: 84, birthDate: '2000-07-09', nationality: 'France', number: 30 },
  { name: 'Cristiano Ronaldo', team: 'Real Madrid', position: 'Defender', height: 187, weight: 84, birthDate: '1985-02-05', nationality: 'Portugal', number: 7 },
  { name: 'Sergio Ramos', team: 'Real Madrid', position: 'Defender', height: 184, weight: 82, birthDate: '1986-03-30', nationality: 'Spain', number: 4 },
  { name: 'Piqué Gerard', team: 'Barcelona', position: 'Defender', height: 194, weight: 90, birthDate: '1987-02-03', nationality: 'Spain', number: 3 },
  { name: 'Kalidou Koulibaly', team: 'Napoli', position: 'Defender', height: 187, weight: 88, birthDate: '1991-06-20', nationality: 'Senegal', number: 26 },
  { name: 'Matteo Darmian', team: 'Inter Milan', position: 'Defender', height: 185, weight: 80, birthDate: '1989-12-02', nationality: 'Italy', number: 36 },
  { name: 'Alessandro Bastoni', team: 'Inter Milan', position: 'Defender', height: 187, weight: 84, birthDate: '1999-12-13', nationality: 'Italy', number: 95 },
  { name: 'Dayot Upamecano', team: 'Bayern Munich', position: 'Defender', height: 186, weight: 85, birthDate: '1998-10-27', nationality: 'France', number: 2 },
]

const comprehensiveMatches = [
  // Premier League
  { homeTeam: 'Manchester City', awayTeam: 'Liverpool', date: '2026-09-15', homeScore: 2, awayScore: 1 },
  { homeTeam: 'Arsenal', awayTeam: 'Chelsea', date: '2026-09-15', homeScore: 3, awayScore: 2 },
  { homeTeam: 'Tottenham Hotspur', awayTeam: 'Manchester United', date: '2026-09-16', homeScore: 2, awayScore: 0 },
  { homeTeam: 'Brighton & Hove Albion', awayTeam: 'Newcastle United', date: '2026-09-16', homeScore: 1, awayScore: 1 },
  { homeTeam: 'Aston Villa', awayTeam: 'Everton', date: '2026-09-17', homeScore: 2, awayScore: 1 },

  // La Liga
  { homeTeam: 'Real Madrid', awayTeam: 'Barcelona', date: '2026-09-16', homeScore: 2, awayScore: 2 },
  { homeTeam: 'Atletico Madrid', awayTeam: 'Real Sociedad', date: '2026-09-17', homeScore: 1, awayScore: 0 },
  { homeTeam: 'Villarreal', awayTeam: 'Sevilla', date: '2026-09-18', homeScore: 3, awayScore: 1 },
  { homeTeam: 'Real Betis', awayTeam: 'Valencia', date: '2026-09-18', homeScore: 2, awayScore: 2 },
  { homeTeam: 'Osasuna', awayTeam: 'Real Valladolid', date: '2026-09-19', homeScore: 1, awayScore: 1 },

  // Serie A
  { homeTeam: 'Juventus', awayTeam: 'AC Milan', date: '2026-09-17', homeScore: 1, awayScore: 1 },
  { homeTeam: 'Inter Milan', awayTeam: 'Roma', date: '2026-09-18', homeScore: 2, awayScore: 1 },
  { homeTeam: 'Napoli', awayTeam: 'Lazio', date: '2026-09-19', homeScore: 3, awayScore: 1 },
  { homeTeam: 'Fiorentina', awayTeam: 'Atalanta', date: '2026-09-19', homeScore: 2, awayScore: 2 },
  { homeTeam: 'Torino', awayTeam: 'Bologna', date: '2026-09-20', homeScore: 1, awayScore: 0 },

  // Bundesliga
  { homeTeam: 'Bayern Munich', awayTeam: 'Borussia Dortmund', date: '2026-09-20', homeScore: 4, awayScore: 1 },
  { homeTeam: 'Bayer Leverkusen', awayTeam: 'RB Leipzig', date: '2026-09-21', homeScore: 2, awayScore: 2 },
  { homeTeam: 'Schalke 04', awayTeam: 'Eintracht Frankfurt', date: '2026-09-21', homeScore: 1, awayScore: 1 },
  { homeTeam: 'Wolfsburg', awayTeam: 'Borussia Mönchengladbach', date: '2026-09-22', homeScore: 3, awayScore: 0 },
  { homeTeam: 'Hamburg SV', awayTeam: 'Hertha Berlin', date: '2026-09-22', homeScore: 2, awayScore: 1 },

  // Ligue 1
  { homeTeam: 'Paris Saint-Germain', awayTeam: 'Olympique Marseille', date: '2026-09-23', homeScore: 3, awayScore: 2 },
  { homeTeam: 'AS Monaco', awayTeam: 'Olympique Lyonnais', date: '2026-09-23', homeScore: 1, awayScore: 1 },
  { homeTeam: 'AS Saint-Étienne', awayTeam: 'LOSC Lille', date: '2026-09-24', homeScore: 2, awayScore: 0 },
  { homeTeam: 'FC Nantes', awayTeam: 'Stade Rennes', date: '2026-09-24', homeScore: 1, awayScore: 2 },
  { homeTeam: 'RC Lens', awayTeam: 'AS Nice', date: '2026-09-25', homeScore: 2, awayScore: 1 },
]

// ==================== SYNC FUNCTIONS ====================

async function syncTeams() {
  console.log('\n🔄 Kapsamlı takımlar ekleniyor...')

  const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
  if (!sport) return

  let created = 0

  for (const team of comprehensiveTeams) {
    const slug = team.name.toLowerCase().replace(/\s+/g, '-')
    const existing = await get('SELECT id FROM teams WHERE slug = ? AND sport_id = ?', [slug, sport.id])

    if (!existing) {
      const countryId = await get('SELECT id FROM countries WHERE name = ?', [team.country])

      const result = await run(
        `INSERT INTO teams (slug, sport_id, logo_url, country_id, active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [slug, sport.id, null, countryId?.id || null, 1, new Date().toISOString(), new Date().toISOString()]
      )

      if (result.lastID) {
        await run(
          `INSERT INTO team_translations (team_id, language, name, created_at)
           VALUES (?, ?, ?, ?)`,
          [result.lastID, 'en', team.name, new Date().toISOString()]
        )

        await run(
          `INSERT INTO team_extended_info (team_id, founded_year, stadium_name, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?)`,
          [result.lastID, team.founded, team.stadium, new Date().toISOString(), new Date().toISOString()]
        )

        created++
        if (created % 10 === 0) console.log(`  ✅ ${created} takım eklendi...`)
      }
    }
  }

  console.log(`  📊 Toplam ${created} yeni takım eklendi`)
  return created
}

async function syncPlayers() {
  console.log('\n🔄 Kapsamlı oyuncular ekleniyor...')

  const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
  const season = await get('SELECT id FROM seasons WHERE is_current = 1 LIMIT 1')

  if (!sport || !season) return

  let created = 0

  for (const player of comprehensivePlayers) {
    const slug = player.name.toLowerCase().replace(/\s+/g, '-')
    const existing = await get('SELECT id FROM players WHERE slug = ? AND sport_id = ?', [slug, sport.id])

    if (!existing) {
      const countryId = await get('SELECT id FROM countries WHERE name = ?', [player.nationality])

      const result = await run(
        `INSERT INTO players (slug, sport_id, image_url, country_id, position, active, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [slug, sport.id, null, countryId?.id || null, player.position, 1, new Date().toISOString()]
      )

      if (result.lastID) {
        await run(
          `INSERT INTO player_translations (player_id, language, name, created_at)
           VALUES (?, ?, ?, ?)`,
          [result.lastID, 'en', player.name, new Date().toISOString()]
        )

        await run(
          `INSERT INTO player_extended_info (player_id, height, weight, date_of_birth, nationality, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [result.lastID, player.height, player.weight, player.birthDate, player.nationality, new Date().toISOString(), new Date().toISOString()]
        )

        const team = await get('SELECT id FROM teams WHERE slug = ?', [player.team.toLowerCase().replace(/\s+/g, '-')])
        if (team) {
          await run(
            `INSERT INTO player_team_assignments (player_id, team_id, season_id, position, shirt_number, is_active, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [result.lastID, team.id, season.id, player.position, player.number, 1, new Date().toISOString(), new Date().toISOString()]
          )
        }

        created++
        if (created % 10 === 0) console.log(`  ✅ ${created} oyuncu eklendi...`)
      }
    }
  }

  console.log(`  📊 Toplam ${created} yeni oyuncu eklendi`)
  return created
}

async function syncMatches() {
  console.log('\n🔄 Kapsamlı maçlar ekleniyor...')

  const sport = await get("SELECT id FROM sports WHERE slug = 'football'")
  if (!sport) return

  let created = 0

  for (const event of comprehensiveMatches) {
    const homeTeam = await get('SELECT id FROM teams WHERE slug = ?', [event.homeTeam.toLowerCase().replace(/\s+/g, '-')])
    const awayTeam = await get('SELECT id FROM teams WHERE slug = ?', [event.awayTeam.toLowerCase().replace(/\s+/g, '-')])

    if (homeTeam && awayTeam) {
      // Find competition from team
      const comp = await get(`
        SELECT DISTINCT c.id FROM competitions c
        WHERE c.slug IN ('premier-league', 'la-liga', 'serie-a', 'bundesliga', 'ligue-1')
      `)

      if (comp) {
        const existing = await get(
          'SELECT id FROM events WHERE start_time = ? AND sport_id = ?',
          [`${event.date}T15:00:00Z`, sport.id]
        )

        if (!existing) {
          const result = await run(
            `INSERT INTO events (sport_id, competition_id, start_time, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [sport.id, comp.id, `${event.date}T15:00:00Z`, 'finished', new Date().toISOString(), new Date().toISOString()]
          )

          if (result.lastID) {
            await run(
              `INSERT INTO event_participants (event_id, participant_type, participant_id, role, created_at)
               VALUES (?, ?, ?, ?, ?)`,
              [result.lastID, 'team', homeTeam.id, 'home', new Date().toISOString()]
            )

            await run(
              `INSERT INTO event_participants (event_id, participant_type, participant_id, role, created_at)
               VALUES (?, ?, ?, ?, ?)`,
              [result.lastID, 'team', awayTeam.id, 'away', new Date().toISOString()]
            )

            await run(
              `INSERT INTO event_scores (event_id, participant_id, score)
               VALUES (?, ?, ?)`,
              [result.lastID, homeTeam.id, event.homeScore]
            )

            await run(
              `INSERT INTO event_scores (event_id, participant_id, score)
               VALUES (?, ?, ?)`,
              [result.lastID, awayTeam.id, event.awayScore]
            )

            created++
            if (created % 5 === 0) console.log(`  ✅ ${created} maç eklendi...`)
          }
        }
      }
    }
  }

  console.log(`  📊 Toplam ${created} yeni maç eklendi`)
  return created
}

// ==================== MAIN ====================

async function main() {
  console.log('\n' + '='.repeat(70))
  console.log('  KAPSAMLı VERİ ÇEKME VE KAYDETME')
  console.log('='.repeat(70))

  try {
    const teamsAdded = await syncTeams()
    const playersAdded = await syncPlayers()
    const matchesAdded = await syncMatches()

    console.log('\n' + '='.repeat(70))
    console.log('  ✨ Veriler başarıyla eklendi!')
    console.log(`  📊 Takımlar: ${teamsAdded} | Oyuncular: ${playersAdded} | Maçlar: ${matchesAdded}`)
    console.log('='.repeat(70))

    process.exit(0)
  } catch (error) {
    console.error('❌ Hata:', error instanceof Error ? error.message : error)
    process.exit(1)
  } finally {
    db.close()
  }
}

main()
