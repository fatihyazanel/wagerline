# GERÇEK VERİ ENTEGRASYON STRATEJİSİ
## Live Sports Analytics Uygulaması için Canlı Veri Mimarisi

---

## 1. 📊 VERİ KAYNAKLARI

### A) PRIMARY: TheSportsDB API
```
Base URL: https://www.thesportsdb.com/api/v1/json/123/
Rate Limit: 45 req/min
Status: ✅ Operational
```

**Çekilecek Veriler:**
- `eventlast.php?id={leagueId}` → Son 10 maç
- `eventslast.php?id={teamId}` → Takım maçları
- `eventslastleague.php?id={leagueId}` → Son lig maçları
- `eventslast.php?id={teamId}` → Takım haber/güncellemeler
- `lookup_player.php?id={playerId}` → Oyuncu detayları
- `lookup_team.php?id={teamId}` → Takım detayları

### B) SECONDARY: API-Football (Rapid API)
```
Base URL: https://api-football-v1.p.rapidapi.com/v3
Rate Limit: 100 req/day (free tier)
Cost: $4.99/month (1000 req/day)
Status: 🔴 Needs API Key
```

**Çekilecek Veriler:**
- `/fixtures` → Live fixtures + detailed data
- `/odds` → Betting odds from multiple bookmakers
- `/standings` → League tables (real-time)
- `/statistics` → Team/Player statistics
- `/players` → Player detailed info
- `/injuries` → Injury reports

### C) TERTIARY: Google Knowledge Graph
```
Base URL: https://www.google.com/search
Method: Web Scraping / Google Custom Search API
Status: ⚠️ Legal considerations
```

**Çekilecek Veriler:**
- Team recent news
- Player transfer news
- Match preview/review articles
- Injury updates

### D) QUATERNARY: News APIs
```
NewsAPI.org: https://newsapi.org/v2
BBC Sports: http://feeds.bbc.co.uk/sport/rss.xml (RSS)
ESPN: https://www.espnfc.us/index/rss (RSS)
Status: ✅ Partially configured
```

---

## 2. 🔄 SYNC JOBS VE SCHEDULE'LER

### Immediate Sync (Her 5-10 dakika)
```typescript
// LIVE MAÇ GÜNCELLEMELERI
- Live scores
- Live event updates
- Real-time stats
- Crowd/possession updates
```

### Hourly Sync
```typescript
// GÜNCEL VERİLER
- Upcoming fixtures (24 saat öncesi)
- Recent match results
- League standings
- Team news
```

### Daily Sync
```typescript
// TAM VERI TARAMASI
- All teams in 7 leagues (150+ teams)
- All players (3000+ players)
- Season statistics
- Transfer news
- Injury reports
```

### Weekly Sync
```typescript
// YEDEK VERI ÇEKME
- Complete team rosters
- Historical stats
- Archive news
```

---

## 3. 📋 IMPLEMENTATION ROADMAP

### Phase 1: TheSportsDB Full Integration (WEEK 1)
- [ ] Fetch all 7 leagues (150+ teams) - use loop with delay
- [ ] Fetch all team rosters (players per team)
- [ ] Fetch current season fixtures (all matches)
- [ ] Fetch league standings
- [ ] Implement exponential backoff for rate limiting
- [ ] Store last_sync timestamps to avoid duplicates

### Phase 2: API-Football Integration (WEEK 2)
- [ ] Get API key (free or paid)
- [ ] Fetch live fixtures
- [ ] Fetch betting odds (if available)
- [ ] Fetch team statistics
- [ ] Create odds sync job
- [ ] Handle odds history tracking

### Phase 3: News & Updates (WEEK 2-3)
- [ ] Integrate NewsAPI for injury reports
- [ ] Parse BBC/ESPN RSS feeds
- [ ] Extract player injuries from articles
- [ ] Extract transfer news
- [ ] Implement sentiment analysis for news

### Phase 4: Scheduled Sync Jobs (WEEK 3)
- [ ] Create cron jobs for all sync operations
- [ ] Implement job queuing system
- [ ] Add error handling & retries
- [ ] Monitor sync performance
- [ ] Log sync results

### Phase 5: Live Updates (WEEK 4)
- [ ] WebSocket listener for live scores
- [ ] Real-time standings updates
- [ ] Live commentary parsing
- [ ] Push notifications for goals/events

---

## 4. 🗄️ DATABASE ADJUSTMENTS

### New Tables Needed
```sql
-- Live match tracking
CREATE TABLE live_match_events (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  minute INTEGER,
  event_type TEXT, -- goal, yellow_card, red_card, substitution
  player_id INTEGER,
  team_id INTEGER,
  description TEXT,
  timestamp TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Betting odds history
CREATE TABLE betting_odds (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  bookmaker TEXT,
  home_odds REAL,
  draw_odds REAL,
  away_odds REAL,
  source TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Injury reports
CREATE TABLE injury_reports (
  id INTEGER PRIMARY KEY,
  player_id INTEGER NOT NULL,
  team_id INTEGER,
  status TEXT, -- reported, confirmed, recovered
  expected_return DATE,
  source TEXT,
  source_url TEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Transfer news
CREATE TABLE transfer_news (
  id INTEGER PRIMARY KEY,
  player_id INTEGER NOT NULL,
  from_team_id INTEGER,
  to_team_id INTEGER,
  status TEXT, -- rumor, confirmed, completed
  fee_amount INTEGER,
  announced_at TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);
```

---

## 5. 🔧 SYNC JOB STRUCTURE

### Job 1: syncTheSportsDBFull.ts (İlk çalışma)
```
- Fetch all 7 leagues
- Fetch all teams per league
- Fetch all players per team
- Fetch all season fixtures
- Fetch standings
Duration: 15-30 minutes
Frequency: Once (initial population)
```

### Job 2: syncTheSportsDBIncremental.ts (Günlük)
```
- Fetch recent results (last 24h)
- Fetch upcoming fixtures (next 7 days)
- Update standings
- Update player stats
Duration: 5 minutes
Frequency: Every 6 hours
```

### Job 3: syncTheSportsDBLive.ts (Canlı)
```
- Fetch live matches
- Update scores in real-time
- Track match events
Duration: Real-time polling
Frequency: Every 30-60 seconds
```

### Job 4: syncAPIFootballOdds.ts (Bahis Oranları)
```
- Fetch current odds
- Track odds changes
- Store history
Duration: 2 minutes
Frequency: Every 4 hours (or when odds change)
```

### Job 5: syncNewsInjuries.ts (Yaralanmalar)
```
- Scrape injury news from APIs
- Parse articles
- Identify players
Duration: 5 minutes
Frequency: Every 12 hours
```

### Job 6: syncNewsTransfers.ts (Transferler)
```
- Scan transfer news
- Track rumors and confirmations
Duration: 5 minutes
Frequency: Every 24 hours
```

---

## 6. 📈 DATA FRESHNESS GUARANTEE

| Veri Türü | Güncelleme Sıklığı | Taze Kalma Süresi |
|-----------|------------------|------------------|
| Live Scores | 30 sn | < 2 dakika |
| Standings | 6 saat | < 30 dakika |
| Fixtures | 6 saat | Günlük doğru |
| Odds | 4 saat | < 1 saat |
| Injuries | 12 saat | < 6 saat |
| Transfers | 24 saat | < 24 saat |
| Team Info | 7 gün | < hafta |

---

## 7. 🚀 BAŞLAMAK İÇİN

### Step 1: TheSportsDB Full Sync
```bash
cd /wargile/backend
npx ts-node src/jobs/syncTheSportsDBFullRealData.ts
# Çekilecek: 150 teams, 3000+ players, 1000+ matches
# Süre: 20-30 minutes (rate limited)
```

### Step 2: API Keys Konfigure Et
```env
# .env
THESPORTSDB_KEY=123 (already set)
RAPIDAPI_KEY=xxx (get from RapidAPI)
NEWSAPI_KEY=xxx (get from newsapi.org)
BBC_FEED_URL=http://feeds.bbc.co.uk/sport/rss.xml (free)
ESPNFC_FEED_URL=https://www.espnfc.us/index/rss (free)
```

### Step 3: Scheduled Jobs Etkinleştir
```bash
# In /wargile/backend
npm install node-cron  # For scheduling
npm install axios      # Already installed
npm install cheerio    # For web scraping
```

### Step 4: Monitor & Verify
```bash
# Check sync logs
tail -f logs/sync.log
# Check data freshness
sqlite3 sports.db "SELECT COUNT(*) FROM events WHERE start_time > datetime('now', '-7 days')"
```

---

## 8. ⚠️ ÖNEMLİ NOTLAR

### Rate Limiting
- TheSportsDB: 45 req/min → 2 sn delay arası
- API-Football: 100 req/day (free) → careful planning
- NewsAPI: 500 req/day (free tier)

### Error Handling
- Implement exponential backoff
- Retry on 429 (rate limit)
- Skip on 404 (not found)
- Log all failures
- Send alerts on repeated failures

### Data Validation
- Validate foreign keys before insert
- Check for duplicates
- Verify data integrity
- Log anomalies

### Backup Strategy
- Keep sync logs for 30 days
- Archive old data (archive tables)
- Regular backups (daily)
- Recovery procedures documented

---

## 9. 📞 NEXT STEPS

1. ✅ **Approve this strategy**
2. 🔧 **Add API keys to .env**
3. 🚀 **Start Phase 1 (TheSportsDB full sync)**
4. 📊 **Monitor initial data population**
5. 🔄 **Set up automated sync jobs**
6. ✨ **Integrate with frontend when ready**

---

Bu strateji ile uygulamanız **canlı, gerçek veri** ile çalışacak ve **otomatik güncelleme** sağlanacaktır.
