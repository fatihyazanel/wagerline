# WAGERline API Routes

Base URL: `http://localhost:3001/api/v1`

---

## ✅ Health & Status

### GET `/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-08-31T19:30:00Z",
  "uptime": 1234.56
}
```

### GET `/admin/status`
Admin status panel - Shows full system configuration.

**Response:**
```json
{
  "app": {
    "version": "1.0.0",
    "environment": "development",
    "language": "en"
  },
  "database": {
    "path": "./data/wagerline.db"
  },
  "providers": {
    "enabled": ["sportscore", "apisports"],
    "total": 2
  },
  "features": {
    "mockData": false,
    "livePolling": true,
    "predictions": true,
    "gamification": true
  }
}
```

---

## 🏟️ Sports

### GET `/sports`
List all sports.

**Query Parameters:**
- `lang` (optional): `en` | `es` | `ar` (default: `en`)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "football",
      "name_key": "sports.football",
      "icon": "⚽",
      "status": "active"
    }
  ],
  "meta": {
    "language": "en",
    "total": 5,
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

### GET `/sports/:slug`
Get single sport with stats.

**Response:**
```json
{
  "data": {
    "id": 1,
    "slug": "football",
    "name_key": "sports.football",
    "icon": "⚽",
    "status": "active",
    "competition_count": 6,
    "team_count": 247
  },
  "meta": {
    "language": "en",
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

---

## 🏆 Competitions

### GET `/competitions`
List all competitions.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "sport_id": 1,
      "slug": "premier-league",
      "name_key": "competitions.premier_league",
      "country_id": 1,
      "active": true,
      "team_count": 20,
      "event_count": 380
    }
  ],
  "meta": {
    "language": "en",
    "total": 10
  }
}
```

### GET `/competitions/:slug`
Get single competition details.

---

## ⚽ Events

### GET `/events/today`
Get today's events.

**Query Parameters:**
- `lang` (optional)
- `sport` (optional): Filter by sport slug

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "sport_id": 1,
      "competition_id": 1,
      "start_time": "2026-09-01T15:00:00Z",
      "status": "scheduled",
      "sport_name": "sports.football",
      "competition_name": "competitions.premier_league",
      "team_ids": "1,2"
    }
  ],
  "meta": {
    "language": "en",
    "date": "2026-09-01",
    "total": 12
  }
}
```

### GET `/events/live`
Get live events (status: live, halftime, period_break).

**Response:**
```json
{
  "data": [
    {
      "id": 42,
      "sport_id": 1,
      "status": "live",
      "start_time": "2026-08-31T15:30:00Z"
    }
  ],
  "meta": {
    "language": "en",
    "total": 3
  }
}
```

### GET `/events/:id`
Get event details.

**Response:**
```json
{
  "data": {
    "id": 1,
    "sport_id": 1,
    "competition_id": 1,
    "start_time": "2026-09-01T15:00:00Z",
    "status": "finished",
    "event_type": "match",
    "sport_name": "sports.football",
    "competition_name": "competitions.premier_league",
    "participants": [
      {
        "id": 1,
        "role": "HOME",
        "team_id": 1,
        "slug": "arsenal",
        "logo_url": "..."
      }
    ],
    "scores": [
      {
        "participant_id": 1,
        "score": 2,
        "period": 0
      }
    ],
    "prediction": {
      "home_probability": 0.48,
      "draw_probability": 0.27,
      "away_probability": 0.25,
      "confidence": 0.74
    }
  },
  "meta": {
    "language": "en",
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

### GET `/events/:id/statistics`
Get event statistics.

**Response:**
```json
{
  "data": [
    {
      "participant_id": 1,
      "metric": "possession",
      "value": "62",
      "period": 0
    },
    {
      "participant_id": 1,
      "metric": "shots",
      "value": "18",
      "period": 0
    }
  ],
  "meta": {
    "language": "en",
    "total": 24
  }
}
```

---

## 👥 Teams

### GET `/teams`
List teams.

**Query Parameters:**
- `sport` (optional): Filter by sport slug
- `competition` (optional): Filter by competition slug
- `lang` (optional)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "arsenal",
      "logo_url": "...",
      "country_id": 1,
      "active": true,
      "event_count": 38,
      "win_rate": 0.55
    }
  ],
  "meta": {
    "total": 247,
    "language": "en"
  }
}
```

### GET `/teams/:slug`
Get team details with stats.

---

## 🔌 Providers

### GET `/providers`
List all configured providers.

**Response:**
```json
{
  "data": {
    "total": 4,
    "providers": [
      {
        "name": "sportscore",
        "enabled": true,
        "rateLimitState": {
          "count": 45,
          "resetTime": 1725120600000
        }
      }
    ],
    "priority": {
      "football": ["sportscore", "apisports", "thesportsdb"],
      "basketball": ["apisports", "sportscore"]
    }
  },
  "meta": {
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

### GET `/providers/status`
Provider health check.

**Response:**
```json
{
  "data": {
    "total": 2,
    "enabled": ["sportscore", "apisports"],
    "config": {
      "sportdb": "enabled",
      "sportscore": "enabled",
      "thesportsdb": "enabled",
      "apisports": "disabled"
    }
  },
  "meta": {
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

### GET `/providers/:provider/test`
Test single provider connection.

**Response:**
```json
{
  "data": {
    "provider": "sportscore",
    "status": "ok",
    "source": "sportscore",
    "error": null
  },
  "meta": {
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

### POST `/providers/sync`
Trigger manual data sync.

**Request Body:**
```json
{
  "sport": "football",
  "competition": "premier-league"
}
```

**Response:**
```json
{
  "data": {
    "job": "sync_requested",
    "sport": "football",
    "competition": "premier-league",
    "status": "pending",
    "message": "Sync job queued. Check /api/v1/jobs for status."
  },
  "meta": {
    "timestamp": "2026-08-31T19:30:00Z"
  }
}
```

---

## 📝 Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found"
  }
}
```

**Common Error Codes:**
- `EVENT_NOT_FOUND` (404)
- `SPORT_NOT_FOUND` (404)
- `COMPETITION_NOT_FOUND` (404)
- `PROVIDER_TEST_FAILED` (500)
- `SYNC_FAILED` (500)

---

## 🔑 Environment Configuration

See `.env.example` for all configuration options:

```bash
# Provider Keys
SPORTDB_KEY=...
SPORTSCORE_KEY=...
API_SPORTS_KEY=...

# Cache TTL (seconds)
CACHE_TTL_SPORTS=604800
CACHE_TTL_EVENTS_LIVE=15

# Features
MOCK_DATA=false
LIVE_POLLING=true
```

---

## 📊 Response Format

All successful responses follow this structure:

```json
{
  "data": { /* response data */ },
  "meta": {
    "language": "en",
    "timestamp": "2026-08-31T19:30:00Z",
    "total": 10
  }
}
```

---

## 🚀 Example Requests

### Get live football events:
```bash
curl http://localhost:3001/api/v1/events/live?lang=en
```

### Get Premier League details:
```bash
curl http://localhost:3001/api/v1/competitions/premier-league
```

### Test SportScore provider:
```bash
curl http://localhost:3001/api/v1/providers/sportscore/test
```

### Trigger sync:
```bash
curl -X POST http://localhost:3001/api/v1/providers/sync \
  -H "Content-Type: application/json" \
  -d '{"sport": "football", "competition": "premier-league"}'
```

---

## 📌 Notes

- All timestamps are UTC ISO 8601
- Language support: `en`, `es`, `ar`
- Default language: `en`
- Rate limits per provider in `.env`
- Live events polled every 10-15 seconds
- Cache TTL configurable per entity type
