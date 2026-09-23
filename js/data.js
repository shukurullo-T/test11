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
// Foydalanuvchi yozgan matnni HTML ga xavfsiz qo'yish (<script> va h.k. ishlamasin)
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function fmtLeft(ms){const s=Math.max(0,Math.ceil(ms/1000));const m=Math.floor(s/60);const r=s%60;return (m>0?m+':':'0:')+String(r).padStart(2,'0')}

