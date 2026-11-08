# Alternatif spor veri kaynakları — 7 Kasım 2026

Bu araştırma gerçek HTTP istekleri ve sağlayıcıların yayımladığı kapsam/fiyat sayfaları üzerinden yapıldı. Hiçbir hesap açılmadı, abonelik satın alınmadı. HTTP 200, tüm liglerin ve modüllerin mevcut olduğu anlamına gelmez.

## İhtiyaca uygun alternatifler

| Kaynak | Doğrulanan bilgi | Sınır / karar |
|---|---|---|
| [Sportmonks](https://www.sportmonks.com/football-api/free-plan/) | Ürün sayfası HTTP 200; maç olayları, kadro istatistikleri, takım/oyuncu istatistikleri ve H2H özelliklerini açıklıyor. Gerçek API isteği HTTP 401: token gerekli. | Ücretsiz ligler yalnızca Danish Superliga ve Scottish Premiership. Tüm hedef ligler ve oran kapsamı seçilecek planda ayrıca doğrulanmalı. Geniş futbol detayları için ilk pilot adayı. |
| [football-data.org](https://www.football-data.org/pricing) | Fiyat/kapsam sayfaları HTTP 200. “Free + Deep Data” €29/ay: 12 lig, kadro, değişiklik, golcü ve kartlar. İstatistik eklentisi €15/ay; maç öncesi 1-X-2 oran eklentisi €15/ay. | Örnek toplam €59/ay, olası KDV hariç. Eklenti kapsamları aynı liglerle birebir örtüşmeyebilir. Oyuncu puanı ve her oyuncunun ayrıntılı maç performansı bu sayfada doğrulanmadı. Ücretsiz plan skorları gecikmeli; ana ihtiyacı tek başına çözmez. |
| [OpenLigaDB](https://api.openligadb.de/getmatchdata/bl1/2026/1) | Gerçek Bundesliga yanıtı HTTP 200; maç sonucu, gol olayları, takım ve stat bilgisi geldi. İlk örnekte altı gol kaydı var. | Anahtarsız yardımcı kaynak. Denenen yanıtta kadro, ayrıntılı istatistik, oyuncu puanı ve bahis oranı yok. Tek başına altı sekmeyi doldurmaz. |
| [NHL resmi API](https://api-web.nhle.com/v1/gamecenter/2026020200/boxscore) | HTTP 200; gerçek maç boxscore yanıtı. | Buz hokeyinde doğrudan kaynak olarak kullanılabilir. Futbol sorununu çözmez. Projede NHL takvim/skor entegrasyonu zaten var. |
| [TheSportsDB](https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=2360189) | Örnek maç sorgusu HTTP 200, gerçek maç kaydı döndü. | Bu test ayrıntılı kadro/performans kapsamını kanıtlamıyor. Projede zaten bulunan yardımcı kaynak. |
| ESPN | Premier League skor tablosu HTTP 200. Önceki gerçek özet testlerinde kadro, olay, istatistik, oyuncu ve bazı oranlar doğrulandı. | Mevcut entegrasyon korunmalı. Denenen Kore/Japonya alt lig kodları HTTP 400; kapsam varsayılmamalı. |

Fiyatların kaynağı: https://www.football-data.org/pricing
Liglerin kaynağı: https://www.football-data.org/coverage
Sportmonks güncel dokümantasyon girişi: https://docs.sportmonks.com/football/

## Erişilemeyen / çalışmayan adaylar

- Google: doğrudan HTML araması kullanılabilir sonuç vermedi. Edge tarayıcısıyla arama bot doğrulamasına yönlendi; aşılmaya çalışılmadı. Google üzerinden tüm maç modüllerini sağlayan bir kaynak doğrulanmadı.
- SofaScore: denenen herkese açık tarihli maç uç noktası HTTP 403. Entegrasyon hazır veya çalışıyor olarak değerlendirilmedi.
- FotMob: denenen `/api/matches` yolu HTTP 404. Bu sonuç tüm FotMob servislerinin kapalı olduğunu göstermez; çalışan entegrasyon doğrulanmadı.
- API-Football / API-Sports web sayfaları bu ortamda HTTP 403 bot doğrulaması verdi. Mevcut projede kullanılabilir API-Sports anahtarı yok.
- Mevcut SportDB: önceki dış ağ kontrolünde HTTP 402; ücretli erişim sorunu çözülmeden güvenilir ana kaynak değil.

## Önerilen uygulama

1. Mevcut ESPN ve SportScore detay kaynaklarını çalışır tut.
2. Yeni futbol kaynağı için Sportmonks hesabı/tokenıyla önce ücretsiz iki ligde gerçek entegrasyon pilotu yap. İstenen diğer ligleri içeren plan ve oran/oyuncu veri kapsamını maç bazında doğrula.
3. Daha sınırlı lig kapsamıyla fiyatı açık alternatif istenirse football-data.org Deep Data + istatistik + oran paketini değerlendir. Bu paket ayrıntılı oyuncu puanı ihtiyacını karşılıyor varsayılmamalı.
4. Kabul kontrolünü seçilmiş tek bir maça göre yapma: her hedef ligde canlı, bitmiş ve yaklaşan maç örneklerinde altı modülün kayıt sayısı, güncelliği ve eksik veri nedeni ölçülmeli.
5. Kaynak tokenları güvenli yerel ortam yapılandırmasına eklendikten sonra kimlik eşleme, DB kaydı, otomatik güncelleme ve kaynak değiştirme işlemleri bağlanabilir. Bu araştırmada yeni ücretli/token gerektiren kaynak için çalışan entegrasyon iddia edilmiyor.

Ham HTTP yanıtları `artifacts/source-search-*.txt`, Google tarayıcı sonucu `artifacts/google-api-search.txt` altında saklandı. Bu dosyalar yapılandırma anahtarı içermez.
