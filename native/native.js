/* Son Düdük — yerel köprü (Capacitor): dil seçimi, AdMob reklamları, uygulama içi satın alma.
   Tarayıcıda her şey sessizce devre dışı kalır. www/native.js olarak paketlenir (scripts/build-web.mjs). */
import { Capacitor, registerPlugin } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { Device } from "@capacitor/device";
import { AdMob, AdmobConsentStatus } from "@capacitor-community/admob";
import { NativePurchases, PURCHASE_TYPE } from "@capgo/native-purchases";
import { Purchases, PURCHASES_ARE_COMPLETED_BY_TYPE, STOREKIT_VERSION } from "@revenuecat/purchases-capacitor";
import { ADS } from "./ads.config.js";

const isNative = Capacitor.isNativePlatform();
const platform = Capacitor.getPlatform();
const isIOS = platform === "ios";
const AD = isIOS ? ADS.ios : ADS.android;
const N = { isNative, platform };
window.NATIVE = N;

/* ---------- Dil: ilk açılışta cihaz diline göre (tr/en/de/es), sonra oyuncunun seçimi ---------- */
const LANGS = ["tr", "en", "de", "es"];
const LANG_KEY = "sonduduk_lang";
const SAVE_KEYS = ["sonduduk_save_v1", "sonduduk_slot_1", "sonduduk_slot_2", "sonduduk_slot_3"];
N.lang = LANGS.includes(document.documentElement.lang) ? document.documentElement.lang : "tr";
const fileOf = (l) => (l === "tr" ? "index.html" : l + ".html");
async function wantLang() {
  let l = null;
  try { l = localStorage.getItem(LANG_KEY); } catch (e) {}
  if (!l && isNative) { try { l = (await Preferences.get({ key: LANG_KEY })).value; } catch (e) {} }
  if (LANGS.includes(l)) return l;
  /* 1.0'dan gelen (kaydı olan) oyuncular Türkçe'de kalır */
  let had = false;
  try { had = SAVE_KEYS.some((k) => localStorage.getItem(k)); } catch (e) {}
  if (!had && isNative) { for (const k of SAVE_KEYS) { try { if ((await Preferences.get({ key: k })).value) { had = true; break; } } catch (e) {} } }
  if (had) l = "tr";
  else {
    let code = "";
    try { code = (await Device.getLanguageCode()).value || ""; } catch (e) { code = navigator.language || ""; }
    code = code.slice(0, 2).toLowerCase();
    l = LANGS.includes(code) ? code : "en";
  }
  try { localStorage.setItem(LANG_KEY, l); } catch (e) {}
  if (isNative) { try { await Preferences.set({ key: LANG_KEY, value: l }); } catch (e) {} }
  return l;
}
window.__SD_PRE = (async () => {
  const want = await wantLang();
  if (want !== N.lang) { location.replace(fileOf(want)); await new Promise(() => {}); }
})();

/* ---------- Reklamlar (AdMob + UMP/GDPR onayı + iOS takip izni) ---------- */
let adsReady = null, canAds = true;
async function initAds() {
  if (!AD.enabled) return false;
  try {
    await AdMob.initialize({ initializeForTesting: AD.testing });
    try {
      const info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) {
        const r = await AdMob.showConsentForm();
        canAds = r.canRequestAds !== false;
      } else canAds = info.canRequestAds !== false;
    } catch (e) {}
    if (isIOS) {
      try {
        const t = await AdMob.trackingAuthorizationStatus();
        if (t.status === "notDetermined") await AdMob.requestTrackingAuthorization();
      } catch (e) {}
    }
    return true;
  } catch (e) { return false; }
}
N.privacyOptions = async () => { try { await AdMob.showPrivacyOptionsForm(); } catch (e) {} };
N.rewarded = async () => {
  if (!isNative) return false;
  if (!adsReady) adsReady = initAds();
  if (!(await adsReady) || !canAds) return false;
  try { await AdMob.prepareRewardVideoAd({ adId: AD.rewardedId, isTesting: AD.testing }); } catch (e) { return false; }
  return new Promise((resolve) => {
    let got = false, done = false;
    const fin = (v) => { if (done) return; done = true; hs.forEach((h) => h.then((x) => x.remove())); resolve(v); };
    const hs = [
      AdMob.addListener("onRewardedVideoAdReward", () => { got = true; }),
      AdMob.addListener("onRewardedVideoAdDismissed", () => setTimeout(() => fin(got), 300)),
      AdMob.addListener("onRewardedVideoAdFailedToShow", () => fin(false)),
    ];
    AdMob.showRewardVideoAd().then(() => { got = true; }).catch(() => fin(false));
  });
};
N.interstitial = async () => {
  if (!isNative || !AD.interstitialId) return false;
  try {
    if (!adsReady) adsReady = initAds();
    if (!(await adsReady) || !canAds) return false;
    await AdMob.prepareInterstitial({ adId: AD.interstitialId, isTesting: AD.testing });
    await new Promise((resolve) => {
      let done = false;
      const fin = () => { if (done) return; done = true; hs.forEach((h) => h.then((x) => x.remove())); resolve(); };
      const hs = [
        AdMob.addListener("interstitialAdDismissed", fin),
        AdMob.addListener("interstitialAdFailedToShow", fin),
      ];
      AdMob.showInterstitial().catch(fin);
      setTimeout(fin, 90000);
    });
    return true;
  } catch (e) { return false; }
};

/* ---------- RevenueCat: yalnızca gözlemci ----------
   Satın almayı StoreKit 2 (@capgo/native-purchases) yapar; RevenueCat satışları ve iadeleri raporlar.
   Gözlemci çağrıları satın alma akışını bekletmez ya da bozmaz (hata ve zaman aşımı sessizce yutulur). */
const RC_KEY_IOS = "appl_eBgQhOtRwbFcSZVutLEBAEogEuR"; // açık SDK anahtarı (gizli değildir)
let rcReady = false;
const rcQuick = (p) => Promise.race([p, new Promise((r) => setTimeout(r, 4000))]).catch(() => undefined);
if (isIOS) {
  Purchases.configure({
    apiKey: RC_KEY_IOS,
    purchasesAreCompletedBy: { type: PURCHASES_ARE_COMPLETED_BY_TYPE.MY_APP, storeKitVersion: STOREKIT_VERSION.STOREKIT_2 },
  }).then(() => { rcReady = true; }).catch(() => {});
}
const rcRecord = (id) => (rcReady ? rcQuick(Purchases.recordPurchase({ productID: id })) : undefined);
const rcSync = () => (rcReady ? rcQuick(Purchases.syncPurchases()) : undefined);

/* ---------- Uygulama içi satın alma (StoreKit 2, şimdilik yalnızca iOS) ---------- */
const INAPP = PURCHASE_TYPE.INAPP;
const okTx = (t) => t && !t.revocationDate;
N.iapOn = isIOS;
N.iap = {
  async products(ids) {
    if (!N.iapOn) return [];
    const r = await NativePurchases.getProducts({ productIdentifiers: ids, productType: INAPP });
    return r.products || [];
  },
  async owned() {
    if (!N.iapOn) return [];
    const r = await NativePurchases.getPurchases({ productType: INAPP, onlyCurrentEntitlements: true });
    return (r.purchases || []).filter(okTx).map((p) => p.productIdentifier);
  },
  /* "ok" | "cancel" | "pending" | "error" */
  async buy(id) {
    if (!N.iapOn) return "error";
    try {
      const t = await NativePurchases.purchaseProduct({ productIdentifier: id, productType: INAPP, quantity: 1 });
      if (okTx(t)) { await rcRecord(id); return "ok"; }
      return "error";
    } catch (e) {
      const m = String((e && (e.message || e.code)) || e).toLowerCase();
      if (m.includes("cancel")) return "cancel";
      if (m.includes("pending") || m.includes("deferred")) return "pending";
      return "error";
    }
  },
  async restore() {
    if (!N.iapOn) return [];
    try { await NativePurchases.restorePurchases(); } catch (e) {}
    await rcSync();
    return N.iap.owned();
  },
};
if (N.iapOn) {
  NativePurchases.addListener("transactionUpdated", (t) => {
    try { window.SD_IAP_UPDATE && window.SD_IAP_UPDATE(t.productIdentifier, okTx(t)); } catch (e) {}
    if (okTx(t)) rcRecord(t.productIdentifier);
  }).catch(() => {});
}
if (isNative && AD.enabled) setTimeout(() => { adsReady = adsReady || initAds(); }, 5000);

/* ---------- Puan isteme (iOS: StoreKit, Android: Play In-App Review) ----------
   Yerel eklenti: ios/App/App/InAppReviewPlugin.swift, android/.../InAppReviewPlugin.java.
   Pencerenin gerçekten çıkıp çıkmayacağına Apple/Google karar verir; sonuç bildirilmez. */
const InAppReview = registerPlugin("InAppReview");
N.review = isNative ? () => InAppReview.requestReview() : null;
