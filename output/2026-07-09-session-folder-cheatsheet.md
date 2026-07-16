---
title: Cheat Sheet — เปิด session โปรเจกต์ไหน ที่โฟลเดอร์ไหน
date: 2026-07-09
owner: Laura
type: reference
---

# Cheat Sheet: เปิด session ใหม่ที่โฟลเดอร์ไหน (ให้ Group by project ทำงานถูก)

> หลักการ: แอป Claude จัด "project" ตามโฟลเดอร์ที่ session รันจริง — อยากให้ session ไปโผล่ใน project ไหน ให้เปิด session จากโฟลเดอร์นั้นตั้งแต่แรก (session เก่าย้ายไม่ได้)

## กลุ่มที่มีโฟลเดอร์แยกแล้ว — เปิด session ที่นี่

| Custom group เดิม | เปิด session ที่โฟลเดอร์ | CLAUDE.md เชื่อมทีม |
|---|---|---|
| PJ_ชศพอ_WebApp | `D:\Project\rtaf-nurse-web` | ✅ |
| Meddic_station | `D:\Project\Medic_Station` | ✅ (Cinder เติม 9 ก.ค.69) |
| Medical_Equipment | `D:\Project\Medsupply_Registry` | ✅ (Cinder เติม 9 ก.ค.69) |
| Finance_Traccking | `D:\Project\Jed_Finance_Tracker` | ✅ (Cinder เติม 9 ก.ค.69) |
| งานนิรภัย | `D:\Project\Risk` | ✅ |
| OR_System | `D:\Project\OR_System` | ✅ |
| SAR_OR | `D:\Project\SAR_OR` (ปิดงานแล้ว 9 ก.ค.69) | ✅ |
| STAT_OR_Dashboard | `D:\Project\STAT_OR` | ✅ (Cinder เติม 9 ก.ค.69) |
| Second_brain | `D:\NB_G_Drive\Second_Brain` | ✅ (Cinder เติม 9 ก.ค.69) |

## กลุ่มที่เป็นงานของระบบ Jed_org เอง — เปิดที่ `D:\Claude_Cowork\Jed_org` เหมือนเดิม

| Custom group เดิม | หมายเหตุ |
|---|---|
| Dashboard | dashboard ยังอยู่ใน Jed_org (มีแผนรื้อใหม่ 29 ก.ค.69) |
| Framework | ไฟล์อยู่ `output/decisions/` ใน Jed_org |
| สร้างเลขา | งานสร้าง/ปรับทีม agent = งานของระบบ Jed_org |
| Routine | งานจัดไฟล์/cron ของระบบ |

⚠️ 4 กลุ่มนี้จะรวมกันอยู่ใน project "Jed_org" ก้อนเดียวเสมอ — ถ้าอยากแยกให้เห็นเป็นกลุ่ม ให้คง custom group ไว้สำหรับ session พวกนี้

## กลุ่มที่ยังไม่มีโฟลเดอร์

| Custom group เดิม | ข้อเสนอ |
|---|---|
| AN_Logbook | ตัวแอปจริงอยู่ฝั่งทีม Angie ที่ `D:\Antigravity\Anesth_logbook` (Netlify+Sheets) — ฝั่งทีม Laura ยังไม่มีโฟลเดอร์ ถ้าจะรับมาดูแลต่อ แนะนำสร้าง `D:\Project\AN_Logbook` + CLAUDE.md (มี entry ใน projects.json แล้ว, Vera review 7 บั๊กรอแก้) |

## โฟลเดอร์โปรเจกต์ที่มีอยู่แต่ยังไม่เห็นเป็น group ใน sidebar

`D:\Project\ISBAR`, `D:\Project\OR_Efficiancy_dashboard`, `D:\Project\จัดซื้อ ห้องผ่าตัด`, `D:\Project\ระบบลงทะเบียน Implant Setup 1.0.0`, `D:\Project\ตีพิมพ์วารสารสร้างเสริมสุขภาพไทย` (✅ CLAUDE.md), `D:\Project\วิจัย_ป_เอก_น้องอาร์` (✅ CLAUDE.md), `D:\Project\ปรับปรุง_KM` (✅ CLAUDE.md เพิ่ม 10 ก.ค.69 — เอกสารคุณภาพ QM/QP/SOP/WI กวห.) — เปิด session ที่โฟลเดอร์ของมันได้เลยเช่นกัน

## งานต่อยอด

1. ~~เติม `CLAUDE.md` เชื่อมทีม Laura ให้ 5 โปรเจกต์ที่ยังขาด~~ ✅ เสร็จแล้ว (Cinder, 9 ก.ค.69)
2. สร้างโฟลเดอร์ + CLAUDE.md ให้ AN_Logbook — รอ Jed สั่ง
