# WAGERline Platform - Detaylı Durum Analizi

**Tarih:** 2026-09-07  
**Durum:** Hazırlık Aşaması

---

## 1️⃣ UYGULAMANIN İHTİYAÇ DUYDUĞU VERİLER

### Temel Veriler (Zorunlu)
```
✅ TEAMS (Takımlar)
   - Team ID, Name, Country, Logo, Stadium Info
   - Mevcut: 54 takım (generic names, sample data)
   - Eksik: Gerçek takım bilgileri

✅ COMPETITIONS (Ligler)
   - Comp ID, Name, Country, Season
   - Mevcut: 13 adet (7 futbol ligi + diğerleri)
   - Durum: Hazır

✅ EVENTS (Maçlar)
   - Event ID, Teams, Date, Status, Scores
   - Mevcut: 1632 maç (sample data)
   - Durum: Hazır

✅ STANDINGS (Puan Durumları)
   - Position, Team, Played, W/D/L, Goals, Points
   - Mevcut: 102 kayıt (hesaplanan, sample maç dataından)
   - Durum: Hazır
```

### İkincil Veriler (Önemli)
```
❌ PLAYERS (Oyuncular)
   - Player ID, Name, Position, Height, Weight, DOB
   - Mevcut: 0 (boş)
   - Gerekli: 1000+ oyuncu
   - Sorun: TheSportsDB API 404 hatası

❌ PLAYER_SEASON_STATS (Oyuncu İstatistikleri)
   - Goals, Assists, Games Played, Cards
   - Mevcut: 0 (boş)
   - Gerekli: Sezon istatistikleri

❌ PLAYER_TEAM_ASSIGNMENTS (Oyuncu-Takım Atamaları)
   - Player-Team-Season mappings
   - Mevcut: 0 (boş)
   - Gerekli: Tüm oyuncular için

❌ BETTING_ODDS (Oran Bilgileri)
   - Home/Draw/Away odds
   - Mevcut: 0 (boş)
   - Gerekli: Betting sistemi için

❌ PREDICTIONS (Tahminler)
   - Win probability, Score predictions
   - Mevcut: 0 (boş)
   - Gerekli: AI/ML hesaplamalar sonrası
```

### Opsiyonel Veriler
```
⚠️  NEWS (Haberler)
   - Mevcut: 80 haber (Guardian API'dan)
   - Durum: Kısmen dolu

⚠️  INJURY_REPORTS
   - Mevcut: 0
   - Kaynak: Guardian API news parsing

⚠️  TRANSFER_NEWS
   - Mevcut: 0
   - Kaynak: Guardian API news parsing
```

---

## 2️⃣ VERİLER İÇİN TABLO, VIEW, FONKSİYON İHTİYAÇLARI

### Mevcut Tablolar (45 adet)

#### A. Dolu Tablolar
```sql
teams (54 kayıt)
  - external_id, slug, logo_url, country_id, active
  - TAMAMLANMASI GEREKLI: Gerçek takım bilgileri, logos
  
competitions (13 kayıt)
  - sport_id, slug, name_key, season_id
  - DURUM: Hazır ✅
  
events (1632 kayıt)
  - home_team_id, away_team_id, competition_id, start_time
  - event_scores: 1308 kayıt
  - DURUM: Hazır ✅
  
standings (102 kayıt)
  - competition_id, team_id, position, W/D/L, goals_for/against
  - DURUM: Hazır (sample dataından hesaplanan) ✅

news (80 kayıt)
  - title, content, source, published_at
  - DURUM: Hazır ✅
```

#### B. Boş Tablolar (İhtiyaç var)
```sql
players (0 kayıt)
  - GEREKLI: Sport ID, Name, Position, Height, Weight, DOB
  - VERI KAYNAĞI: TheSportsDB API

player_season_stats (0 kayıt)
  - GEREKLI: Goals, Assists, Red/Yellow Cards, Games Played
  - HESAPLAMA: Event data'dan, oyuncu performance tracking

player_team_assignments (0 kayıt)
  - GEREKLI: Player-Team-Season-Position mapping
  - VERI KAYNAĞI: TheSportsDB API

betting_odds (0 kayıt)
  - GEREKLI: Home/Draw/Away odds, Bookmaker, Timestamp
  - VERI KAYNAĞI: API-Football, BetRadar, vs.

predictions (0 kayıt)
  - GEREKLI: Match ID, Prediction type, Probability, Model
  - HESAPLAMA: Python ML models (XGBoost, etc.)

team_season_stats (0 kayıt)
  - GEREKLI: Goals/Assists, Home/Away split, Win rates
  - HESAPLAMA: Event data'dan aggregation
```

### Gerekli VIEWs (Oluşturulması tavsiye)
```sql
-- View: Puan durumu detaylı
CREATE VIEW v_standings_detail AS
SELECT 
  s.id, c.name as competition, t.name, s.position,
  s.played, s.wins, s.draws, s.losses,
  (s.wins*3 + s.draws) as points
FROM standings s
JOIN competitions c ON s.competition_id = c.id
JOIN teams t ON s.team_id = t.id
ORDER BY c.id, s.position;

-- View: Maç detayları
CREATE VIEW v_events_detail AS
SELECT 
  e.id, e.start_time, e.status,
  ht.name as home_team, at.name as away_team,
  es_h.score as home_score, es_a.score as away_score,
  c.name as competition
FROM events e
JOIN teams ht ON e.home_team_id = ht.id
JOIN teams at ON e.away_team_id = at.id
LEFT JOIN event_scores es_h ON e.id = es_h.event_id AND es_h.participant_id = e.home_team_id
LEFT JOIN event_scores es_a ON e.id = es_a.event_id AND es_a.participant_id = e.away_team_id
JOIN competitions c ON e.competition_id = c.id;

-- View: Oyuncu performansı
CREATE VIEW v_player_performance AS
SELECT 
  p.id, p.name, t.name as team, p.position,
  COUNT(DISTINCT pss.season_id) as seasons,
  SUM(pss.goals) as total_goals,
  SUM(pss.assists) as total_assists
FROM players p
LEFT JOIN player_team_assignments pta ON p.id = pta.player_id
LEFT JOIN teams t ON pta.team_id = t.id
LEFT JOIN player_season_stats pss ON p.id = pss.player_id
GROUP BY p.id;
```

### Gerekli Fonksiyonlar (SQL/TypeScript)
```typescript
// 1. Puan durumu hesaplama
function calculateStandings(competitionId, seasonId) {
  // Events'ten tüm maçları al
  // Her takım için W/D/L hesapla
  // Standings tablosuna yaz
}

// 2. Oyuncu istatistikleri
function aggregatePlayerStats(playerId, seasonId) {
  // Event_statistics'ten oyuncu datası al
  // Goals, Assists, Cards aggregation
  // player_season_stats'a yaz
}

// 3. Tahmin hesaplama
function generatePredictions(eventId) {
  // Event detayları al
  // Model ile prediction yap (Python)
  // predictions tablosuna yaz
}

// 4. Head-to-Head
function getHeadToHead(team1Id, team2Id, last=5) {
  // Events'ten bu iki takım arasındaki maçları ara
  // Son N maçı döndür
}
```

---

## 3️⃣ VERİTABANI HAZIRLIK DURUMU

### Özet
```
Toplam Tablo: 45
Boş Tablo: ~20
Dolu Tablo: ~6

Hazırlaması: ~30% ✅
Eksikliği: ~70% ❌
```

### Detay
```
✅ TAMAM:
  - Schema (tüm tablolar oluşturulmuş)
  - Competitions (13 lig)
  - Events (1632 maç)
  - Event_scores (1308 kayıt)
  - Standings (102 kayıt - hesaplanan)
  - News (80 kayıt)
  - Teams (54 - generic, sample)

⚠️  KISMI:
  - Teams (gerçek bilgiler eksik)
  - News (sadece Guardian API'den)

❌ EKSİK:
  - Players (0 kayıt)
  - Player_season_stats (0 kayıt)
  - Player_team_assignments (0 kayıt)
  - Betting_odds (0 kayıt)
  - Predictions (0 kayıt)
  - Team_season_stats (0 kayıt)
  - Injury_reports (0 kayıt)
  - Transfer_news (0 kayıt)
```

---

## 4️⃣ GERÇEK VERİLER - KAYNAK VE ALINMA YÖNTEMİ

### Şu Anda Çalışan Kaynaklar
```
✅ GUARDIAN API
   - Endpoint: https://open-platform.theguardian.com/search
   - Kimlik: API Key mevcut (REPLACE_WITH_GUARDIAN_API_KEY)
   - Veri: Sports news, injuries, transfers
   - Durum: 80 haber çekildi ✅
   - Sorun: Yok, çalışıyor

✅ BBC RSS FEED
   - Endpoint: http://feeds.bbc.co.uk/sport/rss.xml
   - Kimlik: Yok gerekli (public)
   - Veri: Sports news
   - Durum: Çekilebilir ✅
   - Sorun: Yok
```

### Sorun Yaşanan Kaynaklar
```
❌ THESPORTSDB API
   - Endpoint: https://www.thesportsdb.com/api/v1/json/123/eventslastleague.php
   - Durum: 404 NOT FOUND ❌
   - Sorun: Endpoint yanlış veya kapalı
   - Veri gereksinimi: Teams (150+), Players (1000+), Fixtures
   - İMPACT: KRITIK - Ana veri kaynağı başarısız

❌ NEWSAPI
   - Endpoint: https://newsapi.org/v2/everything
   - Durum: API key eksik (opsiyonel)
   - Sorun: Key kurulmadı
   - Veri: Sports articles
   - ÖNEMLİ: Düşük öncelik
```

### Alternatif Kaynaklar (Kullanılmayan)
```
⚠️  API-FOOTBALL (RapidAPI)
   - Endpoint: https://rapidapi.com/api-sports/api/api-football
   - Veri: Teams, Players, Fixtures, Live scores
   - Durum: Entegre edilmemiş
   - GEREKLI: RapidAPI key
   - ÖNEMLİ: Yüksek (TheSportsDB alternatifi)

⚠️  BETFAIR / SPORTRADAR API
   - Veri: Betting odds
   - Durum: Entegre edilmemiş
   - GEREKLI: Ticari lisans/key
   - ÖNEMLİ: Orta
```

### Veri Çekme Şu Anda
```
Status: DURDURULMUŞ ❌

Son Deneme: 2026-09-07 23:05
Sonuç: TheSportsDB 404 hatası

Script: runAllPhases.ts
  Phase 1 (Teams/Players): 9.3 min - 0 kayıt çekildi
  Phase 2 (Fixtures): 0.5 min - 0 kayıt çekildi
  Phase 3 (News): 0.4 min - 80 haber çekildi ✓

Gerekli Aksiyonlar:
1. TheSportsDB endpoint'i düzeltmek veya alternatif API kullanmak
2. API-Football entegrasyonu (yaygın ve güvenilir)
3. Endpoint testleri
```

---

## 5️⃣ HESAPLAMALAR - KOD DÜZENLEMELERİ

### Puan Durumu Hesaplama (SQL - HAZIR)
```typescript
✅ Mevcut: syncPhase2_Fixtures.ts
Yapı: 
  - Events tablosundan finished matches'i oku
  - Her takım için W/D/L hesapla
  - Standings tablosuna yaz
Durum: Çalışıyor ✅

SQL:
SELECT 
  competition_id, team_id,
  COUNT(*) as played,
  SUM(CASE WHEN score > opponent_score THEN 1 ELSE 0 END) as wins,
  ...
FROM events
WHERE status = 'finished'
GROUP BY competition_id, team_id;
```

### Oyuncu İstatistikleri (SQL - GEREKLI)
```typescript
❌ Mevcut değil, OLUŞTURULMALI

Yapı:
  - event_statistics tablosundan oyuncu datası oku
  - Aggregation: Goals, Assists, Cards, Minutes played
  - player_season_stats'a yaz
  
SQL İhtiyaç:
SELECT 
  player_id, season_id,
  SUM(goals) as goals,
  SUM(assists) as assists,
  COUNT(*) as games_played
FROM event_statistics
GROUP BY player_id, season_id;
```

### Tahmin Modelleri (Python - GEREKLI)
```python
❌ Mevcut değil, OLUŞTURULMALI

Gerekli:
1. Win Probability Model
   - Features: Recent form, H2H, Home/Away advantage
   - Model: XGBoost, Random Forest, v.s.
   - Output: Home Win %, Draw %, Away Win %

2. Score Prediction
   - Features: Team offense/defense stats
   - Model: Poisson distribution, v.s.
   - Output: Expected score range

3. Player Performance
   - Features: Player position, recent stats, team form
   - Model: Regression
   - Output: Expected goals/assists

Örnek Yapı:
import xgboost
import pandas as pd

def train_prediction_model():
    # Events + standings verisiyle train et
    X = prepare_features(events_data, standings_data)
    y = events_data['actual_result']
    
    model = xgboost.XGBClassifier()
    model.fit(X, y)
    
    return model

def predict_match(event_id):
    features = get_match_features(event_id)
    prediction = model.predict(features)
    return prediction
```

### Betting Odds Calculation (Opsiyonel)
```typescript
❌ Mevcut değil, GEREKLI

Yapı:
  - Harici API'den odds al
  - Bizim prediction'ımız ile karşılaştır
  - Arbitrage opportunities bul

Kaynak:
  - API-Football odds data
  - Sportradar API
```

---

## 6️⃣ BACKEND API'LERİ

### Şu Anda Mevcut (7 route)
```
✅ /api/v1/teams
   - GET / : Tüm takımları listele
   - GET /:slug : Tek takım detayı
   - Status: Çalışıyor ✅

✅ /api/v1/events
   - GET / : Maçları listele (status, limit)
   - GET /:id : Tek maç detayı
   - Status: Çalışıyor ✅

✅ /api/v1/competitions
   - GET / : Ligleri listele
   - GET /:slug : Liga + standings
   - Status: Çalışıyor ✅

✅ /api/v1/sports
   - GET / : Sports listesi
   - Status: Çalışıyor ✅

✅ /api/v1/news
   - GET / : Haberler (pagination, filter)
   - GET /:id : Tek haber
   - Status: Çalışıyor ✅

✅ /api/v1/providers
   - Status: Çalışıyor ✅

⚠️  /api/v1/admin/status
   - GET : Admin dashboard data
   - Status: Çalışıyor ✅
```

### Eksik API'ler (GEREKLI)
```
❌ /api/v1/players
   - GET / : Oyuncu listesi (team, position filter)
   - GET /:slug : Oyuncu detayı + istatistikler
   - GET /:id/stats : Sezon istatistikleri
   - Status: OLUŞTURULMALI

❌ /api/v1/standings
   - GET / : Puan durumları (competition, season)
   - GET /:competitionId : Liga puan durumu
   - Status: OLUŞTURULMALI (şu anda /competitions/:slug'un içinde)

❌ /api/v1/predictions
   - GET /match/:eventId : Maç tahmini
   - GET /leaderboard : Prediction accuracy
   - Status: OLUŞTURULMALI

❌ /api/v1/betting
   - GET /odds/:eventId : Oran bilgileri
   - GET /analysis/:eventId : Arbitrage opportunities
   - Status: OLUŞTURULMALI

❌ /api/v1/live
   - GET / : Canlı maçlar
   - WebSocket: Real-time updates
   - Status: OLUŞTURULMALI

❌ /api/v1/head-to-head
   - GET /:team1Id/:team2Id : Head-to-head history
   - Status: OLUŞTURULMALI

❌ /api/v1/stats
   - GET /team/:teamId : Takım istatistikleri
   - GET /player/:playerId : Oyuncu istatistikleri
   - Status: OLUŞTURULMALI
```

### API Kalite Kontrol
```
Response Format: ✅ Standardized
  {
    data: [...],
    meta: {
      language, total, timestamp
    }
  }

Error Handling: ⚠️ Temel (200/404/500)
  - Detaylı error codes eksik
  
Validation: ⚠️ Minimal
  - Query param validation eksik
  
Rate Limiting: ❌ Yok
  - DDoS koruması eksik

Caching: ❌ Yok
  - Performance optimization eksik
```

---

## 7️⃣ FRONTEND - BACKEND BAĞLANTISI

### Teknik Ortam
```
Frontend: Next.js 14 + React
Backend: Fastify
Database: SQLite
Communication: HTTP REST

URL Config:
Frontend: localhost:3000
Backend: localhost:3001
Çalışıyor: ✅
```

### Engeller / Sorunlar
```
1. ✅ ÇÖZÜLDÜ: ApiProvider Context
   - Sorun: useApi hook'u context'te değildi
   - Çözüm: providers.tsx'e ApiProvider eklendi
   - Status: Düzeltildi ✅

2. ⚠️  GERİ DÖNEN: Frontend entegrasyonu
   - Sorun: Sports/page.tsx'e dokunuldu (design değişti)
   - Çözüm: Orijinal dosya geri yüklendi
   - Status: Temiz ✅

3. ✅ HAZIR: Data fetching hooks
   - useSportsData.ts oluşturuldu
   - Uygulanmadı (tasarım korunması için)
   - Status: Hazır, uygulamaya hazır ✅

4. ⚠️  KISMEN: API endpoint kapsamı
   - Sorun: Bazı API'ler eksik (players, predictions, etc.)
   - Durum: Frontend yazıldığında çakışacak
   - Çözüm: Önce tüm API'ler yazılmalı

5. ❌ ENGEL YOK: CORS, DNS, Port
   - API'ler accessible ✅
   - CORS headers set ✅
   - Portlar free ✅
```

### Bağlantı Test
```bash
✅ Backend alive:
  curl http://localhost:3001/api/health
  {"status":"ok",...}

✅ API data:
  curl http://localhost:3001/api/v1/teams?sport=football
  {data: [...], meta: {...}}

⚠️  Frontend ready:
  localhost:3000/sports çalışıyor ama
  - Henüz backend datası entegre değil
  - Hardcoded sample data gösteriyor
```

---

## 📋 ÖZET VE SONUÇ

| Alan | Durum | % |
|------|-------|---|
| **Database** | 45 tablo schema ✅, veriler 30% dolu | 30% |
| **Veri Kaynakları** | Guardian ✅, BBC ✅, TheSportsDB ❌ | 40% |
| **Backend API** | 7 endpoint ✅, 8 eksik ❌ | 46% |
| **Frontend Hooks** | useSportsData ✅ (uygulanmadı) | 0% |
| **Bağlantı** | HTTP ✅, CORS ✅, Provider ✅ | 100% |

### Kritik Blokerler
1. 🔴 **TheSportsDB API 404 hatası** - Ana veri kaynağı başarısız
   - FİX: API-Football v.s. alternatif kullanmak

2. 🔴 **Player verisi yok** - 1000+ oyuncu eksik
   - FİX: Veri kaynağını bulmak

3. 🟡 **Tahmin modelleri eksik** - ML code yazılmamış
   - FIX: Python scripts yazılmalı

4. 🟡 **Eksik API'ler** - /players, /predictions, /betting, /live
   - FIX: Backend routes yazılmalı

### Sonraki Adımlar (Öncelik Sırası)
1. TheSportsDB alternatifi bul veya endpoint'i düzelt
2. Player verisi çek (API-Football v.s.)
3. Eksik backend API'leri yaz
4. Python tahmin modelleri yaz
5. Frontend entegrasyonlarını yap
