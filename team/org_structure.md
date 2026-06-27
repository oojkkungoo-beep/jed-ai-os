---
title: โครงสร้างทีม Laura — แบ่งแผนก
file_type: agent_definition
agent_owner: unspecified
last_updated: 2026-06-21
---

# โครงสร้างทีม Laura — แบ่งแผนก

อัปเดต 2026-06-21 — เพิ่ม Cinder (agent ที่ 15) แล้วจัดทุกคนเข้าแผนก พร้อมหัวหน้าแผนก

## หลักการเลือกหัวหน้าแผนก
1. คนที่ **ทำงานนั้นมานานสุด/เป็นเจ้าของโดเมนเดิม** ก่อนมีคนที่สอง (เช่น Forge มาก่อน Cinder)
2. คนที่ **ใช้ model ระดับ reasoning สูงกว่าในกลุ่ม** เมื่องานในแผนกต้องการการตัดสินใจ (เช่น Atlas ใช้ Opus)
3. **Vera (QA) และ Laura (orchestrator) ไม่อยู่แผนกไหน** — ต้องเป็นกลาง เพื่อตรวจสอบ/ประสานทุกแผนกได้โดยไม่มีผลประโยชน์ทับซ้อน (หลักเดียวกับ internal audit ที่รายงานตรงบอร์ด ไม่ใช่ผ่านแผนกที่ตัวเองตรวจ)

## โครงสร้าง

```
Jed (CEO)
  └─ Laura — Chief of Staff / Orchestrator (ไม่อยู่แผนก, ดูภาพรวมทั้งหมด)
       ├─ Vera — QA (ไม่อยู่แผนก, ตรวจสอบทุกแผนกอย่างเป็นกลาง)
       │
       ├─ แผนก Strategy & Decision
       │     หัวหน้า: Atlas
       │     สมาชิก: Council, Devil (opt-in)
       │
       ├─ แผนก Product & Engineering
       │     หัวหน้า: Forge
       │     สมาชิก: Cinder
       │
       ├─ แผนก Research & Content
       │     หัวหน้า: Scout
       │     สมาชิก: Muse
       │
       ├─ แผนก Life & Wellness
       │     หัวหน้า: Nova
       │     สมาชิก: Eir
       │
       ├─ แผนก Knowledge & Memory
       │     หัวหน้า: Sage
       │     สมาชิก: Lena
       │
       └─ Finance — Mint (ไม่มีสมาชิกร่วม รายงานตรง Laura เพราะงานเรื่องเงินต้องแยกความรับผิดชอบชัด ไม่ปนกับแผนกอื่น)
```

## เหตุผลการจับคู่แต่ละแผนก

| แผนก | หัวหน้า | สมาชิก | เหตุผลจับคู่ |
|---|---|---|---|
| Strategy & Decision | Atlas | Council, Devil | ทั้งสามทำงาน "ตัดสินใจเรื่องใหญ่" อยู่แล้วตามกฎ Auto-Escalate เดิม (Council/Atlas เรียก Devil เวลา stakes สูง) |
| Product & Engineering | Forge | Cinder | Build vs Run — Forge สร้างของใหม่ Cinder ดูแลของเดิม คนละจังหวะงานแต่โดเมนเดียวกัน |
| Research & Content | Scout | Muse | Scout หาข้อมูลดิบ → Muse แปลงเป็น content/idea ต่อเนื่องกันเป็นสายงานเดียว |
| Life & Wellness | Nova | Eir | คู่นี้ routing เดิมก็อยู่ติดกันแล้ว (ตาราง/todo ↔ สุขภาพ/ร่างกาย) ของ Jed คนเดียวกัน |
| Knowledge & Memory | Sage | Lena | Lena sync vault รายสัปดาห์ → ส่งสรุปให้ Sage ต่อ diary อยู่แล้วเป็น workflow ที่มีอยู่จริง |

## ผลกับ routing
- งานที่ไม่รู้จะส่งใคร แต่รู้แผนก → Laura ส่งหัวหน้าแผนกก่อน หัวหน้าแผนกตัดสินใจส่งต่อสมาชิกในแผนกเอง
- หัวหน้าแผนกไม่ต้องขอ Laura ทุกครั้งก่อน delegate ให้สมาชิกแผนกตัวเอง (ลด round-trip)
- ข้ามแผนกยังต้องผ่าน Laura เหมือนเดิม

## Maintenance
Vera ตรวจโครงสร้างนี้พร้อมกับ weekly audit (`vera-weekly-audit`) — ถ้าแผนกไหนสมาชิกเกิน 3 คนหรือหัวหน้าแผนกแบกงานข้ามโดเมนอีก ให้ flag ใน audit report
