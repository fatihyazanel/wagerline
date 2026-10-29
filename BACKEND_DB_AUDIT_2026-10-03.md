# Backend ve API → DB denetimi

Tarih: 3 Ekim 2026. Sonuç: tüm veriler aktarılmıyor; aktarım kısmi, güncellik ve ilişkisel bütünlük sorunları var.

## Yöntem ve sınırlar

Backend giriş noktaları, sağlayıcılar, senkronizasyon işleri, HTTP route'ları ve gerçek SQLite dosyaları incelendi. DB bağlantıları OPEN_READONLY ile açıldı. `PRAGMA quick_check`, `PRAGMA foreign_key_check`, tablo sayımları, kapsam ve tarih sorguları çalıştırıldı. `node node_modules/typescript/bin/tsc --noEmit --pretty false` başarısız oldu. Uygulama verileri veya kodu değiştirilmedi; senkronizasyon başlatılmadı.

Dış sağlayıcılara bu denetimde canlı istek yapılmadı. Dolayısıyla API'nin bugünkü toplam kayıt sayısıyla bire bir mutabakat veya abonelik kapsamı doğrulanmış değildir. Yerel DB ve kod, aktarımın eksik olduğunu göstermeye yeterlidir. Sağlayıcı kısıtları hakkındaki açıklamalar kodda belirtilen sınırlardır.

## Gerçek veritabanı

Veri içeren dosya `backend/data/wagerline.db`. Backend dizininden standart başlatma ve `backend/.env` ayarı bu dosyayı hedefliyor. Kökteki `sports.db` ve `wagerline.db` şemalı ancak boş; `backend/sports.db` sıfır bayt. Eski kök backend `src/database/db.js` üzerinden farklı bir `data/wagerline.db` yolu kullanıyor. Çalışma dizinine bağlı yollar ve farklı giriş noktaları yanlış DB'nin incelenmesi/başlatılması riskini artırıyor.

| Veri | Kayıt |
|---|---:|
| Spor | 7 |
| Lig/organizasyon | 15 |
| Sezon | 17 |
| Takım | 271 |
| Oyuncu | 4.048 |
| Maç | 4.405 |
| Skor satırı | 5.592 |
| Puan tablosu satırı (`standings`) | 128 |
| Haber | 80 |
| Oyuncu sezon istatistiği | 240 |

`event_statistics`, `event_lineups`, `venues`, `referees`, `team_season_stats`, `betting_odds`, `injury_reports`, `transfer_history`, `match_events`, `live_events`, `predictions` boş. Kullanıcı ve oyunlaştırma tablolarının boşluğu dış spor API aktarımının eksikliği olarak değerlendirilmedi.

`standing_entries` de boş, ancak uygulamanın bazı akışları doğrudan `standings` tablosuna yazıyor; tek başına bu boşluk puan tablosunun hiç bulunmadığı anlamına gelmez. Benzer şekilde `event_participants` tablosunun az dolu olması tek başına maçların takımlarının eksik olduğunu göstermez: 4.405 maçın tamamında geçerli home/away takım ilişkileri var.

## Kapsam

| Spor | Takım | Oyuncu | Maç |
|---|---:|---:|---:|
| Futbol | 120 | 1.403 | 85 |
| Basketbol | 23 | 200 | 15 |
| Amerikan futbolu | 28 | 276 | 15 |
| Buz hokeyi | 60 | 1.288 | 1.409 |
| Beyzbol | 30 | 845 | 2.881 |
| Formula 1 | 10 | 36 | 0 |
| Tenis | 0 | 0 | 0 |

Premier League ve La Liga için sadece 5'er maç; Serie A, Bundesliga, Ligue 1, Süper Lig ve Eredivisie için 15'er maç var. UEFA Champions League kaydı var ama maçı yok. NHL/MLB hacmi yüksek olsa da kaynakla canlı karşılaştırma yapılmadan eksiksiz oldukları söylenemez. F1 sürücüleri players tablosunda tutuluyor.

## Öncelikli bulgular

1. **İlişkisel bütünlük bozuk.** `quick_check=ok`, fakat `foreign_key_check` 9.144 ihlal döndürüyor: player_extended_info 3.746; player_translations 3.746; player_team_assignments 1.200; player_season_stats 240; team_translations 130; team_extended_info 54; event_participants 28. Bunlar ihlal sayılarıdır, benzersiz ana varlık sayıları değildir. Örneğin 3.746 detay satırının bağlı olduğu oyuncu yok. 617 oyuncunun doğrudan team_id değeri boş; bireysel spor katılımcıları da olduğundan tamamı hata sayılmamalı.

2. **Otomatik ve manuel aktarım bağlı değil.** `backend/src/routes/providers.ts` içindeki POST `/sync` yalnızca pending cevabı oluşturuyor; iş kuyruğuna kayıt veya senkronizasyon çağrısı yok. `backend/src/workers/scheduler.ts` içindeki `registerDefaultJobs` yorumlardan ibaret ve `backend/src/index.ts` scheduler'ı başlatmıyor. LIVE_POLLING=true tek başına otomatik aktarım sağlamıyor. Ayrı canlı iş dosyaları bulunması standart sunucu başlangıcında çalıştıkları anlamına gelmiyor.

3. **Güncellik eksik.** sync_jobs içindeki 94 işin tamamı success, son finished_at `2026-09-14 19:46:20`. 3 Ekim 2026 UTC başlangıcından önce oynanması gereken 268 maç hâlâ scheduled. Maçların 2.796'sı finished, 1.609'u scheduled; skoru olmayan 1.609 kayıt scheduled grubuyla eşleşiyor, bu yüzden tüm skorsuz kayıtlar hata sayılmamalı.

4. **Sezon aktarımı kısmi.** `backend/src/providers/theSportsDb/client.ts:84` çevresindeki açıklama ücretsiz eventsseason yanıtının yaklaşık 15 kayıtla sınırlı olduğunu belirtiyor. `syncComplete_AllSports.ts:493` bu yanıtı kullanıyor. API-Football `getPlayers` tek istek yapıyor; yanıttaki paging.total bilgisi izlenmiyor (`backend/src/providers/apiFootball/client.ts:100`). `syncRealData.ts` sezon 2024, ilk 30 maç, 5 takım ve takım başına ilk 11 oyuncu gibi sınırlar içeriyor. Bu nedenle sync:real tüm verileri çekmez.

5. **F1 yarışları alınıyor fakat yazılmıyor.** `backend/src/jobs/syncComplete_AllSports.ts:1106` yarışları alıp sayısını logluyor; yarışlar için event insert/upsert döngüsü yok. Ayrıca 2025 sabit kullanılıyor. DB'de F1 maçı sıfır olması bu akışla uyumlu.

6. **Bazı eski işler gerçek veri yerine örnek veri üretiyor.** `syncFullSeason.ts`, `syncComplete_AllData.ts`, `services/sync/oddsSync.ts` ve `injurySync.ts` rastgele veri üretimi içeriyor. `services/sync/playerSync.ts` gerçek playerData doluyken kayıt yapmıyor; yalnızca boş sonuç dalında mock oyuncu eklemeyi deniyor. Bu dosyaların varlığı mevcut tüm kayıtların sahte olduğunu kanıtlamaz; gerçek aktarım için güvenilir tek giriş noktası olmadığını gösterir.

7. **DB erişim ve şema uyumsuzlukları var.** `services/data-sync.service.ts` Promise döndüren prepare().get/all/run işlemlerini await olmadan kullanıyor. `routes/standings.ts` ise sqlite3 Statement nesnesini sonuç dizisi gibi kullanıyor; ayrıca gerçek DB'de bulunmayan standings.points sütununu sorguluyor. Bu nedenle DB'de veri olsa bile API doğru sunamayabilir. `services/sync/fixtureSync.ts` ve playerSync, mevcut tablolarda olmayan provider sütunlarını kullanıyor. initDatabase yalnızca temel şema ve oyuncu-takım geçişini uyguluyor; diğer migration dosyaları otomatik uygulanmıyor.

8. **Başarı kayıtları tamlık kanıtı değil.** api_requests ve data_sources boş; kaynak bazında sayfa/toplam/atlanan kayıt mutabakatı yok. Son NHL işinde records_processed=62, records_created=1409: sayaçlar aynı birimi temsil etmiyor. Bazı sağlayıcı metotları hatayı boş diziye çeviriyor; bazı işler kısmi işleme rağmen success döndürebiliyor.

9. **Derleme geçmiyor.** TypeScript denetimi Promise/Statement erişimleri, eksik sağlayıcı metodu, implicit any hataları ve eksik node-cron modülü dahil hatalarla exit 1 verdi. Bu, çalışan herhangi bir eski dist çıktısının güncel kaynak kodla eşdeğer olduğunu da doğrulamamıza izin vermiyor.

## Önerilen düzeltme sırası

1. Tek DB yolu ve tek desteklenen aktarım giriş noktası belirle; migration'ları buna bağla.
2. Mevcut DB'nin yedeği üzerinde yetim ilişkileri kaynağa göre onar; tüm yazma bağlantılarında foreign_keys etkinleştir.
3. DB erişim biçimini ve route şema uyumsuzluklarını düzelt; TypeScript denetimini geçir.
4. Lig/sezon/sağlayıcı kapsamını açık tanımla; sayfalama, kaynak limitleri ve F1 yarış kalıcılığını tamamla.
5. Manuel endpoint ve zamanlayıcıyı gerçek iş yürütücüsüne bağla; örnek veri işlerini gerçek aktarım yolundan ayır.
6. Her aktarım için alınan, eklenen, güncellenen, atlanan, hatalı ve beklenen toplamları aynı birimde kaydet; eksik kapsamı partial olarak raporla.
7. Ardından canlı API → DB kimlik ve alan karşılaştırmasıyla tamlığı doğrula. Kota veya paket nedeniyle alınamayan veri türlerini açıkça kapsam dışı olarak belirt.
