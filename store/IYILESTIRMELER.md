# Refmania — İyileştirme listesi (1.3.1 sonrası)

## Bu commit'te yapılanlar
- `fastlane/metadata/en-US`, `de-DE`, `es-ES`: ad, alt başlık, anahtar kelimeler, tanıtım metni ve açıklama (Apple karakter sınırları kontrol edildi). 1.3.1'deki özelliklere göre yazıldı (16 pozisyon türü, Günün Pozisyonu, Konfor modu, rüşvet, Premium).
- `ios/App/App/Info.plist`: `CFBundleLocalizations` listesine `en`, `de`, `es` eklendi.
  - App Store sayfası dil listesi hâlâ sadece Türkçe görünürse: Xcode → Project → Info → Localizations'a English, German, Spanish ekle.
- Yüklemek için: `fastlane deliver --skip_binary_upload --skip_screenshots`, ya da metinleri App Store Connect'e elle kopyala.

## Kodda yapılacaklar (güncel kod push edildikten sonra)
1. **Puan isteme**: Terfi ya da yüksek maç notu sonrasında, en fazla 3 ayda bir. iOS: SKStoreReviewController (örn. `@capacitor-community/in-app-review`), Android: Play In-App Review.
2. **Satın alma paketleri**: 4 ürün (Tam Paket Yükseltmesi / Tam Paket Fırsatı / Tam Paket / Premium) → 2 net seviye. Her birinin altına tek cümleyle ne içerdiğini yaz; "Fırsat" sadece süreli göster.
3. **Çökme ve analiz**: İlk 10 dakikada nerede bırakılıyor, ölçülebilir olsun.
4. **Günün Pozisyonu**: Toplu sonuç ("%62 penaltı dedi") için küçük bir çevrimiçi katman.
5. **Çapraz tanıtım**: Diğer oyunlarda Refmania banner'ı, Refmania'da "Diğer oyunlarımız".

## App Store Connect'te kontrol edilecekler
- **Gizlilik etiketi**: Konum ile takip beyanı gerçekten gerekli mi? (reklam SDK'sı ayarları)
- **Yaş derecelendirmesi**: Rüşvet/şike teması var ama derece 4+; anketi tekrar gözden geçir.
- `fastlane/metadata/tr/description.txt` hâlâ 1.0 metni ("reklam yok, veri toplanmaz", "13 pozisyon türü"); App Store'daki güncel metinle eşitle.
