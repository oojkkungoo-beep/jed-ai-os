---
title: Kanban — บอร์ดงานกลางของทีม Laura
file_type: ops_board
agent_owner: Laura (groom รายสัปดาห์), ทุก agent อัปเดตทันทีเมื่อรับ/จบงาน
last_updated: 2026-07-27
---

# 📌 Kanban — บอร์ดงานกลาง

> **กติกา (ขโมยไอเดียจาก Hermes Kanban — มติ 2026-07-24):**
> 1. agent ตัวไหน**รับงาน**ที่ไม่จบใน session เดียว → เพิ่มการ์ดใน 🔨 Doing ทันที / **จบงาน** → ย้ายไป ✅ Done พร้อมวันที่
> 2. งานที่ติดรอ Jed หรือรอภายนอก → ⏸️ Waiting พร้อมระบุว่ารออะไร
> 3. Laura groom บอร์ดทุกจันทร์ใน weekly ops review (ย้ายการ์ดค้าง, กวาดตกหล่น) / Vera ตรวจทุกอาทิตย์ว่า Doing ไม่ค้างเกิน 2 สัปดาห์
> 4. ✅ Done เก่ากว่า 7 วัน → Lena archive ลง Second Brain แล้วลบจากบอร์ด
> 5. รูปแบบการ์ด: `- [เจ้าของ] งาน — บริบทสั้น (วันที่อัปเดต)`

## 🔨 Doing
- [Laura] เปิดแผน GLM pilot หลัง re-entry trigger จุด — เสนอแผน 2 ชั้นแล้ว รอ Jed ตัดสิน (24 ก.ค.69)

## ⏸️ Waiting
- [Cinder] ย้าย scheduler (diary/atlas/lena digest/vera audit/laura ops-review/backup) **+ Dashboard_Ai** ไปรันบน **home server** — **รอ Jed ติดตั้ง home server ให้เสร็จ** แล้ว migrate SKILL.md 6 ตัวจาก `C:\Users\oojkk\.claude\scheduled-tasks\` ไปเครื่องที่เปิด 24/7 → แก้ uptime gap ถาวร + ให้ Dashboard_Ai (core harness infra) ได้ uptime ฟรี (มติ Jed + Atlas 1 ส.ค.69)
- [Laura] commit ไฟล์ decision Hermes 2 ไฟล์ + ไฟล์ dev ค้าง — **รอ Jed สั่ง** (24 ก.ค.69)
- [Laura] GLM pilot ชั้น 1 (ย้ายงาน routine ไป Sonnet/Haiku) + ชั้น 2 (glm_task.py) — **รอ Jed ตอบ + สมัคร key bigmodel.cn** (24 ก.ค.69)
- [Cinder] STAT_OR — Google Sheet PHI เปิดสาธารณะ — **รอ Jed ตัดสินใจ** (ตั้งแต่ 7 ก.ค.69, CRITICAL)
- [Mint] Jed_Finance_Tracker — deploy แล้ว **รอ Jed กด authorize** GAS
- [Atlas] SAR_OR — checklist พร้อม **รอ Jed หาตัวเลขปี 67-68**

## 📥 Backlog
- [Forge/Cinder] Team metric #1 (token/agent) + #2 (Vera ส่งคืนแก้) — **พักไว้** ยังไม่มีแหล่งข้อมูล (Jed สั่งพอแค่ #3 ก่อน 1 ส.ค.69) ทางเปิดเมื่อพร้อม: #2=ให้ Vera log json ต่อรีวิว, #1=ทำ hook เก็บ token หรือเปลี่ยนเป็น proxy "งาน/agent/สัปดาห์"
- [Forge] Dashboard v2 rebuild — Jed นัดรื้อใหม่ (กำหนดเดิม 29 ก.ค.69)
- [Forge] เว็บ ชศพอ. — migrate GitHub Pages → Netlify (checklist พร้อมแล้ว) *(งานนี้ = ตัวเทียน pilot GLM ได้)*
- [Lena] ปรับปรุง_KM — 98 ไฟล์รอปรับปรุงใน Kanban โฟลเดอร์ของโปรเจกต์ (ทยอย, เอกสารภายใน = ห้ามออกนอก Claude)
- [Laura] อัปเดตแผนหนีไฟ เมื่อเพิ่ม agent/เปลี่ยนโครง memory (standing)

## ✅ Done (7 วันล่าสุด)
- [Atlas] **ยกสถานะ Dashboard_Ai เป็น core harness infrastructure** — มติ `output/decisions/2026-08-01-atlas-dashboard-as-harness-infra.md`: เป็นชั้น observability ของทีม, ต้องรันเสถียร (ผูก home server), Vera ตรวจ health รายสัปดาห์, เป็นบ้านทางการของ team metrics + อัปเดต projects.json entry dashboard (Atlas ผ่าน Laura, 1 ส.ค.69)
- [Vera] **เพิ่มเกณฑ์ audit "นับ tool ต่อ agent"** ใน `team/qa.md` — agent ที่มีเครื่องมือเสริม/skill >5 ตัว flag ทบทวน (กัน harness เป็นถังขยะ) + ตรวจ tool ไม่ถูกใช้ >2 เดือน + เพิ่ม Dashboard_Ai health check เข้า weekly audit, รัน sync_index แล้ว (Vera ผ่าน Laura, 1 ส.ค.69)
- [Forge] **Team metric #3 Cron Health เข้า Dashboard_Ai แล้ว** — ยกระดับ widget cron เดิมใน `dashboard/app.js` ให้ตรวจ "งานที่ควรรันแต่ไม่รัน" (stale) + สรุป `🩺 Cron Health: X/Y ปกติ` เดา cadence รายวัน/สัปดาห์/event-driven แยกถูก ทดสอบกับข้อมูลจริง = 2/5 ปกติ (จับ atlas/vera/lena ที่ log ค้าง 32-37 วันได้) bump `?v=dai-20260801e-cronhealth` (Forge ผ่าน Laura, 1 ส.ค.69) — ยังไม่ commit (รอ Jed สั่ง)
- [Cinder] **Root cause ปัญหา cron หาย 4-5 สัปดาห์ — จบแล้ว** เช็ค scheduler ต้นทางจริง (Claude Code scheduled-tasks): ทั้ง 6 ตัว enabled/cron ถูก/nextRunAt เป็นอนาคต **ไม่มีบั๊กในโค้ด** — สาเหตุคือ local scheduler รันได้เฉพาะตอนเครื่องเปิด แต่เวลาตั้งไว้ตี5/คืนอาทิตย์ (เครื่องหลับ) + ไม่ backfill ย้อนหลัง → ช่วง 17-25 ก.ค. เครื่องปิดยาวเลยหาย 9 วัน (ยืนยันจาก diary/decisions gap + lastRunAt) ระบบคืนชีพเองแล้วตั้งแต่ 27 ก.ค. ทางแก้ถาวร = ย้ายไป home server (ดู Waiting) (Cinder ผ่าน Laura, 1 ส.ค.69)
- [Forge] วางระบบ Kanban + Reflection Pass + Skills layer จากไอเดีย Hermes — ยืนยันเสร็จจริง (CLAUDE.md, team/qa.md, team/skills/ ครบ) ย้ายจาก Doing โดย Laura ops review (27 ก.ค.69)
- [Council+Devil] Hermes ตัดสิน "รอแบบมีประกัน" + แผนหนีไฟ 1 หน้า + เงื่อนไข re-entry 4 ข้อ (24 ก.ค.69)
- [Scout] วิจัย Hermes 4 รอบ (โมเดล/Agent/ออฟไลน์/VPS เทียบ Claude) (23 ก.ค.69)
