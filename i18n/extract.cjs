// Çevrilecek metinleri listeler: node i18n/extract.cjs index.html > i18n/strings.json
const fs=require('fs'),acorn=require('acorn'),walk=require('acorn-walk');
const src=fs.readFileSync(process.argv[2],'utf8');const re=/<script>([\s\S]*?)<\/script>/g;let m;const out=new Map();
const human=t=>{ const x=t.replace(/<[^>]*>/g,' ').replace(/\{\d+\}/g,' ').replace(/&[a-z]+;/g,' ');
  if(!/[A-Za-zÇĞİŞÖÜçğışöü]{2}/.test(x)) return false;
  if(/^[a-z0-9_\-\.#:]+$/.test(t)) return false;                  // id / anahtar
  if(/^(#[0-9a-f]{3,8}|var\(|rgba?\(|M[\d\s\.\-]+|translate|rotate|scale)/i.test(t)) return false;
  if(/^[\w\-]+(\s[\w\-]+)*$/.test(t)&&!/[A-ZÇĞİŞÖÜçğışöü]/.test(t)&&!/\s/.test(t)) return false;
  return true; };
const SKIP=new Set(['NAMES','TR4_RAW','TR_CITIES','TR_SUFFIX','HOME_CITIES','HOME_SUF','IG_USERS','KITS','GK_KITS','CREST_EMB','CREST_SHAPES','POSES']);
while((m=re.exec(src))){const ast=acorn.parse(m[1],{ecmaVersion:'latest',allowReturnOutsideFunction:true,allowAwaitOutsideFunction:true});
 const skip=[];
 walk.full(ast,n=>{ if(n.type==='VariableDeclarator'&&n.id.name&&SKIP.has(n.id.name)) skip.push([n.start,n.end]);
   if(n.type==='Property'&&((n.key.name||n.key.value)==='teams'||(n.key.name||n.key.value)==='f'||(n.key.name||n.key.value)==='l')&&n.value.type==='ArrayExpression') skip.push([n.start,n.end]); });
 const inSkip=p=>skip.some(([a,b])=>p>=a&&p<b);
 walk.full(ast,n=>{ if(inSkip(n.start)) return;
  if(n.type==='Literal'&&typeof n.value==='string'&&human(n.value)) out.set(n.value,1);
  if(n.type==='TemplateLiteral'){let pat='';n.quasis.forEach((q,i)=>{pat+=q.value.cooked;if(i<n.expressions.length)pat+='{'+i+'}'});if(human(pat))out.set(pat,1)}})}
console.log(JSON.stringify([...out.keys()],null,0));
