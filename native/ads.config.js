/* AdMob ayarları. testing:true iken Google'ın TEST reklam kimlikleri kullanılır.
   iOS gerçek kimlikleri AdMob'da oluşturulunca buraya yaz ve testing:false yap.
   Uygulama kimliği ayrıca: ios/App/App/Info.plist > GADApplicationIdentifier */
/* Reklamları açarken Info.plist'e NSUserTrackingUsageDescription geri eklenmeli (1.1'de kaldırıldı)
   ve App Store gizlilik etiketinde takip beyan edilmeli.
   enabled:false iken reklam SDK'sı hiç başlatılmaz (onay formu ve takip izni de sorulmaz). */
export const ADS = {
  ios:     { enabled: true,  testing: true, rewardedId: "ca-app-pub-3940256099942544/1712485313",
             interstitialId: "ca-app-pub-3940256099942544/4411468910" },
  android: { enabled: false, testing: true, rewardedId: "ca-app-pub-3940256099942544/5224354917",
             interstitialId: "ca-app-pub-3940256099942544/1033173712" },
};
