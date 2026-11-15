// Metinleri HTML etiketlerinden ayırıp yalnızca çevrilecek parçaları (run) çıkarır ve geri birleştirir.
// node i18n/runs.cjs list            -> i18n/runs.json (benzersiz parçalar)
// node i18n/runs.cjs build en        -> i18n/runs_en/*.json'dan i18n/en.json üretir
const fs=require('fs'); const path=require('path'); const D=__dirname;
const keys=JSON.parse(fs.readFileSync(D+'/strings.json','utf8'));
const CODE=/^(#|\[|\.)|^[A-Z0-9_]{1,6}$|^[a-z]+[A-Z][A-Za-z0-9]*$|^(Preferences|Haptics|App|StatusBar|SplashScreen|HEAVY|MEDIUM|LIGHT|CIRCLE|OVAL|RECT|use strict|tr-TR|seasonEnd)$|^[a-z0-9_\-]+$/;
// parça: etiket dışı metin ya da title/aria-label/placeholder/alt öznitelikleri
function split(k){ // -> [{t:'raw'|'run', s}]
  const out=[]; const whole=(c)=>c===k; let i=0; const re=/<[^>]*>/g; let m;
  const pushText=(s)=>{ if(!s) return; const lead=s.match(/^\s*/)[0], trail=s.match(/\s*$/)[0]; const core=s.slice(lead.length,s.length-trail.length);
    if(lead) out.push({t:'raw',s:lead}); if(core) out.push(isRun(core,!whole(core))?{t:'run',s:core}:{t:'raw',s:core}); if(trail&&core) out.push({t:'raw',s:trail}); };
  while((m=re.exec(k))){ pushText(k.slice(i,m.index)); splitTag(m[0]).forEach(x=>out.push(x)); i=m.index+m[0].length; }
  pushText(k.slice(i)); return out;
}
function splitTag(tag){ const out=[]; const re=/((?:title|aria-label|placeholder|alt)=")([^"]*)(")/g; let i=0,m;
  while((m=re.exec(tag))){ out.push({t:'raw',s:tag.slice(i,m.index)+m[1]}); out.push(isRun(m[2])?{t:'run',s:m[2]}:{t:'raw',s:m[2]}); out.push({t:'raw',s:m[3]}); i=m.index+m[0].length; }
  out.push({t:'raw',s:tag.slice(i)}); return out; }
function isRun(s,inner){ const x=s.replace(/\{\d+\}/g,'').replace(/&[a-z]+;/g,'');
  if(!/[A-Za-zÇĞİŞÖÜçğışöü]{2}/.test(x)) return false; if(inner&&/^[A-Za-zçğışöüÇĞİŞÖÜ .,'’]+$/.test(s.trim())) return true; if(CODE.test(s.trim())&&!/[çğışöüÇĞİŞÖÜ]/.test(s)) return false; return true; }
const cmd=process.argv[2];
if(cmd==='list'){ const old=fs.existsSync(D+'/runs.json')?JSON.parse(fs.readFileSync(D+'/runs.json','utf8')):[]; const set=new Map(old.map(x=>[x,1])); keys.forEach(k=>split(k).forEach(p=>{ if(p.t==='run') set.set(p.s,1); })); const arr=[...set.keys()];
  fs.writeFileSync(D+'/runs.json',JSON.stringify(arr,null,0)); console.log('runs',arr.length,'chars',arr.reduce((a,s)=>a+s.length,0)); }
if(cmd==='build'){ const L=process.argv[3]; const runs=JSON.parse(fs.readFileSync(D+'/runs.json','utf8')); const T={}; const dir=D+'/runs_'+L;
  fs.readdirSync(dir).filter(f=>f.endsWith('.json')).forEach(f=>Object.assign(T,JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'))));
  const tr={}; runs.forEach((r,i)=>{ if(T[i]!=null) tr[r]=T[i]; });
  const out={}; let miss=0; const missList=[];
  keys.forEach(k=>{ const parts=split(k); let changed=false; const v=parts.map(p=>{ if(p.t==='run'){ if(tr[p.s]!=null){ changed=true; return tr[p.s]; } miss++; missList.push(p.s); } return p.s; }).join(''); if(changed && v!==k) out[k]=v; });
  fs.writeFileSync(D+'/'+L+'.json',JSON.stringify(out));
  console.log(L,'keys',Object.keys(out).length,'missing runs',miss, [...new Set(missList)].slice(0,30)); }
