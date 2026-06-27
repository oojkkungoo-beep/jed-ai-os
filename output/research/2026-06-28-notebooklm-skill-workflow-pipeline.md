---
title: 🔍 การสร้าง Skill/Workflow/Knowledge Base สำหรับ AI Agent (ผ่าน NotebookLM)
file_type: research
agent_owner: unspecified
last_updated: 2026-06-27
---

# 🔍 การสร้าง Skill/Workflow/Knowledge Base สำหรับ AI Agent (ผ่าน NotebookLM)

## TL;DR
1. เกณฑ์แยก Skill vs Sub-agent: ใช้ Judgment/Reasoning หรือไม่ — step-by-step/if-else ใช้ Skill พอ (80% ของงาน), ต้องวิเคราะห์/ตัดสินใจค่อยใช้ Sub-agent
2. สร้าง sub-agent เยอะเกินไปกินทั้ง context window และ token แม้ไม่ได้ใช้งาน
3. ถ้า delegate งานหลาย agent พร้อมกันต้องสั่ง "in parallel" ชัดเจน ไม่งั้น orchestrator อาจรันแบบ sequential เสียเวลา/token
4. Schema + Index + sub-agent ราคาถูก (เช่น Haiku) คอยแปะ YAML frontmatter ทุกไฟล์ แล้ว Python script sync เข้า index.md กลาง — orchestrator อ่าน index ก่อนไม่ต้องกวาดทุกไฟล์
5. Master_Profile.md (สัมภาษณ์ตัวเอง) + Anti-writing.md (บัญชีดำคำ/พฤติกรรม) ควร always-read ทุกครั้งก่อน AI ทำงาน และอัปเดตต่อเนื่องผ่าน feedback loop

## ข้อค้นพบหลัก
1. **Skill vs Sub-agent:** จุดแบ่งคือ Judgment/Reasoning เคสตัวอย่าง — ย้ายไฟล์ระหว่างโฟลเดอร์ = Skill, อ่านอีเมลแล้วคัดกรองว่าข่าวไหนสำคัญ = ต้องมี Sub-agent
2. **คำเตือนเรื่อง over-engineering:** Skill/Sub-agent/MCP ที่เปิดทิ้งไว้กิน context window ตั้งแต่ยังไม่สั่งงาน (พบกรณีกิน ~9%) ยิ่งเยอะยิ่งเสี่ยง "ลืม" context เก่า (out of context)
3. **Sequential vs Parallel:** ถ้า prompt ไม่ระบุชัด orchestrator อาจเรียก sub-agent ทีละตัวแทนพร้อมกัน ต้องสั่ง "in parallel" ตรงๆ
4. **Schema/Index/Ribby pattern:** sub-agent เล็กรันโมเดลถูกสุด มีหน้าที่เดียวคือแปะ YAML frontmatter (title, file type, agent ที่ดูแล, source, topic) ทุกไฟล์ใหม่ → Python script (ไม่ใช่ AI) sync ข้อมูลจาก frontmatter เข้า index.md กลาง → orchestrator ค้นจาก index ก่อนเสมอ ประหยัด token
5. **Master_Profile.md:** สร้างจากการให้ AI สัมภาษณ์ตัวเอง (อาชีพ, work style, ชอบ/ไม่ชอบ, hard-no's) อัปเดตผ่าน feedback loop (เทคนิค "Mirror" — เทียบ draft AI กับฉบับที่แก้แล้ว หาสิ่งที่แก้บ่อย)
6. **Anti-writing.md:** ไฟล์แยกเก็บคำ/สำนวนที่ห้าม AI ใช้ อัปเดตทันทีที่เจอคำที่รำคาญ

## ข้อควรระวัง
เนื้อหาทั้งหมดเป็นประสบการณ์ส่วนตัวของผู้พูดคนเดียว (1 คนทำสำเร็จ ไม่ใช่ cross-source validation) — pattern เชิงโครงสร้าง (schema/index/skill-vs-subagent) ใช้ได้ทั่วไป แต่รายละเอียดเฉพาะ (ชื่อไฟล์, threshold ตัวเลข) เป็นค่าที่เขาเซ็ตเอง ไม่ใช่สูตรตายตัว

## Recommendation / สิ่งที่นำไปใช้แล้ว
- สร้าง `Master_Profile.md` และ `Anti-writing.md` ที่ root ของ Jed_org แล้ว (draft จาก memory ที่มี ยังไม่ผ่านสัมภาษณ์เต็มรูปแบบ)
- เพิ่มกฎ always-read 2 ไฟล์นี้ + กฎ in-parallel เข้า `CLAUDE.md` แล้ว
- Index.md + Ribby-style frontmatter agent **ยังไม่ทำ** — รอจนกว่าไฟล์ใน team/output จะเยอะกว่านี้ค่อยคุ้ม

## Sources
- NotebookLM notebook "แนวคิดการสร้าง Skill และ Workflow สำหรับ AI Agent" (f03074c8-ff74-4070-8d3e-cff8dc5fed12) — 8 video sources จาก Jed, ผ่าน NotebookLM Deep Research synthesize 3 รอบ
