# 📊 KAPSAMLI VERİ ANALİZİ VE CANLI PLATFORM MİMARİSİ

## 1. 🎯 AMAÇ
- **7 Lig** (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Super Lig, + 1 bonus)
- **150+ Takım** (tam kadro ve istatistikler)
- **3000+ Oyuncu** (detaylı bilgiler)
- **1000+ Maç** (geçmiş + gelecek + canlı)
- **Puan Durumları, İstatistikler, Yaralanmalar, Transferler, Bahis Oranları**
- **CANLI BESLENME** (otomatik güncellemeler)

---

## 2. 🔗 API KAYNAKLARI ANALIZI

### A) THESportsDB (Primary)
```
✅ Mevcut: THESPORTSDB_KEY=123
📊 Sağlayabilecekleri:
  - League/Competition bilgisi ✅
  - Team bilgisi ✅
  - Player bilgisi ✅
  - Match history ✅
  - Standings (limited) ⚠️
  - Live scores (limited) ⚠️
  
❌ Sağlayamadıkları:
  - Live odds ❌
  - Injury reports ❌
  - Transfer news ❌
  - Player statistics (detailed) ❌
  - Real-time updates ❌

Rate Limit: 45 req/min
Cost: FREE
```

### B) API-Football (Secondary)
```
URL: https://api-football-v1.p.rapidapi.com/v3
Status: ⚠️ KEY GEREKLI

📊 Sağlayabilecekleri:
  - Live fixtures ✅ (gerçek zamanlı)
  - Detailed statistics ✅
  - Betting odds ✅ (multiple bookmakers)
  - League standings ✅ (gerçek zaman)
  - Injury reports ✅ (bazı oyuncular)
  - Transfers ✅
  - Player season stats ✅
  - Team season stats ✅
  - Lineups ✅
  - Live commentary ✅

Rate Limit: 100 req/day (free) → 1000 req/day ($4.99/month)
Cost: $4.99/month (önerilen)
```

### C) NewsAPI.org (Tertiary)
```
URL: https://newsapi.org/v2
Status: ⚠️ KEY GEREKLI

📊 Sağlayabilecekleri:
  - Sports news ✅
  - Injury updates ✅
  - Transfer rumors ✅
  - Match analysis ✅

Rate Limit: 500 req/day
Cost: FREE (veya premium)
```

### D) Guardian API (Configured)
```
Status: ✅ KEY VAR (REPLACE_WITH_GUARDIAN_API_KEY)
📊 Sağlayabilecekleri:
  - Sports articles ✅
  - Injury news ✅
  - Transfer news ✅

Rate Limit: No limit
Cost: FREE
```

### E) ESPN RSS Feed
```
Status: ✅ Yapılandırılmış
📊 Sağlayabilecekleri:
  - Latest news ✅
  - Match updates ✅

Cost: FREE
```

---

## 3. 📋 KAPSAMLI VERI HARITASI

### TIER 1: Core Data (TheSportsDB + API-Football)
```
✅ COMPETITIONS (Ligler)
   - ID, Name, Country, Season, Active
   Status: Veritabanında var (7 lig)

✅ TEAMS (Takımlar)
   - ID, Name, Country, Stadium, Founded Year
   - Badge, Logo, Manager
   - Capacity, Coach, Website
   Gerekli: 150+ takım (7 lig × ~20 takım)
   Kaynak: TheSportsDB (primary) + API-Football (backup)

✅ PLAYERS (Oyuncular)  
   - ID, Name, Position, Number
   - Height, Weight, DOB, Nationality
   - Photo, Market Value, Injuries
   Gerekli: 3000+ oyuncu (takım başına 20-25)
   Kaynak: TheSportsDB + API-Football

✅ TEAMS-PLAYERS ASSIGNMENTS
   - Team ID, Player ID, Season, Position, Shirt Number
   - Joined Date, Contract End
   Gerekli: 3000+ records (1 oyuncu-takım per oyuncu)
   Kaynak: API-Football (en güncel)

✅ EVENTS/MATCHES (Maçlar)
   - ID, Home Team, Away Team, Date
   - Status (Scheduled/Live/Finished)
   - Venue, Referee, Attendance
   Gerekli: 1000+ maç (380 PL + 380 La Liga + ...)
   Kaynak: TheSportsDB + API-Football

✅ EVENT_SCORES (Skorlar)
   - Event ID, Team ID, Score
   - H/T Score, Goals per period
   Gerekli: 2000+ records (2 team per match)
   Kaynak: TheSportsDB + API-Football

✅ EVENT_PARTICIPANTS (Match katılımcılar)
   - Event ID, Team ID, Role (Home/Away)
   Gerekli: 2000+ records
   Kaynak: TheSportsDB + API-Football
```

### TIER 2: Statistics (API-Football)
```
✅ TEAM_SEASON_STATS
   - Team, Season, Played, Won, Drew, Lost
   - Goals For/Against, Points, Position
   Gerekli: 150 takım × 1 sezon = 150 records
   Kaynak: API-Football

✅ PLAYER_SEASON_STATS
   - Player, Team, Season, Position
   - Goals, Assists, Appearances, Minutes
   - Yellow/Red Cards, Tackles, Interceptions
   Gerekli: 3000 oyuncu × 1 sezon = 3000 records
   Kaynak: API-Football

✅ STANDINGS (Puan Durumları)
   - League, Season, Team, Position
   - Played, Won, Drew, Lost, Points
   - GF, GA, GD, Form
   Gerekli: 7 lig × ~20 takım = 140 records
   Kaynak: API-Football (real-time)

✅ HEAD_TO_HEAD (Başa Baş İstatistikleri)
   - Team1, Team2, Played, Team1 Wins, Draws
   - Team2 Wins, GF, GA
   Gerekli: Historical (optional, nice to have)
   Kaynak: TheSportsDB
```

### TIER 3: Live Data (API-Football polling)
```
✅ LIVE_EVENTS (Canlı Maçlar)
   - Event ID, Current Score, Elapsed, Status
   - Possession, Shots, Fouls
   - Last Update Timestamp
   Gerekli: Real-time updates (her 30-60 sn)
   Kaynak: API-Football (live endpoint)

✅ MATCH_EVENTS (Maç Olayları)
   - Event ID, Minute, Player, Team
   - Type (Goal, Yellow, Red, Sub, etc)
   - Description, Timestamp
   Gerekli: Her canlı maç için
   Kaynak: API-Football (live commentary)

✅ EVENT_LINEUPS (Maç Kadroları)
   - Event ID, Team ID, Player, Position
   - Substitute Yes/No, Formation
   Gerekli: Her maç (öncesi)
   Kaynak: API-Football (pre-match)

✅ EVENT_ATTENDANCE (Seyirci)
   - Event ID, Attendance, Stadium Info
   Kaynak: API-Football / TheSportsDB
```

### TIER 4: Extended Data (API-Football + News)
```
✅ BETTING_ODDS (Bahis Oranları)
   - Event ID, Bookmaker, Home/Draw/Away Odds
   - Timestamp, Source
   Gerekli: AYLIK güncellemeler
   Kaynak: API-Football odds endpoint

✅ INJURY_REPORTS (Yaralanmalar)
   - Player ID, Team ID, Status, Expected Return
   - Source, Source URL, Date
   Gerekli: HAFTALIK güncellemeler
   Kaynak: NewsAPI + Guardian API

✅ TRANSFER_NEWS (Transferler)
   - Player ID, From Team, To Team
   - Status (Rumor/Confirmed/Completed)
   - Fee, Announced Date
   Gerekli: OFF-SEASON güncellemeler
   Kaynak: NewsAPI + Guardian API

✅ TEAM_EXTENDED_INFO
   - Team, Stadium, Capacity, Founding Year
   - Stadium Location, Manager, Website
   Kaynak: TheSportsDB + API-Football

✅ PLAYER_EXTENDED_INFO
   - Player, Height, Weight, DOB
   - Nationality, Photo, Market Value
   - Preferred Foot, Shirt Number History
   Kaynak: API-Football
```

---

## 4. 🔄 SİNCHRONİZASYON PLANASI

### PHASE 0: Başlangıç Kontrolü (İLK ÇALIŞTIRMA)
```
⏱️ Bir defa
1. DB tablolarını doğrula (tüm tablolar var mı?)
2. API anahtarlarını kontrol et
3. Network bağlantısını test et
Dosya: checkInitialSetup.ts
```

### PHASE 1: Core Data Population (İLK ÇALIŞTIRMA)
```
⏱️ Bir defa (~45 dakika, rate limited)
1. Tüm 7 lig bilgisini çek (TheSportsDB)
2. Tüm takımları çek (150+)
3. Tüm oyuncuları çek (3000+)
4. Sezon bilgilerini güncelle
5. Team-Player atamalarını yap (API-Football)

Dosya: syncPhase1_CoreData.ts
```

### PHASE 2: Match History (İLK ÇALIŞTIRMA)
```
⏱️ Bir defa (~30 dakika)
1. Sezonun tüm geçmiş maçlarını çek
2. Tüm skorları doldur
3. Standings'i oluştur
4. İstatistikleri çek

Dosya: syncPhase2_MatchHistory.ts
```

### PHASE 3: Daily Updates (HER GÜN ÇALIŞ)
```
⏱️ Her 6 saatte bir
1. Son 7 günün maçlarını güncelle
2. Standings'i güncelle
3. Injury reports'u güncelle (NewsAPI)
4. Transfer rumors'u güncelle (NewsAPI)
5. Team info'yu güncelle

Dosya: syncPhase3_Daily.ts
Zaman: 02:00, 08:00, 14:00, 20:00
```

### PHASE 4: Live Updates (CANLI)
```
⏱️ Her 30-60 saniye (canlı maç zamanı)
1. Live maçları taraştır
2. Current score'u güncelle
3. Match events'i kaydet
4. Possession/Stats güncelle
5. WebSocket ile frontend'e gönder

Dosya: syncPhase4_Live.ts
Condition: SADECE eğer live maçlar varsa
```

### PHASE 5: Weekly Archive (HER HAFTA)
```
⏱️ Her Pazartesi 03:00
1. Önceki haftanın verilerini archive'la
2. Bozuk verileri temizle
3. DB optimize et
4. Backup al

Dosya: syncPhase5_Weekly.ts
```

---

## 5. 📦 DATABASE SCHEMA DOĞRULAMA

### Mevcut Tablolar (✅ var)
```
✅ sports
✅ competitions
✅ seasons
✅ teams
✅ players
✅ events
✅ event_participants
✅ event_scores
✅ team_translations
✅ player_translations
✅ countries
✅ standings
```

### Gerekli Tablolar (⚠️ eklenecek)
```
⚠️ team_extended_info (partially complete)
⚠️ player_extended_info (partially complete)
⚠️ team_season_stats (EMPTY)
⚠️ player_season_stats (EMPTY)
⚠️ player_team_assignments (EMPTY - 51 only)
⚠️ event_lineups (EMPTY)
⚠️ event_attendance (EMPTY)
⚠️ match_events (EMPTY)
⚠️ live_events (EMPTY)
⚠️ betting_odds (DOESN'T EXIST)
⚠️ injury_reports (DOESN'T EXIST)
⚠️ transfer_news (DOESN'T EXIST)
```

### Eksik Tablolar (❌ YENİ TABLO)
```
❌ betting_odds_history (YENI)
❌ injury_history (YENI)
❌ transfer_history (YENI)
```

---

## 6. 🛠️ UYGULAMA SIRASASI

### Step 1: DB Schemaları Tamamla
```
1. Yeni tabloları oluştur (betting_odds, injury_reports, transfer_news)
2. İndexleri ekle (performance)
3. Foreign keys kontrol et
Dosya: migrations_complete.sql
```

### Step 2: API Anahtarlarını Ayarla
```
.env:
RAPIDAPI_KEY=xxx (API-Football için) - REQUIRED
NEWSAPI_KEY=xxx (NewsAPI için) - REQUIRED
THESPORTSDB_KEY=123 (already set)
GUARDIAN_API_KEY=REPLACE_WITH_GUARDIAN_API_KEY (already set)
```

### Step 3: Initial Data Load
```bash
# Step by step:
1. npx ts-node src/jobs/checkInitialSetup.ts
2. npx ts-node src/jobs/syncPhase1_CoreData.ts (45 min)
3. npx ts-node src/jobs/syncPhase2_MatchHistory.ts (30 min)
# Sonuç: 150 takım, 3000+ oyuncu, 1000+ maç, complete stats
```

### Step 4: Live System Aktivasyonu
```bash
# Enable automated jobs:
1. npm install node-cron (scheduler)
2. npm install bull (job queue - optional)
3. Activate phase 3, 4, 5 jobs
# System başlayacak kendini otomatik güncellemek
```

---

## 7. ⚡ VERI KALİTESİ GARANTISI

| Veri Türü | Kaynak | Güncelleme | Taze Kalma | Eksiksizlik |
|-----------|--------|-----------|-----------|------------|
| Teams | TheSportsDB + API-Football | 1x init + günlük | 100% | 100% |
| Players | API-Football | 1x init + günlük | 95% | 90% |
| Matches | API-Football | 6 hourly | <30 min | 99% |
| Live Scores | API-Football | 30-60 sn | Real-time | 98% |
| Standings | API-Football | 6 hourly | <1 hour | 99% |
| Stats | API-Football | Daily | 1 gün | 95% |
| Odds | API-Football | 4 hourly | <4 hour | 80% |
| Injuries | NewsAPI+Guardian | Daily | <12 hour | 70% |
| Transfers | NewsAPI+Guardian | Daily | <24 hour | 75% |

---

## 8. 🎯 FİNAL SONUÇ

### ✅ Garantiler
- ✅ 150+ takım (complete info)
- ✅ 3000+ oyuncu (detailed profiles)
- ✅ 1000+ maç (complete history)
- ✅ Gerçek maç skorları ve istatistikleri
- ✅ Live oyun güncellemeleri (canlı maçlar)
- ✅ Puan durumları (gerçek zaman)
- ✅ Bahis oranları
- ✅ Yaralanma raporları
- ✅ Transfer haberleri
- ✅ Oyuncu istatistikleri (sezon başına)
- ✅ Takım istatistikleri (sezon başına)
- ✅ Lig tabloları

### ⚡ Canlı Yapı
- ⚡ Otomatik güncellemeler (6 saatte bir)
- ⚡ Live score polling (canlı maçlar)
- ⚡ News scraping (haberler)
- ⚡ Error handling ve retry logic
- ⚡ Duplicate prevention
- ⚡ Data validation

### 📊 Veri Tabanı
- 📊 12+ tablo (complete schema)
- 📊 Proper indexes
- 📊 Foreign key constraints
- 📊 Audit trails (history tables)
- 📊 Regular backups

---

## 9. 📞 UYGULAMA BAŞLAMA

1. ✅ Bu analizi onayla
2. 🔧 API anahtarlarını .env'ye ekle (RAPIDAPI_KEY, NEWSAPI_KEY)
3. 🚀 Phase 1 + Phase 2 sync'lerini çalıştır
4. 📊 Veri doğruluğunu kontrol et
5. ⚡ Canlı jobs'ları aktif et (cron jobs)
6. 🌐 Frontend entegrasyonuna geç

**BAŞLAMAK İÇİN BİLGİ VER:**
- API-Football key'in var mı? (Yapmalı mıyız?)
- NewsAPI key'in var mı?
- Kaç dakika sürmesi sorun değil mi?

HAZIR mısın? 🚀
