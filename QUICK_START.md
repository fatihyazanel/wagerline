# 🚀 WAGERline - Quick Start Guide

## Adım 1: Backend Setup

```bash
cd backend
npm install
```

## Adım 2: Veri Çekme (Sync)

```bash
npm run sync
```

**Çıktı örneği:**
```
✅ Database initialized

🔄 Syncing sports...
  ✅ football
  ✅ basketball
  ✅ american-football
  ✅ ice-hockey
  ✅ formula-1
✅ Created: 5, Updated: 0, Errors: 0 | 123ms

🔄 Syncing competitions...
  ✅ premier-league
  ✅ la-liga
  ✅ serie-a
  ✅ bundesliga
  ✅ ligue-1
  ✅ super-lig
  ✅ nba
  ✅ nfl
  ✅ nhl
  ✅ formula-1
✅ Created: 10, Updated: 0, Errors: 0 | 234ms

🔄 Syncing teams from SportDB...
  ✅ premier-league: 20 teams
  ✅ la-liga: 20 teams
  ✅ serie-a: 20 teams
✅ Created: 60, Updated: 0, Errors: 0 | 5234ms

🔄 Syncing live matches from SportScore...
  📊 Found 12 live matches
✅ Created: 12, Updated: 0, Errors: 0 | 2134ms

🔄 Syncing upcoming matches...
  ✅ Created 45 upcoming matches
✅ Created: 45, Updated: 0, Errors: 0 | 3456ms

🎉 Data sync completed! Ready to serve API requests.
```

## Adım 3: Server Başlat

```bash
npm run dev
```

**Çıktı:**
```
✅ WAGERline API running on http://0.0.0.0:3001
📦 Providers enabled: SportScore API-Sports TheSportsDB
🔄 Live polling: enabled
```

## Adım 4: API'leri Test Et

### Terminal 2'de:

```bash
# 1. Health check
curl http://localhost:3001/api/health

# 2. Database stats
curl http://localhost:3001/test/stats

# 3. Sample data
curl http://localhost:3001/test/sample

# 4. Tüm sporları listele
curl http://localhost:3001/api/v1/sports

# 5. Football competitions
curl http://localhost:3001/api/v1/competitions

# 6. Live events
curl http://localhost:3001/api/v1/events/live

# 7. Today's events
curl http://localhost:3001/api/v1/events/today

# 8. Provider status
curl http://localhost:3001/api/v1/providers/status

# 9. Admin status
curl http://localhost:3001/api/v1/admin/status
```

---

## 📊 Expected Results

### Health Check
```json
{
  "status": "ok",
  "timestamp": "2026-08-31T19:30:00Z",
  "uptime": 1234.56
}
```

### Database Stats
```json
{
  "data": {
    "sports": { "count": 5 },
    "competitions": { "count": 10 },
    "teams": { "count": 60 },
    "events": { "count": 57 },
    "live_events": { "count": 12 }
  }
}
```

### Sports List
```json
{
  "data": [
    {
      "id": 1,
      "slug": "football",
      "name_key": "sports.football",
      "icon": "⚽",
      "status": "active"
    },
    ...
  ],
  "meta": {
    "language": "en",
    "total": 5,
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

### Live Events
```json
{
  "data": [
    {
      "id": 42,
      "sport_id": 1,
      "competition_id": 1,
      "start_time": "2026-08-31T15:30:00Z",
      "status": "live",
      "sport_name": "sports.football",
      "competition_name": "competitions.premier_league"
    }
  ],
  "meta": {
    "language": "en",
    "total": 12,
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

---

## 🔑 Environment Check

Eğer sync hata verirse:

```bash
# .env dosyasını kontrol et
cat backend/.env | grep KEY

# Beklenen:
SPORTDB_KEY=REPLACE_WITH_SPORTDB_KEY
SPORTSCORE_KEY=REPLACE_WITH_SPORTSCORE_KEY
```

Eğer key boşsa, `API_SETUP_SUMMARY.md`'de eksik provider'ları göster.

---

## 🔄 Data Flow

```
npm run sync
    ↓
Sync Service initialized
    ↓
1️⃣  Sports → database (5 records)
    ↓
2️⃣  Competitions → database (10 records)
    ↓
3️⃣  Teams → SportDB API → database (60 records)
    ↓
4️⃣  Live Matches → SportScore API → database (12 records)
    ↓
5️⃣  Upcoming Matches → SportScore API → database (45 records)
    ↓
npm run dev
    ↓
API ready on :3001
    ↓
Frontend can call /api/v1/events/live, etc.
```

---

## 📁 Dosya Yapısı

```
backend/
├── src/
│   ├── services/
│   │   ├── provider.service.ts      ← Provider fallback
│   │   └── data-sync.service.ts    ← 🆕 Veri çekme service
│   ├── routes/
│   │   ├── sports.ts, competitions.ts, events.ts, teams.ts
│   │   ├── providers.ts            ← Provider endpoints
│   │   └── test.ts                 ← 🆕 Test endpoints
│   ├── jobs/
│   │   └── syncData.ts             ← 🆕 Sync job runner
│   ├── config/
│   │   └── index.ts                ← Merkezi config
│   └── index.ts
├── .env                            ← API keys (mevcut)
└── package.json
```

---

## 🐛 Troubleshooting

### "Cannot find module 'axios'"
```bash
npm install axios
```

### "Database locked"
- Başka bir process çalışıyor
- SQLite'ı kapatıp yeniden aç
```bash
rm data/wagerline.db
npm run sync
```

### "Provider returned 401"
```bash
# API key yanlış veya süresi dolmuş
# backend/.env'i kontrol et
# Yeni key al: 
# - SportScore: https://sportscore.com
# - SportDB: https://api.sportdb.dev
```

### "No data returned"
```bash
# 1. Check if sync actually ran
curl http://localhost:3001/test/stats

# 2. Check if API keys are valid
curl http://localhost:3001/api/v1/providers/status

# 3. Run sync again
npm run sync
```

---

## ✨ Sonraki Adımlar

1. **Frontend** - Next.js'de UI kurmak
2. **WebSocket** - Real-time updates
3. **Predictions** - Rule-based prediction engine
4. **Gamification** - XP, badges, leaderboards
5. **i18n** - Multi-language support (EN/ES/AR)

---

## 📚 Dökümentasyon

- `API_ROUTES.md` - Tüm endpoints
- `CONFIG_GUIDE.md` - Configuration
- `API_SETUP_SUMMARY.md` - Setup özeti
- `QUICK_START.md` - Bu dosya
