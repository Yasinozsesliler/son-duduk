// Turns raw captures (store/raw) into captioned App Store screenshots (store/screenshots).
// Usage: node scripts/store-frame.js   (run scripts/store-shots.js first)
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const KEYS = ['1_live', '2_incident', '10_phone', '8_daily', '9_dailyres', '3_report', '4_hub', '5_table', '7_social', '6_start'];
const CAPS = {
  tr: [["Hakem [sensin]", "Canlı 3D maç: her temas, her koşu gözünün önünde"], ["Penaltı mı, [değil mi?]", "Tekrarı izle; temas, kol, ofsayt: kararı sen ver"], ["Hakemin hayatı [cebinde]", "Ailenle mesajlaş, yüzlerce ürün, ev ve araba al"], ["Her gün [yeni pozisyon]", "Günün pozisyonu: her gün yeni bir karar, 40 saniye"], ["Serini koru, [paylaş]", "Doğru kararla ödül kazan, sonucunu arkadaşlarına gönder"], ["Gözlemci seni [puanlıyor]", "Her maçtan sonra not, kararlar ve basının yorumu"], ["Amatörden [dünya finaline]", "Klasman klasman tırman; VAR odası ve yardımcı hakem görevleri"], ["8 ülke, [onlarca lig]", "Puan durumunu takip et, yurt dışından gelen teklifleri değerlendir"], ["Taraftar [seni konuşuyor]", "Sosyal medya, haberler ve Hakem Kurulu"], ["Kendi [hakemini yarat]", "Rahat moddan Gerçekçi moda: zorluğu sen seç"]],
  en: [["You are [the referee]", "Live 3D football: every challenge and run in front of you"], ["Penalty [or not?]", "Watch the replay; contact, arm, offside: you decide"], ["A ref’s life [in your pocket]", "Text your family, buy hundreds of items, homes and cars"], ["A [new call] every day", "Call of the Day: one new incident daily, 40 seconds"], ["Keep your streak, [share it]", "Earn rewards for the right call and challenge your friends"], ["The assessor [grades you]", "A mark, your key calls and press reaction after every match"], ["From amateur to [the world final]", "Climb the grades; VAR room and assistant referee duties"], ["8 countries, [dozens of leagues]", "Follow every table and weigh offers from abroad"], ["The fans [are talking]", "Social media, news and the referees committee"], ["Create [your referee]", "From Relaxed to Realistic: pick your difficulty"]],
  de: [["Du bist [der Schiri]", "Live-3D-Fußball: jeder Zweikampf direkt vor deinen Augen"], ["Elfmeter [oder nicht?]", "Sieh die Wiederholung; Kontakt, Arm, Abseits: du entscheidest"], ["Schiri-Leben [in der Tasche]", "Schreib der Familie, kauf Hunderte Produkte, Häuser, Autos"], ["Jeden Tag [eine neue Szene]", "Szene des Tages: jeden Tag eine neue Entscheidung, 40 Sekunden"], ["Halte die Serie, [teile sie]", "Belohnung für die richtige Entscheidung, Ergebnis teilen"], ["Der Beobachter [bewertet dich]", "Note, Schlüsselszenen und Pressestimmen nach jedem Spiel"], ["Vom Amateur [zum WM-Finale]", "Steig auf; Einsätze im VAR-Raum und als Assistent"], ["8 Länder, [viele Ligen]", "Verfolge alle Tabellen und prüfe Angebote aus dem Ausland"], ["Die Fans [reden über dich]", "Soziale Medien, News und die Schiedsrichterkommission"], ["Erstelle [deinen Schiri]", "Von Entspannt bis Realistisch: du wählst die Schwierigkeit"]],
  es: [["El árbitro [eres tú]", "Fútbol 3D en vivo: cada entrada y cada carrera ante tus ojos"], ["¿Penalti [o no?]", "Mira la repetición; contacto, brazo, fuera de juego: tú decides"], ["El árbitro [en tu móvil]", "Escribe a tu familia, compra cientos de productos, casas y coches"], ["Cada día [una jugada nueva]", "Jugada del día: una decisión nueva cada día, 40 segundos"], ["Sigue [la racha]", "Gana premios con la decisión correcta y comparte tu resultado"], ["El informador [te evalúa]", "Nota, decisiones clave y reacción de la prensa tras cada partido"], ["De amateur [a la final mundial]", "Asciende de categoría; sala VAR y árbitro asistente"], ["8 países, [decenas de ligas]", "Sigue todas las clasificaciones y valora ofertas del extranjero"], ["La afición [habla de ti]", "Redes sociales, noticias y el comité de árbitros"], ["Crea [tu árbitro]", "De Relajado a Realista: elige la dificultad"]],
};
const DEV = { iphone: { w: 1290, h: 2796, scale: .9, top: 560, title: 128, sub: 46 }, ipad: { w: 2048, h: 2732, scale: .86, top: 520, title: 136, sub: 48 } };
// her görselin kendi renk teması: [üst, alt, vurgu]
const THEME = [['#123a7a','#050b1c','#f6c62b'],['#7a1020','#14030a','#ffd84a'],['#5a2aa8','#12052e','#ff8ae0'],['#6b4a08','#140d02','#ffd84a'],['#0d5c47','#03130e','#4ff0b0'],['#0d4a72','#03101c','#6fd8ff'],['#1d2b3a','#05080c','#f6c62b'],['#1f5222','#040f05','#b6f24a'],['#6b0f4f','#14030f','#ff7ab8'],['#2a3550','#070a12','#f6c62b']];
const NEW = { 2: 1, 3: 1 };
const NEWW = { tr: 'YENİ', en: 'NEW', de: 'NEU', es: 'NUEVO' };
const FONT = 'file://' + path.join(ROOT, 'www', 'fonts');
const hl = (t, c) => t.replace(/\[(.+?)\]/g, `<em style="color:${c}">$1</em>`);
const card = (x, y, w, rot, col, blur) => `<i class="cd" style="left:${x}px;top:${y}px;width:${w}px;height:${w * 1.42}px;background:${col};transform:rotate(${rot}deg);filter:blur(${blur || 0}px)"></i>`;
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args: ['--no-sandbox'] } : {});
  for (const lang of (process.env.LANGS ? process.env.LANGS.split(',') : Object.keys(CAPS))) for (const [dev, D] of Object.entries(DEV)) {
    const RAW = path.join(ROOT, 'store', 'raw', lang); const OUT = path.join(ROOT, 'store', 'screenshots', lang); fs.mkdirSync(OUT, { recursive: true });
    if (!fs.existsSync(RAW)) continue;
    const p = await b.newPage({ viewport: { width: D.w, height: D.h }, deviceScaleFactor: 1 });
    for (const [i, key] of KEYS.entries()) { const [title, sub] = CAPS[lang][i];
      const img = path.join(RAW, `${dev}_${key}.png`); if (!fs.existsSync(img)) { console.log('missing', img); continue; }
      const iw = Math.round(D.w * D.scale);
      const [c1, c2, ac] = THEME[i]; const W = D.w, H = D.h;
      const deco = card(W * .905, -W * .02, W * .075, 18, 'linear-gradient(160deg,#ffe36b,#f2b705)') + card(-W * .02, D.top * .62, W * .06, -20, 'linear-gradient(160deg,#ff5a5a,#c8102e)') + card(W * .93, D.top * 1.9, W * .05, 24, 'linear-gradient(160deg,#ffe36b,#f2b705)', 3);
      const html = path.join(OUT, '_frame.html'); fs.writeFileSync(html, `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><style>
        @font-face{font-family:Archivo;src:url(${FONT}/archivo-latin-ext-wdth-normal.woff2) format("woff2");font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0100-02BA,U+1E00-1E9F}
        @font-face{font-family:Archivo;src:url(${FONT}/archivo-latin-wdth-normal.woff2) format("woff2");font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0000-00FF,U+0131,U+2000-206F}
        *{margin:0;box-sizing:border-box}
        body{width:${W}px;height:${H}px;overflow:hidden;position:relative;color:#fff;font-family:Archivo,sans-serif;
          background:radial-gradient(${W * .9}px ${H * .35}px at 18% 4%,${c1} 0%,transparent 70%),radial-gradient(${W * .8}px ${H * .4}px at 95% 60%,${c1}99 0%,transparent 70%),linear-gradient(170deg,${c1} 0%,${c2} 55%,${c2} 100%)}
        body::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(255,255,255,.035) 0 ${W * .06}px,transparent ${W * .06}px ${W * .12}px)}
        body::after{content:'';position:absolute;left:50%;top:${D.top * .35}px;width:${W * 1.1}px;height:${W * 1.1}px;transform:translateX(-50%);background:radial-gradient(circle,${ac}33 0%,transparent 60%)}
        .cd{position:absolute;z-index:1;border-radius:${W * .012}px;box-shadow:0 ${W * .02}px ${W * .04}px rgba(0,0,0,.45),inset 0 0 0 3px rgba(255,255,255,.25)}
        .cap{position:absolute;z-index:2;left:0;right:0;top:0;height:${D.top}px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 ${W * .09}px;gap:${D.sub * .45}px}
        .k{font-stretch:66%;font-weight:850;font-size:${D.sub * 1.05}px;letter-spacing:.02em;color:#fff;opacity:.92;position:relative;padding-right:.5em;display:flex;align-items:center;gap:.6em}
        .k i{position:absolute;right:0;top:.08em;width:.3em;height:.42em;border-radius:.04em;background:${ac};transform:rotate(12deg)}
        .nw{font-style:normal;font-stretch:80%;font-weight:900;font-size:${D.sub * .78}px;letter-spacing:.08em;background:${ac};color:#111;padding:.18em .6em;border-radius:.5em;margin-right:.3em}
        h1{font-stretch:68%;font-weight:900;font-size:${D.title * 1.12}px;line-height:.92;letter-spacing:-.015em;text-transform:uppercase;text-shadow:0 6px 30px rgba(0,0,0,.45)}
        h1 em{font-style:normal}
        p{font-size:${D.sub}px;font-weight:600;color:rgba(255,255,255,.82);line-height:1.25;max-width:${W * .84}px}
        .ph{position:absolute;z-index:3;left:50%;top:${D.top + 10}px;width:${iw}px;transform:translateX(-50%);border-radius:${dev === 'iphone' ? 72 : 44}px;overflow:hidden;
          box-shadow:0 0 0 ${dev === 'iphone' ? 16 : 13}px #0b0d10,0 0 0 ${dev === 'iphone' ? 19 : 16}px rgba(255,255,255,.22),0 ${W * .05}px ${W * .1}px rgba(0,0,0,.6),0 0 ${W * .12}px ${ac}44}
        .ph img{display:block;width:100%}
      </style></head><body>${deco}<div class="cap"><span class="k">${NEW[i] ? `<em class="nw">${NEWW[lang]}</em>` : ''}Refmania<i></i></span><h1>${hl(title, ac)}</h1><p>${sub}</p></div><div class="ph"><img src="file://${img}"></div></body></html>`); await p.goto('file://' + html, { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150); const ov = await p.evaluate(() => { const c = document.querySelector('.cap'); const r = [...c.children].reduce((a, e) => a + e.getBoundingClientRect().height, 0); return r > c.getBoundingClientRect().height - 20; }); if (ov) console.log('TAŞMA', lang, dev, i + 1);
      const out = path.join(OUT, `${dev}_${i + 1}.png`); await p.screenshot({ path: out }); console.log(out);
    }
    await p.close();
  }
  for (const l of Object.keys(CAPS)) fs.rmSync(path.join(ROOT, 'store', 'screenshots', l, '_frame.html'), { force: true });
  await b.close();
})();
