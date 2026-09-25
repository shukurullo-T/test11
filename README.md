# MedBron — Navbatsiz tibbiyot (Startap MVP)

O'zbek tilidagi AI yordamchi → shifokor tanlash → onlayn bron → jonli navbat. Hammasi brauzerda, internetsiz ishlaydi (ma'lumotlar `localStorage` da).

## Ishga tushirish

`index.html` ni brauzerda oching yoki lokal server bilan:

```bash
python -m http.server 8765
```

So'ng http://localhost:8765 ni oching.

## Admin loginlar

Har bir klinikaning o'z logini bor. Login va parollar **hakamlarga alohida (qog'ozda) beriladi** — kodda va bu faylda ochiq saqlanmaydi (kodda faqat xeshi turadi).

## Hakamlar uchun demo ssenariy

1. Ism + telefon + viloyat bilan kiring.
2. **AI Tashxis** — simptom yozing (masalan "ko'kragim siqilyapti" → 🚨 103 ogohlantirishi).
3. Shifokorni tanlab bron qiling → **Mening bronlarim**.
4. Admin bo'limiga (alohida berilgan login bilan) kiring → **Demo bronlar ✨** → **Keyingi bemorni chaqirish 📢**.
5. **Jonli navbat** va **SMS simulyatsiyasi** oynalarini kuzating.

## Fayllar

| Fayl | Vazifasi |
|---|---|
| `js/data.js` | Viloyatlar, shifokorlar, dorilar, adminlar, umumiy yordamchilar |
| `js/auth.js` | Bemor va admin kirishi, sana funksiyalari, admin xabarnomalari |
| `js/slots.js` | Ish soatlari, bo'sh/band/o'tgan soatlar |
| `js/ai-doctors.js` | AI triaj, shifokorlar ro'yxati, dorilar |
| `js/booking.js` | Bron, bekor qilish, vaqtni ko'chirish, SMS |
| `js/queue.js` | Jonli navbat, chaqiruv, demo ma'lumotlar |
| `js/admin.js` | Admin panel, registratura, ishga tushirish |

## Fikrlarni Google Sheets'ga ulash

"Dastur sizga yoqdimi?" bo'limidagi 👍/👎, sabablar va izohlar barcha telefonlardan bitta Google jadvalga yig'iladi. Ism va telefon yuborilmaydi.

1. [sheets.new](https://sheets.new) — yangi Google jadval oching, nomini `MedBron fikrlar` qiling.
2. Menyu: **Kengaytmalar → Apps Script** (Extensions → Apps Script).
3. Ochilgan oynadagi hamma kodni o'chirib, [`google-sheets/Code.gs`](google-sheets/Code.gs) faylidagi kodni joylang va 💾 saqlang.
4. **Joylashtirish → Yangi joylashtirish** (Deploy → New deployment) → turi: **Veb-ilova** (Web app).
   - *Kim nomidan ishga tushadi:* **Men** (Me)
   - *Kimda ruxsat bor:* **Hamma** (Anyone)
5. **Joylashtirish** ni bosing → Google ruxsat so'raydi → hisobingizni tanlang → *Advanced → Go to ... (unsafe)* → *Allow*.
6. Chiqqan **Veb-ilova havolasini** (`https://script.google.com/macros/s/.../exec`) nusxalang.
7. [`js/data.js`](js/data.js) dagi `const FEEDBACK_URL='';` qatoriga shu havolani qo'ying va GitHub'ga yuklang.

Shundan keyin admin panelidagi "💬 Foydalanuvchi fikrlari" kartasi barcha foydalanuvchilarning fikrini ko'rsatadi, jadvalda esa har bir fikr alohida qator bo'lib turadi.

Shu skript **bemor akkauntlarini** ham saqlaydi ("Akkauntlar" varag'i), shuning uchun bir marta ro'yxatdan o'tgan odam istalgan brauzer yoki telefondan kira oladi. PIN kodning o'zi saqlanmaydi (faqat xeshi), akkauntlar ro'yxati tashqariga berilmaydi, 5 ta xato urinishdan keyin shu ism 10 daqiqaga bloklanadi. Bronlar hozircha har bir qurilmada alohida saqlanadi.

## Cheklovlar (MVP)

- Server yo'q: ma'lumotlar faqat shu brauzerda saqlanadi, SMS — simulyatsiya.
- Parollar kodda faqat xesh ko'rinishida, lekin serversiz demo baribir to'liq himoyalanmaydi. Haqiqiy versiyada backend kerak.
- AI — kalit so'zlarga asoslangan qoidalar, tashxis emas.

---

## English: MedBron — Queue-Free Medicine (Startup MVP)

A demo web app (Uzbek language) for booking doctor appointments without waiting hours in polyclinic queues. All data is stored offline in the browser (localStorage), no backend. Code: index.html, styles.css and the js/ folder (see the file table above).

How it works, step by step:

Login (name + phone + region) — On first open, a login modal requires your name, phone number, and region (viloyat). After login, only clinics from your region are shown. Example: if you select Farg'ona, you see only Farg'ona clinics with street addresses.
AI First-Aid Assistant — You type symptoms in Uzbek (e.g. "headache, high blood pressure"). The built-in rule-based AI suggests the right specialist (Cardiologist, Pediatrician, etc.), an urgency level, home advice, and a matching doctor from your region with a one-click "Book this doctor" button.
Doctors & Booking (up to 14 days ahead) — Doctor cards show specialty, clinic, address, rating, price, plus live availability: how many free slots today and the nearest free day. In the booking modal you pick a date (a 14-day strip shows 🟢 free / 🔴 full per day), then a time slot. A slot taken by someone else becomes ⛔ taken and can't be clicked. Booking requires name + phone + number of people.
Smart live queue (no-show handling) — When a patient's turn comes, the admin calls them. The public screen shows only a countdown timer (default 3 minutes, 30-sec demo mode). If the patient doesn't confirm in time: warning SMS → then the slot is automatically freed and passed to the next patient, and both sides get SMS notifications. If someone cancels or reschedules, their freed slot is highlighted 🟢 green in the admin panel and auto-offered to the next waiting patient.
Admin panel (hidden, login + password) — Each hospital has its own login (credentials are handed to judges separately; only hashes are stored in code). The admin sees only their clinic: today's bookings, notifications feed (new booking / change / freed — green), working-hours setup down to the minute (e.g. 09:15–18:45, every 15/20/30 min), open/close slots with one click, queue calling, confirming arrivals ("Keldi"), and registering offline walk-in patients by phone. Reception name + phone is shown on every doctor card so people without the app can call.
Drug price comparison — Shows the same medicine's cheap vs. expensive pharmacy prices.
SMS simulation — Since there's no real SMS gateway in the MVP, all SMS messages appear in an on-screen log so judges can see the full flow: booking confirmation → turn called → warning → freed/passed.
Demo flow for judges: Login (Farg'ona) → AI symptom → Book → Admin login → Call next → watch the countdown → patient misses it → slot auto-passes to the next person with SMS + green admin alert.
