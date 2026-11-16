// Türkçe oyundan başka dil sürümü üretir: node i18n/apply.cjs in.html out.html sozluk.json en|de|es
// Metinler AST ile bulunur (acorn); sözlükte karşılığı olan dize ve şablon metinleri değiştirilir.
const fs = require('fs'); const acorn = require('acorn'); const walk = require('acorn-walk');
const [, , IN, OUT, DICT, LANG] = process.argv;
const LOCALE = { en: 'en-GB', de: 'de-DE', es: 'es-ES' }[LANG] || 'en-GB';
const src = fs.readFileSync(IN, 'utf8'); const D = JSON.parse(fs.readFileSync(DICT, 'utf8'));
const has = (k) => Object.prototype.hasOwnProperty.call(D, k) && D[k] !== null;
const nodes = []; const re = /<script>([\s\S]*?)<\/script>/g; let m;
while ((m = re.exec(src))) {
  const off = m.index + '<script>'.length;
  const ast = acorn.parse(m[1], { ecmaVersion: 'latest', sourceType: 'script', allowReturnOutsideFunction: true, allowAwaitOutsideFunction: true });
  walk.full(ast, (n) => {
    if (n.type === 'Literal' && typeof n.value === 'string' && has(n.value)) nodes.push({ k: 's', s: off + n.start, e: off + n.end, v: D[n.value] });
    if (n.type === 'Property' && !n.computed && !n.shorthand && n.key.type === 'Literal' && typeof n.key.value === 'string' && has(n.key.value)) nodes.push({ k: 's', s: off + n.key.start, e: off + n.key.end, v: D[n.key.value] });
    if (n.type === 'TemplateLiteral') {
      let pat = ''; n.quasis.forEach((q, i) => { pat += q.value.cooked; if (i < n.expressions.length) pat += '{' + i + '}'; });
      if (has(pat)) nodes.push({ k: 't', s: off + n.start, e: off + n.end, v: D[pat], ex: n.expressions.map((x) => [off + x.start, off + x.end]) });
    }
  });
}
nodes.sort((a, b) => a.s - b.s || b.e - a.e);
let used = 0;
function emit(s, e) {
  let out = '', p = s;
  for (const n of nodes) {
    if (n.s < p || n.s < s || n.e > e) continue;
    out += src.slice(p, n.s); out += render(n); p = n.e; used++;
  }
  return out + src.slice(p, e);
}
function render(n) {
  if (n.k === 's') return JSON.stringify(n.v);
  const esc = (t) => t.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
  return '`' + n.v.split(/(\{\d+\})/).map((part) => { const mm = /^\{(\d+)\}$/.exec(part); return mm ? '${' + emit(n.ex[+mm[1]][0], n.ex[+mm[1]][1]) + '}' : esc(part); }).join('') + '`';
}
let res = emit(0, src.length);
res = res.replace(/'tr-TR'/g, `'${LOCALE}'`).replace(/"tr-TR"/g, `"${LOCALE}"`)
  .replace('<html lang="tr">', `<html lang="${LANG}">`)
  .replace(/' Mn ₺'/g, `' ${{en:'M',de:'Mio.',es:'M'}[LANG]||'M'} ₺'`).replace(/' B ₺'/g, `' ${{en:'K',de:'Tsd.',es:'mil'}[LANG]||'K'} ₺'`)
  .replace(/₺/g, '€');
fs.writeFileSync(OUT, res);
console.log(`i18n ${LANG}: ${used} metin değiştirildi`);
