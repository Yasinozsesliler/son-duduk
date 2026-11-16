// Turns raw captures (store/raw) into captioned App Store screenshots (store/screenshots).
// Usage: node scripts/store-frame.js   (run scripts/store-shots.js first)
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const KEYS = ['1_live', '2_incident', '3_report', '4_hub', '5_table', '7_social', '6_start'];
const CAPS = {
  tr: [['Maçı sahadan yönet', 'Canlı 3D maç: her temas, her koşu gözünün önünde'], ['Her pozisyonu sen yorumla', 'Temas, kol pozisyonu, ofsayt, DOGSO: kararı sen ver'], ['Gözlemci seni puanlıyor', 'Her maçtan sonra not, kararlar ve basının yorumu'], ['Amatörden dünya sahnesine', 'Klasman klasman tırman; VAR odası ve yardımcı hakem görevleri'], ['8 ülke, onlarca lig', 'Puan durumunu takip et, yurt dışından gelen teklifleri değerlendir'], ['Taraftar seni konuşuyor', 'Sosyal medya, haberler ve Hakem Kurulu'], ['Kendi hakemini yarat', '3 kariyer slotu, ülke ve hakem tipi seçimi']],
  en: [['Referee the match live', 'Live 3D football: every challenge and run in front of you'], ['You make every call', 'Contact, arm position, offside, DOGSO: the decision is yours'], ['The assessor grades you', 'A mark, your key calls and press reaction after every match'], ['From amateur to world stage', 'Climb the grades; VAR room and assistant referee duties'], ['8 countries, dozens of leagues', 'Follow every table and weigh offers from abroad'], ['The fans are talking', 'Social media, news and the referees committee'], ['Create your referee', '3 career slots, choose your country and referee style']],
  de: [['Leite das Spiel live', 'Live-3D-Fußball: jeder Zweikampf direkt vor deinen Augen'], ['Du entscheidest jede Szene', 'Kontakt, Armhaltung, Abseits, Notbremse: deine Entscheidung'], ['Der Beobachter bewertet dich', 'Note, Schlüsselszenen und Pressestimmen nach jedem Spiel'], ['Vom Amateur zur Weltbühne', 'Steig auf; Einsätze im VAR-Raum und als Assistent'], ['8 Länder, viele Ligen', 'Verfolge alle Tabellen und prüfe Angebote aus dem Ausland'], ['Die Fans reden über dich', 'Soziale Medien, News und die Schiedsrichterkommission'], ['Erstelle deinen Schiri', '3 Karriere-Slots, Land und Schiedsrichtertyp wählen']],
  es: [['Arbitra el partido en directo', 'Fútbol 3D en vivo: cada entrada y cada carrera ante tus ojos'], ['Tú decides cada jugada', 'Contacto, posición del brazo, fuera de juego, DOGSO: tú decides'], ['El informador te evalúa', 'Nota, decisiones clave y reacción de la prensa tras cada partido'], ['De amateur a la élite mundial', 'Asciende de categoría; sala VAR y árbitro asistente'], ['8 países, decenas de ligas', 'Sigue todas las clasificaciones y valora ofertas del extranjero'], ['La afición habla de ti', 'Redes sociales, noticias y el comité de árbitros'], ['Crea tu árbitro', '3 ranuras de carrera, elige país y estilo arbitral']],
};
const DEV = { iphone: { w: 1290, h: 2796, scale: .86, top: 470, title: 104, sub: 44 }, ipad: { w: 2048, h: 2732, scale: .84, top: 420, title: 112, sub: 46 } };
const FONT = 'file://' + path.join(ROOT, 'www', 'fonts');
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args: ['--no-sandbox'] } : {});
  for (const lang of Object.keys(CAPS)) for (const [dev, D] of Object.entries(DEV)) {
    const RAW = path.join(ROOT, 'store', 'raw', lang); const OUT = path.join(ROOT, 'store', 'screenshots', lang); fs.mkdirSync(OUT, { recursive: true });
    if (!fs.existsSync(RAW)) continue;
    const p = await b.newPage({ viewport: { width: D.w, height: D.h }, deviceScaleFactor: 1 });
    for (const [i, key] of KEYS.entries()) { const [title, sub] = CAPS[lang][i];
      const img = path.join(RAW, `${dev}_${key}.png`); if (!fs.existsSync(img)) { console.log('missing', img); continue; }
      const iw = Math.round(D.w * D.scale);
      const html = path.join(OUT, '_frame.html'); fs.writeFileSync(html, `<!doctype html><html><head><meta charset="utf-8"><style>
        @font-face{font-family:Archivo;src:url(${FONT}/archivo-latin-ext-wdth-normal.woff2) format("woff2");font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0100-02BA,U+1E00-1E9F}
        @font-face{font-family:Archivo;src:url(${FONT}/archivo-latin-wdth-normal.woff2) format("woff2");font-weight:100 900;font-stretch:62% 125%;unicode-range:U+0000-00FF,U+0131,U+2000-206F}
        *{margin:0;box-sizing:border-box}
        body{width:${D.w}px;height:${D.h}px;overflow:hidden;background:radial-gradient(${D.w*1.1}px ${D.h*.32}px at 50% -6%,rgba(236,234,226,.10),transparent 70%),linear-gradient(180deg,#0e1a16 0%,#0a1310 60%);color:#ecebe4;font-family:Archivo,sans-serif;font-stretch:100%}
        .cap{position:absolute;left:0;right:0;top:0;height:${D.top}px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 80px;gap:22px}
        .k{font-family:Archivo;font-stretch:66%;font-weight:850;font-size:${D.sub*1.25}px;letter-spacing:-.01em;color:#ecebe4;position:relative;padding-right:.5em}
        .k i{position:absolute;right:0;top:.08em;width:.3em;height:.42em;border-radius:.04em;background:#f2c230;transform:rotate(12deg)}
        h1{font-family:Archivo;font-stretch:70%;font-weight:800;font-size:${D.title*1.08}px;line-height:.96;letter-spacing:-.01em}
        p{font-size:${D.sub}px;color:#98a79f;line-height:1.3;max-width:${D.w * .82}px}
        .ph{position:absolute;left:50%;top:${D.top + 20}px;width:${iw}px;transform:translateX(-50%);border-radius:${dev === 'iphone' ? 64 : 40}px;overflow:hidden;box-shadow:0 0 0 ${dev === 'iphone' ? 14 : 12}px #16241f,0 0 0 ${dev === 'iphone' ? 16 : 14}px rgba(255,255,255,.12),0 60px 120px rgba(0,0,0,.7)}
        .ph img{display:block;width:100%}
      </style></head><body><div class="cap"><span class="k">Refmania<i></i></span><h1>${title}</h1><p>${sub}</p></div><div class="ph"><img src="file://${img}"></div></body></html>`); await p.goto('file://' + html, { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
      const out = path.join(OUT, `${dev}_${i + 1}.png`); await p.screenshot({ path: out }); console.log(out);
    }
    await p.close();
  }
  for (const l of Object.keys(CAPS)) fs.rmSync(path.join(ROOT, 'store', 'screenshots', l, '_frame.html'), { force: true });
  await b.close();
})();
