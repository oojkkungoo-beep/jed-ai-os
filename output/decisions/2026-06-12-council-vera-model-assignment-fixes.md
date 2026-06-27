---
title: ⚖️ Council: ข้อแก้ไขที่ Vera เสนอ (Model Assignment) — 2026-06-12
file_type: decision
agent_owner: unspecified
last_updated: 2026-06-12
---

# ⚖️ Council: ข้อแก้ไขที่ Vera เสนอ (Model Assignment) — 2026-06-12

**คำถาม:** ควรแก้ 3 จุดที่ Vera เสนอ (CLAUDE.md เกิน budget, Mint/Council escalate ซ้ำ, Eir Fable 5 criteria ไม่ชัด) เลยไหม หรือปล่อยไว้ก่อน?

🔴 **Challenger:** ทั้ง 3 จุดเป็น "ความคลุมเครือ" ไม่ใช่ "ความผิด" — ถ้าไม่แก้ตอนนี้ ก็ไม่มีอะไรพังทันที แต่จุดที่ 2 (Mint/Council escalate ซ้ำ) เสี่ยงสุด เพราะถ้า Laura งง ว่า "Mint ต้องเปลี่ยน model เอง" หรือ "ส่งงานไป Council" จะทำให้ workflow การตัดสินใจใหญ่สับสนตอนใช้งานจริง

🔵 **Strategist:** มองภาพรวม — เอกสารพวกนี้คือ "ของใหม่ที่ยังไม่ผ่านการใช้งานจริง" การไปไล่ปรับ wording ตอนนี้อาจ optimize ผิดที่ (premature polish) ดีกว่ารอดูว่าจริงๆ Laura ใช้งาน escalate logic บ่อยแค่ไหน แล้วค่อยแก้ตามของจริง ส่วนเรื่อง CLAUDE.md เกิน 3 บรรทัด — ไม่ใช่ปัญหาเชิง strategy เลย เป็นแค่ housekeeping

🟢 **Executor:** ทำได้จริงและเร็วมาก ทั้ง 3 จุดแก้ได้ในไม่กี่นาที:
- จุด 2 (Mint↔Council) คุ้มแก้เดี๋ยวนี้ — แค่เปลี่ยน wording ให้ชัดว่า "Mint ส่งต่อ Council ตัดสินใจ ไม่ใช่เปลี่ยน model ตัวเอง" ป้องกันความสับสนตั้งแต่ต้น ต้นทุนต่ำมาก
- จุด 3 (Eir/Fable 5) เพิ่มตัวอย่าง 1 บรรทัดก็พอ ไม่ต้องคิดมาก
- จุด 1 (CLAUDE.md เกิน budget) — เป็น cosmetic, รอรวมกับ token audit รอบหน้าได้ ไม่ต้องรีบ

**คำแนะนำ:** ทำ (เฉพาะจุด 2-3) / รอ (จุด 1)
**เหตุผล:** จุด 2-3 เป็นความชัดเจนเชิง logic ที่ป้องกันความสับสนได้ ต้นทุนแก้ต่ำมาก ควรทำให้จบเลย ส่วนจุด 1 เป็นแค่ housekeeping เรื่อง token budget ไม่กระทบการทำงาน รวมไว้กับ token audit รอบหน้าของ Vera คุ้มกว่าทำแยก

**Action:**
1) แก้ `team/finance.md` + `team/model_assignment.md` ให้ชัดว่า Mint escalate = ส่งงานต่อ Council ไม่ใช่เปลี่ยน model ตัวเอง
2) เพิ่มตัวอย่าง criteria สั้นๆ ใน `team/wellness.md` ว่าเมื่อไหร่ Eir ใช้ Fable 5
3) จุด CLAUDE.md — Sage/Vera note ไว้รวมกับ token audit รอบหน้า (ไม่ต้องทำตอนนี้)
