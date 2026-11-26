# Yapılacaklar

## Telefon gezinmesi ve hız (1.5'e eklendi)
- **Gezinme çubuğu:** Telefon ekranının altında Geri ‹, Ana ekran ○, Son uygulamalar ▢ (eski ince ana ekran çizgisi kaldırıldı).
- **Son uygulamalar:** En son açılan 8 uygulama kart olarak; dokununca o uygulamaya (ve kaldığın sayfaya) geçer, ✕ ile kapatılır, "Tümünü kapat".
- **Hareketler:** Sol kenardan sağa kaydır = geri; alttan yukarı kaydır = ana ekran. Android geri tuşu telefonda bir adım geri gider.
- **Hız:** Telefon açıkken ana sayfadaki 3D sahne duruyor, telefonun arkasındaki tam ekran bulanıklık kaldırıldı, her dokunuşta telefon çerçevesi yeniden çizilmiyor (sadece ekran içeriği), tek dinleyiciyle dokunuşlar anında işleniyor, basılınca anında görsel tepki.
- **Kod:** `phMount` (dinleyiciler, hareketler), `phRender` (yalnız ekranı günceller), `phRecents`, `PH_VIEWS.__rec`, `PH.recent`. Çeviriler `i18n/*.json`.

## Telefon (1.4'e eklendi, henüz yayınlanmadı)
Hakemin cebindeki akıllı telefon. Alt menünün en sağında (telefonda), üst çubukta kasanın yanında (iPad) ve ana sayfadaki "Telefonun" kutucuğunda açılır. Eski sekmelerin hiçbiri silinmedi; telefon onlara ikinci bir kapı.
- **Uygulamalar:** Mesajlar, Takvim, Kadraj (sosyal), Manşet (haberler), Posta, Sepet (alışveriş), Emlak, Arabalar, Rota (tatil), Cüzdan, Galeri, Premium (paketler), Hakem (kariyer, teklifler, kurul, akademi kısayolları), Ayarlar.
- **Mesajlar:** Annem, Babam, Eşim, Kardeşim, Menajerim, Mahalle ekibi, Hoca ve maç sonrası teknik direktörler. Seçenekli cevaplar aileyi (`S.aile`), morali, parayı, enerjiyi, kural bilgisini etkiliyor. 1.4 hikâyeleriyle uyumlu olsun diye "kız arkadaş" yerine "eş" kullanıldı. Cevapsız mesaj 3 haftada soğuyor.
- **Moral (`S.ph.moral`, 0–100):** Maç notu, alışveriş, deneyim ve aile ilişkileriyle değişiyor, her hafta biraz sönüyor. Haftalık enerji toparlanmasını ve maç gerginliğini az da olsa etkiliyor (`phMod`).
- **Sepet:** Kurgusal markalarla 1.277 ürün (kademe başına 100–230), ekonomik/orta/lüks segment, prosedürel ürün görselleri, hediye etme (eş, anne), tekrar alınabilir deneyimler (haftada bir). Bir üst kademenin ürünleri kilitli görünüyor. Lüks ürünler daha çok moral ve biraz ün veriyor.
- **Emlak / Arabalar:** 49 ev, 63 araç, 3 tekne/uçak. Haftalık enerji veriyor (mevcut ev/araba gruplarıyla), haftalık aidat ve bakım kasadan düşüyor.
- **Telefon modelleri:** 8 model (Cepra Nova A1 çatlak ekranla başlıyor). Sepet > Elektronik'ten alınca telefonun çerçevesi, çentiği ve duvar kâğıdı değişiyor.
- **Ün daha yavaş:** Maçtan gelen pozitif itibar artışı %40 azaltıldı.
- **Ana sayfa sadeleşti:** Sosyal ve mağaza kutucukları kaldırıldı (telefonda); alt menüde Sosyal yerine Telefon var (Sosyal, Menü'de duruyor).
- **Telif temizliği:** "Emekli FIFA hakemi" ve "IFAB" metinleri kurgusal hale getirildi; tüm markalar uydurma.
- **Kod:** `index.html` içinde `TELEFON` bölümleri (görseller `PX`, katalog `phCatalog/phEstates`, arayüz `phRender`, uygulamalar `PH_VIEWS`). Çeviriler `i18n/*.json`.

## 1.4 (v1.4 dalı): Hakemin hayatı, sürprizler, Zaman Yolculuğu
- **Zaman Yolculuğu (yeni ürün `com.sonduduk.hakem.zaman`, 99,99 ₺ / 1,99 $):** Kural Akademisi'nde 5 dönem (1930, 1966, 1986, 1998, 2018), o yılların kurallarıyla (kartsız ihraç, serbest geri pas, aynı hiza ofsayt, 1998 arkadan müdahale kırmızı, altın gol, ilk VAR). Premium ve Tam Paket'e dahil değil. Pozisyonlar dönem kuralına uyan sabit tohumlarla üretiliyor (`ZAMAN`, `ERA_OV`).
  - **App Store Connect'te ürünü oluştur:** `python3 scripts/asc_iap.py yeni com.sonduduk.hakem.zaman` (ABD 1,99 $ taban, Türkiye elle 99,99 ₺). Sonra 1.4 sürümüyle birlikte incelemeye gönder.
  - Android'de satın alma henüz kapalı (`N.iapOn = isIOS`).
- **Yeni hikâyeler (STORIES):** gece telefonu (+2 devam), pazar yemeği, eşinle kriz, taksici, TV stüdyosu (+uyarı), sahte hesap, podcast, küçük taraftardan mektup (hatalı ve takımın kaybettiği maçtan sonra), genç hakemin ilk büyük maçı (mevcut "genc" hikâyesinin devamı, Necdet Hoca'ya selam).
- **Aile göstergesi (`S.aile`):** hikâye seçimleri etkiliyor, haftalık enerji toparlanmasını değiştiriyor, 35 altına düşünce kriz hikâyesi geliyor. Kariyer > Hayatın panelinde.
- **Maç içi sürprizler (`OLAYLAR`, `runOlay`):** elektrik kesintisi, kaptanlarla konuşma, TD'nin yazı tahtası (TD'ye kırmızı), sağanak (sadece yağmurlu maçta), maskot, tribünden çakmak. Maçların ~%40'ında bir tane.
- **Nefes mini oyunu (`sleepGame`):** derbi ya da büyük maç öncesi %35 ihtimalle; sonucu karar süresini +2 / -3 sn değiştiriyor.
- **Viral an:** büyük maçta kırmızı kart sonrası %30 ihtimalle "Refmania pozu" paylaşımı ve takipçi.
- **Kimlik:** Düdük koleksiyonu (her efsane maç ve dönem bir düdük), Kırmızı kart müzesi (Kariyer), kart gösterme stili ve düdük çalışı (Ayarlar), DFF kokartı alınca formada rozet.
- **Tuttuğun takım (Ayarlar):** o takımın maçlarında gerginlik artar, hataların yönü izlenir (Tarafsızlık), taraflı görünürsen kurul güveni düşer.
- **Son maç:** emeklilikte veda töreni ve kariyer özeti.
- Topluluk/rekabet fikirleri (Hakem Mahkemesi, eşleşmeli düello, hakem ligi) sunucu gerektirdiği için yapılmadı.

## 1.4: Premium'u cazip yapma
- **Premium Molası** (eski adı Premium Saati): 10 ödüllü reklamla artık 1 saat değil **20 dakika** reklamsız oyun. 5. maçtan sonra bir kez hediye ediliyor (sadece reklamlar açıkken).
- **Kişisel ödeme ekranı:** Son 7 günde 3 veya daha fazla reklam izleyen oyuncuya "Son 7 günde X reklam izledin, yaklaşık Y dakika" satırı gösteriliyor (`adLog`, `pwStatHTML`).
- **Hakem Raporu (Gelişim sekmesi):** Pozisyon türüne göre doğruluk, zayıf noktalar ve kural maddesi, son hatalar. Bedava oyuncu sadece özeti görüyor, ayrıntılar Premium'da. Veriler 1.4'ten sonra oynanan maçlardan toplanmaya başlıyor (`S.dstat`, `S.derr`).
- **Günün pozisyonu arşivi (Premium):** Geçmiş günler (en fazla 60), seriyi ve günlük ödülü etkilemiyor.
- **Efsane Maçlar (Kural Akademisi):** 10 hazır senaryo, sabit tohumla üretiliyor, pozisyon başına 45 sn, 3 yıldız. "Derbinin son dakikaları" ücretsiz, diğerleri Tam Paket'e dahil. İlk tamamlamada Kural bilgisi +0.2.
- **Hakem kimliği (Premium):** 4. kariyer slotu, 2 yeni düdük tonu (Ayarlar), paylaşım metninde Premium rozeti, üst çubukta isim yanında taç.
- Paket ekranındaki avantaj listeleri yeni içeriklerle güncellendi. Çeviriler (en/de/es) `i18n/*.json` dosyalarına eklendi. 1.4 sürüm notları 4 dilde yazıldı.
- **App Store Connect ürün metinleri:** `scripts/asc_iap.py` içinde güncellendi. Göndermek için: `python3 scripts/asc_iap.py metin` (ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_PATH ortam değişkenleriyle). `metin` modu sadece ürün adı, açıklama ve inceleme notunu değiştirir; fiyatlara ve ülkelere dokunmaz.

## 1.4: Puan isteme penceresi
iOS'ta StoreKit, Android'de Play In-App Review ile sistemin kendi puan penceresi açılıyor.
- **Ne zaman:** 8.5+ notlu maç ya da 7/14/30 günlük seri sonrası, merkeze dönünce. O an Premium teklifi çıkacaksa pencere açılmıyor (ikisi üst üste gelmesin diye).
- **Sınırlar:** En az 5 maç oynanmış olmalı, 60 günde en fazla bir, yılda en fazla 3 kez.
- **Dosyalar:** `index.html` (`reviewMoment`, `flushReview`), `native/native.js` (`N.review`), `ios/App/App/InAppReviewPlugin.swift` + `MainViewController.swift` (Main.storyboard bu sınıfa bağlandı), `android/.../InAppReviewPlugin.java` + `MainActivity.java`, `android/app/build.gradle` (`com.google.android.play:review:2.0.2`).
- **Derleme:** `npm run sync`, sonra Xcode ve Android Studio'da derle. Bu değişiklikler henüz derlenip test edilmedi.
- **Test:** iOS'ta Xcode'dan çalıştırınca pencere her seferinde çıkar. TestFlight'ta hiç çıkmaz, App Store'da Apple'ın kendi sıklık sınırı uygulanır. Android'de sadece Play'den (dahili test dahil) yüklenen sürümde çıkar.
- **Hızlı deneme:** Safari Web Inspector konsolunda `RV={last:0,n:[]}; PENDING_REVIEW=true; render()`.

## 1.4: ASO ve Premium satışı
- **Yeni mağaza dilleri:** `en-GB` (Türkiye, Almanya, İspanya ve çoğu ülkede ikinci dil olarak aranır; anahtar kelimelerinde Türkçe ek kelimeler var) ve `es-MX` (ABD'de ikinci dil olarak aranır; anahtar kelimelerde İngilizce ek kelimeler var). Görseller en ve es klasörlerinden kopyalanıyor (`ios-store-listing.yml`).
- **Türkçe alt başlık:** "VAR ve Penaltı: Futbol Oyunu". Anahtar kelimeler ad ve alt başlıktaki kelimeleri tekrarlamayacak şekilde yenilendi; tanıtım metni, açıklama ve sürüm notlarında telefon var.
- **Mağaza görselleri:** 10 görsel; 3. sırada "Hakemin hayatı cebinde" (telefon ana ekranı).
- **Premium'un telefondaki ayrıcalıkları:** Sepet, Emlak, Arabalar ve deneyimlerde %10 indirim; 130 ürün ve ilan 👑 Premium'a özel (`it.pex`). Ürün sayfasında "Premium üyelere X ₺" satırı. Paket ekranına yeni avantaj satırı eklendi.
- **Önerilen, yapılmadı (karar bekliyor):** Türkiye'de Premium fiyatını düşürmek (App Store Connect > ülke bazında fiyat); tüketilebilir para paketi (yeni ürün, ayrı inceleme).

## Tamamlandı (1.3.1)

### 1. Mağaza açıklamasındaki "reklam yok" cümlesi düzeltildi
1.1'den kalma cümle, 1.2'den beri gerçeği yansıtmıyor (oyunda ödüllü/geçiş reklamları ve Premium satın alımı var).
Yanlış mağaza bilgisi App Store kurallarına aykırı ve kötü yorum riski taşıyor.
Açıklama yalnızca yeni sürümle değişebiliyor; bir sonraki gönderimde bu metinler yüklenecek.

Dosyalar: `fastlane/metadata/*/description.txt`, 37. satır.

| Dil | Şu anki (yanlış) | Yeni |
|---|---|---|
| tr | Oyun ücretsizdir; reklam ve uygulama içi satın alma içermez. | Oyun ücretsizdir. İsteğe bağlı ödüllü reklamlar ve Premium içerir. |
| en-US | The game is free, with no ads and no in-app purchases. | The game is free. It includes optional rewarded ads and a Premium upgrade. |
| de-DE | Das Spiel ist kostenlos, ohne Werbung und ohne In-App-Käufe. | Das Spiel ist kostenlos. Es enthält optionale Belohnungswerbung und ein Premium-Upgrade. |
| es-ES | El juego es gratuito, sin anuncios ni compras dentro de la app. | El juego es gratuito. Incluye anuncios opcionales con recompensa y una mejora Premium. |

Not: Maç sonlarında geçiş reklamı da çıkıyor (her 2 maçta bir, ilk 3 maçta yok). İstenirse metne "maç aralarında reklam" da eklenebilir.

## İzlenecekler
- İlk 1–2 hafta: RevenueCat (Premium satışları, iadeler) ve AdMob (reklam geliri) rakamlarına bak.
- Türkiye için daha düşük Premium fiyatı denemeyi değerlendir (App Store Connect → ülke bazında fiyat).
- Mağaza ekran görüntüleri 1.3 için yenilendi (9 görsel, Günün pozisyonu dahil); 1.3.1 ile yüklendi.
- `main` 21 Kasım'da `v1.4` ile birleştirildi; artık güncel kod `main`'de.

## Sonraki güncelleme: 3 Saniye, VAR odası, Hakem dolabı
- **3 Saniye (ana sayfa):** Her gün herkese aynı 3 pozisyon. Pozisyon temas anında donar, iki seçenekten birini 3 saniyede seç. Sonuç 🟩🟥⬛ kartıyla paylaşılır; ayrı seri tutulur (`refmania_3sn`). Doğru başına para ve kural bilgisi. Günde 3 ekstra tur (ödüllü reklam, Premium'da reklamsız).
- **VAR odası:** Sahadaki karar verilmiş geliyor (%55 ihtimalle yanlış, yalnız VAR'ın bakabileceği türlerde). Oyuncu 5 kameradan izler; "Kontrol tamam" ya da "Müdahale et + doğru kararı öner". 5 olay, 35 sn/olay, 10 puan. "Görüntü analizi" olguları açar ama o olayda en fazla 1 puan. Ödül: para, kural bilgisi, kurul güveni. Günde 1 vardiya ücretsiz; fazlası ödüllü reklam ya da Premium (sınırsız).
- **Hakem dolabı:** 13 forma, 8 krampon, 3 düdük tonu. Açılma yolları: ücretsiz, klasman (3. Lig / 2. Lig / 1. Lig), oyun parası, Premium (Karbon, Zümrüt, Pembe forma, altın krampon, keskin/derin düdük), Tam Paket (Altın, Gece mavisi, Buz forma, gümüş krampon). Forma ve krampon maçta ve tekrarlarda görünür; önizleme oyunun kendi 3D hakem figürüyle. Takım renkleriyle çakışırsa standart forma.
- Paywall'a "VAR odası sınırsız" ve "Özel hakem dolabı" satırları eklendi. EN/DE/ES çevirileri yapıldı.
