# Refmania'yı Google Play'e çıkarma rehberi

Teknik hazırlık bitti:
- Google Play satın alma (Play Billing) Android'de açık.
- İmzalı `.aab` üreten bir iş akışı var.
- 6 dilde mağaza metinleri, ekran görüntüleri, simge ve öne çıkan grafik hazır.

Aşağıdaki adımlar senin Google hesabını gerektirdiği için senin elinde.
Yanında 🤖 olan adımları, gerekli anahtarlar eklendikten sonra Claude çalıştırabilir.

---

## 0. Bilmen gereken önemli kural (kişisel hesaplar)

13 Kasım 2023'ten sonra açılmış **kişisel** geliştirici hesaplarında Google şunu şart koşuyor:
- Uygulamanın, **en az 12 test kullanıcısıyla 14 gün boyunca kapalı testte** kalması gerekiyor.
- Bu süre dolmadan "Üretim" (herkese açık yayın) başvurusu yapılamaz.
- Kuruluş (şirket) hesaplarında bu kural yok, ama D-U-N-S numarası gerekiyor.

Bu yüzden plan şöyle: **Dahili test → Kapalı test (12 kişi, 14 gün) → Üretim.**

## 1. Google Play geliştirici hesabı

1. https://play.google.com/console/signup adresinden hesap aç. Tek seferlik 25 USD.
2. Kimlik doğrulamasını tamamla. Birkaç gün sürebilir.
3. Satış yapacağın için: **Ayarlar → Ödeme profili** oluştur. Banka ve vergi bilgileri gerekiyor.

## 2. Uygulamayı oluştur

Play Console → **Uygulama oluştur**:
- Uygulama adı: `Refmania: Hakem Simülatörü`
- Varsayılan dil: **Türkçe – tr-TR**
- Uygulama veya oyun: **Oyun**
- Ücretsiz veya ücretli: **Ücretsiz** (uygulama içi satın alma yine olabilir)
- Beyanları onayla → **Uygulama oluştur**

## 3. İmza anahtarını GitHub'a ekle

Claude'un gönderdiği `android-anahtar.zip` içinde **OKU-BENI.txt** var.
GitHub → depo → **Settings → Secrets and variables → Actions → New repository secret** ile iki değer ekle:

| Name | Değer |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | `ANDROID_KEYSTORE_BASE64.txt` dosyasının tamamı |
| `ANDROID_KEYSTORE_PASSWORD` | `ANDROID_KEYSTORE_PASSWORD.txt` dosyasının içeriği |

Zip'i güvenli bir yerde sakla. Bu "yükleme anahtarı"; kaybolursa Play Console'dan sıfırlanabilir.

## 4. İlk derlemeyi elle yükle (yalnızca bir kez) 🤖

Google, yeni bir uygulamanın **ilk** derlemesinin Play Console'dan elle yüklenmesini istiyor.

1. 🤖 GitHub → **Actions → Android release (Google Play) → Run workflow**.
   - version: `1.5.0`
   - Diğerlerini olduğu gibi bırak.
2. Bitince depo → **Releases** → `android-v1.5.0-…` → `.aab` dosyasını indir.
3. Play Console → **Test et ve yayınla → Test → Dahili test → Yeni sürüm oluştur**.
4. "Google Play Uygulama İmzalama" sorulursa **"Google tarafından oluşturulan anahtarı kullan"** → Devam.
5. `.aab` dosyasını sürükle-bırak → Sürüm notu yaz (ör. "İlk sürüm") → **Sonraki → Kaydet ve yayınla**.
6. **Test kullanıcıları** sekmesinde bir e-posta listesi oluştur ve kendini ekle. "Katılım bağlantısı" ile telefonuna kur.

## 5. Uygulama içi ürünleri oluştur

İlk derleme yüklendikten sonra Play Console → **Para kazanma → Ürünler → Uygulama içi ürünler** açılır.
Aşağıdaki 5 ürünü **birebir aynı kimliklerle** oluştur ve her birini **Etkinleştir**:

| Ürün kimliği | Ad | Fiyat (taban) |
|---|---|---|
| `com.sonduduk.hakem.premium` | Premium | 3,99 USD |
| `com.sonduduk.hakem.tampaket` | Tam Paket | 5,99 USD |
| `com.sonduduk.hakem.firsat` | Tam Paket Fırsatı | 2,99 USD |
| `com.sonduduk.hakem.yukseltme` | Tam Paket'e Yükseltme | 2,99 USD |
| `com.sonduduk.hakem.zaman` | Zaman Yolculuğu | 1,99 USD (Türkiye: 99,99 TL) |

Açıklamalar için App Store'daki ürün metinlerini kullanabilirsin.

Satın almayı ücretsiz denemek için: **Ayarlar → Lisans testi** → kendi Gmail adresini ekle.

## 6. Otomatik yükleme için servis hesabı (bir kez, ~10 dk)

Bundan sonraki her güncellemeyi ve mağaza sayfasını Claude'un tek tıkla yükleyebilmesi için:

1. https://console.cloud.google.com → yeni proje (ör. `refmania-play`).
2. **API'ler ve Hizmetler → Kitaplık** → "Google Play Android Developer API" → **Etkinleştir**.
3. **IAM ve Yönetici → Hizmet hesapları → Hizmet hesabı oluştur** (ad: `play-upload`). Rol vermeden bitir.
4. Hizmet hesabına tıkla → **Anahtarlar → Anahtar ekle → Yeni anahtar → JSON** → dosya iner.
5. Play Console → **Kullanıcılar ve izinler → Yeni kullanıcıları davet et**:
   - E-posta: hizmet hesabının e-postası (`play-upload@...iam.gserviceaccount.com`)
   - **Uygulama izinleri → Refmania** seç
   - İzinler: "Test kanallarında yayınla", "Üretimde yayınla", "Mağaza girişini yönet" (ya da **Yönetici**)
   - **Kullanıcıyı davet et**
6. GitHub → Secrets → `PLAY_SERVICE_ACCOUNT_JSON` → JSON dosyasının **tüm içeriğini** yapıştır.

Bu adımdan sonra 🤖 **Android release** iş akışı derlemeyi ve mağaza sayfasını doğrudan Play'e yükler (`listing: true`).

## 7. Mağaza sayfası 🤖

Servis hesabı eklendiyse Claude iş akışını `upload_build: false`, `listing: true` ile çalıştırır. Şunlar yüklenir:
- Türkçe, İngilizce (ABD ve Birleşik Krallık), Almanca, İspanyolca (İspanya ve Latin Amerika) için başlık, kısa açıklama ve tam açıklama.
- Her dilde 8 telefon ve 8 tablet ekran görüntüsü, 512×512 simge ve 1024×500 öne çıkan grafik.

Dosyalar `fastlane/play/` altında. Yeniden üretmek için:
```bash
npm run build && node scripts/play-feature.js && python3 scripts/play-store.py
```

Elle yapmak istersen: Play Console → **Büyüme → Mağaza girişi → Ana mağaza girişi**.
Metinleri ve görselleri aynı klasörden yükleyebilirsin.

## 8. Uygulama içeriği beyanları (Play Console → Politika → Uygulama içeriği)

Bunlar yalnızca elle yapılıyor. Önerilen cevaplar:

| Bölüm | Cevap |
|---|---|
| Gizlilik politikası | `https://ozsstudio.vercel.app/son-duduk/privacy.html` |
| Uygulama erişimi | Tüm işlevler özel erişim gerekmeden kullanılabilir |
| Reklamlar | **Hayır, uygulamam reklam içermiyor** (Android sürümünde reklam kapalı) |
| İçerik derecelendirmesi | Kategori: **Oyun**. Şiddet, cinsellik, küfür, uyuşturucu: Hayır. Kumar: Hayır (gerçek para yok). Kullanıcılar etkileşim kuruyor mu: Hayır. Dijital ürün satın alma: **Evet**. Konum paylaşımı: Hayır. |
| Hedef kitle | **13–15, 16–17, 18 ve üzeri**. 13 yaş altı seçilirse "Aileler" politikaları devreye girer, önerilmez. |
| Haber uygulaması | Hayır |
| Veri güvenliği | Veri topluyor musunuz: **Hayır**. Paylaşıyor musunuz: **Hayır**. Oyun çevrimdışı; kayıtlar yalnızca cihazda. Satın almaları Google Play işler. |
| Devlet uygulaması / Finansal / Sağlık | Hayır |

Mağaza ayarları:
- Kategori: **Oyun → Simülasyon** (ya da Spor)
- E-posta: iletişim adresin
- Web sitesi: `https://ozsstudio.vercel.app/son-duduk/support.html`

## 9. Kapalı test (12 kişi, 14 gün) → Üretim

1. **Test → Kapalı test → Kanal oluştur** (ör. "Beta") → test kullanıcıları listesine **en az 12 kişi** ekle. Gmail adresleri gerekiyor.
2. 🤖 İş akışını `track: alpha` ile çalıştır. Ya da dahili testteki sürümü kapalı teste "Yükselt".
3. Test edenler katılım bağlantısından uygulamayı kurmalı ve **14 gün boyunca katılımcı kalmalı**.
4. 14 gün dolunca Play Console → **Kontrol paneli → Üretim erişimi için başvur**.
5. Onaydan sonra 🤖 `track: production` ile yayınla.

## Sonraki güncellemeler 🤖

Kod değişince **Android release**'i yeni sürüm adıyla çalıştırmak yeterli. Sürüm kodu otomatik artar.
- Uygulama henüz hiç yayınlanmadıysa `status: draft` seç.
- Yayınlandıysa `status: completed` seç.

## Android'de reklamlar

Android sürümünde reklamlar şimdilik **kapalı**. Açmak için:
1. AdMob'da Android uygulaması ve 2 reklam birimi oluştur: ödüllü ve geçiş.
2. Uygulama kimliğini ve iki birim kimliğini Claude'a ver.

Claude şunları güncelleyecek:
- `android/app/src/main/res/values/strings.xml` → `admob_app_id`
- `native/ads.config.js` → `android`
- `AndroidManifest.xml` içindeki `AD_ID` satırı

Bundan sonra Play Console'daki "Reklamlar" ve "Veri güvenliği" beyanları güncellenmelidir.
