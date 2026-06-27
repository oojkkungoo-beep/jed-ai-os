---
title: 🔎 Vera Review: Laura — อัปเดต Model Assignment ทีม
file_type: qa
agent_owner: unspecified
last_updated: 2026-06-12
---

# 🔎 Vera Review: Laura — อัปเดต Model Assignment ทีม

## ผลการตรวจ
- ✅ ความถูกต้อง: Model ที่อ้างถึง (Fable 5, Opus 4.8, Sonnet 4.6, Haiku 4.5) ตรงกับ lineup ปัจจุบัน ไม่มี model ที่ไม่มีจริง
- ✅ ความครบถ้วน: ครอบคลุมทั้ง 11 agent + tool เสริม (Canva/Claude Design, pptx, xlsx, nimble-web-expert) ตรงตามที่ Jed ขอ
- ✅ Format: มีตารางกลาง `team/model_assignment.md` + ปักหมุดสั้นๆ ในแต่ละ team file + ลิงก์จาก CLAUDE.md — อ่านง่าย ไม่ต้องเปิดหลายที่
- ⚠️ Action / ความเป็นไปได้จริง: ข้อมูลนี้เป็น "คำแนะนำ" แต่ระบบยังไม่มีกลไกที่ Laura จะ "สั่ง subagent ด้วย model ที่ระบุจริง" — ต้องผ่าน Agent tool พร้อม `model:` parameter ซึ่งตอนนี้ Laura ยังทำงานแบบ in-context (ไม่ spawn subagent ต่อทุกครั้ง) ดังนั้นตารางนี้จะมีผลจริงเฉพาะเมื่อ Jed/Laura ตัดสินใจ spawn Agent แบบระบุ model เท่านั้น

## คะแนน: A-

## สิ่งที่ต้องแก้
1. **CLAUDE.md เกินเป้า token budget** — เดิม Vera ตั้งเป้า ≤25 บรรทัด ตอนนี้เพิ่มเป็น 28 บรรทัด (เพิ่ม 3 บรรทัด) — ไม่ critical แต่ note ไว้เผื่อรอบ token audit ครั้งหน้า
2. **Mint escalation rule ซ้ำกับ Council's auto-escalate criteria** — `model_assignment.md` บอก Mint escalate → Opus เมื่อ "ลงทุนก้อนใหญ่" แต่ `council.md` ก็มี auto-escalate criteria คล้ายกัน (>1 เดือน, ผลกระทบย้อนกลับไม่ได้) — ควรอ้างอิงไขว้กันให้ชัดว่า Mint ส่งต่อ Council ก่อน ไม่ใช่ "เปลี่ยน model ตัวเอง" (ตอนนี้เขียนกำกวมว่า escalate model หรือ escalate งาน)
3. **Eir's Fable 5 trigger ไม่มี criteria ชัด** — "เฉพาะตอนแต่ง lore/story ยาวๆ" เป็นคำตัดสินใจที่ Eir (หรือ Laura) ต้องเดาเอง ลองเพิ่มตัวอย่างสั้นๆ เช่น "เมื่อ Jed ขอเรื่องเล่า/Quest narrative ที่ยาวเกิน 1 เพจ"

## Recommendation
ส่ง Jed ได้เลย — งานสมบูรณ์และมี structure ที่ดี ข้อ 2-3 เป็น clarification เล็กๆ ที่ทำตอนไหนก็ได้ ไม่ block การใช้งาน ส่วนข้อ 1 ฝาก Sage จดไว้สำหรับ token audit รอบหน้า

---
ส่งต่อ Sage เพื่อเขียน diary วันนี้
