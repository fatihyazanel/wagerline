# WAGERline Figma Tasarım Analizi

## Genel Tasarım Özellikleri
- **Tema**: Dark mode (karanlık)
- **Ana Renk**: Sarı/Altın (#F4D900) - Aksent rengisi
- **Arka Plan**: Çok koyu siyah/gri
- **Tipografi**: Modern, Sans-serif
- **İkonlar**: Lucide icons
- **Layout**: Responsive grid sistemi

---

## 8 Sayfa Detaylı Analiz

### 1. **LIVE SAYFASI**
**Konumu**: Figma tasarımında sol üst
- **Header**: WAGERline logo + 8 navigation item
- **Layout**: 2 kolonlu
  - **Sol Kolon**: Canlı maçlar listesi (12 maç)
    - Her maç: Liga badge | Takımlar vs Takımlar | Skor (sarı) | Dakika
    - Seçili maç: Vurgulu arka plan + sarı sol border
  - **Sağ Kolon**: Seçili maçın detayları
    - Takım adları büyük
    - Skor (çok büyük, sarı)
    - Canlı göstergesi (yeşil nokta + LIVE)
    - İstatistikler: Possession (%) + Şut + Hedefi bulmuş şut
    - Progress bar görselleştirmesi

- **Alt Bölüm**: 
  - Upcoming matches listesi
  - Top Scorers tablosu (Rank, Player, Team, Goals)

---

### 2. **SPORTS SAYFASI**
**Konumu**: Figma tasarımında üst ortada
- **Hero Section**: 
  - Gradient arka plan (futbol sahası görseli veya gradient)
  - Büyük başlık
  - Alt başlık/açıklama
- **Sport Categories**: 5 kart (Football, Basketball, American Football, Ice Hockey, Formula 1)
  - Her kartın ikonu
  - Takım sayısı veya bilgi
- **Popular Competitions**: 4 veya 5 sütunlu grid
  - 12+ kompetisyon kartı
  - Logo/Badge + Isim + Bilgi
- **Trending Teams**: Up/Down göstergeleriyle takımlar
- **Top Players**: Tablo formatında

---

### 3. **LEAGUES SAYFASI**
**Konumu**: Figma tasarımında üst sağ
- **Main Table**: 
  - Tüm major ligler (Premier League, La Liga, Serie A, vb.)
  - Sütunlar: Liga Adı | Ülke | Takım Sayısı | Maç Sayısı | Status
  - Satır hover efekti
  - Seçili satır vurgulanması
- **Sağ Sidebar**:
  - Premier League preview
  - Top 3 scorers mini tablosu
  - "View League" butonu

---

### 4. **PREDICTIONS SAYFASI**
**Konumu**: Figma tasarımında sağ ortada
- **KPI Cards** (4 kart, üst kısım):
  - Accuracy: 86%
  - Total Predictions: 1,248
  - Win Rate: 68%
  - ROI: +24.5%
  - Her kartın ikon + büyük sayı + küçük etiketi

- **Prediction Cards** (2 kart):
  - Maç bilgisi
  - 3 olasılık barı: Home / Draw / Away (yüzde + renklendirme)
  - AI Confidence badge
  - Prediction strength göstergesi

- **How It Works** Bölümü:
  - 3 kart (Data Analysis, AI Prediction, Smart Insights)
  - Her kartın adımı ve ikonu

---

### 5. **STATS SAYFASI**
**Konumu**: Figma tasarımında sağ alt
- **KPI Cards** (4 kart):
  - Matches: 128
  - Goals Today: 356
  - Avg Goals/Match: 2.78
  - Clean Sheets: 42

- **Top 5 Players Tablosu**:
  - Sütunlar: Rank | Player | Team | Goals | Assists | Rating
  - Renklendirmeler

- **Charts Bölümü** (3 sütun):
  - Goals Trend: Bar chart (zaman serisesi)
  - Shots on Target: Horizontal bar chart
  - Possession: Yüzde listesi

---

### 6. **NEWS SAYFASI**
**Konumu**: Figma tasarımında sol ortada
- **Featured Article** (2 sütun):
  - Büyük görsel placeholder (gradient veya resim)
  - Başlık + Açıklama
  - Tarih/Yazar bilgisi
  - "Read More" butonu

- **Headlines Sidebar** (3 item):
  - Başlık + Tarih + Kategori

- **News Grid** (3 sütun):
  - 6 haber kartı
  - Görsel placeholder
  - Başlık
  - Özet
  - Tarih

---

### 7. **REWARDS SAYFASI**
**Konumu**: Figma tasarımında sol alt
- **Profile Card**:
  - Level: 7
  - Title: "Elite Fan"
  - Stats grid: Badges | Points | Rank
  - XP Progress bar

- **Daily Tasks**:
  - Task adı + XP değeri
  - Tamamlanmış/Tamamlanmamış checkbox
  - Check mark göstergesi

- **Badges Grid** (5 kart):
  - Badge image/icon
  - Isim
  - Açıklama

- **2 Sütunlu Bölüm**:
  - **Leaderboard**: Top 5 kullanıcı + "You" vurgusu + rank
  - **Active Challenges**: 3 challenge + progress bar

---

### 8. **ADMIN SAYFASI**
**Konumu**: Figma tasarımında sağ alt (yan yana)
- **Sidebar**: 
  - 11 menu item (Dashboard, Users, Events, Analytics, vb.)
  - İkonlarla
  - Seçili item vurgusu

- **Main Content**:
  - "Admin Dashboard" başlık

- **KPI Cards** (4 kart):
  - Total Users
  - Active Users
  - Total Events
  - Predictions Made

- **Analytics Section** (3 sütun):
  - Users Overview: Bar chart (alternating colors)
  - Events by Sport: 5 kategori + yüzde
  - System Health: 4 service + yeşil status dot

- **Recent Activity**: 
  - Timeline formatında 5+ item
  - Zaman damgası
  - Aktivite tipi ve açıklaması

---

## Renk Paleti
- **Arka Plan Birincil**: `#05080D`
- **Arka Plan İkincil**: `#0B1119` (kartlar)
- **Accent (Sarı)**: `#F4D900`
- **Başarı (Yeşil)**: `#32D583`
- **Uyarı (Kırmızı)**: `#FF4D5A`
- **Bilgi (Mavi)**: `#4DA3FF`
- **Metin Birincil**: `rgba(255, 255, 255, 0.95)`
- **Metin İkincil**: `rgba(255, 255, 255, 0.70)`
- **Metin Tertiyel**: `rgba(255, 255, 255, 0.45)`
- **Border**: `rgba(255, 255, 255, 0.06)`

---

## Layout Gridleri
- **Live Sayfası**: 60% left (matches) / 40% right (details)
- **Leagues**: 1.5fr / 1fr (table / sidebar)
- **Sports**: 4-5 sütun grid
- **News**: 3 sütun grid
- **Stats**: 3 sütun (charts)
- **Rewards**: 2 sütun (leaderboard / challenges)
- **Admin**: Sidebar (140px) + Main (1fr)

---

## Başlıca Özellikler
✅ Interactive page navigation (8 sayfa, 8 buton)
✅ Selected state indicators (active page altında sarı bar)
✅ Hover efektleri (kartlar, butonlar)
✅ Icon kullanımı (Lucide)
✅ Mock data arrays (maçlar, oyuncular, ligler, haberler)
✅ Dark theme consistently applied
✅ Professional data visualization
✅ Responsive layout structure
