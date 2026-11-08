# Alan adı değişimi ve SEO yayın işlemleri

## Hazır teknik yapı

`wagerline-app/.env.seo.example` dağıtım ortamına uygulanır. `SITE_URL` tek HTTPS origin; `PREVIOUS_SITE_URLS` kontrolünüzdeki eski alan adları ve www alias'larının virgüllü listesidir. Provider anahtarları `NEXT_PUBLIC_*` değişkenlerine yazılmaz. Alan adı kodda sabit değildir.

1. Yeni domain DNS ve TLS sertifikasını dağıtıma bağlayın. Eski domainlerin DNS/TLS hizmetini koruyup aynı dağıtıma yönlendirin. Domain değiştirmek DNS veya sertifikayı otomatik taşımaz.
2. `SITE_URL`, varsa `PREVIOUS_SITE_URLS`, `GOOGLE_SITE_VERIFICATION`, backend origin ve kalıcı yazılabilir `SEO_LOG_DIR` ayarlayın. Frontend'i `npm.cmd run build` ile yeniden derleyip süreç yöneticisiyle başlatın. Backend erişimini kontrol edin.
3. `wagerline-app` dizininde `node scripts/seo-release-check.cjs` çalıştırın. Dış ağdan tekrarlayın. HTTP eski-domain trafiğini HTTPS'e taşıyan edge/CDN kuralını da doğrulayın. Eski adres `/discover?page=2` yeni domainde aynı yol ve sorguya tek 301/308 adımıyla gitmelidir.
4. CORS, OAuth callback, cookie domain/SameSite, e-posta bağlantıları ve CDN/WAF ayarlarını yeni gerçek domaine göre kontrol edin. Mevcut oturumların farklı domain cookie'lerini otomatik devralması beklenmez. Hesap/ödül verisi DB'de korunur.
5. Search Console'da eski ve yeni mülkiyeti doğrulayın. `GSC_SITE_URL` gerçek property (`sc-domain:...` veya HTTPS URL-prefix), `GSC_ACCESS_TOKEN` Search Console yetkili OAuth erişim token'ıdır. Token'ı rapora, repoya veya istemciye koymayın.
6. `node scripts/search-console.cjs status`; ardından `submit`. Submit `/sitemap.xml` gönderir. `inspect` varsayılan `/discover` adresinin Google indeks bilgisini okur; `GSC_INSPECT_PATH` ile lig/maç/es/ar örnekleri incelenir. URL Inspection API canlı test veya indeks garantisi değildir.
7. Gerçek domain taşınıyorsa Search Console arayüzündeki uygun **Adres Değişikliği** işlemini uygulayın. Eski domain yönlendirmelerini en az bir yıl koruyun. Sitemap'e yalnız yeni canonical URL'ler girer.
8. Gerçek URL'leri Google Rich Results Test / Schema Validator ile kontrol edin. Bot User-Agent taklidi kimlik doğrulaması değildir; CDN loglarında Google IP listesi veya çift yönlü DNS ile doğrulanmış botları ayırın.

## İşletim ve başarı ölçümü

- `node scripts/report-seo-telemetry.cjs`: son 28 gün, cihaz/route bazında p75 LCP/INP/CLS. 50 ölçüm altı yetersiz örnek olarak gösterilir; yerel önizleme ayrı tutulur. Bu eşik Google CrUX uygunluk onayı değildir.
- `SEO_LOG_DIR` kalıcı disk/log toplama sistemiyle saklanmalı; günlük dosya sınırı 20 MB. Log saklama/silme planını dağıtım işletimi kurar. IP, cookie ve URL sorguları bu telemetride tutulmaz.
- `node scripts/search-console.cjs performance`: son tamamlanmış 28 güne ait sayfa/sorgu performansı (en fazla 25.000 satır; tüm trafik dökümü değildir). Haftalık marka dışı sorgu, dil, gösterim/tıklama ve indeks kapsamı karşılaştırılır.
- CDN/load-balancer tüm isteklerin HTTP durumlarını kaydetmeli. Uygulama hata olayları tüm HTTP trafiğinin paydası değildir. 5xx oranı >%1/5 dakika, kaynak gecikmesi ve sitemap 503 için operasyon alarmı kurulmalıdır.
- İnce kayıtları Search Console verisiyle gözden geçirin. Kaynak bulunmayan veri uydurulmaz. Rehberlerin editoryal sorumlusu kuruluş olarak açıklanır; gerçek kişi atanırsa kimliği ve inceleme tarihi yalnız doğrulandıktan sonra eklenir.
- Doğrulanmış bot taraması, Google indeks kararı, gerçek saha verisi ve organik trafik yalnız yayın sonrasında ölçülebilir. Yerel test geçmesi bunların gerçekleştiği anlamına gelmez.
