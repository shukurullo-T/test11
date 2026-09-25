/**
 * MedBron — Google Sheets "server":
 *  1) "Fikrlar" varag'i — 👍/👎, sabablar, izohlar (ism/telefonsiz)
 *  2) "Akkauntlar" varag'i — bemor akkauntlari, istalgan brauzer/telefondan kirish uchun.
 *     PIN kod ochiq saqlanmaydi, faqat xeshi. Akkauntlar ro'yxati hech qachon tashqariga berilmaydi.
 * O'rnatish: README.md dagi "Fikrlarni Google Sheets'ga ulash" bo'limiga qarang.
 */
const SHEET_NAME = 'Fikrlar';
const ACC_SHEET = 'Akkauntlar';
// Skript jadvalning o'zidan (Kengaytmalar → Apps Script) ochilgan bo'lsa — bo'sh qoldiring.
// Alohida (script.new) yaratilgan bo'lsa — jadval havolasidagi /d/.../ orasidagi ID ni yozing.
const SHEET_ID = '';

function sheet_() {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'vaqt', 'ovoz', 'sabablar', 'izoh']);
    sh.setFrozenRows(1);
  }
  // vaqt ustuni matn bo'lib tursin — jadval va skript vaqt mintaqalari chalkashmasin
  if (sh.getRange('B2').getNumberFormat() !== '@') sh.getRange('B:B').setNumberFormat('@');
  return sh;
}

// jadvalda formula sifatida ishlab ketmasin (=, +, -, @ bilan boshlangan matn)
function safe_(s, max) {
  s = String(s || '').slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Sayt yangi fikr yuboradi yoki shu qurilmaning eski fikrini yangilaydi; akkaunt so'rovlari ham shu yerga keladi
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (d.action === 'signup') return out_(signup_(d));
    if (d.action === 'signin') return out_(signin_(d));
    if (!/^f[a-z0-9]{4,20}$/.test(d.id) || ['up', 'down'].indexOf(d.vote) < 0) return out_({ ok: false });
    const tags = (Array.isArray(d.tags) ? d.tags : []).slice(0, 5).map(t => safe_(t, 40)).join(', ');
    const now = Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyy-MM-dd HH:mm');
    const row = [d.id, now, d.vote === 'up' ? '👍' : '👎', tags, safe_(d.text, 500)];
    const sh = sheet_();
    const n = sh.getLastRow() - 1;
    const ids = n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(r => r[0]) : [];
    const i = ids.indexOf(d.id);
    if (i >= 0) sh.getRange(i + 2, 1, 1, 5).setValues([row]);
    else sh.appendRow(row);
    return out_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Admin paneli barcha fikrlarni o'qiydi
function doGet() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  const rows = n > 0 ? sh.getRange(2, 1, n, 5).getValues() : [];
  const items = rows.filter(r => r[0]).map(r => ({
    id: r[0],
    time: r[1] instanceof Date ? Utilities.formatDate(r[1], 'Asia/Tashkent', 'yyyy-MM-dd HH:mm') : String(r[1]),
    vote: r[2] === '👍' ? 'up' : 'down',
    tags: r[3] ? String(r[3]).split(', ') : [],
    text: String(r[4] || '').replace(/^'/, '')
  }));
  return out_({ items: items });
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ============ AKKAUNTLAR ============ */
// saytdagi hashStr bilan bir xil (cyrb53)
function hash_(str, seed) {
  seed = seed || 7;
  let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507); h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507); h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
const phoneKey_ = p => String(p || '').replace(/\D/g, '').slice(-9);

function accSheet_() {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(ACC_SHEET);
  if (!sh) {
    sh = ss.insertSheet(ACC_SHEET);
    sh.appendRow(['id', 'ism', 'telefon', 'viloyat', 'pin xeshi', 'yaratilgan']);
    sh.setFrozenRows(1);
    sh.getRange('A:F').setNumberFormat('@');
  }
  return sh;
}
function accRows_(sh) {
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, 5).getValues() : [];
}

// Ro'yxatdan o'tish: sayt PIN ning o'zini emas, xeshini yuboradi
function signup_(d) {
  const name = String(d.name || '').trim().slice(0, 60), phone = String(d.phone || '').trim().slice(0, 30);
  const key = phoneKey_(phone);
  if (name.length < 3 || key.length < 9 || !/^[a-z0-9]{4,20}$/.test(d.pinHash || '') || !/^[a-z0-9]{4,30}$/.test(d.id || '')) return { ok: false, error: 'bad' };
  const sh = accSheet_();
  const rows = accRows_(sh);
  const same = rows.find(r => phoneKey_(r[2]) === key);
  if (same) {
    // shu akkaunt boshqa brauzerdan qayta yuklanyapti (bir xil id va kod) — muammo emas
    if (same[0] === d.id && same[4] === d.pinHash) return { ok: true, account: acc_(same) };
    return { ok: false, error: 'exists' };
  }
  const region = String(d.region || '').slice(0, 40);
  const row = [d.id, safe_(name, 60), safe_(phone, 30), region, d.pinHash, Utilities.formatDate(new Date(), 'Asia/Tashkent', 'yyyy-MM-dd HH:mm')];
  sh.appendRow(row);
  return { ok: true, account: acc_(row) };
}

// Kirish: ism + PIN. Kodni taxmin qilib topishga urinishlar cheklangan
function signin_(d) {
  const name = String(d.name || '').trim().toLowerCase(), pin = String(d.pin || '');
  if (name.length < 3 || !/^\d{4,6}$/.test(pin)) return { ok: false, error: 'bad' };
  const cache = CacheService.getScriptCache(), ck = 'fail_' + hash_(name);
  const fails = Number(cache.get(ck) || 0);
  if (fails >= 5) return { ok: false, error: 'locked' };
  const rows = accRows_(accSheet_());
  const r = rows.find(r => String(r[1]).replace(/^'/, '').trim().toLowerCase() === name && r[4] === hash_('pin:' + phoneKey_(r[2]) + ':' + pin));
  if (!r) {
    cache.put(ck, String(fails + 1), 600);
    // bu ismli akkaunt serverda umuman yo'qmi? (sayt shunda brauzerdagi eski akkauntni yuklaydi)
    const known = rows.some(x => String(x[1]).replace(/^'/, '').trim().toLowerCase() === name);
    return { ok: false, error: known ? 'wrong' : 'notfound' };
  }
  cache.remove(ck);
  return { ok: true, account: acc_(r) };
}
function acc_(r) {
  return { id: r[0], name: String(r[1]).replace(/^'/, ''), phone: String(r[2]).replace(/^'/, ''), region: r[3] };
}
