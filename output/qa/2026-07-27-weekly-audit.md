---
title: "Vera Weekly Team Audit — 27 กรกฎาคม 2569"
date: 2026-07-27
type: qa
agent: Vera
status: draft
---

# 🔎 Vera Weekly Audit — สัปดาห์ 13–27 ก.ค. 2569 (ครอบคลุม 2 สัปดาห์ เพราะรอบ 20 ก.ค. หายไป — ดูข้อ 3)

## 1. Token Audit
- **CLAUDE.md**: 53 บรรทัด (จาก 48 เมื่อ 13 ก.ค.) — โตเพราะเพิ่ม section Kanban+Skills+Reflection (24 ก.ค.) จริง ไม่ใช่ bloat ซ้ำซ้อน
- **team/*.md รวม**: 1,601 บรรทัด (จาก 1,524) — โตจาก `team/skills/README.md` + `challenger-screening.md` (ไฟล์ใหม่ 24 ก.ค.) + `model_assignment.md` แก้ไข — มีเหตุผลรองรับทุกจุด
- **knowledge.json**: **`[]` ว่างเปล่าสนิท (2 bytes)** — ไม่ใช่แค่ "ไม่มี entry ใหม่กว่า 30 วัน" แต่ถูกล้างจนไม่เหลือเลย เกิดจาก Lena archive step ที่เพิ่งรันวันนี้ (27 ก.ค.) ตัด entry >30 วันออก 42 รายการแล้วไม่เหลืออะไรเพิ่มเข้ามาเลยตลอดเดือนที่ผ่านมา → สะท้อนว่าไม่มีใคร log knowledge ใหม่เข้าไฟล์นี้เกิน 1 เดือนแล้ว **ควรเช็คกับ Cinder ว่านี่คือพฤติกรรมที่ตั้งใจ (prune ปกติ) หรือ archive script ลบเกินสิทธิ์**
- **session_log.json**: 105KB → **54KB** (ลดลง) และ **team_logs.json**: 257KB → **187KB** (ลดลง) — เป็นเพราะ Lena weekly-vault-digest เพิ่งรันสำเร็จวันนี้เป็นครั้งแรกในรอบหลายสัปดาห์ (ดูข้อ 3) ไม่ใช่เพราะทีมใช้งานน้อยลง

## 2. Role & Skill Fit
- `team/skills/` ใหม่ (README.md + challenger-screening.md, 24 ก.ค.) — format ถูกต้องตาม README เอง ไม่ทับซ้อนบทบาท agent เดิม
- `model_assignment.md` แก้ tier 3 agent + Fable premium (24 ก.ค.) — ไม่พบ role ซ้ำซ้อนใหม่
- ไม่พบ commit ที่ Laura ทำงานเฉพาะทางเองแทนที่จะ delegate ในช่วงนี้

## 3. Workload Balance — 🚨 ปัญหาหลักของรอบนี้: Cron reliability ยังไม่ถูกแก้ และลามมาโดนตัว Vera audit เองแล้ว
- `git log --since="7 days ago"` มีแค่ 3 commits (บันทึกได้ปกติตามกฎ no-autopush ไม่ใช่ตัวชี้วัดโหลดจริง) — ขยายเป็น 14 วันเห็นงานจริงของ Forge (Angie review 17 ก.ค., RTAF schema 16 ก.ค., Kanban system 24 ก.ค.), Council+Devil (Hermes decision 24 ก.ค.), Scout (Hermes research) — กระจายตัวปกติ ไม่มี agent ไหนแบกงานข้ามโดเมนเกิน 2 สัปดาห์
- **หลักฐานไฟล์ชี้ว่าระบบ scheduled-task เงียบเกือบสนิทช่วง ~17–25 ก.ค. (9 วัน):**
  - `output/diary/`: ไฟล์ล่าสุดก่อนหน้าคือ `2026-07-16-wellness.md` แล้วกระโดดไป `2026-07-26.md` — **ขาด 10 วัน**
  - `output/decisions/` (atlas-reflection series): ไฟล์ล่าสุดคือ 15 ก.ค. แล้วกระโดดไป 26 ก.ค. — **ขาด 11 วัน** (ยกเว้น council/devil decision 24 ก.ค. ที่เป็นงานคนละ trigger)
  - `output/dev/`: มีแค่ 1 ไฟล์ในช่วงนั้น (Forge 17 ก.ค.) แล้วเงียบจนถึง 24 ก.ค.
  - Lena weekly-vault-digest (ตาม handoff ของ Lena เองวันนี้): **"digest ไม่ได้รันติดกัน 4 สัปดาห์ (W27–W30 หายไป)"** — ยืนยันจากปากของทีมเองว่าไม่ใช่แค่ diary/Atlas
- **นี่คือรอบที่ 4-5 ติดต่อกัน** ที่ปัญหา cron เดียวกันถูกเจอ (28 มิ.ย., 5 ก.ค., 13 ก.ค. audit+ops-review ทั้งคู่ระบุ "เร่งด่วน — ส่ง Cinder debug ตอนนี้ไม่รอ") — **ไม่มีหลักฐานว่า Cinder เคย debug root cause นี้จริงเลย** (ค้นใน `output/dev/` และ decisions ไม่เจอไฟล์ที่เกี่ยวกับ scheduled-tasks runner)
- **ของใหม่ที่ร้ายแรงกว่ารอบก่อน — ปัญหาลามมาโดนกลไกตรวจสอบเอง 2 ชั้น:**
  1. **`vera-weekly-audit` (cron นี้เอง)** — ไม่มีไฟล์ audit สำหรับรอบ **20 ก.ค.** เลย (มีแค่ 13 ก.ค. แล้วข้ามมา 27 ก.ค. รอบนี้) แปลว่า audit ของสัปดาห์ก่อนไม่ได้เกิดขึ้น
  2. **`laura-weekly-ops-review`** (cron จันทร์ 06:00 ที่ตั้งขึ้นมาเพื่อจับปัญหานี้โดยเฉพาะ) — ไม่มีไฟล์ตั้งแต่ 13 ก.ค. เลย ทั้งที่ควรมีรอบ 20 ก.ค. และ 27 ก.ค. (พรุ่งนี้) — **cron ที่สร้างมาเพื่อ "จับตาว่าระบบตรวจสอบเองทำงานไหม" กลับหยุดทำงานเอง** เป็น failure mode ที่ตลกร้ายและอันตราย เพราะไม่มีชั้นไหนเหลือให้เตือน Jed อัตโนมัติแล้วในช่วง 2 สัปดาห์ที่ผ่านมา
- **สรุป:** ปัญหานี้ไม่ใช่แค่ "จับตา" ได้อีกต่อไป — ผ่านมา 2 สัปดาห์เต็มตั้งแต่ถูกยกระดับเป็น "เร่งด่วน" ครั้งล่าสุด (13 ก.ค.) ยังไม่มีใครแก้ราก และตอนนี้กระทบตัวกลไก QA เองแล้ว 2 ชั้น ต้องรายงาน Jed ตรงๆ ว่านี่ไม่ใช่สิ่งที่ทีม AI แก้กันเองได้อีกต่อไปในรูปแบบเดิม (repeat-and-hope) — ต้องมีคนเช็ค scheduled-task runner จริงๆ (อาจต้องเป็น Jed เองเช็คการตั้งค่า cron ที่ต้นทาง เพราะ Cinder เองก็เป็นหนึ่งใน agent ที่รันผ่าน scheduler เดียวกัน อาจ debug ตัวเองไม่ได้ถ้า scheduler เป็นจุดพัง)

## 4. Reflection Pass — สกัดบทเรียนเป็น skill
- อ่าน diary (26 ก.ค.) + decisions (24, 26 ก.ค.) ของช่วงนี้แล้ว — ไม่พบขั้นตอนใหม่ที่ทำซ้ำได้ ≥2 ครั้ง ที่ยังไม่มีใน `team/skills/`
- ปัญหา cron reliability (ข้อ 3) **ไม่ใช่ skill material** — เป็น infra/execution bug ของ scheduler เอง ไม่ใช่ขั้นตอนที่ agent ลืมทำ จึงไม่เหมาะเข้า `team/skills/` หรือ `Anti-writing.md` (ทั้งสองที่เก็บพฤติกรรม agent ไม่ใช่ infra bug) — ควรอยู่ในรูป escalation ตรงถึง Jed/Cinder แทน
- **ไม่มี skill ใหม่สัปดาห์นี้** (งบ 1-2/สัปดาห์ไม่ได้ใช้ ตั้งใจไม่ฝืน)
- ตรวจ skill เก่า: ทั้ง 2 ไฟล์ใน `team/skills/` อายุแค่ 3 วัน (สร้าง 24 ก.ค.) — ยังเร็วเกินไปที่จะประเมิน merge/ลบ

## 5. Kanban Check
- 🔨 Doing: 2 การ์ด (Laura GLM plan, Forge Kanban system) ทั้งคู่อายุ 3 วัน (24 ก.ค.) — ยังไม่เกิน 2 สัปดาห์ ปกติ แต่การ์ด "Forge Kanban+Reflection+Skills" ดูเหมือนงานเสร็จแล้วจริง (CLAUDE.md/qa.md/team/skills/ มีครบ) — เสนอให้ Forge/Laura ยืนยันแล้วย้ายไป Done
- ⏸️ Waiting: 5 การ์ด ทั้งหมดรอ Jed ตัดสินใจ/สั่ง ถูกต้องตามกติกา ไม่มีอะไรค้างผิดที่
- ✅ Done: 2 การ์ด อายุ 3-4 วัน (23-24 ก.ค.) — ยังไม่ถึงเกณฑ์ 7 วัน archive
- **จุดที่หายไปจากบอร์ด:** action item "ส่ง Cinder debug scheduled-tasks runner" จาก audit 13 ก.ค. **ไม่เคยถูกใส่ในบอร์ดเลย** — นี่คือสาเหตุหนึ่งที่มันหลุดหายไป 2 สัปดาห์ เสนอเพิ่มการ์ดนี้เข้า Doing/Backlog ตอนนี้พร้อมระบุเจ้าของชัดเจน

## 6. Spec Propagation
- Kanban+Skills+Reflection Pass (24 ก.ค.) — ไล่แก้ครบ: `CLAUDE.md` ✅, `team/qa.md` ✅, `team/skills/` ✅ — ไม่มี gap
- model_assignment tier update (24 ก.ค.) — `CLAUDE.md` อ้างอิงไฟล์นี้อยู่แล้ว ไม่ต้องแก้ mapping เพิ่ม ✅

## 7. Ops Review Follow-through
เทียบกับ `output/qa/2026-07-13-weekly-ops-review.md` (ยังเป็นฉบับล่าสุด เพราะ cron จันทร์ไม่รันมา 2 สัปดาห์ — ดูข้อ 3):

| ข้อ | สถานะ | หลักฐาน |
|---|---|---|
| 1. ส่ง Cinder debug ว่าทำไม Lena digest + Vera audit "fire" แต่ไม่ output จริง | **ยังไม่ทำ** (ยกระดับ 2 สัปดาห์ติดโดยไม่มีคนรับ) | ไม่พบไฟล์ debug ใดๆ ใน `output/dev/` หรือ decisions |
| 2. ตัดสิน mapping `projects/`+`content/` เข้า intake Lena | ไม่ทราบสถานะ (ไม่พบหลักฐานใหม่) | `team/librarian.md` ยังไม่ได้เช็คซ้ำรอบนี้ — ต้องยืนยันรอบหน้า |
| 3. ถ่ายรูป NursePant 3 ใบ | **ยังไม่ทำ** | โฟลเดอร์ล่าสุดยังเป็น 28 มิ.ย. — ค้างเกือบ 1 เดือนแล้ว |

## สรุปคะแนนสัปดาห์นี้: **C-**
เนื้อหางาน (token/role/spec/Kanban) เรียบร้อยดี ไม่มี bloat และการเพิ่ม Kanban+Skills เมื่อ 24 ก.ค. propagate ครบถูกต้อง — แต่ปัญหาเดิม **cron reliability** ที่ถูกยกเป็น "เร่งด่วนที่สุด" มาตั้งแต่ 13 ก.ค. (และก่อนหน้านั้นอีกหลายรอบ) ยังไม่มีใครแก้ราก และตอนนี้ลามมาโดนกลไกตรวจสอบของทีมเอง (Vera audit เองพลาดรอบ 20 ก.ค., Laura ops-review หายไป 2 สัปดาห์) — สถานการณ์แย่ลงกว่าเดิม ไม่ใช่คงที่

## Action Items
1. **[เร่งด่วนสุด — รายงาน Jed ตรง]** ระบบ scheduled-task ของทีมมีปัญหาข้ามมา 4-5 สัปดาห์แล้ว ล่าสุดกระทบตัวกลไก QA เอง (Vera audit พลาดรอบ 20 ก.ค., Laura ops-review หายไป 2 สัปดาห์ติด) — การ "ส่ง Cinder debug" ที่เสนอมา 2 รอบก่อนหน้ายังไม่เกิดขึ้นจริง เสนอให้ Jed เช็คการตั้งค่า cron/scheduled-task ที่ต้นทางเอง เพราะ agent ในระบบเดียวกันอาจ debug จุดพังของตัวเองไม่ได้
2. เพิ่มการ์ด "debug scheduled-tasks runner" เข้า Kanban.md ทันที (หลุดหายไปจากบอร์ดตั้งแต่ 13 ก.ค. เป็นส่วนหนึ่งที่ทำให้ลืม)
3. เช็คกับ Cinder/Lena ว่า `knowledge.json` เหลือ `[]` เป็นพฤติกรรม archive ปกติ หรือ script ลบเกินสิทธิ์
4. ยืนยันการ์ด Kanban "Forge Kanban system" ว่าเสร็จจริงแล้ว → ย้ายไป Done
5. ค้างจาก Jed โดยตรง (ไม่ใช่งาน AI team): ถ่ายรูป NursePant 3 ใบ (ค้างเกือบเดือน), ตัดสิน mapping projects/content เข้า Lena intake
