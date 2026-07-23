---
title: Skills Layer — คลัง skill ที่ทีมสะสมเอง
file_type: reference
agent_owner: Vera (สร้าง/ปรับปรุงผ่าน Reflection Pass), ทุก agent ใช้ได้
last_updated: 2026-07-24
---

# 🧩 team/skills/ — คลัง skill สะสมของทีม

แนวคิดจาก Hermes Agent (มติ 2026-07-24): บทเรียนที่เกิดซ้ำ ≥2 ครั้ง ต้องถูก "แปลงเป็น skill" — ไฟล์ขั้นตอนสำเร็จรูปที่ agent เปิดใช้ได้เลย ไม่ต้องเรียนรู้ใหม่ทุก session

## Format (1 skill = 1 ไฟล์)
```markdown
---
name: kebab-case-slug
description: หนึ่งบรรทัด — ใช้เมื่อไหร่ (ตัวตัดสินว่า agent ควรเปิดไฟล์นี้ไหม)
learned_from: เหตุการณ์/ไฟล์ต้นเรื่อง
owner_agent: agent เจ้าของโดเมน
created: YYYY-MM-DD
---
## Trigger
[สถานการณ์ที่ควรใช้ skill นี้]
## Steps
[ขั้นตอน ทำตามได้เลย]
## Gotchas
[กับดักที่เคยพลาดจริง]
```

## กติกา
1. **เกิดจาก Reflection Pass ของ Vera** (weekly audit อาทิตย์) เป็นหลัก — agent อื่นเสนอได้โดยสร้างไฟล์แล้วให้ Vera ตรวจรอบถัดไป
2. สร้างได้สูงสุด **1-2 skill/สัปดาห์** — กันคลังบวมด้วย skill ที่ไม่ได้ใช้
3. skill ที่ไม่ถูกใช้เกิน 2 เดือน → Vera พิจารณา merge/ลบใน audit
4. บทเรียนประเภท "ห้ามทำ" → เข้า `Anti-writing.md` ไม่ใช่ที่นี่ / ความรู้โดเมนยาว → KB note ใน Second Brain (Lena) — ที่นี่เก็บเฉพาะ **ขั้นตอนที่ทำซ้ำได้**
5. สร้าง/แก้ไฟล์ในนี้แล้ว → รัน `python scripts/sync_index.py` ตาม standing rule
