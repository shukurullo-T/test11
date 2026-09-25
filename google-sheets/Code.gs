/**
 * MedBron — fikrlarni Google Sheets jadvaliga yig'ish.
 * O'rnatish: README.md dagi "Fikrlarni Google Sheets'ga ulash" bo'limiga qarang.
 * Ism va telefon YUBORILMAYDI — faqat ovoz, sabablar va izoh.
 */
const SHEET_NAME = 'Fikrlar';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['id', 'vaqt', 'ovoz', 'sabablar', 'izoh']);
    sh.setFrozenRows(1);
  }
  return sh;
}

// jadvalda formula sifatida ishlab ketmasin (=, +, -, @ bilan boshlangan matn)
function safe_(s, max) {
  s = String(s || '').slice(0, max);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Sayt yangi fikr yuboradi yoki shu qurilmaning eski fikrini yangilaydi
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!/^f[a-z0-9]{4,20}$/.test(d.id) || ['up', 'down'].indexOf(d.vote) < 0) return out_({ ok: false });
    const tags = (Array.isArray(d.tags) ? d.tags : []).slice(0, 5).map(t => safe_(t, 40)).join(', ');
    const row = [d.id, new Date(), d.vote === 'up' ? '👍' : '👎', tags, safe_(d.text, 500)];
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
    time: Utilities.formatDate(new Date(r[1]), 'Asia/Tashkent', 'yyyy-MM-dd HH:mm'),
    vote: r[2] === '👍' ? 'up' : 'down',
    tags: r[3] ? String(r[3]).split(', ') : [],
    text: String(r[4] || '').replace(/^'/, '')
  }));
  return out_({ items: items });
}

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
