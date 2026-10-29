# Desteklenmeyen Kısımlar - Veri İçin Ayrı Çözümler

TheSportsDB'de bulunmayan ancak spor analiz uygulaması için önemli olan verilerin nasıl ele alınacağı.

---

## 1. 🎰 BET ODDS (Bahis Oranları)

### Neden TheSportsDB'de Yok?
- Dynamik ve sürekli değişen veri
- Farklı bookmaker'lar farklı oranlar sunar
- Yasal ve düzenleyici kısıtlamalar

### Çözüm: Dedicate Odds API

#### Option A: API-Football (Rapid API)
```
Base URL: https://api-football-v1.p.rapidapi.com
Key: ${{ secrets.API_FOOTBALL_KEY }}

Endpoints:
- GET /fixtures/{fixtureId}/odds
- GET /leagues/{leagueId}/odds
- GET /odds/live
```

#### Option B: TheSportsDB Odds (Limited)
```
Endpoint: /eventodd.php?id={eventId}
Returns: Some basic odds (limited coverage)
```

#### Option C: Pinnacle/Betfair API (Premium)
```
- Real-time odds from major bookmakers
- Highest API turnover
- Professional usage required
```

### Implementation Plan

**Database Schema:**
```sql
CREATE TABLE IF NOT EXISTS betting_odds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  bookmaker TEXT NOT NULL,
  home_odds REAL,
  draw_odds REAL,
  away_odds REAL,
  timestamp TIMESTAMP,
  source TEXT DEFAULT 'api-football',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS betting_odds_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  betting_odds_id INTEGER NOT NULL,
  old_value REAL,
  new_value REAL,
  changed_at TIMESTAMP,
  FOREIGN KEY (betting_odds_id) REFERENCES betting_odds(id)
);
```

**Sync Job:**
```typescript
async function syncBettingOdds() {
  const response = await apiFootball.get(`/fixtures/${fixtureId}/odds`)
  
  for (const bookmaker of response.data.bookmakers) {
    await insertOdds({
      event_id,
      bookmaker: bookmaker.name,
      home_odds: bookmaker.bets.home,
      draw_odds: bookmaker.bets.draw,
      away_odds: bookmaker.bets.away
    })
  }
}
```

---

## 2. 🏥 INJURY REPORTS (Yaralanma Haberleri)

### Neden TheSportsDB'de Yok?
- Real-time bilgi gerektirir
- Manuel haber güncelleme
- Güvenilir bir spesifik kaynak gerekli

### Çözüm: News API Integration

#### Option A: NewsAPI.org
```
Base URL: https://newsapi.org/v2
Key: ${{ secrets.NEWS_API_KEY }}

Endpoint:
GET /everything?q={player_name}+injury&sortBy=publishedAt
```

#### Option B: ESPN RSS Feed
```
URL: http://www.espn.com/espn/rss/news.xml
Filter: by sport/team/player keywords
```

#### Option C: Guardian API (mevcut kullanıyorsunuz)
```
Endpoint: /search?q={player_name}%20injury
Already configured in .env
```

### Implementation Plan

**Database Schema:**
```sql
CREATE TABLE IF NOT EXISTS injury_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  team_id INTEGER,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'reported', -- reported, confirmed, recovered
  severity TEXT, -- minor, moderate, serious, critical
  expected_return DATE,
  source TEXT,
  source_url TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS injury_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  injury_report_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT,
  changed_at TIMESTAMP,
  note TEXT,
  FOREIGN KEY (injury_report_id) REFERENCES injury_reports(id)
);
```

**Guardian API Implementation:**
```typescript
// Zaten kullanıyorsunuz - şu kodu uyarlayın:

async function syncInjuryReports() {
  const players = await db.all('SELECT id, slug FROM players')
  
  for (const player of players) {
    const response = await axios.get(
      'https://open-platform.theguardian.com/search',
      {
        params: {
          q: `${player.slug} injury`,
          api_key: process.env.GUARDIAN_API_KEY,
          format: 'json'
        }
      }
    )
    
    for (const article of response.data.response.results) {
      if (isInjuryRelated(article)) {
        await insertInjuryReport({
          player_id: player.id,
          title: article.webTitle,
          description: article.fields?.byline,
          source: 'guardian',
          source_url: article.webUrl,
          published_at: article.webPublicationDate
        })
      }
    }
  }
}
```

---

## 3. 🔄 TRANSFER NEWS (Transfer Haberleri)

### Neden TheSportsDB'de Yok?
- Off-season aktivitesi
- Yazın veri yoğun
- Resmi teyit gereken bilgi

### Çözüm: Transfer Tracking API

#### Option A: TransferMarkt API (Free)
```
Base URL: https://www.transfermarkt.com
Method: Web scraping (deprecated but still works)
```

#### Option B: Football-Data API
```
Endpoint: /teams/{teamId}/players
Shows: Squad changes, new players
```

#### Option C: Manual Guardian Monitoring
```
Search: "{team} signs", "{player} transfer"
Monitor: transfer news seasonally
```

### Implementation Plan

**Database Schema:**
```sql
CREATE TABLE IF NOT EXISTS transfers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_id INTEGER NOT NULL,
  from_team_id INTEGER,
  to_team_id INTEGER,
  transfer_date DATE,
  transfer_type TEXT, -- loan, permanent, free, exchange
  fee_amount INTEGER,
  fee_currency TEXT DEFAULT 'EUR',
  status TEXT DEFAULT 'rumor', -- rumor, confirmed, completed
  source TEXT,
  source_url TEXT,
  announced_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (from_team_id) REFERENCES teams(id),
  FOREIGN KEY (to_team_id) REFERENCES teams(id)
);

CREATE TABLE IF NOT EXISTS transfer_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  transfer_id INTEGER NOT NULL,
  old_status TEXT,
  new_status TEXT,
  changed_at TIMESTAMP,
  note TEXT,
  FOREIGN KEY (transfer_id) REFERENCES transfers(id)
);
```

**Transfer Sync Job:**
```typescript
async function syncTransfers() {
  // Guardian API ile search
  const response = await axios.get(
    'https://open-platform.theguardian.com/search',
    {
      params: {
        q: 'transfer signs loan',
        section: 'sport',
        api_key: process.env.GUARDIAN_API_KEY
      }
    }
  )
  
  for (const article of response.data.response.results) {
    const transfer = parseTransferFromArticle(article)
    if (transfer) {
      await insertTransfer(transfer)
    }
  }
}
```

---

## 4. ⚡ LIVE MATCH UPDATES (Canlı Maç Güncellemeleri)

### Neden TheSportsDB'de Yok?
- Real-time veri gerekli
- WebSocket/Polling gerekli
- Kompleks altyapı

### Çözüm: Dedicated Live API

#### Option A: API-Football Live
```
Endpoint: /fixtures?live=all
Returns: Live match data (refresh every 5-10 seconds)
```

#### Option B: ESPN WebSocket
```
WS: wss://api.espn.com/...
Real-time updates
```

#### Option C: Polling TheSportsDB Frequently
```
Update interval: 30-60 seconds
Changes detected via delta comparison
```

### Implementation Plan

**Database Schema:**
```sql
CREATE TABLE IF NOT EXISTS live_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER UNIQUE NOT NULL,
  status TEXT, -- live, half-time, finished, postponed
  elapsed INTEGER, -- minutes played
  current_home_score INTEGER,
  current_away_score INTEGER,
  home_possession INTEGER,
  away_possession INTEGER,
  last_update TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

CREATE TABLE IF NOT EXISTS match_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  minute INTEGER,
  team_id INTEGER,
  player_id INTEGER,
  event_type TEXT, -- goal, yellow_card, red_card, substitution, own_goal
  description TEXT,
  timestamp TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (player_id) REFERENCES players(id)
);
```

**Live Update Service:**
```typescript
class LiveMatchService {
  private updateInterval = 30000 // 30 seconds
  
  async startLivePolling() {
    setInterval(async () => {
      const liveMatches = await this.getLiveMatches()
      for (const match of liveMatches) {
        await this.updateMatchData(match)
      }
    }, this.updateInterval)
  }
  
  async updateMatchData(event: Event) {
    const current = await api.get(`/fixtures/${event.external_id}`)
    const previous = await db.get('SELECT * FROM live_events WHERE event_id = ?', [event.id])
    
    // Delta comparison
    if (current.score.home !== previous.current_home_score) {
      // Goal detected!
      await this.recordMatchEvent({
        type: 'goal',
        minute: current.elapsed
      })
    }
  }
}
```

---

## 📋 Implementation Priority

| Kısım | Importance | Complexity | Timeline |
|-------|------------|-----------|----------|
| **Betting Odds** | 🔴 High | Medium | Week 1 |
| **Injury Reports** | 🟡 Medium | Low | Week 1 |
| **Transfer News** | 🟡 Medium | Low | Week 2 |
| **Live Updates** | 🔴 High | High | Week 2-3 |

---

## 🛠️ Implementation Roadmap

### Week 1
- [ ] Odds API integration (choose provider)
- [ ] Injury reports from Guardian API (existing)
- [ ] Database tables for odds and injuries
- [ ] Sync jobs for both

### Week 2
- [ ] Transfer tracking setup
- [ ] Live match polling infrastructure
- [ ] WebSocket listener (optional)
- [ ] API endpoints for new data

### Week 3
- [ ] Testing and optimization
- [ ] Caching strategies
- [ ] Rate limit handling
- [ ] Error recovery

---

## 🔐 API Keys Needed

```env
# Existing
GUARDIAN_API_KEY=REPLACE_WITH_GUARDIAN_API_KEY

# To Add
RAPIDAPI_KEY=xxx          # For API-Football
NEWS_API_KEY=xxx          # For NewsAPI
TRANSFERMARKT_KEY=xxx     # If using paid API
ESPN_API_KEY=xxx          # If using ESPN API
```

---

## ✅ Completion Checklist

- [ ] Odds API provider selected
- [ ] Injury report tables created
- [ ] Transfer tracking tables created
- [ ] Live match polling configured
- [ ] All API keys configured
- [ ] Sync jobs implemented
- [ ] REST endpoints created
- [ ] Testing completed
- [ ] Performance optimized

---

## 📞 Support

For integration help:
1. Check API documentation for each provider
2. Test endpoints with cURL first
3. Implement sync jobs incrementally
4. Monitor error rates and adjust delays
5. Add proper logging for debugging

