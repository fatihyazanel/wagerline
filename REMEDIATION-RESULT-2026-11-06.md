# Uygulama ve doğrulama sonucu — 6 Kasım 2026

44 maddelik iş listesi işlendi: **33 tamamlandı, 7 sağlayıcı kapsamıyla sınırlı, 4 kısmen tamamlandı.** Bütün eksiklerin giderildiği veya koşulsuz üretim kabulünün verildiği iddia edilmemektedir. Madde bazında sonuçlar ve kanıtlar [CSV iş listesinde](FIX-BACKLOG-2026-11-06.csv) ve [JSON kaydında](artifacts/fix-backlog.json) bulunmaktadır.

## Uygulanan değişiklikler

- Home özet, canlı maçlar, kişisel ilerleme ve haber bağlantılarıyla Sports ekranından ayrıldı. Menü/branş görselleri, takım logoları, maç kartları ve mobil düzen geliştirildi.
- Predictions gerçek takım logolarını kullanıyor. Boş tarih/güven filtresinin API hatası verip kartları gizlemesi düzeltildi. Model gerçek geçmiş sonuçlarla çalışan, doğrulama kapısı bulunan istatistiksel Poisson modelidir; harici AI servisi olarak sunulmaz.
- Rewards kişisel seçimler, görevler, aktivite, başarılar, ödüller ve seviyeler içeriyor. Kullanıcı hesabı, cihazlar arası oturum, misafir seçimlerini birleştirme ve tekil XP defteri eklendi. Sonuç düzeltme/iptal işlemleri XP ile uzlaştırılıyor.
- SportDB sezon sayfalaması tamamlandı; NBA/NFL ve yedi ana futbol ligi sezonları aktarıldı. NHL/MLB resmi fikstür, sonuç ve puan tabloları; ESPN kadroları ve Şampiyonlar Ligi tablosu bağlandı.
- ESPN kadro aktarımı 252 takımı kapsıyor. Ana futbol ligleri ve NBA/NFL/NHL/MLB kadro boşlukları kapatıldı. F1'in 11 takım logosu resmi Formula1 sayfalarından alınıp yerel olarak saklandı.
- Tenis SportScore ve ESPN akışlarından besleniyor; F1 yarışları ve sıralamaları Jolpi kaynağından geliyor. Bireysel yarış/seçim modeli ve sayfalama eklendi.
- Canlı yenileme, kaynak bazında detay durumu, haber arama/sayfalama, kayıtlı maçlar ve kişisel seçim geçmişi düzeltildi. Eksik sağlayıcı verisi uydurulmuş skor/istatistik ile doldurulmadı.
- Operasyon API'leri yetkilendirildi; kalıcı iş kuyruğu, tekrar deneme, yeniden başlatma kurtarması ve sağlayıcı sağlık kontrolleri eklendi. Admin'de yedi veri kümesi aranabilir ve sayfalı gösteriliyor.
- Kanonik takım/maç eşleştirmeleri, sorgu indeksleri, SQL sayfalama ve istek zaman aşımı korumaları eklendi. Rastgele sonuç üreten eski aktarım yolları engellendi.

## Veri durumu

6 Kasım son denetim anındaki sayılar; arka plan yenilemeleri nedeniyle değişebilir:

| Kapsam | Sonuç |
|---|---|
| Takımlar | 480 toplam, 427 aktif |
| Oyuncular | 11.583 |
| Takım maçları | 8.559 ham kayıt; alias kayıtları çıkarılınca 8.532 |
| F1 | 23 yarış: 19 bitmiş, 4 planlanmış; 24 sürücü ve 11 takım sıralaması |
| Tenis | Alias hariç 268 karşılaşma: 227 bitmiş, 8 canlı, 31 planlanmış, 2 iptal |
| Haberler | Bütünlük denetiminde 237; düzenli yenileniyor |
| DB bütünlüğü | quick_check=ok, yabancı anahtar ihlali yok |
| Skoru eksik bitmiş takım maçı | 0 |

F1 ve tenis `individual_contests`/`individual_standings` tablolarını kullanır. Eski takım-maç tablosundaki sıfır sayıları bu branşların boş olduğu anlamına gelmez. Ayrı denetim: [bireysel sporlar](artifacts/individual-data-audit.json). Eski kullanılmayan tablolardaki sıfır satırlar da tek başına çalışan bir modülde veri eksikliği kanıtı değildir.

## Doğrulama kanıtları

- Frontend üretim derlemesi ve backend TypeScript derlemesi başarılı.
- [37 modül kontrolü](artifacts/module-acceptance-latest.json): maçın 7 sekmesi, branş seçicileri, lig sekmeleri, tahmin penceresi, Rewards sekmeleri ve 13 admin bölümü.
- [32 erişilebilirlik/düzen senaryosu](artifacts/accessibility-latest.json): 8 sayfa; masaüstü EN, mobil EN, mobil AR, masaüstü ES. Taranan ekranlarda otomatik WCAG A/AA ihlali, yatay taşma veya JavaScript hatası yok. Tam manuel erişilebilirlik sertifikası değildir.
- [API kabul matrisi](artifacts/acceptance-matrix.json): 12 lig, tablo tutarlılığı, sayfalama, geçersiz girdiler, bireysel sporlar, olasılık toplamları ve 30 eşzamanlı istek.
- [UI kabulü](artifacts/ui-acceptance.json): klavye sekme geçişleri, filtre/sayfalama ve 503 sonrası tekrar deneme.
- [Dayanıklılık](artifacts/resilience-latest.json): izole DB kopyasında sonuç/XP düzeltmeleri, iptal, hesap/oturum, yeniden başlatma, iş kurtarma ve boş DB migration.
- Kişisel seçim, bireysel seçim, operasyon kuyruğu, admin kayıtları ve smoke testleri geçti. [API uç durumları](artifacts/api-edge-audit.json) güncellendi.
- [Frontend](artifacts/frontend-dependency-audit.json) ve [backend](artifacts/backend-dependency-audit.json) bağımlılık denetimlerinde bildirilen açık sayısı 0.

## Açık kalan işler ve somut kapanış koşulları

| Maddeler | Kalan iş / kapanış koşulu |
|---|---|
| D07 | 51 SportScore maçında kaynak sezon bilgisi yok. Doğrulanmış sezon kimliği geldiğinde eşlenmeli. |
| D11, D12 | Bütün tarihsel/alt seviye tenis ve futbol katalogları kaynaklarca kapsanmıyor. SportDB sezon aktarımı Süper Lig için 305, La Liga için 379 maç verdi; diğer kaynaklarla birleşen toplam farklı olabilir. Sağlayıcıda bulunmayan maç üretilmedi. |
| D16 | Bir SportScore takımının kimliği/adı belirsiz; doğru logo için doğrulanmış takım eşleştirmesi gerekli. |
| D17 | Ana ligler dışındaki 151 futbol takımında kadro yok. Takım bazında kaynak kapsamı/eşleştirme çalışması gerekiyor; liste `artifacts/remaining-football-rosters.json`. |
| D18 | Diziliş, oyuncu performansı, olay akışı ve oranlar her maç için kaynaklarda mevcut değil. Kaynak tarafından yayınlanmayan alanlarda boş durum gösteriliyor. |
| D42 | API-Sports yapılandırılmamış. Kullanılması için geçerli abonelik/anahtar gerekli. SportDB, SportScore, backend TheSportsDB, ESPN, NHL, MLB ve Jolpi kontrol edilmiş durumda. Kök eski TheSportsDB tanımı geçersiz; çalışan backend tanımı kullanılıyor. Kota bilgisi sağlayıcıdan alınmıyorsa bilinmiyor olarak gösteriliyor. |
| D33 | Temel limit/id/tarih doğrulamaları ve hata düzeltmeleri yapıldı; eski uçların tüm enum/id sözleşmeleri ortak şemaya taşınmalı ve kapsamlı olumsuz giriş matrisi tamamlanmalı. |
| D37 | Ana EN/ES/AR metinleri, RTL ve UTC tarih sunumu düzeltildi. İkincil dinamik/admin metinlerinin tam çeviri denetimi tamamlanmalı. |
| D43 | Yerel kurtarma ve eşzamanlı istek testleri geçti. Hedef staging/üretim ortamında servis gözetimi ve uzun süreli kesinti/yük testi henüz yapılmadı. |
| D44 | Yukarıdaki yazılım ve kabul açıkları kapatılıp kaynak sınırları ürün kapsamına işlendiğinde tam kabul tekrarlanmalı. |

## Çalıştırma

Site: http://localhost:3000 — Backend: http://localhost:3101/api/v1/health

Mevcut oturumda her iki servis çalışır durumda bırakıldı. 3001 portundaki diğer uygulamaya dokunulmadı. Yeniden başlatmak için ayrı terminallerde:

```powershell
cd D:\wargile\backend
npm.cmd run build
node dist/index.js
```

```powershell
cd D:\wargile\wagerline-app
npm.cmd run build
npm.cmd run start
```

API ve yönetici anahtarları backend `.env` dosyasında tutulur; raporlara kopyalanmaz. Hesap şifre kurtarma/e-posta akışı mevcut kapsamda uygulanmadı.
