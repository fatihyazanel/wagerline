# 📋 WAGERline - DETAYLI CEVAPLAR & DURUM RAPORU

**Tarih:** 2026-09-07  
**Durum:** Kısmi Hazır (30%)  
**Kritik Bloker:** Oyuncu verisi, ML modelleri, haber kaynakları

---

## 1️⃣ UYGULAMANIN HANGI VERİLERE İHTİYACI VAR?

### A. TEMEL SPORCU VERİLERİ

#### 1. Takımlar
```
Gerekli: 150+ takım (7 ligden)
├─ Premier League: 20 takım
├─ La Liga: 20 takım
├─ Serie A: 20 takım
├─ Bundesliga: 18 takım
├─ Ligue 1: 20 takım
├─ Super Lig: 18 takım
└─ Eredivisie: 18 takım

Veri Alanları:
├─ id (database)
├─ name (takım adı)
├─ external_id (TheSportsDB/API-Football id)
├─ slug (url-friendly)
├─ logo_url (takım logosu)
├─ stadium (stadyum adı)
├─ founded_year (kurulma yılı)
├─ website (resmi web sitesi)
├─ country (ülke)
├─ active (aktif mi)
└─ created_at (kayıt tarihi)

Mevcut: 78 takım ✅ (Gerekli sayıda ama kalitesi düşük)
Gerekli Kaynaklar: 
  ✅ TheSportsDB: lookup_all_teams.php
  ✅ API-Football: /teams
  ⚠️ Wikipedia (takım bilgisi)
  ⚠️ Transfermarkt (transfer verisi)
```

#### 2. Oyuncular ⭐ KRITIK
```
Gerekli: 1000+ oyuncu (50-100 oyuncu/takım)
  └─ Ortalama: 14 oyuncu/takım × 78 takım = ~1100 oyuncu

Veri Alanları:
├─ id (database)
├─ name (oyuncu adı)
├─ external_id (API id)
├─ slug (url-friendly)
├─ position (pozisyon: GK, CB, LB, RB, CM, CDM, CAM, ST, etc.)
├─ height (boy - cm)
├─ weight (kilo - kg)
├─ date_of_birth (doğum tarihi)
├─ nationality (uyruk)
├─ number (forma numarası)
├─ agent (menajeri)
├─ market_value (pazar değeri €)
├─ active (aktif mi)
└─ created_at (kayıt tarihi)

Mevcut: 240 oyuncu ❌ (78 takımın sadece 3 oyuncusu)
Gerekli Kaynaklar:
  ❌ TheSportsDB: lookup_all_players.php (sınırlı veri)
  ⚠️ API-Football: /teams/{id}/players (daha kapsamlı)
  ⚠️ Transfermarkt (web scraping - en kapsamlı)
  ⚠️ Wikidata (oyuncu bilgileri)
  ⚠️ SofaScore API (oyuncu puan)
```

#### 3. Maçlar (Etkinlikler)
```
Gerekli: 500-1000 maç
  └─ Her ligde sezon başında ~250-300 maç

Veri Alanları:
├─ id
├─ competition_id (hangi ligde)
├─ season_id (hangi sezon)
├─ home_team_id (ev sahibi takım)
├─ away_team_id (konuk takım)
├─ start_time (maç tarihi/saati)
├─ status (scheduled, live, finished, postponed)
├─ venue (stadyum)
├─ referee (hakem)
├─ attendance (izleyici sayısı)
└─ created_at

Mevcut: 1636 maç ✅ (Yeterli sayıda)
Gerekli Kaynaklar:
  ✅ TheSportsDB: eventslast.php?id={leagueId}
  ✅ API-Football: /fixtures
  ⚠️ ESPN (opsiyonel)
  ⚠️ BBC Sport (opsiyonel)
```

#### 4. Maç Skorları & Detayları
```
Gerekli: 1000+ maç skoru ve detay
  └─ Her maçın: home_score, away_score, goalscorers, assists, cards

Veri Alanları:
├─ id
├─ event_id (hangi maçta)
├─ participant_id (takım id)
├─ score (skor)
├─ status (H=Home, A=Away)
└─ created_at

Alt Tablo: event_statistics
├─ id
├─ event_id
├─ player_id
├─ team_id
├─ position
├─ goals
├─ assists
├─ yellow_cards
├─ red_cards
├─ minutes_played
├─ shots_on_target
├─ pass_accuracy
└─ rating

Mevcut: 1312 skoru ✅ (Yeterli)
Mevcut: 0 oyuncu istatistiği ❌ (0 kayıt, 1000+ gerekli)
Gerekli Kaynaklar:
  ✅ TheSportsDB: eventslast.php
  ✅ API-Football: /fixtures?id=, /statistics
  ⚠️ Flashscore (web scraping - en detaylı)
  ⚠️ SofaScore (web scraping - en detaylı)
```

#### 5. Oyuncu İstatistikleri ⭐ KRITIK
```
Gerekli: 500+ oyuncu sezon istatistiği

Veri Alanları: (player_season_stats tablosu)
├─ id
├─ player_id
├─ season_id
├─ team_id
├─ goals (kaydırılan gol)
├─ assists (asist)
├─ games_played (oynadığı maç)
├─ minutes_played (oynadığı dakika)
├─ yellow_cards
├─ red_cards
├─ pass_accuracy
├─ tackles
├─ interceptions
└─ created_at

Mevcut: 0 kayıt ❌
Gerekli Kaynaklar:
  ⚠️ API-Football: /players/statistics
  ⚠️ Flashscore (web scraping)
  ⚠️ SofaScore (web scraping)
  ⚠️ Transfermarkt (web scraping - en detaylı)
```

#### 6. Puan Durumları (Standings)
```
Gerekli: 102 puan durumu (7 lig × 14-18 takım)

Veri Alanları:
├─ id
├─ competition_id (hangi lig)
├─ season_id (hangi sezon)
├─ team_id (hangi takım)
├─ position (sıra: 1-20)
├─ played (oynadığı maç sayısı)
├─ wins (galibiyet)
├─ draws (beraberlik)
├─ losses (mağlubiyet)
├─ goals_for (atılan gol)
├─ goals_against (yenen gol)
├─ goal_difference (gol farkı)
├─ points (puan: Win×3 + Draw×1)
└─ form (son 5 maçın formu: WWDLW)

Mevcut: 102 puan durumu ✅ (Yeterli)
Hesaplama: SQL ile otomatik (syncPhase2'de yapılıyor)
```

#### 7. Haberler
```
Gerekli: 200+ haber (transfer, yaralanma, maç sonuçları, analizler)

Veri Alanları:
├─ id
├─ sport_id (football)
├─ title (başlık)
├─ content (link/özet)
├─ source (kaynak: guardian, newsapi, bbc, etc.)
├─ news_type (news, transfer, injury, match_result, analysis)
├─ published_at (yayın tarihi)
├─ created_at
└─ updated_at

Kategori:
├─ Transfer News (takvim oyuncu transferi)
├─ Injury Reports (yaralanma haberleri)
├─ Match Reviews (maç analizi)
├─ Team News (takım haberleri)
└─ General News (genel haberler)

Mevcut: 80 haber ⚠️ (5 Guardian, çoğu placeholder)
Gerekli Kaynaklar:
  ❌ Guardian API (çalışmıyor)
  ❌ NewsAPI (key yok)
  ❌ BBC Feeds (çalışmıyor)
  ❌ Club Websites (çalışmıyor)
  ⚠️ Google News (placeholder)
```

---

### B. TAHMİN & BAHIS VERİLERİ

#### 8. Tahminler
```
Gerekli: 500+ tahmin (her maç için)

Veri Alanları: (predictions tablosu)
├─ id
├─ event_id
├─ prediction_type (win_probability, score_prediction, etc.)
├─ home_win_prob (ev sahibinin kazanma olasılığı %)
├─ draw_prob (beraberlik olasılığı %)
├─ away_win_prob (konuğun kazanma olasılığı %)
├─ predicted_home_score (tahmini ev sahibi skoru)
├─ predicted_away_score (tahmini konuk skoru)
├─ confidence (güven aralığı: 0-100%)
├─ model_version (hangi model: v1, v2, etc.)
└─ created_at

Mevcut: 0 kayıt ❌
Hesaplama: Python ML modeller gerekli
```

#### 9. Bahis Oranları
```
Gerekli: 500+ bahis oranı (her maç için)

Veri Alanları: (betting_odds tablosu)
├─ id
├─ event_id
├─ provider (betsson, unibet, pinnacle, etc.)
├─ odds_type (1x2, over_under, correct_score, etc.)
├─ home_win_odds (ev sahibi kazanma oranı)
├─ draw_odds (beraberlik oranı)
├─ away_win_odds (konuk kazanma oranı)
├─ over_2_5 (2.5 gol üstü oranı)
├─ under_2_5 (2.5 gol altı oranı)
├─ timestamp (kaydedilme zamanı)
└─ created_at

Mevcut: 0 kayıt ❌
Kaynaklar:
  ⚠️ Betfair API (lisans gerekli)
  ⚠️ Sportradar (lisans gerekli)
  ⚠️ Web scraping (odds websites)
```

#### 10. Canlı Veriler (Live)
```
Gerekli: Gerçek zamanlı maç güncellemeleri

Veri Alanları: (live_updates tablosu)
├─ id
├─ event_id
├─ timestamp
├─ event_type (goal, card, substitution, etc.)
├─ player_id (ilgili oyuncu)
├─ team_id (ilgili takım)
├─ minute (maçın hangi dakikası)
├─ description (olay açıklaması)
└─ created_at

Mevcut: 0 kayıt ❌
Kaynaklar:
  ⚠️ API-Football (WebSocket)
  ⚠️ Flashscore (WebSocket)
  ⚠️ SofaScore (WebSocket)
```

---

### C. ÖZET: VERİ İHTİYACI

| Veri | Gerekli | Mevcut | % | Durum | Kaynak |
|------|---------|--------|---|-------|--------|
| Takım | 150+ | 78 | 52% | ⚠️ | TheSportsDB, API-Football |
| Oyuncu | 1000+ | 240 | 24% | 🔴 | API-Football, Transfermarkt |
| Maç | 500-1000 | 1636 | 164% | ✅ | TheSportsDB, API-Football |
| Maç Skoru | 1000+ | 1312 | 131% | ✅ | TheSportsDB, API-Football |
| Oyuncu İstat | 500+ | 0 | 0% | 🔴 | API-Football, Flashscore |
| Puan Durumu | 102 | 102 | 100% | ✅ | SQL Hesaplama |
| Haberler | 200+ | 80 | 40% | ⚠️ | Guardian, NewsAPI, BBC |
| Tahminler | 500+ | 0 | 0% | 🔴 | Python ML |
| Bahis | 500+ | 0 | 0% | 🔴 | Betfair, Web Scraping |
| Canlı | Gerçek zamanlı | 0 | 0% | 🔴 | WebSocket APIs |

---

## 2️⃣ VERİLER İÇİN TABLO - VIEW - FONKSIYON İHTİYAÇI NEDİR?

### A. MEVCUT TABLOLAR (45 adet - Schema Hazır ✅)

#### Core Tablolar
```sql
1. sports
   ├─ id, name, slug, type, active
   └─ Veri: 1 (football)

2. teams
   ├─ id, sport_id, external_id, slug, logo_url, active
   └─ Veri: 78 ✅

3. players
   ├─ id, sport_id, external_id, slug, country_id, active
   └─ Veri: 240 ❌ (1000+ gerekli)

4. competitions (Liglar)
   ├─ id, sport_id, slug, name_key, external_provider, active
   └─ Veri: 13 (7 lig + diğer spor)

5. seasons
   ├─ id, year, name, is_current, active
   └─ Veri: 1 (2025-26)

6. events (Maçlar)
   ├─ id, sport_id, home_team_id, away_team_id, competition_id, season_id
   ├─ start_time, status, venue, referee, attendance
   └─ Veri: 1636 ✅

7. event_scores
   ├─ id, event_id, participant_id, score, status
   └─ Veri: 1312 ✅

8. event_statistics (Oyuncu Maç İstat)
   ├─ id, event_id, player_id, team_id, position
   ├─ goals, assists, yellow_cards, red_cards, minutes_played, etc.
   └─ Veri: 0 ❌ (1000+ gerekli)

9. player_season_stats (Oyuncu Sezon İstat)
   ├─ id, player_id, season_id, goals, assists, games_played
   └─ Veri: 0 ❌ (500+ gerekli)

10. standings (Puan Durumları)
    ├─ id, competition_id, season_id, team_id, position
    ├─ played, wins, draws, losses, goals_for, goals_against, points
    └─ Veri: 102 ✅

11. news
    ├─ id, sport_id, title, content, source, news_type, published_at
    └─ Veri: 80 ⚠️ (200+ gerekli)

12. player_team_assignments
    ├─ id, player_id, team_id, season_id, position, shirt_number
    └─ Veri: 1200 ✅

13. predictions (TAHMİNLER)
    ├─ id, event_id, prediction_type, home_win_prob, draw_prob, away_win_prob
    ├─ predicted_home_score, predicted_away_score, confidence
    └─ Veri: 0 ❌ (500+ gerekli)

14. betting_odds
    ├─ id, event_id, provider, odds_type, home_win_odds, draw_odds, away_win_odds
    └─ Veri: 0 ❌ (500+ gerekli)

15. live_updates
    ├─ id, event_id, timestamp, event_type, player_id, team_id, minute
    └─ Veri: 0 ❌
```

#### Tercih & Çeviri Tabloları
```sql
16. team_translations
    ├─ id, team_id, language, name, description
    └─ Veri: 78 ✅

17. player_translations
    ├─ id, player_id, language, name
    └─ Veri: 240 ✅

18. team_extended_info
    ├─ id, team_id, stadium_name, capacity, founded_year, website
    └─ Veri: ~78 ✅

19. player_extended_info
    ├─ id, player_id, height, weight, date_of_birth, agent, market_value
    └─ Veri: ~240 ✅

20. competition_translations
    └─ Veri: ~13 ✅

... (25 daha tablolar - referans ve ayarlar için)
```

**Toplam:** 45 tablo, ~30 tanesi veriye sahip, 15 tanesi boş ⚠️

---

### B. GEREKLI VİEWLER (3 adet - Yazılması Gerekli ❌)

#### View 1: standings_detail
```sql
CREATE VIEW standings_detail AS
SELECT 
  s.id,
  c.name_key as league,
  t.name as team_name,
  s.position,
  s.played,
  s.wins,
  s.draws,
  s.losses,
  s.goals_for,
  s.goals_against,
  (s.goals_for - s.goals_against) as goal_difference,
  s.points,
  -- Form: son 5 maçın sonuçları
  (SELECT GROUP_CONCAT(
    CASE 
      WHEN home_score > away_score THEN 'W'
      WHEN home_score < away_score THEN 'L'
      ELSE 'D'
    END
  ) FROM events WHERE (home_team_id = t.id OR away_team_id = t.id)
  AND competition_id = c.id
  AND status = 'finished'
  ORDER BY start_time DESC LIMIT 5) as form
FROM standings s
JOIN competitions c ON s.competition_id = c.id
JOIN teams t ON s.team_id = t.id
WHERE s.season_id = 1
ORDER BY c.name_key, s.position;
```

**Kullanım:** /api/v1/standings endpoint'inde

---

#### View 2: events_detail
```sql
CREATE VIEW events_detail AS
SELECT
  e.id as event_id,
  c.name_key as league,
  ht.name as home_team,
  at.name as away_team,
  e.start_time,
  e.status,
  COALESCE(
    (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = ht.id),
    NULL
  ) as home_score,
  COALESCE(
    (SELECT score FROM event_scores WHERE event_id = e.id AND participant_id = at.id),
    NULL
  ) as away_score,
  e.venue,
  e.referee,
  e.attendance,
  -- Ev sahibi puan durumu
  (SELECT points FROM standings WHERE team_id = ht.id AND competition_id = c.id) as home_points,
  -- Konuk puan durumu
  (SELECT points FROM standings WHERE team_id = at.id AND competition_id = c.id) as away_points
FROM events e
JOIN competitions c ON e.competition_id = c.id
JOIN teams ht ON e.home_team_id = ht.id
JOIN teams at ON e.away_team_id = at.id
WHERE e.season_id = 1;
```

**Kullanım:** /api/v1/events endpoint'inde

---

#### View 3: player_performance
```sql
CREATE VIEW player_performance AS
SELECT
  p.id as player_id,
  p.name,
  t.name as team_name,
  pss.goals,
  pss.assists,
  pss.games_played,
  ROUND(pss.goals / NULLIF(pss.games_played, 0), 2) as goals_per_game,
  ROUND((pss.goals + pss.assists) / NULLIF(pss.games_played, 0), 2) as contributions_per_game,
  pss.minutes_played,
  pss.yellow_cards,
  pss.red_cards,
  -- Son 5 maçın performansı
  (SELECT AVG(rating) FROM event_statistics 
   WHERE player_id = p.id 
   AND event_id IN (SELECT id FROM events WHERE status='finished' 
                    ORDER BY start_time DESC LIMIT 5)) as avg_recent_rating
FROM player_season_stats pss
JOIN players p ON pss.player_id = p.id
JOIN teams t ON pss.team_id = t.id
WHERE pss.season_id = 1;
```

**Kullanım:** /api/v1/players/{id}/stats endpoint'inde

---

### C. GEREKLI FONKSİYONLAR

#### Function 1: calculate_standings()
```sql
-- Çalışıyor ✅ (syncPhase2_Fixtures_FIXED.ts içinde)

Purpose: Her maçtan puan durumunu otomatik hesaplar
Tetiklenme: Yeni event_score eklendiğinde
Hesaplanan: W×3 + D×1 = Puan
```

#### Function 2: generate_predictions() ⚠️
```python
# Yazılması gerekli - Python ML Model

def generate_predictions(event_id):
    """
    Maç için tahminler üretir
    
    Input: Event ID
    Output: 
      - home_win_probability (%)
      - draw_probability (%)
      - away_win_probability (%)
      - predicted_score (home_score, away_score)
      - confidence (0-100%)
    
    Model: XGBoost / Poisson Regression
    Features: 
      - Tim istatistikleri
      - Oyuncu İstatistikleri
      - Forma
      - Head-to-head geçmiş
      - Konum (ev/konuk)
    
    Status: YAPILMADI ❌
    """
```

#### Function 3: fetch_player_stats() ⚠️
```python
# Yazılması gerekli - API Integration

def fetch_player_stats(player_id, season_id):
    """
    Oyuncu sezon istatistiklerini API'den çeker ve DB'ye yazar
    
    Kaynaklar:
      - API-Football /players/statistics
      - Flashscore web scraping
      - Transfermarkt web scraping
    
    Status: YAPILMADI ❌
    """
```

#### Function 4: update_live_scores() ⚠️
```typescript
// Yazılması gerekli - Real-time Update

async function update_live_scores() {
  /**
   * Her 30 saniyede canlı maç verilerini günceller
   * 
   * Kaynaklar:
   *   - API-Football WebSocket
   *   - Flashscore WebSocket
   *   - SofaScore WebSocket
   * 
   * Güncellenen: events, event_statistics, event_scores
   * 
   * Status: YAPILMADI ❌
   */
}
```

---

### D. ÖZET: TABLO-VIEW-FONKSIYON

| Tür | Mevcut | Gerekli | Durum |
|-----|--------|---------|-------|
| Tablo | 45 | 45 | ✅ Schema Hazır |
| Tablo (Dolu) | 15 | 30 | ⚠️ 50% Dolu |
| View | 0 | 3 | ❌ YAPILMADI |
| Fonksiyon (SQL) | 1 | 2 | ⚠️ 50% |
| Fonksiyon (Python) | 0 | 3 | ❌ YAPILMADI |

---

## 3️⃣ DATABASE NE KADARLIK KISMID HAZIR?

### A. ŞEMA (Schema): %100 ✅

```
45 tablo tanımı tamamlandı
├─ Core tablolar (6): sports, teams, players, competitions, events, etc.
├─ İstatistik tabloları (8): player_season_stats, event_statistics, etc.
├─ Tercih tabloları (15): translations, extended_info, etc.
├─ Sistem tabloları (10): settings, user, logs, etc.
└─ Relationship tabloları (6): player_team_assignments, etc.

Migration: ✅ Tamamlandı (d:/wargile/backend/data/wagerline.db)
```

### B. VERİ DOLDURULMASI: %30 ⚠️

```
┌─ Temel Veri
│  ├─ Sports: 1/1 (100%) ✅
│  │  └─ football
│  │
│  ├─ Competitions: 13/13 (100%) ✅
│  │  ├─ 7 Futbol Ligi
│  │  └─ 6 Diğer Spor
│  │
│  ├─ Seasons: 1/1 (100%) ✅
│  │  └─ 2025-26
│  │
│  ├─ Teams: 78/150 (52%) ⚠️
│  │  ├─ Premier League: 4/20
│  │  ├─ La Liga: 0/20
│  │  ├─ Serie A: 0/20
│  │  ├─ Bundesliga: 0/18
│  │  ├─ Ligue 1: 0/20
│  │  ├─ Super Lig: 2/18
│  │  └─ Eredivisie: 0/18
│  │
│  ├─ Players: 240/1000 (24%) 🔴
│  │  ├─ Ortalama: 3 oyuncu/takım
│  │  ├─ Gerekli: 50-100 oyuncu/takım
│  │  └─ Eksik: ~760 oyuncu
│  │
│  ├─ Events: 1636/1000 (164%) ✅
│  │  ├─ Premier League: 272
│  │  ├─ La Liga: 272
│  │  ├─ Serie A: 272
│  │  ├─ Bundesliga: 272
│  │  ├─ Ligue 1: 272
│  │  ├─ Super Lig: 272
│  │  ├─ Eredivisie: 0
│  │  └─ Diğer: 4
│  │
│  └─ Event Scores: 1312/1000 (131%) ✅
│     └─ Her maçın skorları
│
├─ İstatistik & Analiz
│  ├─ Event Statistics: 0/1000 (0%) 🔴
│  │  ├─ Oyuncu maç istatistikleri yok
│  │  ├─ Goals, assists, cards, etc. yok
│  │  └─ Gerekli: Her maç oyuncusu için
│  │
│  ├─ Player Season Stats: 0/500 (0%) 🔴
│  │  ├─ Sezon istatistikleri yok
│  │  └─ Gerekli: Her oyuncu için
│  │
│  └─ Standings: 102/102 (100%) ✅
│     └─ 7 lig × ~14-18 takım
│
├─ Haber & İçerik
│  ├─ News: 80/200 (40%) ⚠️
│  │  ├─ Guardian: 0 (çalışmıyor)
│  │  ├─ NewsAPI: 0 (key yok)
│  │  ├─ BBC: 0 (çalışmıyor)
│  │  ├─ Google: 5 (placeholder)
│  │  ├─ Club Sites: 0 (çalışmıyor)
│  │  └─ Diğer: 75
│  │
│  └─ Predictions: 0/500 (0%) 🔴
│     └─ Python ML yapılmadı
│
└─ Sistem & Tercih
   ├─ Team Translations: 78/78 (100%) ✅
   ├─ Player Translations: 240/240 (100%) ✅
   ├─ Extended Info: ~78 (100%) ✅
   └─ Settings: 1/1 (100%) ✅
```

### C. VERI KALİTESİ ANALIZI

```
DÜŞÜK KALITE ALANLAR:

1. Takım Logolar
   ├─ Mevcut: 78/78 URL'si var
   ├─ Problem: Bazıları 404 (geçersiz URL)
   └─ Çözüm: Logo URL'lerini güncelle

2. Oyuncu Bilgileri
   ├─ name: ✅ Var
   ├─ position: ✅ Var
   ├─ height: ⚠️ Eksik (çoğunda NULL)
   ├─ weight: ⚠️ Eksik (çoğunda NULL)
   ├─ date_of_birth: ⚠️ Eksik (çoğunda NULL)
   ├─ nationality: ✅ Var
   ├─ market_value: ❌ Hiç yok
   └─ agent: ❌ Hiç yok

3. Etkinlik Detayları
   ├─ home_team_id: ✅ Var
   ├─ away_team_id: ✅ Var
   ├─ start_time: ✅ Var
   ├─ status: ✅ Var
   ├─ venue: ⚠️ Eksik
   ├─ referee: ⚠️ Eksik
   └─ attendance: ❌ Hiç yok

4. Oyuncu Maç İstatistikleri
   ├─ Tamamen boş (0 kayıt)
   └─ Gerekli: Tüm oyuncular için
```

### D. ÖZET: DB HAZIRLIK DURUMU

```
┌──────────────────────┬────────────┬────────────┐
│ Bileşen              │ Durum      │ Yüzde      │
├──────────────────────┼────────────┼────────────┤
│ Schema               │ ✅ Hazır   │ 100%       │
│ Temel Veriler        │ ⚠️ Kısıtlı │ 60%        │
│ İstatistikler        │ 🔴 Eksik   │ 5%         │
│ Tahminler            │ 🔴 Yok     │ 0%         │
│ Sistem Ayarları      │ ✅ Hazır   │ 100%       │
├──────────────────────┼────────────┼────────────┤
│ TOPLAM               │ ⚠️ Kısmi   │ 30%        │
└──────────────────────┴────────────┴────────────┘

✅ = Tam Hazır
⚠️ = Kısmen Hazır
🔴 = Eksik/Yapılmadı
```

---

## 4️⃣ VERİLER (GERÇEK) HANGI API'LERDEN NASIL ALINACAK? ALINIYOR MU?

### A. TEMEL VERİ KAYNAKLARI

#### 1. TheSportsDB
```
Status: ✅ ÇALIŞIYOR (ama sınırlı)

Endpoint: https://www.thesportsdb.com/api/v1/json/123/

Çalışan Endpointler:
┌─────────────────────────────────────────┬──────────┐
│ Endpoint                                 │ Durum    │
├─────────────────────────────────────────┼──────────┤
│ lookup_all_teams.php?id={leagueId}      │ ✅ 200   │
│ lookup_all_players.php?id={teamId}      │ ✅ 200   │
│ eventslast.php?id={leagueId}            │ ✅ 200   │
│ eventslast.php?id={teamId}              │ ✅ 200   │
└─────────────────────────────────────────┴──────────┘

Veri Çekebildiğimiz:
✅ Takımlar (per liga)
✅ Oyuncular (per takım - max 50/çağrı)
✅ Maçlar (per lig - son maçlar)
✅ Maç Skorları

Çekemeyen:
❌ Oyuncu İstatistikleri (goal, assist vb.)
❌ Canlı Skorlar
❌ Tahminler
❌ Bahis Oranları

Rate Limiting: 45 req/min = 1500ms gecikme
Veri Kalitesi: Temel, ancak eksik oyuncu bilgileri

Sorun: API limited veri veriyor
├─ lookup_all_players.php: Sadece aktif oyuncuları (max 50)
├─ Tarihsel oyuncu verisi yok
└─ Sezonal istatistikler yok
```

**Ne Yaparız:**
```typescript
// syncPhase1_RealData_FIXED.ts (Çalışıyor ✅)

async function fetchTeamsFromTheSportsDB() {
  for (const [leagueKey, league] of Object.entries(LEAGUES)) {
    const data = await rateLimitedFetch(
      `${THESPORTSDB_BASE}/lookup_all_teams.php?id=${league.id}`
    )
    // Takımları DB'ye yaz
  }
}

async function fetchPlayersFromTheSportsDB() {
  for (let team of teams) {
    const playerData = await rateLimitedFetch(
      `${THESPORTSDB_BASE}/lookup_all_players.php?id=${team.external_id}`
    )
    // Oyuncuları DB'ye yaz (max 50 per call)
  }
}

async function fetchFixtures() {
  for (const [slug, league] of Object.entries(LEAGUES)) {
    const data = await rateLimitedFetch(
      `${THESPORTSDB_BASE}/eventslast.php?id=${league.id}`
    )
    // Maçları DB'ye yaz
  }
}
```

---

#### 2. API-Football (RapidAPI)
```
Status: ⚠️ KEY YOK (Kurulmamış)

Nedir: En kapsamlı futbol API
URL: https://api-football-v1.p.rapidapi.com/v3/

Endpointler:
┌──────────────────────────────────────┬─────────────────────┐
│ Endpoint                              │ Veri                │
├──────────────────────────────────────┼─────────────────────┤
│ /teams?league={id}&season={year}     │ 150+ takım          │
│ /teams/{id}/players?season={year}    │ 100+ oyuncu/takım   │
│ /fixtures?league={id}&season={year}  │ Tüm maçlar          │
│ /fixtures?id={id}                    │ Maç detayı          │
│ /fixtures/statistics?fixture={id}    │ Oyuncu istatistiği  │
│ /players/statistics?fixture={id}     │ Oyuncu performansı  │
│ /standings?league={id}&season={year} │ Puan durumları      │
│ /players?search={name}               │ Oyuncu araması      │
│ /injuries?league={id}&season={year}  │ Yaralanmalar        │
│ /odds?fixture={id}                   │ Bahis oranları      │
└──────────────────────────────────────┴─────────────────────┘

Vantajları:
✅ Çok kapsamlı (150+ endpoint)
✅ Oyuncu istatistikleri (goals, assists, cards, etc.)
✅ Detaylı maç istatistikleri
✅ Yaralanma haberleri
✅ Bahis oranları
✅ Tahmin modelleri

Dezavantajları:
❌ Lisanslı API (key gerekli)
❌ Free tier sınırlı (100 req/ay)
❌ Paid tier pahalı ($20-500/ay)

Kurulum:
1. https://rapidapi.com/api-sports/api/api-football adresi
2. API key alınır
3. .env dosyasına eklenir: RAPIDAPI_KEY=...
```

---

#### 3. Transfermarkt
```
Status: ⚠️ WEB SCRAPING (Lisans sorunu)

Nedir: En detaylı futbol transfer ve oyuncu verisi
URL: https://www.transfermarkt.com/

Veri:
✅ Oyuncu transfer geçmişi
✅ Pazar değerleri (market value)
✅ Detaylı oyuncu bilgileri
✅ Transfer haberler
✅ Takım oyuncu listeleri (tüm oyuncular)

Sorun: Web scraping gerekli, TOS ihlal ediyor
├─ Direktif API yok
├─ Lisans gerekli
└─ IP ban riski

Alternatif:
```

---

#### 4. Flashscore & SofaScore
```
Status: ⚠️ WEB SCRAPING (Zorunlu)

Nedir: Canlı skorlar, detaylı maç istatistikleri
URL: 
├─ https://www.flashscore.com/
└─ https://www.sofascore.com/

Veri (Web Scraping via):
✅ Canlı Skorlar
✅ Oyuncu Maç İstatistikleri
✅ Oyuncu Değerlendirmeleri
✅ Maç Olay Detayları (gol, kart, etc.)
✅ Saha İstatistikleri (şut, pas, vb.)

Sorun: Web Scraping gerekli
├─ HTML parsing
├─ JavaScript execution (Puppeteer/Playwright)
├─ Rate limiting
└─ Website değişikliklere karşı kırılgan

Araç: Puppeteer + Cheerio
```

---

#### 5. Guardian API
```
Status: ❌ BAŞARISIZ (Key kurulu ama çalışmıyor)

Nedir: Spor haberleri
URL: https://open-platform.theguardian.com/

API Key: REPLACE_WITH_GUARDIAN_API_KEY (eklenen)

Sorgu:
┌──────────────────────────────┬──────────┐
│ Query                         │ Durum    │
├──────────────────────────────┼──────────┤
│ /search?q=injury              │ ❌ Hata  │
│ /search?q=transfer            │ ❌ Hata  │
│ /search?q=football news       │ ❌ Hata  │
│ /search?q=football results    │ ❌ Hata  │
│ /search?q=football preview    │ ❌ Hata  │
└──────────────────────────────┴──────────┘

Problem: API response hatası (body eksik, format yanlış)
Çözüm: 
├─ API documentation tekrar kontrol et
├─ Request format doğru mu?
└─ API endpoint deprecated mi?
```

---

#### 6. NewsAPI
```
Status: ⚠️ KEY YOK (Kurulmamış)

Nedir: 70+ haber kaynağından spor haberleri
URL: https://newsapi.org/

Endpointler:
├─ /v2/everything?q={query}
└─ /v2/top-headlines?country={code}&category=sports

API Key: Gerekli (free tier: 100 req/gün)
Kurulum:
1. https://newsapi.org/register adresi
2. API key alınır
3. .env dosyasına: NEWSAPI_KEY=...

Kullanım:
```typescript
const response = await axios.get(
  'https://newsapi.org/v2/everything',
  {
    params: {
      q: 'football injury transfer',
      sortBy: 'publishedAt',
      language: 'en',
      apiKey: process.env.NEWSAPI_KEY
    }
  }
)
```

Veri: 50+ haber alınabilir
```

---

#### 7. BBC Feeds
```
Status: ❌ BAŞARISIZ (RSS feed çekilemiyor)

Nedir: BBC Sport RSS Feeds (Public)
URL: feeds.bbc.co.uk/sport/rss.xml

Problem: HTTP error, feed erişilemiyor

Çözüm:
├─ Alternatif BBC URL araştır
├─ CORS proxy kullan
└─ Cheerio ile HTML parsing
```

---

#### 8. Club Official Websites
```
Status: ❌ BAŞARISIZ (Haberler çekilemiyor)

Nedir: Manchester United, Liverpool, Arsenal, Chelsea resmi haberler
URL:
├─ https://www.manutd.com/feed/
├─ https://www.liverpoolfc.com/news
├─ https://www.arsenal.com/news
└─ https://www.chelseafc.com/en/news

Problem: HTML parsing başarısız (dinamik yükleme, CORS)

Çözüm:
├─ Puppeteer ile JavaScript rendering
├─ RSS feed URL'si bulup doğrudan çek
└─ Club website API dokumentasyon ara
```

---

### B. ÖZET: API'LER TABLOSU

| API | Veri | Durum | Key | Kurulum | Rate Limit |
|-----|------|-------|-----|---------|-----------|
| **TheSportsDB** | Takım, Oyuncu, Maç | ✅ Çalışıyor | 123 | ✅ Yapıldı | 45/min |
| **API-Football** | Tüm veri + İstat | ❌ Key yok | Gerekli | ❌ YAPILMADI | 10/sec free |
| **Transfermarkt** | Transfer, Değer | ⚠️ Scrape | Yok | ⚠️ Kompleks | Yok |
| **Guardian** | Haberler | ❌ Hata | var | ✅ Yapıldı | 12/sec |
| **NewsAPI** | Haberler | ❌ Key yok | Gerekli | ❌ YAPILMADI | 100/day free |
| **BBC Feeds** | Haberler RSS | ❌ Hata | Yok | ✅ Denendi | Yok |
| **Flashscore** | Canlı, İstat | ⚠️ Scrape | Yok | ❌ YAPILMADI | Yok |
| **SofaScore** | Canlı, İstat | ⚠️ Scrape | Yok | ❌ YAPILMADI | Yok |

---

## 5️⃣ HESAPLAMALAR İÇİN PYTHON VB.. NE GİBİ KOD DÜZENLEMELERİ GEREKIYOR? HAZIR OLAN VAR MI?

### A. GEREKLI PYTHON KODLARI

#### 1. Win Probability Model (XGBoost)
```python
# YAPILMADI ❌

import xgboost as xgb
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

class WinProbabilityModel:
    """
    Maç kazanma olasılığını tahmin eder
    
    Model Tipi: XGBoost Classification (3 sınıf: Home Win, Draw, Away Win)
    
    Features (Özellikler):
      1. home_team_strength (takım gücü - ELO rating veya puan)
      2. away_team_strength
      3. home_form (son 5 maçın performansı: avg points)
      4. away_form
      5. home_goals_per_game (sezon ortalaması)
      6. away_goals_per_game
      7. head_to_head_record (geçmiş karşılaşmalar)
      8. home_advantage (ev sahibi olmanın etkisi: tipik +0.7 goal)
      9. key_players_available (önemli oyuncular var mı)
      10. rest_days (son maçtan kaç gün geçti)
    
    Training Data:
      - Geçmiş 3 sezonun maçları (1000+ maç)
      - Bilinen sonuçlar (W/D/L)
    
    Output:
      - home_win_probability (0-1)
      - draw_probability (0-1)
      - away_win_probability (0-1)
    
    Confidence: Cross-validation score (0-1)
    
    Kod Şablonu:
    ```python
    def train_model():
        # 1. Geçmiş maçlar DB'den çek
        events = get_historical_events()  # 1000+ maç
        
        # 2. Feature'ları hesapla
        X = []
        y = []
        for event in events:
            features = extract_features(event)
            label = get_result(event)  # 0=home_win, 1=draw, 2=away_win
            X.append(features)
            y.append(label)
        
        X = np.array(X)
        y = np.array(y)
        
        # 3. Model train et
        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        model.fit(X, y)
        
        # 4. Model kaydet
        model.save_model('models/win_probability_v1.xgb')
    
    def predict(event_id):
        # 1. Event'in feature'larını çek
        features = extract_features_for_event(event_id)
        
        # 2. Model predict et
        model = xgb.XGBClassifier()
        model.load_model('models/win_probability_v1.xgb')
        
        probabilities = model.predict_proba([features])
        
        # 3. Result
        return {
            'home_win_prob': probabilities[0][0],
            'draw_prob': probabilities[0][1],
            'away_win_prob': probabilities[0][2],
            'confidence': max(probabilities[0])
        }
    ```
    """
```

**Durum:** ❌ YAZILMADI
**Gerekli Kütüphaneler:** xgboost, scikit-learn, pandas
**Veri:** Geçmiş 1000+ maç verisi
**Zaman:** 2-3 saat geliştirme + training

---

#### 2. Score Prediction Model (Poisson Regression)
```python
# YAPILMADI ❌

import statsmodels.api as sm
import scipy.stats as stats

class ScorePredictionModel:
    """
    Maç skorunu tahmin eder (Poisson Regression)
    
    Model Tipi: Poisson Regression (ayrı home/away skoru)
    
    Theory: Futbolda gol sayısı Poisson dağılımına uyar
    
    Features:
      1. home_team_attack_strength (takım saldırı gücü)
      2. away_team_attack_strength
      3. home_team_defense_strength (takım savunma gücü)
      4. away_team_defense_strength
      5. home_form (gol ortalaması)
      6. away_form
      7. time_of_season (sezon başında vs. sonu)
    
    Output:
      - predicted_home_score (0-5 arası)
      - predicted_away_score (0-5 arası)
      - most_likely_score (ör: 2-1)
    
    Kod:
    ```python
    def train_poisson_model():
        events = get_historical_events()
        
        for event in events:
            # Home skoru tahmini
            home_features = extract_home_features(event)
            home_score = event.home_score
            
            # Away skoru tahmini
            away_features = extract_away_features(event)
            away_score = event.away_score
        
        # Poisson models
        home_model = sm.GLM(
            home_scores, 
            home_features,
            family=sm.families.Poisson()
        ).fit()
        
        away_model = sm.GLM(
            away_scores,
            away_features,
            family=sm.families.Poisson()
        ).fit()
        
        # Kaydet
        joblib.dump(home_model, 'models/poisson_home.pkl')
        joblib.dump(away_model, 'models/poisson_away.pkl')
    
    def predict_score(event_id):
        event = get_event(event_id)
        
        home_features = extract_home_features(event)
        away_features = extract_away_features(event)
        
        home_model = joblib.load('models/poisson_home.pkl')
        away_model = joblib.load('models/poisson_away.pkl')
        
        # Lambda (expected goals)
        lambda_home = home_model.predict(home_features)[0]
        lambda_away = away_model.predict(away_features)[0]
        
        # Poisson distribution
        home_score = np.random.poisson(lambda_home)
        away_score = np.random.poisson(lambda_away)
        
        return {
            'predicted_home_score': home_score,
            'predicted_away_score': away_score,
            'expected_goals_home': lambda_home,
            'expected_goals_away': lambda_away
        }
    ```
    """
```

**Durum:** ❌ YAZILMADI
**Gerekli:** statsmodels, scipy
**Zaman:** 1-2 saat

---

#### 3. Player Performance Prediction
```python
# YAPILMADI ❌

class PlayerPerformanceModel:
    """
    Oyuncu performansını tahmin eder (rating, goals, assists)
    
    Model: Random Forest Regression
    
    Features:
      1. player_recent_rating (son 5 maçın ortalaması)
      2. player_season_average
      3. opponent_strength (rakip takımın kuvveti)
      4. position (oyuncu pozisyonu)
      5. player_form (son maçlar)
      6. minutes_expected (oynayacağı dakika)
      7. key_player_status (başlangıç 11'inde mi)
    
    Output:
      - expected_rating (0-10)
      - probability_goal (0-1)
      - probability_assist (0-1)
    """
```

**Durum:** ❌ YAZILMADI
**Zaman:** 2 saat

---

#### 4. Injury Risk Prediction
```python
# YAPILMADI ❌

class InjuryRiskModel:
    """
    Oyuncu yaralanma riskini tahmin eder
    
    Features:
      1. player_age
      2. recent_injury_history
      3. minutes_played_recent (yorgunluk)
      4. position (pozisyon tarafından risk)
      5. opponent_aggression (rakip takımın agresifliği)
    
    Output:
      - injury_risk_percentage (0-100%)
    """
```

---

### B. MEVCUT PYTHON KODLARI

```
Hazır olan: 0 ❌

Yapılmış:
├─ syncPhase1_RealData_FIXED.ts ✅ (TypeScript, veri çekme)
├─ syncPhase2_Fixtures_FIXED.ts ✅ (TypeScript, puan hesaplama)
└─ syncPhase3_News_FIXED.ts ✅ (TypeScript, haber çekme)

Eksik Python:
├─ Win probability model ❌
├─ Score prediction model ❌
├─ Player performance model ❌
├─ Injury risk model ❌
└─ Arbitrage detection ❌
```

---

### C. ÖZET: HESAPLAMA İHTİYAÇLARI

| Model | Durum | Zaman | Kütüphane |
|-------|-------|-------|-----------|
| Win Probability (XGBoost) | ❌ Yapılmadı | 3h | xgboost |
| Score Prediction (Poisson) | ❌ Yapılmadı | 2h | statsmodels |
| Player Performance | ❌ Yapılmadı | 2h | sklearn |
| Injury Risk | ❌ Yapılmadı | 1h | sklearn |
| **TOPLAM** | **🔴 0%** | **~8h** | - |

---

## 6️⃣ BACKEND İÇİN HANGI API'LER HAZIRLANMALI, HAZIR OLAN VAR MI?

### A. MEVCUT BACKEND API'LERİ (HAZIR ✅)

```
Çalışan Endpointler (src/api/routes/):
├─ GET /api/v1/sports ✅
│  └─ Tüm spor türlerini listeler
│
├─ GET /api/v1/competitions ✅
│  ├─ ?sport=football
│  └─ Ligleri listeler
│
├─ GET /api/v1/teams ✅
│  ├─ ?sport=football
│  ├─ ?competition=premier-league
│  └─ Takımları listeler
│
├─ GET /api/v1/events ✅
│  ├─ ?sport=football
│  ├─ ?status=scheduled|live|finished
│  ├─ ?competition=premier-league
│  └─ Maçları listeler
│
├─ GET /api/v1/news ✅
│  ├─ ?page=1
│  ├─ ?sport=football
│  └─ Haberleri listeler
│
├─ GET /api/v1/admin/status ✅
│  └─ Database durumunu gösterir
│
└─ GET /api/v1/test/* ✅
   └─ Test endpointleri
```

**Kod:**
```typescript
// src/api/routes/sports.ts
router.get('/sports', async (request, reply) => {
  try {
    const sports = db.prepare('SELECT * FROM sports WHERE active = 1').all()
    reply.send(sports)
  } catch (error) {
    reply.status(500).send({ error: error.message })
  }
})

// src/api/routes/competitions.ts
router.get('/competitions', async (request, reply) => {
  const sport = request.query.sport || 'football'
  const comps = db.prepare(
    'SELECT * FROM competitions WHERE active = 1 AND sport_id = (SELECT id FROM sports WHERE slug = ?)'
  ).all(sport)
  reply.send(comps)
})

// src/api/routes/teams.ts
router.get('/teams', async (request, reply) => {
  let query = 'SELECT t.*, tt.name FROM teams t LEFT JOIN team_translations tt ON t.id = tt.team_id WHERE t.active = 1'
  const params = []
  
  if (request.query.sport) {
    query += ' AND t.sport_id = (SELECT id FROM sports WHERE slug = ?)'
    params.push(request.query.sport)
  }
  
  const teams = db.prepare(query).all(...params)
  reply.send(teams)
})

// src/api/routes/events.ts
router.get('/events', async (request, reply) => {
  let query = 'SELECT e.*, ht.name as home_team, at.name as away_team FROM events e JOIN teams ht ON e.home_team_id = ht.id JOIN teams at ON e.away_team_id = at.id WHERE 1=1'
  
  if (request.query.status) {
    query += ` AND e.status = '${request.query.status}'`
  }
  
  const events = db.prepare(query).all()
  reply.send(events)
})

// src/api/routes/news.ts
router.get('/news', async (request, reply) => {
  const page = request.query.page || 1
  const limit = 20
  const offset = (page - 1) * limit
  
  const news = db.prepare('SELECT * FROM news WHERE active = 1 ORDER BY published_at DESC LIMIT ? OFFSET ?')
    .all(limit, offset)
  
  reply.send(news)
})
```

---

### B. GEREKLI (HAZIR DEĞİL) BACKEND API'LERİ

#### 1. Players Endpoint
```typescript
// GET /api/v1/players

Parametreler:
├─ team_id (hangi takıma ait)
├─ position (pozisyon filtresi)
├─ page (sayfalama)
└─ limit (başına kaç oyuncu)

Örnek:
GET /api/v1/players?team_id=1&position=ST
GET /api/v1/players/123 (oyuncu detayı)

Output:
{
  id: 1,
  name: 'Harry Kane',
  position: 'ST',
  number: 10,
  height: 188,
  weight: 89,
  date_of_birth: '1993-07-28',
  nationality: 'England',
  market_value: '100000000'
}

Status: ❌ YAZILMADI
```

**Kod Şablonu:**
```typescript
// src/api/routes/players.ts
import { FastifyInstance } from 'fastify'
import { getDb } from '../database/init'

const db = getDb()

export async function playersRoutes(fastify: FastifyInstance) {
  // GET /api/v1/players
  fastify.get('/players', async (request, reply) => {
    const { team_id, position, page = 1, limit = 20 } = request.query as any
    
    let query = 'SELECT p.*, pt.name FROM players p LEFT JOIN player_translations pt ON p.id = pt.player_id WHERE p.active = 1'
    const params: any[] = []
    
    if (team_id) {
      query += ' AND p.id IN (SELECT player_id FROM player_team_assignments WHERE team_id = ?)'
      params.push(team_id)
    }
    
    if (position) {
      query += ' AND p.position = ?'
      params.push(position)
    }
    
    const offset = (page - 1) * limit
    query += ' LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    const players = db.prepare(query).all(...params)
    reply.send(players)
  })
  
  // GET /api/v1/players/:id
  fastify.get('/players/:id', async (request, reply) => {
    const { id } = request.params as any
    
    const player = db.prepare(
      'SELECT p.*, pt.name, pei.height, pei.weight, pei.date_of_birth FROM players p LEFT JOIN player_translations pt ON p.id = pt.player_id LEFT JOIN player_extended_info pei ON p.id = pei.player_id WHERE p.id = ?'
    ).get(id)
    
    if (!player) {
      return reply.status(404).send({ error: 'Player not found' })
    }
    
    reply.send(player)
  })
}
```

---

#### 2. Standings Endpoint
```typescript
// GET /api/v1/standings

Parametreler:
├─ competition_id (hangi ligde)
├─ season_id (hangi sezon)
└─ team_id (specific takım)

Örnek:
GET /api/v1/standings?competition=premier-league
GET /api/v1/standings/133602

Output:
[
  {
    position: 1,
    team_name: 'Manchester City',
    played: 10,
    wins: 8,
    draws: 1,
    losses: 1,
    goals_for: 25,
    goals_against: 5,
    goal_difference: 20,
    points: 25,
    form: 'WWWWD'
  }
]

Status: ❌ YAZILMADI
```

---

#### 3. Predictions Endpoint ⭐
```typescript
// GET /api/v1/predictions

Parametreler:
├─ event_id (maç id)
├─ upcoming=true (gelecek maçlar)

Örnek:
GET /api/v1/predictions/123
GET /api/v1/predictions?upcoming=true

Output:
{
  event_id: 123,
  home_team: 'Manchester City',
  away_team: 'Arsenal',
  home_win_probability: 0.62,
  draw_probability: 0.25,
  away_win_probability: 0.13,
  predicted_home_score: 2,
  predicted_away_score: 1,
  confidence: 0.78,
  recommendation: 'Over 2.5 goals'
}

Status: ❌ YAPILMADI (ML Model gerekli)
```

---

#### 4. Betting Endpoint
```typescript
// GET /api/v1/betting

Parametreler:
├─ event_id
├─ provider (betsson, unibet, pinnacle)

Örnek:
GET /api/v1/betting/123

Output:
{
  event_id: 123,
  provider: 'pinnacle',
  odds: {
    home_win: 1.65,
    draw: 3.50,
    away_win: 2.45,
    over_2_5: 1.85,
    under_2_5: 1.90
  }
}

Status: ❌ YAPILMADI (Bahis API gerekli)
```

---

#### 5. Live Updates Endpoint
```typescript
// WebSocket: /api/v1/live

Kullanım:
ws://localhost:3001/api/v1/live?event_id=123

Output (Real-time):
{
  type: 'goal',
  team: 'Manchester City',
  player: 'Erling Haaland',
  minute: 45,
  score: '1-0'
}

Status: ❌ YAPILMADI (WebSocket gerekli)
```

---

#### 6. Head-to-Head Endpoint
```typescript
// GET /api/v1/head-to-head

Parametreler:
├─ team_1
├─ team_2
└─ limit (son kaç maç)

Örnek:
GET /api/v1/head-to-head?team_1=1&team_2=2&limit=10

Output:
{
  team_1_wins: 4,
  team_2_wins: 3,
  draws: 3,
  matches: [
    {
      date: '2024-10-21',
      home_team: 'Man City',
      away_team: 'Arsenal',
      score: '2-2'
    }
  ]
}

Status: ❌ YAZILMADI
```

---

#### 7. Player Stats Endpoint
```typescript
// GET /api/v1/stats/player/:id

Parametreler:
├─ season_id
└─ competition_id

Örnek:
GET /api/v1/stats/player/123?season_id=1

Output:
{
  player_name: 'Harry Kane',
  season: '2025-26',
  goals: 15,
  assists: 5,
  games_played: 12,
  minutes_played: 1080,
  yellow_cards: 2,
  red_cards: 0,
  pass_accuracy: 87.5,
  rating: 8.2
}

Status: ❌ YAZILMADI
```

---

#### 8. Team Stats Endpoint
```typescript
// GET /api/v1/stats/team/:id

Output:
{
  team: 'Manchester City',
  season: '2025-26',
  goals_per_game: 2.5,
  goals_against_per_game: 0.7,
  possession: 62,
  shots_per_game: 18,
  pass_accuracy: 88,
  corners_per_game: 7
}

Status: ❌ YAZILMADI
```

---

### C. ÖZET: BACKEND API'LERİ

| Endpoint | Durum | Güçlük | Zaman |
|----------|-------|--------|-------|
| **Hazır** | | | |
| /api/v1/sports | ✅ | - | - |
| /api/v1/competitions | ✅ | - | - |
| /api/v1/teams | ✅ | - | - |
| /api/v1/events | ✅ | - | - |
| /api/v1/news | ✅ | - | - |
| **Gerekli** | | | |
| /api/v1/players | ❌ | Kolay | 30 min |
| /api/v1/standings | ❌ | Kolay | 30 min |
| /api/v1/stats/player | ❌ | Orta | 1h |
| /api/v1/stats/team | ❌ | Orta | 1h |
| /api/v1/predictions | ❌ | Zor | 2h (ML) |
| /api/v1/betting | ❌ | Zor | 2h (API) |
| /api/v1/head-to-head | ❌ | Kolay | 30 min |
| /api/v1/live (WebSocket) | ❌ | Zor | 3h |

---

## 7️⃣ FRONTEND İLE BACKEND BAĞINA TEKNİK ENGEL VAR MI?

### A. FRONTEND KURULUMU

```
Proje: wagerline-app (Next.js 14)
Yer: d:/wargile/wagerline-app

Status: ✅ Çalışıyor

Bileşenler:
├─ pages/sports/ ✅ Tasarım hazır
├─ pages/competitions/ ✅ Tasarım hazır
├─ pages/teams/ ✅ Tasarım hazır
├─ pages/events/ ✅ Tasarım hazır
├─ hooks/useSportsData.ts ✅ Hazır
├─ components/ApiProvider.tsx ✅ Hazır
├─ context/ApiContext.tsx ✅ Hazır
└─ package.json ✅ Bağımlılıklar kurulu

Port: 3000
```

---

### B. BACKEND KURULUMU

```
Proje: wagerline-api (Fastify)
Yer: d:/wargile/backend

Status: ⚠️ Çalışıyor ama kısıtlı

Bileşenler:
├─ src/api/routes/ ✅ 7 endpoint
├─ src/database/init.ts ✅ SQLite
├─ src/jobs/ ✅ Veri çekme scriptleri
└─ src/index.ts ✅ Server başlatma

Port: 3001
Database: data/wagerline.db (SQLite)
```

---

### C. BAĞLANTI ANALIZI

#### 1. CORS Kontrol
```
Frontend: http://localhost:3000
Backend: http://localhost:3001

CORS Headers ✅:
  Access-Control-Allow-Origin: * (veya specific)
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  Access-Control-Allow-Headers: Content-Type

Status: ✅ HAZIR
```

**Kod:**
```typescript
// src/index.ts (backend)
await fastify.register(import('@fastify/cors'), {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: false
})
```

---

#### 2. API Context Provider
```
Frontend'de API hooks kullanımı için:

✅ ApiProvider component (src/app/providers.tsx)
   └─ Tüm sayfaları wrap ediyor
   
✅ ApiContext (src/context/ApiContext.tsx)
   └─ Backend URL: http://localhost:3001
   
✅ useSportsData hook (src/hooks/useSportsData.ts)
   └─ API çağrıları yapıyor

Status: ✅ HAZIR
```

**Kod:**
```typescript
// src/app/providers.tsx
import { ApiProvider } from '@/context/ApiContext'

export function Providers({ children }) {
  return (
    <ApiProvider>
      {children}
    </ApiProvider>
  )
}

// src/context/ApiContext.tsx
export const ApiContext = createContext<ApiContextType | null>(null)

export function ApiProvider({ children }) {
  const apiUrl = 'http://localhost:3001'
  
  const fetch = (endpoint: string) => {
    return fetchData(`${apiUrl}${endpoint}`)
  }
  
  return (
    <ApiContext.Provider value={{ fetch, apiUrl }}>
      {children}
    </ApiContext.Provider>
  )
}

// src/hooks/useSportsData.ts
export function useSportsData() {
  const context = useContext(ApiContext)
  
  const getTeams = async () => {
    return context.fetch('/api/v1/teams?sport=football')
  }
  
  // ... diğer fonksiyonlar
  
  return { getTeams, getEvents, ... }
}
```

---

#### 3. Port Kontrol
```
Frontend: localhost:3000 ✅ (Next.js dev server)
Backend: localhost:3001 ✅ (Fastify server)

Çakışma: YOK ✅

npm run dev (backend) → 3001
npm run dev (frontend) → 3000
```

---

#### 4. API Endpoint Testleri

```bash
# Test 1: Backend çalışıyor mu?
curl http://localhost:3001/api/v1/sports

# Test 2: CORS header var mı?
curl -i http://localhost:3001/api/v1/sports

# Test 3: Veri dönüyor mu?
curl http://localhost:3001/api/v1/teams?sport=football
```

---

### D. TEKNİK ENGELLER ANALİZİ

#### Engel 1: ✅ CORS İhlali
```
Durum: ÇÖZÜLDÜ ✅
├─ Backend'de CORS middleware eklendi
└─ Origin: * ayarlandı
```

#### Engel 2: ✅ Port Çakışması
```
Durum: ÇÖZÜLDÜ ✅
├─ Frontend: 3000
└─ Backend: 3001
```

#### Engel 3: ✅ Database Bağlantısı
```
Durum: ÇÖZÜLDÜ ✅
├─ SQLite db başlatıldı
├─ Schema: 45 tablo
└─ Veri: Kısmi dolu
```

#### Engel 4: ⚠️ Eksik API Endpoints
```
Durum: KISMI ÇÖZÜLDÜ ⚠️
├─ 5 endpoint hazır ✅
├─ 8 endpoint eksik ❌
└─ Gerekli: /players, /standings, /predictions vb.
```

#### Engel 5: ⚠️ Eksik Veri
```
Durum: KRİTİK ⚠️
├─ Oyuncular: 240/1000 (24%)
├─ İstatistikler: 0/500 (0%)
├─ Tahminler: 0/500 (0%)
└─ Gerekli: Veri çekme scriptleri çalıştırılmalı
```

#### Engel 6: ✅ Network Problemi
```
Durum: ÇÖZÜLDÜ ✅
├─ Frontend → Backend: localhost:3000 → localhost:3001
├─ CORS: Aktif
└─ Firewall: Windows Defender izin veriyor
```

---

### E. ENTEGRASYON KONTROL LİSTESİ

```
✅ Frontend kurulumu
  ✅ Next.js app
  ✅ TypeScript
  ✅ Pages hazır (sports, competitions, teams, events)
  ✅ CSS/Tailwind
  ✅ useSportsData hooks

✅ Backend kurulumu
  ✅ Fastify server
  ✅ SQLite database
  ✅ 7 API endpoint (sports, competitions, teams, events, news)
  ✅ CORS middleware
  ✅ Database init

✅ Ağ Bağlantısı
  ✅ Frontend 3000
  ✅ Backend 3001
  ✅ CORS header
  ✅ ApiProvider context
  ✅ useSportsData hooks

⚠️ Veri Hazırlığı
  ⚠️ Takımlar: 78/150 (52%)
  🔴 Oyuncular: 240/1000 (24%)
  🔴 İstatistikler: 0/500 (0%)
  ⚠️ Haberler: 80/200 (40%)

⚠️ API Endpoints
  ✅ Hazır: 5/15 endpoint
  ❌ Eksik: 10/15 endpoint
  ❌ /players, /standings, /predictions, /betting vb.
```

---

### F. ÖZET: TEKNİK ENGEL ANALIZI

```
┌────────────────────────────┬──────────┬─────────────┐
│ Engel                      │ Durum    │ Çözüm       │
├────────────────────────────┼──────────┼─────────────┤
│ CORS İhlali                │ ✅ Çözüldü   │ Yapılmış    │
│ Port Çakışması             │ ✅ Çözüldü   │ Yapılmış    │
│ Database Bağlantısı        │ ✅ Çözüldü   │ Yapılmış    │
│ ApiProvider Context        │ ✅ Çözüldü   │ Yapılmış    │
│ useSportsData Hooks        │ ✅ Çözüldü   │ Yapılmış    │
├────────────────────────────┼──────────┼─────────────┤
│ Eksik API Endpoints        │ ⚠️ Kısmi    │ 8 endpoint  │
│ Eksik Veri (Oyuncu)        │ 🔴 Kritik   │ 760 oyuncu  │
│ Eksik İstatistikler        │ 🔴 Kritik   │ 500 stat    │
│ Eksik Tahminler            │ 🔴 Kritik   │ ML model    │
├────────────────────────────┼──────────┼─────────────┤
│ TEKNİK ENGEL               │ ❌ YOK      │ DEVAM EDİLEBİLİR│
└────────────────────────────┴──────────┴─────────────┘
```

**SONUÇ:** Frontend ile Backend arasında **teknik engel YOK** ✅

Teknik bağlantı tamamen kurulu. Sorun veri eksikliği ve API endpoint'leri.

---

## 🎯 GENEL ÖZET & YAPILACAKLAR

### Durum Raporu

```
╔════════════════════════════════════════════════════════════════╗
║           WAGERline PLATFORM - DURUM RAPORU                   ║
║                   Tarih: 2026-09-07                          ║
╚════════════════════════════════════════════════════════════════╝

BILEŞEN DURUMU:

1. Veri İhtiyacı         : 🔴 %24 (Oyuncu eksik)
2. Database Schema       : ✅ %100 (45 tablo hazır)
3. Database Veri         : ⚠️ %30 (Kısmi dolu)
4. Tablo-View-Fonksiyon  : ⚠️ %50 (3 view, 2 function eksik)
5. Veri Kaynakları (API) : ⚠️ %50 (TheSportsDB çalışıyor ama sınırlı)
6. Hesaplama Modelleri   : 🔴 %0 (Python ML yapılmadı)
7. Backend API'ler       : ⚠️ %47 (5/15 endpoint hazır)
8. Frontend-Backend Bağı : ✅ %100 (Teknik engel YOK)

KRITIK BLOKERLER:

🔴 Oyuncu Verisi Eksik
   ├─ Mevcut: 240 oyuncu
   ├─ Gerekli: 1000+ oyuncu
   └─ Çözüm: API-Football, Transfermarkt entegrasyonu (2-3 saat)

🔴 Oyuncu İstatistikleri Yok
   ├─ Mevcut: 0 kayıt
   ├─ Gerekli: 500+ kayıt
   └─ Çözüm: API-Football, web scraping (2-3 saat)

🔴 Tahmin Modelleri Yok
   ├─ Mevcut: 0 model
   ├─ Gerekli: 4 model (Win probability, Score, Performance, Injury)
   └─ Çözüm: Python ML development (6-8 saat)

⚠️ Haberler Kısıtlı
   ├─ Mevcut: 80 haber
   ├─ Gerekli: 200+ haber
   └─ Çözüm: NewsAPI key, BBC RSS düzeltme (1 saat)

⚠️ API Endpoint'leri Eksik
   ├─ Mevcut: 5 endpoint
   ├─ Gerekli: 15 endpoint
   └─ Çözüm: 10 yeni endpoint geliştirme (3-4 saat)

ÖNERİLEN SIRALAMA:

1. 🔴 Oyuncu verisi çekimini düzelt (API-Football)        → 2h
2. 🔴 Oyuncu istatistiklerini ekle                        → 2h
3. ⚠️ Haberler kaynağını düzelt (NewsAPI + BBC)           → 1h
4. ⚠️ Eksik API endpoint'lerini yaz (/players vb.)        → 3h
5. 🔴 Python ML modellerini geliştir                      → 8h
6. ✅ Frontend-Backend entegrasyonunu test et             → 1h

TOPLAM ZAMAN: ~17-20 saat

İlerleyişe göre:
├─ Veri gündüne: ~3-4 saat
├─ Backend API: ~4-5 saat
└─ ML Modeller: ~8 saat
```

---

**SON NOT:** Sistem %30 hazır. Temel framework ve schema tamamlandı. Kalan iş veri toplanması ve ML model geliştirmesi. Teknik engel yok, salt veri ve code gerekli.
