# ทะเบียนเวชภัณฑ์ — Web App (Google Apps Script + Sheets + Drive)

ระบบทะเบียนเวชภัณฑ์: ลงทะเบียน, สร้าง QR code, logbook (ใช้งาน/เก็บ/ซ่อมบำรุง), เพิ่ม-ลด, รูปเก็บใน Drive
**ไม่มีระบบ login** — ใช้กันในทีมเล็กที่ไว้ใจกัน ใครมีลิงก์แก้ไขได้หมด

## โครงสร้างไฟล์
- `gas/Code.gs` — backend (Apps Script), จัดการ Items + Logbook sheet, upload รูปเข้า Drive
- `gas/index.html` — frontend SPA (vanilla JS) — list/search, ฟอร์มเพิ่ม-แก้, หน้า detail+QR+logbook
- `items_import.csv` — ข้อมูลเก่า 83 รายการจาก Excel แปลง mapping พร้อม import เข้า Sheet ใหม่

## ขั้นตอน Setup (ทำครั้งแรก)

### 1. สร้าง Google Sheet + Apps Script project
1. สร้าง Google Sheet ใหม่ ชื่อ "ทะเบียนเวชภัณฑ์ DB"
2. เปิด **Extensions → Apps Script**
3. ลบโค้ด default ทิ้ง แล้ว copy เนื้อหาจาก `gas/Code.gs` วางแทน
4. สร้างไฟล์ HTML ใหม่ใน Apps Script (File → New → HTML) ชื่อ `index` แล้ว copy เนื้อหาจาก `gas/index.html` วาง

### 2. สร้างโฟลเดอร์ Drive สำหรับรูป
1. สร้างโฟลเดอร์ใหม่ใน Google Drive เช่น "เวชภัณฑ์ - รูปภาพ"
2. คัดลอก Folder ID จาก URL (ส่วนหลัง `/folders/`)
3. แก้ใน `Code.gs` บรรทัด `var DRIVE_FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';` ใส่ ID ที่ได้

### 3. Deploy เป็น Web App
1. ใน Apps Script: **Deploy → New deployment**
2. เลือก type: **Web app**
3. Execute as: **Me** | Who has access: **Anyone** (หรือ Anyone with Google account ถ้าอยากจำกัดแค่คนใน org)
4. กด Deploy → copy **Web app URL** (ลงท้ายด้วย `/exec`)

### 4. ผูก API_URL เข้ากับหน้าเว็บ
1. เปิด `index.html` ใน Apps Script editor อีกครั้ง
2. แก้บรรทัด `var API_URL = '';` ใส่ Web App URL ที่ได้จากขั้นตอน 3
3. Save → Deploy ใหม่ (Deploy → Manage deployments → แก้ deployment เดิม → New version)

### 5. Import ข้อมูลเก่า 83 รายการ
1. เปิด Sheet "ทะเบียนเวชภัณฑ์ DB"
2. สร้าง/เช็คว่ามี sheet ชื่อ `Items` (ระบบจะสร้างให้อัตโนมัติตอนเรียก API ครั้งแรกก็ได้ หรือสร้างมือพร้อม header แถวบนสุด)
3. เปิด `items_import.csv` แล้ว copy ข้อมูลทั้งหมด (ไม่รวม header ถ้า sheet มี header อยู่แล้ว) วางต่อจากแถว header ใน sheet `Items`
4. ⚠️ คอลัมน์ `image_urls` ของข้อมูลเก่ามีลิงก์ Google Photos เดิมอยู่แล้ว — เก็บไว้ใช้ต่อได้ ไม่ต้องอัปโหลดใหม่

### 6. ทดสอบ
1. เปิด Web App URL ในเบราว์เซอร์ → ต้องเห็นรายการเวชภัณฑ์ 83 รายการ
2. กดเข้ารายการ → ต้องเห็น QR code + ปุ่มเพิ่ม logbook
3. ลองสแกน QR ด้วยมือถือ → ต้องเปิดหน้า detail ของรายการนั้นตรง

## การใช้งาน QR Code
- QR แต่ละรายการ encode ลิงก์ `<Web App URL>?id=<item_id>`
- สแกนแล้วเปิดตรงหน้า detail ของเวชภัณฑ์นั้น พร้อม logbook
- แนะนำพิมพ์ QR ติดที่ตัวเครื่อง/กล่อง

## ข้อจำกัดที่ควรรู้
- ไม่มี login → ใครมีลิงก์แก้ไข/ลบได้หมด เหมาะกับทีมเล็กที่ไว้ใจกันเท่านั้น ถ้าทีมโตขึ้นค่อยเพิ่ม RBAC pattern (ดู `memory/knowledge_gas_sheets_webapp.md`)
- "ลบ" รายการจะเป็น soft delete (เปลี่ยนสถานะเป็น "ตัดจำหน่าย") ไม่ลบแถวจริง เพื่อรักษา audit trail
- ถ้าข้อมูลเกิน ~5,000 รายการ ควรทำ server-side pagination เพิ่ม (ตอนนี้ดึงทั้งหมดมา filter ฝั่ง client)
- รูปอัปโหลดผ่านฟอร์มจะ base64 encode ก่อนส่ง — ไฟล์ใหญ่มาก (>5MB) อาจช้า/error ควร resize รูปก่อนถ้าเป็นไปได้

## Deploy เพิ่มเติมในอนาคต
**ห้าม** ใช้ `clasp deploy --deploymentId` (URL จะเสีย) — ถ้าจะใช้ clasp: `clasp push --force` แล้วไปสร้าง new version ผ่าน Apps Script UI เอง (ดู `memory/knowledge_gas_sheets_webapp.md`)
