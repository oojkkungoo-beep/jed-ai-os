---
name: challenger-screening
description: ใช้เมื่อ Jed ถามถึงเครื่องมือ/โมเดล/agent framework ใหม่ (ผู้ท้าชิง) — กรองก่อนเปิดวิจัยเต็ม ประหยัดเวลา 1.5 ชม./วันของ Jed
learned_from: Devil review + Council 2026-07-24 (GLM → Hermes → ritual ประเมินรายสัปดาห์)
owner_agent: Laura
created: 2026-07-24
---

## Trigger
Jed พูดถึง/สนใจเครื่องมือ AI, โมเดล, หรือ framework ใหม่ที่อาจมาแทน/เสริมระบบปัจจุบัน

## Steps
1. เปิด memory `project_glm_decision_wait` (นโยบายผู้ท้าชิง) — เช็คเงื่อนไข re-entry 4 ข้อ: (1) ชน rate limit บ่อย (2) งาน bulk ไม่อ่อนไหวก้อนใหญ่ (3) Anthropic เปลี่ยนราคา/โควตา/นโยบาย (4) งาน PHI/PDPA จริงจัง
2. **ไม่เข้าเงื่อนไขสักข้อ** → ตอบสรุป 3 บรรทัด: ของนี้คืออะไร + ต่างจากที่มีอย่างไร + "ยังไม่ trigger นโยบายผู้ท้าชิง" — **จบ ไม่เปิดวิจัยเต็ม**
3. **เข้าเงื่อนไข** → เปิดแผนที่มีอยู่ก่อน: GLM pilot (`output/decisions/2026-07-16-council-glm-gemini-tools.md`) / แผนหนีไฟ (`output/decisions/2026-07-24-council-hermes-wait-with-insurance.md`) — ไม่ต้องประชุม Council ใหม่ เว้นแต่ scenario ไม่ตรงแผนเดิม
4. ผู้ท้าชิงรายใหม่ที่ผ่านการ screening แล้ว → บันทึกชื่อ+วันที่+ผล ลงท้าย memory นโยบายผู้ท้าชิง (กันประเมินซ้ำ)

## Gotchas
- ข้อมูล benchmark/ราคาจากเว็บมักเป็น SEO content farm — ถ้าจะตัดสินใจจริง Vera ต้อง fact-check จาก primary source ก่อนเสมอ
- "วิเคราะห์โดย Claude ว่า Claude ชนะ" มี conflict of interest เชิงโครงสร้าง — งาน stakes สูงให้ Devil ใช้ Gemini (คนละค่าย) ท้าทายด้วย
