# Video Knowledge Pipeline — สกัดความรู้จาก YouTube/วิดีโอ ผ่าน NotebookLM

**สถานะ:** Production pattern — พิสูจน์แล้วผ่าน 3 pilot round ข้ามหัวข้อ (2026-06-20/21)
**เจ้าของ:** Scout (รัน pipeline) → ส่งต่อ Vera (audit) → Sage (เก็บ insight) → agent เจ้าของโดเมน (synthesize ขั้นสุดท้าย)

## ทำไมต้องมี
Laura/Claude Code ดูวิดีโอ YouTube ไม่ได้โดยตรง — NotebookLM อ่าน transcript ของวิดีโอแทนได้ และตอบคำถามแบบ **grounded-with-citation** (อ้างอิงกลับไปยังคำพูดจริงในคลิปได้) ทำให้ตรวจสอบย้อนกลับได้ ไม่ใช่ AI เล่าลอยๆ

## เมื่อไหร่ควรใช้
✅ ใช้เมื่อ: เนื้อหาสาระอยู่ใน**คำพูด** (เลคเชอร์, สัมภาษณ์, สอนทฤษฎี, รีวิว/วิเคราะห์) — โดยเฉพาะเมื่อมีหลายคลิปในหัวข้อเดียวกันที่ต้อง cross-reference หาจุดร่วม/ขัดแย้ง
❌ ไม่เหมาะ: คลิปที่ความหมายอยู่ใน**ภาพ/ท่าทาง** (demo, สาธิตเทคนิคที่ต้องดูมือทำ) — ให้ใช้ Gemini Video Analysis (ดู `team/research.md`) แทน เพราะ Gemini วิเคราะห์ภาพในจอได้ NotebookLM ไม่ได้

## Setup (ทำครั้งเดียว — ทำไปแล้วบนเครื่องนี้)
- CLI: `notebooklm` (pip install --user "notebooklm-py[browser]")
- Login: ผูกกับ `oojkkungoo@gmail.com` — **ถ้าต้อง login ใหม่ ใช้ `notebooklm login --browser msedge` เสมอ** (bundled Chromium มี SxS error บนเครื่องนี้ ใช้ Edge แทน)
- Skill: ติดตั้งระดับ user แล้ว Claude Code เรียกผ่าน natural language ได้ทันที

## ขั้นตอน (4 steps ที่พิสูจน์แล้ว)

### 1. Scout — สร้าง notebook + ใส่ source
```
notebooklm create "[ชื่องาน]" --use --json
notebooklm source add "[YouTube URL]" --type youtube --timeout 90 --json
```
- ใส่ได้หลายคลิปในโน้ตบุ๊กเดียวถ้าเป็นหัวข้อเดียวกัน (ยิ่งหลายคลิป ยิ่งเห็น pattern ข้ามแหล่งชัดขึ้น)
- เช็คก่อนถามเสมอ: `notebooklm source list --json` → ดู `status: ready` ทุก source ก่อนไปขั้นถัดไป

### 2. Scout — ถามแบบ synthesize **อย่างน้อย 3 รอบเสมอ** (ห้าม one-shot)
ถามครั้งเดียวจบได้คำตอบกว้างแต่ไม่ลึก เพราะ NotebookLM ต้องแบ่งความสนใจตอบหลายประเด็นพร้อมกัน — บังคับ 3 รอบขั้นต่ำ ใช้ conversation เดียวกันทุกรอบ (ส่ง `conversation_id` จากรอบแรกต่อทุกครั้ง เพื่อให้ NotebookLM มี context เดิม):

**รอบ 1 — สรุปกว้าง + หา pattern:**
- สรุปแยกทีละ source สั้นๆ
- จุดร่วม (common pattern) ที่ทุก source เห็นตรงกัน
- จุดขัดแย้ง/ต่างกันระหว่าง source (ถ้ามี) — นี่คือมูลค่าที่สุดของการใส่หลาย source
- ถ้างานมีกลุ่มเป้าหมายเฉพาะ (เช่น "สำหรับพ่อแม่ที่จะเอาไปใช้") ให้ใส่ frame คำถามให้ตรงเป้าหมายนั้นเลย
```
notebooklm ask "[คำถามรอบ 1 แบบ synthesize]" --json
```
เก็บ `conversation_id` จาก JSON ที่ได้กลับมา

**รอบ 2 และรอบ 3 (บังคับทั้งคู่) — follow-up ลงลึกเฉพาะจุดที่น่าสนใจที่สุดจากรอบก่อนหน้า:**
แต่ละรอบเลือกประเด็นที่ลึกที่สุด/ขัดแย้งที่สุด/เสี่ยงที่สุด/เฉพาะเจาะจงกับสถานการณ์ของ Jed ที่สุดจากรอบก่อนมาถามต่อให้ละเอียดขึ้น เช่น "ทำไมเคส A กับเคส B ถึงขัดแย้งกัน เบื้องหลังต่างกันอย่างไร" หรือ "ข้อเสี่ยงที่พูดถึงใน source X มีรายละเอียดเพิ่มอะไรบ้าง" — Scout เป็นคนเลือกประเด็นเอง ไม่ใช่ถามซ้ำคำถามเดิม
```
notebooklm ask "[คำถามรอบ 2/3 แบบลงลึก]" -c [conversation_id จากรอบ 1] --json
```

**รอบ 4 เป็นต้นไป (ขึ้นกับวิจารณญาณของ Scout):** หลังครบ 3 รอบ ถ้ายังเจอจุดที่น่าสงสัย/สำคัญพอที่จะกระทบคำแนะนำสุดท้ายให้ Jed ให้ถามต่อได้เรื่อยๆ ไม่จำกัดเพดาน — แต่ถ้าข้อมูลครบพอแล้ว ไม่ต้องถามเพิ่มแค่เพื่อให้ครบจำนวน 3 คือ**ขั้นต่ำที่บังคับ ไม่ใช่เพดาน**

ผลลัพธ์มักยาว (มี citation ดิบเป็นสิบจุด) — **ห้ามส่ง raw answer ตรงให้ Jed** ต้องผ่านขั้น 3 ก่อน

### 3. Vera — Fact Audit (บังคับทุกครั้ง)
ตรวจ 2 เรื่อง:
1. Citation ผูกกับ transcript จริงไหม (เช็ค `references[].cited_text` ใน JSON output)
2. **แยกแยะ "fact/ความเสี่ยงจริง" ออกจาก "กลยุทธ์ที่ผันแปรตามแพลตฟอร์ม/เวลา/บริบท"** — เนื้อหาจากคลิปคือความเห็น/กลยุทธ์ของผู้พูด ไม่ใช่ความจริงสากล ต้องติด caveat ไว้คู่กับ insight ที่ผันแปรได้ (เช่น algorithm platform เปลี่ยนบ่อย, survivorship bias ในกลุ่มตัวอย่าง)

### 4. Sage — Extract Atomic Insights + บันทึก
สกัดเป็น insight สั้นๆ ทีละข้อ (ไม่ใช่ก้อนสรุปยาว) แล้วบันทึกลง memory ก็ต่อเมื่อ:
- เป็นเรื่องที่ Jed จะใช้ซ้ำ/ติดตามต่อ ไม่ใช่ pilot test ทดลองเฉยๆ
- ผ่าน Vera audit แล้ว

ปิดท้าย: ถ้างานมีโดเมนเจ้าของชัด (เช่น เรื่องลูก → Nova, เรื่องเงิน → Mint) ให้ agent นั้นรับ insight ไปสังเคราะห์เป็นคำแนะนำที่ actionable ขั้นสุดท้าย ไม่ใช่ปล่อย raw insight ให้ Jed อ่านเอง

## บทเรียนจาก 3 pilot round
1. **Round 1 (1 คลิป, การตลาด):** pipeline ทำงานได้ครบ แต่คุณค่าจริงๆเริ่มเห็นชัดตอนมีหลาย source
2. **Round 2 (4 คลิป, หารายได้ออนไลน์):** เจอ contradiction จริงข้ามคลิป (ความยาวคลิป, สายเทา/สายขาว) — นี่คือจุดที่ทำให้ Vera ต้องเพิ่มกฎ "แยก fact จากกลยุทธ์ที่ผันแปร"
3. **Round 3 (13 คลิป, การเรียนของลูก):** สเกลขึ้นไปถึง 13 source ในโน้ตบุ๊กเดียว ยังทำงานได้ดี และเจอ survivorship bias ที่ต้องเตือน Jed ก่อนเอาไปใช้จริง

### 5. (Optional) Generate Artifact — สไลด์/Infographic/Mind Map ฯลฯ
**ทำเฉพาะเมื่อ Jed ขอนำเสนอ/แชร์ผลลัพธ์เป็นภาพ/สไลด์** — ไม่ใช่ default step ของทุก pipeline run เพราะ generate ใช้เวลานาน (มักเกิน 280s) และไฟล์ใหญ่ (สไลด์ PPTX ขนาด ~20MB ขึ้นไป)

```
notebooklm use [notebook-id]
notebooklm generate slide-deck "[คำสั่งบรรยายสไตล์/เนื้อหาที่อยากได้]" --format presenter --language th --wait --timeout 280 --json
notebooklm generate infographic "[คำสั่ง]" --orientation portrait --style instructional --language th --wait --timeout 280 --json
```

ถ้า timeout ที่ 280s (status `in_progress` ค้างฝั่ง server ไม่ใช่ error จริง) ให้ใช้ `notebooklm artifact wait [task-id] --timeout 280 --json` รันต่อแทนการสั่งใหม่

ดาวน์โหลดเก็บไว้ที่ `output/notebooklm_artifacts/[ชื่องาน].{png,pptx,pdf}`:
```
notebooklm download infographic "output/notebooklm_artifacts/[ชื่องาน]_infographic.png" --json
notebooklm download slide-deck "output/notebooklm_artifacts/[ชื่องาน]_slides.pptx" --format pptx --json
```

ชนิด artifact อื่นที่ generate ได้ด้วยวิธีเดียวกัน: `audio` (podcast), `video`, `mind-map`, `quiz`, `flashcards`, `report`, `data-table`

## บันทึก Output
`output/research/YYYY-MM-DD-[หัวข้อ]-video-pipeline.md` (ตาม format ปกติของ Scout ใน `team/research.md`)
