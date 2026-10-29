# TheSportsDB API - Complete Reference Guide

## API Base URL
```
https://www.thesportsdb.com/api/v1/json/123/
```

**Key:** `123` (Free tier - no authentication required)

---

## 📚 API Endpoints

### 1. GET Leagues Events (Ligler - Son Maçlar)
```
GET /eventslast.php?id={leagueId}
```

**Response Example:**
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
      "strReferee": "John Moss",
      "strHomeTeamLineupGoalkeeper": "Ederson",
      "strHomeTeamLineupDefense": "Walker, Akanji, Gómez, Cancelo",
      "strHomeTeamLineupMidfield": "De Bruyne, Rodri, Alvarez",
      "strHomeTeamLineupForward": "Haaland",
      "strAwayTeamLineupGoalkeeper": "Lorius",
      "strAwayTeamLineupDefense": "Arnold, Van Dijk, Matip, Robertson",
      "strAwayTeamLineupMidfield": "Henderson, Fabinho, Thiago",
      "strAwayTeamLineupForward": "Salah, Firmino, Diaz"
    }
  ]
}
```

**Required Fields for DB:**
- `idEvent` → events.external_id
- `dateEvent`, `strTime` → events.start_time
- `strHomeTeam`, `strAwayTeam` → Teams
- `intHomeScore`, `intAwayScore` → event_scores
- `strStatus` → events.status
- `strVenue` → venues.name
- `intAttendance` → event_attendance
- `strHomeTeamLineup*`, `strAwayTeamLineup*` → event_lineups

---

### 2. GET Season Events
```
GET /eventsseason.php?id={leagueId}&season={season}
```

**Example:** `/eventsseason.php?id=133602&season=2024-2025`

**Returns:** All events in specific season

---

### 3. GET All Teams in League
```
GET /lookup_all_teams.php?id={leagueId}
```

**Response Example:**
```json
{
  "teams": [
    {
      "idTeam": "1",
      "strTeam": "Manchester City",
      "strTeamShort": "MCI",
      "strAlternate": null,
      "intFormedYear": "1880",
      "strLeague": "English Premier League",
      "intLeagueID": "133602",
      "strLeagueAlternate": "Premier League",
      "strDivision": null,
      "strManager": "Pep Guardiola",
      "strStadium": "Etihad Stadium",
      "strStadiumCapacity": "55097",
      "strStadiumLocation": "Manchester, England",
      "strStadiumThumb": null,
      "strTeamBadge": "https://www.thesportsdb.com/images/media/team/badge/sxye201402111402.png",
      "strTeamLogo": "https://www.thesportsdb.com/images/media/team/logo/sxye201402111402.png",
      "strTeamFanart1": null,
      "strTeamFanart2": null,
      "strTeamFanart3": null,
      "strTeamFanart4": null,
      "strTeamBanner": null,
      "strTeamWikipedia": "https://en.wikipedia.org/wiki/Manchester_City_F.C.",
      "strTeamDescription": "Manchester City Football Club is an English professional football club based in Manchester...",
      "strCountry": "England",
      "strWebsite": "https://www.mancity.com",
      "strFacebook": "https://www.facebook.com/mancity",
      "strInstagram": "https://www.instagram.com/mancity",
      "strTwitter": "https://twitter.com/mancity"
    }
  ]
}
```

**Required Fields for DB:**
- `idTeam` → teams.external_id
- `strTeam` → team_translations.name
- `strCountry` → countries (lookup)
- `intFormedYear` → team_extended_info.founded_year
- `strTeamBadge` → team_extended_info.badge_url
- `strTeamLogo` → teams.logo_url
- `strStadium` → team_extended_info.stadium_name
- `strStadiumCapacity` → team_extended_info.stadium_capacity
- `strStadiumLocation` → team_extended_info.stadium_city

---

### 4. GET All Players in Team
```
GET /lookup_all_players.php?id={teamId}
```

**Response Example:**
```json
{
  "player": [
    {
      "idPlayer": "123456",
      "idTeam": "1",
      "strNationality": "England",
      "strPlayer": "Kyle Walker",
      "strTeam": "Manchester City",
      "strSport": "Soccer",
      "dateBorn": "1990-05-28",
      "strNumber": "2",
      "strPosition": "Defender",
      "strCollege": null,
      "dateSigned": "2012-06-24",
      "strSigned": "Tottenham Hotspur",
      "strSignedUntil": "2026-06-30",
      "strWage": "$180,000",
      "strInstagram": "https://www.instagram.com/kyle_walker2",
      "strFacebook": "https://www.facebook.com/kyle.walker",
      "strTwitter": "https://twitter.com/KyleWalker2",
      "strCutout": "https://www.thesportsdb.com/images/media/player/cutout/...",
      "strThumb": "https://www.thesportsdb.com/images/media/player/thumb/...",
      "strHeight": "178",
      "strWeight": "88",
      "strDescriptionEN": null,
      "strDescriptionFR": null,
      "strDescriptionIT": null,
      "strDescriptionCN": null,
      "strDescriptionRU": null,
      "strDescriptionES": null,
      "strDescriptionPT": null,
      "strDescriptionSE": null,
      "strDescriptionJP": null,
      "strDescriptionDE": null,
      "strDescriptionAR": null,
      "strDescriptionFI": null
    }
  ]
}
```

**Required Fields for DB:**
- `idPlayer` → players.external_id
- `strPlayer` → player_translations.name
- `strNationality` → player_extended_info.nationality
- `strPosition` → player_team_assignments.position
- `strNumber` → player_team_assignments.shirt_number
- `strHeight` → player_extended_info.height
- `strWeight` → player_extended_info.weight
- `dateBorn` → player_extended_info.date_of_birth
- `strThumb` → players.image_url
- `strCutout` → player_extended_info.cutout_image_url

---

### 5. GET Individual Event Details
```
GET /eventslastid.php?id={eventId}
```

**Example:** `/eventslastid.php?id=1234567`

**Returns:** Detailed match information with all statistics

---

### 6. GET League Standings
```
GET /eventstand.php?id={leagueId}&season={season}
```

**Example:** `/eventstand.php?id=133602&season=2024-2025`

**Response Example:**
```json
{
  "table": [
    {
      "position": "1",
      "teamid": "1",
      "name": "Manchester City",
      "played": "30",
      "win": "24",
      "draw": "2",
      "loss": "4",
      "goals": "89",
      "against": "23",
      "goalsdifference": "66",
      "total": "74"
    },
    {
      "position": "2",
      "teamid": "2",
      "name": "Arsenal",
      "played": "30",
      "win": "22",
      "draw": "4",
      "loss": "4",
      "goals": "82",
      "against": "28",
      "goalsdifference": "54",
      "total": "70"
    }
  ]
}
```

**Required Fields for DB:**
- `teamid` → teams (lookup)
- `position` → standing_entries.position
- `played` → standing_entries.played
- `win` → standing_entries.won
- `draw` → standing_entries.drawn
- `loss` → standing_entries.lost
- `total` → standing_entries.points

---

### 7. GET Individual Team Details
```
GET /lookup_team.php?id={teamId}
```

**Example:** `/lookup_team.php?id=1`

**Returns:** Same as lookup_all_teams but single team

---

### 8. GET Individual Player Details
```
GET /lookup_player.php?id={playerId}
```

**Example:** `/lookup_player.php?id=123456`

**Returns:** Same as lookup_all_players but single player with more details

---

## 🏆 Major League IDs (TheSportsDB)

| League | ID | Country |
|---|---|---|
| Premier League | 133602 | England |
| La Liga | 133603 | Spain |
| Serie A | 133604 | Italy |
| Bundesliga | 133605 | Germany |
| Ligue 1 | 133606 | France |
| Turkish Super League | 133860 | Turkey |
| Eredivisie | 133689 | Netherlands |
| Primeira Liga | 133614 | Portugal |
| UEFA Champions League | 133601 | Europe |
| UEFA Europa League | 133602 | Europe |

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Get Premier League recent events
curl "https://www.thesportsdb.com/api/v1/json/123/eventslast.php?id=133602"

# Get Manchester City teams info
curl "https://www.thesportsdb.com/api/v1/json/123/lookup_all_teams.php?id=133602"

# Get Manchester City players
curl "https://www.thesportsdb.com/api/v1/json/123/lookup_all_players.php?id=1"

# Get Premier League standings
curl "https://www.thesportsdb.com/api/v1/json/123/eventstand.php?id=133602&season=2024-2025"
```

### Using Node.js / Axios

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://www.thesportsdb.com/api/v1/json/123'
})

// Get events
const events = await api.get('/eventslast.php?id=133602')
console.log(events.data.results)

// Get teams
const teams = await api.get('/lookup_all_teams.php?id=133602')
console.log(teams.data.teams)

// Get players
const players = await api.get('/lookup_all_players.php?id=1')
console.log(players.data.player)

// Get standings
const standings = await api.get('/eventstand.php?id=133602&season=2024-2025')
console.log(standings.data.table)
```

---

## 📊 Data Quality Notes

### Complete Data (Always Available)
- ✅ Team name and basic info
- ✅ Player name and position
- ✅ Match date and teams
- ✅ Final score (for completed matches)
- ✅ Stadium information
- ✅ League standings

### Partial Data (Often Missing)
- ⚠️ Player height/weight (some players)
- ⚠️ Match attendance (some historical matches)
- ⚠️ Referee information (not always provided)
- ⚠️ Detailed lineups (newer seasons only)
- ⚠️ Match statistics (selective availability)

### Never Available
- ❌ Real-time odds
- ❌ Injury reports
- ❌ Transfer news
- ❌ Live commentary
- ❌ Video highlights

---

## ⚡ Rate Limiting

**Free Tier:**
- ~500 requests per hour
- No IP-based blocking
- No authentication required

**Recommended Strategy:**
```
- 1 league: ~5-10 requests
- Total data load: ~50-100 requests
- Wait 500ms between requests
- Estimated time: 1-2 minutes per full sync
```

---

## 🔧 Error Handling

### Common Responses

**Success (200):**
```json
{
  "results": [...],
  "teams": [...],
  "player": [...],
  "table": [...]
}
```

**Not Found (200 with empty):**
```json
{
  "results": null,
  "teams": [],
  "player": [],
  "table": []
}
```

**Handle these gracefully:**
- Check if results/teams/player/table is null or empty
- Skip processing if empty
- Log warning instead of error
- Continue with next batch

---

## 📝 Data Normalization Tips

### Team Names
```
"Manchester City" → "manchester-city"
"Manchester United" → "manchester-united"
"AC Milan" → "ac-milan"
```

### Player Nationalities
```
"England" → "England" (use as-is, lookup country_id)
"United States" → "USA" (normalize first)
"Côte d'Ivoire" → "Ivory Coast" (handle special chars)
```

### Dates
```
"2024-01-15" → ISO 8601 format
"15/01/2024" → Parse and convert
Empty/null → Use default or skip
```

### Numbers
```
Attendance: "52000" → 52000 (parseInt)
Year: "1880" → 1880 (parseInt)
Height: "178" → 178 (parseInt, assume cm)
Weight: "88" → 88 (parseInt, assume kg)
```

---

## 🎯 Integration Checklist

- [ ] API base URL configured
- [ ] All required endpoints implemented
- [ ] Error handling for missing data
- [ ] Null/empty checking
- [ ] Rate limiting respected
- [ ] Data normalization applied
- [ ] External IDs captured for deduplication
- [ ] Timezone handling consistent (UTC)
- [ ] Batch processing implemented
- [ ] Logging configured
- [ ] Test endpoints working
- [ ] Data validation passing

