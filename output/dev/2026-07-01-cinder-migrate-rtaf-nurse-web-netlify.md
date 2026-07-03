---
title: 🔥 ย้าย ชศพอ. Web App → Netlify + บัญชีใหม่ nurse.rtafnc@gmail.com — Cinder
file_type: output_other
agent_owner: unspecified
last_updated: 2026-07-01
---

# 🔥 ย้าย ชศพอ. Web App → Netlify + บัญชีใหม่ nurse.rtafnc@gmail.com — Cinder

## อาการ/ปัญหา
Jed อยากย้ายระบบ ชศพอ. (Member Management Web App) ทั้งชุด — Sheet, Apps Script, Hosting — จากบัญชีส่วนตัวไปอยู่ใต้ nurse.rtafnc@gmail.com ทั้งหมด และเปลี่ยน hosting จาก GitHub Pages → Netlify แบบลากวางไฟล์ (ทำแล้วชอบกับ Medical_Equipment) หน้าตา/ฟังก์ชันเหมือนเดิม ต้องย้ายข้อมูลสมาชิก 3,512 คนไปด้วย ไม่ให้หาย

ของเดิมยังใช้งานอยู่ (สมาชิกเข้าเว็บได้ปกติ) — งานนี้คือเตรียมของใหม่แบบไม่แตะของเดิม แล้ว cutover ทีหลังตอนทดสอบผ่านหมด

## สิ่งที่ทำ (เตรียมไว้ให้ Jed แล้ว — ยังไม่แตะบัญชี/ระบบจริง)
1. **`D:\Claude_Cowork\rtaf-nurse-web\netlify-deploy\`** — โฟลเดอร์ static ไฟล์พร้อมลากขึ้น Netlify (index.html, members.html, register.html, admin/, css/, js/, images/ — ไม่มี apps-script/.git/.claude ติดไปด้วย เพราะจะพ่วงโค้ด backend ขึ้นเป็นไฟล์ public)
2. **`D:\Claude_Cowork\rtaf-nurse-web\apps-script-new\รหัส.js`** — โค้ด backend GAS ชุดใหม่ (copy จากของเดิม) มี TODO 2 จุด: `SHEET_ID` (บรรทัด 1) และ `SITE_URL` (บรรทัด 168) ให้กรอกทีหลังตาม checklist
3. **`netlify-deploy/js/config.js`** — มี TODO 2 จุด: `API_URL`, `GOOGLE_CLIENT_ID` ให้กรอกทีหลัง

เช็คโค้ดเดิมแล้วพบจุดที่ hardcode ผูกกับบัญชี/domain เดิม 4 จุด (แก้ครบในไฟล์ที่เตรียมไว้แล้ว): `SHEET_ID`, `SITE_URL` ใน apps-script, `API_URL`, `GOOGLE_CLIENT_ID` ใน config.js — ส่วน path รูป/css/js ในหน้าเว็บใช้ relative path หมด ไม่ต้องแก้อะไร

## Checklist ที่ Jed ต้องทำเอง (ต้อง login บัญชีใหม่ Cinder ทำแทนไม่ได้)

### Step 1 — คัดลอก Sheet เดิมทั้งข้อมูล+schema
1. เปิด Sheet เดิม: https://docs.google.com/spreadsheets/d/1Z4bYmol5qtVGQNDWAEHrNHyZyGLlqHncFJWPPxqY7Qw/
2. File → Make a copy — ตั้งชื่อเช่น "ชศพอ_Members_DB" (จะได้ข้อมูล 3,512 คนมาด้วยอัตโนมัติ ไม่ต้อง copy-paste มือ)
3. ย้ายไฟล์สำเนาเข้าโฟลเดอร์ https://drive.google.com/drive/folders/1NrzR3xW4E4Q-jTXSOrA6PCHuGH7FkN8T (ถ้าเลือก location ตอน Make a copy ไม่ได้ ให้ใช้ "Move to" ย้ายทีหลัง)
4. ถ้าอยากให้ nurse.rtafnc@gmail.com เป็นเจ้าของเต็ม → Share → ⚙️ → Transfer ownership
5. Copy **Sheet ID ใหม่** จาก URL (ระหว่าง `/d/` กับ `/edit`) เก็บไว้ใช้ Step 2

### Step 2 — สร้าง Apps Script project ใหม่
1. Login ด้วย nurse.rtafnc@gmail.com
2. เปิด Sheet ใหม่ (Step 1) → Extensions → Apps Script
3. ลบโค้ดเดิมใน Code.gs ทิ้ง → paste โค้ดจาก `apps-script-new/รหัส.js` ทั้งหมด
4. Project Settings → ติ๊ก "Show appsscript.json" → paste เนื้อไฟล์ `apps-script-new/appsscript.json`
5. แก้บรรทัด 1: ใส่ Sheet ID จาก Step 1 แทน `TODO_PASTE_NEW_SHEET_ID_HERE`
6. บรรทัด `SITE_URL` (`TODO_PASTE_NEW_NETLIFY_URL_HERE`) — ข้ามไปก่อน กลับมาแก้ใน Step 5
7. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy
8. Copy "Web app URL" (ลงท้าย `/exec`) เก็บไว้ใช้ Step 5

### Step 3 — ตั้ง Google OAuth Client ID ใหม่
1. https://console.cloud.google.com (login nurse.rtafnc@gmail.com) → สร้าง Project ใหม่
2. APIs & Services → Credentials → Create Credentials → OAuth client ID → Web application
3. Copy **Client ID** เก็บไว้ใช้ Step 5 (Authorized JavaScript origins ใส่ทีหลังใน Step 5 ตอนมี Netlify URL แล้ว)

### Step 4 — Deploy ขึ้น Netlify (ลากวาง)
1. Login/สร้างบัญชี Netlify ด้วย nurse.rtafnc@gmail.com
2. Add new site → Deploy manually
3. ลากโฟลเดอร์ `D:\Claude_Cowork\rtaf-nurse-web\netlify-deploy\` ทั้งโฟลเดอร์ไปวาง (**ห้ามลากทั้ง repo เดิม** — จะพ่วง apps-script/ ขึ้นเป็นไฟล์ public)
4. ตั้งชื่อ site ที่ Site settings → Change site name (เช่น rtaf-nurse.netlify.app) → copy URL

### Step 5 — เติมค่าที่เหลือ (ตอนนี้มีครบทุกตัวแล้ว)
1. กลับ Apps Script (Step 2) → แก้ `SITE_URL` = Netlify URL จาก Step 4 (ไม่มี `/` ปิดท้าย) → Deploy → Manage deployments → ✏️ → New version → Deploy (**ห้ามลบ deployment เดิมสร้างใหม่ URL จะเปลี่ยน**)
2. กลับ Google Cloud Console (Step 3) → Authorized JavaScript origins → เพิ่ม Netlify URL → Save
3. แก้ `netlify-deploy/js/config.js`: `API_URL` = Web app URL จาก Step 2.8, `GOOGLE_CLIENT_ID` = Client ID จาก Step 3.3
4. กลับ Netlify → ลากโฟลเดอร์ `netlify-deploy/` วางซ้ำอีกครั้งเพื่ออัปเดต deploy (ขั้น "ลากวางเพื่ออัปเดต" ที่ Jed ชอบใช้)

### Step 6 — ทดสอบก่อนปิด GitHub Pages
- [ ] index.html โหลดปกติ
- [ ] register.html สมัครทดสอบ 1 คน → เข้า Pending sheet ใหม่
- [ ] Admin panel login ด้วย Google (GSI) ผ่าน — จุดเสี่ยง error สุดถ้า origins ยังไม่ตรง
- [ ] อนุมัติสมาชิกทดสอบจาก Pending → Members สำเร็จ
- [ ] members.html ค้นหาสมาชิกเดิมเจอ (เช็คว่า 3,512 คนย้ายมาครบ)
- [ ] Logbook เพิ่ม/ค้นหา ทำงานปกติ

### Step 7 — ปิด GitHub Pages (ทำเมื่อ Step 6 ผ่านหมดแล้วเท่านั้น)
- Repo Settings → Pages → Source → None
- อัปเดตลิงก์ที่แจกสมาชิก (โปสเตอร์/กลุ่มไลน์) เป็น URL Netlify ใหม่

## ผลตรวจสอบ
ยังไม่ได้ลงมือ deploy จริง — รอ Jed ทำ Step 1-4 (ต้อง login บัญชีใหม่) ก่อน แล้วกลับมาให้ Cinder ช่วยเช็ค Step 6 ต่อได้

## ป้องกันไม่ให้เกิดซ้ำ
ของเดิม (Sheet 1Z4bYmol5..., GAS เดิม, GitHub Pages) ไม่ถูกแตะเลยในงานนี้ — ถ้า migration มีปัญหากลางทาง fallback กลับไปใช้ของเดิมได้ทันทีโดยไม่กระทบสมาชิก
