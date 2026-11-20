# Yapılacaklar

## 1.4 (v1.4 dalı): Premium'u cazip yapma
- **Premium Molası** (eski adı Premium Saati): 10 ödüllü reklamla artık 1 saat değil **20 dakika** reklamsız oyun. 5. maçtan sonra bir kez hediye ediliyor (sadece reklamlar açıkken).
- **Kişisel ödeme ekranı:** Son 7 günde 3 veya daha fazla reklam izleyen oyuncuya "Son 7 günde X reklam izledin, yaklaşık Y dakika" satırı gösteriliyor (`adLog`, `pwStatHTML`).
- **Hakem Raporu (Gelişim sekmesi):** Pozisyon türüne göre doğruluk, zayıf noktalar ve kural maddesi, son hatalar. Bedava oyuncu sadece özeti görüyor, ayrıntılar Premium'da. Veriler 1.4'ten sonra oynanan maçlardan toplanmaya başlıyor (`S.dstat`, `S.derr`).
- **Günün pozisyonu arşivi (Premium):** Geçmiş günler (en fazla 60), seriyi ve günlük ödülü etkilemiyor.
- **Efsane Maçlar (Kural Akademisi):** 10 hazır senaryo, sabit tohumla üretiliyor, pozisyon başına 45 sn, 3 yıldız. "Derbinin son dakikaları" ücretsiz, diğerleri Tam Paket'e dahil. İlk tamamlamada Kural bilgisi +0.2.
- **Hakem kimliği (Premium):** 4. kariyer slotu, 2 yeni düdük tonu (Ayarlar), paylaşım metninde Premium rozeti, üst çubukta isim yanında taç.
- Paket ekranındaki avantaj listeleri yeni içeriklerle güncellendi. Çeviriler (en/de/es) `i18n/*.json` dosyalarına eklendi. 1.4 sürüm notları 4 dilde yazıldı.
- **App Store Connect:** Tam Paket ve Premium ürün açıklamalarını yeni avantajlara göre güncelle (Efsane Maçlar, Hakem Raporu, arşiv).

## 1.4: Puan isteme penceresi
iOS'ta StoreKit, Android'de Play In-App Review ile sistemin kendi puan penceresi açılıyor.
- **Ne zaman:** 8.5+ notlu maç ya da 7/14/30 günlük seri sonrası, merkeze dönünce. O an Premium teklifi çıkacaksa pencere açılmıyor (ikisi üst üste gelmesin diye).
- **Sınırlar:** En az 5 maç oynanmış olmalı, 60 günde en fazla bir, yılda en fazla 3 kez.
- **Dosyalar:** `index.html` (`reviewMoment`, `flushReview`), `native/native.js` (`N.review`), `ios/App/App/InAppReviewPlugin.swift` + `MainViewController.swift` (Main.storyboard bu sınıfa bağlandı), `android/.../InAppReviewPlugin.java` + `MainActivity.java`, `android/app/build.gradle` (`com.google.android.play:review:2.0.2`).
- **Derleme:** `npm run sync`, sonra Xcode ve Android Studio'da derle. Bu değişiklikler henüz derlenip test edilmedi.
- **Test:** iOS'ta Xcode'dan çalıştırınca pencere her seferinde çıkar. TestFlight'ta hiç çıkmaz, App Store'da Apple'ın kendi sıklık sınırı uygulanır. Android'de sadece Play'den (dahili test dahil) yüklenen sürümde çıkar.
- **Hızlı deneme:** Safari Web Inspector konsolunda `RV={last:0,n:[]}; PENDING_REVIEW=true; render()`.

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
- `main` dalı 15 Kasım'da kaldı; güncel kod `v1.3` dalında. Birleştirilmeli.
