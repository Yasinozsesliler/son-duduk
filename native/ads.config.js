/* AdMob ayarları. testing:true iken Google'ın TEST reklam kimlikleri kullanılır.
   iOS gerçek kimlikleri AdMob'da oluşturulunca buraya yaz ve testing:false yap.
   Uygulama kimliği ayrıca: ios/App/App/Info.plist > GADApplicationIdentifier */
export const ADS = {
  ios:     { testing: true, rewardedId: "ca-app-pub-3940256099942544/1712485313",
             interstitialId: "ca-app-pub-3940256099942544/4411468910" },
  android: { testing: true, rewardedId: "ca-app-pub-3940256099942544/5224354917",
             interstitialId: "ca-app-pub-3940256099942544/1033173712" },
};
