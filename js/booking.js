function openModal(id){
  const u=getUser();
  if(!u){document.getElementById('loginModal').classList.remove('hidden');toast('🔑 Avval ism + nomer + viloyat bilan kiring');return}
  selectedDoctor=doctors.find(d=>d.id===id);selectedTime=null;
  document.getElementById('mDoctor').textContent=selectedDoctor.name;
  document.getElementById('mInfo').textContent=`${selectedDoctor.spec} • ${selectedDoctor.clinic}, ${selectedDoctor.city} • ${selectedDoctor.price} • 📌 ${selectedDoctor.addr}`;
  const bd=document.getElementById('bDate');
  bd.min=todayStr();bd.max=addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1);
  // birinchi bo'sh vaqti bor kunni avtomatik tanlaymiz (kechqurun "bugun" to'la bo'ladi)
  let first=todayStr();
  for(let k=0;k<MAX_ADVANCE_DAYS;k++){const dt=addDaysStr(todayStr(),k);if(dayFreeCount(selectedDoctor.id,dt)>0){first=dt;break}}
  bd.value=first;
  document.getElementById('bName').value=u.name;
  document.getElementById('bPhone').value=u.phone;
  refreshSlots();
  document.getElementById('modal').classList.remove('hidden');
}
function renderDayStrip(){
  const box=document.getElementById('dayStrip');if(!box||!selectedDoctor)return;
  const cur=document.getElementById('bDate').value||todayStr();
  let html='';
  for(let k=0;k<MAX_ADVANCE_DAYS;k++){
    const dt=addDaysStr(todayStr(),k);
    const n=dayFreeCount(selectedDoctor.id,dt);
    const cls=dt===cur?'day-sel':(n>0?'day-free':'day-full');
    const label=k===0?'Bugun':(k===1?'Ertaga':dt.slice(5));
    html+=`<button class="${cls}" onclick="pickDay('${dt}')" title="${dt}: ${n} bo'sh">${label}<br><small>${n>0?'🟢'+n:'🔴0'}</small></button>`;
  }
  box.innerHTML=html;
}
function pickDay(dt){document.getElementById('bDate').value=dt;refreshSlots();}
function refreshSlots(){
  if(!selectedDoctor)return;
  let date=document.getElementById('bDate').value||todayStr();
  // 14 kundan oshib ketmasin
  if(date<todayStr()){date=todayStr();document.getElementById('bDate').value=date}
  if(date>addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1)){date=addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1);document.getElementById('bDate').value=date}
  renderDayStrip();
  const{slots,closed}=buildSlots(selectedDoctor.id,date);
  const taken=getTaken(selectedDoctor.id,date);
  const box=document.getElementById('timeSlots');
  if(!slots.length){box.innerHTML='<p class="sub">Bu kunda ish vaqti belgilanmagan.</p>';return}
  box.innerHTML=slots.map(t=>{
    if(isPastSlot(date,t)&&!taken.has(t))return `<button disabled class="slot-closed" title="Bu vaqt o'tib ketgan">⌛ ${t}</button>`;
    if(closed.includes(t)&&!taken.has(t))return `<button disabled class="slot-closed" title="Shifokor yopgan">🔒 ${t}</button>`;
    if(taken.has(t))return `<button disabled class="slot-taken" title="Bu soat band — boshqa odam olgan">⛔ ${t} band</button>`;
    return `<button onclick="pickTime(this,'${t}')">🟢 ${t}</button>`;
  }).join('');
  selectedTime=null;
}
function pickTime(el,t){
  if(el.disabled)return;
  selectedTime=t;
  document.querySelectorAll('#timeSlots button').forEach(b=>b.classList.remove('active'));el.classList.add('active');
}
function closeModal(){document.getElementById('modal').classList.add('hidden')}
// Esc yoki fonga bosish bron oynasini yopadi
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});

function getBooks(){
  let b=[];
  try{b=JSON.parse(localStorage.getItem('medbron')||'[]')}catch{b=[]}
  let changed=false;
  b.forEach(x=>{
    if(!x.status){x.status='waiting';x.createdAt=Date.now();x.postponed=0;changed=true}
    if(x.persons==null){x.persons=1;changed=true}
    if(x.docId==null){const d=doctors.find(d=>d.name===x.doc);if(d){x.docId=d.id;changed=true}}
  });
  if(changed)localStorage.setItem('medbron',JSON.stringify(b));
  return b;
}
function saveBooks(b){localStorage.setItem('medbron',JSON.stringify(b));renderMy();tickQueue(true);renderDoctors();renderAdminToday();renderAdminSlots();}
function getSms(){try{return JSON.parse(localStorage.getItem('medbron_sms')||'[]')}catch{return[]}}
function saveSms(s){localStorage.setItem('medbron_sms',JSON.stringify(s.slice(-30)));renderSms()}
function sendSMS(phone,text){
  const log=getSms();
  log.push({phone,text,time:new Date().toLocaleTimeString('uz-UZ',{hour:'2-digit',minute:'2-digit',second:'2-digit'})});
  saveSms(log);
}
function confirmBooking(){
  const u=getUser()||{};
  const name=(document.getElementById('bName').value.trim()||u.name||'').trim();
  const phone=(document.getElementById('bPhone').value.trim()||u.phone||'').trim();
  const date=document.getElementById('bDate').value;
  const persons=parseInt((document.getElementById('bPersons')||{}).value,10)||1;
  if(!selectedTime){toast('⏰ Iltimos, bo‘sh (yashil) vaqt tanlang');return}
  if(name.length<3||phone.replace(/\D/g,'').length<9){toast('⚠️ Ism va telefonni to‘g‘ri kiriting (+998...)');return}
  const samePhone=p=>p.replace(/\D/g,'').slice(-9)===phone.replace(/\D/g,'').slice(-9);
  const dup=getBooks().find(x=>x.docId===selectedDoctor.id&&x.date===date&&samePhone(x.phone)&&(x.status==='waiting'||x.status==='called'));
  if(dup){toast(`ℹ️ Sizda bu shifokorga ${date} kuni bron bor (${dup.num}, ${dup.time}) — vaqtni "Mening bronlarim"dan o‘zgartiring`);return}
  // ikkinchi marta tekshiramiz — bu soatni birov olgan bo'lishi mumkin
  const taken=getTaken(selectedDoctor.id,date);
  const{closed}=buildSlots(selectedDoctor.id,date);
  if(taken.has(selectedTime)){toast('⛔ Bu soatni hozirgina boshqa odam oldi — boshqa vaqt tanlang');refreshSlots();return}
  if(closed.includes(selectedTime)){toast('🔒 Bu soat yopiq');refreshSlots();return}
  const books=getBooks();
  const num=newBookNum(books);
  const nb={num,docId:selectedDoctor.id,doc:selectedDoctor.name,spec:selectedDoctor.spec,clinic:selectedDoctor.clinic,city:selectedDoctor.city,date,time:selectedTime,name,phone,persons,status:'waiting',createdAt:Date.now(),postponed:0};
  books.push(nb);
  saveBooks(books);closeModal();
  sendSMS(phone,`MedBron: ${name}! ${selectedDoctor.clinic} (${selectedDoctor.city}, ${selectedDoctor.addr}) ga bron: ${num}, ${date} ${selectedTime}, ${persons} kishi. Bu soat endi band — boshqalar ololmaydi. Navbat kelganda registraturaga ${num} raqamini ayting.`);
  notifyAdminAction('new',`YANGI BRON: ${name} (${phone}) — ${selectedDoctor.name}, ${date} ${selectedTime}`,nb);
  toast(`✅ Bron tayyor! ${num} • ${date} ${selectedTime} band qilindi`);
  const dq=document.getElementById('demoQueue');if(dq)dq.textContent='#'+num.slice(3);
  refreshSlots();scrollToId('queue');
}

function statusBadge(b){
  if(b.status==='waiting')return `<span class="st st-wait">⏳ Kutmoqda</span>`;
  if(b.status==='called')return `<span class="st st-call">📢 Chaqirildi — <b data-countdown-for="${b.num}">...</b></span>`;
  if(b.status==='confirmed')return `<span class="st st-ok">✅ Keldi</span>`;
  if(b.status==='skipped')return `<span class="st st-skip">❌ Kelmadi — o'rni berildi</span>`;
  return '';
}
function renderMy(){
  const u=getUser();
  const books=getBooks().filter(b=>!u||b.phone===u.phone);
  const btn=document.getElementById('myCountBtn');
  if(btn)btn.textContent=`Mening bronlarim (${books.length})`;
  const bn=document.getElementById('bnCount');
  if(bn){bn.textContent=books.length;bn.classList.toggle('hidden',!u||!books.length)}
  const box=document.getElementById('myList');
  if(!box)return;
  if(!u){box.innerHTML='<p class="sub">🔑 Avval kiring — shunda faqat sizning bronlaringiz ko‘rinadi.</p>';return}
  const all=getBooks();
  box.innerHTML=books.length?books.map(b=>{
    const i=all.findIndex(x=>x.num===b.num);
    let actions='';
    // "Keldi" ni faqat admin bosadi — bemorda faqat vaqtni o'zgartirish + bekor qilish
    if(b.status==='waiting'||b.status==='called')actions=`<button class="mini-btn" onclick="postponeBook(${i})">Vaqtni o'zgartirish ⏩</button>`;
    else if(b.status==='skipped')actions=`<button class="mini-btn" onclick="rebook(${i})">Qayta navbat 🔁</button>`;
    actions+=`<button class="cancel" onclick="cancelBook(${i})">Bekor qilish</button>`;
    return `<div class="ticket ${b.status}"><div><b>${b.num}</b> • ${esc(b.doc)}<br><small>📅 ${b.date} ⏰ ${b.time} • 👤 ${esc(b.name)} • 👥 ${b.persons||1} • 📞 ${esc(b.phone)}<br>📌 ${esc(b.clinic||'')}, ${esc(b.city)}</small><br>${statusBadge(b)}</div><div class="ticket-btns">${actions}</div></div>`;
  }).join(''):`<p class="sub">Hali bron yo'q. ${esc(u.region)} dan shifokor tanlang.</p>`;
}
function newBookNum(books){
  const used=new Set(books.map(x=>x.num));
  let num;do{num='MB-'+Math.floor(1000+Math.random()*9000)}while(used.has(num));
  return num;
}
function cancelBook(i){
  const cur=getBooks()[i];if(!cur)return;
  if(!confirm(`${cur.num} (${cur.date} ${cur.time}) bronini bekor qilasizmi?`))return;
  const b=getBooks();const[rm]=b.splice(i,1);saveBooks(b);
  if(!rm)return;
  // allaqachon kelgan yoki kelmagan bronni o'chirish — soat bo'shamaydi, faqat ro'yxatdan olinadi
  if(rm.status!=='waiting'&&rm.status!=='called'){toast('🗑 Ro‘yxatdan olib tashlandi');return}
  sendSMS(rm.phone,`MedBron: ${rm.num} bekor qilindi, ${rm.date} ${rm.time} soat bo‘shatildi — endi boshqalar olishi mumkin.`);
  notifyAdminAction('freed',`BO'SHADI 🟢: ${rm.name} bekor qildi — ${rm.doc}, ${rm.date} ${rm.time} endi bo'sh`,rm);
  // o'rin keyingi odamga o'tadi: shu shifokor+shu sana bo'yicha eng oldingi kutayotganni topib o'sha bo'sh soatga qo'yamiz
  promoteNextToFreedSlot(rm.docId,rm.date,rm.time);
  toast('🗑 Bekor qilindi, soat bo‘shatildi');
}
function promoteNextToFreedSlot(docId,date,freedTime,skipNum){
  const b=getBooks();
  // faqat bo'shagan soatdan KEYINROQ turgan eng yaqin bemorni oldinga suramiz (hech kimni kechroqqa surmaymiz)
  const cand=isPastSlot(date,freedTime)?null:b.filter(x=>x.docId===docId&&x.date===date&&x.status==='waiting'&&x.time>freedTime&&x.num!==skipNum).sort((a,c)=>a.time<c.time?-1:a.time>c.time?1:(a.createdAt||0)-(c.createdAt||0))[0];
  if(!cand){
    toast(`🟢 ${freedTime} bo‘sh — admin menyusida yashil chiqdi, keyingi bemor olishi mumkin`);
    return;
  }
  const old=cand.time;
  cand.time=freedTime;cand.createdAt=Date.now();
  saveBooks(b);
  sendSMS(cand.phone,`MedBron: Xushxabar! 🟢 ${date} kuni ${freedTime} soat bo‘shadi va sizning o'rningiz (${cand.num}) avtomatik shu soatga o‘tkazildi (oldingi soatingiz ${old} edi).`);
  notifyAdminAction('change',`O'RIN O'TDI ➡️: ${cand.num} (${cand.name}) ${old} → ${freedTime} ga avtomatik o'tkazildi`,cand);
  toast(`➡️ ${cand.num} bo‘shagan ${freedTime} ga o‘tkazildi`);
}
function postponeBook(i){
  const b=getBooks();const item=b[i];
  if(!item||(item.status!=='waiting'&&item.status!=='called'))return;
  const{slots,closed}=buildSlots(item.docId,item.date);
  const taken=getTaken(item.docId,item.date);
  // "o'zgartirish" = keyingi bo'sh soatga surish (joriy soatdan keyingi)
  const next=slots.find(t=>!taken.has(t)&&!closed.includes(t)&&t>item.time);
  if(!next){toast('⛔ Bugun keyinroq bo‘sh vaqt yo‘q — bekor qilib boshqa kunga yoziling');return}
  const oldTime=item.time;
  item.time=next;item.status='waiting';item.calledAt=null;item.expiresAt=null;item.warnSent=false;item.postponed=(item.postponed||0)+1;item.createdAt=Date.now();
  saveBooks(b);
  sendSMS(item.phone,`MedBron: ${item.num} ${oldTime} → ${next} ga ko'chirildi. Eski soatingiz bo‘shatildi.`);
  notifyAdminAction('change',`O'ZGARTIRDI 🟡: ${item.name} (${item.num}) ${item.date} ${oldTime} → ${next}`,item);
  notifyAdminAction('freed',`BO'SHADI 🟢: ${item.date} ${oldTime} (${item.doc}) endi bo'sh — admin menyusida yashil`,{...item,time:oldTime});
  promoteNextToFreedSlot(item.docId,item.date,oldTime,item.num);
  toast(`⏩ ${next} ga ko‘chirildi`);
}
function rebook(i){
  const b=getBooks();const item=b[i];if(!item)return;
  // eski soatni boshqa odam olgan bo'lishi mumkin — keyingi bo'sh soatni beramiz
  const{slots,closed}=buildSlots(item.docId,item.date);
  const taken=getTaken(item.docId,item.date);
  if(taken.has(item.time)||closed.includes(item.time)){
    const nt=slots.find(t=>!taken.has(t)&&!closed.includes(t));
    if(!nt){toast('⛔ Bu kunda bo‘sh vaqt qolmadi — yangi bron qiling');return}
    item.time=nt;
  }
  item.status='waiting';item.createdAt=Date.now();item.calledAt=null;item.expiresAt=null;item.warnSent=false;
  saveBooks(b);toast('🔁 Qayta navbatga qo‘yildi');
}
