# TheSportsDB API - Data Analysis & Database Mapping

## API Key: 123
**Base URL:** `https://www.thesportsdb.com/api/v1/json/123/`

---

## 1. TheSportsDB API ENDPOINTS & DATA STRUCTURE

### A. LEAGUES (Ligler)
**Endpoint:** `/eventslast.php?id={leagueId}`
**Available Data:**
```json
{
  "results": [
    {
      "idEvent": "1234567",
      "strEvent": "Manchester City vs Liverpool",
      "strLeague": "Premier League",
      "strSeason": "2023-2024",
      "dateEvent": "2024-01-15",
      "strTime": "15:00",
      "strHomeTeam": "Manchester City",
      "strAwayTeam": "Liverpool",
      "intHomeScore": "2",
      "intAwayScore": "1",
      "strStatus": "Match Finished",
      "strVenue": "Etihad Stadium",
      "strCity": "Manchester",
      "intAttendance": "52000",
      "strReferee": "John Moss"
    }
  ]
}
```

### B. TEAMS (Takımlar)
**Endpoint:** `/lookup_all_teams.php?id={leagueId}`
**Available Data:**
```json
{
  "teams": [
    {
      "idTeam": "1",
      "strTeam": "Manchester City",
      "strCountry": "England",
      "strLeague": "Premier League",
      "strStadium": "Etihad Stadium",
      "strStadiumCapacity": "55097",
      "strStadiumLocation": "Manchester",
      "intFormedYear": "1880",
      "strTeamBadge": "https://www.thesportsdb.com/images/media/team/badge/...",
      "strTeamLogo": "https://www.thesportsdb.com/images/media/team/logo/..."
    }
  ]
}
```

### C. PLAYERS (Oyuncular)
**Endpoint:** `/lookup_all_players.php?id={teamId}`
**Available Data:**
```json
{
  "player": [
    {
      "idPlayer": "1",
      "strPlayer": "Erling Haaland",
      "strPosition": "Forward",
      "strTeam": "Manchester City",
      "strNationality": "Norway",
      "intHeight": "194",
      "intWeight": "88",
      "dateBorn": "2000-07-21",
      "strThumb": "https://www.thesportsdb.com/images/media/player/thumb/...",
      "strCutout": "https://www.thesportsdb.com/images/media/player/cutout/...",
      "strNumber": "9",
      "intSoccerXML": "2584"
    }
  ]
}
```

### D. EVENTS/FIXTURES (Maçlar)
**Endpoint:** `/eventslast.php?id={leagueId}` or `/eventsseason.php?id={leagueId}&season=2023-2024`
**Available Data:**
```json
{
  "results": [
    {
      "idEvent": "1234567",
      "dateEvent": "2024-01-15",
      "strTime": "15:00",
      "strHomeTeam": "Manchester City",
      "strAwayTeam": "Liverpool",
      "intHomeScore": "2",
      "intAwayScore": "1",
      "intRound": "23",
      "strStatus": "Match Finished",
      "strVenue": "Etihad Stadium",
      "intAttendance": "52000",
      "strReferee": "John Moss",
      "strHomeTeamLineupGoalkeeper": "Ederson",
      "strHomeTeamLineupDefense": "...",
      "strHomeTeamLineupMidfield": "...",
      "strHomeTeamLineupForward": "...",
      "strAwayTeamLineupGoalkeeper": "Lorius",
      "strAwayTeamLineupDefense": "...",
      "strAwayTeamLineupMidfield": "...",
      "strAwayTeamLineupForward": "..."
    }
  ]
}
```

### E. STANDINGS (Sıralamalar)
**Endpoint:** `/eventstand.php?id={leagueId}&season=2023-2024`
**Available Data:**
```json
{
  "table": [
    {
      "name": "Manchester City",
      "teamid": "1",
      "played": "30",
      "win": "24",
      "draw": "2",
      "loss": "4",
      "goals": "89",
      "against": "23",
      "goalsdifference": "66",
      "total": "74"
    }
  ]
}
```

### F. EVENT STATS (Maç İstatistikleri)
**Available from event endpoint:**
- Possession
- Shots on Target
- Shots
- Fouls Committed
- Yellow Cards
- Red Cards
- Corners
- Ball Possession %
- Passes Completed
- Tackles Made

---

## 2. CURRENT DATABASE SCHEMA ANALYSIS

### ✅ EXISTING TABLES (GOOD)
- `events` - Temel maç bilgileri
- `event_participants` - Maç katılımcıları (takımlar)
- `event_scores` - Maç skorları
- `event_statistics` - Maç istatistikleri
- `teams` - Takım bilgileri
- `team_translations` - Takım çevirileri
- `players` - Oyuncu bilgileri
- `competitions` - Lig/Turnuva bilgileri
- `standings` - Sıralama bilgileri

### ⚠️ MISSING/INCOMPLETE TABLES

1. **VENUES (Stadlar)** - Gerekli!
   - Stadyum bilgileri
   - Lokasyon
   - Kapasitesi

2. **PLAYER_TEAM_STATISTICS** - Gerekli!
   - Oyuncunun takımdaki pozisyon bilgileri
   - Forma numarası
   - Sezon başına istatistikleri

3. **TEAM_EXTENDED_INFO** - Gerekli!
   - Kuruluş yılı
   - Stadyum kapasitesi
   - İlçe/Şehir bilgisi

4. **EVENT_LINEUPS** - Gerekli!
   - Maç kadrosu
   - Başlangıç XI
   - Yedekler

5. **REFEREES** - Gerekli!
   - Hakem bilgileri
   - Ülkesi
   - Lisans seviyesi

---

## 3. MISSING DATA COLUMNS

### teams TABLOSUNDA EKSIK ALANLAR
```
- stadium_name
- stadium_capacity
- stadium_city
- founded_year
- badge_url (logo dışında başka badge)
```

### events TABLOSUNDA EKSIK ALANLAR
```
- referee_id
- attendance
- venue_id
- home_team_lineup
- away_team_lineup
- round_number
```

### players TABLOSUNDA EKSIK ALANLAR
```
- height
- weight
- date_of_birth
- nationality
- shirt_number
- cutout_image_url
```

---

## 4. DATA MAPPING TABLE

| TheSportsDB Field | DB Table | DB Column | Data Type | Notes |
|---|---|---|---|---|
| idTeam | teams | external_id | TEXT | thesportsdb team ID |
| strTeam | team_translations | name | TEXT | Team name (multi-language) |
| strCountry | teams | country_id | INT | Needs countries table |
| strStadium | **venues** | name | TEXT | **NEW TABLE** |
| strStadiumCapacity | **venues** | capacity | INT | **NEW TABLE** |
| strStadiumLocation | **venues** | city | TEXT | **NEW TABLE** |
| intFormedYear | teams | founded_year | INT | **NEED TO ADD** |
| strTeamBadge | teams | badge_url | TEXT | **NEED TO ADD** |
| idPlayer | players | external_id | TEXT | thesportsdb player ID |
| strPlayer | player_translations | name | TEXT | Player name |
| strPosition | **player_team_stats** | position | TEXT | **NEW TABLE** |
| intHeight | players | height | INT | **NEED TO ADD** |
| intWeight | players | weight | INT | **NEED TO ADD** |
| dateBorn | players | date_of_birth | DATE | **NEED TO ADD** |
| strNumber | **player_team_stats** | shirt_number | INT | **NEW TABLE** |
| idEvent | events | external_id | TEXT | thesportsdb event ID |
| dateEvent | events | start_time | TIMESTAMP | Match date & time |
| intHomeScore | event_scores | score | INT | Home team score |
| intAwayScore | event_scores | score | INT | Away team score |
| strVenue | events | venue_id | INT | **NEED TO LINK** |
| intAttendance | events | attendance | INT | **NEED TO ADD** |
| intRound | events | round | INT | **EXISTS** |
| strStatus | events | status | TEXT | Match status |
| strHomeTeamLineup* | **event_lineups** | lineup_json | TEXT | **NEW TABLE** |
| strAwayTeamLineup* | **event_lineups** | lineup_json | TEXT | **NEW TABLE** |

---

## 5. NEW TABLES TO CREATE

### Table 1: VENUES (Stadyumlar)
```sql
CREATE TABLE IF NOT EXISTS venues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT,
  name TEXT NOT NULL,
  city TEXT,
  country_id INTEGER,
  capacity INTEGER,
  latitude REAL,
  longitude REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id)
);
```

### Table 2: EVENT_LINEUPS (Maç Kadroları)
```sql
CREATE TABLE IF NOT EXISTS event_lineups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  formation TEXT,
  lineup_json TEXT,
  lineup_type TEXT DEFAULT 'starting_xi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);
```

### Table 3: REFEREES (Hakemler)
```sql
CREATE TABLE IF NOT EXISTS referees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  country_id INTEGER,
  license_level TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id)
);
```

### Table 4: PLAYER_TEAM_ASSIGNMENTS (Oyuncu-Takım Atamaları)
```sql
CREATE TABLE IF NOT EXISTS player_team_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER NOT NULL,
  season_id INTEGER,
  shirt_number INTEGER,
  position TEXT,
  started_at DATE,
  ended_at DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (season_id) REFERENCES seasons(id)
);
```

### Table 5: COUNTRIES (Ülkeler - İf yoksa)
```sql
CREATE TABLE IF NOT EXISTS countries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  code TEXT UNIQUE,
  flag_emoji TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. ALTERATIONS TO EXISTING TABLES

### ALTER teams TABLE
```sql
ALTER TABLE teams ADD COLUMN badge_url TEXT;
ALTER TABLE teams ADD COLUMN founded_year INTEGER;
ALTER TABLE teams ADD COLUMN stadium_name TEXT;
ALTER TABLE teams ADD COLUMN stadium_city TEXT;
```

### ALTER events TABLE
```sql
ALTER TABLE events ADD COLUMN referee_id INTEGER;
ALTER TABLE events ADD COLUMN attendance INTEGER;
ALTER TABLE events ADD COLUMN venue_id INTEGER;
ALTER TABLE events ADD FOREIGN KEY (venue_id) REFERENCES venues(id);
ALTER TABLE events ADD FOREIGN KEY (referee_id) REFERENCES referees(id);
```

### ALTER players TABLE
```sql
ALTER TABLE players ADD COLUMN height INTEGER;
ALTER TABLE players ADD COLUMN weight INTEGER;
ALTER TABLE players ADD COLUMN date_of_birth DATE;
ALTER TABLE players ADD COLUMN nationality TEXT;
ALTER TABLE players ADD COLUMN cutout_image_url TEXT;
```

---

## 7. DATA AVAILABILITY CHECKLIST

| Data Type | Available | Can Map | Priority | Notes |
|---|---|---|---|---|
| Leagues | ✅ Yes | ✅ Yes | High | Direct mapping to competitions |
| Teams | ✅ Yes | ✅ Yes | High | Need venue info extraction |
| Players | ✅ Yes | ✅ Yes | High | Position & number available |
| Events/Fixtures | ✅ Yes | ✅ Yes | High | Complete match data |
| Standings | ✅ Yes | ✅ Yes | High | League table data |
| Match Stats | ✅ Yes | ⚠️ Partial | Medium | Need custom parsing |
| Lineups | ✅ Yes | ⚠️ Complex | Medium | String format, need parsing |
| Attendance | ✅ Yes | ✅ Yes | Low | Nice to have |
| Referees | ✅ Yes | ✅ Yes | Medium | Only in detailed events |
| Injuries/News | ❌ No | N/A | Low | Use dedicated news API |

---

## 8. SYNC STRATEGY

### Phase 1: Core Data (Essential)
1. Competitions (Leagues)
2. Teams with extended info
3. Players with personal info
4. Events with basic stats
5. Standings

### Phase 2: Relationships (Important)
1. Player-Team assignments
2. Event lineups
3. Referees linking
4. Venues

### Phase 3: Analytics (Optional)
1. Detailed event statistics
2. Player performance metrics
3. Team form tracking

---

## 9. API ENDPOINTS TO USE

```
GET /eventslast.php?id={leagueId}           → Recent events
GET /eventsseason.php?id={leagueId}&season=2024-2025 → Season events
GET /eventslastid.php?id={eventId}          → Event details
GET /lookup_all_teams.php?id={leagueId}     → All teams in league
GET /lookup_all_players.php?id={teamId}     → All players in team
GET /lookup_player.php?id={playerId}        → Player details
GET /lookup_team.php?id={teamId}            → Team details
GET /eventstand.php?id={leagueId}&season=2024-2025 → Standings
```

---

## 10. SUMMARY & RECOMMENDATIONS

### ✅ DO IMMEDIATELY
1. Create VENUES table
2. Create REFEREES table
3. Create EVENT_LINEUPS table
4. Create PLAYER_TEAM_ASSIGNMENTS table
5. Add missing columns to teams, events, players
6. Create COUNTRIES reference table

### ⚠️ DO NEXT
1. Update sync job to fetch and store venue data
2. Update sync job to fetch and parse lineups
3. Add referee linking to events
4. Add player-team assignment tracking

### 📊 DATA QUALITY NOTES
- TheSportsDB provides good coverage for major leagues
- Lineup data is in string format, needs careful parsing
- Some old/historical data may have missing fields
- External IDs are crucial for preventing duplicates

