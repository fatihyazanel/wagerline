# 📊 Gerçek Veri Senkronizasyonu (Real Data Sync)

## Durum: Önceki vs Şimdi

### ❌ Önceki Sync (`npm run sync`)
```
Sadece Mock/Sample Data:
├─ 5 Sports (statik)
├─ 10 Competitions (statik)
├─ 10 Teams (örnek: Arsenal, Liverpool)
├─ 3 Events (dummy)
└─ 30 Translations
```

### ✅ Yeni Sync (`npm run sync:real`)
```
Gerçek API Veri:
├─ 20+ Takım (API-Sports'tan)
├─ 30+ Maç (Gerçek fixture takvimi)
├─ 100+ İstatistik (Şut, pas, sarı-kırmızı kart vb)
├─ Puan Tablosu (Güncel standings)
├─ 50+ Oyuncu (Squad information)
└─ Tüm Çeviriler (EN/ES/AR)
```

---

## 🔄 Sync'in Yaptıkları

### 1. **Takım Detaylı Bilgileri** (`syncTeamsDetailed`)
```
Her takım için:
├─ External ID (API provider ID)
├─ Logo URL
├─ Stadyum bilgisi
├─ Kuruluş yılı
├─ Ülke
├─ Taraftar sayısı
└─ Teknik direktör
```

**Kaynak:** API-Sports (Premier League)

### 2. **Fixture/Maç Takvimi** (`syncFixtures`)
```
Her maç için:
├─ Fixture ID
├─ Tarih & Saat
├─ Home/Away takımlar
├─ Skor (live veya final)
├─ Maç durumu (scheduled, live, finished)
├─ Venue/Stadyum
└─ Hakem bilgisi
```

**Kaynak:** API-Sports (30 gün geçmiş + 30 gün gelecek)

### 3. **Maç İstatistikleri** (`syncMatchStatistics`)
```
Her maç için her takım:
├─ Top possession %
├─ Şut (toplam & isabetli)
├─ Pas tamamlama %
├─ Köşe vuruşu
├─ Faul
├─ Sarı kart
├─ Kırmızı kart
├─ Ofside
└─ Birden fazla metrik
```

**Kaynak:** API-Sports

### 4. **Puan Tablosu** (`syncStandings`)
```
Maç başına:
├─ Sıra (position)
├─ Oynanan maç
├─ Kazanan
├─ Beraberlik
├─ Kaybeden
├─ Gol Pozitif-Negatif
└─ Toplam Puanlar
```

**Kaynak:** API-Sports

### 5. **Oyuncu/Squad Bilgileri** (`syncPlayers`)
```
Her oyuncu için:
├─ Oyuncu ID
├─ Ad
├─ Pozisyon (CB, ST, GK, etc)
├─ Giydiği numarası
├─ Doğum tarihi
├─ Ülke
├─ Boy/Kilo
└─ Ayak (sol/sağ)
```

**Kaynak:** API-Sports

---

## 🔑 Gerekli API Keys

### API-Sports (MANDATORY - Ödül)
```env
API_SPORTS_KEY=your_key_from_api-football.com
```

**Almak için:**
1. https://www.api-football.com/documentation-v3 ziyaret et
2. Free plan seç (50 req/day)
3. API key al
4. `.env`'e ekle

**Test et:**
```bash
curl -H "x-apisports-key: YOUR_KEY" \
  https://v3.football.api-sports.io/fixtures?league=39&season=2024
```

---

## 🚀 Kullanım

### Adım 1: API Key Ekle
```bash
# backend/.env
API_SPORTS_KEY=your_api_key_here
```

### Adım 2: Enhanced Sync Çalıştır
```bash
cd backend
npm run sync:real
```

**Çıktı örneği:**
```
============================================================
  WAGERLINE - ENHANCED DATA SYNC (Real API Data)
============================================================

🔄 Syncing detailed team information...
  📡 Fetching Premier League teams from API-Sports...
  Found 20 teams
  ✅ Arsenal
  ✅ Liverpool
  ✅ Manchester City
  ... (17 more)
  Teams Updated: 20

🔄 Syncing fixtures and events...
  📡 Fetching fixtures from API-Sports...
  Found 380 fixtures
  ✅ Created 30 recent/upcoming fixtures
  Fixtures Created: 30

🔄 Syncing match statistics...
  Found 10 events with stats to fetch
  ✅ Downloaded 500+ individual stats
  Statistics: 500

🔄 Syncing league standings...
  Found 20 teams in standings
  ✅ Updated all standings
  Standings: 20

🔄 Syncing player information...
  Fetching players for 5 teams...
  ✅ Created 55 player records
  Players: 55

============================================================
  📊 SYNC SUMMARY
============================================================
  Teams Updated:     20
  Fixtures Created:  30
  Statistics:        500
  Standings:         20
  Players:           55

============================================================
  📈 DATABASE STATS
============================================================
  Sports:            5
  Competitions:      10
  Teams:             20
  Events:            35
  Players:           55
  Statistics:        500

✨ Enhanced sync completed!
```

---

## 📊 Database Artık Olacak

```
wagerline.db
├─ sports: 5
├─ competitions: 10
├─ teams: 20 (Arsenal, Liverpool, Man City, vb)
├─ events: 35 (gerçek fixtures)
├─ event_participants: 70 (home/away teams)
├─ event_scores: 70 (maç skorları)
├─ event_statistics: 500+ (şut, pas, possession vb)
├─ standing_entries: 20 (puan tablosu)
├─ players: 55+ (squad lists)
├─ team_translations: 60 (EN/ES/AR)
└─ countries: 5+
```

---

## 🔄 Sync Stratejisi

### Development Mode (Local)
```bash
# İlk kez - full sync
npm run sync:real

# Günlük - updates only (future)
npm run sync:live
```

### Production Mode
```
Cron Jobs:
├─ Daily 2 AM   → Teams, Standings, Players
├─ Hourly 0-59  → Fixtures, Events
└─ Every 10s    → Live scores only (active events)
```

---

## ⚠️ API Rate Limits

### API-Sports
```
Free Plan:    50 requests/day
Pro Plan:     100 requests/day
Elite Plan:   300+ requests/day
```

**Limit Yönetimi:**
```
Current sync: ~15 requests
├─ Teams:         1
├─ Fixtures:      3
├─ Statistics:    5
├─ Standings:     1
└─ Players:       5

✅ Free plan yeterli (50 req/day)
```

---

## 🛠️ Troubleshooting

### "401 Unauthorized"
```bash
# API key eksik veya yanlış
# Kontrol et: backend/.env
API_SPORTS_KEY=your_key
```

### "Rate limit exceeded"
```bash
# Sonra tekrar dene (quota reset)
# Free plan: Her gün sıfırlansı
```

### "Empty response"
```bash
# API down olabilir
# Check: https://www.api-football.com
# Fallback: sync:sports (mock data)
```

### "No teams found"
```bash
# League ID yanlış
# Premier League: 39
# La Liga: 140
# Serie A: 135
# Bundesliga: 78
```

---

## 📈 Veriler Şu Anda Eksik Olan

```
Beklenen (v1.0):
├─ [DONE] Team details
├─ [DONE] Fixture calendar
├─ [DONE] Match statistics
├─ [DONE] Standings
├─ [DONE] Player squad
├─ [TODO] Player detailed stats (goals, assists)
├─ [TODO] H2H (head-to-head history)
├─ [TODO] Form guide (last 5 matches)
├─ [TODO] Injury news
└─ [TODO] Odds (if provider has)
```

---

## 🎯 Sonraki Adımlar

1. **API-Sports key al** → sync:real çalıştır
2. **Verileri kontrol et** → curl testleri
3. **Frontend'e bağla** → Real data render
4. **WebSocket setup** → Live updates
5. **Advanced search** → Fuzzy team/player search

---

## 📚 İlişkili Dosyalar

- `src/jobs/syncRealData.ts` - Enhanced sync service
- `CONFIG_GUIDE.md` - API configuration
- `API_ROUTES.md` - API endpoints
- `QUICK_START.md` - Getting started

---

## ✨ Veriler Hızlıca Al

```bash
# 1. Setup
cd backend
npm install

# 2. API key ekle
nano .env
# API_SPORTS_KEY=your_key

# 3. Mock data (test için)
npm run sync

# 4. Real data (production)
npm run sync:real

# 5. Verify
sqlite3 data/wagerline.db "SELECT COUNT(*) FROM teams;"
```

**Şimdi gerçek verilerle dolu bir database'in var! 🎉**
