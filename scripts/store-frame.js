// Turns raw captures (store/raw) into captioned App Store screenshots (store/screenshots).
// Usage: node scripts/store-frame.js   (run scripts/store-shots.js first)
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..'); const RAW = path.join(ROOT, 'store', 'raw'); const OUT = path.join(ROOT, 'store', 'screenshots');
fs.mkdirSync(OUT, { recursive: true });
const SHOTS = [
  ['1_live', 'Maçı sahadan yönet', 'Canlı 3D maç: her temas, her koşu gözünün önünde'],
  ['2_incident', 'Her pozisyonu sen yorumla', 'Temas, kol pozisyonu, ofsayt, DOGSO — kararı sen ver'],
  ['3_report', 'Gözlemci seni puanlıyor', 'Her maçtan sonra not, kararlar ve basının yorumu'],
  ['4_hub', 'Amatörden dünya sahnesine', 'Klasman klasman tırman, uluslararası kokartı kazan'],
  ['5_table', '8 ülke, onlarca lig', 'Tüm liglerin puan durumunu takip et, yurt dışından gelen teklifleri değerlendir'],
  ['7_social', 'Taraftar seni konuşuyor', 'Sosyal medya, haberler ve Hakem Kurulu'],
  ['6_start', 'Kendi hakemini yarat', '3 kariyer slotu, ülke ve hakem tipi seçimi'],
];
const DEV = { iphone: { w: 1290, h: 2796, scale: .86, top: 470, title: 104, sub: 44 }, ipad: { w: 2048, h: 2732, scale: .84, top: 420, title: 112, sub: 46 } };
const fonts = 'file://' + path.join(ROOT, 'www', 'fonts', 'fonts.css');
(async () => {
  const b = await chromium.launch();
  for (const [dev, D] of Object.entries(DEV)) {
    const p = await b.newPage({ viewport: { width: D.w, height: D.h }, deviceScaleFactor: 1 });
    for (const [i, [key, title, sub]] of SHOTS.entries()) {
      const img = path.join(RAW, `${dev}_${key}.png`); if (!fs.existsSync(img)) { console.log('missing', img); continue; }
      const iw = Math.round(D.w * D.scale);
      const html = path.join(OUT, '_frame.html'); fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="${fonts}"><style>
        *{margin:0;box-sizing:border-box}
        body{width:${D.w}px;height:${D.h}px;overflow:hidden;background:radial-gradient(${D.w * .9}px ${D.h * .35}px at 85% -5%,rgba(246,198,43,.22),transparent 65%),radial-gradient(${D.w}px ${D.h * .5}px at -10% 30%,rgba(32,120,75,.35),transparent 65%),linear-gradient(180deg,#0b1220,#070b12);font-family:Barlow,sans-serif;color:#fff;position:relative}
        .cap{position:absolute;left:0;right:0;top:0;height:${D.top}px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px;gap:22px}
        .k{font-family:'IBM Plex Mono',monospace;font-size:${D.sub * .62}px;letter-spacing:.3em;color:#ffdb5c;text-transform:uppercase;display:flex;align-items:center;gap:18px}
        .k::before,.k::after{content:"";width:60px;height:3px;border-radius:2px;background:#ffdb5c}
        h1{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:${D.title}px;line-height:.98;text-transform:uppercase;letter-spacing:.01em}
        p{font-size:${D.sub}px;color:#b9c5d4;line-height:1.3;max-width:${D.w * .82}px}
        .ph{position:absolute;left:50%;top:${D.top + 20}px;width:${iw}px;transform:translateX(-50%);border-radius:${dev === 'iphone' ? 64 : 40}px;overflow:hidden;box-shadow:0 0 0 ${dev === 'iphone' ? 14 : 12}px #141b27,0 0 0 ${dev === 'iphone' ? 16 : 14}px rgba(255,255,255,.12),0 60px 120px rgba(0,0,0,.7)}
        .ph img{display:block;width:100%}
      </style></head><body><div class="cap"><span class="k">Refmania</span><h1>${title}</h1><p>${sub}</p></div><div class="ph"><img src="file://${img}"></div></body></html>`); await p.goto('file://' + html, { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
      const out = path.join(OUT, `${dev}_${i + 1}.png`); await p.screenshot({ path: out }); console.log(out);
    }
    await p.close();
  }
  fs.rmSync(path.join(OUT, '_frame.html'), { force: true });
  await b.close();
})();
