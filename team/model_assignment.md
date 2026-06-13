# Model Assignment — ทีม Laura

อัปเดตตาม Claude model lineup ปัจจุบัน: **Fable 5** (`claude-fable-5`), **Opus 4.8** (`claude-opus-4-8`), **Sonnet 4.6** (`claude-sonnet-4-6`), **Haiku 4.5** (`claude-haiku-4-5-20251001`)

> หมายเหตุ: Claude Code "Fast mode" (Opus เร่งความเร็ว) ใช้ /fast — ไม่ใช่การลดรุ่น

## ตารางสรุป

| Agent | งานหลัก | Model แนะนำ | เหตุผล |
|---|---|---|---|
| **Laura** (orchestrator) | routing, งานเล็ก/ด่วน | **Sonnet 4.6** | สมดุล เร็ว พอสำหรับ routing + งานสั้น |
| **Muse** (idea/content) | เขียน content, storytelling, idea card | **Fable 5** | โทนเสียง/narrative สมบูรณ์ขึ้น เหมาะกับงาน creative writing โดยเฉพาะ |
| **Atlas** (CEO coach) | strategy, big-picture decision | **Opus 4.8** | reasoning เชิงลึก หลายมุมมอง ต้อง challenge assumption |
| **Nova** (life/health schedule) | todo, calendar, ตาราง | **Haiku 4.5** | งาน routine/structured ไม่ซับซ้อน เร็ว ประหยัด |
| **Eir** (wellness) | สุขภาพ + RPG narrative | **Sonnet 4.6** | ต้องแม่นยำเชิงวิชาการพยาบาล แต่ก็มี narrative — Sonnet ครอบคลุมทั้งสอง; ใช้ **Fable 5** เฉพาะตอน Jed ขอเรื่องเล่า/Quest narrative ยาวเกิน 1 หน้า (ดูตัวอย่างใน `wellness.md`) |
| **Scout** (research) | ค้นคว้า วิเคราะห์ | **Sonnet 4.6** | ทำงานคู่กับ Nimble search ได้ดี ไม่ต้องการ reasoning ระดับ Opus ปกติ |
| **Council** (decision chamber) | ตัดสินใจใหญ่ 3 มุมมอง | **Opus 4.8** | ต้องวิเคราะห์ลึก + trade-off หลายชั้น |
| **Forge** (dev) | เขียน/แก้/review โค้ด | **Sonnet 4.6** | coding model หลักของ Claude Code, เร็วและแม่นยำ |
| **Mint** (finance) | budget, P&L, ROI | **Sonnet 4.6** | งาน routine financial calc ใช้ Sonnet พอ — ถ้าเป็นการลงทุนก้อนใหญ่/ผลกระทบระยะยาว Mint **ส่งงานต่อ Council** (ซึ่งใช้ Opus 4.8) ไม่ใช่เปลี่ยน model ตัวเอง |
| **Sage** (memory/diary) | diary, memory update, log | **Sonnet 4.6** | ต้อง synthesize ข้อมูลทั้งวันให้สรุปดี — Haiku อาจตกรายละเอียด |
| **Vera** (QA) | review output, skill dev, token audit | **Sonnet 4.6** (escalate → Opus 4.8 สำหรับ token/skill audit ใหญ่) | งาน review ทั่วไปใช้ Sonnet, audit เชิงลึกใช้ Opus |
| **Devil** (adversarial review) | bear case, polarity audit, evidence match | **ตรงข้ามกับ agent ต้นทาง** — งานจาก Muse(Fable5)/Scout(Sonnet) ใช้ **Opus 4.8**; งานจาก Council/Atlas(Opus) ใช้ **Fable 5** | ต้อง "คนละสมอง" จริง ไม่ใช่ model เดิมที่ตรวจตัวเอง |

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

## วิธีระบุ model ให้ subagent (อนาคต)
ถ้า Jed ต้องการให้ Laura สั่ง subagent แบบระบุ model จริง — ใช้ Agent tool พร้อม `model:` ตามตารางด้านบน เมื่อ Forge/Mint/Atlas ทำงานผ่าน Agent tool

## Maintenance
- Vera รับผิดชอบ review ตารางนี้เมื่อมี Claude model ใหม่ออก หรือ Jed สังเกตว่า agent คนไหนทำงานช้า/แพงเกินไปเทียบกับงาน
