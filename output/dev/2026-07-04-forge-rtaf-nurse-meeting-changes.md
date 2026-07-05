---
title: แก้เว็บ ชศพอ. ตามมติประชุม 4 ก.ค. 69 — ตัดยศ/ชื่อเดิม/ยกเลิกสมัครออนไลน์/ใบสมัคร Word — Forge
file_type: output_dev
agent_owner: Forge
last_updated: 2026-07-04
---

# แก้เว็บ ชศพอ. ตามมติประชุม 4 ก.ค. 69 — Forge

แก้ทั้งหมดใน **ชุดไฟล์ใหม่** (`netlify-deploy/` + `apps-script-new/รหัส.js`) ตามแผน migration — ระบบเดิมที่รันอยู่ไม่ถูกแตะ

## สิ่งที่แก้ (5 ข้อตามสั่ง)

### 1. หน้าเว็บไม่แสดงยศ (ฐานข้อมูลเก็บยศเหมือนเดิม)
- `js/members.js` — ชื่อบนหน้าค้นหาสาธารณะไม่ join ยศแล้ว, ช่องค้นหาก็ไม่ค้นจากยศ
- `members.html` — หัวตาราง "ยศ ชื่อ นามสกุล" → "ชื่อ (ชื่อเดิม) นามสกุล"
- backend `searchMembers` ตัดยศออกจาก search string

### 2. ชื่อเดิม — หน้าเว็บแสดง "ชื่อใหม่ (ชื่อเดิม1) นามสกุล", DB เพิ่ม 3 คอลัมน์
- Members sheet เพิ่มคอลัมน์: `ชื่อเดิม1` (S/18), `ชื่อเดิม2` (T/19), `นามสกุลเดิม` (U/20)
- GAS: `COL` + `rowToMember` + `updateMember` + `exportMembers` + search รองรับครบ
- มีฟังก์ชัน **`setupOldNameColumns()`** ให้ Jed รันครั้งเดียวใน Apps Script editor เพื่อใส่หัวคอลัมน์
- ค้นหาเจอจากชื่อเดิม/นามสกุลเดิมทั้งหน้า public และ admin

### 3. ยกเลิกรับสมัครออนไลน์ → หน้าคำแนะนำการสมัคร
- `register.html` เขียนใหม่ทั้งหน้า: แบนเนอร์ปิดรับ 30 ก.ย. 69, ขั้นตอน 4 step (โหลดใบสมัคร → กรอก → จ่าย 1,000 บาท → ส่งผ่านตัวแทนรุ่น/อีเมล), นิยามสามัญ/สมทบ, note ให้ถามผ่านตัวแทนรุ่น
- Admin: ถอด section "ใบสมัครรอการอนุมัติ" + `loadPending/approveMember/rejectMember` ออกจาก `admin.js`
- backend action `register`/`approveMember`/`rejectPending` ยังอยู่ (dormant, ไม่มีหน้าเรียก) — เผื่อกลับมาใช้

### 4. ใบสมัคร Word
- `netlify-deploy/docs/RTAF_Nurse_Membership_Form.docx` (A4, TH Sarabun New 16pt, โลโก้กลางบนสุด)
- ฟิลด์: ยศ, ชื่อ(ปัจจุบัน), ชื่อเดิม(1), ชื่อเดิม(2), นามสกุล(ปัจจุบัน), นามสกุลเดิม, รุ่นที่จบ, สถานที่ปฏิบัติงาน, ที่อยู่ปัจจุบัน, เบอร์โทรศัพท์
- checkbox ประเภทสมาชิก (สามัญ/สมทบ พร้อมนิยาม), ค่าสมัคร 1,000 บาท
- ลายเซ็น 3 ช่อง: ผู้สมัคร / ผู้รับเงินค่าสมัคร / ผู้อนุมัติ (2 ช่องหลังอยู่ส่วน "สำหรับเจ้าหน้าที่")
- validate ผ่าน, สคริปต์ generate อยู่ scratchpad (`build_form.js` ใช้ docx-js)

### 5. Admin "+เพิ่มสมาชิก"
- ปุ่ม + modal ฟอร์มตามข้อ 4 ในแท็บจัดการสมาชิก (`admin/index.html`, `admin.js`)
- backend action ใหม่ `addMember` (ตรวจ isAdmin, appendRow 21 คอลัมน์, ID `new-<timestamp>`)
- modal แก้ไขสมาชิกเพิ่มช่องชื่อเดิม 1/2 + นามสกุลเดิม, detail modal แสดงชื่อเดิมด้วย

## Verify แล้ว
- preview local (python http.server จาก netlify-deploy): register.html แสดงครบ, ลิงก์ docx โหลดได้ (200, ~254KB), admin ไม่มี JS error, ฟอร์มเพิ่มสมาชิกครบ 12 ฟิลด์, mock render ชื่อได้ "สมศรี (สมหญิง) ใจดี" ไม่มียศ

## สิ่งที่ Jed ต้องทำตอน migration (เพิ่มจาก checklist เดิม)
1. ตอน paste โค้ด GAS ใหม่ → ใช้ไฟล์ `apps-script-new/รหัส.js` ล่าสุดนี้
2. หลัง paste → รัน **`setupOldNameColumns()`** ใน editor ครั้งเดียว (เพิ่มหัวคอลัมน์ S/T/U)
3. ลากโฟลเดอร์ `netlify-deploy/` ขึ้น Netlify ตาม checklist เดิม (มีโฟลเดอร์ `docs/` เพิ่มมา)

## ยังไม่ได้ทำ (คิวถัดไป)
- SEO ("พยาบาลสี่เหล่า" + Google Search Console) — รอ Netlify URL จริง confirmed
- สคริปต์ cleansing ฐานข้อมูล — รอไฟล์ 2 ชุดจาก Jed
