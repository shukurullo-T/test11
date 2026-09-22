const REGIONS=["Toshkent","Toshkent viloyati","Farg'ona","Andijon","Namangan","Samarqand","Buxoro","Navoiy","Qashqadaryo","Surxondaryo","Jizzax","Sirdaryo","Xorazm","Qoraqalpog'iston"];
const doctors=[
{id:1,name:"Dr. Dilnoza Rahimova",spec:"Terapevt",clinic:"Shifo Nur klinikasi",city:"Toshkent",addr:"Toshkent sh., Yunusobod t., 19-mavze, 12-uy",rating:4.9,exp:"12 yil",price:"120 000 so'm"},
{id:2,name:"Dr. Sardor Alimov",spec:"Kardiolog",clinic:"Yurak Markazi",city:"Toshkent",addr:"Toshkent sh., Mirobod t., Amir Temur shoh ko'chasi, 24-uy",rating:4.9,exp:"15 yil",price:"180 000 so'm"},
{id:3,name:"Dr. Malika Yusupova",spec:"Pediatr",clinic:"Bola Salomatligi",city:"Samarqand",addr:"Samarqand sh., Rudakiy ko'chasi, 45-uy",rating:4.8,exp:"10 yil",price:"100 000 so'm"},
{id:4,name:"Dr. Timur Hakimov",spec:"Stomatolog",clinic:"Oq Tabassum",city:"Toshkent",addr:"Toshkent sh., Chilonzor t., 8-mavze, 31-uy",rating:4.9,exp:"8 yil",price:"150 000 so'm"},
{id:5,name:"Dr. Nigora Karimova",spec:"Dermatolog",clinic:"Teri Go'zallik",city:"Farg'ona",addr:"Farg'ona sh., Al-Farg'oniy ko'chasi, 18-uy",rating:4.7,exp:"9 yil",price:"130 000 so'm"},
{id:6,name:"Dr. Otabek Qo'chqorov",spec:"Nevrolog",clinic:"Miya-Nerv Markazi",city:"Toshkent",addr:"Toshkent sh., Shayxontohur t., Navoiy ko'chasi, 7-uy",rating:4.8,exp:"14 yil",price:"160 000 so'm"},
{id:7,name:"Dr. Sevara Azimova",spec:"Pediatr",clinic:"Mehrli Ona",city:"Andijon",addr:"Andijon sh., Bobur shoh ko'chasi, 52-uy",rating:4.8,exp:"11 yil",price:"90 000 so'm"},
{id:8,name:"Dr. Jahongir Toshpo'latov",spec:"Kardiolog",clinic:"Samarqand Kardio",city:"Samarqand",addr:"Samarqand sh., Mirzo Ulug'bek ko'chasi, 9-uy",rating:4.7,exp:"13 yil",price:"140 000 so'm"},
{id:9,name:"Dr. Kamola Ergasheva",spec:"Terapevt",clinic:"Sog'lom Oila",city:"Farg'ona",addr:"Farg'ona sh., Mustaqillik ko'chasi, 33-uy",rating:4.8,exp:"7 yil",price:"95 000 so'm"},
{id:10,name:"Dr. Bobur Nazarov",spec:"Stomatolog",clinic:"Dental Plus",city:"Andijon",addr:"Andijon sh., Fitrat ko'chasi, 11-uy",rating:4.9,exp:"10 yil",price:"110 000 so'm"},
{id:11,name:"Dr. Akmal Qodirov",spec:"Terapevt",clinic:"Namangan Sog'lik",city:"Namangan",addr:"Namangan sh., Dustlik ko'chasi, 5-uy",rating:4.7,exp:"9 yil",price:"90 000 so'm"},
{id:12,name:"Dr. Laylo Xolova",spec:"Pediatr",clinic:"Buxoro Bolajon",city:"Buxoro",addr:"Buxoro sh., Mirdosh ko'chasi, 21-uy",rating:4.8,exp:"10 yil",price:"100 000 so'm"},
{id:13,name:"Dr. Sherzod Umarov",spec:"Kardiolog",clinic:"Qarshi Yurak",city:"Qashqadaryo",addr:"Qarshi sh., Islom Karimov ko'chasi, 14-uy",rating:4.7,exp:"12 yil",price:"130 000 so'm"},
{id:14,name:"Dr. Gulnora Saidova",spec:"Terapevt",clinic:"Urganch Med",city:"Xorazm",addr:"Urganch sh., Al-Xorazmiy ko'chasi, 8-uy",rating:4.8,exp:"11 yil",price:"95 000 so'm"},
{id:15,name:"Dr. Diyorbek Rahmonov",spec:"Stomatolog",clinic:"Nukus Dental",city:"Qoraqalpog'iston",addr:"Nukus sh., A. Dosnazarov ko'chasi, 16-uy",rating:4.8,exp:"8 yil",price:"110 000 so'm"},
{id:16,name:"Dr. Nodira Tosheva",spec:"Nevrolog",clinic:"Jizzax Nerv",city:"Jizzax",addr:"Jizzax sh., Sharof Rashidov ko'chasi, 27-uy",rating:4.7,exp:"9 yil",price:"110 000 so'm"},
];
const drugs=[
{name:"Paracetamol 500mg (20 tab)",cheap:"12 000 so'm • Arzon Apteka",exp:"28 000 so'm • Markaziy"},
{name:"Amoksitsillin 500mg",cheap:"18 000 so'm • Dori-Darmon",exp:"35 000 so'm • Markaziy"},
{name:"Vitamin D3 2000 IU",cheap:"45 000 so'm • Arzon Apteka",exp:"89 000 so'm • Europharm"},
{name:"Omeprazol 20mg",cheap:"15 000 so'm • Dori-Darmon",exp:"32 000 so'm • Markaziy"},
];
const DEFAULT_SLOTS=["09:00","10:00","11:30","13:00","15:00","16:30"];
const MAX_ADVANCE_DAYS=14; // 1-2 hafta oldin bron qilish mumkin
// Har bir shifoxonaning ro'yxat (reception) admini — login+parol bilan kiradi.
// Demo loginlar: fargona1 / 1234, toshkent1 / 1234, samarqand1 / 1234, andijon1 / 1234
const ADMINS=[
{login:"fargona1",pass:"1234",name:"Dilfuza Yo'ldosheva",phone:"+998 73 244 55 66",clinic:"Sog'lom Oila",city:"Farg'ona"},
{login:"fargona2",pass:"1234",name:"Oybek Qodirov",phone:"+998 73 244 55 67",clinic:"Teri Go'zallik",city:"Farg'ona"},
{login:"toshkent1",pass:"1234",name:"Malika Karimova",phone:"+998 71 244 88 99",clinic:"Shifo Nur klinikasi",city:"Toshkent"},
{login:"toshkent2",pass:"1234",name:"Jasur Hakimov",phone:"+998 71 244 88 98",clinic:"Yurak Markazi",city:"Toshkent"},
{login:"toshkent3",pass:"1234",name:"Nodira Azimova",phone:"+998 71 244 88 97",clinic:"Oq Tabassum",city:"Toshkent"},
{login:"toshkent4",pass:"1234",name:"Sardor Ergashev",phone:"+998 71 244 88 96",clinic:"Miya-Nerv Markazi",city:"Toshkent"},
{login:"samarqand1",pass:"1234",name:"Gulnora Tosheva",phone:"+998 66 233 44 55",clinic:"Bola Salomatligi",city:"Samarqand"},
{login:"andijon1",pass:"1234",name:"Bekzod Umarov",phone:"+998 74 223 33 44",clinic:"Mehrli Ona",city:"Andijon"},
];
function adminOfClinic(clinic){return ADMINS.find(a=>a.clinic===clinic)||null}
function adminOfDoctor(docId){const d=doctors.find(x=>x.id===docId);return d?adminOfClinic(d.clinic):null}
let selectedDoctor=null,selectedTime=null;
let GRACE_SECONDS=30;
function setGrace(v){GRACE_SECONDS=parseInt(v,10);toast('⏱ Kutish vaqti: '+fmtDur(GRACE_SECONDS));tickQueue();}
function fmtDur(s){if(s>=60){const m=Math.floor(s/60);const r=s%60;return r?m+' daq '+r+' son':m+' daqiqa'}return s+' soniya'}
function fmtLeft(ms){const s=Math.max(0,Math.ceil(ms/1000));const m=Math.floor(s/60);const r=s%60;return (m>0?m+':':'0:')+String(r).padStart(2,'0')}

/* ============ ADMIN AUTH (alohida, asosiy menyuda ko'rinmaydi) ============ */
function getAdmin(){try{return JSON.parse(localStorage.getItem('medbron_admin')||'null')}catch{return null}}
function saveAdmin(a){if(a)localStorage.setItem('medbron_admin',JSON.stringify(a));else localStorage.removeItem('medbron_admin');renderAdmin();}
function doAdminLogin(){
  const l=document.getElementById('adminLogin').value.trim();
  const p=document.getElementById('adminPass').value;
  const a=ADMINS.find(x=>x.login===l&&x.pass===p);
  if(!a){toast('❌ Login yoki parol xato (demo: fargona1 / 1234)');return}
  saveAdmin(a);toast(`✅ Xush kelibsiz, ${a.name}! (${a.clinic})`);
}
function adminLogout(){saveAdmin(null);toast('🚪 Admin chiqdi');}
function adminClinics(){
  const a=getAdmin();if(!a)return[];
  return doctors.filter(d=>d.clinic===a.clinic);
}
function renderAdmin(){
  const a=getAdmin();
  const sec=document.getElementById('admin');
  const box=document.getElementById('adminBody');
  const info=document.getElementById('adminInfo');
  const navBtn=document.getElementById('adminNavBtn');
  if(a){
    if(sec)sec.classList.remove('hidden');
    if(navBtn)navBtn.classList.remove('hidden');
    if(info)info.innerHTML=`👩‍💼 ${a.name} • ${a.clinic} (${a.city}) • 📞 ${a.phone} <button class="mini-btn" onclick="adminLogout()">Chiqish</button>`;
    if(box)box.classList.remove('hidden');
    const loginBox=document.getElementById('adminLoginBox');
    if(loginBox)loginBox.classList.add('hidden');
    renderAdminDocs();renderAdminFeed();
  }else{
    if(navBtn)navBtn.classList.add('hidden');
    // admin kirish oynasini ko'rsatamiz, lekin ichki sozlamalarni berkitamiz
    if(sec)sec.classList.remove('hidden'); // kirish formasi ko'rinadi (odamlarga faqat login ko'rinadi)
    if(info)info.innerHTML=`🔒 Bu bo'lim faqat shifoxona xodimlari uchun. Bemorlar yuqoridan bron qiladi.`;
    if(box)box.classList.add('hidden');
    const loginBox=document.getElementById('adminLoginBox');
    if(loginBox)loginBox.classList.remove('hidden');
    const feed=document.getElementById('adminFeed');
    if(feed)feed.innerHTML='';
  }
}
/* ============ ADMIN XABARNOMALAR (bron / o'zgartirish / bekor — yashil) ============ */
function getAdminFeed(){try{return JSON.parse(localStorage.getItem('medbron_afeed')||'[]')}catch{return[]}}
function pushAdminFeed(type,text,booking){
  const feed=getAdminFeed();
  feed.push({type,text,booking:booking?{num:booking.num,name:booking.name,phone:booking.phone,doc:booking.doc,date:booking.date,time:booking.time}:null,time:new Date().toLocaleString('uz-UZ')});
  localStorage.setItem('medbron_afeed',JSON.stringify(feed.slice(-40)));
  renderAdminFeed();
}
function renderAdminFeed(){
  const box=document.getElementById('adminFeed');if(!box)return;
  const a=getAdmin();if(!a){box.innerHTML='';return}
  const feed=getAdminFeed().filter(f=>!f.booking||(doctors.find(d=>d.name===(f.booking.doc||''))||{}).clinic===a.clinic).slice().reverse();
  box.innerHTML=feed.length?feed.map(f=>{
    const cls=f.type==='freed'?'feed-freed':(f.type==='change'?'feed-change':'feed-new');
    const icon=f.type==='freed'?'🟢':(f.type==='change'?'🟡':'🔵');
    const tel=f.booking?`<a class="mini-btn" href="tel:${(f.booking.phone||'').replace(/\s/g,'')}">📞 ${f.booking.phone} ga qo'ng'iroq</a>`:'';
    return `<div class="feed-item ${cls}"><div>${icon} ${f.text}</div><small>${f.time}${f.booking?` • <b>${f.booking.num}</b> ${f.booking.name} ${f.booking.date} ${f.booking.time}`:''}</small><div style="margin-top:6px">${tel}</div></div>`;
  }).join(''):`<p class="sub">Hali xabar yo'q. Bemor bron qilsa / o'zgartirsa / bekor qilsa — shu yerda 🟢 yashil bo'lib chiqadi + SMS keladi.</p>`;
}
function notifyAdminAction(type,text,booking){
  // adm inbox + adm telefoniga SMS simulyatsiya
  pushAdminFeed(type,text,booking);
  const adm=booking?adminOfDoctor(booking.docId):null;
  if(adm)sendSMS(adm.phone,`MedBron ADMIN (${adm.clinic}): ${text}`);
}

/* ============ SANA (14 kun oldin bron) ============ */
function todayStr(){return new Date().toISOString().slice(0,10)}
function addDaysStr(base,n){const d=new Date(base+'T12:00:00');d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)}
function dayFreeCount(docId,date){
  const{slots,closed}=buildSlots(docId,date);
  const taken=getTaken(docId,date);
  return slots.filter(t=>!taken.has(t)&&!closed.includes(t)).length;
}

/* ============ 1. KIRISH: ism + nomer + viloyat ============ */
function getUser(){try{return JSON.parse(localStorage.getItem('medbron_user')||'null')}catch{return null}}
function saveUser(u){localStorage.setItem('medbron_user',JSON.stringify(u));renderUser();}
function renderUser(){
  const u=getUser();
  const badge=document.getElementById('userBadge');
  const login=document.getElementById('loginModal');
  if(u){
    if(login)login.classList.add('hidden');
    if(badge)badge.innerHTML=`👤 ${u.name} • 📞 ${u.phone} • 📍 ${u.region} <button class="mini-btn" onclick="logout()" style="margin-left:6px">Chiqish</button> <button class="mini-btn" onclick="changeRegion()">Viloyat ↻</button>`;
    // viloyat filtrini avtomatik shu viloyatga qo'yamiz
    const cf=document.getElementById('cityFilter');
    if(cf&&[...cf.options].some(o=>o.value===u.region)){cf.value=u.region;}
    const lf=document.getElementById('loginRegionLabel');
    if(lf)lf.textContent=u.region;
  }else{
    if(login)login.classList.remove('hidden');
    if(badge)badge.innerHTML=`<button class="btn primary" onclick="document.getElementById('loginModal').classList.remove('hidden')">Kirish / Ro'yxatdan o'tish</button>`;
  }
}
function doLogin(){
  const name=document.getElementById('loginName').value.trim();
  const phone=document.getElementById('loginPhone').value.trim();
  const region=document.getElementById('loginRegion').value;
  if(name.length<3){toast('⚠️ Ismingizni to‘liq yozing');return}
  if(phone.replace(/\D/g,'').length<9){toast('⚠️ Telefon raqamni to‘g‘ri kiriting (+998...)');return}
  if(!region){toast('⚠️ Viloyatingizni tanlang');return}
  saveUser({name,phone,region});
  sendSMS(phone,`MedBron: Xush kelibsiz, ${name}! Siz ${region} viloyati sifatida kirdingiz. Endi faqat ${region} dagi klinikalar ko'rinadi.`);
  toast(`✅ Xush kelibsiz, ${name}! (${region})`);
  renderDoctors();
}
function logout(){localStorage.removeItem('medbron_user');renderUser();renderDoctors();toast('🚪 Chiqildi — qayta kiring');}
function changeRegion(){
  const u=getUser();if(!u)return;
  const cur=prompt('Qaysi viloyat? Ro‘yxatdan tanlang:\n'+REGIONS.join(', '),u.region);
  if(cur&&REGIONS.includes(cur.trim())){u.region=cur.trim();saveUser(u);renderDoctors();toast('📍 Viloyat: '+u.region);}
  else if(cur)toast('❌ Bunday viloyat yo‘q');
}

/* ============ 2-3. SOATLAR: avto-blok + admin daqiqagacha ============ */
function timeToMin(t){const[a,b]=t.split(':').map(Number);return a*60+b}
function minToTime(m){return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}
function getWork(docId){
  try{
    const all=JSON.parse(localStorage.getItem('medbron_work')||'{}');
    return all[docId]||{start:'09:00',end:'17:00',step:30};
  }catch{return{start:'09:00',end:'17:00',step:30}}
}
function saveWork(docId,w){
  const all=JSON.parse(localStorage.getItem('medbron_work')||'{}');
  all[docId]=w;localStorage.setItem('medbron_work',JSON.stringify(all));
}
function getDayExtra(docId,date){
  try{
    const all=JSON.parse(localStorage.getItem('medbron_sched')||'{}');
    return all[docId+'_'+date]||{add:[],closed:[]};
  }catch{return{add:[],closed:[]}}
}
function saveDayExtra(docId,date,obj){
  const all=JSON.parse(localStorage.getItem('medbron_sched')||'{}');
  all[docId+'_'+date]=obj;localStorage.setItem('medbron_sched',JSON.stringify(all));
}
function buildSlots(docId,date){
  const w=getWork(docId);
  const out=[];
  let cur=timeToMin(w.start),end=timeToMin(w.end);
  if(end>cur){while(cur<=end){out.push(minToTime(cur));cur+=parseInt(w.step,10)||30;}}
  const ex=getDayExtra(docId,date);
  ex.add.forEach(t=>{if(!out.includes(t))out.push(t)});
  out.sort();
  return{slots:out,closed:ex.closed||[]};
}
function getTaken(docId,date){
  const b=getBooks();
  const s=new Set();
  b.forEach(x=>{
    if(x.docId===docId&&x.date===date&&(x.status==='waiting'||x.status==='called'||x.status==='confirmed'))s.add(x.time);
  });
  return s;
}

function scrollToId(id){const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth'})}
function setSymptom(t){document.getElementById('symptomInput').value=t;aiDiagnose()}
function aiDiagnose(){
  const v=document.getElementById('symptomInput').value.toLowerCase();
  const box=document.getElementById('aiResult');
  if(v.trim().length<5){box.classList.remove('hidden');box.innerHTML="⚠️ Iltimos, simptomni batafsilroq yozing.";return}
  let spec="Terapevt",doc=doctors[0],level="🟢 O'rta — 3 kun ichida",advice="Ko'p suyuqlik iching, dam oling.";
  if(/bosim|yurak|ko'krak|bosh.*og|aylan/.test(v)){spec="Kardiolog";doc=doctors[1];level="🟡 Yuqori — 24 soat ichida";advice="Bosimni o'lchang, tuzni kamaytiring."}
  else if(/bola|chaqaloq|isitma.*39|emiza/.test(v)||(/isitma/.test(v)&&/bola/.test(v))){spec="Pediatr";doc=doctors[2];level="🔴 Shoshilinch — bugun";advice="Bolaga haroratni tushiruvchi bering."}
  else if(/tish|milk|og'iz/.test(v)){spec="Stomatolog";doc=doctors[3];level="🟡 Yuqori — ertaga";advice="Issiq-sovuqdan saqlaning."}
  else if(/teri|toshma|qichish|allerg/.test(v)){spec="Dermatolog";doc=doctors[4];level="🟢 O'rta";advice="Qichimang."}
  else if(/asab|uyqusiz|stress|bel.*og|nev/.test(v)){spec="Nevrolog";doc=doctors[5];level="🟢 O'rta";advice="Uyqu rejimini tiklang."}
  else if(/isitma|yo'tal|tomoq|gripp|shamoll/.test(v)){spec="Terapevt";doc=doctors[0];level="🟡 Yuqori — ertaga";advice="Iliq choy, vitamin C."}
  // foydalanuvchi viloyatidagi shu spec doktorga yo'naltiramiz
  const u=getUser();
  if(u){
    const local=doctors.find(d=>d.spec===spec&&d.city===u.region);
    if(local)doc=local;
  }
  box.classList.remove('hidden');
  box.innerHTML=`<h3>✅ AI Xulosa</h3><p><b>Tavsiya:</b> ❤️ ${spec}ga boring</p><p><b>Daraja:</b> ${level}</p><p><b>Maslahat:</b> ${advice}</p><p style="margin-top:10px"><b>Topilgan shifokor:</b> ${doc.name} • ${doc.clinic}, ${doc.city}<br><small>📍 ${doc.addr}</small></p><button class="btn primary" style="margin-top:10px" onclick="openModal(${doc.id})">Shu shifokorga bron qilish →</button>`;
}
function renderDoctors(){
  const q=(document.getElementById('searchInput').value||'').toLowerCase();
  const s=document.getElementById('specFilter').value;
  const cf=document.getElementById('cityFilter');
  const c=cf?cf.value:'';
  const u=getUser();
  const grid=document.getElementById('doctorGrid');
  const title=document.getElementById('docTitle');
  const effRegion=c||(u?u.region:'');
  if(title)title.innerHTML=u?`👨‍⚕️ ${u.region} dagi shifokorlar <small>s iz ${u.region}dasiz — faqat shu viloyat ko'rinmoqda</small>`:`👨‍⚕️ Shifokorlar va Bron qilish`;
  const today=todayStr();
  const list=doctors.filter(d=>(!s||d.spec===s)&&(!effRegion||d.city===effRegion)&&(d.name.toLowerCase().includes(q)||d.clinic.toLowerCase().includes(q)));
  if(!list.length){grid.innerHTML=`<p>📭 ${effRegion||'Bu hudud'}da hozircha shifokor topilmadi. Boshqa viloyat tanlang yoki admin soat qo'shsin.</p>`;return}
  grid.innerHTML=list.map(d=>{
    const taken=getTaken(d.id,today);
    const{slots,closed}=buildSlots(d.id,today);
    const free=slots.filter(t=>!taken.has(t)&&!closed.includes(t)).length;
    // keyingi bo'sh kun (14 kun ichida)
    let nextFree=null;
    for(let k=0;k<MAX_ADVANCE_DAYS;k++){const dt=addDaysStr(today,k);if(dayFreeCount(d.id,dt)>0){nextFree=dt;break}}
    const adm=adminOfClinic(d.clinic);
    const preview=slots.filter(t=>!taken.has(t)&&!closed.includes(t)).slice(0,3).join(' • ')||'—';
    return `<div class="card"><div class="spec">${d.spec} • 📍 ${d.city}</div><h3>${d.name}</h3><p>🏥 ${d.clinic}<br>📌 ${d.addr}<br>⭐ <span class="rating">${d.rating}</span> • ${d.exp}</p><div class="price">${d.price} / qabul</div><p class="free-line">${free>0?`🟢 Bugun ${free} bo'sh vaqt bor (${preview})`:`🔴 Bugun joy yo'q`}${nextFree?`<br>📅 Eng yaqin bo'sh kun: <b>${nextFree}</b> — 14 kun oldingacha bron qilish mumkin`:''}</p><p class="reception">📞 Ro'yxat (registratura): <b>${adm?adm.name:''}</b> ${adm?`<a class="mini-btn" href="tel:${adm.phone.replace(/\s/g,'')}">${adm.phone} ga qo'ng'iroq</a>`:''}<br><small>Ilovani bilmasangiz — shifoxonaga boring yoki shu raqamga qo'ng'iroq qiling, admin sizni bo'sh vaqtga qo'yadi.</small></p><button class="btn primary full" onclick="openModal(${d.id})">Bron qilish</button></div>`;
  }).join('');
}
function renderPharm(){
  document.getElementById('pharmGrid').innerHTML=drugs.map(d=>`<div class="pharm"><h4>${d.name}</h4><p class="cheap">✅ ${d.cheap}</p><p class="exp">${d.exp}</p></div>`).join('');
}
function openModal(id){
  const u=getUser();
  if(!u){document.getElementById('loginModal').classList.remove('hidden');toast('🔑 Avval ism + nomer + viloyat bilan kiring');return}
  selectedDoctor=doctors.find(d=>d.id===id);selectedTime=null;
  document.getElementById('mDoctor').textContent=selectedDoctor.name;
  document.getElementById('mInfo').textContent=`${selectedDoctor.spec} • ${selectedDoctor.clinic}, ${selectedDoctor.city} • ${selectedDoctor.price} • 📌 ${selectedDoctor.addr}`;
  const bd=document.getElementById('bDate');
  bd.min=todayStr();bd.max=addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1);bd.value=todayStr();
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
    if(closed.includes(t))return `<button disabled class="slot-closed" title="Shifokor yopgan">🔒 ${t}</button>`;
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
function saveBooks(b){localStorage.setItem('medbron',JSON.stringify(b));renderMy();tickQueue(true);renderDoctors();renderAdminToday();}
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
  if(name.length<3||phone.length<7){toast('⚠️ Ism va telefonni kiriting');return}
  // ikkinchi marta tekshiramiz — bu soatni birov olgan bo'lishi mumkin
  const taken=getTaken(selectedDoctor.id,date);
  const{closed}=buildSlots(selectedDoctor.id,date);
  if(taken.has(selectedTime)){toast('⛔ Bu soatni hozirgina boshqa odam oldi — boshqa vaqt tanlang');refreshSlots();return}
  if(closed.includes(selectedTime)){toast('🔒 Bu soat yopiq');refreshSlots();return}
  const books=getBooks();
  const num='MB-'+Math.floor(1000+Math.random()*9000);
  const nb={num,docId:selectedDoctor.id,doc:selectedDoctor.name,spec:selectedDoctor.spec,clinic:selectedDoctor.clinic,city:selectedDoctor.city,date,time:selectedTime,name,phone,persons,status:'waiting',createdAt:Date.now(),postponed:0};
  books.push(nb);
  saveBooks(books);closeModal();
  sendSMS(phone,`MedBron: ${name}! ${selectedDoctor.clinic} (${selectedDoctor.city}, ${selectedDoctor.addr}) ga bron: ${num}, ${date} ${selectedTime}, ${persons} kishi. Bu soat endi band — boshqalar ololmaydi. Navbat kelganda 3 daq ichida "Keldim" bosing.`);
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
    return `<div class="ticket ${b.status}"><div><b>${b.num}</b> • ${b.doc}<br><small>📅 ${b.date} ⏰ ${b.time} • 👤 ${b.name} • 👥 ${b.persons||1} • 📞 ${b.phone}<br>📌 ${b.city}</small><br>${statusBadge(b)}</div><div class="ticket-btns">${actions}</div></div>`;
  }).join(''):`<p class="sub">Hali bron yo'q. ${u.region} dan shifokor tanlang.</p>`;
}
function cancelBook(i){
  const b=getBooks();const[rm]=b.splice(i,1);saveBooks(b);
  if(!rm)return;
  sendSMS(rm.phone,`MedBron: ${rm.num} bekor qilindi, ${rm.date} ${rm.time} soat bo‘shatildi — endi boshqalar olishi mumkin.`);
  notifyAdminAction('freed',`BO'SHADI 🟢: ${rm.name} bekor qildi — ${rm.doc}, ${rm.date} ${rm.time} endi bo'sh`,rm);
  // o'rin keyingi odamga o'tadi: shu shifokor+shu sana bo'yicha eng oldingi kutayotganni topib o'sha bo'sh soatga qo'yamiz
  promoteNextToFreedSlot(rm.docId,rm.date,rm.time);
  toast('🗑 Bekor qilindi, soat bo‘shatildi');
}
function promoteNextToFreedSlot(docId,date,freedTime){
  const b=getBooks();
  const cand=b.filter(x=>x.docId===docId&&x.date===date&&x.status==='waiting').sort((a,c)=>(a.createdAt||0)-(c.createdAt||0))[0];
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
  const next=slots.find(t=>!taken.has(t)&&!closed.includes(t)&&t!==item.time);
  if(!next){toast('⛔ Bo‘sh vaqt yo‘q — boshqa kun tanlang');return}
  const oldTime=item.time;
  item.time=next;item.status='waiting';item.calledAt=null;item.expiresAt=null;item.warnSent=false;item.postponed=(item.postponed||0)+1;item.createdAt=Date.now();
  saveBooks(b);
  sendSMS(item.phone,`MedBron: ${item.num} ${oldTime} → ${next} ga ko'chirildi. Eski soatingiz bo‘shatildi.`);
  notifyAdminAction('change',`O'ZGARTIRDI 🟡: ${item.name} (${item.num}) ${item.date} ${oldTime} → ${next}`,item);
  notifyAdminAction('freed',`BO'SHADI 🟢: ${item.date} ${oldTime} (${item.doc}) endi bo'sh — admin menyusida yashil`,{...item,time:oldTime});
  promoteNextToFreedSlot(item.docId,item.date,oldTime);
  toast(`⏩ ${next} ga ko‘chirildi`);
}
function rebook(i){
  const b=getBooks();const item=b[i];
  item.status='waiting';item.createdAt=Date.now();item.calledAt=null;item.expiresAt=null;item.warnSent=false;
  saveBooks(b);toast('🔁 Qayta navbatga qo‘yildi');
}
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
function callNext(){
  const adm=getAdmin();
  if(!adm){toast('🔒 Navbatni faqat admin chaqiradi — admin login bilan kiring');scrollToId('admin');return}
  const b=getBooks();
  if(b.some(x=>x.status==='called')){toast('⚠️ Chaqirilgan bemor bor');tickQueue(true);return}
  const u=getUser();
  let pool=b.filter(x=>x.status==='waiting');
  if(u)pool=pool.filter(x=>x.city===u.region);
  pool.sort((a,c)=>a.date<c.date?-1:1||(a.time<c.time?-1:1)||((a.createdAt||0)-(c.createdAt||0)));
  const cand=pool[0]||b.filter(x=>x.status==='waiting')[0];
  if(!cand){toast('📭 Kutayotgan yo‘q');return}
  const now=Date.now();
  cand.status='called';cand.calledAt=now;cand.expiresAt=now+GRACE_SECONDS*1000;cand.warnSent=false;
  saveBooks(b);
  sendSMS(cand.phone,`MedBron: ${cand.name}! Navbatingiz keldi (${cand.num}). ${fmtDur(GRACE_SECONDS)} ichida "Keldim" bosing, bo‘lmasa "Vaqtni o'zgartirish" bosing.`);
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
  setTimeout(()=>callNext(),1500);
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
  curBox.innerHTML=confirmed?`<b>${confirmed.num}</b> • ${confirmed.name} qabulda ✅`:`<b>—</b> • Qabul boshlanmagan`;
  if(called){
    const left=called.expiresAt-now;
    if(left<=0){
      called.status='skipped';saveBooks(books);
      sendSMS(called.phone,`MedBron: ❌ ${called.num} — ${fmtDur(GRACE_SECONDS)} ichida kelmadingiz, o'rningiz keyingi bemorga berildi. Qayta yozilish uchun registraturaga qo'ng'iroq qiling.`);
      notifyAdminAction('freed',`KELMADI ⏰: ${called.name} (${called.num}) vaqtida kelmadi — ${called.doc}, ${called.date} ${called.time} bo'shadi, o'rin keyingi bemorga o'tdi`,called);
      toast(`⏰ ${called.num} kelmadi — o'rni berildi`);
      setTimeout(()=>callNext(),1200);return;
    }
    if(!called.warnSent&&left<=(GRACE_SECONDS*1000)/2){
      called.warnSent=true;localStorage.setItem('medbron',JSON.stringify(books));
      sendSMS(called.phone,`MedBron: ⚠️ ${called.num} — ${fmtLeft(left)} qoldi! "Vaqtni o'zgartirish" bosing, bo‘lmasa navbat olib tashlanadi.`);
    }
    document.querySelectorAll(`[data-countdown-for="${called.num}"]`).forEach(e=>e.textContent=fmtLeft(left));
    const pct=Math.max(0,Math.min(100,left/(GRACE_SECONDS*1000)*100));
    // Asosiy menyu — faqat soniyalar (tugmasiz)
    callBox.innerHTML=`<div class="called-card"><div><span class="muted-sm">Chaqirildi:</span><br><b class="big-num">${called.num}</b> • ${called.name} • 👥 ${called.persons||1}<br><small>${called.doc} • ${called.date} ${called.time}</small></div><div class="count-right"><div class="count-num">⏳ ${fmtLeft(left)}</div><div class="count-bar"><div class="count-fill" style="width:${pct}%"></div></div><small>Kelmasa avtomatik keyingisiga o'tadi</small></div></div>`;
    // Admin — tugmalar bilan
    const ab=document.getElementById('adminCalled');
    if(ab)ab.innerHTML=`<div class="called-card"><div><span class="muted-sm">Chaqirildi (admin):</span><br><b class="big-num">${called.num}</b> • ${called.name} • 📞 ${called.phone}<br><small>${called.doc} • ${called.date} ${called.time}</small></div><div class="count-right"><div class="count-num">⏳ <span data-countdown-for="${called.num}">${fmtLeft(left)}</span></div><div class="count-bar"><div class="count-fill" style="width:${pct}%"></div></div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap"><button class="mini-btn ok" onclick="confirmArrivalPrompt('${called.num}')">Keldi ✅</button><button class="mini-btn" onclick="postponeByNum('${called.num}')">Vaqtni o'zgartirish ⏩</button></div></div></div>`;
  }else{
    callBox.innerHTML=`<p class="sub">📭 Hozir chaqiriq yo'q — admin chaqirganda shu yerda soniyalar chiqadi.</p>`;
    const ab=document.getElementById('adminCalled');
    if(ab)ab.innerHTML=`<p class="sub">📭 Chaqiruv yo‘q. <button class="mini-btn ok" onclick="callNext()">Keyingini chaqirish 📢</button></p>`;
  }
  const u=getUser();
  let q=sortedQueue().filter(x=>x.status==='waiting'||x.status==='called');
  if(u)q=q.filter(x=>x.city===u.region);
  const qHtml=q.length?q.map((x,pos)=>`<div class="q-item ${x.status}"><span><b>#${pos+1}</b> ${x.num} • ${x.name} • ${x.time}</span>${x.status==='called'?`<span class="st st-call">📢 <span data-countdown-for="${x.num}">...</span></span>`:`<span class="st st-wait">⏳</span>`}</div>`).join(''):`<p class="sub">Navbat bo'sh.</p>`;
  listBox.innerHTML=qHtml;
  const aq=document.getElementById('adminQList');
  if(aq)aq.innerHTML=qHtml;
}
function postponeByNum(num){const b=getBooks();const i=b.findIndex(x=>x.num===num);if(i>=0)postponeBook(i)}
function renderSms(){
  const box=document.getElementById('smsLog');if(!box)return;
  const log=getSms().slice().reverse();
  box.innerHTML=log.length?log.map(s=>`<div class="sms"><div class="sms-head">📩 ${s.phone} • ${s.time}</div><div>${s.text}</div></div>`).join(''):`<p class="sub">Hali SMS yo‘q.</p>`;
}
function clearDemo(){if(!confirm('Tozalash?'))return;localStorage.removeItem('medbron');localStorage.removeItem('medbron_sms');renderMy();renderSms();tickQueue();renderDoctors();renderAdminToday();toast('🧹 Tozalandi')}
function seedDemo(){
  const u=getUser();const region=u?u.region:"Farg'ona";
  const doc=doctors.find(d=>d.city===region)||doctors[8];
  const b=getBooks();const today=todayStr();
  const{slots,closed}=buildSlots(doc.id,today);
  const taken=getTaken(doc.id,today);
  const free=slots.filter(t=>!taken.has(t)&&!closed.includes(t)).slice(0,3);
  const names=[['Jasur Karimov','+998901234501',2],['Malika Azizova','+998901234502',1],['Otabek Yo‘ldoshev','+998901234503',3]];
  free.forEach((t,k)=>{
    const n=names[k];if(!n)return;
    if(b.some(x=>x.phone===n[1]&&x.date===today))return;
    b.push({num:'MB-'+(7000+k*111),docId:doc.id,doc:doc.name,spec:doc.spec,clinic:doc.clinic,city:doc.city,date:today,time:t,name:n[0],phone:n[1],persons:n[2],status:'waiting',createdAt:Date.now()+k,postponed:0});
  });
  saveBooks(b);toast(`✨ ${region} ga 3 demo bron (${doc.clinic})`);
}

/* ============ 4. ADMIN: ish soatlarini daqiqagacha sozlash ============ */
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
  const books=getBooks().filter(b=>ids.has(b.docId)).sort((x,y)=>x.date<y.date?-1:1||(x.time<y.time?-1:1));
  const feed=getAdminFeed();
  const freedKeys=new Set(feed.filter(f=>f.type==='freed'&&f.booking).map(f=>f.booking.num+'_'+f.booking.date+'_'+f.booking.time));
  box.innerHTML=books.length?books.map(b=>{
    const freed=freedKeys.has(b.num+'_'+b.date+'_'+b.time);
    return `<div class="q-item ${b.status}${freed?' freed-hl':''}"><span><b>${b.num}</b> ${b.name} • ${b.date} ${b.time} • ${b.doc}${freed?' 🟢 bo‘shagan edi':''}<br><a href="tel:${(b.phone||'').replace(/\s/g,'')}">📞 ${b.phone} ga qo'ng'iroq qilish</a></span><span class="st ${b.status==='waiting'?'st-wait':(b.status==='called'?'st-call':'st-ok')}">${b.status}</span></div>`;
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
  if(name.length<3||phone.length<7){toast('⚠️ Ism + telefon kiriting');return}
  if(!time){toast('⚠️ Soat kiriting (masalan 10:30)');return}
  const taken=getTaken(docId,date);
  const{closed}=buildSlots(docId,date);
  if(taken.has(time)){toast('⛔ Bu soat band — nechida bo‘sh bo‘lsa o‘shanga qo‘ying');return}
  if(closed.includes(time)){toast('🔒 Bu soat yopiq');return}
  const d=doctors.find(x=>x.id===docId);
  const books=getBooks();
  const num='MB-'+Math.floor(1000+Math.random()*9000);
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
    const cls=closed.includes(t)?'slot-closed':(taken.has(t)?'slot-taken':'slot-free');
    const lbl=closed.includes(t)?`🔒 ${t} yopiq`:(taken.has(t)?`⛔ ${t} band`:`🟢 ${t} bo‘sh`);
    return `<button class="${cls}" onclick="toggleClose('${t}')" title="Bossangiz yopiq/ochiq bo‘ladi">${lbl}</button>`;
  }).join(''):'<p class="sub">Slot yo‘q — yuqoridan vaqt belgilang.</p>';
}
function toast(t){const e=document.getElementById('toast');if(!e)return;e.textContent=t;e.classList.remove('hidden');setTimeout(()=>e.classList.add('hidden'),3000)}

// init viloyat selectlari
(function init(){
  const lr=document.getElementById('loginRegion');
  if(lr)lr.innerHTML='<option value="">— Viloyatni tanlang —</option>'+REGIONS.map(r=>`<option>${r}</option>`).join('');
  const cf=document.getElementById('cityFilter');
  if(cf)cf.innerHTML='<option value="">Barcha viloyatlar</option>'+REGIONS.map(r=>`<option>${r}</option>`).join('');
  const ad=document.getElementById('adminDate');
  if(ad){ad.value=todayStr();ad.min=todayStr();ad.max=addDaysStr(todayStr(),MAX_ADVANCE_DAYS-1);}
})();
renderUser();renderDoctors();renderPharm();renderMy();renderSms();renderAdmin();
const graceSel=document.getElementById('graceSel');
if(graceSel)graceSel.value=String(GRACE_SECONDS);
tickQueue();setInterval(()=>tickQueue(),1000);
