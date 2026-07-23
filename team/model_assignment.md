---
title: Model Assignment — ทีม Laura
file_type: agent_definition
agent_owner: unspecified
last_updated: 2026-07-23
---

# Model Assignment — ทีม Laura

อัปเดตตาม Claude model lineup ปัจจุบัน: **Fable 5** (`claude-fable-5`), **Opus 4.8** (`claude-opus-4-8`), **Sonnet 5** (`claude-sonnet-5`), **Haiku 4.5** (`claude-haiku-4-5-20251001`)

> หมายเหตุ: Claude Code "Fast mode" (Opus เร่งความเร็ว) ใช้ /fast — ไม่ใช่การลดรุ่น

## ตารางสรุป

| Agent | งานหลัก | Model แนะนำ | เหตุผล |
|---|---|---|---|
| **Laura** (orchestrator) | routing, งานเล็ก/ด่วน | **Sonnet 5** | สมดุล เร็ว พอสำหรับ routing + งานสั้น |
| **Muse** (idea/content) | เขียน content, storytelling, idea card | **Sonnet 5** (default: draft, brainstorm, idea card) → **Fable 5** เฉพาะชิ้นสำคัญ | Fable กินโควตา ~2× Opus (~3× Sonnet) — สงวนไว้เฉพาะ content ที่จะเผยแพร่จริง/storytelling ยาวที่โทนเสียงต้องเป๊ะ งานคิด/ร่างทั่วไป Sonnet เหลือเฟือ (ปรับ 2026-07-23 เพื่อความคุ้มค่า) |
| **Atlas** (CEO coach) | strategy, big-picture decision | **Opus 4.8** | reasoning เชิงลึก หลายมุมมอง ต้อง challenge assumption |
| **Nova** (life/health schedule) | todo, calendar, ตาราง | **Haiku 4.5** | งาน routine/structured ไม่ซับซ้อน เร็ว ประหยัด |
| **Eir** (wellness) | สุขภาพ + RPG narrative | **Sonnet 5** | ต้องแม่นยำเชิงวิชาการพยาบาล แต่ก็มี narrative — Sonnet ครอบคลุมทั้งสอง; ใช้ **Fable 5** เฉพาะตอน Jed ขอเรื่องเล่า/Quest narrative ยาวเกิน 1 หน้า (ดูตัวอย่างใน `wellness.md`); escalate → **Opus 4.8** เฉพาะบทสนทนาอ่อนไหว/ประเมินซับซ้อน (เช่น burnout, ภาระใจ, ตัดสินใจสุขภาพสำคัญ — เพิ่ม 2026-07-23 หลังบริบท 16 ก.ค.) |
| **Scout** (research) | ค้นคว้า วิเคราะห์ | **Sonnet 5** | ทำงานคู่กับ Nimble search ได้ดี ไม่ต้องการ reasoning ระดับ Opus ปกติ |
| **Council** (decision chamber) | ตัดสินใจใหญ่ 3 มุมมอง | **Opus 4.8** | ต้องวิเคราะห์ลึก + trade-off หลายชั้น |
| **Forge** (dev — Build) | สร้างฟีเจอร์ใหม่/ระบบใหม่ | **Sonnet 5** (default); escalate → **Opus 4.8** เฉพาะออกแบบสถาปัตยกรรม/ระบบใหม่ทั้งก้อน | Sonnet เร็ว+แม่นพอสำหรับ feature ทั่วไป; งานวางโครงสร้างระบบใหม่ที่ตัดสินใจผิดแล้วแก้แพง ใช้ Opus (ต้องระบุขอบเขตตามกฎ Opus ด้านล่าง) — Opus 4.8 คือ coding model ที่แข็งสุดใน lineup ปัจจุบัน |
| **Cinder** (dev — Run) | bug fix, deploy, backup, maintenance ของระบบเดิม | **Haiku 4.5** (งาน routine ตามสูตร: รัน `sync_index.py`, archive log, backup check) → **Sonnet 5** (bug fix / deploy / แตะโค้ดจริง) | งาน ops ที่มีขั้นตอนตายตัวใช้ Haiku ประหยัด; งานที่ต้องอ่านโค้ดคนอื่นแม่นพอจะไม่ทำพังใช้ Sonnet |
| **Mint** (finance) | budget, P&L, ROI | **Sonnet 5** | งาน routine financial calc ใช้ Sonnet พอ — ถ้าเป็นการลงทุนก้อนใหญ่/ผลกระทบระยะยาว Mint **ส่งงานต่อ Council** (ซึ่งใช้ Opus 4.8) ไม่ใช่เปลี่ยน model ตัวเอง |
| **Sage** (memory/diary) | diary, memory update, log | **Sonnet 5** | ต้อง synthesize ข้อมูลทั้งวันให้สรุปดี — Haiku อาจตกรายละเอียด |
| **Vera** (QA) | review output, skill dev, token audit | **Sonnet 5** (escalate → Opus 4.8 สำหรับ token/skill audit ใหญ่) | งาน review ทั่วไปใช้ Sonnet, audit เชิงลึกใช้ Opus |
| **Devil** (adversarial review) | bear case, polarity audit, evidence match | **ตรงข้ามกับ agent ต้นทาง** — งานจาก Sonnet-tier (Muse/Scout/Mint ฯลฯ) ใช้ **Opus 4.8**; งานจาก Council/Atlas (Opus) ใช้ **Sonnet 5 + `scripts/gemini_review.py` (ฟรี)** | ต้อง "คนละสมอง" จริง — เดิมใช้ Fable 5 ตรวจงาน Opus ซึ่งเผาโควตาแพงสุด เปลี่ยนเป็น Sonnet + Gemini (คนละ provider จริงๆ และฟรี) ได้ผล cross-check ที่อิสระกว่าด้วยซ้ำ (ปรับ 2026-07-23) |
| **Lena** (vault librarian) | intake, organize, cross-link, weekly digest | **Haiku 4.5** (Intake/Organize) → **Sonnet 5** (Synthesize/Weekly Digest) | งาน routine structured ใช้ Haiku ประหยัด; weekly digest ต้องการ judgment ใช้ Sonnet |

## เครื่องมือใหม่ที่ควรเพิ่ม

### 🎨 Claude/Canva Design (MCP: `mcp__...__canva*`)
- มีต่อให้ใช้แล้วในระบบ (generate-design, create-design-from-brand-template, export-design ฯลฯ)
- **Muse**: ใช้ทำ visual draft ของโพสต์/สไลด์ ต่อจาก content draft ได้ทันที (ไม่ต้องส่งงานออกไปทำ design ที่อื่น)
- **Atlas**: ใช้ทำสไลด์สรุป decision/strategy เวลาต้อง present ให้ทีม/partner

### 📊 pptx / xlsx skills (`anthropic-skills:pptx`, `anthropic-skills:xlsx`)
- **Mint**: ใช้ xlsx skill ทำ financial model/budget เป็นไฟล์ spreadsheet จริง แทนตาราง markdown
- **Muse / Atlas**: ใช้ pptx skill แปลง Idea Card / Council decision เป็น slide deck จริง

### 🌐 nimble:nimble-web-expert
- **Scout**: ใช้แทน/เสริม nimble:search เวลาต้อง scrape ข้อมูลเฉพาะ (ราคา, listing, ข้อมูลเชิงลึกจากหน้าเว็บ) ไม่ใช่แค่ค้นทั่วไป

### ✨ Gemini API (`scripts/gemini_*.py`) — ต้องตั้ง `GEMINI_API_KEY` ใน `.env` ก่อนใช้ (ดู `.env.example`)
- **Devil**: `scripts/gemini_review.py` — adversarial review (Mode A/B/C) จาก provider อื่นจริงๆ (ไม่ใช่แค่ Claude คนละรุ่น) ดู `team/devil.md`
- **Scout**: `scripts/gemini_video.py` — ถอด transcript + วิเคราะห์วิดีโอ (YouTube/local file) ดู `team/research.md`
- **Model**: default = `gemini-2.5-flash` (มี free tier ใช้งานได้จริง) — **ห้ามใช้ `gemini-2.5-pro`** ติด quota=0 บน free tier (ต้องเปิด billing แยก)
- **Cost**: Gemini subscription รายปีของ Jed (gemini.google.com) **เป็นคนละระบบกับ Gemini API** — API ใช้ free tier ของ `gemini-2.5-flash` ได้โดยไม่ต้องผูกบัตร เรียกได้โดยไม่ต้องถามทุกครั้ง แต่ถ้าจะใช้ `gemini-2.5-pro` ต้องเปิด billing ก่อน → ต้องถาม Jed (เหมือน OpenAI ดู [[feedback_api_cost_confirm]])

### 🛠 Debug/Programming skills (`karpathy-guidelines`, `verify`, `run`, `code-review`, `security-review`) — เพิ่ม 2026-07-01
- **Cinder**: ขาดสกิลเหล่านี้มาตั้งแต่สร้าง — `karpathy-guidelines` (surgical fix, ไม่ over-fix), `verify` (รันแอพจริงยืนยันว่า fix ใช้ได้ แทนคำสั่งลอยใน "กฎการทดสอบ"), `run` (launch/drive แอพ), `security-review` (ก่อน push โค้ดแตะ input ภายนอก) ดู `team/cinder.md`
- **Forge**: ช่องว่างเดียวกัน (เขียนโค้ดใหม่แต่ไม่เคยอ้างสกิลจริง) — เพิ่ม `karpathy-guidelines`, `code-review`, `security-review` ดู `team/forge.md`

### 🧠 anthropic-skills:consolidate-memory — เพิ่ม 2026-07-01
- **Sage**: ใช้พ่วงกับ Memory Update เป็นระยะ เพื่อ merge/prune memory ล้าสมัยจริงจัง ไม่ใช่แค่ "เขียนเพิ่ม" อย่างเดียว ดู `team/memory_agent.md`

### 🔬 World-Class Skill Audit รอบลึก — เพิ่ม 2026-07-03 (Vera, สั่งโดย Jed ผ่าน Laura)
audit ทั้ง 14 agent เทียบ real-world benchmark ปัจจุบัน (2025-2026) + cross-ref กับสกิลจริงในระบบ — สรุปการเพิ่มต่อ agent (report เต็ม: `output/qa/2026-07-03-worldclass-skill-audit.md`):
- **Vera**: `scrutinize` (outsider review ของ agent-change/PR), `code-review`/`security-review` (verify งาน dev เองแทนเชื่อคำ agent), `data:validate-data` (check analysis ที่มีตัวเลข) + อ้างอิง **rubric-based LLM-as-a-Judge / G-Eval** เวลา grade output ของ agent อื่น
- **Mint**: `data:analyze`/`data:sql-queries`/`data:write-query`/`data:create-viz` (ดึง+วิเคราะห์+plot ข้อมูลจาก Jed_Finance_Tracker จริง) + **driver-based modeling / rolling forecast / 3-scenario sensitivity** (FP&A practice ปัจจุบัน)
- **Scout**: `nimble:company-deep-dive`, `nimble:competitor-intel`, `nimble:market-finder` (research เชิงลึกเฉพาะทาง + ตรงกับ Benchmark Research Mode)
- **Forge**: `simplify` (refactor quality หลังโค้ดรันได้), `verify`/`run` (ยืนยันฟีเจอร์ในแอพจริง) + production-readiness 4 แกน
- **Cinder**: `scrutinize` (ตรวจ root cause จริงไหมก่อน submit fix) + **SRE toil budget / error-budget mindset** จาก Google SRE workbook
- **Muse**: **Atomic Essay** (Ship 30 for 30) — 1 โพสต์ 1 ไอเดีย <250 คำ เป็น unit เล็กสุดของ content
- **Nova**: `anthropic-skills:schedule` (สร้าง scheduled task จริงเวลา Jed ขอเตือน/งาน recurring)
- **Laura**: **orchestrator-worker pattern** (Anthropic Building Effective Agents) — task routing / context flow / lifecycle ชัดเจน
- **Eir**: **Johns Hopkins EBP model + PICO + teach-back** (ทำ EBP ให้เป็นระบบ ไม่หยิบงานวิจัยแรกที่เจอ)
- **Lena**: **PARA / CODE / Progressive Summarization** (Tiago Forte) เสริม Zettelkasten เดิม
- **ไม่แก้ (adequate):** **Atlas** (มี Canva/pptx + Bezos/Helmer/Christensen ครบแล้ว), **Sage** (consolidate-memory เพิ่งเพิ่ม 07-01 ยังตรงเป้า), **Council** & **Devil** (งาน judgment/decision ล้วน — บังคับ skill เข้าไปจะเป็นการยัดเครื่องมือโดยไม่จำเป็น ยืนยันผลเดิมจาก audit 07-01)

## วิธีระบุ model ให้ subagent (อนาคต)
ถ้า Jed ต้องการให้ Laura สั่ง subagent แบบระบุ model จริง — ใช้ Agent tool พร้อม `model:` ตามตารางด้านบน เมื่อ Forge/Mint/Atlas ทำงานผ่าน Agent tool

## กฎบังคับ — ขอบเขตชัดก่อนเรียก Opus subagent (เพิ่ม 2026-07-04)
Opus 4.8 ใช้ token ต่องานแพงกว่า Sonnet/Haiku มาก — เคยเจอปัญหาจริง (audit 2026-07-03 ใช้ ~160,000 token/70 tool call ทำให้ Jed ชน usage limit เร็ว) ตั้งแต่นี้ไป **ทุกครั้งที่ Laura จะ spawn subagent ด้วย `model: opus`** ต้องระบุขอบเขตชัดเจนไว้ใน prompt ก่อนเสมอ ห้ามปล่อยเปิดกว้าง:
- จำนวนไฟล์/agent ที่จะแตะสูงสุดกี่ไฟล์/กี่คนต่อการเรียก 1 ครั้ง
- ขอบเขตการค้นเว็บ (กี่ query โดยประมาณ หรือจำกัดเฉพาะแหล่งที่ระบุไว้ล่วงหน้า แทนให้ค้นเปิดกว้างเอง)
- ผลลัพธ์ที่ต้องได้ (deliverable) ชัดเจน ไม่ใช่ "audit ให้ดีที่สุดเท่าที่ทำได้"

ถ้างานมีขอบเขตใหญ่จริง (เช่น audit ทั้งทีมทีเดียวตามที่ Jed ต้องการความสะดวก) — ยังทำได้ในคำสั่งเดียวเหมือนเดิม แต่ต้องระบุ cap ชัดในพรอมต์ (เช่น "ไม่เกิน N tool call" หรือ "อ่านไฟล์ให้ตรงจุด ไม่เปิดกว้างเกินจำเป็น") ไม่ใช่ปล่อยให้ subagent ตัดสินใจขอบเขตเอง

## Maintenance
- Vera รับผิดชอบ review ตารางนี้เมื่อมี Claude model ใหม่ออก หรือ Jed สังเกตว่า agent คนไหนทำงานช้า/แพงเกินไปเทียบกับงาน

## 🔄 Model Review รอบ 2026-07-23 (Vera, สั่งโดย Jed ผ่าน Laura)
ตรวจทั้ง 14 agent เทียบ lineup ปัจจุบัน (Fable 5 / Opus 4.8 / Sonnet 5 / Haiku 4.5) — ปรับ 3 จุด:
- **Forge**: เพิ่มช่อง escalate → Opus 4.8 เฉพาะออกแบบสถาปัตยกรรม/ระบบใหม่ทั้งก้อน (Opus 4.8 คือ coding model แข็งสุดตอนนี้) — feature ทั่วไปคง Sonnet 5
- **Cinder**: ลดงาน routine ตามสูตร (sync_index, archive log, backup check) เป็น Haiku 4.5 ประหยัด token — bug fix/deploy คง Sonnet 5
- **Eir**: เพิ่มช่อง escalate → Opus 4.8 เฉพาะบทสนทนาอ่อนไหว/ประเมินซับซ้อน (บริบท caregiver burnout 16 ก.ค.)

**ยืนยันคงเดิม 11 agent:** Laura/Scout/Mint/Sage/Vera (Sonnet 5), Muse (Fable 5), Atlas/Council (Opus 4.8), Nova (Haiku 4.5), Devil (กฎคนละสมอง), Lena (Haiku→Sonnet ตามเฟส) — เหมาะสมกับลักษณะงานอยู่แล้ว

**Tip เสริม:** งานด่วนที่อยากได้คุณภาพ Opus แต่รอไม่ได้ → ใช้ **/fast** (Opus เร่งความเร็ว ไม่ลดรุ่น) แทนการสลับลง Sonnet/Haiku

## 💰 รอบปรับเพื่อความคุ้มค่า 2026-07-23 (ต่อจากรอบเช้า สั่งโดย Jed)
บริบท: บนแผน subscription การใช้ Fable ไม่มีบิลเพิ่ม แต่**กินโควตา usage ~2× ของ Opus (~3× ของ Sonnet)** — ราคา API สะท้อนน้ำหนัก: Fable $10/$50, Opus $5/$25, Sonnet $3/$15, Haiku $1/$5 ต่อล้าน token

**หลักการ Fable 5 = premium tier:** ใช้เฉพาะงาน high-stakes ที่คุณภาพส่วนเพิ่มคุ้มโควตาจริง ห้ามเป็น default ของ agent ไหน
- **Muse**: default ลงมาเป็น Sonnet 5 — Fable เฉพาะ content เผยแพร่จริง/storytelling สำคัญ
- **Devil**: เลิกใช้ Fable ตรวจงาน Opus — ใช้ Sonnet 5 + Gemini (ฟรี, คนละ provider จริง) แทน
- **Eir**: Fable เฉพาะตอน Jed ขอเรื่องเล่า/Quest ยาว (กติกาเดิม ไม่เปลี่ยน — เข้าเงื่อนไข premium อยู่แล้ว)

**ลำดับการเลือก model เมื่อลังเล (ถูก→แพง):** Haiku (routine ตามสูตร) → Sonnet (งานทั่วไป/synthesis/โค้ด) → Opus (reasoning ลึก/ตัดสินใจใหญ่/สถาปัตยกรรม) → Fable (เฉพาะ Jed สั่ง หรืองาน high-stakes ชัดเจน)

## 🌍 World-Class Standard Upgrade (2026-06-20)
Vera review แล้ว — model/tool assignment ปัจจุบันเหมาะสมกับงานแต่ละ agent อยู่แล้ว (Opus สำหรับ deep reasoning, Sonnet สำหรับงาน technical/synthesis, Haiku สำหรับ routine, Fable สำหรับ narrative) **ไม่ต้องเปลี่ยน model** — สิ่งที่อัปเกรดคือ "มาตรฐานอ้างอิง/persona" ของแต่ละ agent ให้เทียบเท่าผู้เชี่ยวชาญระดับโลกในสายงานนั้น (ดูหัวข้อ `## 🌍 World-Class Standard` ในไฟล์ agent แต่ละคน) เพื่อยกระดับ "วิธีคิด" ไม่ใช่แค่ "เครื่องมือ"
