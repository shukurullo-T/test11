function renderAdminDocs(){
  const sel=document.getElementById('adminDoc');if(!sel)return;
  const a=getAdmin();
  const list=a?doctors.filter(d=>d.clinic===a.clinic):[];
  if(!a){sel.innerHTML='';return}
  sel.innerHTML=list.map(d=>`<option value="${d.id}">${d.name} — ${d.clinic} (${d.city})</option>`).join('');
  loadAdminDay();renderAdminToday();
}
function renderAdminToday(){
  // admin o'z klinikasining bugungi bronlarini ko'radi — bo'shaganlar yashil
  const box=document.getElementById('adminToday');if(!box)return;
  const a=getAdmin();if(!a){box.innerHTML='';return}
  const myDocs=doctors.filter(d=>d.clinic===a.clinic);
  const ids=new Set(myDocs.map(d=>d.id));
  const books=getBooks().filter(b=>ids.has(b.docId)).sort((x,y)=>x.date!==y.date?(x.date<y.date?-1:1):(x.time<y.time?-1:x.time>y.time?1:0));
  const feed=getAdminFeed();
  const freedKeys=new Set(feed.filter(f=>f.type==='freed'&&f.booking).map(f=>f.booking.num+'_'+f.booking.date+'_'+f.booking.time));
  box.innerHTML=books.length?books.map(b=>{
    const freed=freedKeys.has(b.num+'_'+b.date+'_'+b.time);
    return `<div class="q-item ${b.status}${freed?' freed-hl':''}"><span><b>${b.num}</b> ${esc(b.name)} • ${b.date} ${b.time} • ${esc(b.doc)}${freed?' 🟢 bo‘shagan edi':''}${b.rating==='up'?' • 👍 qabul yoqdi':b.rating==='down'?' • 👎 qabul yoqmadi':''}<br><a href="tel:${esc((b.phone||'').replace(/\s/g,''))}">📞 ${esc(b.phone)} ga qo'ng'iroq qilish</a></span><span class="st ${b.status==='waiting'?'st-wait':(b.status==='called'?'st-call':'st-ok')}">${b.status}</span></div>`;
  }).join(''):`<p class="sub">Bu klinikada hali bron yo'q.</p>`;
}
// Admin offline bemorni (ilovani bilmagan, shifoxonaga kelgan) bo'sh vaqtga qo'yadi
function adminBookOffline(){
  const a=getAdmin();if(!a)return;
  const docId=parseInt(document.getElementById('adminDoc').value,10);
  const date=document.getElementById('adminDate').value;
  const name=document.getElementById('offName').value.trim();
  const phone=document.getElementById('offPhone').value.trim();
  const time=document.getElementById('offTime').value;
  if(name.length<3||phone.replace(/\D/g,'').length<9){toast('⚠️ Ism + telefon (+998...) kiriting');return}
  if(!time){toast('⚠️ Soat kiriting (masalan 10:30)');return}
  const taken=getTaken(docId,date);
  const{closed}=buildSlots(docId,date);
  if(taken.has(time)){toast('⛔ Bu soat band — nechida bo‘sh bo‘lsa o‘shanga qo‘ying');return}
  if(closed.includes(time)){toast('🔒 Bu soat yopiq');return}
  const d=doctors.find(x=>x.id===docId);
  const books=getBooks();
  const num=newBookNum(books);
  const nb={num,docId,doc:d.name,spec:d.spec,clinic:d.clinic,city:d.city,date,time,name,phone,persons:1,status:'waiting',createdAt:Date.now(),postponed:0,byAdmin:true};
  books.push(nb);saveBooks(books);
  sendSMS(phone,`MedBron (registratura ${a.name}): Sizni ${d.clinic} ga yozdik — ${num}, ${date} ${time}.`);
  notifyAdminAction('new',`REGISTRATURA YOZDI: ${a.name} ${name} ni ${date} ${time} ga qo'ydi`,nb);
  document.getElementById('offName').value='';document.getElementById('offPhone').value='';
  renderAdminSlots();renderAdminToday();
  toast(`✅ ${name} ${date} ${time} ga yozildi`);
}
function loadAdminDay(){
  const sel=document.getElementById('adminDoc');if(!sel||!sel.value)return;
  const docId=parseInt(sel.value,10);
  const dateEl=document.getElementById('adminDate');
  if(dateEl&&!dateEl.value)dateEl.value=todayStr();
  if(dateEl){dateEl.min=todayStr();dateEl.max=addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1);}
  const date=dateEl.value;
  const w=getWork(docId);
  document.getElementById('adminStart').value=w.start;
  document.getElementById('adminEnd').value=w.end;
  document.getElementById('adminStep').value=w.step;
  renderAdminSlots();
}
function saveAdminTime(){
  const docId=parseInt(document.getElementById('adminDoc').value,10);
  const start=document.getElementById('adminStart').value||'09:00';
  const end=document.getElementById('adminEnd').value||'17:00';
  const step=parseInt(document.getElementById('adminStep').value,10)||30;
  if(timeToMin(end)<=timeToMin(start)){toast('⚠️ Tugash boshlanishdan keyin bo‘lsin');return}
  saveWork(docId,{start,end,step});
  renderAdminSlots();renderDoctors();
  toast(`✅ Saqlandi: ${start}–${end}, har ${step} daq`);
}
function addCustomSlot(){
  const docId=parseInt(document.getElementById('adminDoc').value,10);
  const date=document.getElementById('adminDate').value;
  const t=document.getElementById('adminCustom').value;
  if(!t){toast('⚠️ Soat tanlang (masalan 09:15)');return}
  const ex=getDayExtra(docId,date);
  if(!ex.add.includes(t))ex.add.push(t);
  ex.closed=ex.closed.filter(x=>x!==t);
  saveDayExtra(docId,date,ex);renderAdminSlots();renderDoctors();
  toast(`➕ ${t} qo‘shildi`);
}
function toggleClose(t){
  const docId=parseInt(document.getElementById('adminDoc').value,10);
  const date=document.getElementById('adminDate').value;
  const ex=getDayExtra(docId,date);
  if(ex.closed.includes(t))ex.closed=ex.closed.filter(x=>x!==t);
  else ex.closed.push(t);
  saveDayExtra(docId,date,ex);renderAdminSlots();renderDoctors();
}
function renderAdminSlots(){
  const box=document.getElementById('adminSlots');if(!box)return;
  const sel=document.getElementById('adminDoc');
  if(!sel||!sel.value){box.innerHTML='<p class="sub">Avval admin login bilan kiring.</p>';return}
  const docId=parseInt(sel.value,10);
  const date=document.getElementById('adminDate').value;
  if(!date){box.innerHTML='';return}
  const{slots,closed}=buildSlots(docId,date);
  const taken=getTaken(docId,date);
  box.innerHTML=slots.length?slots.map(t=>{
    const cls=taken.has(t)?'slot-taken':(closed.includes(t)?'slot-closed':'slot-free');
    const lbl=taken.has(t)?`⛔ ${t} band`:(isPastSlot(date,t)?`⌛ ${t} o‘tdi`:(closed.includes(t)?`🔒 ${t} yopiq`:`🟢 ${t} bo‘sh`));
    return `<button class="${cls}" onclick="toggleClose('${t}')" title="Bossangiz yopiq/ochiq bo‘ladi">${lbl}</button>`;
  }).join(''):'<p class="sub">Slot yo‘q — yuqoridan vaqt belgilang.</p>';
}
function toast(t){const e=document.getElementById('toast');if(!e)return;e.textContent=t;e.classList.remove('hidden');setTimeout(()=>e.classList.add('hidden'),3000)}

// init viloyat selectlari
(function init(){
  const lr=document.getElementById('loginRegion');
  if(lr)lr.innerHTML='<option value="">— Viloyatni tanlang —</option>'+REGIONS.map(r=>`<option value="${esc(r)}">${r}</option>`).join('');
  const cf=document.getElementById('cityFilter');
  if(cf)cf.innerHTML='<option value="">Barcha viloyatlar</option>'+REGIONS.map(r=>`<option value="${esc(r)}">${r}</option>`).join('');
  const ad=document.getElementById('adminDate');
  if(ad){ad.value=todayStr();ad.min=todayStr();ad.max=addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1);}
})();
renderUser();renderDoctors();renderPharm();renderMy();renderSms();renderAdmin();renderFb();
const graceSel=document.getElementById('graceSel');
if(graceSel)graceSel.value=String(GRACE_SECONDS);
tickQueue();setInterval(()=>tickQueue(),1000);
// Pastki menyu: hozir ko'rinib turgan bo'limni belgilaymiz
(function bottomNavSpy(){
  const links=[...document.querySelectorAll('.bottom-nav a')];
  if(!links.length||!('IntersectionObserver' in window))return;
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));
  }),{rootMargin:'-15% 0px -80% 0px'});
  links.forEach(a=>{const s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
})();
