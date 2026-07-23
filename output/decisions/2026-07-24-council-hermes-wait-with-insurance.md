---
title: Council — Hermes: รอแบบมีประกัน
file_type: decision_record
agent_owner: Council
date: 2026-07-24
related: 2026-07-24-devil-hermes-claude-comparison.md, output/decisions/ GLM wait decision, project_glm_decision_wait (memory)
---

# ⚖️ Council: Hermes — รอเฉยๆ หรือ รอแบบมีประกัน — 2026-07-24

**คำถาม:** จากผลวิจัย Scout (Hermes 4 โมเดล / Hermes Agent / ออฟไลน์ / VPS เทียบ Claude) + Devil review — ทีมควรทำอะไรกับ Hermes: นำเข้า / pilot / รอเฉยๆ / รอแบบมีประกัน?

## สรุปข้อมูลตั้งต้น (Scout, 2026-07-23)
- **Hermes Agent** (Nous Research, ก.พ. 2026): agent self-hosted โอเพนซอร์ส มี multi-agent orchestration (profiles = SOUL.md/memory/skills/cron แยกต่อ agent), subagent delegation แบบ parallel, Kanban board กลาง, reflection pass สร้าง skill อัตโนมัติ — สร้างทีมแบบทีมลอร่าได้จริงเชิงสถาปัตยกรรม
- **ออฟไลน์:** ได้จริง 100% ผ่าน Ollama แต่เครื่อง Jed ปัจจุบัน (Ryzen 7 4700U, RAM 8GB, ไม่มี GPU แยก) รันได้แค่โมเดลจิ๋ว 1-3B — ใช้งานจริงไม่ได้; Hermes 4.3 36B ต้องการ ~28GB VRAM
- **VPS:** สูตรประหยัด ~$8-25/เดือน (VPS+API — เสียความ private) / สูตร GPU ~$160-250/เดือน (แพงกว่า Claude, ฉลาดน้อยกว่า Opus)
- **ข้อควรระวัง:** ตัวเลขส่วนใหญ่จาก SEO content farm ยังไม่ verify กับ primary source (Devil ข้อ 3)

## 3 มุมมอง
🔴 **Challenger:** ความเสี่ยงแท้จริงคือ vendor concentration (ทั้งระบบแขวนบน Anthropic) โดยไม่มี trigger และไม่มีแผนอพยพ + ritual ประเมินของใหม่รายสัปดาห์กินเวลา 1.5 ชม./วันของ Jed โดยได้คำตอบ "รอ" ซ้ำ (Annie Duke: อย่าสับสน decision quality กับ decision frequency)

🔵 **Strategist:** โลก AI จะมีผู้ท้าชิงใหม่ทุกเดือนตลอดไป — สินทรัพย์ที่มีมูลค่ายืนยาวคือของ portable: persona ทีม (.md), memory, workflow, Second Brain (เป็น .md = portable โดยกำเนิด) ถ้าออกแบบให้ย้ายได้ ผู้ท้าชิงทุกรายกลายเป็น "ปลั๊กใหม่" / เส้นทาง PHI+PDPA จะบังคับ self-host ในที่สุดแต่ไม่ใช่ปีนี้ — รอแล้วได้กำไร (ฮาร์ดแวร์ถูกลง โมเดลเก่งขึ้น)

🟢 **Executor:** ข้อเสนอ Devil 3 ข้อ รวม ~15 นาที ต้นทุนศูนย์ ทำวันนี้จบวันนี้ / pilot Hermes จริงยังไม่ผ่านเกณฑ์ — ไม่มี pain ปัจจุบันที่มันแก้

## มติ
**คำแนะนำ:** **รอ — แบบมีประกัน** (upgrade จาก "รอเฉยๆ")
**เหตุผล:** คำตัดสิน "รอ" เดิมถูกต้อง แต่เงื่อนไข re-entry เดิมเป็น reactive ล้วน ไม่ครอบคลุม vendor risk ซึ่งเป็น worst-case ตัวจริง — อุดรูด้วยต้นทุน 15 นาทีคือ asymmetric bet ที่ดีที่สุด: downside ศูนย์ upside คือระบบรอดในวันแย่ที่สุด

**Action:**
1. **เงื่อนไข re-entry อัปเดต (ใช้ร่วม GLM + Hermes + ผู้ท้าชิงอนาคต):**
   - ชน rate limit บ่อยจนกระทบงาน (เดิม)
   - มีงาน bulk ไม่อ่อนไหวก้อนใหญ่ (เดิม)
   - **ใหม่:** Anthropic ขึ้นราคา/ลดโควตา/เปลี่ยนนโยบายอย่างมีนัยยะ → เปิด pilot ผู้ท้าชิงทันที
   - **ใหม่:** งาน AI + ข้อมูลผู้ป่วย (PHI/PDPA) จริงจัง → พิจารณา self-host (Hermes + Ollama + เครื่อง GPU) เป็นทางเลือกแรก
2. **แผนหนีไฟ 1 หน้า** (Fire Escape Plan) — ดูท้ายไฟล์นี้
3. **กติกากรองผู้ท้าชิง:** รายใหม่ → Laura เช็คกับเงื่อนไข re-entry ก่อน ไม่ trigger = สรุป 3 บรรทัด ไม่เปิดรีวิวเต็ม
4. **Vera fact-check** ตัวเลข Hermes จาก primary source เฉพาะเมื่อ trigger ถูกจุดจริง

---

## 🔥 แผนหนีไฟ 1 หน้า — ถ้าต้องย้ายออกจาก Claude

**หลักการ:** สินทรัพย์ของทีมลอร่าเป็นไฟล์ .md เกือบทั้งหมด = portable โดยกำเนิด ผู้รับปลายทาง (Hermes Agent หรือ agent framework อื่น) ใช้โครงเดียวกัน

| ลำดับ | ของที่ย้าย | ปลายทาง (กรณี Hermes Agent) | หมายเหตุ |
|---|---|---|---|
| 1 | `CLAUDE.md` + `team/laura.md` + `Master_Profile.md` + `Anti-writing.md` | `SOUL.md` + `USER.md` + `AGENTS.md` | แก่นตัวตน + routing + กติกา |
| 2 | `team/*.md` (agent ทั้ง 15) | Profiles (1 profile/agent — SOUL.md แยก) | แปลงโครงไม่ยาก เนื้อหาใช้ตรงๆ |
| 3 | auto-memory (`MEMORY.md` + ไฟล์ memory) | `MEMORY.md` ของ Hermes | โครงเดียวกัน copy ได้เลย |
| 4 | cron 4 ตัว (atlas-daily-reflection, vera-weekly-audit, laura-weekly-ops-review, ฯลฯ) | cron ต่อ profile | ตั้งใหม่ตาม spec เดิม |
| 5 | Second Brain (`D:\NB_G_Drive\Second_Brain\`) | ไม่ต้องย้าย | .md + sync Drive อยู่แล้ว |
| 6 | `output/` + `Index.md` + scripts | ไม่ต้องย้าย (อยู่ใน repo) | agent ใหม่อ่านต่อได้ทันที |

**สมองทดแทน:** เริ่มที่ API ราคาถูก (DeepSeek/Haiku) บน VPS ~$8-25/เดือน → ถ้าเป็นเหตุ PHI ให้ลงเครื่อง GPU 24GB+ รัน Hermes 4.3 36B
**เวลาโดยประมาณ:** 1-2 วันทำการสำหรับ core (ลำดับ 1-3), cron+จูนพฤติกรรม 1-2 สัปดาห์
**อัปเดตแผนนี้เมื่อ:** เพิ่ม agent ใหม่ / เปลี่ยนโครง memory / ผู้ท้าชิงในตลาดเปลี่ยนหน้า
