function scrollToId(id){const e=document.getElementById(id);if(e)e.scrollIntoView({behavior:'smooth'})}
function setSymptom(t){document.getElementById('symptomInput').value=t;aiDiagnose()}
function aiDiagnose(){
  // o'zbekcha tutuq belgilarining barcha turlarini (‘ ’ ʻ ʼ `) bitta ' ga keltiramiz
  let raw=document.getElementById('symptomInput').value;
  // kirillda yozilgan yoki ovozdan kelgan matnni lotinga o'giramiz
  if(/[а-яёўқғҳ]/i.test(raw)&&typeof toLatin==='function')raw=toLatin(raw);
  const v=raw.toLowerCase().replace(/[‘’ʻʼ`]/g,"'");
  const box=document.getElementById('aiResult');
  box.classList.remove('hidden','ai-danger');
  if(v.trim().length<5){box.innerHTML="⚠️ Iltimos, simptomni batafsilroq yozing.";return}
  const disclaimer=`<p class="ai-note">ℹ️ Bu dastlabki yo'naltirish, tashxis emas. Yakuniy xulosani faqat shifokor beradi.</p>`;
  // XAVFLI BELGILAR — bron emas, darhol 103
  if(/ko'krak.*(og'ri|siqil|achish)|nafas.*(qis|ololma|yetish)|hush.*(ket|yo'q)|falaj|yuz.*qiyshay|gapira olmay|qon.*(qus|ket)|tutqanoq|zahar|ong.*yo'q/.test(v)){
    box.classList.add('ai-danger');
    box.innerHTML=`<h3>🚨 Shoshilinch holat bo'lishi mumkin!</h3><p>Siz yozgan belgilar hayot uchun xavfli holatga o'xshaydi. <b>Navbat kutmang — darhol tez yordam chaqiring.</b></p><a class="btn danger" href="tel:103" style="margin-top:10px;display:inline-block;text-decoration:none">📞 103 — Tez yordam</a>${disclaimer}`;
    return;
  }
  let spec="Terapevt",level="🟢 O'rta — 3 kun ichida",advice="Ko'p suyuqlik iching, dam oling.";
  if(/bosim|yurak|ko'krak|aylan/.test(v)){spec="Kardiolog";level="🟡 Yuqori — 24 soat ichida";advice="Bosimni o'lchang, tuzni kamaytiring."}
  else if(/bola|chaqaloq|emiza/.test(v)){spec="Pediatr";level=/isitma.*(39|40)|39|40/.test(v)?"🔴 Shoshilinch — bugun":"🟡 Yuqori — ertaga";advice="Bolaga yoshiga mos dozada isitma tushiruvchi bering, ko'p suyuqlik ichiring."}
  else if(/tish|milk|og'iz/.test(v)){spec="Stomatolog";level="🟡 Yuqori — ertaga";advice="Issiq-sovuqdan saqlaning."}
  else if(/teri|toshma|qichish|allerg/.test(v)){spec="Dermatolog";level="🟢 O'rta";advice="Qichimang."}
  else if(/asab|uyqusiz|stress|bel.*og|bosh.*og|nev/.test(v)){spec="Nevrolog";level="🟢 O'rta";advice="Uyqu rejimini tiklang."}
  else if(/isitma|yo'tal|tomoq|gripp|shamoll/.test(v)){spec="Terapevt";level="🟡 Yuqori — ertaga";advice="Iliq choy, vitamin C."}
  // avval foydalanuvchi viloyatidagi shu mutaxassisni, bo'lmasa istalgan viloyatdagisini topamiz
  const u=getUser();
  const doc=(u&&doctors.find(d=>d.spec===spec&&d.city===u.region))||doctors.find(d=>d.spec===spec)||doctors[0];
  const far=u&&doc.city!==u.region?`<br><small>⚠️ ${esc(u.region)}da ${spec} topilmadi — eng yaqini ko'rsatildi.</small>`:'';
  box.innerHTML=`<h3>✅ AI Xulosa</h3><p><b>Tavsiya:</b> 🩺 ${spec}ga boring</p><p><b>Daraja:</b> ${level}</p><p><b>Maslahat:</b> ${advice}</p><p style="margin-top:10px"><b>Topilgan shifokor:</b> ${doc.name} • ${doc.clinic}, ${doc.city}<br><small>📍 ${doc.addr}</small>${far}</p><button class="btn primary" style="margin-top:10px" onclick="openModal(${doc.id})">Shu shifokorga bron qilish →</button>${disclaimer}`;
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
  if(title)title.innerHTML=u?`👨‍⚕️ ${esc(effRegion)} dagi shifokorlar <small>siz ${esc(u.region)}dasiz${effRegion===u.region?" — faqat shu viloyat ko'rinmoqda":''}</small>`:`👨‍⚕️ Shifokorlar va Bron qilish`;
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
