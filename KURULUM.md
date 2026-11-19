# Refmania — iOS ve Android kurulumu

Oyun, [Capacitor](https://capacitorjs.com) ile paketlenmiş yerel (native) bir mobil uygulamadır. Tek bir oyun kodu (`index.html`) hem Android hem iOS uygulamasını besler.

| Bilgi | Değer |
|---|---|
| Uygulama adı | Refmania |
| Paket kimliği (bundle ID) | `com.sonduduk.hakem` |
| Yönlendirme | Telefonda dikey (portrait) |
| İnternet | Gerekmez, tamamen çevrimdışı çalışır |
| Kayıt | Cihazda (Capacitor Preferences), uygulama silinene kadar kalır |

Uygulamada zaten hazır olanlar: titreşim (haptik) geri bildirimi, Android geri tuşu desteği, uygulama arka plana alınınca maçın ve karar süresinin otomatik durması, simge ve açılış ekranı, çevrimdışı yazı tipleri.

---

## 1. Android APK'yı bilgisayar kurmadan almak (önerilen)

Proje, GitHub Actions ile APK'yı bulutta derleyecek şekilde hazır (`.github/workflows/android.yml`).

1. GitHub'da yeni bir **özel (private)** depo oluştur, örneğin `son-duduk`.
2. Bu klasörü depoya gönder:

```bash
git remote add origin https://github.com/KULLANICI_ADIN/son-duduk.git
```

```bash
git branch -M main
```

```bash
git push -u origin main
```

3. GitHub'da **Actions** sekmesine gir. "Android build" iş akışı otomatik başlar (yaklaşık 5-8 dk).
4. Bitince çalışmanın sayfasındaki **Artifacts** bölümünden `son-duduk-android` dosyasını indir.
5. İçindeki `app-debug.apk` dosyasını telefona at ve aç. Android "bilinmeyen kaynaklardan yükleme" izni isteyecek; izin ver.

Bu APK test içindir. Google Play için bir sonraki adımdaki imzalı sürüm gerekir.

## 2. Google Play'e yükleme

1. [Google Play Console](https://play.google.com/console) hesabı aç (tek seferlik 25 USD).
2. Bir kez yükleme anahtarı (keystore) oluştur ve **güvenli bir yerde sakla**. Kaybedersen uygulamayı güncelleyemezsin:

```bash
keytool -genkey -v -keystore upload.jks -alias sonduduk -keyalg RSA -keysize 2048 -validity 10000
```

3. Anahtarı GitHub'a gizli değişken olarak ekle (depo > Settings > Secrets and variables > Actions):

| Secret adı | Değer |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w0 upload.jks` komutunun çıktısı (macOS'ta `base64 -i upload.jks`) |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore şifresi |
| `ANDROID_KEY_ALIAS` | `sonduduk` |
| `ANDROID_KEY_PASSWORD` | Anahtar şifresi |

4. Actions'ı yeniden çalıştır. Artık çıktıda `app-release.aab` de olacak. Bunu Play Console'da **Dahili test** kanalına yükle, sonra üretime al. Sürüm kodu her derlemede otomatik artar.

## 3. iOS (iPhone / iPad)

iOS uygulaması yalnızca **Mac + Xcode** ile derlenip imzalanabilir. Apple bunu zorunlu kılar.

Gerekenler:
- macOS ve App Store'dan **Xcode 16** veya üstü
- [Node.js 22](https://nodejs.org)
- App Store'a yüklemek için **Apple Developer Program** üyeliği (yıllık 99 USD). Sadece kendi iPhone'unda denemek için ücretsiz Apple hesabı yeterli.

Adımlar:

```bash
npm install
```

```bash
npm run ios
```

Xcode açılınca:
1. Sol tarafta **App** projesini seç, **Signing & Capabilities** sekmesinde **Team** olarak Apple hesabını seç.
2. iPhone'unu kabloyla bağla, üstteki cihaz listesinden seç ve ▶ (Run) düğmesine bas.
3. App Store için: **Product > Archive**, ardından **Distribute App > App Store Connect**. Yükleme sonrası [App Store Connect](https://appstoreconnect.apple.com) üzerinden önce **TestFlight** ile dene, sonra incelemeye gönder.

`.github/workflows/ios.yml` iş akışı, Mac'in yokken iOS kodunun hatasız derlendiğini GitHub'ın macOS sunucusunda kontrol eder (Actions > "iOS build check" > Run workflow). İmzalı App Store dosyası üretmez.

## 4. Kendi bilgisayarında Android Studio ile

```bash
npm install
```

```bash
npm run android
```

Android Studio açılınca ▶ düğmesiyle bağlı telefona ya da emülatöre kurar.

## 5. Oyunu güncellemek

Oyunun tamamı `index.html` içinde. Değişiklikten sonra:

```bash
npm run sync
```

Bu komut `www/` klasörünü yeniden üretir ve iki platforma kopyalar. Simge ya da açılış ekranını değiştirmek için `resources/` içindeki görselleri değiştirip `npm run assets` çalıştır.

## 6. Mağaza başvurusu için notlar

- **Gizlilik:** Uygulama hiçbir kişisel veri toplamaz, ağ bağlantısı kurmaz, reklam ve takip içermez. Mağaza formlarında "veri toplanmıyor" seçilebilir. Yine de her iki mağaza bir gizlilik politikası bağlantısı ister; bunun için basit bir sayfa yeterli.
- **Yaş sınırı:** Şiddet ya da kumar içermez; 4+ / Herkes uygundur.
- **İsim ve marka:** Kulüpler ve oyuncular kurgusal. Gerçek kulüp, lig ya da federasyon logosu kullanılmadı; mağaza görsellerinde de kullanma. UEFA, FIFA, Şampiyonlar Ligi gibi turnuva adları oyun içinde metin olarak geçiyor. Mağaza başlığı ve açıklamasında bu markaları öne çıkarmamak ret riskini azaltır.
- **Ekran görüntüleri:** Mağazalar 6.7" iPhone ve Android telefon ekran görüntüsü ister. Oyunu telefonda açıp bir pozisyon ekranının ve maç raporunun görüntüsünü almak en etkili seçenek.
