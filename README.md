# MedBron — Navbatsiz tibbiyot (Startap MVP)

O'zbek tilidagi AI yordamchi → shifokor tanlash → onlayn bron → jonli navbat. Hammasi brauzerda, internetsiz ishlaydi (ma'lumotlar `localStorage` da).

## Ishga tushirish

`index.html` ni brauzerda oching yoki lokal server bilan:

```bash
python -m http.server 8765
```

So'ng http://localhost:8765 ni oching.

## Demo loginlar (admin / registratura)

| Login | Parol | Klinika |
|---|---|---|
| `fargona1` | `1234` | Sog'lom Oila (Farg'ona) |
| `toshkent1` | `1234` | Shifo Nur klinikasi (Toshkent) |
| `samarqand1` | `1234` | Bola Salomatligi (Samarqand) |
| `andijon1` | `1234` | Mehrli Ona (Andijon) |

## Hakamlar uchun demo ssenariy

1. Ism + telefon + viloyat bilan kiring.
2. **AI Tashxis** — simptom yozing (masalan "ko'kragim siqilyapti" → 🚨 103 ogohlantirishi).
3. Shifokorni tanlab bron qiling → **Mening bronlarim**.
4. Pastdagi "Shifoxona xodimimisiz?" orqali admin bo'lib kiring → **Demo bronlar ✨** → **Keyingi bemorni chaqirish 📢**.
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

## Cheklovlar (MVP)

- Server yo'q: ma'lumotlar faqat shu brauzerda saqlanadi, SMS — simulyatsiya.
- Admin parollari kod ichida ochiq turibdi — faqat demo uchun. Haqiqiy versiyada backend + xeshlangan parollar kerak.
- AI — kalit so'zlarga asoslangan qoidalar, tashxis emas.
