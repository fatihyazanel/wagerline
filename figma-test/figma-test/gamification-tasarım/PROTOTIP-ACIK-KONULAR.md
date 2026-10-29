# Gamification Prototipi — Açık Konular & Karar Bekleyenler

> **Amaç:** Bu dosya, `prototype.html` üzerinde iki kaynak doküman ile yapılan
> uyum incelemesinin **henüz kapanmamış** maddelerini takip eder. İleride bu
> task'a dönüldüğünde buradan devam edilebilir.
>
> **Kaynak dokümanlar:**
> - `Detaylandırma.pptx` — 4 metrikli puanlama motoru + Meydan Okuma mekaniği (daha detaylı/güncel spec)
> - `Yetki Mimari Kural Setleri.pdf` — organizasyon, erişim/yetki matrisi, kabul kriterleri (taslak; "formül sadeleştirilebilir" izni içerir)
> - `prototype.html` — mevcut prototip
>
> **Son güncelleme:** 2026-06-18
> **Durum:** Tutarlılık düzeltmeleri yapıldı; **2 konu iş birimi kararı bekliyor.**

---

## ✅ Tamamlanan (bu turda düzeltildi)

- **Bölge sayısı 12 → 14** (`regional-overview`) — spec & Direktör ekranıyla uyumlandı.
- **Bayi sayısı tutarsızlıkları giderildi** — `dealer-region` ekranı kanonik veriye
  hizalandı (Marmara = 108, Ege = 112/7.420, İç Anadolu Güney = 96, Karadeniz = 92,
  İç Anadolu Kuzey = 78). Artık `dealer-region`, `regional-*`, `director-comparison`
  ekranları aynı bölge verisini gösteriyor. İlgili ipucu hesabı da güncellendi (230 → 530 puan).

---

## 🔴 KARAR BEKLEYEN #1 — Puanlama: 4 metrik mi, 2 metrik mi?

**Çelişki:** İki kaynak doküman birbiriyle uyuşmuyor.

| | Metrikler | Ağırlık örneği |
|---|---|---|
| **Detaylandırma (PPTX)** | HGO + Büyüme + Stratejik Ürünler + Segmentasyon (**4**) | 30 / 25 / 25 / 20 |
| **Yetki Mimari (PDF)** | Segmentasyon + Stratejik Ürünler (**2 ana başlık**) | — ("formül UX/ürün ekibince sadeleştirilebilir" notu var) |

**Prototipin mevcut durumu:** Her yerde **2 metrik** (Segmentasyon %50 + Stratejik %50).
HGO ve Büyüme **hiçbir ekranda yok** — bayi dashboard, Genel Sayfa **ve** admin ağırlık
ekranı dahil.

**İlgili prototip konumları:**
- `dealer-dashboard` → "2 ana puan başlığı" kırılımı (`prototype.html` ~satır 434-457)
- `public-overview` → KPI'lar + 2 donut (Segmentasyon / Stratejik) (~satır 680-731)
- `admin-league` → "Ana Puan Başlık Ağırlıkları" yalnız 2 slider (~satır 1168-1174)
- `admin-access` → kabul kriteri #5/#6 "4'ten 2'ye" notu (~satır 1401)

**Beklenen girdi (iş biriminden):** Nihai metrik seti ve ağırlıkları.

**Karar = 4 metrik ise yapılacaklar:**
1. `dealer-dashboard` kırılımına HGO + Büyüme ekle (4 satır + ağırlık).
2. `public-overview` KPI ve grafikleri 4 metriğe çıkar (Detaylandırma "Genel Özet" wireframe'i 4'ü gösteriyor).
3. `admin-league` ağırlık ekranını 4 slider'a çıkar; toplam %100 kontrolü.
4. Hero alanındaki metrik özetlerini (Segmentasyon/Stratejik Ürün) 4 metriğe göre güncelle.

**Karar = 2 metrik ise yapılacaklar:**
- Mevcut yapı korunur; sadece `admin-access` kabul kriteri notuna "iş birimi onayı: X tarihi" referansı eklenir. Ek geliştirme yok.

---

## 🔴 KARAR BEKLEYEN #2 — Challenge / "Meydan Okuma" mekaniği

### Sorunun özü
İki doküman burada da çelişiyor ve prototip bir tarafı seçmiş:

- **Detaylandırma (PPTX) → "Meydan Okuma" = bayi-bayi DÜELLO.**
  Kurallar:
  - Sistem **rakip bayi** önerir: *aynı lig + benzer satış adedi + benzer trend + son 1 yıl veri*.
  - Rakip önerisi **ay başında 1 kez** hesaplanır.
  - Her bayiye **ayda 1 challenge hakkı**.
  - Yalnız **dinamik metrikler**: **HGO + Stratejik Ürünler**.
  - Bayi **ayın 10'una kadar** seçim yapmazsa hakkını kaybeder.
  - **Kazanan** bayi final puanına **challenge rozet puanı** ekler.
  - PPTX wireframe'inde rakip **"Rakip ABC"** olarak (anonim takma adla) gösteriliyor.

- **Yetki Mimari (PDF) → Kabul Kriteri #4: "Bayi-bayi karşılaştırması yapılmaz."**

> ⚠️ **Gerçek gerilim:** İsimli bir rakibe karşı düello = bayi-bayi karşılaştırması →
> kriter #4 ile çakışır gibi görünür. **Ancak** PPTX rakibi zaten **anonimleştiriyor**
> ("Rakip ABC"). Yani *anonim rakibe karşı düello* büyük olasılıkla **kasıtlı tasarım**
> ve #4 ile birlikte yaşayabilir (gerçek isim/puan ifşa edilmez, sadece göreli ilerleme).

### Prototipin mevcut durumu
Challenge = **bireysel stretch hedef** (örn. "5G'de ay sonuna 30 adete ulaş"),
hedef = bölge ortalaması +%15. **Rakip bayi / düello YOK.** Tamamen anonim.
- `dealer-challenge` (~satır 594-647), `csm-challenge-manage` (~satır 886-928)

Yani prototip, çelişkiyi "anonim hedef" lehine çözmüş ama **düello konseptini düşürmüş.**

### 👉 Challenge için ALINMASI GEREKEN AKSİYON

**Adım 1 — İş birimine net soru sor (asıl karar):**
> "Challenge bireysel bir **hedef** mi olacak (mevcut prototip), yoksa **anonim bir
> rakibe karşı düello** mu (Detaylandırma)? Düello seçilirse, kriter #4 gereği rakibin
> kimliği/puanı gizli kalıp yalnızca göreli ilerleme mi gösterilecek?"

**Adım 2 — Karara göre prototip aksiyonu:**

- **A) Düello modeli seçilirse** (Detaylandırma'ya tam uyum), prototipe eklenecekler:
  1. **Anonim rakip kartı** ("Rakip ABC" gibi) — bayi challenge ekranında "vs Rakip" görünümü.
  2. **Eşleştirme mantığının** UI'da gösterimi: aynı lig + benzer hacim + benzer trend + 1 yıl veri (rakip neden bu seçildi açıklaması).
  3. **Kazanan/kaybeden** sonucu + kazanana **rozet puanı** eklenmesi.
  4. Rakip önerisinin **ay başında 1 kez** sabitlendiği notu.

- **B) Hedef modeli seçilirse** (mevcut prototip korunur):
  1. Spec'te "Meydan Okuma düellosu" maddesinin **resmen düştüğü** not edilir.
  2. Mevcut hedef-bazlı akış doğru kabul edilir.

**Adım 3 — Hangi model seçilirse seçilsin eklenecek EKSİK kurallar:**
  1. **Ayın 10'u seçim deadline'ı** + geçilirse hak kaybı. (Şu an `csm-dealers`'da
     "4 bayi henüz seçmedi" ima var ama tarih kuralı/sayaç yüzeyde yok.)
  2. **Challenge metrik kapsamı:** Detaylandırma "HGO + Stratejik Ürünler" der; prototip
     "Stratejik + Segmentasyon" sunuyor. → **Karar #1 (metrik seti) ile birlikte** netleştir.
     (HGO geri gelirse challenge tipleri de güncellenmeli.)
  3. Kazanılan challenge'ın **final puana rozet puanı** olarak eklendiğinin net gösterimi.

> **Not:** Challenge metrik kapsamı (Adım 3.2) doğrudan **Karar #1**'e bağlı. Önce metrik
> seti netleşmeli; sonra challenge tipleri ona göre hizalanmalı.

---

## 🟡 İkincil / küçük uyum notları (karar gerektirmez, opsiyonel)

- **Erişim matrisi — Admin Paneli satırı:** PDF'te Direktör/Bölge Md./CSM = ⏱ (koşullu/atanabilir),
  Bayi = ❌. Prototipte hepsi "−" gösterilip ayrı "Admin" kolonu ✓. "Admin Yetkili Kullanıcılar"
  tablosunda CSM'e admin verilmiş → matris satırıyla küçük içsel çelişki. (İstenirse o roller
  matriste ⏱ yapılabilir.) — `admin-access` ~satır 1354-1361.
- **`dealer-region` "Tüm Bölgeler" başlığı** ama 6 satır gösteriyor (14'ten). Demo kısaltması;
  istenirse başlık "Öne çıkan bölgeler" yapılabilir ya da 14 satıra tamamlanabilir.
- **Streak çarpanı:** PPTX örneği ×1.25; prototip ×1.10. Örnek değer farkı, kritik değil.

---

## ✅ Doğru & uyumlu olduğu teyit edilenler (değişiklik gerekmez)
- Organizasyon hiyerarşisi ve **"bayi CSM'e bağlı, Bölge Md.'ye doğrudan değil"** kritik kuralı.
- Anonimlik / bayi-bayi karşılaştırma yok (kriter #4) — admin'de kilitli.
- Min. ay kuralı, Include/Exclude, Audit log, 6 adımlı lig akışı.
- Rozet çarpanları, bölge bonusu top-3 (+%6 / +%3 / +%2).
- Direktör → 7 bölge × 2 direktörlük = 14.
- Sol üstteki rol değiştirici **yalnızca demo amaçlı** (production'da kullanıcı kendi rolünü görür).
