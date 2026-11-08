# Google giriş ve puan mağazası

## Kullanılabilir sayfalar

- `/login`: mevcut kullanıcı adı/parola hesabı ve yapılandırıldığında Google ile giriş.
- `/shop`: gerçek DB kataloğu, kişisel harcanabilir bakiye, teslimat bilgileri, puanla sipariş ve sipariş geçmişi.
- `/rewards`: XP seviyesi korunur; ayrıca harcanabilir puan ve Shop bağlantısı gösterilir.
- `/admin` → **Shop**: ürün adı, açıklama, görsel URL'si, puan bedeli, stok ve yayın durumu; siparişlerin teslimat bilgileri, takip referansı, gönderildi/iptal işlemleri. Mevcut yönetici tokenı gerekir.

## Google Cloud yapılandırması

Google Auth Platform / OAuth consent ekranını yapılandırın. OAuth istemci türü **Web application** olmalıdır. Test modunda giriş yapacak Google hesaplarını test kullanıcılarına ekleyin.

Yerel yetkili yönlendirme URI'si:

```
http://localhost:3000/api/v1/personal/google/callback
```

Backend'in yerel `.env` dosyasına aşağıdaki değişkenleri ekleyin. Client Secret sohbet, kaynak kod veya Git deposuna eklenmemelidir:

```dotenv
APP_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Bu akış sunucu tarafında authorization code + PKCE kullanır. Token değişimi ve Google userinfo kontrolü backend'de yapılır; client secret tarayıcıya verilmez. Google kimliği `sub` alanıyla eşlenir, doğrulanmamış e-posta kabul edilmez. Mevcut parola hesabı aynı e-posta varsayımıyla otomatik birleştirilmez.

Alan adı değiştiğinde `APP_ORIGIN=https://yeni-alan-adi` olarak ayarlanmalı ve Google Cloud'daki redirect URI `https://yeni-alan-adi/api/v1/personal/google/callback` olmalıdır. `APP_ORIGIN` sonunda `/` kullanmayın. Backend yeniden başlatılmalıdır. Üretimde HTTPS gerekir.

Gerçek OAuth anahtarları olmadan Google ile gerçek giriş doğrulanamaz. Arayüz bu durumda kullanıcı adı/parola ile giriş sunar; Google seçeneğinin daha sonra açılacağını belirtir.

## Puan ve teslimat kuralları

- Mevcut kazanılmış XP, puan kaynağıdır: 1 kazanılmış XP = 1 harcanabilir puan. XP ve seviye harcamayla düşmez.
- Kullanılabilir bakiye = güncel kazanılmış puan − iptal edilmemiş siparişlerin puanı.
- Sonuç düzeltmeleri kazanılmış puanı azaltabilir. Harcama toplamının altına düşerse yeni alışveriş durur; var olan siparişler kendiliğinden silinmez.
- Her sipariş için giriş, alıcı adı, uluslararası telefon numarası, adres, şehir, posta kodu ve ülke kodu zorunludur. Telefon formatı doğrulanır; SMS doğrulaması ve kargo firması entegrasyonu bu kapsamda yoktur.
- Teslimat bilgileri istenirse sonraki sipariş için kaydedilir. Siparişte, o siparişe ait adresin ayrı kopyası tutulur.
- Ürün/fiyat sunucudan okunur; kullanıcının onayladığı fiyat değiştiyse sipariş reddedilir.
- Puan ve stok kontrolü, sipariş INSERT işleminin SQLite trigger'larıyla atomik olarak yapılır. İstek anahtarı aynı siparişin tekrar harcama yapmasını önler.
- Bekleyen sipariş yönetici tarafından iptal edilirse puanı ve stok bir kez geri gelir. Gönderilmiş siparişlerin otomatik iadesi bu akışta yoktur.
- Ürünleri yayınlamak için gerçek ad, puan bedeli, stok ve mümkünse görsel gereklidir. İşletmenin sunmadığı ürünler gerçek stok olarak eklenmedi.

## Veritabanı ve testler

Eklenen tablolar: `google_identities`, `google_login_states`, `shop_products`, `shop_contacts`, `shop_orders`. Mevcut hesap/oturum ve XP tabloları korunur.

Backend test komutu:

```
npx tsx scripts/test-shop-auth.ts
```

Testler ayrı geçici DB'de çalışır. Giriş zorunluluğu, adres/telefon, kullanıcılar arası izolasyon, CSRF origin kontrolü, fiyat, puan/stok eşzamanlılığı, tekrar sipariş, iptal/iade ve Google state/PKCE kontrolleri kapsanır. Google taşıma katmanı bu testte taklittir; gerçek Google giriş testi değildir.

Tarayıcı testleri için önce backend dizininde `npx tsx scripts/test-shop-auth.ts --serve`, sonra frontend dizininde `node scripts/test-shop-ui.cjs` çalıştırılır. İzole API portu 3102'dir. Test ürünleri ve oturumları ana veritabanına yazılmaz.

Sonuç dosyaları: `artifacts/shop-auth-test.json` ve `artifacts/shop-ui-test.json`.
