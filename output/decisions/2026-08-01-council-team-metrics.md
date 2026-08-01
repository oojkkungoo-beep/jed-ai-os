---
title: ⚖️ Council: ทีมควรวัด (observe) อะไรบ้าง — 2026-08-01
file_type: decision
agent_owner: unspecified
last_updated: 2026-08-01
---

# ⚖️ Council: ทีมควรวัด (observe) อะไรบ้าง — 2026-08-01

**คำถาม:** เพื่อปิดช่องว่าง observability ที่ Atlas ชี้จากบทความ "Agent Harness vs. Loop vs. Graph Engineering" — ทีมต้อง "มองเห็น" metric อะไรบ้าง และควรลงทุนแค่ไหน?

🔴 **Challenger:** กับดักคือสร้าง dashboard ใหญ่ที่ดูแลไม่ไหวแล้วร้าง — และการเก็บ metric เองก็เผา token (ชนกฎประหยัด token ของ Jed) ที่อันตรายกว่าคือวัดแล้วไม่มีใครทำอะไรต่อ = vanity metric ถ้าเลือกได้แค่ไม่กี่ตัว ทุกตัวต้องผูกกับการตัดสินใจจริง

🔵 **Strategist:** ระยะ 5 ปีทีมจะมี agent/งานมากขึ้น "วัดไม่ได้ = ปรับปรุงด้วยหลักฐานไม่ได้" จะเป็นเพดานการโต ลงทุน observability ตอนนี้คือวางรากก่อน scale และเป็น one-way benefit: ข้อมูลที่เริ่มเก็บวันนี้ ย้อนไปเก็บของเมื่อวานไม่ได้

🟢 **Executor:** ทำได้จริงถ้า reuse ของเดิม ไม่สร้างใหม่ — Dashboard_Ai (ข้อมูลสด) + AI Limit widget (session/weekly) มีฐานอยู่แล้ว เริ่มแค่ 3 ตัวพอ

**คำแนะนำ: ทำ** — จำกัดเป็น "ชุดเริ่มต้น 3 ตัว" เท่านั้น

| # | Metric | ชั้น | ผูกกับการตัดสินใจ |
|---|---|---|---|
| 1 | token/cost ต่อ agent ต่อสัปดาห์ | Harness | agent ไหนกินงบผิดปกติ → Vera token audit เจาะ |
| 2 | อัตรางานที่ Vera ส่งคืนแก้ | Loop | สูง = loop/prompt ของ agent นั้นหลวม ต้องเสริม grader |
| 3 | cron uptime / งานที่ควรรันแต่ไม่รัน | Harness | ต่ำ = ยืนยันต้องย้าย scheduler ไป home server |

**เหตุผล:** 3 ตัวนี้ครอบ 2 ชั้นที่อ่อนสุด (Harness + Loop) ทุกตัวมี "ถ้าเห็นเลขแย่ → ทำอะไรต่อ" ชัดเจน ไม่มี vanity metric และไม่แตะ Graph ที่ยังไม่ควรทำ

**Action:**
1. (1 สัปดาห์) Forge/Cinder เสียบ 3 metric เข้า Dashboard_Ai ที่มีอยู่ — ห้ามสร้าง dashboard ใหม่
2. (ต่อเนื่อง) Vera ดึง metric #1, #2 เข้า weekly audit เป็นหลักฐานประกอบ

**สถานะ:** Council แนะนำแล้ว — รอ Jed อนุมัติเริ่มลงมือ
**เกี่ยวข้อง:** `team/troubleshooting_by_layer.md`, `output/decisions/` (Atlas review 3 ชั้น)
