/* ============ FIKR-MULOHAZA: bir bosishda 👍/👎 + ixtiyoriy sabab va izoh ============ */
// Eslatma: server yo'q — fikrlar shu qurilmada saqlanadi (admin shu qurilmada ko'radi)
const FB_TAGS={
  up:['Qulay','Tez ishlaydi','AI foydali','Navbat tizimi zo‘r','Chiroyli'],
  down:['Tushunarsiz','Sekin','Shifokor topilmadi','Xato chiqdi','Kerakli narsa yo‘q']
};
function getFb(){try{return JSON.parse(localStorage.getItem('medbron_feedback')||'[]')}catch{return[]}}
function saveFb(list){try{localStorage.setItem('medbron_feedback',JSON.stringify(list.slice(-200)))}catch{}}
function myFb(){const id=localStorage.getItem('medbron_myfb');return id?getFb().find(f=>f.id===id)||null:null}
function upsertMyFb(patch){
  const list=getFb();let id=localStorage.getItem('medbron_myfb');
  let f=id&&list.find(x=>x.id===id);
  if(!f){id='f'+Date.now().toString(36)+Math.random().toString(36).slice(2,5);f={id,vote:null,tags:[],text:''};list.push(f);localStorage.setItem('medbron_myfb',id)}
  const u=getUser();
  Object.assign(f,patch,{who:u?u.name:'Mehmon',time:new Date().toLocaleString('uz-UZ')});
  saveFb(list);return f;
}
function fbVote(v){
  const cur=myFb();
  // ovoz o'zgarsa, eski sabablar mos kelmaydi — tozalaymiz
  upsertMyFb(cur&&cur.vote!==v?{vote:v,tags:[]}:{vote:v});
  renderFb();renderFbAdmin();
  toast(v==='up'?'💚 Rahmat! Fikringiz saqlandi':'🙏 Rahmat! Nimani yaxshilashimiz kerak — pastdan tanlang');
}
function fbToggleTag(t){
  const f=myFb();if(!f)return;
  const tags=f.tags.includes(t)?f.tags.filter(x=>x!==t):[...f.tags,t];
  upsertMyFb({tags});renderFb();renderFbAdmin();
}
function fbSend(){
  const el=document.getElementById('fbText');const text=el.value.trim();
  if(!text){toast('✍️ Izoh bo‘sh — yozish shart emas, ovozingiz allaqachon saqlangan');return}
  upsertMyFb({text:text.slice(0,500)});
  el.value='';renderFb();renderFbAdmin();toast('✅ Izohingiz uchun rahmat!');
}
function renderFb(){
  const f=myFb();
  const up=document.getElementById('fbUp'),down=document.getElementById('fbDown'),more=document.getElementById('fbMore');
  if(!up)return;
  up.classList.toggle('sel',f?.vote==='up');down.classList.toggle('sel',f?.vote==='down');
  if(!f||!f.vote){more.classList.add('hidden');return}
  more.classList.remove('hidden');
  document.getElementById('fbThanks').textContent=f.vote==='up'?'💚 Rahmat! Sizga nimasi yoqdi?':'🙏 Rahmat! Nima yoqmadi?';
  document.getElementById('fbTags').innerHTML=FB_TAGS[f.vote].map(t=>`<button type="button" class="fb-tag${f.tags.includes(t)?' sel':''}" onclick="fbToggleTag('${t.replace(/'/g,"\\'")}')">${f.tags.includes(t)?'✓ ':''}${t}</button>`).join('');
  document.getElementById('fbSaved').innerHTML=f.text?`📝 Izohingiz: <i>${esc(f.text)}</i>`:'';
}
function renderFbAdmin(){
  const box=document.getElementById('fbAdmin');if(!box)return;
  if(!getAdmin()){box.innerHTML='';return}
  const list=getFb().filter(f=>f.vote);
  const up=list.filter(f=>f.vote==='up').length,down=list.length-up;
  const pct=list.length?Math.round(up*100/list.length):0;
  const tagCount={};list.forEach(f=>f.tags.forEach(t=>tagCount[t]=(tagCount[t]||0)+1));
  const tags=Object.entries(tagCount).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<span class="fb-chip">${esc(t)} <b>${n}</b></span>`).join('');
  const texts=list.filter(f=>f.text).slice().reverse().map(f=>`<div class="feed-item ${f.vote==='up'?'feed-freed':'feed-change'}"><div>${f.vote==='up'?'👍':'👎'} ${esc(f.text)}</div><small>${esc(f.who||'')} • ${f.time||''}</small></div>`).join('');
  box.innerHTML=list.length?`<div class="fb-stats"><div><b>👍 ${up}</b><span>yoqdi</span></div><div><b>👎 ${down}</b><span>yoqmadi</span></div><div><b>${pct}%</b><span>mamnun</span></div></div><div class="fb-bar"><div style="width:${pct}%"></div></div>${tags?`<p class="sub" style="margin:10px 0 6px">Ko‘p tanlangan sabablar:</p><div class="fb-chips">${tags}</div>`:''}${texts||'<p class="sub" style="margin-top:10px">Hali yozma izoh yo‘q.</p>'}`
    :'<p class="sub">Hali fikr yo‘q. Pastdagi "Dastur sizga yoqdimi?" bo‘limida 👍/👎 bosilsa shu yerda chiqadi.</p>';
}

/* ============ BRON UCHUN QO'SHIMCHALAR: xarita, kalendar, qabul bahosi ============ */
function mapUrl(b){
  const d=doctors.find(x=>x.id===b.docId);
  return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent((b.clinic||'')+', '+(d?d.addr:b.city));
}
function addToCalendar(num){
  const b=getBooks().find(x=>x.num===num);if(!b)return;
  const d=doctors.find(x=>x.id===b.docId);
  const st=b.date.replace(/-/g,'')+'T'+b.time.replace(':','')+'00';
  const endMin=timeToMin(b.time)+30,end=b.date.replace(/-/g,'')+'T'+minToTime(endMin).replace(':','')+'00';
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MedBron//UZ','BEGIN:VEVENT',
    'UID:'+b.num+'@medbron','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z',
    'DTSTART:'+st,'DTEND:'+end,
    'SUMMARY:Shifokor qabuli — '+b.doc+' ('+b.num+')',
    'LOCATION:'+(b.clinic||'')+', '+(d?d.addr:b.city).replace(/,/g,'\\,'),
    'DESCRIPTION:Bron raqami '+b.num+'. Registraturaga shu raqamni ayting.',
    'BEGIN:VALARM','TRIGGER:-PT1H','ACTION:DISPLAY','DESCRIPTION:1 soatdan keyin shifokor qabuli','END:VALARM',
    'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));
  a.download='medbron-'+b.num+'.ics';document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000);
  toast('📅 Kalendar fayli yuklandi — oching va "Qo‘shish" ni bosing (1 soat oldin eslatadi)');
}
function rateVisit(num,v){
  const b=getBooks();const x=b.find(y=>y.num===num);if(!x)return;
  x.rating=v;saveBooks(b);
  notifyAdminAction(v==='up'?'new':'change',`QABUL BAHOSI ${v==='up'?'👍':'👎'}: ${x.name} (${x.num}) — ${x.doc}`,x);
  toast(v==='up'?'💚 Rahmat! Bahoingiz shifoxonaga yetkazildi':'🙏 Rahmat! Shifoxona buni ko‘rib chiqadi');
}
// "Mening bronlarim" kartasidagi qo'shimcha tugmalar
function ticketExtras(b){
  if(b.status==='waiting'||b.status==='called')
    return `<a class="mini-btn" href="${mapUrl(b)}" target="_blank" rel="noopener">📍 Xaritada</a><button class="mini-btn" onclick="addToCalendar('${b.num}')">📅 Kalendarga</button>`;
  if(b.status==='confirmed')
    return b.rating?`<span class="rated">${b.rating==='up'?'👍 Qabul yoqdi':'👎 Qabul yoqmadi'} — rahmat!</span>`
      :`<span class="rate-q">Qabul yoqdimi?</span><button class="mini-btn" onclick="rateVisit('${b.num}','up')">👍</button><button class="mini-btn" onclick="rateVisit('${b.num}','down')">👎</button>`;
  return '';
}
