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
  const disclaimer=`<p class="ai-note">ℹ️ MedBron AI tashxis qo'ymaydi — faqat qaysi mutaxassisga murojaat qilishni tavsiya qiladi. Tashxis va davolashni faqat shifokor belgilaydi. Ahvolingiz og'irlashsa — 103.</p>`;
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
  box.innerHTML=`<h3>🧭 AI tavsiyasi</h3><p><b>Qaysi mutaxassis:</b> 🩺 ${spec}</p><p><b>Qanchalik tez:</b> ${level}</p><p><b>Shifokorgacha:</b> ${advice}</p><p style="margin-top:10px"><b>Yaqin shifokor:</b> ${doc.name} • ${doc.clinic}, ${doc.city}<br><small>📍 ${doc.addr}</small>${far}</p><button class="btn primary" style="margin-top:10px" onclick="openModal(${doc.id})">Shu shifokorga bron qilish →</button>${disclaimer}`;
}
function renderDoctors(){
  const grid0=document.getElementById('doctorGrid');if(!grid0)return; // admin sahifasida shifokorlar ro'yxati yo'q
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
    // eng yaqin bo'sh kun va o'sha kundagi bo'sh vaqtlar (14 kun ichida)
    let day=null,times=[];
    for(let k=0;k<MAX_ADVANCE_DAYS;k++){
      const dt=addDaysStr(today,k);const{slots,closed}=buildSlots(d.id,dt);const taken=getTaken(d.id,dt);
      const f=slots.filter(t=>!taken.has(t)&&!closed.includes(t));
      if(f.length){day=dt;times=f;break}
    }
    const w=getWork(d.id);
    const adm=adminOfClinic(d.clinic);
    const dayLbl=day===today?'Bugun':day===addDaysStr(today,1)?'Ertaga':day?dayShort(day):'';
    const chips=times.slice(0,6).map(t=>`<button class="slot-chip" onclick="openModal(${d.id},'${day}','${t}')">${t}</button>`).join('')+(times.length>6?`<button class="slot-chip more" onclick="openModal(${d.id},'${day}')">+${times.length-6}</button>`:'');
    return `<div class="card doc-card">
      <div class="doc-head"><div class="doc-ava" style="background:${specColor(d.spec)}">${initials(d.name)}</div>
        <div><h3>${d.name}</h3><div class="spec">${d.spec} · ${d.exp} tajriba</div><div class="doc-rate">⭐ <span class="rating">${d.rating}</span> · 📍 ${d.city}</div></div></div>
      <ul class="doc-info">
        <li>🏥 <b>${d.clinic}</b></li>
        <li>📌 ${d.addr} <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.clinic+', '+d.addr)}" target="_blank" rel="noopener">Xaritada ↗</a></li>
        <li>🕘 Ish vaqti: ${w.start}–${w.end} · har ${w.step} daq</li>
        <li>💵 Qabul: <b>${d.price}</b></li>
      </ul>
      <div class="doc-slots">${day?`<div class="slots-lbl">🟢 ${dayLbl} bo'sh vaqtlar:</div><div class="slot-chips">${chips}</div>`:`<div class="slots-lbl">🔴 14 kun ichida bo'sh vaqt yo'q</div>`}</div>
      <button class="btn primary full" onclick="openModal(${d.id}${day?`,'${day}'`:''})">Bron qilish</button>
      ${adm?`<p class="doc-reception">📞 Ilovasiz yozilish: registratura <a href="tel:${adm.phone.replace(/\s/g,'')}">${adm.phone}</a></p>`:''}
    </div>`;
  }).join('');
}
function initials(n){return n.replace(/^Dr\.?\s*/,'').split(/\s+/).map(x=>x[0]||'').join('').slice(0,2).toUpperCase()}
function specColor(sp){return({Terapevt:'#2563eb',Pediatr:'#16a34a',Kardiolog:'#dc2626',Stomatolog:'#0891b2',Dermatolog:'#c026d3',Nevrolog:'#7c3aed'})[sp]||'#475569'}
function dayShort(d){const m=['yan','fev','mar','apr','may','iyun','iyul','avg','sen','okt','noy','dek'];return +d.slice(8)+'-'+m[+d.slice(5,7)-1]}
function renderPharm(){
  const box=document.getElementById('pharmGrid');if(!box)return;
  box.innerHTML=drugs.map(d=>`<div class="pharm"><h4>${d.name}</h4><p class="cheap">✅ ${d.cheap}</p><p class="exp">${d.exp}</p></div>`).join('');
}
