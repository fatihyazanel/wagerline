# SEO / semantik denetim ve uygulama kontrol listesi — 7 Kasım 2026

Güncel canlı veri ek çalışması: [LIVE-DATA-RESULT-2026-11-07.md](LIVE-DATA-RESULT-2026-11-07.md). ESPN canlı aktarımı, kalıcı yenileme durumu, veri sağlık ekranı ve oyuncu sezon verileri eklendi. Güncel test: 58.122 URL / 72 sitemap parçası.

Bu belge eski denetimin açık işlerini güncel uygulama ve kanıtlarla birleştirir. **Yerel teknik geliştirmeler uygulandı; dış yayın ve gerçek performans ölçümü tamamlanmadı.** Google veya LLM indekslenmesi/organik trafik garanti edilmez.

## İşlerin güncel durumu

| İş | Durum | Uygulama / kabul ölçütü |
|---|---|---|
| Sayfa title/description, canonical, OG/Twitter | Tamamlandı | Sekiz ana ekran ve dinamik kayıt metadata'sı; merkezi HTTPS origin |
| Alan adı değişimi | Kod tamamlandı; yayın bekliyor | SITE_URL + PREVIOUS_SITE_URLS, tam host eşleşmesi, yol/sorgu koruyan 308; Next motoruyla test edildi |
| Özel ekran / API indeks politikası | Tamamlandı | Admin/Rewards noindex, backend API X-Robots-Tag; erişim yetkisinin yerine geçmez |
| Robots ve önizleme güvenliği | Tamamlandı | SITE_URL yoksa önizleme noindex, sitemap boş; localhost yayın sayılmaz |
| Home ilk HTML verisi | Tamamlandı | Gerçek maç/haber özeti sunucudan; kişisel veriler paylaşılmaz |
| Hub / tag / kalıcı maç-lig-takım ağı | Tamamlandı | Gerçek anchor bağlantıları ve sayfalama; sonlu konu sözlüğü; alias 308, bilinmeyen 404 |
| Oyuncu kalıcı profilleri | Tamamlandı | Takım kadrosu → oyuncu → takım; kaynak eşlemeli aktif profiller sitemap'te |
| F1/tenis kalıcı kayıtları | Tamamlandı | Sağlayıcı anahtarları kodlanır; yarış/set verileri; bireysel ligler branş hub'ına yönlenir |
| Maç önizleme / kaynaklı lig analizi | Tamamlandı | Maç öncesi son beş geçerli sonuçtan form; uygun tabloda lider/ikinci puan farkı; otomatik özet açıklaması |
| Özgün rehber / editoryal şeffaflık | İlk yayın tamamlandı; sürekli iş | Üç rehber, kuruluş atfı, AI yardımı ve otomatik veri notları; insan editör uydurulmaz |
| Kalıcı dil URL / hreflang | Referans ağı tamamlandı | en mevcut adres, es/ar önekleri; reciprocal hreflang, gerçek çeviri, Arapça RTL; interaktif tüm ürün ekranları kapsam dışı |
| Semantik HTML / JSON-LD | Tamamlandı | BreadcrumbList, SportsTeam, SportsEvent, Person, Article, ItemList ve konu sözlüğü; gerçek kaynak değerleri |
| Sitemap büyümesi | Tamamlandı | 72 parça, parça başına 1.000 URL, üç dilde 58.122 URL; lastmod uydurulmaz; kaynak hatası 503 |
| LLM keşif dosyası | Tamamlandı | llms.txt açık hub/oyuncu/rehber/dil ağına işaret eder; robots yerine geçmez |
| İndeks kalite denetimi | Araç ve ilk denetim tamamlandı; sürekli iş | audit-index-quality.cjs; kaynak/boş kayıt politikası; Search Console verisiyle sonraki kapsam kararı |
| CWV ölçüm toplama | Kod/test tamamlandı; gerçek saha bekliyor | LCP/INP/CLS, sorgusuz rota/cihaz, DNT, özel sayfa dışlama; 28 gün p75 raporu; önizleme ayrı |
| Bot/hata günlükleri | Uygulama tamamlandı; edge işletimi bekliyor | Bot iddiası ve sunucu hata olayları; kalıcı SEO_LOG_DIR gerekli; tüm HTTP trafiği için CDN logları ayrıca gerekir |
| Search Console araçları | Kod tamamlandı; hesap bekliyor | status, submit, inspect, performance komutları; token yalnız sunucu ortamından okunur |
| DNS/HTTPS/CDN ve bot dış erişimi | Bekliyor | Kesin domain, DNS/dağıtım erişimi gerekir |
| Search Console mülkiyet/sitemap/taşınma | Bekliyor | Gerçek property/OAuth erişimi gerekir; uydurma doğrulama yapılmadı |
| Google zengin sonuç / gerçek bot kontrolü | Bekliyor | Kamuya açık gerçek URL gerekir; JSON-LD testi Google onayı değildir |
| Gerçek indeks, trafik ve saha hedefleri | Yayın sonrası sürekli iş | Dil/sorgu bazında gösterim-tıklama; mobil p75 LCP ≤2,5 sn, INP ≤200 ms, CLS ≤0,1 |

## Açık veri ve ürün kapsamı

- DB'de 11.683 aktif oyuncu, 9.813 sağlayıcı eşlemeli oyuncu, 10.246 biyografili oyuncu vardır; 3.627 oyuncuya ait 4.249 normalize sezon istatistik satırı ve 9.904 kaynak/sezon snapshot'ı aktarılmıştır. Profiller mevcut kaynağı gösterir, eksik sezon performansını sıfır gibi sunmaz. Sağlayıcının erişilebilir kapsamı/aboneliği doğrulanmadan eksik istatistikleri tamamlanmış saymak mümkün değildir.
- Tamamlanmış 4.475 maçın iki taraf skoru vardır. Planlanmış maçlarda skor bulunmaması veri hatası sayılmaz.
- Dil çalışması açık referans sayfalarını kapsar; bütün etkileşimli ürünün kapsamlı çevirisi tamamlandı iddiası yoktur. F1 takımının ek sürücü modülü İngilizce sayfada kalır.
- Özgün içerik üretimi, gerçek editoryal sahiplik, sağlayıcı düzeltmeleri ve Search Console'a dayalı ince kayıt kararları işletim sorumluluğudur. Üç rehber sürekli içerik operasyonunun yerine geçmez.

## Doğrulama ve komutlar

Frontend/backend production derlemeleri başarılı. Aşağıdaki komutlar wagerline-app içinde çalışır:

- `node scripts/test-seo.cjs` — sekiz ekran regresyonu, gerçek HTML, canonical/noindex, API ve hata sözleşmeleri.
- `node scripts/test-hub-architecture.cjs` — tüm sitemap parçalarını gerçek DB sayılarıyla eşleştirme, 17 İngilizce referans sayfası, XML, alias/404/503.
- `node scripts/test-seo-expansion.cjs` — 36 es/ar sayfası JavaScript kapalı; 10 form hesabı; 14 yeni mobil/masaüstü erişilebilirlik senaryosu; telemetri giriş doğrulaması.
- `node scripts/test-seo-accessibility.cjs` — mevcut referans ağında 24 mobil/masaüstü senaryosu.
- `node scripts/test-domain-settings.cjs` ve `node scripts/test-seo-operations.cjs` — domain doğrulama, Next 308 yönlendirme, p75/tekilleştirme/önizleme ayrımı.
- Backend içinde `node scripts/audit-index-quality.cjs` — salt okunur veri derinliği denetimi.

Kanıt dosyaları [hub sonuç raporunda](HUB-INDEX-RESULT-2026-11-07.md) bağlantılıdır. Test origin'i `https://seo-test.example` ayrılmış örnektir; buraya yayın veya sitemap gönderimi yapılmaz. Telemetri hesap testi bellek içi sentetik veridir; yerel POST örneği de önizleme olarak ayrılır. Gerçek saha ölçümü yoktur.

## Yayın için sıralı kontrol listesi

- [ ] Kullanıcı/operasyon: yeni HTTPS domaini ve varsa eski kontrollü domainleri kesinleştir.
- [ ] Operasyon: DNS/TLS/CDN bağlantısı, eski domain sertifikaları ve 301/308 zincirini kur.
- [ ] Operasyon: SITE_URL/PREVIOUS_SITE_URLS/API_INTERNAL_URL ve kalıcı SEO_LOG_DIR ayarla, yeniden derle/başlat.
- [ ] Operasyon: CORS, callback, cookie ve WAF ayarlarını gerçek domaine göre doğrula.
- [ ] `node scripts/seo-release-check.cjs` komutunu yayın ve dış ağdan çalıştır; tüm kontrolleri geçir.
- [ ] Hesap sahibi: Search Console mülkiyetini doğrula; GSC_SITE_URL/GSC_ACCESS_TOKEN sağla.
- [ ] `search-console.cjs status`, `submit`, `inspect` çalıştır; gerçek URL'lerde canonical/indeks bilgisini incele.
- [ ] Domain taşınıyorsa Search Console Adres Değişikliği işlemini uygula; eski yönlendirmeleri en az bir yıl sürdür.
- [ ] Gerçek URL'lerde Rich Results / Schema Validator ve doğrulanmış bot erişimini kontrol et.
- [ ] Edge HTTP durum logları, kaynak gecikme/sitemap hata alarmları ve log saklama düzenini etkinleştir.
- [ ] Sağlayıcı kapsamına göre eksik oyuncu biyografisi/sezon istatistiklerini aktar; yanlış sıfır veya sentetik sonuç üretme.
- [ ] Yayın sonrası haftalık indeks/sorgu/dil performansı; yeterli gerçek örnekle 28 günlük CWV kontrolü yap; editoryal içerik ve ince kayıt kapsamını iyileştir.

Tam yayın/taşıma yönergesi: [SEO-DOMAIN-RELEASE.md](SEO-DOMAIN-RELEASE.md). Bu maddeler dış erişim olmadan tamamlanmış işaretlenmemiştir.
