# API ve veri tamlığı analizi — 6 Kasım 2026

Denetim zamanı: yaklaşık 16:09–16:14 Türkiye saati. Çalışan frontend (3000), backend (3001), SQLite veritabanı ve gerçek dış servis yanıtları incelendi. Bu çalışma analizdir; toplu veri aktarımı veya ürün işlevi değişikliği yapılmadı. Sayfa okumaları mevcut uygulama davranışı gereği anonim profil oluşturabilir ve istek üzerine maç detay önbelleğini yenileyebilir.

## Sonuç

Sistem sayfaları açılıyor ve temel API zinciri çalışıyor; ancak tüm sporları kapsayan, eksiksiz ve sürekli güncel bir ürün seviyesinde DEĞİL. HTTP 200, veri bütünlüğü ve veri tamlığı ayrı ölçütlerdir. Önceki başarılı derleme ve ekran testleri yalnızca teknik çalışabilirliği gösterir; tüm liglerin ve alanların dolu olduğunu göstermez.

## Doğrulanan çalışan noktalar

- 8 sayfa, 1440 ve 390 piksel genişlikte incelendi: gözlenen API yanıt hatası, JavaScript çalışma hatası, yatay sayfa taşması ve görünür alanda kırık resim yok. Bu kontrol bütün listelerdeki bütün resimlerin doğrulandığı anlamına gelmez.
- 20 temel API ucu HTTP 200 döndü. Ek maç/coverage kontrolleri ve SSE ilk mesaj kontrolü geçti.
- SQLite quick_check=ok; foreign_key_check=0 ihlal.
- 5.861 ham etkinlik, 413 takım, 4.073 oyuncu, 195 haber mevcut. 25 alias dışarıda bırakıldığında 5.836 kanonik etkinlik var. Sayılar çalışan senkronizasyonla değişebilir.
- SportScore son gözlemde 50 kayıt aldı, 50 içeri aktardı, 0 atladı; 120 saniye aralıkla çalışıyor.
- NHL/MLB yenileyicisi son gözlemde 48 kayıt güncelledi, hata bildirmedi; 60 saniye aralıkla çalışıyor.

## Gerçek dış API erişimi

| Sağlayıcı | Denetim sonucu | Sınır / anlamı |
|---|---|---|
| SportScore | HTTP 200, matches dizisi doğrulandı | Çalışan akış yalnızca futbol. Kod 200 talep ederken gözlenen yanıt 50 maç; tüm lig/tarih kapsamı kanıtlanmış değil. |
| SportDB | HTTP 200, futbol keşif cevabı doğrulandı | 7 futbol ligi içe aktarılmış; sezon aktarımı manuel. Tüm maç detaylarının tamamlandığı anlamına gelmez. |
| TheSportsDB backend anahtarı | HTTP 200 | Backend tanımı geçerli. Root .env içindeki ayrı anahtar HTTP 400 döndü. |
| NHL | HTTP 200, standings şeması doğrulandı | Servise erişim var; lig ekranındaki standings bağlantısı yine de boş. |
| MLB | HTTP 200, sports şeması doğrulandı | Temel erişim doğrulandı; her alt endpointin kapsamı bu testle kanıtlanmaz. |
| Jolpi / Formula 1 | HTTP 200, MRData doğrulandı | Dış servis erişilebilir; uygulamada F1 yarışları yok. |
| ESPN | HTTP 403 | Mevcut ortamda erişim reddediliyor. |
| API-Sports / API-Football | Çalışan yapılandırmada not-configured | Kullanılabilir bir entegrasyon olarak kabul edilemez. |

Anahtarların kendileri rapora alınmadı. online-check.cjs TheSportsDB için public 123 kullanır; backend anahtarı ayrı probe-configured-providers.cjs ile ayrıca doğrulandı. Buradaki başarılı katalog testleri sağlayıcının bütün veri setleri için abonelik/yetki kanıtı değildir.

## Spor bazında gerçek kapsam

Aşağıdaki etkinlik sayıları ham DB satırlarıdır; alias satırları içerebilir. Gelecek maç sayıları denetim anına göredir. Veri olmaması ile sezon dışı dönem farklıdır.

| Spor | Etkinlik | Gelecek maç | Bulgular |
|---|---:|---:|---|
| Futbol | 1.541 | 821 | 7 ana lig için sağlayıcı puan tablosu var. Champions League 0 maç. Diğer liglerde kapsam parçalı. |
| Basketbol | 15 | 0 | NBA kayıtlarının son güncellemesi 14 Eylül. 15 maçın başlangıcı geçmiş ama durumu scheduled. Lig görünümünde 23 takım ve 0 puan durumu satırı. |
| Amerikan futbolu | 15 | 0 | NFL son güncellemesi 14 Eylül; ligde 28 takım, puan durumu yok. |
| Buz hokeyi | 1.409 | 1.083 | NHL maç yenilemesi çalışıyor. Güncel ligde 32 takım, 31'inde oyuncu kaydı var. Lig API'sinde puan durumu 0. |
| Formula 1 | 0 | 0 | DB'de takım/oyuncu kayıtları olsa da yarış yok; lig görünümü sezon/takım/yarış üretmiyor. |
| Beyzbol | 2.881 | 0 | MLB geçmiş maçları var. 1 eski scheduled kayıt var. Gelecek maç olmaması tek başına arıza kanıtı değildir; sezon takvimiyle doğrulanmalı. Puan durumu boş. |
| Tenis | 0 | 0 | Oyuncu ve etkinlik yok; menü mevcut ama veri akışı tamamlanmamış. |

F1 ve tenis yalnızca mevcut home_team/away_team kartlarıyla tamamlanamaz. Yarış, sürücü, sıralama ve bireysel oyuncu karşılaşması verilerinin backend sözleşmesi ve ekran sunumu gerekir. workspace sorgusu iki takım JOIN ettiği için bu modeller mevcut listeye doğal olarak giremiyor.

## Veri kalitesi ve eksik alanlar

- 390 aktif takımın 39'unda logo URL'si yok (%10). URL olması resmin her zaman erişilebilir olduğunu garanti etmez. Kontrol edilen yerel takım/lig logo yollarında eksik dosya yok; 36 logo kaydı hâlâ uzaktan yükleniyor.
- 390 aktif takımın 191'inde aktif oyuncu kaydı yok (yaklaşık %49). Oyuncu bulunan takımın tam kadrosu olduğu da ayrıca doğrulanmalı.
- Premier League: 20 takımın sadece 10'unda oyuncu var, toplam 94 oyuncu. Süper Lig: 18 takımda 206 oyuncu; takım başına kayıt bulunması tam kadro kanıtı değil.
- Kanonik etkinliklerde 51 season_id eksik; finished durumundaki 3 maçta bir veya iki skor eksik.
- İstatistikler: 366 satır fakat sadece 14 maç.
- Dizilişler: 16 satır fakat sadece 8 maç.
- Olay akışı: 19 satır fakat sadece 1 maç.
- Oranlar: 6 maç.
- Oyuncu maç performansı: 0 kayıt.
- Model predictions ve prediction_factors: 0 kayıt. Kullanıcının kişisel tahmin kaydetmesi ayrı bir işlevdir ve model çıktısı değildir. Confidence filtreleri bu nedenle sonuç vermeyebilir.
- Haberler: BBC 88, Guardian 107. Resim URL'si boş haber yok. En yeni haber 06:36 UTC; incelenen backend başlangıcında zamanlanmış haber yenilemesi yok.
- Eski users/user_xp/badges tablolarının boş olması Rewards'un hiç çalışmadığı anlamına gelmez: çalışan sayfa personal_profiles/personal_picks/personal_challenges/personal_claims ve levels kullanıyor.

## Sayfa bazında durum

| Sayfa | Kaynak | Değerlendirme |
|---|---|---|
| Home | workspace/matches, news, personal | Gerçek API özetleri. Kaynakların eksikliği özetlere yansır. Sadece live önizlemesi periyodik yenileniyor. |
| Live | workspace/matches, maç detay ucu | Teknik bağlantı ve SSE çalışıyor. Denetim anında DB'de canlı maç yoktu. Bu, dünyada canlı maç olmadığına veya bütün sağlayıcıların kapsandığına kanıt değildir. |
| Sports | workspace/catalog, workspace/matches | Liste/filtreler çalışıyor; NBA/NFL/F1/tenis kapsamı yetersiz. |
| Leagues | competitions/:slug/overview | 7 futbol liginde sağlayıcı tabloları; NBA/NFL/NHL/MLB tabloları boş. F1, tenis ve Champions League boş. |
| Predictions | predictions + personal | Kişisel seçim akışı mevcut; AI/model olasılıkları yok. Tüm sporlara tek 1-X-2 seçimi uygulanıyor; branşa özgü sonuç/beraberlik kuralları tanımlanmalı. |
| News | news | DB içeriği var; sürekli güncelleme işi eksik. |
| Rewards | personal | Tarayıcı çereziyle gerçek kişisel kayıt. Cihazlar arası giriş yok. Sonuç/XP doğruluğu maç sonucunun zamanında güncellenmesine bağlı. |
| Admin | coverage, health, sync-logs | Sayılar var; health=ok DB erişimini ölçüyor, tüm sağlayıcıların tam/güncel olduğunu ölçmüyor. |

## Kod ve işletim bulguları

1. Sürekli yenileme sınırlı: src/index.ts yalnızca futbol SportScore ve NHL/MLB yenileyicilerini başlatıyor. SportDB sezon/puan durumu, haber, kadro ve görsel güncellemeleri için bu girişte otomatik iş yok. Harici işletim sistemi görevleri bu incelemenin kapsamında doğrulanmadı.
2. NHL/MLB yenileyicisi mevcut provider-mapped etkinliği güncelliyor; eşleşmeyen yeni etkinlikte erken dönüyor. Yeni sezon/gün fikstürlerinin oluşturulması için ayrıca idempotent import gerekir.
3. SportDB detay isteği 3 ardışık dış çağrı yapıyor, her biri 8 saniye timeout. Frontend toplam 15 saniyede kesiyor. Yavaş sağlayıcı durumunda timeout riski var; bu denetimde somut timeout görülmedi. 20 saniyelik global gate ve 1 saat cache bazı istekleri detay yenilemeden geçiriyor; geri dönüşte bu durum açıkça belirtilmiyor.
4. Backend health içindeki theSportsDb='configured' sabit yazılmış. Sağlayıcı erişim durumu ile yapılandırma ayrımı eksik. Kota göstergesi API-Football yöneticisine ait; SportDB/SportScore için birleşik doğrulanmış kota ölçümü değil.
5. Futbol dışı puan tablosu boş dönerken standings_source hâlâ 'Calculated from recorded results' yazıyor; bu kaynak etiketi yanıltıcı.
6. Eski sentetik veri kodları var. Özellikle package.json içindeki npm run sync, src/jobs/syncData.ts dosyasını çalıştırıyor; 269/273. satırlarda rastgele skor üretiliyor. Çalışan server'ın otomatik akışında bu iş görülmedi; ancak manuel sync komutu hâlâ riskli. Başka eski jobs/services dosyalarında da mock veri üretimi mevcut. Bunların bulunması mevcut DB'nin tamamının sahte olduğunu kanıtlamaz; eski kayıtlar için kaynak doğrulaması gerekir.
7. Aktif route bileşenleri gerçek API hook'larını kullanıyor. Repodaki eski Dashboard/pages bileşenleri ve statik maç JSON'u aktif route ağacında kullanılmıyor. Menü metinleri, ikon eşlemeleri ve başarı kuralları gibi ürün sabitleri ile uydurma maç verileri birbirinden ayrılmalı.
8. Admin/API operasyon uçlarında kimlik/rol kontrolü görülmedi. Genel internete açılacak sürümde yetkilendirme gerektirir. Sadece yerel tarayıcı çalışması, yayın ortamı/TLS/yeniden başlama/yedek geri dönüş testinin yerine geçmez.

## Tamamlama sırası ve kabul ölçütleri

1. Veri güvenilirliği: rastgele veri üreten import yollarını devreden çıkar; sağlayıcı kimliği, kaynak, fetched_at ve alias ilişkilerini denetle. 16 eski scheduled ve 3 eksik skoru gerçek sağlayıcı sonuçlarıyla uzlaştır; silerek veya tahmin ederek doldurma.
2. Eksik spor kapsamı: NBA/NFL güncel sezon fikstür ve sonuçları; F1 yarış/sürücü sonuçları; tenis oyuncu/turnuva maçları; Champions League. Her biri için gerçek sağlayıcı endpointi, erişim hakkı ve sayfa sözleşmesi doğrulansın.
3. Alan tamlığı: branşa uygun resmi puan durumları, doğrulanmış kadrolar, eksik logolar, yayımlanmış lineup/istatistik/olay/oranlar. Sağlayıcı henüz yayımlamadığında alan 'bekleniyor'; desteklemediğinde 'sağlanmıyor' olmalı.
4. Otomasyon: kalıcı iş kuyruğu/zamanlayıcı, kontrollü tekrar deneme, provider bazında kota, başarısız iş kaydı, son başarılı veri zamanı ve bayatlık uyarısı. Mevcut kaydı güncellemek yanında yeni kayıt yaratma da kapsansın.
5. Tahmin ve Rewards: model kullanılacaksa doğrulanmış gerçek model entegrasyonu ve sürümlü çıktılar; kullanıcı tahmini ile model çıktısı ayrı. Spor bazlı sonuçlandırma ve kişisel XP tutarlılığı doğrulansın.
6. Uçtan uca kabul: her spor için dolu liste + doğru lig tablosu + geçerli detay + kullanıcı seçim/sonuç/ödül yolculuğu; dış API yavaşlığı/kesintisi ve server yeniden başlama sonrası kalıcılık. İlk ziyaretin HTTP 200 olması tek kabul ölçütü olmasın.

'Her veri alanı her an dolu' gerçek sağlayıcıların henüz yayımlamadığı bilgiler için mümkün değildir. Hedef, kapsamı tanımlı tüm branşlarda gerçek verinin zamanında gelmesi ve yayımlanmayan/desteklenmeyen/eskimiş alanların açıkça ayrılmasıdır. Bu ayrım yapılmadan 'tüm veriler tamamlandı' denmemeli.

## Kanıt dosyaları

- artifacts/database-audit.json
- artifacts/data-completeness-audit.json
- artifacts/api-audit.json
- artifacts/online-audit.json
- artifacts/league-data-audit.json
- artifacts/full-page-data-audit.json

Tekrar çalıştırma: backend/scripts/audit-completeness.cjs, audit-league-data.cjs, audit.cjs, smoke.cjs; wagerline-app/scripts/audit-page-data.cjs. Dış API kontrolleri kotayı tüketebilir. Kimlik bilgileri raporlara yazılmamıştır.
