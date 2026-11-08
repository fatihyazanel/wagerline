# Sayfa, modül ve API denetimi — düzeltme çalışma planı

Tarih: 6 Kasım 2026. Bu belge önceki DATA-API-ANALYSIS-2026-11-06.md analizini genişletir. Ürün kodu bu turda düzeltilmedi; inceleme araçları, kanıtlar ve uygulanabilir iş listesi hazırlandı. Mevcut özellikler kaldırılmadan düzeltilmelidir.

## Gerçekte ne kontrol edildi?

- Önceki tur: 8 aktif route × masaüstü/mobil; temel API, DB bütünlüğü, spor/veri kapsamı ve dış sağlayıcı erişimi.
- Bu tur: sayfa içindeki 41 etkileşim gözlemi: 7 maç detayı sekmesi, sayfalama ve spor filtreleri, lig sekmeleri/kadro/deep link, tahmin modalı ve confidence filtresi, haber arama/kaynak/load more/modal, 5 Rewards sekmesi, 12 Admin bölümü ve simüle 503 sonrası retry.
- Aktif backend girişinin kaydettiği 63 HTTP route tanımı çıkarıldı. 55 GET route için örnek istek yapıldı. 52 tanesi 200; 3 tanesi sorgusuz arama, yanlış lige ait takım ve bitmiş maçı live isteme nedeniyle beklenen 400/404 döndü. Geçerli arama ve doğru standings takım id'si ayrıca 200 doğrulandı.
- 6 yazma route'u bu turda çalıştırılmadı; kodları incelendi. Kişisel profil/tahmin/claim için önceki izole testler vardır; bunlar bu turun yeni test sonucu olarak sayılmadı. providers/sync ve live/broadcast başka kullanıcıya etkisi olabilecek yazma çağrısı yapmadan incelendi.
- Provider test route'u kod incelemesiyle değerlendirildi; parametreyi dikkate almaması bulundu. SSE ilk mesajı önceki smoke ile doğrulandı; bağlantı koparma/yük testi bu turda yapılmadı.
- Ek sınır testleri: 2 geçersiz parametre gerçekten HTTP 500 üretiyor; /jobs 404; haber total alanı yanlış.
- İlk modül taramasındaki 6 saniyelik test navigasyon süresi Leagues sayfasında aşıldı. Test aracı navigasyon süresi 30 saniye yapılarak tekrarlandı ve 41 gözlem tamamlandı. Bu gözlem tek başına ürünün navigasyon SLA'sını geçtiğini kanıtlamaz; gecikme/yük testi D39/D43'te.

Bütün olası veri, cihaz, bağlantı kesintisi ve kullanıcı kombinasyonlarının test edildiği iddia edilmiyor. Aşağıdaki envanterde kod bulguları, gerçek çalışma gözlemleri ve henüz yapılacak doğrulamalar ayrılmıştır. 'Observed' sekmenin açıldığını belirtir; içeriğin eksiksiz olduğunu belirtmez.

## Sayfa ve modül matrisi

| Sayfa / modül | Kontrol ve bulgu | İlgili işler |
|---|---|---|
| Ortak ana menü, spor ikonları, lig şeridi, footer | İkon/yükleme ve route bağlantıları önceki testte geçti. Lig şeridindeki Champions League hedefi yanlış içerik açıyor. Footer marka yazısında ortak renk kuralı beyaz zeminde kontrast açısından tekrar incelenmeli; yeni hata olarak doğrulanmadı. | D23,D38,D44 |
| Ortak dil / tarih | EN/ES/AR seçeneği var; çoğu yeni modül metni İngilizce sabit. DB UTC logu 13:27 iken aynı oturum kontrol zamanı 16:27 görünüyor. | D37 |
| Home karşılama / hızlı bağlantılar | Sayfa Sports'tan ayrı ve API özetleri çalışıyor. Navigation testleri geçti. | D44 |
| Home canlı / yaklaşan / sonuç kartları | Gerçek DB kayıtları; yaklaşan kart tahmin modalına gider. Canlı/sonuç kartı belirli maçı seçtirmiyor. | D22,D32 |
| Home haber / kişisel kulüp | Veri gerçek. Haber tıklaması belirli haberi açmıyor; açık Home'da kişisel ilerleme periyodik tazelenmiyor. | D30-D32 |
| Sports filtre / liste / pagination | Next 2. sayfayı açtı. NBA/NFL/F1/tenis gelecek maçları boş. Saved filtresi mevcut sayfayı süzüyor. | D08-D13,D24 |
| Sports/Live canlı yenileme | Live route liste polling yapıyor; Sports Live sekmesi yapmıyor. Seçili aynı maçın detail isteği yeniden tetiklenmiyor. | D22 |
| Maç Overview / form | Gerçek form satırları açıldı. Bazı API'lerin eski sezon ve alias hesapları tutarsız. | D15,D21,D34 |
| Maç Timeline | İncelenen yaklaşan maçta boş durum doğru açıldı; genel DB olay kapsamı 1 maç. | D18,D19 |
| Maç Statistics | Yaklaşan maçta provider sıfır değerleri gösteriliyor; henüz oynanmayan veriyle gerçek 0 ayrımı eksik. | D20 |
| Maç Lineups / Performers | Sekmeler açılıyor ama genel veri kapsamı çok düşük/boş. | D17,D18 |
| Maç H2H | Örnek maçta boş; sorgu güncel maçı/aliası dışlamıyor. | D21 |
| Maç Odds | Gerçek bookmaker oranı görüldü; Created At/Updated At gibi DB alanları kullanıcıya basılıyor. | D18,D41 |
| Leagues spor / lig seçimi | Champions League query paramıyla sayfa Premier League başlığı açtı. F1/tenis liste kaynağı boş. | D10-D14,D23 |
| Leagues Standings | Premier League 20 satır açıldı; diğer spor tabloları boş. Eski standings API'si ayrı veri kaynağı. | D14,D15 |
| Leagues Fixtures / Teams | Premier League 199 maç ve 20 takım gözlendi; tüm sezona tek DOM listesi. Live filtresi yalnız exact live; halftime/period_break dışarıda kalabilir. | D22,D39 |
| Leagues Squad spotlight | Takım değişimi çalıştı; seçilen takımda kadro yok. Sezonlu tam kadro doğrulanmalı. | D17 |
| Predictions filtre / kart / modal | Modal açılıyor, 3 seçenek var, Escape kapatıyor. Confidence 80 filtre sonucu sıfır; model verisi yok. | D26,D27 |
| Predictions Your predictions | Kod yalnız gelecekte scheduled maçları getiriyor; eski seçimler listeye dönmüyor. Detay deep link'i ve alias davranışları tutarlı değil. | D25,D34 |
| Predictions submit | Önceki izole kayıt testi geçti. Bu tur yeni seçim gönderilmedi; timeout/busy/kickoff geçişleri kabul paketinde tekrar koşulacak. | D27,D28,D40 |
| News arama / spor-lig-kaynak | Arama boş durumu ve Guardian filtresi çalıştı. Filtreler yalnız indirilen ilk 200 makaleyi süzüyor; değişimde gösterim adedi sıfırlanmıyor. | D31 |
| News featured / load more / modal | Kart sayısı 12→24; modal dış kaynak linki ve Escape çalıştı. Her haberin dış linki tek tek ziyaret edilmedi. | D30-D32 |
| News hata / retry | Tarayıcıda yalnız haber isteğine 503 enjekte edildi; hata ve Try again gösterildi; engel kalkınca haber geri geldi. | D40,D44 |
| Rewards profil / favori takım | Önceki izole journey testi geçti; bu tur kaynak kodu incelendi. Anonim çerezli profil, cihazlar arası giriş değil. | D29 |
| Rewards Challenges / Achievements / Rewards | Üç sekme de aynı 3 görev kartını açıyor. Dijital görevler var; ayrı bir fiziksel/para ödülü teslim sistemi yok ve mevcut kapsamda varsayılmamalı. | D28,D29 |
| Rewards Activity / Levels / claim | Yeni profilde boş activity ve 4 level doğru gösterildi. Sonuç düzeltme/iptal/ödül ledger doğrulaması eksik. Share API/clipboard ve claim yazımı bu tur çalıştırılmadı. | D28,D29,D44 |
| Admin Dashboard / Users / Sports / Leagues / Matches / Predictions / News / Rewards | 8 bölüm açıldı; çoğu sayı+link. Predictions sayısı model tablosundan; kişisel tahminlerle aynı kavram değil. | D35,D36 |
| Admin Data Sources / API Health / System / Settings | 4 bölüm açıldı. Health, quota, source ve log zamanları daha doğru ve kapsamlı olmalı. Yetkilendirme görülmedi. | D02-D06,D35-D37 |

## API envanteri ve yeni doğrulanmış hatalar

Tam liste: artifacts/registered-api-inventory.json. Dosya method, path, kaynak dosya, örnek istek durumu ve test kapsamını içerir. Kayıtlı olmayan eski route dosyaları çalışan API olarak sayılmadı.

| API ailesi | İnceleme sonucu |
|---|---|
| workspace | Catalog/list/detail/coverage/rewards okundu. Kesirli limit 500; iki takımlı model F1/tenis için yetersiz; H2H ve freshness eksikleri. |
| sports / competitions / teams / players | Temel GET'ler erişiliyor. Kapsam/roster/season eksikleri var; boş veri ile doğru sözleşme ayrılmalı. |
| predictions / personal | Model ve kullanıcı seçimi ayrı. Personal yazma kodu incelendi; branş sonuç kuralları ve historical picks geliştirmesi gerekli. |
| events / standings / stats / head-to-head | Yeni workspace uçlarıyla tek kanonik katman paylaşmıyor. Stats'ta varsayılan season_id=1; standings formunda ev/deplasman yönü, H2H paydasında gelecek maçlar gibi anlamsal hatalar var. |
| news | Arama uçları çalışıyor; total gerçek toplam değil. Team slug doğrudan başlık LIKE aramasına giriyor; isim/alias eşleşmesi gerekir. Trending sadece en yeni 10 haber; popülerlik ölçümü değil, etiketi buna uygun olmalı. |
| providers / health / integrations / admin | Sağlayıcı test parametresi dikkate alınmıyor; sahte queued yanıtı; durumu/kotayı birleştirme ve rol kontrolü gerekli. |
| live / SSE / broadcast | DB snapshot erişiyor; SSE temel kontrol geçti. Broadcast internal denmiş ama yetki kontrolü yok. Bağlantı kopması/reconnect/load doğrulanmalı. |
| /test ve /api/health | Tanılama uçları kayıtlı. Üretimde DB şema/sistem bilgisinin kamuya açık olması ayrıca sınırlandırılmalı. |

Somut tekrarlama örnekleri:

- GET /api/v1/workspace/matches?limit=1.5 → 500. Beklenen: kontrollü 400 veya açık integer normalizasyonu.
- GET /api/v1/head-to-head?team_1=1&team_2=2&limit=invalid → 500. Beklenen: 400.
- GET /api/v1/news?limit=1 → meta.total=1; limit=200 → meta.total=195. Toplam kayıt sayısı limitten bağımsız olmalı.
- GET /api/v1/jobs → 404; providers/sync yanıtı bu adrese yönlendiriyor. POST çağrılmadı; sahte queued durumu koddan doğrulandı.
- /leagues?league=uefa-champions-league → URL aynı kalırken Premier League başlığı. Tarayıcıda doğrulandı.

## Uygulanacak çalışma

44 iş kalemi hazır: 2 P0, 35 P1, 7 P2. Her işin kanıtı, bağımlılığı, düzeltmesi ve kabul ölçütü FIX-BACKLOG-2026-11-06.csv içindedir. P0 veri güvenilirliği/yayın öncesi erişim engelleri; P1 mevcut kapsamın güvenilir çalışması; P2 kalite ve kullanım tamamlama işleridir. Hepsi bu planın kapsamında; P2 iptal anlamına gelmez.

| Aşama | İşler | Sorumluluk | Çıktı / geçiş koşulu |
|---|---|---|---|
| 1 — Güvenilir temel | D01-D05,D33,D42 | Backend / entegrasyon | Sentetik sync yolu kapalı; doğrulanmış provider matrisi; gerçek job; API girdi hataları 500 değil; rol sınırı |
| 2 — Kanonik veri ve otomasyon | D06,D07,D13,D15,D34 | Backend / veri | Tek kaynak ve kimlik eşlemesi; sezon/durum uzlaştırması; kalıcı ve tekrarlanabilir sync |
| 3 — Branş ve alan kapsamı | D08-D12,D14,D16-D18 | Entegrasyon + frontend | NBA/NFL/F1/tenis ve eksik futbol ligleri; gerçek tablolar, kadrolar, logolar ve yayımlanmış detaylar |
| 4 — Sayfa/modül doğruluğu | D19-D25,D30-D32,D37-D41 | Frontend + backend | Doğru deep link, polling, history, server arama/pagination, timeout, dil ve veri sunumu |
| 5 — Tahmin/kişisel ilerleme ve yönetim | D26-D29,D35,D36 | Backend + frontend | Model/kişisel seçim ayrımı; branş settlement; tutarlı XP; gerçek operasyon görünürlüğü |
| 6 — Kabul ve yayın dayanıklılığı | D43,D44 | Test / işletim | Uçtan uca, kesinti, tekrar başlatma, yük ve geri yükleme kanıtları |

Aşama içindeki işler CSV'deki bağımlılık sırasına göre yürütülür; bu tablo bütün aşamanın tek seferde bitmesini zorunlu kılan şelale planı değildir. D01/D02/D33 için ilk düzeltme paketi mevcut özellikleri değiştirmeden hazırlanabilir. Sağlayıcı kapsamı doğrulanmadan yeni ücretli abonelik alınmaz veya 'yeni API şart' denmez.

## Tamamlandı sayma ölçütleri

1. 7 sporun her birinde provider/lig/sezon/kayıt kaynağı tanımlı; mevcut ve gelecekteki fikstürler sağlayıcıyla karşılaştırılmış.
2. Menülerde görünür her bölüm: gerçek içerik, henüz yayımlanmadı, sağlayıcı desteklemiyor, güncelleme hatası veya boş sonuç durumlarından doğru olanını gösterir. Uydurma veri kullanılmaz.
3. Mevcut filtre, detay, kayıt, tahmin, ödül ve yönetim işlevleri korunur; liste/detay/DB aynı kimlik ve sonucu kullanır.
4. Her düzeltme kendi kabul testini geçer. Kişisel kayıt/claim testleri izole profillerde koşar; gerçek kullanıcı kayıtlarına dokunmaz.
5. Desktop/mobile ve klavye erişimi; provider timeout/429/5xx; SSE kopma; kickoff; postponed/cancelled; sonuç düzeltme; alias; boş sezon ve pagination sınırları test edilir.
6. Import yeniden çalıştırıldığında duplicate veya çift XP üretmez; restart sonrası iş ve profil kalır; DB geri yükleme doğrulanır.
7. Açık provider sınırları ve doğrulanmamış senaryolar açıkça raporlanır. Sadece HTTP 200 veya güzel ekranla 'bütün sistem tamamlandı' kararı verilmez.

## Henüz çalıştırılmayan doğrulamalar

Her yazma isteğinin yeni negatif testleri; tüm 7 sporda tüm statü kombinasyonları; sıfırdan yeni sezon ve provider şema değişimi; API kotası tükenmesi; uzun bağlantı kopması; çok kullanıcı yükü; server restart; backup restore; gerçek hesap birleşimi; tüm haber dış linkleri; her resmin tüm ekranlarda erişimi; ekran okuyucu ve tam RTL taraması. Bunlar D43/D44 kabul paketidir; mevcut testlerle geçmiş sayılmamıştır.

## Kanıt ve teslim dosyaları

- FIX-BACKLOG-2026-11-06.csv — 44 iş, öncelik, düzeltme, kabul, bağımlılık, kanıt; Excel'de açılabilir.
- artifacts/fix-backlog.json — makine okunur aynı iş listesi.
- artifacts/module-interaction-audit.json — 41 modül etkileşim gözlemi.
- artifacts/registered-api-inventory.json — 63 kayıtlı HTTP route tanımı ve örnek kontrol durumu.
- artifacts/api-edge-audit.json — doğrulanmış API sınır/girdi hataları.
- DATA-API-ANALYSIS-2026-11-06.md ve bağlı JSON raporları — önceki veri tamlığı ve sağlayıcı bağlantısı kanıtları.
