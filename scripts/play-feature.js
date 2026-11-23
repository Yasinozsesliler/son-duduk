// Google Play "Öne çıkan grafik" (1024x500) üretir: store/play/feature_<dil>.png
// Kullanım: npm run build && node scripts/play-feature.js
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..'); const OUT = path.join(ROOT, 'store', 'play');
fs.mkdirSync(OUT, { recursive: true });
const T = {
  tr: ['HAKEM', 'SENSİN', 'Penaltı mı, değil mi? Karar senin.'],
  en: ['YOU ARE', 'THE REF', 'Penalty or not? Your call.'],
  de: ['DU BIST', 'DER SCHIRI', 'Elfmeter oder nicht? Du entscheidest.'],
  es: ['TÚ ERES', 'EL ÁRBITRO', '¿Penalti o no? Tú decides.'],
};
const FD = 'file://' + path.join(ROOT, 'www', 'fonts');
const FACE = ['archivo-latin-ext-wdth-normal', 'archivo-latin-wdth-normal'].map(f => `@font-face{font-family:'Archivo';src:url(${FD}/${f}.woff2) format('woff2');font-weight:100 900;font-stretch:62% 125%}`).join('');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1024, height: 500 } });
  for (const [l, [a, c, sub]] of Object.entries(T)) {
    const shot = path.join(ROOT, 'store', 'screenshots', l, 'iphone_1.png');
    const html = path.join(OUT, '_f.html');
    fs.writeFileSync(html, `<!doctype html><html lang="${l}"><head><meta charset="utf-8"><style>${FACE}
      *{margin:0;box-sizing:border-box}
      body{width:1024px;height:500px;overflow:hidden;position:relative;font-family:Archivo,sans-serif;color:#fff;
        background:radial-gradient(520px 380px at 78% 40%,rgba(56,178,122,.45),transparent 70%),radial-gradient(600px 400px at 0% 0%,rgba(246,198,43,.16),transparent 60%),linear-gradient(135deg,#0b1a2e,#070b12 70%)}
      body::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(100deg,rgba(255,255,255,.025) 0 60px,transparent 60px 120px)}
      .t{position:absolute;left:64px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;gap:14px;width:520px}
      .brand{font-family:Archivo,sans-serif;font-weight:900;font-stretch:80%;font-size:30px;letter-spacing:.02em;color:#ffdb5c}
      .brand i{display:inline-block;width:9px;height:13px;background:#ffdb5c;border-radius:2px;transform:rotate(12deg);margin-left:4px}
      h1{font-family:Archivo,sans-serif;font-weight:900;font-stretch:72%;font-style:italic;font-size:84px;line-height:.92;text-transform:uppercase}
      h1 em{font-style:normal;color:#ffdb5c;display:block}
      p{font-size:25px;font-weight:600;color:#c9d4e2}
      .ph{position:absolute;right:70px;top:46px;width:300px;height:600px;border-radius:34px;overflow:hidden;transform:rotate(7deg);
        box-shadow:0 0 0 8px #141b27,0 0 0 9px rgba(255,255,255,.14),0 40px 80px rgba(0,0,0,.6);background:#0b111b url('file://${shot}') 50% 62%/128% auto no-repeat}
      .card{position:absolute;width:62px;height:88px;border-radius:8px;box-shadow:0 10px 24px rgba(0,0,0,.45)}
      .y{background:#f6c62b;right:330px;top:40px;transform:rotate(-14deg)} .r{background:#e3434b;right:22px;bottom:34px;transform:rotate(18deg)}
    </style></head><body><div class="t"><span class="brand">Refmania<i></i></span><h1>${a}<em>${c}</em></h1><p>${sub}</p></div>
      <div class="ph"></div><span class="card y"></span><span class="card r"></span></body></html>`);
    await p.goto('file://' + html, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    const out = path.join(OUT, `feature_${l}.png`); await p.screenshot({ path: out }); console.log(out);
  }
  fs.rmSync(path.join(OUT, '_f.html'), { force: true });
  await b.close();
})();
