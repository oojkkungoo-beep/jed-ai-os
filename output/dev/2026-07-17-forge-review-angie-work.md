---
title: ตรวจ+ซ่อมงานที่ Angie ทำต่อ (17 ก.ค.69) — Forge
file_type: output_dev
agent_owner: Forge
last_updated: 2026-07-17
---

# ตรวจงานที่ Angie ทำต่อระหว่าง Jed ติดลิมิต — Forge

## สิ่งที่ Angie ทำสำเร็จ (commit แล้ว 4 ตัว + working tree)
- `61763f9` Admin Audit Log sheet + log ทุก modify action (44 ไฟล์ — รวมงาน schema frontend ของ Forge เข้า HEAD ด้วย)
- `79c4f10` PWA manifest + service worker + app icon
- `0aa1986` ปรับ style dashboard/headers
- `0b12187` SEO: sitemap.xml + robots.txt (+ google099047244986c67a.html = Search Console verification)
- **ตั้ง clasp auto-deploy สำเร็จ**: apps-script/.clasp.json ชี้ GAS project ใหม่ (scriptId 16gRI22...),
  deploy.ps1 ทั้งสองโฟลเดอร์ใช้ deployment id ใหม่ `AKfycbwpbCf...` — ไม่ต้อง paste มือแล้ว
- **netlify-deploy/js/config.js ชี้ API ใหม่ + OAuth Client ID ใหม่แล้ว** → Netlify = ระบบหลักจริง
- Export xlsx 3 แบบ (ใบเซ็นชื่อกิจกรรม / รายชื่อทั้งหมด / ตามตัวกรอง) แบ่ง sheet ตามรุ่น + โลโก้ + จัด format
- Rework backend เข้า schema 17 คอลัมน์ (ทับของ Forge เดิม แต่ semantic เดียวกัน ชื่อ COL ต่าง:
  FNAME=ชื่อแรก, OLD_FNAME1=ชื่อ2, OLD_FNAME2=ชื่อ3, LNAME=นามสกุลแรก, OLD_LNAME=นามสกุล2, OLD_LNAME2=นามสกุล3)

## บั๊กที่ Forge พบใน working tree ของ Angie และแก้แล้ว (17 ก.ค.)
1. addMember + updateMember **ทิ้ง lname3 (นามสกุล3)** — ข้อมูลหายตอนเพิ่ม/แก้ → เพิ่ม COL.OLD_LNAME2
2. updateMember ไม่รับ data.id → **แก้เลขที่สมาชิกใน modal ไม่ติด** → เพิ่ม [COL.ID, data.id]
3. `setupOldNameColumns()` ค้างอยู่กับ index ใหม่ — ถ้าเผลอรันจะ**เขียนทับหัวคอลัมน์ ชื่อ2/ชื่อ3/นามสกุลแรก** → ลบทิ้ง
4. Export: display name ฝั่งนามสกุลไม่ดูนามสกุล3 + filter query ไม่รวมนามสกุล3 → แก้
5. getStats ไม่มี field `members` (สามัญ+สมทบ) → หน้าแรกโชว์ยอดรวมคนไม่เป็นสมาชิก ~3,700 → เพิ่มกลับ
6. ลำดับ (คอลัมน์ B) ตอน addMember/approveMember ใช้ lastRow รวมทั้งฐาน → แก้เป็นนับต่อรุ่น (_nextOrderForGen)
7. rowToMember fallback เดาเลขแถวจาก "ลำดับ" (ผิด เพราะลำดับนับแยกรุ่น — เสี่ยงชี้แถวผิด) → ตัดทิ้ง
8. API เพิ่ม `order` (ลำดับในรุ่น) ให้หน้าเว็บแสดงคอลัมน์ลำดับถูก (เดิม fallback เป็น index)

## Sync ชุด root (mirror ของ netlify-deploy ตามแนวของ Angie)
apps-script/รหัส.js, js/ui.js, js/admin.js, js/home.js, members.html, register.html — ยกเว้น **js/config.js ยังชี้ API เก่า**
(GH Pages live = เวอร์ชันที่ push ล่าสุด ยังเป็น fallback เดิม การแก้ local ไม่กระทบจนกว่าจะ push)

## Verify แล้ว
node --check ผ่านทั้ง 2 backend / preview + mock: ตาราง admin (ลำดับในรุ่น, ชื่อเทา 2 จุด), ปุ่ม export 3 ปุ่ม,
update payload ครบ (row_num, expect_fname1, id, lname3, note), ไม่มี JS error

## Cutover เสร็จสมบูรณ์ (17 ก.ค.69 — คำสั่ง Jed "ปิดเลย")
- ✅ **ปิด GitHub Pages แล้ว** ผ่าน `gh api -X DELETE .../pages` (ยืนยัน 404)
- ✅ **Deploy backend ชุดแก้บั๊กขึ้น GAS แล้ว** (deploy.ps1 → version @18, @19) — ตรวจ live API ผ่าน:
  getStats มี members=2,780 (สามัญ 2,743 + สมทบ 37) / total 3,659 / 79 รุ่น
- ✅ **พบ+ซ่อม data corruption**: คอลัมน์เลขที่ถูก Sheets ตีความเป็นวันที่ ("19-01" → 2026-01-19)
  → เพิ่ม `fixTextColumns()` (เขียน display value กลับเป็นข้อความ + format @ กัน re-parse)
  รันผ่าน API action `fixTextColumns` ซ่อม 3,659 แถว ทั้งคอลัมน์เลขที่ (C) และเบอร์โทร (P) — ตรวจแล้ว id กลับเป็น "19-01"
- ✅ อัปเดต CLAUDE.md: สถานะ MIGRATED, URLs ชุดใหม่, Deploy Flow ใหม่ (clasp deploy.ps1 + Netlify drag-drop)

## ค้างฝั่ง Jed
- **ลาก `netlify-deploy\` ขึ้น Netlify อีกรอบ** (frontend ชุดแก้ล่าสุด: order/ลำดับในรุ่น, สีเทาชื่อเดิม ฯลฯ)
- อัปเดตลิงก์ที่แจกสมาชิก (โปสเตอร์/กลุ่มไลน์) → https://rtaf-nurse.netlify.app
- สั่ง commit เมื่อพร้อม (งานใน working tree ยังไม่ commit ตามกฎ)
- ใน Sheet: แก้หัวคอลัมน์ B "รุ่นที่"→"ลำดับ" + unmerge เซลล์ที่อยู่/เบอร์โทรบางแถว (ค้างจากรอบก่อน)
