---
title: "Vera On-Demand Audit — Model & Skill ทั้งทีม (โฟกัส Cinder)"
date: 2026-07-01
type: qa
agent: Vera
status: synced
---

# 🔎 Vera Audit — Model & Skill ทั้งทีม (สั่งโดย Jed 2026-07-01)

## 1. Model Fit — ตรวจตาราง `team/model_assignment.md`

| Agent | Model ปัจจุบัน | ผลตรวจ |
|---|---|---|
| Laura | Sonnet 4.6 | ✅ ตรง — routing/งานเล็ก ไม่ต้องการ reasoning ลึก |
| Muse | Fable 5 | ✅ ตรง — narrative/creative |
| Atlas | Opus 4.8 | ✅ ตรง — strategy ต้อง reasoning ลึก |
| Nova | Haiku 4.5 | ✅ ตรง — routine/structured |
| Eir | Sonnet 4.6 (→ Fable 5 เฉพาะ narrative ยาว) | ✅ ตรง |
| Scout | Sonnet 4.6 | ✅ ตรง |
| Council | Opus 4.8 | ✅ ตรง |
| Forge | Sonnet 4.6 | ✅ ตรง — coding model หลัก |
| **Cinder** | Sonnet 4.6 | ✅ ตรง — อ่านโค้ดคนอื่นแม่นพอ ไม่ใช่ routine ระดับ Haiku |
| Mint | Sonnet 4.6 (escalate Council/Opus ถ้าก้อนใหญ่) | ✅ ตรง |
| Sage | Sonnet 4.6 | ✅ ตรง |
| Vera | Sonnet 4.6 (escalate Opus 4.8 audit ใหญ่) | ✅ ตรง |
| Devil | ตรงข้ามกับ agent ต้นทาง | ✅ ตรง (by design) |
| Lena | Haiku 4.5 → Sonnet 4.6 (Synthesize) | ✅ ตรง |

**สรุป Model:** ไม่มีจุดที่ต้องเปลี่ยน — ทุก agent ใช้ model ตรงกับความหนักของงานอยู่แล้ว ไม่มี over-provision (ใช้ Opus เกินจำเป็น) หรือ under-provision (ใช้ Haiku กับงานที่ต้อง reasoning ลึก)

## 2. Skill Fit — ช่องว่างที่เจอ

ตรวจพบว่า agent ที่มีบรรทัด **"เครื่องมือเสริม"** อ้างอิง Claude Code skill/MCP จริงในไฟล์ตัวเอง (Muse, Atlas, Mint, Scout) ทำงานได้ตรงเป้าและ token คุ้มกว่า agent ที่ไม่มีบรรทัดนี้เลย — พบ **3 ช่องว่างจริง**:

### 🔴 Cinder — ช่องว่างที่ Jed ชี้มาตรง (แก้แล้ว)
Cinder มี "กฎการทดสอบ" + "Self-Reflection Loop" + "Security Rules" เป็นข้อความล้วน แต่ไม่เคยผูกกับสกิลจริงในระบบเลยสักตัว ทั้งที่มีสกิลตรงเป้าอยู่แล้ว:
- `karpathy-guidelines` — ตรงกับ Self-Reflection Loop ข้อ "แก้จริงไหม หรือแค่ปิดอาการ" เป๊ะ
- `verify` — ตรงกับ "รันโค้ดจริงก่อน submit เสมอ" เป๊ะ
- `run` — launch/drive แอพเพื่อยืนยัน fix
- `security-review` — ตรงกับ Security Rules เดิม

**แก้แล้ว:** เพิ่มบรรทัด "เครื่องมือเสริม" ใน `team/cinder.md` อ้างอิงสกิลทั้ง 4 พร้อมอธิบายว่าตรงกับข้อไหนในไฟล์เดิม

### 🟡 Forge — ช่องว่างเดียวกัน (แก้ไปด้วยเพราะราคาถูก+ตรงจุดเดียวกัน)
Forge เขียนโค้ดใหม่ทุกวันแต่ไม่เคยอ้าง `code-review`/`security-review`/`karpathy-guidelines` เลยเช่นกัน — เพิ่มเข้า `team/forge.md` แล้ว

### 🟡 Sage — พบระหว่างตรวจ (แก้ไปด้วย)
Sage มี World-Class Standard เขียนไว้ชัดว่า "memory ต้องลบ/แก้ทันทีเมื่อข้อมูลล้าสมัย ไม่ปล่อยให้ stale memory สะสม" แต่ไม่มีสกิลรองรับ — ระบบมี `anthropic-skills:consolidate-memory` ตรงเป้าอยู่แล้ว เพิ่มเข้า `team/memory_agent.md` แล้ว

### ✅ ไม่ต้องแก้
Council, Devil — งาน judgment/decision ล้วน ไม่มี Claude Code skill ที่ตรงเป้ากว่าการคิดเองของ agent (บังคับใช้ skill กับงานประเภทนี้จะเป็นการยัดเครื่องมือเข้าไปแบบไม่จำเป็น)

## 3. Sync
- แก้ 4 ไฟล์: `team/cinder.md`, `team/forge.md`, `team/memory_agent.md`, `team/model_assignment.md` (log การเพิ่มไว้ในหัวข้อ "เครื่องมือใหม่ที่ควรเพิ่ม")
- รัน `scripts/sync_index.py` ต่อจากนี้ตาม Standing Rule

## 4. Token Audit (เทียบกับ audit ล่าสุด 2026-06-28)
- **CLAUDE.md**: 48 บรรทัด (+3 จาก 45) — มาจาก Dropbox Pipeline + กฎ In-Parallel ที่เพิ่มไปก่อนหน้านี้ ไม่ใช่ bloat ใหม่จาก audit นี้
- **team/*.md รวม**: 1,464 บรรทัด (+44 จาก 1,420) — มาจากงานนี้ทั้งหมด: เพิ่มบรรทัด "เครื่องมือเสริม" ใน `cinder.md`/`forge.md`/`memory_agent.md` (+~19 บรรทัดรวม) + entry ใหม่ใน `model_assignment.md` (+~8 บรรทัด) + ไฟล์อื่นที่ frontmatter sync แตะ (`ceo_coach`, `council`, `devil`, `finance`, `idea`, `laura`, `librarian`, `life`, `qa`, `research`, `wellness` — เปลี่ยนแค่ `last_updated` ตอนรัน `sync_index.py` ไม่ใช่เนื้อหาใหม่) → **ไม่มี bloat ที่ไม่จำเป็น**
- **JSON logs**: `session_log.json` 81.7KB (+7.5KB จาก 74.2KB), `team_logs.json` 153.7KB (+44.7KB จาก 109KB — โตเร็วสุดในบรรดา log ทั้งหมด), `knowledge.json` 31KB (ไม่เปลี่ยนตั้งแต่ 21 มิ.ย. — ไม่มีใครเขียนเพิ่มช่วงนี้ ไม่ใช่ปัญหา แค่ระบุไว้เฉยๆ) — entry เก่าสุดตอนนี้อายุ ~25 วัน ยังไม่ถึงเกณฑ์ archive 30 วันของ Lena (คาดว่าจะเริ่ม archive จริงราว **3-8 ก.ค.** ตามที่ประเมินไว้สัปดาห์ก่อน — ยังไม่ต้องแตะอะไรตอนนี้)

## 5. Workload Balance (จาก git log 7 วันที่ผ่านมา)
- **Cinder ทำงานสมดุลกับ role**: มี output จริง 3 ไฟล์ใน `output/dev/` ช่วงนี้ — home-server-setup-guide, medsupply-registry-deploy, migrate-rtaf-nurse-web-netlify (วันนี้) ทั้งหมดเป็นงาน "ดูแลของเดิม/deploy" ตรงกับ boundary ไม่ใช่งานสร้างฟีเจอร์ใหม่
- **Forge ไม่มี output ใน `output/dev/` ช่วงนี้เลย** — ไม่ใช่ปัญหา (ไม่มีงาน "สร้างฟีเจอร์ใหม่" ถูกสั่งช่วงนี้จริงๆ) แต่ flag ไว้เผื่อ Jed อยากเช็คว่า pipeline งานใหม่ยังไหลเข้า Forge อยู่ไหม หรือทุกอย่างกลายเป็นงาน "ดูแลของเดิม" ผ่าน Cinder หมด
- **Atlas/Sage cron**: มี commit สม่ำเสมอ (reflection 26/27/30 มิ.ย., diary 28/30 มิ.ย.) แต่ **commit วันที่ตามหลังเนื้อหาจริง 1-2 วันเสมอ** (เช่น diary ของ 30 มิ.ย. ถูก commit วันที่ 1 ก.ค.) — ไม่ฟันธงว่าเป็นปัญหา อาจเป็นแค่ commit แบบ batch ทีหลัง แต่ควรถาม Cinder/Jed ว่าตั้งใจให้เป็นแบบนี้ไหม หรือ cron ควร commit ทันทีที่รันเสร็จ
- **Vera**: ทำ weekly audit (28/29 มิ.ย.) + audit นี้ (1 ก.ค.) — workload ปกติ ไม่หนักเกิน
- ไม่พบ agent คนไหน "แบกงานข้ามโดเมนเกิน 2 สัปดาห์" ในรอบนี้

## 6. Automation/Cron Health — พบปัญหาเดิมที่ยังไม่ปิด
ตรวจ `output/scheduled_tasks_log.json` สดจากไฟล์จริง (ไม่ใช่แค่เชื่อรายงานสัปดาห์ก่อน):
- **`ai-team-daily-diary`**: `lastRunAt` = 2026-07-01T05:01 ✅ **แก้แล้วจริง** — ตรงกับ commit ล่าสุด (diary 30 มิ.ย.) log อัปเดตตามจริง
- **`atlas-daily-reflection`**: `lastRunAt` ยังค้างที่ **2026-06-16T05:19** ทั้งที่มี commit reflection จริงถึง 3 รอบหลังจากนั้น (26, 27, 30 มิ.ย.) — งานรันจริง แต่ log ไม่เคยถูกอัปเดตเลยตั้งแต่ 16 มิ.ย. **นี่คือ action item #1 ของ audit สัปดาห์ก่อนที่ยังไม่ปิดสนิท** — ครึ่งหนึ่งแก้แล้ว (diary) อีกครึ่งยังไม่แก้ (atlas reflection)
- **`lena-weekly-vault-digest`, `second-brain-git-backup`, `vera-weekly-audit`**: **ยังไม่มี entry ในไฟล์เลย** — action item #2 ของ audit สัปดาห์ก่อน (28 มิ.ย.) สั่งให้เติมให้ครบ 5 task ผ่านมา 3 วันแล้วยังไม่ทำ
- **`.gitignore`**: ยังไม่มี `.nimble/` และ `.claude/skills/` — action item #3 ของ audit สัปดาห์ก่อนก็ยังไม่ทำ (ยืนยันจาก git status สดตอนนี้ ทั้งสอง directory ยัง `??` untracked อยู่)

**สรุป:** ของที่ Jed สั่งวันนี้ (skill audit + เพิ่ม skill Cinder) เสร็จครบ แต่ **3 action items จาก audit สัปดาห์ก่อนยังค้างอยู่ 2.5 ใน 3 ข้อ** (diary log fix ผ่านแล้ว 1 ใน 2 ของ item #1) — เป็นงาน Cinder (cron health + .gitignore เป็นของ Cinder ตาม Deploy & Maintenance Knowledge ใน `team/cinder.md`)

## Action Items
1. **[ทำแล้ว]** Cinder ได้สกิล debug/programming ครบ 4 ตัวตามที่ Jed ขอ
2. **[ทำแล้ว — bonus]** Forge + Sage ได้รับการแก้ช่องว่างเดียวกันที่เจอระหว่างตรวจ เพราะราคาถูกและตรงจุด
3. **[ย้ำซ้ำครั้งที่ 3 — ยังไม่ทำ]** Cinder ต้องเติม `lastRunAt` ของ `atlas-daily-reflection` ให้ตรงจริง + เติม entry ของ `lena-weekly-vault-digest`, `second-brain-git-backup`, `vera-weekly-audit` เข้า `output/scheduled_tasks_log.json` ให้ครบ 5 task
4. **[ย้ำซ้ำครั้งที่ 2 — ยังไม่ทำ]** เพิ่ม `.nimble/` และ `.claude/skills/` เข้า `.gitignore`
5. **[ใหม่ — ไม่เร่ง]** เช็คกับ Jed ว่า commit ของ cron (diary/reflection) ที่ตามหลังเนื้อหาจริง 1-2 วันเป็นพฤติกรรมที่ตั้งใจไหม
6. **[ติดตามต่อ]** สัปดาห์หน้า (`vera-weekly-audit`) เช็คว่า Cinder เริ่มอ้างอิงสกิลใหม่จริงตอนทำงาน bug fix จริง ไม่ใช่แค่มีบรรทัดในไฟล์เฉยๆ
