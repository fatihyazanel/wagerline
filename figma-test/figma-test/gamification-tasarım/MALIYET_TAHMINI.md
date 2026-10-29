# Gamification Platformu — Maliyet & Efor Tahmini (Adam/Gün)

> **Son güncelleme:** 2026-06-18
> **Tahmin türü:** Aşağıdan-yukarı (bottom-up), 3-nokta. Bu bir **efor tahminidir, taahhüt değildir.**
> **İlgili dosya:** Açık kararlar (metrik seti, challenge mekaniği) → `PROTOTIP-ACIK-KONULAR.md`.
> Bu kararlar maliyeti doğrudan etkiler (aşağıda "Karar bağımlı kalemler").

---

## 1. Kapsam sınırı (kim neyi yapıyor)

**DWH ekibi yapıyor (bu tahmine DAHİL DEĞİL):**
- Puanlama motoru (metrik hesapları, ağırlıklar, final puan)
- Lig hesaplama akışı (atama, finalizasyon)
- Bölge bonusu hesabı
- ETL / dış kaynaklardan veri toplama
- → Çıktıyı **hesaplanmış veri** olarak teslim eder (Postgres tablo/view ya da API).

**Bu geliştirici (tek kişi) yapıyor — tahmin bunu kapsar:**
- DWH çıktısını tüketen **read-model + API serving** katmanı
- Auth + **RBAC / yetki matrisi** (veri-seviyesi kapsam, dealer_code/name maskeleme)
- İş akışları: **challenge** (oluştur/onay/öneri/takip/deadline), yönetici notu, admin config
- **Audit log**, **bildirim servisi** (BE tetikleyiciler)
- **Tüm Frontend** (prototipteki 19 ekran, 5 rol)
- **Firebase push**, test, DevOps/deployment, stabilizasyon

## 2. Genel varsayımlar
- **Tek developer**, işler **seri** (paralelleştirme yok) → takvim ≈ toplam adam/gün.
- **AI-assisted geliştirme** (Claude / Codex). Mekanik işlerde (FE bileşen, prototip→React, CRUD, boilerplate, test, migration) güçlü hızlanma; iş mantığı/RBAC/entegrasyon/debug/koordinasyonda sınırlı. **Blended ~%30 azalma** uygulandı (kalem bazında değişken).
- **Prototip mevcut** (`prototype.html`) → FE görsel tasarım büyük ölçüde hazır; "statik HTML → React + API'ye bağlama" olarak ele alındı.
- DWH veriyi **zamanında ve temiz kontratla** teslim ediyor (≈ takvim riski, aşağıya bkz).
- Teknoloji: React (Vite) + FastAPI + Postgres (app DB) + Firebase (push).

---

## 3. Tam kapsam tahmini (özet)

| | Klasik | **AI-assisted** |
|---|--:|--:|
| Geliştirme ara toplam | ~197 | ~137 |
| + DWH koordinasyonu + analiz (~%10) | ~20 | ~14 |
| + Risk tamponu (~%12) | ~26 | ~18 |
| **GENEL TOPLAM** | **≈ 245 a/g** | **≈ 170 a/g** |

- **AI-assisted aralık:** ~140 (iyimser) – ~210 (temkinli), gerçekçi **≈ 170 a/g**.
- **Takvim (tek dev, seri):** ~170 ÷ ~20 efektif işgünü/ay ≈ **~8,5 ay** (aralık ~7–10 ay).

### Tam kapsam — AI-assisted kalem kırılımı
| Kalem | a/g |
|---|--:|
| **Backend** | |
| Kurulum, repo, CI/CD, Docker | 4 |
| Veri modeli + API sözleşmesi + DWH veri kontratı | 6,5 |
| Auth + RBAC / yetki matrisi (veri-seviyesi kapsam, masking) | 9,5 |
| DWH çıktısı tüketim + read-model + skor/lig/bonus serving | 12,5 |
| Rozet (progress serving + admin kural CRUD) | 3,5 |
| Challenge iş akışı (oluştur/onay/öneri/takip/deadline) | 9 |
| Audit log | 2,5 |
| Bildirim servisi (BE tetikleyiciler) | 4 |
| API serving layer (tüm ekran endpoint, pagination, filtre, DTO) | 6,5 |
| **Frontend** | |
| FE altyapı (design system, routing, rol-bazlı nav, state, grafik lib) | 7,5 |
| Bayi ekranları (5) | 8 |
| CSM ekranları (5) | 8 |
| Bölge Md. ekranları (3-4) | 4,5 |
| Direktör ekranları (2-3) | 4 |
| Admin ekranları (6) | 10 |
| Genel Sayfa + ortak (hiyerarşi, bildirim merkezi) | 4 |
| **Teslim** | |
| Firebase push (FCM, token, FE handling) | 5,5 |
| Test (unit / integration / e2e) | 14 |
| DevOps / deploy / monitoring | 5,5 |
| Stabilizasyon / bugfix / UAT | 8 |
| **Geliştirme ara toplam** | **~137** |

---

## 4. Fazlama — 5 aylık hedef için

5 ay ≈ **~100-105 adam/gün**. Tam kapsam (~170) buna sığmaz; bu yüzden **MVP / Faz-1** kapsamı tanımlandı.

### FAZ 1 — MVP (≈ 105 a/g ≈ ~5 ay) ✅ 5 ay hedefi
**Roller:** Bayi + CSM + Admin (temel). **Challenge:** basit/hedef-bazlı (düellosuz). **Push:** minimal.

| Kalem | a/g |
|---|--:|
| **Backend** | |
| Kurulum, repo, CI/CD, Docker | 4 |
| Veri modeli + API sözleşmesi + DWH kontratı | 6 |
| Auth + RBAC (2-3 rol, temel) | 6 |
| DWH tüketim + read-model + serving (bayi/csm/admin core) | 8 |
| Rozet serving (admin editör hariç) | 2 |
| Challenge iş akışı (temel, düellosuz) | 6 |
| Audit log (temel) | 2 |
| Bildirim servisi (minimal, 2 tetikleyici) | 2,5 |
| API serving layer (Faz-1 ekranları) | 4,5 |
| **Frontend** | |
| FE altyapı (design system, routing, rol-bazlı nav, state, grafik lib) | 7 |
| Bayi ekranları (5) | 7,5 |
| CSM ekranları (5) | 7,5 |
| Admin (temel: komuta merkezi, erişim matrisi, audit, temel lig ayarı) | 5 |
| Genel Sayfa + ortak (hiyerarşi, bildirim merkezi) | 3,5 |
| **Teslim** | |
| Firebase push (minimal tetikleyici) | 3 |
| Test (MVP seviyesi) | 7 |
| DevOps / deploy / monitoring | 5 |
| Stabilizasyon / UAT | 5 |
| **Geliştirme ara toplam** | **~88** |
| + DWH koordinasyon + analiz (~%9) | ~8 |
| + Risk tamponu (~%9) | ~9 |
| **FAZ 1 TOPLAM** | **≈ 105 a/g (~5 ay)** |

> ⚠️ 5 ay **sıkı** bir hedef. Tamponu fazla inceltmemek için kapsam disiplini şart;
> herhangi bir ekleme (rol, düello, 4-metrik) Faz-1'i şişirir.

### FAZ 2 — Kalan kapsam (≈ 50-70 a/g ≈ ~2,5-3,5 ay)
| Kalem | a/g |
|---|--:|
| Bölge Md. ekranları + serving | ~7,5 |
| Direktör ekranları + serving | ~6,5 |
| Admin gelişmiş (rozet kural editörü, bölge bonusu config, gelişmiş audit) | ~6 |
| Push gelişmiş tetikleyiciler + bildirim merkezi zenginleştirme | ~3 |
| Genişletilmiş test / e2e | ~6 |
| **Karar bağımlı (opsiyonel):** Challenge düello mekaniği | ~9 |
| **Karar bağımlı (opsiyonel):** 4-metrik geçişi (dashboard/genel/admin) | ~8 |
| + Koordinasyon + buffer | ~6 |

---

## 5. Karar bağımlı kalemler (maliyeti oynatır)
> Bunlar `PROTOTIP-ACIK-KONULAR.md`'deki iş birimi kararlarına bağlı:
- **Metrik seti 2 → 4:** dashboard + genel sayfa + admin ekranlarında **+~8 a/g**.
- **Challenge düello (anonim rakip):** eşleştirme + sonuç + UI **+~9 a/g**.
- İkisi de Faz-1'e alınırsa MVP ~105 → ~122 a/g (~6 ay) olur; bu yüzden **Faz-2'de** konumlandırıldı.

## 6. Takvim riskleri ⚠️
1. **DWH bağımlılığı senin kontrolünde değil.** Veri zamanında/temiz kontratla gelmezse serving + FE işinde yeniden-iş riski. Kontrat netleşmeden derin serving/FE'ye başlama.
2. **AI çarpanı bir varsayım** (~%30). Domain mantığı/RBAC/entegrasyon debug'ı az kısılır. Çarpan iyimser çıkarsa süre uzar.
3. **Tek dev = tek nokta riski** (izin/hastalık/context-switch) → tampon gerçekten harcanabilir.
4. **Kapsam kayması** 5 ay hedefinin en büyük düşmanı.

## 7. Özet
| Senaryo | Adam/gün | Takvim (tek dev) |
|---|--:|---|
| Tam kapsam — Klasik | ~245 | ~12 ay |
| Tam kapsam — AI-assisted | **~170** | **~8,5 ay** |
| **Faz 1 / MVP — AI-assisted** | **~105** | **~5 ay** ✅ |
| Faz 1 + Faz 2 (fazlı tam kapsam) | ~155-175 | ~8-9 ay |
