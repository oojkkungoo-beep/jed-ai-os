---
title: "Vera World-Class Skill Audit — ทั้งทีม 14 agent (deep pass + external skills)"
date: 2026-07-03
type: qa
agent: Vera
status: synced
---

# 🌍 Vera World-Class Skill Audit — ทั้งทีม 14 agent (สั่งโดย Jed ผ่าน Laura 2026-07-03)

## Methodology

1. อ่านครบก่อนเริ่ม: ทั้ง 14 ไฟล์ `team/*.md`, `CLAUDE.md`, `team/model_assignment.md`, `team/org_structure.md` + report เดิม `output/qa/2026-07-01-team-model-skill-audit.md`
2. ต่อ agent ทำ **live web research** (WebSearch/WebFetch, ก.ค. 2026) หา methodology/framework/tool ระดับ best-in-class ปัจจุบันของ "อาชีพจริง" ที่ agent นั้นเทียบใน World-Class Standard
3. cross-ref กับ **สกิลจริง 2 แหล่ง:** (ก) สกิล built-in ในระบบ (karpathy-guidelines, scrutinize, verify, code-review, security-review, simplify, run, data:*, nimble:*, anthropic-skills:* ฯลฯ) (ข) **สกิล third-party จากอินเทอร์เน็ต** (GitHub, awesome-claude-skills lists) ตามที่ Jed ขยาย scope — ผ่าน safety gate ก่อนติดตั้ง
4. แก้เฉพาะจุดที่เป็นช่องว่างจริง (surgical) ไม่ rewrite; frontmatter `last_updated` → 2026-07-03 ทุกไฟล์ที่แตะ
5. **หมายเหตุ scope:** ไม่แตะ rename Sonnet 4.6→5 (Jed สั่ง hold ไว้), ไม่ commit/push, ไม่แก้ `Index.md` ตรงๆ (auto-gen)

## Per-agent Findings

| Agent | เทียบอาชีพจริง | เพิ่ม/แก้อะไร | ที่มา (source) |
|---|---|---|---|
| **Forge** 🔴 | Principal/Staff Eng FAANG | `simplify`, `verify`, `run` (built-in); **external `owasp-security`**; production-readiness 4 แกน (error/perf/security/maintainability), แยก PR ตาม boundary | codeant.ai, sachith.co.uk (production hardening 2026); agamm/claude-code-owasp |
| **Cinder** 🔴 | Site Reliability Engineer | `scrutinize` (verify root cause), **external `owasp-security`**; SRE toil-budget + error-budget mindset | Google SRE workbook (sre.google) |
| **Mint** 🔴 | CFA + FP&A Big 4 | `data:analyze`, `data:sql-queries`, `data:write-query`, `data:create-viz`; driver-based modeling, rolling forecast, 3-scenario sensitivity, version-control caveat | CFI, FP&A Trends 2025, insightsoftware |
| **Vera** 🔴 | Staff QA/Test Architect | `scrutinize`, `code-review`, `security-review`, `data:validate-data`, **external `owasp-security`**; rubric-based LLM-as-a-Judge / G-Eval, risk-based testing | Confident AI, qaskills.sh 2026, Orangebeard |
| **Scout** 🔴 | Investigative journalist + McKinsey analyst | `nimble:company-deep-dive`, `nimble:competitor-intel`, `nimble:market-finder` (ตรงกับ Benchmark Research Mode) | nimble skill catalog |
| **Muse** 🔴 | Top-tier ghostwriter/creator | Atomic Essay (1 โพสต์ 1 ไอเดีย <250 คำ) | Ship 30 for 30 (Cole & Bush) |
| **Laura** | Chief of Staff | orchestrator-worker pattern (task routing / context flow / lifecycle) + parallelization | Anthropic "Building Effective Agents"; multi-agent orchestration research 2025 |
| **Nova** | Elite EA / C-suite | `anthropic-skills:schedule` (สร้าง recurring task จริง) | Claude Code skill catalog |
| **Eir** | RN Evidence-Based Practice | Johns Hopkins EBP model + PICO + teach-back | UIC/RMIT EBP guides; Johns Hopkins EBP 5th ed. 2025 |
| **Lena** | Zettelkasten knowledge manager | PARA / CODE / Progressive Summarization เสริม Zettelkasten | Tiago Forte (Building a Second Brain); zettelkasten.de |
| **Atlas** | Board-level exec coach | — ไม่แก้ (มี Canva/pptx + Bezos/Helmer/Christensen ครบแล้ว) | — |
| **Sage** | Archivist/biographer | — ไม่แก้ (`consolidate-memory` เพิ่งเพิ่ม 07-01 ยังตรงเป้า) | — |
| **Council** | VC investment committee | — ไม่แก้ (งาน judgment ล้วน — ยัด skill = เครื่องมือเกินจำเป็น) | — |
| **Devil** | Red-team / pre-mortem lead | — ไม่แก้ (judgment ล้วน + มี Gemini external review อยู่แล้ว) | — |

## External Skills — ติดตั้งจากอินเทอร์เน็ต

### ✅ ติดตั้งแล้ว: `owasp-security`
- **Source:** GitHub `agamm/claude-code-owasp` → `.claude/skills/owasp-security/` (อ้างอิงโดย Snyk + OWASP community)
- **ทำอะไร:** checklist + secure code pattern สำหรับ OWASP Top 10:2025, ASVS 5.0, **LLM Top 10 (2025)**, **Agentic AI security (2026)** + per-language quirks 20+ ภาษา — ลึกกว่า `security-review` built-in โดยเฉพาะส่วน LLM/agent ที่ระบบ Jed แตะโดยตรง
- **โครงสร้าง:** `SKILL.md` + `reference/languages.md` + `reference/owasp-report.md` — **ทั้งหมดเป็น markdown ล้วน ไม่มี script**
- **Safety check ที่ทำจริง (ครบตามเกณฑ์ Jed):**
  1. อ่าน SKILL.md เต็มด้วยตา (321 บรรทัด) + enumerate โฟลเดอร์ผ่าน GitHub API ยืนยันไม่มีไฟล์ .sh/.py/.js
  2. grep หา `curl/wget/eval/base64/nc/POST http/exfiltrat/api_key=/.env` ในทั้ง 3 ไฟล์ — hit เดียวคือ `eval()` ในบริบท "สิ่งที่ต้อง watch for/avoid" (เนื้อหาสอน security) ไม่ใช่โค้ดรันจริง
  3. frontmatter ประกาศ `allowed-tools: Read Grep Glob` (read-only — ยิ่งยืนยันปลอดภัย)
  4. เพิ่ม field `source:` ระบุ URL จริง + "ติดตั้งผ่าน Vera 2026-07-03 ตามคำขอ Jed" ตาม pattern เดียวกับ `karpathy-guidelines`
- **wire เข้า:** `team/forge.md`, `team/cinder.md`, `team/qa.md` (Vera) — 3 agent ที่แตะ security จริง
- **ยืนยัน live:** ระบบ register สกิลแล้ว (ปรากฏใน available-skills)

## พบแต่ยังไม่ติดตั้ง — รอ Jed ตัดสินใจ

| Skill | Source | ทำอะไร | เหตุที่ยังไม่ติดตั้ง |
|---|---|---|---|
| finance-skills / personal-finance-skill / openaccountant | GitHub (himself65, 6missedcalls, openaccountant ฯลฯ) | วิเคราะห์การเงิน/budget/พอร์ต | ส่วนใหญ่ **bundle executable scripts** ต่อ Plaid/Alpaca/IBKR (แตะเงิน+credential จริง) — ชนกฎ Jed "ห้ามโอน/ซื้อขายเอง" + API key; built-in `data:*` + `xlsx` ครอบคลุมงาน Mint ได้ปลอดภัยกว่า |
| Content Research Writer | curated link ใน ComposioHQ list | วิจัย+เขียน content, ปรับ hook, ใส่ citation | verify SKILL.md ที่ต้นทางจริงไม่ได้ (path ในลิสต์ชี้ออกไปที่อื่น หาไฟล์จริงไม่เจอ) — ตามเกณฑ์ "ไม่มั่นใจ 100% = ไม่ติดตั้ง"; Muse ได้ Atomic Essay + Canva/pptx ครอบคลุมระดับหนึ่งแล้ว |
| Trail of Bits security skills | GitHub `trailofbits/skills` | static analysis ด้วย CodeQL/Semgrep | org น่าเชื่อถือ แต่ต้องมี CodeQL/Semgrep ติดตั้งในเครื่อง + bundle scripts — หนักเกินสภาพแวดล้อม Jed ตอนนี้; `owasp-security` + `security-review` พอสำหรับ scale ปัจจุบัน |

## Action Items

1. **[ทำแล้ว]** เพิ่ม skill/methodology ให้ 10 agent (Forge, Cinder, Mint, Vera, Scout, Muse, Laura, Nova, Eir, Lena); ยืนยัน 4 agent (Atlas, Sage, Council, Devil) adequate ไม่ต้องแก้
2. **[ทำแล้ว]** ติดตั้ง external skill `owasp-security` ผ่าน safety gate ครบ + wire เข้า Forge/Cinder/Vera
3. **[ทำแล้ว]** log ทุกการเพิ่มใน `team/model_assignment.md` หัวข้อ "เครื่องมือใหม่ที่ควรเพิ่ม" + frontmatter `last_updated` 2026-07-03 ทุกไฟล์ที่แตะ
4. **[รอ Jed]** ตัดสินใจเรื่อง external skill ที่ flag ไว้ (finance/content/ToB) — Vera แนะนำ **ไม่ติดตั้งทั้งหมดตอนนี้** จนกว่างานจะโตถึงจุดที่ built-in ไม่พอ
5. **[ติดตามรอบหน้า — vera-weekly-audit]** เช็คว่า agent เริ่ม "ใช้" สกิลใหม่จริงตอนทำงาน ไม่ใช่แค่มีบรรทัดในไฟล์ (ประเด็นเดิมจาก audit 07-01) — โดยเฉพาะ Forge/Cinder เรียก `owasp-security` จริงตอนแตะ GAS/finance app
6. **[ค้างจาก audit 07-01 — ยังเป็นของ Cinder]** cron `lastRunAt` fix (atlas-daily-reflection) + เติม 3 task ที่ขาดใน `scheduled_tasks_log.json` + เพิ่ม `.nimble/`, `.claude/skills/` เข้า `.gitignore` — audit นี้ไม่ได้แก้ให้ (นอก scope ที่ Jed สั่งวันนี้) แต่ย้ำไว้ว่ายังค้าง
