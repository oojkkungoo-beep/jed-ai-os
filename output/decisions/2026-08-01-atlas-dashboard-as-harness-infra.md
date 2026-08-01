---
title: 🎯 Atlas: ยกสถานะ Dashboard_Ai เป็นโครงสร้างพื้นฐานของ harness — 2026-08-01
file_type: decision
agent_owner: unspecified
last_updated: 2026-08-01
---

# 🎯 Atlas: ยกสถานะ Dashboard_Ai เป็นโครงสร้างพื้นฐานของ harness — 2026-08-01

## มุมมอง CEO
จากเฟรม 3 ชั้น (Harness/Loop/Graph) หน้าที่ "observability" (มองเห็นว่าระบบทำอะไรอยู่: cost/เวลา/อัตราสำเร็จ) เป็น**แกนของ harness** ไม่ใช่ของตกแต่ง — และตอนนี้ Dashboard_Ai คือที่เดียวที่ทีมมองเห็นตัวเองได้ (เริ่มจาก Cron Health metric #3) จึงต้องเลิกมองมันเป็น "โปรเจกต์เสริมที่ว่างแล้วค่อยทำ" แล้วปฏิบัติกับมันเป็น**โครงสร้างพื้นฐาน**เหมือน memory/ หรือ CLAUDE.md

## คำถามสำคัญ
- ถ้า Dashboard_Ai ล่ม/ข้อมูลค้าง เราจะ "ตาบอด" ต่อสุขภาพทีมทันที — เรายอมให้ของชิ้นนี้เป็น single point of failure โดยไม่มีใครดูแลประจำหรือ?
- เราปฏิบัติกับมันแบบ production (มีคนตรวจ/backup) หรือยังแบบของทดลอง (แก้แล้วลืม)?

## Recommendation: ยกสถานะเป็น **core harness infrastructure** — มีผล 3 ข้อ
1. **ความน่าเชื่อถือเป็นข้อบังคับ** — ข้อมูลที่มันแสดงต้องสด การรันต้องเสถียร ผูกชะตากับ home server เดียวกับ scheduler (เครื่องเปิด 24/7) ไม่ใช่รันเฉพาะตอนเครื่อง Jed เปิด
2. **มีเจ้าของดูแลประจำ** — Vera ตรวจ "Dashboard_Ai health" ใน weekly audit (ข้อมูลค้างไหม/widget พังไหม) เหมือนตรวจ cron
3. **เป็นบ้านทางการของ team metrics** — metric ทีมทุกตัวลงที่นี่ (เริ่ม #3 Cron Health แล้ว) ไม่กระจายที่อื่น

## Action
1. *(24 ชม.)* บันทึกสถานะนี้ใน `projects.json` (entry dashboard) ให้ทีมเห็นตรงกันว่าเป็น core infra — ✅ ทำแล้ว
2. *(รอ home server)* Cinder ผูก Dashboard_Ai ให้รันบน home server คู่กับ scheduler (งานเดียวกับ Waiting เดิม) — เมื่อย้ายเสร็จ Dashboard_Ai ได้ uptime ฟรีทันที
3. *(ต่อเนื่อง)* Vera เพิ่ม "Dashboard_Ai health check" เข้า weekly audit

## เกี่ยวข้อง
`team/troubleshooting_by_layer.md`, `output/decisions/2026-08-01-council-team-metrics.md`
