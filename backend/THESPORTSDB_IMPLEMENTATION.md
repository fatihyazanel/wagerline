# TheSportsDB Integration Implementation Guide

## 📋 Summary

Toplam **3 dosya** oluşturuldu ve **11 yeni tablo** database'e eklenecek.

---

## 📁 Created Files

### 1. **THESPORTSDB_ANALYSIS.md** (Analysis Document)
- **Konum:** `d:/wargile/backend/THESPORTSDB_ANALYSIS.md`
- **İçerik:**
  - TheSportsDB API'nin sağladığı verilerin detaylı analizi
  - Mevcut database schema'sı ile karşılaştırma
  - Eksik alanlar ve yeni tablolar listesi
  - Data mapping tablosu
  - Implementation stratejisi

### 2. **migrations.sql** (Database Schema Updates)
- **Konum:** `d:/wargile/backend/src/database/migrations.sql`
- **İçerik:**
  - 11 yeni tablo oluşturma komutları
  - Ülkeler tablosuna referans veriler (30 ülke)
  - Indexler ve performans optimizasyonları

### 3. **syncTheSportsDBFull.ts** (Complete Sync Job)
- **Konum:** `d:/wargile/backend/src/jobs/syncTheSportsDBFull.ts`
- **İçerik:**
  - Ligler çekme ve kaydetme
  - Takımlar ve genişletilmiş bilgiler
  - Oyuncular ve detaylı profil bilgileri
  - Maçlar, skorlar, kadroları ve seyirci bilgileri
  - Sıralamalar ve tablo verileri

---

## 📊 Database Tables Created

| # | Table Name | Purpose | Rows | Status |
|---|---|---|---|---|
| 1 | `countries` | Ülkeler (Referans) | 30 | Seed data included |
| 2 | `venues` | Stadyumlar | - | Ready for data |
| 3 | `referees` | Hakemler | - | Ready for data |
| 4 | `event_lineups` | Maç Kadroları | - | Ready for data |
| 5 | `player_team_assignments` | Oyuncu-Takım Atamaları | - | Ready for data |
| 6 | `event_attendance` | Maç Seyirci Bilgileri | - | Ready for data |
| 7 | `team_extended_info` | Takım Ek Bilgileri | - | Ready for data |
| 8 | `player_extended_info` | Oyuncu Ek Bilgileri | - | Ready for data |
| 9 | `match_head_to_head` | Maç Geçmiş Verileri | - | Ready for data |
| 10 | `team_season_stats` | Takım Sezon İstatistikleri | - | Ready for data |
| 11 | `player_season_stats` | Oyuncu Sezon İstatistikleri | - | Ready for data |

---

## 🚀 Implementation Steps

### Step 1: Database Migration (İlk Kurulum)

```bash
# Dosyayı schema.sql'ye ekle veya direkt çalıştır
cat src/database/migrations.sql | sqlite3 ./data/wagerline.db

# VEYA elle çalıştır:
sqlite3 ./data/wagerline.db < src/database/migrations.sql
```

### Step 2: Compile TypeScript

```bash
cd backend
npm run build
# veya
tsc src/jobs/syncTheSportsDBFull.ts --target ES2020 --module commonjs
```

### Step 3: Run Sync Job

```bash
# Node.js ile çalıştır
node dist/jobs/syncTheSportsDBFull.js

# VEYA direktly
npx ts-node src/jobs/syncTheSportsDBFull.ts
```

### Step 4: Verify Data

```bash
# SQLite CLI ile kontrol et
sqlite3 ./data/wagerline.db

# Queries to verify:
SELECT COUNT(*) as team_count FROM teams;
SELECT COUNT(*) as player_count FROM players;
SELECT COUNT(*) as event_count FROM events;
SELECT COUNT(*) as country_count FROM countries;
```

---

## 📈 Data Flow

```
TheSportsDB API
    ↓
syncTheSportsDBFull.ts
    ↓
┌─────────────────────┬──────────────┬──────────────┐
│                     │              │              │
v                     v              v              v
Competitions      Teams          Players        Events
(ligler)          + Extended      + Extended     + Scores
                  Info            Info          + Lineups
                  + Stadiums      + Assignments + Attendance
                  + Badges        + Season Stats + Statistics
```

---

## 🔍 Data Mapping Reference

### Teams
```
strTeam ──→ team_translations.name
strCountry ──→ countries.id (via team_extended_info)
strStadium ──→ team_extended_info.stadium_name
strStadiumCapacity ──→ team_extended_info.stadium_capacity
intFormedYear ──→ team_extended_info.founded_year
strTeamLogo ──→ teams.logo_url
strTeamBadge ──→ team_extended_info.badge_url
```

### Players
```
strPlayer ──→ player_translations.name
strPosition ──→ player_team_assignments.position
intHeight ──→ player_extended_info.height
intWeight ──→ player_extended_info.weight
dateBorn ──→ player_extended_info.date_of_birth
strNationality ──→ player_extended_info.nationality
intNumber ──→ player_team_assignments.shirt_number
strCutout ──→ player_extended_info.cutout_image_url
```

### Events
```
idEvent ──→ events.external_id
dateEvent + strTime ──→ events.start_time
strHomeTeam ──→ event_participants (home role)
strAwayTeam ──→ event_participants (away role)
intHomeScore ──→ event_scores (home team)
intAwayScore ──→ event_scores (away team)
intRound ──→ events.round
strStatus ──→ events.status
strVenue ──→ venues.name
intAttendance ──→ event_attendance.attendance
strHomeTeamLineup* ──→ event_lineups (home)
strAwayTeamLineup* ──→ event_lineups (away)
```

---

## ⚙️ Configuration

### .env Variables (Mevcut)
```
THESPORTSDB_KEY=123
DATABASE_PATH=./data/wagerline.db
DATABASE_URL=sqlite:./data/wagerline.db
```

### API Rate Limiting
- TheSportsDB: Serbest (500 req/hour)
- Sync Job: İçinde 300-500ms delays bulunur
- Güvenli kullanım: ~6-7 saniye per league

---

## 🔗 API Endpoints Used

| Endpoint | Purpose | Param | Data |
|---|---|---|---|
| `lookup_all_teams.php` | Takımları getir | leagueId | 20+ fields |
| `lookup_all_players.php` | Oyuncuları getir | teamId | 15+ fields |
| `eventslast.php` | Son maçları getir | leagueId | Complete match data |
| `eventstand.php` | Sıralamayı getir | leagueId, season | Table standings |

---

## 📊 Expected Data Volumes

After successful sync:

- **Countries:** 30 (seed data)
- **Teams:** ~200+ (major leagues)
- **Players:** ~3000+ (all teams)
- **Events:** ~300+ (recent & current season)
- **Standings:** 20+ (per league)

---

## ✅ Verification Checklist

- [ ] Migrations executed successfully
- [ ] `countries` table contains 30+ entries
- [ ] `teams` table populated with team_extended_info
- [ ] `teams` linked to `team_extended_info`
- [ ] `players` table populated with player_extended_info
- [ ] `players` linked to `player_team_assignments`
- [ ] `events` table has matches with participants
- [ ] `event_scores` linked correctly
- [ ] `event_lineups` contains formation data
- [ ] `event_attendance` has seyirci info
- [ ] All foreign keys validated
- [ ] Indexes created for performance
- [ ] No duplicate external_ids

---

## 🐛 Troubleshooting

### Issue: "FOREIGN KEY constraint failed"
**Solution:** Ensure parent tables (countries, teams, seasons) are populated first

### Issue: "Database is locked"
**Solution:** Close all other connections and increase busyTimeout in init.ts

### Issue: "API timeout"
**Solution:** Increase timeout in axios.create() or use smaller batches

### Issue: "No data appears"
**Solution:** Verify:
- API key is correct (should be '123')
- External IDs match between API response and DB
- Sport 'football' exists before syncing

---

## 📈 Next Steps

### Phase 1 (Completed)
- ✅ Analyze TheSportsDB API
- ✅ Design database schema
- ✅ Create migration files
- ✅ Implement sync job

### Phase 2 (Ready to Execute)
- ⏳ Run migrations on production database
- ⏳ Execute sync job for initial data load
- ⏳ Validate data integrity
- ⏳ Create API endpoints for data retrieval

### Phase 3 (Future)
- 📋 Implement incremental sync (daily updates)
- 📋 Add cached endpoints for quick access
- 📋 Create analytics dashboards
- 📋 Implement prediction models using player stats

---

## 🔧 Integration with Existing Code

### In `backend/src/index.ts` add:
```typescript
import { initDatabase } from './database/init'

// Before server start:
await initDatabase()
```

### In `backend/src/routes/sports.ts` use:
```typescript
// Get team extended info
const teamInfo = await db.prepare(`
  SELECT t.*, te.stadium_name, te.founded_year, te.badge_url
  FROM teams t
  LEFT JOIN team_extended_info te ON t.id = te.team_id
  WHERE t.slug = ?
`).get(teamSlug)

// Get player with stats
const playerStats = await db.prepare(`
  SELECT p.*, pe.height, pe.weight, pe.date_of_birth,
         pta.shirt_number, pta.position
  FROM players p
  LEFT JOIN player_extended_info pe ON p.id = pe.player_id
  LEFT JOIN player_team_assignments pta ON p.id = pta.player_id
  WHERE p.slug = ?
`).get(playerSlug)
```

---

## 📝 Notes

- **Veri Türü:** Tüm external_id'ler TEXT olarak saklanır (string matching)
- **Dil Desteği:** Çeviriler hazır (English), Turkish ve diğer diller eklenebilir
- **Sezon:** Current season otomatik algılanır
- **Timezone:** UTC kullanılır (database'de timezone depolanmaz)

---

## 🎯 Success Criteria

✅ Implementation successful when:
1. Tüm 11 tablo başarıyla oluşturulur
2. Migrations hiç hata olmadan çalışır
3. Sync job 3000+ oyuncu başarıyla kaydeder
4. Foreign key relationships doğru çalışır
5. API endpoints veri döndürür

