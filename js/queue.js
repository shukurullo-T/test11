function sortedQueue(){
  const b=getBooks();
  const rank={called:0,waiting:1,confirmed:2,skipped:3,cancelled:4};
  return b.map((x,i)=>({...x,_i:i})).sort((a,c)=>{
    if((rank[a.status]??9)!==(rank[c.status]??9))return (rank[a.status]??9)-(rank[c.status]??9);
    if(a.date!==c.date)return a.date<c.date?-1:1;
    if(a.time!==c.time)return a.time<c.time?-1:1;
    return (a.createdAt||0)-(c.createdAt||0);
  });
}
function getCalled(){return getBooks().find(x=>x.status==='called')||null}
function callNext(auto){
  const adm=getAdmin();
  if(!adm){if(!auto){toast('🔒 Navbatni faqat admin chaqiradi — admin login bilan kiring');scrollToId('admin')}return}
  const b=getBooks();
  if(b.some(x=>x.status==='called')){if(!auto)toast('⚠️ Chaqirilgan bemor bor');tickQueue(true);return}
  // admin faqat o'z klinikasining BUGUNGI bemorlarini chaqiradi — soat bo'yicha, keyin bron vaqti bo'yicha
  const today=todayStr();
  const pool=b.filter(x=>x.status==='waiting'&&x.clinic===adm.clinic&&x.date===today)
    .sort((a,c)=>a.time<c.time?-1:a.time>c.time?1:(a.createdAt||0)-(c.createdAt||0));
  const cand=pool[0];
  if(!cand){if(!auto)toast(`📭 ${adm.clinic} da bugun kutayotgan bemor yo‘q`);return}
  const now=Date.now();
  cand.status='called';cand.calledAt=now;cand.expiresAt=now+GRACE_SECONDS*1000;cand.warnSent=false;
  saveBooks(b);
  sendSMS(cand.phone,`MedBron: ${cand.name}! Navbatingiz keldi (${cand.num}). ${fmtDur(GRACE_SECONDS)} ichida registraturaga keling, ulgurmasangiz "Vaqtni o'zgartirish" bosing.`);
  toast(`📢 ${cand.num} chaqirildi`);
}
function confirmArrivalPrompt(num){doCheckin(num)}
function doCheckin(raw){
  const adm=getAdmin();
  if(!adm){toast('🔒 Kelganini faqat admin belgilaydi — admin login bilan kiring');scrollToId('admin');return}
  const box=document.getElementById('adminCheckInput');
  const legacy=document.getElementById('checkInput');
  const v=(raw||(box&&box.value)||(legacy&&legacy.value)||'').trim();
  if(!v){toast('⚠️ Raqam/telefon kiriting');return}
  const b=getBooks();
  const norm=v.toLowerCase().replace(/\s/g,'');
  let f=b.find(x=>x.status==='called'&&(x.num.toLowerCase()===norm||x.phone.replace(/[\s+\-()]/g,'')===v.replace(/[\s+\-()]/g,'')));
  if(!f){
    f=b.find(x=>x.status==='waiting'&&(x.num.toLowerCase()===norm||x.phone.replace(/[\s+\-()]/g,'')===v.replace(/[\s+\-()]/g,'')));
    if(f){toast(`ℹ️ ${f.num} hali chaqirilmagan, kuting.`);return}
    toast('❌ Topilmadi');return
  }
  f.status='confirmed';saveBooks(b);
  sendSMS(f.phone,`MedBron: ${f.num} tasdiqlandi ✅. Qabulga kiring.`);
  notifyAdminAction('change',`KELDI ✅: admin ${f.name} (${f.num}) kelganini belgiladi — qabulga kirdi`,f);
  toast(`✅ ${f.num} keldi!`);
  if(box)box.value='';
  const ci=document.getElementById('checkInput');if(ci)ci.value='';
  setTimeout(()=>callNext(true),1500);
}
function tickQueue(){
  const called=getCalled();
  const now=Date.now();
  const curBox=document.getElementById('qCurrent');
  const callBox=document.getElementById('qCalled');
  const listBox=document.getElementById('qList');
  if(!curBox)return;
  const books=getBooks();
  const confirmed=books.filter(x=>x.status==='confirmed').slice(-1)[0];
  curBox.innerHTML=confirmed?`<b>${confirmed.num}</b> • ${esc(confirmed.name)} qabulda ✅`:`<b>—</b> • Qabul boshlanmagan`;
  if(called){
    const left=called.expiresAt-now;
    if(left<=0){
      called.status='skipped';saveBooks(books);
      sendSMS(called.phone,`MedBron: ❌ ${called.num} — ${fmtDur(GRACE_SECONDS)} ichida kelmadingiz, o'rningiz keyingi bemorga berildi. Qayta yozilish uchun registraturaga qo'ng'iroq qiling.`);
      notifyAdminAction('freed',`KELMADI ⏰: ${called.name} (${called.num}) vaqtida kelmadi — ${called.doc}, ${called.date} ${called.time} bo'shadi, o'rin keyingi bemorga o'tdi`,called);
      toast(`⏰ ${called.num} kelmadi — o'rni berildi`);
      setTimeout(()=>callNext(true),1200);return;
    }
    if(!called.warnSent&&left<=(GRACE_SECONDS*1000)/2){
      called.warnSent=true;localStorage.setItem('medbron',JSON.stringify(books));
      sendSMS(called.phone,`MedBron: ⚠️ ${called.num} — ${fmtLeft(left)} qoldi! "Vaqtni o'zgartirish" bosing, bo‘lmasa navbat olib tashlanadi.`);
    }
    document.querySelectorAll(`[data-countdown-for="${called.num}"]`).forEach(e=>e.textContent=fmtLeft(left));
    const pct=Math.max(0,Math.min(100,left/(GRACE_SECONDS*1000)*100));
    // Asosiy menyu — faqat soniyalar (tugmasiz)
    callBox.innerHTML=`<div class="called-card"><div><span class="muted-sm">Chaqirildi:</span><br><b class="big-num">${called.num}</b> • ${esc(called.name)} • 👥 ${called.persons||1}<br><small>${esc(called.doc)} • ${called.date} ${called.time}</small></div><div class="count-right"><div class="count-num">⏳ ${fmtLeft(left)}</div><div class="count-bar"><div class="count-fill" style="width:${pct}%"></div></div><small>Kelmasa avtomatik keyingisiga o'tadi</small></div></div>`;
    // Admin — tugmalar bilan
    const ab=document.getElementById('adminCalled');
    if(ab)ab.innerHTML=`<div class="called-card"><div><span class="muted-sm">Chaqirildi (admin):</span><br><b class="big-num">${called.num}</b> • ${esc(called.name)} • 📞 ${esc(called.phone)}<br><small>${esc(called.doc)} • ${called.date} ${called.time}</small></div><div class="count-right"><div class="count-num">⏳ <span data-countdown-for="${called.num}">${fmtLeft(left)}</span></div><div class="count-bar"><div class="count-fill" style="width:${pct}%"></div></div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="mini-btn ok" onclick="confirmArrivalPrompt('${called.num}')">Keldi ✅</button><button class="mini-btn" onclick="postponeByNum('${called.num}')">Vaqtni o'zgartirish ⏩</button></div></div></div>`;
  }else{
    callBox.innerHTML=`<p class="sub">📭 Hozir chaqiriq yo'q — admin chaqirganda shu yerda soniyalar chiqadi.</p>`;
    const ab=document.getElementById('adminCalled');
    if(ab)ab.innerHTML=`<p class="sub">📭 Chaqiruv yo‘q. <button class="mini-btn ok" onclick="callNext()">Keyingini chaqirish 📢</button></p>`;
  }
  const u=getUser();
  const active=sortedQueue().filter(x=>x.status==='waiting'||x.status==='called');
  const qRows=q=>q.length?q.map((x,pos)=>`<div class="q-item ${x.status}"><span><b>#${pos+1}</b> ${x.num} • ${esc(x.name)} • ${x.date===todayStr()?'':x.date.slice(5)+' '}${x.time}</span>${x.status==='called'?`<span class="st st-call">📢 <span data-countdown-for="${x.num}">...</span></span>`:`<span class="st st-wait">⏳</span>`}</div>`).join(''):`<p class="sub">Navbat bo'sh.</p>`;
  listBox.innerHTML=qRows(u?active.filter(x=>x.city===u.region):active);
  // admin nusxasida faqat o'z klinikasining navbati
  const aq=document.getElementById('adminQList');
  const adm=getAdmin();
  if(aq)aq.innerHTML=qRows(adm?active.filter(x=>x.clinic===adm.clinic):active);
}
function postponeByNum(num){const b=getBooks();const i=b.findIndex(x=>x.num===num);if(i>=0)postponeBook(i)}
function renderSms(){
  const box=document.getElementById('smsLog');if(!box)return;
  const log=getSms().slice().reverse();
  box.innerHTML=log.length?log.map(s=>`<div class="sms"><div class="sms-head">📩 ${esc(s.phone)} • ${s.time}</div><div>${esc(s.text)}</div></div>`).join(''):`<p class="sub">Hali SMS yo‘q.</p>`;
}
function clearDemo(){if(!confirm('Tozalash?'))return;localStorage.removeItem('medbron');localStorage.removeItem('medbron_sms');localStorage.removeItem('medbron_afeed');renderMy();renderSms();tickQueue();renderDoctors();renderAdminToday();renderAdminFeed();renderAdminSlots();toast('🧹 Tozalandi')}
function seedDemo(){
  // demo bronlar adminning o'z klinikasiga tushadi (shunda "Keyingini chaqirish" darhol ishlaydi)
  const adm=getAdmin();const u=getUser();const region=adm?adm.city:(u?u.region:"Farg'ona");
  const doc=(adm&&doctors.find(d=>d.clinic===adm.clinic))||doctors.find(d=>d.city===region)||doctors[8];
  const b=getBooks();const today=todayStr();
  const{slots,closed}=buildSlots(doc.id,today);
  const taken=getTaken(doc.id,today);
  const free=slots.filter(t=>!taken.has(t)&&!closed.includes(t)).slice(0,3);
  const names=[['Jasur Karimov','+998901234501',2],['Malika Azizova','+998901234502',1],['Otabek Yo‘ldoshev','+998901234503',3]];
  if(!free.length){toast('⛔ Bugun bo‘sh soat qolmadi — admin ish soatini uzaytirsin');return}
  free.forEach((t,k)=>{
    const n=names[k];if(!n)return;
    if(b.some(x=>x.phone===n[1]&&x.date===today))return;
    b.push({num:newBookNum(b),docId:doc.id,doc:doc.name,spec:doc.spec,clinic:doc.clinic,city:doc.city,date:today,time:t,name:n[0],phone:n[1],persons:n[2],status:'waiting',createdAt:Date.now()+k,postponed:0});
  });
  saveBooks(b);toast(`✨ ${doc.clinic} ga demo bronlar qo‘shildi`);
}

/* ============ 4. ADMIN: ish soatlarini daqiqagacha sozlash ============ */
