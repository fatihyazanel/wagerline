# Canlı veri, DB güncelliği ve indeks denetimi — 7 Kasım 2026

## Uygulanan düzeltmeler

- Futbol sağlayıcısında gerçek HTTP 503 kesintileri, saatlerce güncellenmeyen canlı kayıtlar ve eşzamanlı SQLite kilit hataları tespit edildi.
- ESPN skor/fikstür aktarımı 14 lig için eklendi. Desteklenen tarih sorgusuyla dün/bugün/yarın ayrı okunur. İlk başarılı çalışmada 139 kaynak kaydı alındı, 116 doğrulanmış maç işlendi, 23 kayıt eşleşme/uygunluk kontrolünden geçmediği için atlandı. Belirsiz takımlar otomatik birleştirilmez.
- Canlı yenilemeler uzun kadro/arşiv işlerinden ayrıldı. Official, ESPN skorları, ESPN tenis, SportScore futbol ve tenis ayrı çalışır. Başarısız denemeler, son başarı ve sonraki deneme DB'de tutulur. Çakışma engeli ve en fazla beş dakikaya çıkan hata beklemesi vardır.
- SQLite BUSY/LOCKED hatasında yalnız başarısız SQL ifadesi sınırlı tekrar denenir; diğer hatalar gizlenmez. Eski bir live/scheduled yanıtının onaylanmış final sonucu geri almasına karşı koruma eklendi.
- Canlı API HTTP önbelleğine alınmaz. Takım canlı ekranı 15 saniyede, bireysel ekran 30 saniyede DB'yi okur; sağlayıcı yenileme süresi ayrıca geçerlidir. Sunucu maç/etkinlik referans okumaları 30 saniye önbellek kullanır.
- Beş dakikayı aşan son canlı kayıt güncellemesi `delayed` olarak işaretlenir. Skor silinmez, maçın bittiği varsayılmaz. `/tags/live` eski teyitsiz kayıtları çıkarır. Her API yanıtının saati, maçın kaynak güncelleme saati yerine sunulmaz.
- Live ekranında tenis/F1 seçimi artık Live sekmesiyle açılır. Mobil tenis ekranında bulunan kontrast sorunu giderildi.
- ESPN kadrosunda zaten bulunan biyografi ve istatistikler aktarılmıyordu. Kaynak/sezon bilgisiyle kaydetme ve üç dilde oyuncu profillerinde gösterme eklendi. 280 takımda 9.906 oyuncu/kadro girdisi işlendi; aktarım hatası 0. Tekilleştirme sonrası 9.904 kaynak/sezon snapshot'ı bulunuyor.
- 3.627 oyuncuda 4.249 normalize futbol sezon istatistik satırı var; önceki denetimde bu tablo boştu. 10.246 aktif oyuncuda biyografi alanı mevcut. Kaynakta gözlenen sıfır korunur; eksik asist/dakika NULL kalır. Diğer sporların ölçümleri kaynak başlıklarıyla gösterilir, basketbol verisi futbol golü gibi yorumlanmaz.
- Katılımcı adı yerine Wqf1/Wqf2 benzeri yer tutucu bulunan tenis kayıtları noindex ve sitemap dışıdır; bunlar Person yapılandırılmış verisi olarak sunulmaz.

## Yeni araçlar

- `http://localhost:3000/about/status`: otomatik yenilenen kaynak/branş kapsamı, geciken canlı kayıtlar ve son başarılı aktarım ekranı. Operasyon ekranı noindex'tir.
- `GET /api/v1/data-health`: DB tazeliği, canlı gecikmeleri, saati geçmiş fikstürler, arka plan işleri ve sağlayıcı durumu. Gizli anahtar içermez.
- Backend: `node scripts/check-data-health.cjs` → `artifacts/live-data-health.json`; uyarı varsa başarısız çıkış koduyla izleme sistemine bağlanabilir.
- Backend: `node scripts/audit-index-quality.cjs` → oyuncu/kayıt derinliği.
- Backend: `node scripts/audit.cjs` → DB bütünlük/yabancı anahtar denetimi.
- Backend: `node node_modules/tsx/dist/cli.mjs src/jobs/syncEspnScores.ts` → tek seferlik skor/fikstür aktarımı; normal çalışma supervisor tarafından yürütülür.
- Backend: `node node_modules/tsx/dist/cli.mjs src/jobs/syncEspnRosters.ts` → kaynaklı kadro/biyografi/sezon aktarımı; mevcut iş zamanlayıcısına bağlıdır.

## Test sonuçları

- Backend ve frontend production derlemeleri başarılı; uygulama yeni sürümle localhost:3000/3101 üzerinde çalışıyor.
- [SQLite senaryo testleri](artifacts/live-data-unit-test.json): tekrar aktarımda kopya üretmeme, skor düzeltmesi, final durumunun korunması, eksik skor reddi, tazelik, gözlenen sıfır/eksik değer ayrımı; geçici kilit tekrar denemesi.
- [Canlı sayfa kabul testi](artifacts/live-coverage-acceptance.json): online yenileme, cache başlıkları, SSE, canlı etiket filtrelemesi, gerçek oyuncu istatistiği ve altı mobil/masaüstü erişilebilirlik senaryosu geçti.
- [Hub testi](artifacts/hub-acceptance-2026-11-07.json): 72 sitemap parçası, 58.122 benzersiz dil dahil URL; XML/DB toplamları, yönlendirme/404/503, JavaScript kapalı 17 referans sayfası geçti.
- [Dil/SEO genişleme testi](artifacts/seo-expansion-acceptance.json): 36 es/ar sayfası, karşılıklı dil metadatası, form hesabı, 14 erişilebilirlik senaryosu geçti.
- [DB denetimi](artifacts/database-audit.json): quick_check=ok, yabancı anahtar ihlali=0.

## Kalan gerçek sınırlamalar

Son sağlık kontrolü **tam sağlıklı değil**: 2 futbol ve 3 tenis kaydı yeniden teyit edilemediği için gecikmiş; 4 kanonik planlı kaydın başlangıcı geçmiş. Bunların bir bölümü düşük kapsamlı liglerdedir. Kontrol araçları bunları açıkça raporlar; eski skor güncel veya sonuçlanmış gibi gösterilmez. Sağlayıcı 503 kesintileri kod değişikliğiyle ortadan kaldırılamaz; yeniden deneme ve bağımsız kaynak kapsamı genişletilmiştir.

DB'deki bütün alanlar dolu değildir. Ayrıntılı kadro, olay, oran, sakatlık, transfer ve oyuncu maç performansı kapsamı kaynak/abonelik bazında değişir. Ham tabloların boş olması tek başına ekranın bozuk olduğunu göstermez: bazı ekranlar `provider_standings`, kaynak snapshot'ları ve kişisel kayıt tablolarını kullanır. Mevcut kaynakta bulunmayan alanlar uydurulmamıştır.

Otomatik güncelleme backend süreci çalıştığı sürece devam eder; süreç başlangıcında işler yeniden kurulur ve yarım kalan kuyruk işleri toparlanır. Makine kapalıyken online güncelleme yapılamaz. Kesintisiz üretim için sürekli açık sunucu, işletim sistemi süreç yöneticisi, kalıcı disk/yedek ve dış izleme kurulmalıdır; bu oturumda yeni bir hosting hesabı veya Windows açılış hizmeti kurulmadı.

Yeni domain/DNS/HTTPS, Search Console yetkisi ve gerçek indeks/arama trafiği hâlâ dış yayın bağımlılıklarıdır. Yönerge: [SEO-DOMAIN-RELEASE.md](SEO-DOMAIN-RELEASE.md). Bu çalışma Google/LLM indekslenmesini veya bütün sporların sınırsız veri kapsamını garanti etmez.
