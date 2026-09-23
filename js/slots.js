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
  // bugungi o'tib ketgan soatlarni ham yopiq deb hisoblaymiz — o'tgan vaqtga bron qilib bo'lmaydi
  const closed=(ex.closed||[]).slice();
  if(date===todayStr()){const now=new Date();const nm=now.getHours()*60+now.getMinutes();out.forEach(t=>{if(timeToMin(t)<=nm&&!closed.includes(t))closed.push(t)})}
  return{slots:out,closed};
}
function isPastSlot(date,t){if(date!==todayStr())return date<todayStr();const n=new Date();return timeToMin(t)<=n.getHours()*60+n.getMinutes()}
function getTaken(docId,date){
  const b=getBooks();
  const s=new Set();
  b.forEach(x=>{
    if(x.docId===docId&&x.date===date&&(x.status==='waiting'||x.status==='called'||x.status==='confirmed'))s.add(x.time);
  });
  return s;
}

