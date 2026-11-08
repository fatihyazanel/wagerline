# Login ve Shop sonuçları

Uygulananlar:

- `/login`, menüde Account ve Shop bağlantıları; mevcut kullanıcı adı/parola girişi korunarak Google authorization-code + PKCE akışı eklendi.
- Google `sub` kimliği, doğrulanmış e-posta, tek kullanımlık ve çereze bağlı state, süreli HttpOnly oturum.
- `/shop`: katalog, puan bakiyesi, zorunlu telefon/adresli onay formu, sipariş oluşturma ve geçmiş.
- `/rewards`: XP/level korunarak harcanabilir bakiye ve Shop bağlantısı.
- `/admin` → Shop: gerçek ürün, puan bedeli, stok, görsel ve yayınlama; sipariş gönderimi, takip bilgisi ve iptal/iade.
- Fiyat değişikliği, eşzamanlı stok/puan harcaması, tekrar sipariş ve iki kez iade engellendi. Ürün düzenlemesinde eşzamanlı stok değişikliği üzerine eski stok yazılamaz.
- Kullanıcı teslimat bilgileri diğer kullanıcılara açılmıyor; kişisel API yanıtlarında `private, no-store` var.

Doğrulama:

- Backend ve frontend üretim derlemeleri başarılı.
- Ayrı test DB'sinde oturum, telefon/adres, kullanıcı izolasyonu, fiyat, puan/stok yarışları, idempotency, iptal/iade ve XP korunması geçti.
- Google taşıma katmanı taklit edilerek state/PKCE, tekrar callback, doğrulanmamış kimlik reddi ve oturum açılması test edildi. Gerçek Google hesabıyla giriş henüz test edilmedi.
- 390 ve 1440 pikselde giriş ve ödeme formu, zorunlu telefon, sipariş geçmişi, yatay taşma ve WCAG A/AA kontrolleri geçti. Yönetici ürün oluşturma/düzenleme tarayıcı testi geçti.
- Kanıt: `artifacts/shop-auth-test.json`, `artifacts/shop-ui-test.json`. Test ürünleri ana DB'ye yazılmadı; izole test sunucusu kapatıldı.

Kalan dış girdiler:

1. Google Cloud Web OAuth Client ID / Client Secret; yerel `.env` yapılandırması. Mevcut kurulumda Google girişi kapalı, parola hesabı kullanılabilir.
2. Gerçek hediye adları, görselleri, puan bedelleri ve stokları. Mevcut Shop kataloğu boş; yönetimden yayınlanabilir.

SMS doğrulaması, otomatik kargo firması entegrasyonu veya gerçek sevkiyat bu çalışmada yapılmadı. Telefon/adres toplanır ve yönetici siparişi takip eder.

Kurulum: [LOGIN-SHOP-SETUP.md](LOGIN-SHOP-SETUP.md).
