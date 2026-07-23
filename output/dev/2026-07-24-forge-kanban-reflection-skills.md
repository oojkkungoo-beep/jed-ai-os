---
title: Forge — Kanban + Reflection Pass + Skills Layer (ขโมยไอเดียจาก Hermes)
file_type: dev_log
agent_owner: Forge
date: 2026-07-24
related: 2026-07-24-council-hermes-wait-with-insurance.md
---

# 🔨 Forge: นำ 3 ไอเดียจาก Hermes Agent เข้าทีมลอร่า (โดยไม่ย้ายบ้าน)

## บริบท
Scout วิจัย Hermes แล้วชี้ 2 ไอเดียที่ "หยิบมาใช้ได้เลย" — Jed สั่ง "ทำเลย" + วิเคราะห์และทำให้ทีมเป็นแบบนั้น → ขยายเป็น 3 ชิ้นที่ต่อกัน

## Hermes ทำอย่างไร → ทีมลอร่าทำอย่างไร
| Hermes Agent | ทีมลอร่า (ที่สร้างวันนี้) |
|---|---|
| Kanban board กลาง (durable, ข้าม profile) | `Kanban.md` ที่ root — Doing/Waiting/Backlog/Done + กติกาอัปเดตอัตโนมัติ |
| Layer 2: `~/.hermes/skills/` (SKILL.md ต่อ skill) | `team/skills/` + README (format + กติกาคุมจำนวน) |
| Layer 3: Reflection pass สกัด skill อัตโนมัติ | ขั้นที่ 4 ใน Vera weekly audit cron |

## สิ่งที่สร้าง/แก้ (6 จุด)
1. **`Kanban.md`** (ใหม่) — บอร์ดกลาง 4 คอลัมน์ ลงงานค้างจริงของทีมแล้ว (STAT_OR, Finance authorize, SAR, GLM pilot ฯลฯ)
2. **`team/skills/README.md`** (ใหม่) — นิยาม format + กติกา 5 ข้อ (คุมไม่ให้คลังบวม)
3. **`team/skills/challenger-screening.md`** (ใหม่) — skill แรก สกัดจาก Council 24 ก.ค. (กรองผู้ท้าชิงก่อนเปิดวิจัยเต็ม)
4. **`vera-weekly-audit` cron** — เพิ่มขั้น Reflection Pass (สกัด skill) + Kanban Check
5. **`laura-weekly-ops-review` cron** — เพิ่มเฟส 2.5 Groom Kanban
6. **`CLAUDE.md` + `team/qa.md`** — เอกสารกำกับระบบใหม่ + sync_index (131 ไฟล์)

## ทำไมไม่ทำมากกว่านี้ (ขอบเขตที่จงใจไม่ข้าม)
- **ไม่ทำ reflection แบบ real-time ทุก session** — แพง token + ซ้ำ ให้เกาะ weekly audit ที่มีอยู่แล้ว
- **คุมจำนวน skill 1-2/สัปดาห์** — กัน anti-pattern คลัง skill บวมด้วยของไม่ได้ใช้ (บทเรียนจาก memory ที่เคยบวม)
- **Kanban เป็น .md ไม่ใช่ DB/tool** — portable, อยู่ใน git, agent อ่าน/แก้ได้ด้วยเครื่องมือเดิม ไม่เพิ่ม dependency

## Verify
- sync_index ผ่าน (129→131 ไฟล์)
- ยังไม่ commit (รอ Jed สั่ง ตาม no-autopush)
- รอบ cron จริงรอบแรก: Vera อาทิตย์ 26 ก.ค. (Reflection Pass) / Laura จันทร์ 27 ก.ค. (Groom Kanban)
