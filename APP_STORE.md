# Son Düdük'ü App Store'a çıkarma rehberi

Proje teknik olarak hazır: iOS ayarları, gizlilik bildirimi, ekran görüntüleri, mağaza metinleri ve
uygulamayı **Mac'e ihtiyaç duymadan** imzalayıp App Store Connect'e yükleyen GitHub Actions iş akışı mevcut.
Aşağıdaki adımları yalnızca sen yapabilirsin, çünkü Apple hesabına ve ödemeye bağlılar.

Toplam süre: hesap onayı hariç yaklaşık 1–2 saat.

---

## 1. Apple Developer Program üyeliği (yıllık 99 USD)

1. https://developer.apple.com/programs/enroll/ adresinden Apple ID'nle kaydol.
   - **Bireysel** kayıt yeterli; mağazada satıcı olarak adın görünür.
   - Şirket adıyla görünmek istersen D-U-N-S numarası gerekir (daha uzun sürer).
2. Onay genellikle 24–48 saat sürer.
3. Onaydan sonra developer.apple.com → **Membership details** sayfasındaki **Team ID**'yi (10 karakter) not al.

## 2. App Store Connect'te uygulamayı oluştur

1. https://appstoreconnect.apple.com → **Uygulamalar** → **+** → **Yeni Uygulama**.
2. Platform: iOS · Ad: `Son Düdük: Hakem Kariyeri` · Birincil dil: Türkçe ·
   Paket kimliği: `com.sonduduk.hakem` (listede yoksa önce developer.apple.com → Identifiers → **+** → App IDs ile bu kimliği oluştur) ·
   SKU: `sonduduk-ios-1` · Kullanıcı erişimi: Tam erişim.
3. **Anlaşmalar, Vergi ve Bankacılık**: ücretsiz uygulama için yalnızca ücretsiz anlaşmayı kabul etmen yeterli.
   Ücretli satacaksan "Paid Apps" anlaşması, banka ve vergi bilgileri de gerekir.

## 3. App Store Connect API anahtarı oluştur

1. App Store Connect → **Kullanıcılar ve Erişim** → **Entegrasyonlar** → **App Store Connect API** → **Team Keys** → **+**.
2. Ad: `GitHub Actions` · Erişim: **Admin**. Bulut imzalama sertifikası oluşturabilmek için Admin rolü gerekir.
3. **AuthKey_XXXXXXXXXX.p8** dosyasını indir. Bu dosya **yalnızca bir kez** indirilebilir, güvenli bir yerde sakla.
4. Sayfadaki **Key ID** ve en üstteki **Issuer ID** değerlerini not al.

## 4. Projeyi GitHub'a yükle

> **Kısa yol:** GitHub'da boş bir depo açıp adını Claude'a söylersen, Claude depoyu bu oturuma bağlayıp kodu kendisi yükleyebilir. O durumda aşağıdaki `git` komutlarını atla, yalnızca secret'ları ekle.

1. https://github.com/new adresinden **private** bir depo aç (ör. `son-duduk`).
2. Bilgisayarında zip'i aç ve klasörde şunları çalıştır:
   ```bash
   git remote add origin https://github.com/<kullanıcı-adın>/son-duduk.git
   ```
   ```bash
   git push -u origin HEAD:main
   ```
   (Zip içindeki proje zaten bir git deposu.)
3. Depo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret** ile dört gizli değer ekle:

   | Ad | Değer |
   |---|---|
   | `APPLE_TEAM_ID` | 1. adımdaki Team ID |
   | `ASC_KEY_ID` | 3. adımdaki Key ID |
   | `ASC_ISSUER_ID` | 3. adımdaki Issuer ID |
   | `ASC_KEY_P8_BASE64` | .p8 dosyasının base64 hali (aşağıya bak) |

   .p8 dosyasını base64'e çevirmek için:
   - **Mac/Linux:**
     ```bash
     base64 -i AuthKey_XXXXXXXXXX.p8 | tr -d '\n'
     ```
   - **Windows PowerShell:**
     ```bash
     [Convert]::ToBase64String([IO.File]::ReadAllBytes("AuthKey_XXXXXXXXXX.p8"))
     ```
   Çıkan uzun metni olduğu gibi yapıştır.

## 5. Gizlilik ve destek sayfalarını yayınla

1. `docs/privacy.html` ve `docs/support.html` içindeki `ILETISIM_EPOSTASI` yazan yerlere iletişim e-postanı yaz, commit'leyip push et.
2. Depo → **Settings** → **Pages** → Source: **Deploy from a branch** → Branch: `main`, klasör: `/docs` → Save.
   - GitHub Pages ücretsiz planda yalnızca **public** depolarda çalışır.
   - Depon private ise iki sayfayı ayrı bir public depoya koy ya da başka bir yerde yayınla.
3. Birkaç dakika sonra sayfalar şu adreslerde açılır:
   - `https://<kullanıcı-adın>.github.io/son-duduk/privacy.html`
   - `https://<kullanıcı-adın>.github.io/son-duduk/support.html`

## 6. Uygulamayı derle ve yükle (Mac gerekmez)

1. Depo → **Actions** → **iOS release (TestFlight / App Store)** → **Run workflow**.
2. Sürüm `1.0.0` olarak kalsın ve çalıştır. Süre yaklaşık 10–20 dakika.
3. Yeşil tik çıktıktan 10–30 dakika sonra derleme App Store Connect → **TestFlight** sekmesinde görünür.
4. İstersen TestFlight'a kendini test kullanıcısı olarak ekle ve iPhone'una **TestFlight** uygulamasıyla kur.
5. Sonraki güncellemeler için iş akışını yeni bir sürüm numarasıyla (ör. `1.0.1`) tekrar çalıştır. Build numarası otomatik artar.

## 7. Mağaza sayfasını otomatik doldur

Metinler (`fastlane/metadata/tr/`) ve 14 ekran görüntüsü (`store/screenshots/`) tek tıkla yüklenir:

1. Depo → **Actions** → **iOS store listing (metadata + screenshots)** → **Run workflow**.
2. Sürüm `1.0.0` olarak kalsın; "incelemeye gönder" kutusunu **ilk seferde boş bırak**. Süre yaklaşık 5–10 dakika.
3. App Store Connect'te sayfanın dolduğunu kontrol et.

## 8. Elle yapılacak 3 kısa ayar (API ile yapılamıyor, ~5 dk)

App Store Connect'te:

1. **Fiyatlandırma ve Kullanılabilirlik** → fiyat: Ücretsiz (veya istediğin fiyat), ülkeler: Tümü.
2. **App Gizliliği** → "Veri toplamıyoruz" → Yayınla.
3. **Uygulama Bilgileri** → **Yaş Derecelendirmesi** → tüm sorulara "Yok" → 4+.

Ardından **iOS Uygulaması 1.0.0** sayfasında **Derleme** bölümünden TestFlight'taki derlemeyi seç.

## 9. İncelemeye gönder

İki yol var:

- App Store Connect'te **İncelemeye Gönder** düğmesine bas, ya da
- **iOS store listing** iş akışını bu kez "incelemeye gönder" kutusu **işaretli** olarak tekrar çalıştır.

Apple incelemesi genellikle 1–3 gün sürer. Onaylanınca uygulama App Store'da yayına girer.

## Sorun çıkarsa

| Hata | Çözüm |
|---|---|
| `... secret is missing` | 4. adımdaki dört secret'tan biri eksik veya adı yanlış. |
| `No profiles for 'com.sonduduk.hakem'` / `No Accounts` | API anahtarının rolü **Admin** olmalı; Bundle ID developer.apple.com'da kayıtlı olmalı. |
| `Cloud signing permission error` | Developer hesabında **Account Holder** veya Admin olarak giriş yapıp Certificates sayfasını bir kez açıp kabul etmen gereken bir sözleşme olabilir. |
| Bundle ID başka biri tarafından alınmış | `capacitor.config.json` ve `ios/App/App.xcodeproj/project.pbxproj` içindeki `com.sonduduk.hakem`'i kendi kimliğinle (ör. `com.<adın>.sonduduk`) değiştir. |

## Marka adları

Oyundaki gerçek lig ve kurum adları kurgusal karşılıklarıyla değiştirildi (Apple kuralı 5.2.1):

| Gerçek | Oyunda |
|---|---|
| Premier League, LaLiga, Serie A, Bundesliga, Ligue 1, Liga Portugal, Eredivisie | Prestij Lig, Liga Suprema, Serie Oro, Meisterliga, Ligue Élite, Liga Lusitana, Topdivisie |
| Süper Lig, Saudi Pro League, Yunanistan Süper Lig | Zirve Lig, Çöl Pro Lig, Ege Lig |
| FIFA, UEFA | DFF (Dünya Futbol Federasyonu), AFK (Avrupa Futbol Konfederasyonu) |
| Şampiyonlar Ligi, Avrupa Ligi, Konferans Ligi, Uluslar Ligi | Elitler Ligi, Avrupa Kupası, Kıta Kupası, Milletler Kupası |
| Dünya Kupası, EURO, Olimpiyatlar, Kulüpler Dünya Kupası | Dünya Şampiyonası, Avrupa Şampiyonası, Dünya Yaz Oyunları, Kulüpler Dünya Şampiyonası |
| TFF, FA, RFEF, FIGC, DFB, FFF, FPF, KNVB, IFAB | TFB, EFB, İFF, İTFB, AFB, FFB, PFB, HFB, "Oyun Kuralları" |

Takım, oyuncu ve hakem adları zaten kurgusaldı.
