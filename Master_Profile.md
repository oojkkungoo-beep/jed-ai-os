---
title: Master Profile — Jed
type: identity
maintained_by: Laura (อัปเดตทุกครั้งที่เจอ pattern ใหม่จาก feedback ของ Jed)
last_updated: 2026-06-28
status: draft-from-memory — ยังไม่ผ่านการสัมภาษณ์ตรงกับ Jed เต็มรูปแบบ ควร refine เพิ่ม
---

# Master Profile — Jed

ไฟล์นี้คือ "ตัวตน" ของ Jed ที่ทุก agent ในทีมต้องอ่านก่อนเริ่มงาน (ดูกฎใน `CLAUDE.md`) สร้างจาก memory ที่สั่งสมมา ไม่ใช่บทสัมภาษณ์ตรง — อัปเดตต่อเนื่องเมื่อ Jed แก้ไขพฤติกรรม agent ซ้ำๆ (feedback loop)

## อาชีพ / บทบาท
- ทำงานด้านการพยาบาล/สาธารณสุข (เกี่ยวข้องกับ Medic_Station, ห้องพยาบาลองค์กร, งานวิจัยตีพิมพ์วารสารสุขภาพ, ภาวะผู้นำระบบสุขภาพ)
- สร้างและดูแลระบบ AI OS ส่วนตัว (ทีม Laura + 15 agent) เพื่อช่วยทั้งงาน, ธุรกิจ, ชีวิตส่วนตัว
- มีลูกที่กำลังเตรียมสอบเข้า ม.4 โรงเรียนวิทย์ (TU/MWIT/KVIS/วมว/จภ)

## ต้องการให้ AI ช่วยด้านไหน
- Orchestration งานหลากหลายแผนก (กลยุทธ์, การเงิน, สุขภาพ, โค้ด, content, ชีวิตประจำวัน)
- Research เชิงลึกแบบ grounded-with-citation (ไม่เดาให้ดูครบ)
- เขียนโค้ด/ระบบ (dashboard, web app, automation)
- ติดตามความคืบหน้าโปรเจกต์ระยะยาวข้าม session

## Work Style
- สั่งงานสั้นกระชับ ภาษาไทยเป็นหลัก คาดหวังให้ลงมือทำทันทีเมื่อสั่งชัดแล้ว ("ทำเลยครับ") ไม่ต้องถามซ้ำ
- ชอบ agent ที่ delegate ทันทีไม่ดึงงานไว้เอง (Laura เป็น orchestrator บริสุทธิ์)
- ก่อนเริ่มงานใหม่ที่มีคนทำสำเร็จมาก่อน ต้องการ Benchmark Research ก่อนเสมอ (ดู `team/research.md`)
- แก้จุดที่ review เสนอทันทีถ้า token พอ + จะได้ใช้เร็วๆนี้ ไม่ชอบรอ defer

## Hard No's / ข้อห้ามเด็ดขาด
- ห้าม auto-push/commit โค้ดใน jed-ai-os โดยไม่ได้รับคำสั่งชัดเจนจาก Jed
- ห้ามเรียก API ที่มี pay-per-use cost (เช่น OpenAI, Gemini pro) โดยไม่ถามก่อน — ยกเว้น Gemini free tier (gemini-2.5-flash)
- ห้ามตอบโดยไม่ระบุ [Agent] นำหน้าทุกข้อความ ไม่มีข้อยกเว้น
- Laura ต้องใช้คำลงท้ายเพศหญิง (ค่ะ/นะคะ) เสมอ ไม่ใช่ ครับ

## ความคาดหวังต่อทีม Agent
- ทุก agent ต้องแนะนำตัวสั้นๆก่อนตอบ (ไม่ใช่แค่ tag) และอธิบายศัพท์เทคนิคเป็นภาษาง่ายเสมอ
- proactively แนะนำ commit/push เมื่อมีของ untrack สำคัญ หรืองานใหญ่เสร็จ+verify แล้ว ก่อนถาม Jed
- เพิ่ม agent ใหม่ทุกครั้งต้องผ่าน `team/agent_creation_checklist.md` ให้ครบ

## หมายเหตุการอัปเดต
ไฟล์นี้ควร refresh ทุก 3-6 เดือน หรือทันทีที่ Jed แก้ไขพฤติกรรม agent ซ้ำๆ — ถ้าอยากให้แม่นยำขึ้น เสนอให้ Jed ทำ "สัมภาษณ์เต็มรูปแบบ" ผ่าน Laura สักครั้ง (ถามเรื่อง work style/เป้าหมาย/สิ่งที่ชอบไม่ชอบแบบละเอียด) ตาม pattern จาก NotebookLM research (ดู `output/research/2026-06-28-notebooklm-skill-workflow-pipeline.md`)
