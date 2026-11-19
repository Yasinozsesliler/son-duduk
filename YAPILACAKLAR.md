# Yapılacaklar

## Sıradaki sürümde (1.3.1 veya 1.4) mutlaka

### 1. Mağaza açıklamasındaki "reklam yok" cümlesini düzelt
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
- Mağaza ekran görüntüleri 1.2'den; Günün pozisyonu ve yeni oyuncu modelleri görünmüyor.
- `main` dalı 15 Kasım'da kaldı; güncel kod `v1.3` dalında. Birleştirilmeli.
