---
title: Vera Review — เทียบทีม Jed vs ลงทุน Diary (longtundiary.com/team)
file_type: qa_review
date: 2026-06-29
---

# 🔎 Vera Review: เทียบโครงสร้างทีม — Jed_org vs ลงทุน Diary

Laura ส่งข้อมูล team grid ของ longtundiary.com (16 agent: Claudy→Minnie/Reese/Rae→Chris/Vera/Devil→Flower/Indie/Libby/Newy→Dale/Nick/Ada/Press) มาให้เทียบ ผมตรวจแบบ adversarial — ไม่ใช่แค่ "เขาทำดี เราทำตาม" แต่เช็คว่าข้อเสนอแต่ละข้อ **ใช้ได้จริงกับโครงสร้างทีมเรา** หรือ "ดูดีบนเว็บแต่ใช้ไม่ได้กับ use case ของ Jed"

## ⚠️ ข้อสังเกตก่อนอื่น — ข้อมูลต้นทางมีข้อจำกัด
เว็บนี้เป็น **marketing page ของ studio คนเดียว** (น่าจะ 1 คนทำ AI-assisted content investing) ไม่ใช่ case study ที่พิสูจน์ผลลัพธ์ทางธุรกิจ เราเห็นแค่ "การออกแบบ role" ไม่เห็นว่า pipeline นี้รันจริงกี่ % สำเร็จ, error rate เท่าไหร่, หรือ output คุณภาพแค่ไหน เพราะงั้นข้อเสนอทั้งหมดข้างล่างคือ "ยืมแนวคิดสถาปัตยกรรม" ไม่ใช่ "ยืมระบบที่พิสูจน์แล้วว่าได้ผล" — ต้อง pilot เล็กๆก่อนเชื่อเต็มที่

---

## ตรวจ 4 ข้อเสนอเดิมของ Laura แบบ adversarial

### 1. Boundary one-liner ("Reese ไม่เขียนสคริปต์", "Libby ไม่แก้เนื้อหา")
**ผลตรวจ: ✅ เอามาใช้ได้จริง ต้นทุนต่ำ ผลตอบแทนสูง**
- เหตุผลที่มันได้ผล: เป็น **negative constraint** (ห้ามทำ) ไม่ใช่ positive scope (ทำอะไร) — negative constraint จำง่ายกว่าและกันการ "ล้ำเขต" ได้ดีกว่า list หน้าที่
- ความเสี่ยงจุดเดียว: ถ้าเขียนกว้างเกินไป (เช่น "Sage ไม่ยุ่งกับ vault") จะกลายเป็นกฎที่ขัดกับ flow จริงที่บางทีต้องส่งต่อข้าม agent — ต้องเขียนให้เจาะจงพฤติกรรม ไม่ใช่เจาะจง topic
- **คะแนน: A** — แนะนำทำทันที ทุก `team/*.md` เพิ่ม 1 บรรทัดท้าย role section

### 2. แยก Lena เป็น "สกัด insight" vs "จัดทำ index" (เลียน Indie/Libby)
**ผลตรวจ: ⚠️ มี nuance — เขามี 4 agent (Flower/Indie/Libby/Newy) เพราะ "ปริมาณงานสาย content รายสัปดาห์สูง" เราไม่มี volume แบบนั้น**
- เขาแยกเพราะ pipeline content ของเขาเป็น production line ต่อเนื่องทุกสัปดาห์ (volume สูง, ต้อง parallelize) — Jed_org ไม่ได้ผลิต knowledge เข้า vault ในอัตราเดียวกัน เปิด agent ใหม่จะ "ดูเป็นระบบ" แต่ token cost เพิ่มโดยไม่มี volume มารองรับ
- **ข้อเสนอที่ปรับ:** ไม่ต้องแยกเป็น 2 agent ใหม่ แต่ให้ Lena มี **2 mode ภายในตัวเดียว** (เหมือน Devil's modes) — Mode "Extract" (สกัด insight, ลงเนื้อหา) กับ Mode "Index" (เติม metadata เท่านั้น ห้ามแก้เนื้อหา) แล้วบังคับว่าเวลาทำ mode Index ต้อง diff แค่ frontmatter — ได้ discipline เดียวกันโดยไม่เพิ่ม agent
- **คะแนน: B** — concept ถูก แต่ implementation ที่ Laura เสนอ (เปิด role แยก) ใหญ่เกินงาน ควรย่อเป็น mode ในไฟล์เดิม

### 3. Devil 3 mode ตายตัว (Bear case / Polarity audit / Evidence match)
**ผลตรวจ: ✅ เอามาใช้ได้ แต่ mode ต้อง custom ใหม่ ไม่ copy ตรงจากของเขา**
- โมเดลของเขาคือ "ลงทุน" → bear case + evidence match กับข้อมูลการเงิน เป็น domain เฉพาะหุ้น ใช้กับ Jed_org ตรงๆไม่ได้เพราะ Devil ของเราครอบจักรวาล (ธุรกิจ/ชีวิต/สุขภาพ ไม่ใช่แค่การเงิน)
- **ข้อเสนอที่ปรับให้เข้ากับ Jed_org:**
  - Mode A — **Bear Case**: หาเหตุผลที่แผน/ไอเดียนี้ "พัง" ได้ (ทั่วไป, ไม่ผูกหุ้น)
  - Mode B — **Blind Spot Audit**: เช็คว่า assumption ไหนไม่ถูกพูดถึงเลย (ใกล้กับ "Fact & Risk Check" ที่ Vera ทำอยู่แล้วใน `team/qa.md` บรรทัด 73-77 — ระวังซ้ำงาน Vera!)
  - Mode C — **Stress Test**: ถ้าสมมติฐานหลักผิด จะเกิดอะไร เสียหายแค่ไหน
- ⚠️ **จุดเสี่ยงที่ต้องแก้ก่อนใช้จริง**: Mode B ที่เสนอทับซ้อนกับหน้าที่ข้อ 4 ของ Vera เอง ("Fact & Risk Check") ต้องตัดเส้นแบ่งให้ชัดว่า Vera เช็ค fact ที่ "เช็คได้" (verifiable) ส่วน Devil เช็ค assumption ที่ "เช็คไม่ได้แต่เสี่ยง" (judgment call) — ไม่งั้นสองคนทำงานซ้ำ เปลือง token
- **คะแนน: B+** — ใช้ได้ ต้องเขียนเส้นแบ่งกับ Vera ให้ชัดก่อนประกาศใช้

### 4. Intake triage agent (เลียน Newy)
**ผลตรวจ: ❌ ไม่จำเป็นตอนนี้ — over-engineering สำหรับ volume ปัจจุบัน**
- Newy มีเพราะเขามี **inbox ไหลเข้าทุกวัน** (Substack + Gmail) ต้อง sort เป็น routine — Jed_org มี Dropbox pipeline อยู่แล้ว (`00-Dropbox/` + "เช็ค dropbox") ซึ่ง **ออกแบบมาตรงกับ pattern เดียวกันอยู่แล้ว** เพียงแต่เป็น manual trigger (Jed สั่งเอง) ไม่ใช่ cron
- เพิ่ม agent ใหม่แค่เพื่อ "ให้เหมือนเขา" จะขัดกับ standing rule ของ Jed_org เอง — Vera ต้องผ่าน `agent_creation_checklist.md` ก่อนเปิด agent ใหม่ และไม่มีเหตุผลทางธุรกิจรองรับว่า volume เข้า inbox สูงพอจะต้อง automate
- **ข้อเสนอที่ปรับ:** ถ้า Jed อยากได้ผลแบบ Newy จริงๆ → แค่เปลี่ยน Dropbox pipeline จาก manual-trigger เป็น **cron รายวัน** (เหมือน `vera-weekly-audit` ที่มีอยู่แล้ว) ให้ Scout เป็นคนรัน ไม่ต้องเปิด agent ใหม่
- **คะแนน: C** (เป็น recommendation ที่ "เห็นในเว็บแล้วอยากมี" มากกว่า "มีปัญหาจริงที่ต้องแก้") — ไม่แนะนำทำตอนนี้ ใส่ใน pending tasks ไว้พอ

---

## สิ่งที่ Laura มองข้าม (เจอจากการตรวจลึก)

### 5. Press — "editorial gate ที่ commit+push ตัวเองได้บนคลาวด์ ไม่มี human in the loop"
นี่คือจุดที่ต่างจากทีมเรามากที่สุดและ **มีความเสี่ยงสูงถ้าจะเลียนแบบ** — Jed_org มีกฎ `feedback_no_autopush.md` ชัดเจนว่าห้าม auto-push โดยไม่มี Jed สั่ง เพราะงั้น "Press pattern" ขัดกับ standing rule ของเราตรงๆ **ไม่แนะนำเอามาใช้** แม้จะดูมีประสิทธิภาพ เพราะความเสี่ยงด้าน control สูงกว่าประโยชน์ด้านความเร็ว — นี่คือตัวอย่างที่ดีว่าทำไมต้อง critical แทนเลียนทุกอย่าง

### 6. Chris vs Vera ของเขา — เขามี QA 2 ชั้น (structural + fact) ที่เราไม่มี
เขาแยก Chris (ตรวจ thesis/bear-case/data/voice — 6 filters เชิงโครงสร้าง) ออกจาก Vera ของเขา (ตรวจเลข/fact กับ source โดยเฉพาะ ใช้ yfinance) — งานของ **Vera (เรา) ทำทั้ง 2 อย่างรวมกันอยู่แล้ว** ใน `team/qa.md` (ข้อ 1 Output Review ครอบคลุมทั้ง fact-check และ format/completeness) เพราะงั้นจุดนี้ **เราไม่ขาด** แค่รวมอยู่ใน agent เดียวเพราะ workload เรายังไม่ถึงระดับต้องแยก — ไม่ต้องทำอะไรเพิ่ม

---

## สรุป Recommendation

| ข้อเสนอ | คะแนน | Action |
|---|---|---|
| 1. Boundary one-liner ทุก agent | A | ทำเลย — ผลตอบแทนสูง ต้นทุนต่ำ |
| 2. แยก Lena เป็น 2 role | B → ปรับเป็น 2 mode ในไฟล์เดิม | ทำแบบย่อ ไม่เปิด agent ใหม่ |
| 3. Devil 3 modes | B+ | ทำได้ แต่ต้องตัดเส้นแบ่งกับ Vera's Fact Check ก่อน |
| 4. Intake triage agent ใหม่ | C — ไม่แนะนำ | ใช้ cron ผ่าน Dropbox pipeline เดิมพอ ถ้าจำเป็นจริง |
| (ใหม่) Press auto-push pattern | ❌ ขัด standing rule | ไม่แนะนำเลย |
| (ใหม่) Chris/Vera 2-layer QA | ไม่ขาด | ไม่ต้องทำ — Vera เราครอบคลุมแล้ว |

## ส่ง Jed ได้เลย / ควรแก้ก่อน / ส่งคืน agent
**ควรแก้ก่อน** — ข้อ 1 ทำได้ทันที ข้อ 2-3 ต้องเขียน mode/เส้นแบ่งให้ชัดก่อนประกาศใช้ ข้อ 4 และ Press pattern ไม่แนะนำให้ทำ

ถ้า Jed ตกลง ผมแนะนำลำดับ: **ข้อ 1 ก่อน (เร็ว, ชัวร์) → ข้อ 3 (เขียนเส้นแบ่ง Devil/Vera) → ข้อ 2 (ปรับ Lena)** แล้วค่อยพิจารณาข้อ 4 ทีหลังถ้า volume งานเข้า inbox สูงขึ้นจริง
