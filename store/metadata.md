# App Store Connect metinleri — Son Düdük

App Store Connect → Uygulamam → **App Store** sekmesindeki alanlara aşağıdakileri kopyala.
Parantez içindeki sayılar Apple'ın karakter sınırıdır.

## Uygulama bilgileri

| Alan | Değer |
|---|---|
| Ad (30) | `Son Düdük: Hakem Kariyeri` |
| Alt başlık (30) | `Futbol hakemi simülatörü` |
| Paket kimliği (Bundle ID) | `com.sonduduk.hakem` |
| SKU | `sonduduk-ios-1` |
| Birincil dil | Türkçe |
| Birincil kategori | Oyunlar → Spor |
| İkincil kategori | Oyunlar → Simülasyon |
| Telif hakkı | `2026 [Adın Soyadın]` |

> "Son Düdük" adı başka bir uygulamada kullanılıyorsa App Store Connect izin vermez; o durumda ör. `Son Düdük – Hakem Simülatörü` dene.

## Tanıtım metni (170)

```
Kararı sen ver. Canlı maçta her temas gözünün önünde; ofsayt, penaltı, kart… Amatör ligden dünya sahnesine uzanan hakem kariyerine bugün başla.
```

## Anahtar kelimeler (100, virgülle, boşluksuz)

```
hakem,futbol,simülasyon,kariyer,VAR,ofsayt,penaltı,kırmızı kart,lig,maç,karar,düdük,spor,menajer
```

## Açıklama (4000)

```
Futbolu hiç bu açıdan oynamadın: düdük sende.

Son Düdük, futbol hakemliğini tüm ayrıntısıyla yaşatan bir kariyer simülatörü. Bölgesel amatör ligde ilk maçına çıkarsın; doğru kararlarla klasman atlar, ülkenin en üst ligine yükselir, uluslararası kokartı alır ve dünyanın en büyük maçlarına atanırsın.

SAHADAN YÖNET
• Canlı 3D maç: oyuncular koşar, pas verir, şut çeker; sen pozisyon alırsın.
• Temasları yakın plan, hakem gözü ve taktik kameradan izle, ağır çekimde tekrar et.
• Görüş açın kararını etkiler: doğru yerde durmak da işin parçası.

HER POZİSYONU SEN YORUMLA
• 13 farklı pozisyon türü: ceza sahası teması, elle oynama, ofsayt, dirsek, gol şansını engelleme, kaleci müdahalesi ve daha fazlası.
• Kural kitabına bak, yardımcı hakeme sor, video incelemesine git ya da kararının arkasında dur.
• Kart gösterme animasyonu, itirazlar, maç yönetimi ve uzatma kararları.

KARİYERİNİ İNŞA ET
• 8 ülke, her ülkede 5 klasman; yurt dışından gelen teklifler.
• Her maçtan sonra gözlemci notu, karar dökümü ve basının yorumu.
• Hakem Kurulu seni izliyor: başarılı ol, büyük maçlara atan; hata yap, kurula çağrıl.
• Haftalık antrenman programı: kondisyon, video analiz, kural semineri, zihinsel hazırlık.

DÜNYA SENİ KONUŞUYOR
• Kadraj sosyal medyasında taraftarlar, eski hakemler ve gazeteciler kararlarını tartışır.
• Haber akışı, puan durumları ve takvim.
• Kural Akademisi'nde zor pozisyonlarla kendini sına.

3 kariyer slotu, hakem tipi ve ülke seçimi. İnternet bağlantısı gerekmez; reklam yok, veri toplanmaz.

Not: Oyundaki tüm takımlar, oyuncular ve hakemler kurgusaldır.
```

## Destek ve gizlilik

| Alan | Değer |
|---|---|
| Destek URL'si | `https://<github-kullanıcı-adın>.github.io/<repo-adı>/support.html` |
| Gizlilik politikası URL'si | `https://<github-kullanıcı-adın>.github.io/<repo-adı>/privacy.html` |
| Pazarlama URL'si | (boş bırakılabilir) |

Bu iki sayfa `docs/` klasöründe hazır; GitHub Pages açılınca bu adreslerde yayınlanır (bkz. APP_STORE.md).

## App Gizliliği (Privacy "nutrition label")

App Store Connect → **App Gizliliği** → "Veri toplama" sorusuna **Hayır, bu uygulamadan veri toplamıyoruz** de.
Oyun sunucuya hiçbir şey göndermez; kayıtlar yalnızca cihazda tutulur. `ios/App/App/PrivacyInfo.xcprivacy` dosyası da bunu bildirir.

## Yaş derecelendirmesi

Anketteki tüm sorulara **Yok / Hayır** (şiddet, kumar, kullanıcı içeriği, web erişimi yok). Sonuç: **4+**.

## İnceleme notu (App Review Information → Notes)

```
Son Düdük is an offline single-player football referee career simulator. No account or login is required. Tap "Yeni kariyer", finish the 3-step setup, then "Maça çık" to referee a live match. All teams, players and referees are fictional. The app collects no data.
```

## Ekran görüntüleri

`store/screenshots/` klasöründe:
- `iphone_1.png` … `iphone_7.png` — 1320 × 2868 (iPhone 6.9" alanına yükle)
- `ipad_1.png` … `ipad_7.png` — 2064 × 2752 (iPad 13" alanına yükle)

Yeniden üretmek için: `npm run build && node scripts/store-shots.js && node scripts/store-frame.js`
