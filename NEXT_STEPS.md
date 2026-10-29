# 🎯 NEXT STEPS - WAGERline Data Platform Ready

**Current Status:** All 9 phases implemented ✅  
**Ready For:** Live API integration + Frontend connection

---

## 🚀 IMMEDIATE ACTIONS

### 1. Get API-Football Key (5 minutes)

```bash
# Visit: https://www.api-football.com/
# Sign up for FREE tier
# Copy your API key

# Set environment variable:
export API_FOOTBALL_KEY=your_key_here

# Verify:
echo $API_FOOTBALL_KEY
```

### 2. Initialize Database (1 minute)

```bash
cd /d/wargile/backend

# Initialize schema
sqlite3 ../../wagerline.db < src/database/schema.sql

# Or let the app do it:
npm run dev  # Will auto-init on start
```

### 3. Run Complete Sync (10 seconds)

```bash
# Populate database with all data
npx ts-node --transpile-only src/jobs/syncComplete_Full.ts

# Expected output:
#  ✅ Teams: 78
#  ✅ Players: 336
#  ✅ Fixtures: 1636
#  ✅ News: 80+
#  ✅ Standings: 102
#  ✅ Odds: 250+
#  ✅ Predictions: 100+
```

### 4. Start API Server (5 seconds)

```bash
npm run dev

# Output:
#  ✅ Server running on http://localhost:3001
#  ✅ Health endpoint: GET /api/v1/health
```

### 5. Test Health Endpoint (2 seconds)

```bash
curl http://localhost:3001/api/v1/health | python3 -m json.tool

# Shows:
# {
#   "status": "ok",
#   "quota": {...},
#   "database_stats": {...}
# }
```

### 6. Start Live Engine (in separate terminal)

```bash
npx ts-node -e "
import { liveEngine } from './src/services/live/liveEngine'
liveEngine.start()
"
```

### 7. Subscribe to Live Updates (Frontend)

```javascript
// In React component or vanilla JS:
const eventSource = new EventSource('/api/v1/live/stream')

eventSource.addEventListener('live.score.updated', (e) => {
  const data = JSON.parse(e.data)
  console.log('Score:', data.homeScore, '-', data.awayScore)
})

eventSource.addEventListener('live.match.goal', (e) => {
  console.log('GOAL! 🎯', JSON.parse(e.data))
})

eventSource.addEventListener('match.finished', (e) => {
  console.log('Match finished:', JSON.parse(e.data))
})
```

---

## 📋 SETUP CHECKLIST

- [ ] API-Football key obtained
- [ ] Environment variable set: `export API_FOOTBALL_KEY=xxx`
- [ ] Database initialized
- [ ] Complete sync ran successfully
- [ ] API server started (`npm run dev`)
- [ ] Health endpoint returning 200 OK
- [ ] Live engine started (separate terminal)
- [ ] SSE stream tested (curl or browser)
- [ ] Frontend subscribed to `/api/v1/live/stream`

---

## 🔗 KEY ENDPOINTS

### Health & Admin
```
GET /api/v1/health                 → System health
GET /api/v1/admin/quota            → Quota status
GET /api/v1/admin/sync-logs        → Sync history
GET /api/v1/admin/provider-status  → Provider status
```

### Live Data
```
GET /api/v1/live                   → All live matches (JSON)
GET /api/v1/live/:eventId          → Specific match (JSON)
GET /api/v1/live/stream            → SSE real-time stream
GET /api/v1/live/health            → Live engine status
```

### Data Queries (existing)
```
GET /api/v1/players                → All players
GET /api/v1/standings              → League standings
GET /api/v1/news                   → Latest news
GET /api/v1/predictions            → Match predictions
GET /api/v1/stats/team/:id         → Team stats
```

---

## 🔄 PERIODIC OPERATIONS

### Run sync every 5-15 minutes (cron job)

```bash
# Option 1: Manual
npx ts-node src/jobs/syncComplete_Full.ts

# Option 2: Scheduled (crontab)
*/5 * * * * cd /d/wargile/backend && npx ts-node src/jobs/syncComplete_Full.ts

# Option 3: Node schedule (in app)
import schedule from 'node-schedule'
schedule.scheduleJob('*/5 * * * *', async () => {
  await runSync()
})
```

### Monitor quota

```bash
# Every 5 minutes
curl http://localhost:3001/api/v1/admin/quota
```

### Check live engine health

```bash
# Check how many matches are being tracked
curl http://localhost:3001/api/v1/live/health
```

---

## 📊 EXPECTED DATA VOLUMES

After complete sync:

| Entity | Count | Source |
|--------|-------|--------|
| Teams | 78 | TheSportsDB |
| Players | 336+ | Generated + API |
| Fixtures | 1636+ | TheSportsDB |
| News | 80+ | Google/Bloomberg/Reuters |
| Standings | 102+ | Generated |
| Odds | 250+ | Generated (5 bookmakers) |
| Predictions | 100+ | Poisson ML |
| Injuries | 5-10 | Generated |

---

## 🚨 COMMON ISSUES & FIXES

### Issue: "Port 3001 already in use"
```bash
# Kill existing process
pkill -f "node.*src/index"
# Or use different port:
PORT=3002 npm run dev
```

### Issue: "API key not set"
```bash
# Check if set
echo $API_FOOTBALL_KEY
# Should print your key

# If not, set it:
export API_FOOTBALL_KEY=your_key
# Make permanent in ~/.bashrc or ~/.zshrc
```

### Issue: "Database locked"
```bash
# Remove lock file
rm wagerline.db-shm
rm wagerline.db-wal
# Restart sync
```

### Issue: "Quota exceeded"
```bash
# Check quota status
curl http://localhost:3001/api/v1/admin/quota

# If < 5 remaining: wait until tomorrow (resets at 00:00 UTC)
# Or: Upgrade to paid API-Football plan
```

---

## 📈 PERFORMANCE TIPS

1. **Cache responses**
   - SSE handles live updates
   - GET /api/v1/live caches for 60 seconds
   - News cached by relevance score

2. **Batch requests**
   - Avoid 1 request per client
   - Use 1 central SSE stream + memory cache
   - Broadcast to all clients simultaneously

3. **Quota management**
   - Live polling: 60 seconds during match
   - Off-peak: 600 seconds
   - Respects 100 req/day, 10 req/min limits

4. **Database**
   - Use indexes on frequently-queried columns
   - Cleanup old news monthly
   - Archive old predictions quarterly

---

## 🎯 WHAT'S READY

### Backend ✅
- [x] Provider abstraction
- [x] 9 normalizers (standardized format)
- [x] 8 sync services (automated population)
- [x] Live engine (adaptive polling)
- [x] SSE broadcast (real-time updates)
- [x] News engine (relevance scoring)
- [x] Odds system (multiple bookmakers)
- [x] Prediction engine (Poisson ML)
- [x] Health endpoints
- [x] Admin dashboard endpoints

### Frontend ⏳
- [ ] Login/authentication
- [ ] Home page
- [ ] Live matches page
- [ ] Match detail page
- [ ] Player profile page
- [ ] Team page
- [ ] News feed
- [ ] Predictions page
- [ ] SSE integration
- [ ] Real-time score updates

---

## 📚 FILES TO REFERENCE

**Architecture:**
- `flow.md` - Complete 97-section specification
- `PHASES_COMPLETION_REPORT.md` - This implementation
- `API_INTEGRATION_STATUS.md` - Phase status details

**Code:**
- `src/providers/SportsDataProvider.ts` - Base interface
- `src/services/quota/quotaManager.ts` - Quota system
- `src/services/live/liveEngine.ts` - Real-time engine
- `src/routes/live.ts` - SSE endpoints
- `src/services/news/newsEngine.ts` - News scoring

---

## 🎬 QUICK START SCRIPT

```bash
#!/bin/bash
set -e

echo "🚀 WAGERline Quick Start"

# 1. Set API key
export API_FOOTBALL_KEY=${API_FOOTBALL_KEY:-demo_key}

# 2. Init database
echo "📊 Initializing database..."
sqlite3 wagerline.db < src/database/schema.sql

# 3. Run sync
echo "🔄 Syncing data..."
npx ts-node --transpile-only src/jobs/syncComplete_Full.ts

# 4. Start server
echo "🚀 Starting API server..."
npm run dev &

# 5. Wait for server
sleep 3

# 6. Test health
echo "✅ Testing health endpoint..."
curl http://localhost:3001/api/v1/health

echo "
✨ Ready!

Live matches:  GET http://localhost:3001/api/v1/live
SSE stream:    GET http://localhost:3001/api/v1/live/stream
Health:        GET http://localhost:3001/api/v1/health

Press Ctrl+C to stop server
"
```

Save as `quick-start.sh` and run:
```bash
chmod +x quick-start.sh
./quick-start.sh
```

---

## 📞 SUPPORT

**Documentation:**
- `flow.md` - Implementation spec (97 sections)
- `PHASES_COMPLETION_REPORT.md` - What's built
- `API_INTEGRATION_STATUS.md` - Phase details

**Issues:**
- Check quota: `GET /api/v1/admin/quota`
- Check health: `GET /api/v1/health`
- Check logs: `tail -f wagerline.log`

---

## ✅ SUMMARY

**What You Have:**
- ✅ Complete backend data platform
- ✅ Real-time live engine
- ✅ SSE broadcast system
- ✅ News relevance scoring
- ✅ Prediction engine (Poisson ML)
- ✅ Quota management (respects API limits)
- ✅ Database with 26 tables
- ✅ Health monitoring

**What's Left:**
- Frontend integration with SSE
- User authentication
- UI for live matches, news, predictions
- Historical data analysis
- Advanced ML model training

**Status:** 🟢 **READY FOR PRODUCTION DATA** (frontend integration ready when UI built)
