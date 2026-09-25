/* ============ ADMIN AUTH (alohida, asosiy menyuda ko'rinmaydi) ============ */
function getAdmin(){try{return JSON.parse(localStorage.getItem('medbron_admin')||'null')}catch{return null}}
function saveAdmin(a){if(a)localStorage.setItem('medbron_admin',JSON.stringify(a));else localStorage.removeItem('medbron_admin');renderAdmin();}
function doAdminLogin(){
  const l=document.getElementById('adminLogin').value.trim();
  const p=document.getElementById('adminPass').value;
  const a=ADMINS.find(x=>x.login===l&&x.hash===hashStr('medbron:'+l+':'+p));
  if(!a){toast('❌ Login yoki parol xato');return}
  document.getElementById('adminPass').value='';
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
    const tel=f.booking?`<a class="mini-btn" href="tel:${esc((f.booking.phone||'').replace(/\s/g,''))}">📞 ${esc(f.booking.phone)} ga qo'ng'iroq</a>`:'';
    return `<div class="feed-item ${cls}"><div>${icon} ${esc(f.text)}</div><small>${f.time}${f.booking?` • <b>${f.booking.num}</b> ${esc(f.booking.name)} ${f.booking.date} ${f.booking.time}`:''}</small><div style="margin-top:6px">${tel}</div></div>`;
  }).join(''):`<p class="sub">Hali xabar yo'q. Bemor bron qilsa / o'zgartirsa / bekor qilsa — shu yerda 🟢 yashil bo'lib chiqadi + SMS keladi.</p>`;
}
function notifyAdminAction(type,text,booking){
  // adm inbox + adm telefoniga SMS simulyatsiya
  pushAdminFeed(type,text,booking);
  const adm=booking?adminOfDoctor(booking.docId):null;
  if(adm)sendSMS(adm.phone,`MedBron ADMIN (${adm.clinic}): ${text}`);
}

/* ============ SANA (14 kun oldin bron) ============ */
// mahalliy sana (toISOString UTC beradi — Toshkentda 00:00–05:00 da kechagi kun chiqib qolardi)
function localDateStr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function todayStr(){return localDateStr(new Date())}
function addDaysStr(base,n){const d=new Date(base+'T12:00:00');d.setDate(d.getDate()+n);return localDateStr(d)}
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
    // telefonda .ub-extra yashiriladi — faqat ism + viloyat + ixcham tugmalar qoladi
    if(badge)badge.innerHTML=`<span class="ub-name">👤 ${esc(u.name.split(' ')[0])}<span class="ub-extra"> ${esc(u.name.split(' ').slice(1).join(' '))} • 📞 ${esc(u.phone)}</span></span><button class="mini-btn ub-btn" onclick="changeRegion()" title="Viloyatni o'zgartirish">📍 ${esc(u.region)}</button><button class="mini-btn ub-btn" onclick="logout()" title="Chiqish">⎋<span class="ub-extra"> Chiqish</span></button>`;
    // viloyat filtrini avtomatik shu viloyatga qo'yamiz
    const cf=document.getElementById('cityFilter');
    if(cf&&[...cf.options].some(o=>o.value===u.region)){cf.value=u.region;}
    const lf=document.getElementById('loginRegionLabel');
    if(lf)lf.textContent=u.region;
  }else{
    if(login)login.classList.remove('hidden');
    // oldin shu qurilmada ro'yxatdan o'tgan bo'lsa — "Kodim bor" oynasi ochiladi
    if(document.getElementById('signinBox'))setLoginMode(getAccounts().length?'signin':'signup');
    if(badge)badge.innerHTML=`<button class="btn primary" onclick="document.getElementById('loginModal').classList.remove('hidden')">Kirish / Ro'yxatdan o'tish</button>`;
  }
}
/* ============ PIN KOD: ro'yxatdan o'tish / qayta kirish ============ */
// Akkauntlar shu qurilmada saqlanadi; PIN ochiq emas, faqat xeshi turadi
function getAccounts(){try{return JSON.parse(localStorage.getItem('medbron_accounts')||'[]')}catch{return[]}}
function saveAccounts(a){localStorage.setItem('medbron_accounts',JSON.stringify(a))}
const pinHash=(phone,pin)=>hashStr('pin:'+phone.replace(/\D/g,'').slice(-9)+':'+pin);
function setLoginMode(mode){
  const up=mode==='signup';
  document.getElementById('signupBox').classList.toggle('hidden',!up);
  document.getElementById('signinBox').classList.toggle('hidden',up);
  document.getElementById('tabSignup').classList.toggle('active',up);
  document.getElementById('tabSignin').classList.toggle('active',!up);
}
function doSignin(){
  const name=document.getElementById('signinName').value.trim().toLowerCase();
  const pin=document.getElementById('signinPin').value.trim();
  if(name.length<3||!/^\d{4,6}$/.test(pin)){toast('⚠️ Ism va 4–6 xonali kodni kiriting');return}
  const acc=getAccounts().find(a=>a.name.toLowerCase()===name&&a.pinHash===pinHash(a.phone,pin));
  if(!acc){toast('❌ Ism yoki kod xato. Birinchi marta bo‘lsa — "Yangi ro‘yxat"');return}
  document.getElementById('signinPin').value='';
  saveUser({name:acc.name,phone:acc.phone,region:acc.region});
  toast(`✅ Qaytganingizdan xursandmiz, ${acc.name}!`);
  renderDoctors();renderMy();
}
function doLogin(){
  const name=document.getElementById('loginName').value.trim();
  const phone=document.getElementById('loginPhone').value.trim();
  const region=document.getElementById('loginRegion').value;
  const pin=document.getElementById('loginPin').value.trim();
  const pin2=document.getElementById('loginPin2').value.trim();
  if(name.length<3){toast('⚠️ Ismingizni to‘liq yozing');return}
  if(phone.replace(/\D/g,'').length<9){toast('⚠️ Telefon raqamni to‘g‘ri kiriting (+998...)');return}
  if(!region){toast('⚠️ Viloyatingizni tanlang');return}
  if(!/^\d{4,6}$/.test(pin)){toast('⚠️ Kod 4–6 ta raqamdan iborat bo‘lsin');return}
  if(pin!==pin2){toast('⚠️ Kodlar bir xil emas');return}
  // shu telefon bilan akkaunt bo'lsa — yangilaymiz, bo'lmasa qo'shamiz
  const key=phone.replace(/\D/g,'').slice(-9);
  const accs=getAccounts().filter(a=>a.phone.replace(/\D/g,'').slice(-9)!==key);
  accs.push({name,phone,region,pinHash:pinHash(phone,pin)});saveAccounts(accs);
  document.getElementById('loginPin').value='';document.getElementById('loginPin2').value='';
  saveUser({name,phone,region});
  sendSMS(phone,`MedBron: Xush kelibsiz, ${name}! Siz ${region} viloyati sifatida kirdingiz. Endi faqat ${region} dagi klinikalar ko'rinadi.`);
  toast(`✅ Xush kelibsiz, ${name}! (${region})`);
  renderDoctors();renderMy();
}
function logout(){localStorage.removeItem('medbron_user');renderUser();renderDoctors();toast('🚪 Chiqildi — qayta kiring');}
function changeRegion(){
  const u=getUser();if(!u)return;
  const cur=prompt('Qaysi viloyat? Ro‘yxatdan tanlang:\n'+REGIONS.join(', '),u.region);
  if(cur&&REGIONS.includes(cur.trim())){u.region=cur.trim();saveUser(u);renderDoctors();toast('📍 Viloyat: '+u.region);}
  else if(cur)toast('❌ Bunday viloyat yo‘q');
}

