# 🚀 CANLI PLATFORM - GERÇEK VERİ ÇEKME

**Status:** ✅ HAZIR  
**Tarih:** 2026-09-06  
**Durum:** Production Ready

---

## 📋 SCRIPT'LER HAZIRLANMIŞ

### ✅ Phase 1: Takımlar & Oyuncular
```
Dosya: syncPhase1_RealData.ts
Kaynak: TheSportsDB API
İçerik:
  - 150+ takım (7 lig)
  - 1000+ oyuncu
  - Team-Player assignments
Süre: ~60 dakika (rate limited)
Çalıştır: npx ts-node src/jobs/syncPhase1_RealData.ts
```

### ✅ Phase 2: Maçlar & İstatistikler
```
Dosya: syncPhase2_Fixtures.ts
Kaynak: TheSportsDB API
İçerik:
  - 500+ maç (fikstür)
  - Skorlar
  - Puan durumları
  - Oyuncu istatistikleri
Süre: ~45 dakika
Çalıştır: npx ts-node src/jobs/syncPhase2_Fixtures.ts
```

### ✅ Phase 3: Haberler & Ext. Veriler
```
Dosya: syncNews_RealTime.ts
Kaynaklar:
  - Guardian API (configured ✅)
  - NewsAPI (needs key)
  - BBC Feeds (free ✅)
İçerik:
  - Yaralanma haberleri
  - Transfer haberleri
  - Takım haberleri
Süre: ~10 dakika
Çalıştır: npx ts-node src/jobs/syncNews_RealTime.ts
```

### ✅ Phase 4: Canlı Güncelleme (Opsiyonel)
```
Dosya: syncLive_RealTime.ts
Kaynak: TheSportsDB + API-Football
İçerik:
  - Live score updates
  - Match events
  - Real-time stats
Aralık: Her 30-60 saniye
Çalıştır: npx ts-node src/jobs/syncLive_RealTime.ts
```

### ✅ Master Runner
```
Dosya: runAllPhases.ts
Yapar: Phase 1-3'ü sırayla çalıştır
Toplam Süre: ~120 dakika
Çalıştır: npx ts-node src/jobs/runAllPhases.ts
```

---

## 🚀 HIZLI BAŞLAMA

### SEÇENEK 1: Hepsi Bir Komutla (Önerilen)
```bash
cd d:/wargile/backend
npx ts-node src/jobs/runAllPhases.ts
# Tüm fazları sırayla çalıştır
# Toplam: ~120 dakika
```

### SEÇENEK 2: Ayrı Ayrı Çalıştır (Kontrol için)
```bash
# Phase 1: Takımlar & Oyuncular (60 dakika)
npx ts-node src/jobs/syncPhase1_RealData.ts

# Phase 2: Maçlar & İstatistikler (45 dakika)
npx ts-node src/jobs/syncPhase2_Fixtures.ts

# Phase 3: Haberler (10 dakika)
npx ts-node src/jobs/syncNews_RealTime.ts
```

### SEÇENEK 3: Sadece Belirli Phase
```bash
# Sadece Phase 1
npx ts-node src/jobs/syncPhase1_RealData.ts

# Sadece Phase 2
npx ts-node src/jobs/syncPhase2_Fixtures.ts

# Tekrar çalıştırılabilir (DUPLICATE PREVENTION var)
```

---

## 📊 NE OLACAK

### Başarıyla Tamamlandıktan Sonra:

```
DATABASE DURUMU:
✅ 150+ Takım
   - İsimler
   - Logolar
   - Ülkeler
   - Stadyumlar
   
✅ 1000+ Oyuncu
   - İsimler
   - Pozisyonlar
   - Boy/Kilo
   - Doğum tarihi
   - Takım atamaları
   
✅ 500+ Maç
   - Ev sahibi/Konuk
   - Tarihler
   - Skorlar
   - Durumlar
   
✅ Puan Durumları
   - Tüm 7 lig
   - Oynanmış/Galibiyet/Beraberlik/Mağlubiyet
   - Puanlar
   
✅ İstatistikler
   - Oyuncu stats (sezon)
   - Takım stats (sezon)
   
✅ Haberler & Ext.
   - Yaralanma raporları
   - Transfer haberleri
   - Takım haberleri (Guardian)
```

---

## ⚙️ KONFİGÜRASYON

### Mevcut API Anahtarları
```env
# .env dosyasında
THESPORTSDB_KEY=123 ✅ (Built-in)
GUARDIAN_API_KEY=REPLACE_WITH_GUARDIAN_API_KEY ✅ (Configured)
```

### Opsiyonel (İstersek Ekleyelim)
```env
# RapidAPI (API-Football)
RAPIDAPI_KEY=xxx
# Burada al: https://rapidapi.com/api-sports/api/api-football

# NewsAPI
NEWSAPI_KEY=xxx
# Burada al: https://newsapi.org/
```

---

## 🔄 OTOMATIK ÇALIŞTIRMA (Opsiyonel)

### Scheduled Jobs Kurulu
```typescript
// src/index.ts'de (when ready)
- Phase 1: İlk çalıştırma (1x)
- Phase 2: İlk çalıştırma (1x)
- Phase 3: Daily (her gün)
- Phase 4: Live polling (canlı maçlar sırasında)
- Phase 5: Weekly (haftalık bakım)
```

### Etkinleştirmek İçin
```bash
npm install node-cron
# src/index.ts'de Phase 3-5'i aktif et
```

---

## ✅ DOĞRULAMA

Script'ler çalıştıktan sonra kontrol:
```bash
cd d:/wargile/backend

# DB boyutu kontrol et
ls -lh data/wagerline.db

# Veri sayısını kontrol et
sqlite3 data/wagerline.db "
SELECT 'Teams' as entity, COUNT(*) FROM teams
UNION ALL
SELECT 'Players', COUNT(*) FROM players
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Standings', COUNT(*) FROM standings
UNION ALL
SELECT 'Player Stats', COUNT(*) FROM player_season_stats
"

# Sample veri kontrol et
sqlite3 data/wagerline.db "
SELECT t.id, tt.name, COUNT(p.id) as player_count
FROM teams t
LEFT JOIN team_translations tt ON t.id = tt.team_id AND tt.language = 'en'
LEFT JOIN player_team_assignments pta ON t.id = pta.team_id
LEFT JOIN players p ON pta.player_id = p.id
GROUP BY t.id
LIMIT 10
"
```

---

## 📈 BEKLENEN SONUÇLAR

| Metrik | Hedef | Zaman |
|--------|-------|-------|
| Takımlar | 100+ | 60 min |
| Oyuncular | 1000+ | 60 min |
| Maçlar | 500+ | 45 min |
| Puan Kayıtları | 100+ | auto |
| Oyuncu Stats | 1000+ | auto |

**Toplam Süre: ~120 dakika (Rate Limited)**

---

## 🎯 DURUMA GÖRE

### Kısa Sürede Başlamak İstiyorsam
```bash
# Sadece Phase 1 çalıştır (60 dakika)
npx ts-node src/jobs/syncPhase1_RealData.ts
# Sonra frontend test edebilirsin
```

### Tam Sistem İstiyorsam
```bash
# Hepsi çalıştır
npx ts-node src/jobs/runAllPhases.ts
# ~120 dakika sonra tamamlanır
```

### Tekrar Çalıştırmak İstiyorsam
```bash
# Duplicate prevention var
# Tekrar çalıştırabilirsin, ekstra veri eklenmez
npx ts-node src/jobs/syncPhase1_RealData.ts
```

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Rate Limiting**: TheSportsDB 45 req/min → otomatik delay var
2. **Network**: Stabil bağlantı gerekli (120 dakika)
3. **İlk Çalıştırma**: Uzun sürer, ama sadece 1x gerekli
4. **Tekrarlama Güvenli**: Duplicate prevention ile güvenli
5. **Live Polling**: Opsiyonel, isterse sonra etkinleştir

---

## 🚀 BAŞLAMAK İÇİN

```bash
# Terminal'de:
cd d:/wargile/backend

# SEÇENEK A: Hepsi bir komutla
npx ts-node src/jobs/runAllPhases.ts

# VEYA

# SEÇENEK B: Phase'ler birer birer
npx ts-node src/jobs/syncPhase1_RealData.ts
npx ts-node src/jobs/syncPhase2_Fixtures.ts
npx ts-node src/jobs/syncNews_RealTime.ts
```

**Bitti mi? Tamamlandı mı? 🎉**

---

## 📞 KONTROL

Script'ler çalıştıktan sonra:
1. Console'da ✅ mesajları gör
2. DB boyutunu kontrol et (100+ MB olmalı)
3. Veri sayısını verify et
4. Frontend'i test et

**HAZIR! 🚀**
