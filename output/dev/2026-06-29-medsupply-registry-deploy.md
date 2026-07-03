---
title: 🔧 ระบบทะเบียนเวชภัณฑ์ (Medsupply Registry) — Build + Audit + Deploy
file_type: output_other
agent_owner: unspecified
last_updated: 2026-06-29
---

# 🔧 ระบบทะเบียนเวชภัณฑ์ (Medsupply Registry) — Build + Audit + Deploy

## วิเคราะห์
Jed ต้องการ webapp ลงทะเบียนเวชภัณฑ์ (จาก Excel เดิม 83 รายการ) พร้อม QR code, logbook (ใช้งาน/เก็บ/ซ่อมบำรุง), เพิ่ม-ลด, เก็บข้อมูลใน Google Drive ระหว่างที่ Forge สร้างเวอร์ชันแรกอยู่ Jed ให้ทีม agent ใน Antigravity (เครื่องมือคนละตัว) สร้างอีกเวอร์ชันแบบฟีเจอร์ครบกว่า (dashboard, table/grid view, print label, offline cache, html5-qrcode scan จริง) — สุดท้ายเลือกใช้เวอร์ชัน Antigravity เป็นตัวจริง โดย Vera/Forge ทำหน้าที่ audit ความปลอดภัยและช่วย deploy

## โค้ด/ไฟล์ที่เกี่ยวข้อง
- เวอร์ชัน Forge (เก็บไว้เป็น reference/fallback ไม่ได้ deploy จริง): [Medsupply_Registry/](../../Medsupply_Registry/)
- เวอร์ชันที่ deploy จริง (Antigravity build): `D:\Antigravity\Medical_Equipment\` — `gas-code.js` (backend), `src/main.js` (frontend, Vite), `dist/` (build สำหรับ Netlify)
- คู่มือ deploy: `C:\Users\oojkk\Downloads\Medical_Equipment_work_deployment_guide.md`

## Audit ที่เจอ + แพตช์
1. **ไม่มี auth บน GAS endpoints + Web App ตั้ง "Anyone"** — ใครรู้ลิงก์ก็ยิง `bulkImport`/`deleteEquipment` ล้างข้อมูลทั้งหมดได้ → Antigravity แพตช์เพิ่ม `API_TOKEN` + `checkAuth()` ใน `gas-code.js`
2. **Stored XSS** — render ชื่อ/หมายเหตุเวชภัณฑ์ผ่าน `innerHTML` ตรงๆไม่กรอง → Antigravity เพิ่ม `escapeHTML()` ส่วนใหญ่ แต่หลุด 1 จุดที่ `alt="${item.ชื่อทั่วไป}"` ของรูปการ์ด — Vera แพตช์เพิ่มที่ `src/main.js:659`
3. **บั๊กหลัง deploy: token หลุดตอนเขียนข้อมูล** — `postToCloud()` (ใช้กับ add/edit/delete/bulkImport/uploadImage) ไม่ได้แนบ `token` ไปใน POST body เลย (ส่งแค่ตอน GET sync) ทำให้ทุกการบันทึก/นำเข้าข้อมูลโดน server ปฏิเสธ "รหัสผ่านไม่ถูกต้อง" — Forge แก้โดยเพิ่ม `token: appsScriptToken` เข้า body ที่ `src/main.js:1202` แล้ว `npm run build` ใหม่
4. **อัปโหลดรูปภาพล้มเหลว** — `uploadImage` ใน `gas-code.js` เรียก `file.setSharing(ANYONE_WITH_LINK, ...)` โดยไม่มี try/catch ครอบ ถ้านโยบายองค์กร (หน่วยงานราชการ/ทหาร) ล็อกการแชร์ไฟล์แบบสาธารณะ ฟังก์ชันจะ throw error ทำให้อัปโหลดล้มเหลวทั้งที่ไฟล์อาจขึ้น Drive ไปแล้ว — Forge แพตช์ให้ลอง `ANYONE_WITH_LINK` → ถ้าไม่ผ่านลอง `DOMAIN_WITH_LINK` → ถ้ายังไม่ผ่านปล่อยเป็นไฟล์ส่วนตัวแต่ไม่ error ทั้งฟังก์ชัน (`gas-code.js` หลัง `uploadImage` action) — เทสจริงกับ Sheet ที่ทำงานแล้วอัปโหลดผ่าน ใช้งานได้ปกติ (องค์กรนี้ไม่ได้ล็อกแชร์)

## วิธี deploy ที่ทำสำเร็จ
1. Google Sheet + Apps Script (`gas-code.js` พร้อม `API_TOKEN` ตั้งไว้) → Deploy as Web App (Execute as: Me, Access: Anyone) → ได้ URL `/exec`
2. Netlify: ลาก `dist/` ขึ้น → ได้ลิงก์ → เปลี่ยนชื่อ site เป็น `or-bah-equip.netlify.app`
3. หน้า "ตั้งค่าระบบ" ของเว็บ → ใส่ Web App URL + Security Token ให้ตรงกับ `gas-code.js` → เชื่อมต่อสำเร็จ (เขียว)
4. นำเข้า `ทะเบียนเวชภัณฑ์.xlsx` 83 รายการเข้า Google Sheet สำเร็จ

## หมายเหตุ
- ระบบไม่มี login (ตามที่ Jed เลือก — ใช้กันในทีมเล็กที่ไว้ใจกัน) ความปลอดภัยที่เหลือพึ่ง Security Token ตัวเดียว
- ถ้าทีมโตขึ้นในอนาคต ควรเพิ่ม RBAC pattern (ดู `memory/knowledge_gas_sheets_webapp.md`)
- ข้อเรียนรู้สำคัญ: ทุกครั้งที่เพิ่ม auth check ฝั่ง backend ต้องเช็คให้ครบว่าทุก endpoint ฝั่ง frontend ส่ง credential ไปด้วยจริง ไม่ใช่แค่ endpoint ที่ทดสอบตอน connect

## สถานะ
✅ Deploy เสร็จสมบูรณ์ ใช้งานจริงแล้วที่ `or-bah-equip.netlify.app`
✅ อัปโหลดรูปภาพเวชภัณฑ์เข้า Google Drive ทดสอบจริงผ่านแล้ว (2026-06-29) — เซฟลง Drive + แสดงผลผ่านลิงก์ `lh3.googleusercontent.com` ปกติ ไม่โดนล็อกแชร์
