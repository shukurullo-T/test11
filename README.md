MedBron — Queue-Free Medicine (Startup MVP)

A demo web app (Uzbek language) for booking doctor appointments without waiting hours in polyclinic queues. All data is stored offline in the browser (localStorage), no backend. 3 files: index.html, app.js, styles.css.

How it works, step by step:

Login (name + phone + region) — On first open, a login modal requires your name, phone number, and region (viloyat). After login, only clinics from your region are shown. Example: if you select Farg'ona, you see only Farg'ona clinics with street addresses.
AI First-Aid Assistant — You type symptoms in Uzbek (e.g. "headache, high blood pressure"). The built-in rule-based AI suggests the right specialist (Cardiologist, Pediatrician, etc.), an urgency level, home advice, and a matching doctor from your region with a one-click "Book this doctor" button.
Doctors & Booking (up to 14 days ahead) — Doctor cards show specialty, clinic, address, rating, price, plus live availability: how many free slots today and the nearest free day. In the booking modal you pick a date (a 14-day strip shows 🟢 free / 🔴 full per day), then a time slot. A slot taken by someone else becomes ⛔ taken and can't be clicked. Booking requires name + phone + number of people.
Smart live queue (no-show handling) — When a patient's turn comes, the admin calls them. The public screen shows only a countdown timer (default 3 minutes, 30-sec demo mode). If the patient doesn't confirm in time: warning SMS → then the slot is automatically freed and passed to the next patient, and both sides get SMS notifications. If someone cancels or reschedules, their freed slot is highlighted 🟢 green in the admin panel and auto-offered to the next waiting patient.
Admin panel (hidden, login + password) — Each hospital has its own login (e.g. fargona1 / 1234). The admin sees only their clinic: today's bookings, notifications feed (new booking / change / freed — green), working-hours setup down to the minute (e.g. 09:15–18:45, every 15/20/30 min), open/close slots with one click, queue calling, confirming arrivals ("Keldi"), and registering offline walk-in patients by phone. Reception name + phone is shown on every doctor card so people without the app can call.
Drug price comparison — Shows the same medicine's cheap vs. expensive pharmacy prices.
SMS simulation — Since there's no real SMS gateway in the MVP, all SMS messages appear in an on-screen log so judges can see the full flow: booking confirmation → turn called → warning → freed/passed.
Demo flow for judges: Login (Farg'ona) → AI symptom → Book → Admin login (fargona1 / 1234) → Call next → watch the countdown → patient misses it → slot auto-passes to the next person with SMS + green admin alert.
