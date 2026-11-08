# Maç detayları ve canlı spor görünümü — 7 Kasım 2026

## Uygulanan değişiklikler

- ESPN özet API entegrasyonu: takım istatistikleri, olay akışı, ilk kadrolar, oyuncu performansları, sağlayıcının sunduğu oranlar ve geçmiş karşılaşmalar.
- Maç ve iki takımın sağlayıcı kimlikleri doğrulanmadan detay kaydı kabul edilmiyor. Geçmiş karşılaşmalarda aynı iki takım, tamamlanmış maç ve incelenen maçtan önce oynanmış olma koşulları aranıyor.
- Detaylar `espn_match_details` tablosuna kaydediliyor. Mevcut SportDB entegrasyonu korunuyor. Canlı detay önbelleği 30 saniye; diğer maçlarda bir saat. Ekrandaki veri otomatik yenileniyor.
- `espn-match-details` arka plan görevi, dün–yarın aralığındaki en fazla 80 eşleşmeyi tur başına kontrol ediyor; tur tamamlandıktan iki dakika sonra yeniden çalışıyor. Hata durumunda yeniden deneme uygulanıyor. İlk doğrulanan tur: 66 maç, hata yok.
- Tenis canlı API listesinde beş dakikadan eski kayıtlar ve Wqf türündeki yer tutucular gösterilmiyor. Kayıtlar veritabanından silinmiyor. Sayfalama sayıları da filtreli sonuç üzerinden hesaplanıyor.
- All sports içinde kompakt canlı maç kartları; boş Formula 1 bölümü kaldırıldı. Gerçek set verisi varsa gösteriliyor. Kaynağın üçüncü sette 0–0 gönderdiği tutarsız durumda skor yerine çizgi gösteriliyor.
- Futbol menü ikonu yeniden çizildi. Maç zamanları kaynak saat/periyot bilgisiyle, oyuncu performansları sporun kendi istatistikleriyle gösteriliyor.

## Doğrulanan gerçek maçlar

| Maç ID | İstatistik | Olay | Kadro | Oyuncu | Oran sağlayıcısı | Geçmiş maç |
|---|---:|---:|---:|---:|---:|---:|
| 22875 | 46 | 15 | 2 | 40 | 1 | 4 |
| 20131 | 50 | 539 | 2 | 20 | 1 | 1 |

Testler: `backend/scripts/test-espn-details.cjs`, `wagerline-app/scripts/test-match-details.cjs`. Gerçek kaynak yanıtı ayrıştırma, eksik veri, takım eşlemesi, oran dönüşümü, geçmiş maç tarih sınırı; ayrıca 390/1440 pikselde sekmeler, taşma ve canlı sayfa WCAG A/AA denetimi. Sonuç: `artifacts/match-detail-acceptance.json`.

Backend ve frontend üretim derlemeleri başarılı. Frontend derlemesinde alan adı henüz tanımlanmadığı için `metadataBase` uyarısı ve bir önbellek dosyası için Windows `EBUSY` uyarısı çıktı; derleme çıkış kodu 0. Bunlar SEO yayına hazırlığının tamamlandığı anlamına gelmez.

## Kapsam sınırları

Her lig ve her tarih için tüm modüllerin dolu olduğu iddia edilmiyor. ESPN eşlemesi ve ilgili API alanı olmayan maçlarda mevcut kaynak/veritabanı kapsamı geçerli. Kaynakta bulunmayan oran, oyuncu puanı veya kadro üretilmiyor. Kaynak oranları işlem yapılabilir güncel fiyat garantisi taşımaz; bitmiş maçlarda tarihsel veri olarak gösterilir. F1 için mevcut Jolpi kaynağı gerçek zamanlı yarış telemetrisi sağlamıyor. Yeni alan adı henüz verilmedi; genel SEO/alan adı çalışmalarının tamamlandığı bu raporla iddia edilmiyor.
