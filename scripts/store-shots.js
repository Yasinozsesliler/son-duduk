// Captures raw App Store screenshots of the game with Playwright.
// Usage: node scripts/store-shots.js            (after `npm run build`)
// Output: store/raw/<device>_<n>.png  — then run scripts/store-frame.py to add captions.
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const LANGS = (process.env.LANGS || 'tr,en,de,es').split(',');
const LOC = { tr: 'tr-TR', en: 'en-US', de: 'de-DE', es: 'es-ES' };
const DEVICES = [
  { n: 'iphone', viewport: { width: 390, height: 844 }, dpr: 3, mobile: true },
  { n: 'ipad', viewport: { width: 1032, height: 1376 }, dpr: 2, mobile: true },
];
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME, args: ['--no-sandbox'] } : {});
  for (const lang of LANGS) for (const d of DEVICES) {
    const OUT = path.join(ROOT, 'store', 'raw', lang); fs.mkdirSync(OUT, { recursive: true });
    const ctx = await b.newContext({ viewport: d.viewport, deviceScaleFactor: d.dpr, isMobile: d.mobile, hasTouch: true, locale: LOC[lang] });
    await ctx.addInitScript(l => { try { localStorage.setItem('sonduduk_lang', l); } catch (e) {} }, lang);
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    const shot = async name => { await p.screenshot({ path: path.join(OUT, `${d.n}_${name}.png`) }); console.log(lang, d.n, name); };
    await p.goto('file://' + path.join(ROOT, 'www', lang === 'tr' ? 'index.html' : lang + '.html')); await wait(900);
    await shot('6_start');
    await p.click('[data-new="1"]'); for (let i = 0; i < 3; i++) await p.click('#wNext'); await wait(600);
    await shot('4_hub');
    await p.click('[data-play]'); await p.click('#bKick'); await p.evaluate(() => setSpeed(2));
    let gotLive = false, gotInc = false;
    for (let i = 0; i < 3000 && !(gotLive && gotInc); i++) {
      await wait(50);
      const st = await p.evaluate(() => { if (!M || M.done) return 'done'; if (!document.querySelector('#prompt')?.hidden && document.querySelector('#prompt button')) return 'prompt'; return document.querySelector('#modal').hidden ? 'run' : 'modal'; });
      if (st === 'done') break;
      if (st === 'run' && !gotLive && i > 80) { const ok = await p.evaluate(() => SC && SC.mode === 'play' && SC.ball && (SC.ball.owner || SC.ball.fl)); if (ok) { await p.evaluate(() => { window.scrollTo(0, 0); document.querySelectorAll('#overlay, .ov-in').forEach(e => e.scrollTop = 0); }); await wait(120); await shot('1_live'); gotLive = true; } }
      if (st === 'prompt') await p.evaluate(() => { const x = document.querySelector('#prompt button'); if (x) x.click(); });
      if (st === 'modal') {
        if (!gotInc && await p.$('#facts')) { await wait(1800); await shot('2_incident'); gotInc = true; }
        await p.evaluate(() => { const q = s => document.querySelector('#modal ' + s);
          if (q('#bGo')) return q('#bGo').click(); if (q('[data-n]')) return q('[data-n]').click();
          const dd = document.querySelectorAll('#modal [data-step="d"]'); if (dd.length) { dd[0].click(); const c = document.querySelectorAll('#modal [data-step="c"]'); if (c.length) c[0].click(); const cb = q('#bConfirm') || q('#bOfr'); if (cb) cb.click(); return; }
          const o = q('.dopt:not([disabled])'); if (o) o.click(); });
      }
    }
    for (let k = 0; k < 20; k++) { const open = await p.evaluate(() => { const m = document.querySelector('#modal'); if (m.hidden) return false; const x = m.querySelector('.btn.primary') || m.querySelector('#bGo') || m.querySelector('.dopt:not([disabled])'); if (x) x.click(); return true; }); if (!open) break; await wait(300); }
    await p.evaluate(() => { M.auto = true; let g = 0; while (!M.done && g++ < 6000) tick(); });
    await wait(5200); await shot('3_report');
    await p.evaluate(() => { const x = document.querySelector('#bDone'); if (x) x.click(); else if (typeof afterReport === 'function') afterReport(null); }); await wait(700);
    await p.evaluate(() => { const m = document.querySelector('#modal'); if (m && !m.hidden) { const x = m.querySelector('button'); if (x) x.click(); } });
    await p.evaluate(() => { if (!S.lg) initAllLeagues(); for (let w = 1; w <= 14; w++) { try { simOtherLeagues(w); } catch (e) {} } const k = leagueKeysAll().find(k => !/^H/.test(k)); LG_VIEW = k; TAB = 'lig'; render(); window.scrollTo(0, 0); });
    await wait(600); await p.evaluate(() => { const t = document.querySelector('.lt'); if (t) window.scrollTo(0, t.getBoundingClientRect().top + scrollY - 70); }); await wait(300);
    await shot('5_table');
    await p.evaluate(() => { TAB = 'sosyal'; render(); window.scrollTo(0, 0); }); await wait(700);
    await shot('7_social');
    if (errs.length) console.log('errors', errs);
    await ctx.close();
  }
  await b.close();
})();
