# WAGERline Configuration Guide

## Overview

Tüm API yapılandırması merkezi bir `config/index.ts` dosyasında yönetilmektedir. Provider keys, rate limits, cache TTL, ve feature flags burada ayarlanmaktadır.

---

## Environment Variables

### App Configuration
```env
NODE_ENV=development          # development | production
API_PORT=3001                # Server port
API_HOST=0.0.0.0             # Server host
DEFAULT_LANGUAGE=en          # en | es | ar
```

### Database
```env
DATABASE_PATH=./data/wagerline.db
DATABASE_URL=sqlite:./data/wagerline.db
```

### Provider API Keys

#### SportDB
- **URL**: https://api.sportdb.dev/api
- **Key**: `SPORTDB_KEY`
- **Features**: Flashscore, Transfermarkt data
- **Example**: `REPLACE_WITH_SPORTDB_KEY`

#### SportScore
- **URL**: https://sportscore.com/api
- **Key**: `SPORTSCORE_KEY`
- **Features**: Live matches, competitions, teams
- **Example**: `REPLACE_WITH_SPORTSCORE_KEY`

#### TheSportsDB
- **URL**: https://www.thesportsdb.com/api/v1/json
- **Key**: Optional (public API)
- **Features**: Teams, events, statistics
- **Fallback**: Bu provider her zaman aktif (free/public)

#### API-Sports (Premium)
- **URL**: https://v3.football.api-sports.io
- **Key**: `API_SPORTS_KEY`
- **Features**: Fixtures, standings, player stats
- **Note**: Paid service, premium quality data

---

## Provider Priority System

### Configuration
```typescript
providerPriority: {
  football: ['sportscore', 'apisports', 'thesportsdb', 'sportdb'],
  basketball: ['apisports', 'sportscore'],
  'american-football': ['apisports', 'sportscore'],
  'ice-hockey': ['apisports', 'sportscore'],
  'formula-1': ['sportscore', 'sportdb'],
}
```

### Fallback Logic
```
GET /events
  ↓
Try SportScore
  ├─ Success → Return data
  ├─ Fail → Try API-Sports
  │  ├─ Success → Return data
  │  ├─ Fail → Try TheSportsDB
  │  │ ├─ Success → Return data
  │  │ └─ Fail → Error
```

---

## Cache Configuration

### TTL Values (seconds)

| Entity | TTL | Reason |
|--------|-----|--------|
| Sports | 604800 (7 days) | Rarely change |
| Competitions | 86400 (24h) | Seasonal changes |
| Teams | 86400 (24h) | Squad updates daily |
| Players | 86400 (24h) | Stats updates daily |
| Events (Finished) | 2592000 (30d) | Historical reference |
| Events (Upcoming) | 300 (5m) | Schedule may change |
| Events (Live) | 15 (15s) | Real-time updates |
| Standings | 3600 (1h) | Updates during day |
| News | 1800 (30m) | Fresh content |

### Configuration
```env
CACHE_TTL_SPORTS=604800
CACHE_TTL_COMPETITIONS=86400
CACHE_TTL_TEAMS=86400
CACHE_TTL_EVENTS_LIVE=15
```

---

## Rate Limiting

### Per-Provider Limits

| Provider | Limit | Window |
|----------|-------|--------|
| SportDB | 100 req/min | 60s |
| SportScore | 150 req/min | 60s |
| TheSportsDB | 100 req/min | 60s |
| API-Sports | 100 req/min | 60s |

### Implementation
```typescript
// Automatically tracked in ProviderService
// When limit exceeded, next provider in chain is tried
const result = await providerService.executeWithFallback('matches', 'football')
```

---

## Sync Jobs Configuration

### Daily Sync
```env
SYNC_DAILY_HOUR=2  # Run at 2 AM
```
- Sports
- Competitions
- Teams
- Players
- Standings

### Hourly Sync
```env
SYNC_HOURLY_INTERVAL=60  # Every 60 minutes
```
- Events
- Results
- News

### Live Sync
```env
SYNC_LIVE_INTERVAL=10         # Poll every 10 seconds
SYNC_LIVE_MAX_CONCURRENT=5    # Max concurrent requests
```
- Only for events with status = 'live'

---

## Features

### Feature Flags
```env
MOCK_DATA=false              # Use mock data instead of API
LIVE_POLLING=true            # Enable live event polling
PREDICTIONS_ENABLED=true     # Enable prediction engine
GAMIFICATION_ENABLED=true    # Enable XP/badges/rewards
```

---

## CORS Configuration

```env
CORS_ORIGIN=*  # Frontend URL, or * for all

# Specific example:
CORS_ORIGIN=https://wagerline.com
```

---

## Logging

```env
LOG_LEVEL=info              # debug | info | warn | error
LOG_FORMAT=json             # json | pretty
```

---

## Admin Panel Configuration

### Accessing Admin Status
```bash
curl http://localhost:3001/api/v1/admin/status
```

### Shows:
- App version & environment
- Database path
- Enabled providers
- Feature flags
- Cache configuration
- Sync job status

---

## Provider Testing

### Test Single Provider
```bash
curl http://localhost:3001/api/v1/providers/sportscore/test
```

### List All Providers
```bash
curl http://localhost:3001/api/v1/providers
```

### Provider Status
```bash
curl http://localhost:3001/api/v1/providers/status
```

---

## Using the Config in Code

### In Routes
```typescript
import { config } from '../config'

app.get('/', async (request, reply) => {
  const language = request.query.lang || config.app.defaultLanguage
  const cacheTtl = config.cache.ttl.sports
  // ...
})
```

### In Services
```typescript
import { config } from '../config'

const priority = config.providerPriority.football
const rateLimit = config.providers.sportscore.rateLimit
```

---

## Environment Setup

### Development
```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your keys
nano .env

# Start server
npm run dev
```

### Production
```bash
# Use production config
NODE_ENV=production npm start

# Required env vars:
# - All PROVIDER_KEY env vars
# - CORS_ORIGIN set to actual domain
# - LOG_LEVEL=warn
```

---

## Security Notes

### API Keys
- ✅ Never commit `.env` to git
- ✅ Use `.env.example` for template
- ✅ Keys stored in backend only
- ✅ Never expose keys in API responses

### Rate Limiting
- Automatically enforced per provider
- When limit hit, fallback to next provider
- Tracked in sync_jobs table for monitoring

### CORS
- Default: `*` (allow all origins)
- Production: Set to specific domain
- Credentials: Enabled by default

---

## Troubleshooting

### "All providers failed"
1. Check `.env` API keys
2. Verify provider is enabled
3. Check internet connectivity
4. Test provider: `GET /providers/:provider/test`

### Rate limit exceeded
- Wait for reset window (60s)
- Fallback automatically tries next provider
- Check logs: `sync_jobs.errors`

### Cache not working
- Verify TTL in `.env`
- Check DATABASE_PATH exists
- Restart server

---

## Related Files

- `src/config/index.ts` - Main configuration
- `src/services/provider.service.ts` - Provider manager
- `backend/.env` - Environment variables
- `API_ROUTES.md` - API documentation
