# TheSportsDB maç detayları

Önceki değerlendirme düzeltildi: TheSportsDB kadro, olay ve maç istatistiği uç noktaları sunuyor. Eski istemcide bu özellikler yanlışlıkla desteklenmiyor kabul edilmişti; maç detayı için yanlış `eventdetails.php` yolu kullanılıyordu.

## Gerçek kontrol

- `lookupevent.php`: örnek maç yanıtı HTTP 200.
- Premier League / Nottingham Forest–Manchester City, TheSportsDB ID `2494098`: `lookuplineup.php`, `lookuptimeline.php`, `lookupeventstats.php` HTTP 200 ve dolu yanıtlar.
- Kaydedilen gerçek yanıtlar ayrıştırıldığında 2 kadro, 5 olay, ev/deplasman ayrı 10 istatistik satırı elde edildi. Bunlar sağlayıcının döndürdüğü kısmi kapsamdır; tam maç istatistiği garantisi değildir.
- Farklı bir buz hokeyi maçında aynı detay alanları null geldi. Bu durum bütün sağlayıcının özelliği desteklemediği anlamına gelmez.
- Projedeki etkin anahtar ortak `123` test anahtarı. Sonraki yapılandırma ve tek maç kontrolleri HTTP 429/başarısız yenileme ile sonuçlandı. Bu turda yeni detayların canlı DB'ye başarıyla aktarıldığı iddia edilmiyor.

## Yapılan düzeltmeler

- Eski istemci gerçek `lookupevent`, `lookuptimeline`, `lookupeventstats`, `lookuplineup` uç noktalarına bağlandı.
- `thesportsdb-details.ts`: lig kataloğu, tarih ve iki takımın ad/alias doğrulaması; maç kimliğine göre veri ayrıştırma; ayrı kalıcı önbellek; mevcut detay ekranındaki eksik alanlar için tamamlayıcı kaynak.
- İlk otomatik eşleme kapsamı Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Süper Lig ve Eredivisie. Uzak katalogda bulunmayan veya tekil eşleşmeyen maçlar tahmin edilerek bağlanmıyor.
- İstekler en az 2,5 saniye aralıkla; 429 sonrası en az 120 saniye bekleme. Yakın tarihli maçlar için beş dakikalık yenileme görevi eklendi. Başarısız istekler dolu veri olarak işaretlenmiyor.
- Backend derlemesi başarılı. Gerçek yanıt, yanlış maç kimliği ve eksik veri testleri eklendi: `backend/scripts/test-thesportsdb-details.ts`.

## Gereken erişim

TheSportsDB'nin https://www.thesportsdb.com/api.php sayfası, kontrol tarihinde aylık 9 USD destekçi planıyla kişisel üretim anahtarı ve V2 / iki dakikalık canlı skor erişimi bildiriyor. Bu planın her ligde tüm detay alanlarını dolduracağı varsayılmamalı. Kişisel anahtar mevcutsa yerel `THESPORTSDB_KEY` yapılandırmasında kullanılmalı; anahtar sohbet veya rapora yazılmamalı.

Live sayfasından daha önce kaldırılan sağlayıcı/abonelik satırları yeniden eklenmedi.
