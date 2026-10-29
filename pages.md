Evet. **TheSportsDB'nin resmi API'si var** ve şu anki dokümantasyona göre ücretsiz V1 API'yi doğrudan test edebilirsin. Ancak önemli bir nokta var: **free API'nin bazı endpoint'lerinde ciddi limitler bulunuyor** ve canlı skorlar free değil. ([TheSportsDB][1])

## TheSportsDB API

[TheSportsDB API Documentation](https://www.thesportsdb.com/documentation?utm_source=chatgpt.com)

### Base URL

```text
https://www.thesportsdb.com/api/v1/json/123/
```

TheSportsDB'nin resmi dokümanında **free API key = `123`** olarak belirtiliyor. ([TheSportsDB][1])

---

## 1. Takım arama

Örneğin Arsenal:

```text
https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Arsenal
```

[Arsenal API Testi](https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Arsenal&utm_source=chatgpt.com)

Bu şekilde JSON takım bilgisi döner. Free katmanda takım arama oldukça kısıtlı; dokümana göre search endpoint'i free kullanımda sınırlı. ([TheSportsDB][1])

---

## 2. Tüm sporlar

Bu bizim için önemli:

```text
https://www.thesportsdb.com/api/v1/json/123/all_sports.php
```

[TheSportsDB — All Sports API](https://www.thesportsdb.com/api/v1/json/123/all_sports.php?utm_source=chatgpt.com)

Buradan TheSportsDB'nin desteklediği spor kategorilerini alabiliyoruz. Free limit: **2 request**. ([TheSportsDB][1])

---

## 3. Tüm ligler

```text
https://www.thesportsdb.com/api/v1/json/123/all_leagues.php
```

[TheSportsDB — All Leagues API](https://www.thesportsdb.com/api/v1/json/123/all_leagues.php?utm_source=chatgpt.com)

Free limit **10 request** olarak belirtiliyor. ([TheSportsDB][1])

---

## 4. Ülke + spor bazında ligler

Örneğin İngiltere futbol ligleri:

```text
https://www.thesportsdb.com/api/v1/json/123/search_all_leagues.php?c=England&s=Soccer
```

[England Soccer Leagues API](https://www.thesportsdb.com/api/v1/json/123/search_all_leagues.php?c=England%26s%3DSoccer&utm_source=chatgpt.com)

Bu bizim **league discovery** katmanımız için oldukça kullanışlı.

---

# 5. Lig maçları

Örneğin Premier League ID'si `4328`.

### Yaklaşan maçlar

```text
https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=4328
```

[Premier League Next Events API](https://www.thesportsdb.com/api/v1/json/123/eventsnextleague.php?id=4328&utm_source=chatgpt.com)

Free limit: **1 request**.

Premium'da 20 sonuç. ([TheSportsDB][1])

### Geçmiş maçlar

```text
https://www.thesportsdb.com/api/v1/json/123/eventspastleague.php?id=4328
```

[Premier League Past Events API](https://www.thesportsdb.com/api/v1/json/123/eventspastleague.php?id=4328&utm_source=chatgpt.com)

---

# 6. Günün maçları

Bu WAGERline için daha önemli:

```text
https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=2026-08-31
```

Belirli spor:

```text
https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=2026-08-31&s=Soccer
```

Free limit: **3 request**. Premium: 1500. ([TheSportsDB][1])

Bu nedenle:

> Her kullanıcı geldiğinde API'yi çağırmayacağız.

Günde birkaç kez çekip **kendi database'imize cache edeceğiz.**

---

# 7. Maç detayları

Bir event ID'miz olduğunu düşünelim:

```text
https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=441613
```

[TheSportsDB Event Detail API](https://www.thesportsdb.com/api/v1/json/123/lookupevent.php?id=441613&utm_source=chatgpt.com)

Bu bize maç/event detaylarını verir. Free limit: **1 request**. ([TheSportsDB][1])

---

# 8. Maç istatistikleri

Bu bizim prediction platformumuz için çok değerli:

```text
https://www.thesportsdb.com/api/v1/json/123/lookupeventstats.php?id=1032723
```

Free limit: **5 request**. ([TheSportsDB][1])

---

# 9. Maç timeline

Örneğin gol, kart vb.:

```text
https://www.thesportsdb.com/api/v1/json/123/lookuptimeline.php?id=1032718
```

Free limit: **5 request**. ([TheSportsDB][1])

---

# 10. Kadro / lineup

```text
https://www.thesportsdb.com/api/v1/json/123/lookuplineup.php?id=1032723
```

Free limit: **5 request**. ([TheSportsDB][1])

---

# 11. Puan durumu

Örneğin Premier League:

```text
https://www.thesportsdb.com/api/v1/json/123/lookuptable.php?l=4328
```

Free limit: **5 request**.

Ancak dokümantasyon burada önemli bir kısıt belirtiyor: ücretsiz sezon parametresi desteği **featured soccer leagues** ile sınırlı. ([TheSportsDB][1])

---

# 12. Oyuncu

Takımdaki oyuncular:

```text
https://www.thesportsdb.com/api/v1/json/123/lookup_all_players.php?id=133604
```

Free limit: **10 request**. ([TheSportsDB][1])

Tek oyuncu:

```text
https://www.thesportsdb.com/api/v1/json/123/lookupplayer.php?id=34145937
```

([TheSportsDB][2])

---

# 13. Oyuncu istatistikleri

```text
https://www.thesportsdb.com/api/v1/json/123/lookupplayerstats.php?id=34146304
```

Free limit: **10 request**. ([TheSportsDB][2])

Bu özellikle ileride:

> Player Performance

sayfası için kullanılabilir.

---

# 14. Sezonlar

```text
https://www.thesportsdb.com/api/v1/json/123/search_all_seasons.php?id=4328
```

Free limit: **5 request**. ([TheSportsDB][1])

---

# 15. YouTube Highlights

TheSportsDB ayrıca event highlight bağlantıları da sağlayabiliyor:

```text
https://www.thesportsdb.com/api/v1/json/123/eventshighlights.php?d=2024-07-07
```

Ancak **free limit 2** ve dokümantasyon premium tarafında daha geniş kullanım olduğunu belirtiyor. ([TheSportsDB][1])

---

# 16. Live Score konusu

Burada özellikle dikkat:

**TheSportsDB free API'yi live-score altyapımız olarak kullanamayız.**

Resmi pricing sayfasına göre ücretsiz planda:

> 30 requests/minute

var; ancak **2 dakikalık livescore** özelliği premium paketlerde geliyor ve Soccer, NFL, NBA, MLB, NHL'i kapsıyor. ([TheSportsDB][3])

Yani:

```text
FREE
├── Events                 ✅
├── Teams                  ✅
├── Players                ✅
├── Leagues                ✅
├── Historical             ✅
├── Basic statistics       ✅
├── Schedule               ✅
└── Real-time livescore    ❌
```

---

# 17. Free API'nin genel limiti

Şu anda resmi dokümantasyona göre:

**30 request/minute**

Free API için geçerli. Limit aşılırsa HTTP `429` dönebiliyor. ([TheSportsDB][1])

Ama daha önemlisi **endpoint bazında ayrı free limitler var.**

Örneğin:

```text
All Sports              2
All Leagues             10
Search Teams            1
Lookup Event            1
Event Statistics        5
Event Timeline          5
Lineup                  5
Players                 10
Events Day              3
```

Dolayısıyla:

> **30 req/minute var → istediğimiz kadar veri çekebiliriz**

şeklinde düşünmemeliyiz.

---

# 18. WAGERline için nasıl kullanırım?

Ben TheSportsDB'yi şöyle konumlandırırım:

```text
                 TheSportsDB
                      │
        ┌─────────────┼──────────────┐
        ↓             ↓              ↓
      SPORTS        LEAGUES        TEAMS
        │             │              │
        └─────────────┼──────────────┘
                      ↓
                    MATCH
                      │
          ┌───────────┼───────────┐
          ↓           ↓           ↓
       RESULTS     STATS       PLAYERS
          │           │           │
          └───────────┼───────────┘
                      ↓
               OUR DATABASE
                      ↓
             Prediction Engine
```

Yani **TheSportsDB → bizim DB → kullanıcı**.

Kullanıcı doğrudan TheSportsDB API'sine gitmez.

---

# 19. Ama çok önemli: Ticari kullanım

Burada önceki cevaplarımdaki en önemli düzeltmelerden biri var.

TheSportsDB'nin güncel Terms of Service'inde free API'nin **development projects** için kullanılabileceği belirtiliyor; ayrıca App Store'a uygulama yayınlamak için paid subscriber olma şartı yazıyor. Paid kullanımda ise API üzerinden alınan içerik kullanılabiliyor ve attribution şartları bulunuyor. ([TheSportsDB][4])

Bu yüzden WAGERline gibi:

* reklam,
* sponsor,
* premium,
* yüksek trafik

hedefleyen ticari bir web platformunda **TheSportsDB Free'yi nihai production lisansı olarak kabul etmem.**

---

# Benim WAGERline için kararım

### TheSportsDB'yi kullan:

**Evet — MVP / development / data discovery / secondary source için.**

### TheSportsDB'yi tek ana production kaynağı yap:

**Hayır.**

Çünkü özellikle:

* free endpoint limitleri,
* live data'nın premium olması,
* ticari kullanım koşulları

bizi sınırlar. ([TheSportsDB][1])

### API'yi hemen test etmek için:

```text
https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Arsenal
```

[Canlı API Testi — Arsenal](https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=Arsenal&utm_source=chatgpt.com)

Bu endpoint'i tarayıcıda açarak JSON'u doğrudan görebilirsin. TheSportsDB de kendi örneklerinde bu yöntemi kullanıyor. ([TheSportsDB][5])

**Bence sıradaki iş artık API'leri tek tek toplamak değil; EN + ES + AR ve multi-sport WAGERline için hangi veri kaynağının hangi veri tipini sağlayacağını kesin bir matrise oturtmak.** Böylece gereksiz API maliyetine girmeden önce gerçekçi bir data architecture çıkarabiliriz.

[1]: https://www.thesportsdb.com/documentation?utm_source=chatgpt.com "TheSportsDB Free Sports API Documentation - TheSportsDB.com"
[2]: https://www.thesportsdb.com/docs_api_guide?utm_source=chatgpt.com "TheSportsDB Free Sports API Documentation - TheSportsDB.com"
[3]: https://www.thesportsdb.com/pricing?utm_source=chatgpt.com "Pricing - TheSportsDB.com"
[4]: https://www.thesportsdb.com/docs_terms_of_use.php?utm_source=chatgpt.com "Terms of Service Free Sports API - TheSportsDB.com"
[5]: https://www.thesportsdb.com/docs_api_examples?utm_source=chatgpt.com "TheSportsDB Tutorial and Example API Data - TheSportsDB.com"
