# Hub, indeks ve semantik uygulama sonucu — 7 Kasım 2026

Güncel canlı veri ek çalışması: [LIVE-DATA-RESULT-2026-11-07.md](LIVE-DATA-RESULT-2026-11-07.md). ESPN canlı aktarımı, kalıcı yenileme durumu, veri sağlık ekranı ve oyuncu sezon verileri eklendi. Güncel test: 58.122 URL / 72 sitemap parçası.

Bu rapor ve SEO-SEMANTIC-AUDIT-2026-11-07.md birlikte güncellenmiştir. Kod tarafındaki hub/SEO geliştirmeleri uygulandı; gerçek alan adı, Search Console ve saha trafiği gerektiren işlemler henüz tamamlanmış değildir. Alan adı değişimine hazır yapı kullanılır; localhost önizlemesi noindex kalır.

## Uygulanan sayfa ağı

| Katman | Adres | İşlev |
|---|---|---|
| Dizin | `/discover?page=N` | Yedi branş, lig/takım bağlantıları, sayfalı maç arşivi |
| Branş | `/sports/{slug}` | Ligler, takımlar, maçlar; tenis/F1 etkinlikleri |
| Lig | `/leagues/{slug}` | Kaynaklı tablo, takımlar, maçlar; uygun sıralamalarda tablodan hesaplanan puan farkı özeti |
| Takım | `/teams`, `/teams/{slug}` | Kadrodan oyuncu profillerine bağlantılar, maçlar; İngilizce F1 profillerinde sürücü sıralaması |
| Oyuncu | `/players?page=N`, `/players/{id}` | Gerçek biyografi, takım, sağlayıcı eşlemesi; bulunmayan sezon istatistikleri açıkça belirtilir |
| Konu | `/tags`, `/tags/{fixtures,results,live}` | Sonlu taksonomi; rastgele etiket 404, branş/lig alias'ları 308 |
| Maç | `/matches/{id}` | Skor/durum, takım/lig bağlantıları; başlangıçtan önceki en fazla beş geçerli maçla form karşılaştırması |
| Bireysel etkinlik | `/contests/{provider-key}` | Tenis setleri veya F1 yarış sınıflaması, kaynak ve güncelleme zamanı |
| Özgün rehber | `/insights`, `/insights/{slug}` | Olasılık, form karşılaştırması, kaynak güncellemesi üzerine üç kuruluş imzalı rehber |
| Kaynak / editoryal | `/about/data`, `/about/editorial` | Kaynak, yöntem, AI yardımı, otomatik özet ve düzeltme açıklamaları |

İngilizce adresler korunur. Açık referans ağı için `/es/...` ve `/ar/...` sunucu sayfaları, karşılıklı en/es/ar/x-default hreflang ve dil bağlantıları vardır. Arapça HTML `lang=ar`, `dir=rtl` taşır. Çeviriler spor kayıtlarını aynı API'den okur; takım/kişi adları kaynağın özel adları olarak kalır. Home/Live/News/Predictions gibi interaktif ana ekranların tamamı bu yeni çevrilmiş referans ağına dahil değildir; bunlara sahte hreflang eşdeğerleri eklenmez. F1 takımındaki ek sürücü modülü İngilizce sayfada kalır; çevrilmiş spor hub'ı yarış kayıtlarını sunar.

Maç analizleri kopya kayıtları, eksik skorları ve maç başlangıcından sonraki sonuçları dışlar. Model varsa gerçek olasılıkları kullanır; insan gözlem raporu olduğu iddia edilmez. Rehberlerin yayıncısı WAGERline olarak açıklanır; gerçek bir editör adı veya insan incelemesi uydurulmaz.

## Sitemap kapsamı

7 Kasım kabul testi: **58.122 benzersiz URL / 72 XML parçası**. Bu sayı üç dilin toplamıdır; 58.122 ayrı özgün spor kaydı anlamına gelmez. Parça başına en fazla 1.000 URL vardır.

| Tür | İngilizce | İspanyolca | Arapça |
|---|---:|---:|---:|
| Ana sayfalar / konu / rehber | 19 | 13 | 13 |
| Kaynak eşlemeli oyuncular | 9.813 | 9.813 | 9.813 |
| Takım maçları | 8.591 | 8.591 | 8.591 |
| Tenis/F1 kayıtları | 345 | 345 | 345 |
| Takımlar | 539 | 539 | 539 |
| Ligler | 64 | 64 | 64 |
| Branşlar | 7 | 7 | 7 |

Sayılar DB değiştikçe değişir. Alias, özel API, Admin ve Rewards adresleri sitemap dışındadır. Boş konu noindex; eşlemesi olmayan oyuncu profili noindex; bilinmeyen kayıt 404; sitemap veri kaynağı hatası 503/Retry-After döndürür. lastmod yalnız kaynak güncelleme zamanı varsa yazılır. `/llms.txt` oyuncu, rehber ve dil ağını da açıklar.

## Veri derinliği: doğrulanan durum

[index-quality-audit.json](artifacts/index-quality-audit.json): aktif 11.683 oyuncunun 9.813'ünde sağlayıcı eşlemesi, 10.246'sında en az bir biyografi alanı vardır. **Sezon istatistiği bulunan oyuncu sayısı 3.627'dir (4.249 sezon satırı).** Kaynak kapsamı genişletilmeden tam oyuncu performansı iddia edilemez. İnce profillerin yayın sonrası indeks performansı ayrıca izlenmelidir.

4.475 tamamlanmış ve 5 canlı maçta iki tarafın skoru vardır. 4.104 planlanmış maç ve 4 iptal edilmiş maç için skor yoktur; bunlara sahte skor yazılmaz. Bu denetim yeni bir ücretli veri paketi veya erişim hakkı oluşturmaz.

## Kanıtlar

- Frontend production / backend TypeScript derlemeleri başarılı.
- [Hub kabul testi](artifacts/hub-acceptance-2026-11-07.json): tüm 72 parçanın toplamları, URL benzersizliği, XML, alias/404/503 ve 17 İngilizce sunucu sayfası.
- [SEO regresyonu](artifacts/seo-acceptance-2026-11-07.json): sekiz mevcut ekranın metadata/özel sayfa politikası, sunucudan Home verisi ve hata davranışı.
- [Genişleme kabulü](artifacts/seo-expansion-acceptance.json): 36 es/ar sayfası JavaScript kapalı, dil/yön/sayfalama, 10 maçın form hesabı, 14 yeni mobil/masaüstü erişilebilirlik senaryosu, telemetri doğrulaması.
- [Mevcut sayfa erişilebilirliği](artifacts/seo-accessibility-2026-11-07.json): 24 mobil/masaüstü senaryosu. Otomatik testler manuel sertifika veya saha CWV ölçümü değildir.
- [Alan adı ayarları](artifacts/domain-settings-test.json) ve [operasyon testi](artifacts/seo-operations-test.json): Next yönlendirme motorunda yol/sorgu koruyan 308, tam host eşleşmesi; sentetik bellek içi örnekle p75 ve önizleme ayrımı.
- [Yayın hazırlığı](artifacts/seo-release-readiness.json): gerçek SITE_URL ve Search Console erişimi eksik; bu kontrol bilinçli olarak başarılı işaretlenmemiştir.

## Tamamlanması dış bilgiye bağlı işler

1. Yeni HTTPS domain ve varsa kontrol edilen eski domainler sağlanacak; DNS/TLS/CDN bağlantısı yapılacak.
2. SITE_URL/PREVIOUS_SITE_URLS ayarlanacak, yeniden derleme/başlatma ve dış ağ testi yapılacak.
3. Gerçek Search Console mülkiyeti doğrulanacak; sitemap gönderilecek; örnek URL'ler incelenecek; gerekiyorsa Adres Değişikliği uygulanacak.
4. Gerçek URL'ler Google Rich Results/Schema Validator ile incelenecek; bot erişimi CDN/WAF tarafında doğrulanacak.
5. Kalıcı log diski ve edge HTTP durum logları bağlanacak; hata oranı/gecikme alarmları kurulacak. Uygulama bot günlükleri User-Agent iddiasıdır, doğrulanmış bot kimliği değildir.
6. Gerçek trafikle 28 günlük CWV/arama performansı izlenecek. Şu anki tek telemetri örneği sentetik yerel testtir, saha kanıtı değildir.
7. Sağlayıcı kapsamı elveriyorsa eksik oyuncu sezon verileri alınacak; editoryal sorumlu atanıp rehberler düzenli gözden geçirilecek. Kaynakta olmayan veriler üretilemez.

Komutlar, ortam değişkenleri, taşıma ve doğrulama sırası: [SEO-DOMAIN-RELEASE.md](SEO-DOMAIN-RELEASE.md). Ayrıntılı iş kontrol listesi: [SEO-SEMANTIC-AUDIT-2026-11-07.md](SEO-SEMANTIC-AUDIT-2026-11-07.md).
