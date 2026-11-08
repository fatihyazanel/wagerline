# Boş maç detayları: kapsam düzeltmesi

Önceki ESPN entegrasyonu, SportScore'a bağlı ilk canlı maçları kapsamıyordu. İki örnek ESPN maçının başarılı olması tüm maçların detay kapsamını doğrulamıyordu.

## Gerçek sağlayıcı kontrolü

- SportScore widget liste API'si HTTP 200; çoğunlukla skor ve temel maç bilgisi sunuyor.
- SportDB dış ağ kontrolü HTTP 402: abonelik/ödeme erişimi gerekli. API anahtarının tanımlı olması erişim hakkı bulunduğu anlamına gelmiyor.
- API-Sports: kullanılabilir anahtar tanımlı değil.
- SportScore'un herkese açık maç sayfasında ek veriler mevcut. Bu sayfa için Cheerio ayrıştırıcısı ve sayfanın bildirdiği açık JSON durum uç noktası bağlandı. Bu, tüm modülleri sağlayan sözleşmeli bir API entegrasyonu olarak sunulmuyor.

## Uygulama

- Maç URL'si, iki takım adı ve başlangıç tarihi doğrulanmadan detay kabul edilmiyor. Yalnızca sabit SportScore alan adı ve izinli yollar kullanılıyor.
- Timeline, Statistics, Lineups, Head to head ve Odds kaynakta mevcut olduğunda `sportscore_match_details` tablosuna yazılıyor. Performers bölümünde yalnızca olay akışından doğrulanan gol katkıları yer alıyor; oyuncu puanı uydurulmuyor.
- Maç sayfasındaki doğrulanmış final skoru, eski widget skorunu düzeltiyor. Bitmiş maç yeniden canlıya alınmıyor.
- Arka plan görevi en fazla 40 yakın tarihli maçı kontrol ediyor, canlıları öne alıyor. İlk turda 39 maç yenilendi; bir kayıt başarısız oldu ve yeniden denemeye bırakıldı. Tam kapsam iddiası yok.
- SportDB ödeme/yetki/kota hatasında gereksiz tekrar istekleri beş dakika durduruluyor.
- Boş sekmelerde başlamamış maç, kaynak kapsamı ve erişim hatası ayrımı gösteriliyor.

## Gerçek API sonucu

| Maç | Son durum | Olay | İstatistik | Kadro | Geçmiş | Oyuncu katkısı | Oran |
|---|---|---:|---:|---:|---:|---:|---:|
| AC Nagano–Cerezo Osaka (22874) | Bitti, 2–2 | 13 | 20 | 2 | 5 | 4 | 1 |
| Changwon–Gangneung (22876) | Bitti, 0–1 | 1 | 20 | 0 | 5 | 0 | 1 |
| Seongnam–Daegu (22870) | Bitti, 0–1 | 15 | 20 | 0 | 5 | 1 | 1 |

Kanıt: `artifacts/sportscore-detail-acceptance.json`. Ayrıştırma ve kimlik testleri: `backend/scripts/test-sportscore-details.ts`. Ekran testi, daha önce boş olan 22874 maçını da kapsayacak şekilde `wagerline-app/scripts/test-match-details.cjs` dosyasında genişletildi. Backend/frontend derlemeleri başarılı.

## Kalan gereksinim

Tüm liglerde kadro, ayrıntılı oyuncu performansı ve güncel bahis oranı kapsamı için abonelik erişimi açık, ilgili ligleri ve modülleri kapsayan sağlayıcı gerekir. SportDB aboneliği ve/veya API-Sports yapılandırması tamamlanmadan bu kapsam garanti edilemez. Mevcut sayfa ayrıştırıcısı sağlayıcı HTML yapısına bağımlıdır; değişirse bakım gerekir. Kaynakta bulunmayan kadrolar ve performanslar hâlâ eksiktir.
