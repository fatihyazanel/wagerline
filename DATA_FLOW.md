# WAGERline - Data Flow Architecture

## Genel Mimari

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│              GET /api/v1/events/live                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  BACKEND API (Fastify)                       │
│  /api/v1/sports, /events, /competitions, /providers         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              PROVIDER SERVICE (Fallback)                     │
│          (routes requests to appropriate provider)          │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
   ┌────▼──┐  ┌─────▼────┐  ┌────▼──────┐
   │Provider Service     │  │  Database  │
   ├────────────────────┤  │  (SQLite)  │
   │Sport              │  │            │
   │Score   API-Sports │  │ Data Cache │
   │     TheSportsDB  │  │            │
   └────────────────────┘  └────────────┘
```

---

## Data Ingestion Pipeline

### Initialization Flow

```
npm run sync
    │
    ├─ Database Init
    │  └─ Create/Verify schema
    │
    └─ Data Sync Service
       ├─ 1️⃣  Sync Sports (static data)
       │  └─ Football, Basketball, F1, etc. → Database
       │
       ├─ 2️⃣  Sync Competitions (static data)
       │  └─ Premier League, La Liga, NBA, etc. → Database
       │
       ├─ 3️⃣  Sync Teams (from SportDB/SportScore)
       │  ├─ GET https://api.sportdb.dev/api/transfermarkt/teams
       │  └─ Teams + Translations (EN/ES/AR) → Database
       │
       ├─ 4️⃣  Sync Live Matches (from SportScore)
       │  ├─ GET https://sportscore.com/api/widget/matches?status=live
       │  └─ Live Events + Scores → Database
       │
       └─ 5️⃣  Sync Upcoming Matches (from SportScore)
          ├─ GET https://sportscore.com/api/widget/matches?status=upcoming
          └─ Future Events → Database
```

---

## Request Serving Flow

```
Frontend Request
│
├─ GET /api/v1/events/live?lang=en
│
├─ Backend Route Handler
│  └─ events.ts → /live endpoint
│
├─ Database Query
│  └─ SELECT * FROM events WHERE status IN ('live', 'halftime')
│
├─ Data Formatting
│  ├─ Add language support
│  ├─ Add metadata
│  └─ Add timestamp
│
├─ HTTP Response
│  ├─ Status: 200
│  ├─ Body: JSON with data, meta, timestamp
│  └─ Headers: CORS enabled
│
└─ Frontend Receives
   └─ Render component with live match data
```

---

## Provider Fallback Chain

### Example: Get Upcoming Matches for Premier League

```
Request: GET /api/v1/events?status=upcoming&competition=premier-league

    │
    ├─ Provider Service
    │  └─ Priority for football: ['sportscore', 'apisports', 'thesportsdb', 'sportdb']
    │
    ├─ Try #1: SportScore
    │  ├─ Endpoint: GET https://sportscore.com/api/widget/matches
    │  ├─ Params: {sport: football, status: upcoming, limit: 50}
    │  │
    │  ├─ ✅ Success? → Return data
    │  │
    │  └─ ❌ Fail? (401, timeout, rate limit)
    │     └─ Log error, continue to next
    │
    ├─ Try #2: API-Sports
    │  ├─ Endpoint: GET https://v3.football.api-sports.io/fixtures
    │  ├─ Params: {league: 39, season: 2024, status: NS}
    │  │
    │  ├─ ✅ Success? → Return data
    │  │
    │  └─ ❌ Fail? → Continue
    │
    ├─ Try #3: TheSportsDB (Free)
    │  ├─ Endpoint: GET https://www.thesportsdb.com/api/v1/json/123/eventslast.php
    │  ├─ Params: {id: 133602} (Premier League ID)
    │  │
    │  ├─ ✅ Success? → Return data
    │  │
    │  └─ ❌ Fail? → Continue
    │
    ├─ Try #4: SportDB
    │  ├─ Endpoint: GET https://api.sportdb.dev/api/flashscore/football
    │  │
    │  ├─ ✅ Success? → Return data
    │  │
    │  └─ ❌ Fail? → All failed
    │
    └─ Error Response
       └─ "All providers failed: SportScore (timeout), API-Sports (401), ..."
```

---

## Live Data Polling (Scheduled)

### Real-Time Event Updates

```
Event starts → Status changes to 'live'
    │
    └─ Scheduler triggers every 10 seconds
       │
       ├─ Query: SELECT * FROM events WHERE status = 'live'
       │  └─ Only poll active events (not all 380 Premier League matches)
       │
       ├─ Provider Service
       │  └─ GET latest stats from SportScore
       │
       ├─ Update Database
       │  ├─ UPDATE events SET score = new_score
       │  └─ INSERT event_statistics (possession, shots, etc.)
       │
       ├─ WebSocket Push (Future)
       │  └─ Notify connected clients of updates
       │
       └─ Repeat
          └─ Every 10 seconds while event is live
```

---

## Cache Strategy

### TTL by Entity Type

```
Sports                 → 7 days (rarely change)
                          ↓
Competitions          → 24 hours (seasonal updates)
                          ↓
Teams                 → 24 hours (squad changes)
                          ↓
Players               → 24 hours (stats/transfers)
                          ↓
Events (Finished)     → 30 days (historical reference)
                          ↓
Events (Scheduled)    → 5 minutes (schedule changes)
                          ↓
Events (Live)         → 15 seconds (real-time updates)
                          ↓
Standings             → 1 hour (updates during day)
                          ↓
News                  → 30 minutes (fresh content)
```

### Implementation

```
GET /api/v1/events/live
    │
    ├─ Check In-Memory Cache
    │  ├─ Key: "events_live"
    │  ├─ TTL: 15 seconds
    │  │
    │  ├─ ✅ Fresh cache exists
    │  │  └─ Return cached data immediately
    │  │
    │  └─ ❌ Cache expired or miss
    │     │
    │     └─ Query Database
    │        │
    │        ├─ SELECT * FROM events WHERE status = 'live'
    │        │
    │        ├─ Format response
    │        │
    │        ├─ Store in cache
    │        │
    │        └─ Return to client
```

---

## Database Write Flow (Sync)

### Team Sync Example

```
1. Initiate Sync
   └─ npm run sync

2. Get Teams from Provider
   ├─ SportDB API: GET /api/transfermarkt/teams
   ├─ Response: 20 teams for Premier League
   └─ Parse JSON

3. For Each Team:
   │
   ├─ Check if exists
   │  └─ SELECT id FROM teams WHERE external_id = ? AND sport_id = ?
   │
   ├─ If NOT exists:
   │  │
   │  ├─ INSERT team
   │  │  └─ INSERT INTO teams (sport_id, external_id, slug, logo_url)
   │  │     VALUES (1, 123, 'arsenal', 'logo.jpg')
   │  │
   │  └─ INSERT translations (EN, ES, AR)
   │     ├─ INSERT INTO team_translations VALUES (team_id, 'en', 'Arsenal FC')
   │     ├─ INSERT INTO team_translations VALUES (team_id, 'es', 'Arsenal FC')
   │     └─ INSERT INTO team_translations VALUES (team_id, 'ar', 'أرسنال')
   │
   └─ Log: Created 1, Updated 0

4. Repeat for all teams

5. Complete
   └─ Created: 60, Duration: 5234ms
```

---

## Multi-Language Data Flow

### Translations at Sync Time

```
Provider returns: { name: "Arsenal FC" }
    │
    ├─ Insert Base Team
    │  └─ INSERT INTO teams (slug, logo_url, ...)
    │
    ├─ Add Translations
    │  ├─ EN: "Arsenal FC"
    │  ├─ ES: "Arsenal FC" (or get from another API)
    │  └─ AR: "أرسنال" (manual or Arabic API)
    │
    └─ Database:
       ├─ teams(id=1, slug='arsenal')
       ├─ team_translations(team_id=1, lang='en', name='Arsenal FC')
       ├─ team_translations(team_id=1, lang='es', name='Arsenal FC')
       └─ team_translations(team_id=1, lang='ar', name='أرسنال')

API Response: GET /api/v1/teams/arsenal?lang=en
    │
    └─ SELECT t.*, tt.name 
       FROM teams t 
       JOIN team_translations tt ON t.id = tt.team_id 
       WHERE t.slug = 'arsenal' AND tt.language = 'en'
       
       Result: { id: 1, slug: 'arsenal', name: 'Arsenal FC' }
```

---

## Error Handling Flow

```
Provider Request
    │
    ├─ Try HTTP Call
    │
    ├─ Error Cases:
    │  │
    │  ├─ 1. Timeout (> 10s)
    │  │  └─ Catch → Log → Try next provider
    │  │
    │  ├─ 2. Rate Limited (429)
    │  │  └─ Check rate limit counter → Try next provider
    │  │
    │  ├─ 3. Authentication (401)
    │  │  └─ API key invalid → Log error → Try next provider
    │  │
    │  ├─ 4. Server Error (500+)
    │  │  └─ Provider down → Log → Try next provider
    │  │
    │  └─ 5. Parse Error (Invalid JSON)
    │     └─ Malformed response → Log → Try next provider
    │
    ├─ All Providers Failed
    │  └─ Return error response:
    │     {
    │       "error": "All providers failed: ...",
    │       "attempts": 4,
    │       "errors": ["SportScore timeout", "API-Sports 401", ...]
    │     }
    │
    └─ Log to sync_jobs table
       └─ For debugging & monitoring
```

---

## Monitoring & Logging

### Sync Job Tracking

```
INSERT INTO sync_jobs
┌─────────────────────────────────┐
│ id: 1                           │
│ job_type: sync_events           │
│ provider: sportscore            │
│ sport: football                 │
│ status: completed               │
│ records_processed: 45           │
│ records_created: 12             │
│ records_updated: 33             │
│ errors: NULL                    │
│ started_at: 2026-08-31 15:00   │
│ finished_at: 2026-08-31 15:05  │
└─────────────────────────────────┘

API Response: GET /api/v1/admin/status
    └─ Shows latest sync job results
       ├─ Last successful sync
       ├─ Records processed
       ├─ Error count
       └─ Duration
```

---

## Summary: Data Journey

```
1. USER VISITS FRONTEND
   └─ wagerline.com

2. FRONTEND MAKES REQUEST
   └─ GET /api/v1/events/live?lang=en

3. BACKEND RECEIVES
   ├─ Route: /events/live
   ├─ Handler: eventsRoutes()
   └─ Query language preference

4. DATABASE QUERY
   ├─ SELECT from events table
   ├─ Filter: status IN ('live', 'halftime')
   ├─ JOIN with sports, competitions, translations
   └─ ORDER BY start_time

5. RESPONSE FORMATTING
   ├─ Add metadata (language, timestamp)
   ├─ Add pagination info
   └─ Add cache headers

6. HTTP RESPONSE
   ├─ Status: 200 OK
   ├─ Body: JSON with events
   ├─ Headers: Cache-Control, CORS
   └─ Sent to frontend

7. FRONTEND RENDERS
   ├─ Parse JSON
   ├─ Display match cards
   ├─ Show live scores
   └─ Auto-update every 5-10 seconds

8. BACKGROUND: SYNC JOB RUNS
   ├─ Every 10 seconds (for live events)
   ├─ Polls SportScore API
   ├─ Updates database with new scores
   └─ Users see updates
```
