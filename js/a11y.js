/* ============ QULAYLIK: Kirill yozuvi, katta shrift, ovoz bilan kiritish ============ */
function prefGet(k){try{return localStorage.getItem(k)}catch{return null}}
function prefSet(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch{}}

/* --- Lotin → Kirill (o'zbek imlosi) --- */
const L2C={a:'а',b:'б',c:'ц',d:'д',f:'ф',g:'г',h:'ҳ',i:'и',j:'ж',k:'к',l:'л',m:'м',n:'н',o:'о',p:'п',q:'қ',r:'р',s:'с',t:'т',u:'у',v:'в',w:'в',x:'х',y:'й',z:'з'};
// o'zgartirilmaydigan so'zlar: bron raqamlari, loginlar, qisqartmalar, brend
const KEEP=new Set(['AI','SMS','MVP','MedBron','MB','Dr','uz']);
function wordToCyr(w){
  if(KEEP.has(w)||/\d|@|\/|\.\w/.test(w))return w;
  const s=w.replace(/[‘’ʻʼ`]/g,"'");
  const isLat=ch=>/[a-z]/i.test(ch||'');
  let out='';
  for(let i=0;i<s.length;){
    const c=s[i],lc=c.toLowerCase(),n=(s[i+1]||'').toLowerCase(),up=c!==lc;
    let r,step=1;
    if(s.substr(i,5).toLowerCase()==='tsiya'){r='ция';step=5}
    else if(lc==='o'&&n==="'"){r='ў';step=2}
    else if(lc==='g'&&n==="'"){r='ғ';step=2}
    else if(lc==='s'&&n==='h'){r='ш';step=2}
    else if(lc==='c'&&n==='h'){r='ч';step=2}
    else if(lc==='y'&&'euoa'.includes(n)&&n&&!(n==='o'&&s[i+2]==="'")){r={e:'е',u:'ю',o:'ё',a:'я'}[n];step=2}
    else if(lc==='e'){const prev=s[i-1]||'';r=(!isLat(prev)||/[aeiou]/i.test(prev))?'э':'е'}
    else if(c==="'"){r=isLat(s[i-1])&&isLat(s[i+1])?'ъ':"'"}
    else r=L2C[lc]??c;
    out+=up?r.toUpperCase():r;i+=step;
  }
  return out;
}
function toCyr(text){return text.replace(/[A-Za-z0-9'‘’ʻʼ`@./:]+/g,wordToCyr)}

/* --- Kirill → Lotin (AI kirill yoki ovozdan kelgan matnni ham tushunsin) --- */
const C2L={'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'j','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'x','ц':'ts','ч':'ch','ш':'sh','щ':'sh','ъ':"'",'ь':'','ы':'i','э':'e','ю':'yu','я':'ya','ў':"o'",'қ':'q','ғ':"g'",'ҳ':'h'};
function toLatin(text){return text.toLowerCase().replace(/(^|[^а-яёўқғҳ])е/g,'$1ye').replace(/[а-яёўқғҳ]/g,ch=>C2L[ch]??ch)}

/* --- Sahifani kirillga o'girish (dinamik chiqadigan matnlar ham) --- */
const SKIP_TAGS=new Set(['SCRIPT','STYLE','TEXTAREA','INPUT','NOSCRIPT']);
function cyrNode(node){
  if(node.nodeType===3){
    const p=node.parentElement;
    if(!p||SKIP_TAGS.has(p.tagName)||p.closest('.no-tr'))return;
    const t=toCyr(node.data);if(t!==node.data)node.data=t;
  }else if(node.nodeType===1&&!SKIP_TAGS.has(node.tagName)&&!node.closest('.no-tr')){
    ['placeholder','title','aria-label'].forEach(a=>{const v=node.getAttribute(a);if(v){const t=toCyr(v);if(t!==v)node.setAttribute(a,t)}});
    node.childNodes.forEach(cyrNode);
  }
}
let cyrObserver=null;
function applyCyr(){
  document.documentElement.lang='uz-Cyrl';
  document.title=toCyr(document.title);
  cyrNode(document.body);
  // o'girilgan matn qayta o'girilganda o'zgarmaydi, shuning uchun cheksiz tsikl bo'lmaydi
  cyrObserver=new MutationObserver(ms=>ms.forEach(m=>{
    if(m.type==='characterData')cyrNode(m.target);
    else if(m.type==='attributes')cyrNode(m.target);
    else m.addedNodes.forEach(cyrNode);
  }));
  cyrObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title']});
}
function toggleScript(){
  // lotinga qaytish uchun sahifani qayta yuklaymiz — asl matnlar qaytadi
  if(prefGet('medbron_cyr')){prefSet('medbron_cyr',null);location.reload()}
  else{prefSet('medbron_cyr','1');applyCyr();syncA11yBtns()}
}

/* --- Katta shrift (keksalar uchun) --- */
function toggleBig(){
  const on=!document.documentElement.classList.contains('big');
  document.documentElement.classList.toggle('big',on);
  prefSet('medbron_big',on?'1':null);syncA11yBtns();
}
function syncA11yBtns(){
  const sb=document.getElementById('scriptBtn'),bb=document.getElementById('bigBtn');
  const cyr=!!prefGet('medbron_cyr'),big=document.documentElement.classList.contains('big');
  if(sb){sb.textContent=cyr?'Lot':'Кир';sb.classList.toggle('on',cyr)}
  if(bb){bb.textContent=big?'A−':'A+';bb.classList.toggle('on',big)}
}

/* --- Ovoz bilan simptom aytish --- */
let recog=null;
function voiceInput(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const btn=document.getElementById('micBtn');
  if(!SR){toast('🎤 Bu brauzer ovozni qo‘llamaydi — Google Chrome’da oching yoki yozib kiriting');return}
  if(recog){recog.stop();return}
  const ta=document.getElementById('symptomInput');
  const base=ta.value.trim();
  recog=new SR();recog.lang='uz-UZ';recog.interimResults=true;recog.continuous=false;
  recog.onresult=e=>{ta.value=(base?base+' ':'')+[...e.results].map(r=>r[0].transcript).join(' ')};
  recog.onerror=e=>{toast(e.error==='not-allowed'?'🎤 Mikrofonga ruxsat bering':e.error==='language-not-supported'?'🎤 O‘zbek tilidagi ovoz bu qurilmada ishlamaydi — yozib kiriting':'🎤 Ovoz eshitilmadi, qayta urinib ko‘ring')};
  recog.onend=()=>{recog=null;btn.classList.remove('rec');btn.textContent='🎤 Ovoz bilan aytish';if(ta.value.trim().length>=5)aiDiagnose()};
  btn.classList.add('rec');btn.textContent='⏺ Gapiring... (to‘xtatish)';
  recog.start();
}

// saqlangan sozlamalarni qo'llaymiz
if(prefGet('medbron_big'))document.documentElement.classList.add('big');
if(prefGet('medbron_cyr'))applyCyr();
syncA11yBtns();
