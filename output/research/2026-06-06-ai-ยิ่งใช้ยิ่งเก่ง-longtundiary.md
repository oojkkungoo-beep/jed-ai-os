# 🔍 Research Note: AI ยิ่งใช้ ยิ่งเก่ง
**แหล่งที่มา:** [longtundiary Substack — AI team ep3](https://longtundiary.substack.com/p/ai-ac5)
**วันที่เผยแพร่:** 3 เมษายน 2569
**วันที่สรุป:** 6 มิถุนายน 2569
**สรุปโดย:** Scout

---

## TL;DR
AI ไม่ได้เก่งขึ้นเอง แต่ **ผู้ใช้ที่เก่งขึ้น** ต่างหาก — ด้วยการ document ทุกอย่าง, audit token cost, ใช้ AI หลายตัวตรวจกัน และ capture pattern การแก้ไข ระบบจะดีขึ้นแบบ compounding ทุกวัน

---

## ข้อค้นพบหลัก 5 วิธี

### 1. 📝 Self-Reflection via Session Logs
**แนวคิด:** Claude บันทึก session ทุกครั้ง — สำเร็จอะไร, ล้มเหลวอะไร, ติดขัดตรงไหน  
เริ่มครั้งใหม่ → Claude อ่าน log ก่อน → ต่อจากจุดเดิม ไม่เริ่มใหม่จากศูนย์

> *"Claude จำได้ว่า 'ห้ามทำแบบนี้' หรือ 'แบบนี้ดีกว่า' — ไม่ทำซ้ำข้อผิดพลาดเดิม"*

**ประยุกต์กับ Jed AI OS:** Sage ทำสิ่งนี้อยู่แล้วด้วย diary และ memory files ✅

---

### 2. 🔍 Immediate Post-Task Review
**แนวคิด:** ก่อนปิด session — ให้ Claude audit workflow ที่เพิ่งทำ  
ค้นหา: ซ้ำซ้อน, ขั้นตอนไม่จำเป็น, ความถูกต้องของ output

**ทำไมต้องทำทันที:** Claude ยังจำ context ครบทั้งหมด — file reads, agent interactions, outputs  
รอพรุ่งนี้ค่อยทำ = เสีย context หมดแล้ว

ตัวอย่างสิ่งที่เจอ:
- Agent หลายตัวอ่านไฟล์เดียวกันซ้ำ
- Loop indexing ที่ไม่จำเป็น
- Logic bug ใน insight extraction

**ประยุกต์กับ Jed AI OS:** Vera ควร run review ทุกสิ้น session ก่อนที่ Sage เขียน diary ✅

---

### 3. 🔄 Cross-Vendor Second Opinion
**แนวคิด:** ใช้ OpenAI Codex (ฟรี) ตรวจงานซ้ำกับ Claude  
AI แต่ละตัวมี blind spot ต่างกัน — ใช้สองตัวจะเจอ error มากกว่า

สิ่งที่ Codex เจอที่ Claude พลาด:
- 3 team profiles ชี้ไป index เก่า
- Trigger หนึ่งทำงานมากเกินไป
- Logic bug ใน extraction

**ประยุกต์กับ Jed AI OS:** เมื่อ Forge เขียนโค้ดสำคัญ → ให้ Vera ใช้ model อื่นตรวจซ้ำ (e.g. Gemini หรือ GPT-4o)

---

### 4. 💰 Lightweight CLAUDE.md — Token Audit
**แนวคิด:** ทุกบรรทัดใน CLAUDE.md = token ที่จ่ายทุก conversation

ผลลัพธ์หลังปรับ:
- CLAUDE.md: 78 บรรทัด → 21 บรรทัด (**ลด 71%**)
- Token per batch: ~44,000 → ~1,200 (**ลด 97%**)

วิธีทำ:
- ย้าย routing logic ไปไฟล์แยก (load เฉพาะเมื่อต้องการ)
- สร้าง lightweight summary สำหรับไฟล์ขนาดใหญ่
- เก็บเฉพาะสิ่งที่ต้องอ่านทุก turn

> *"ทุก token ที่ AI อ่านอัตโนมัติทุก conversation = เงินที่จ่ายทุกรอบ"*

**ประยุกต์กับ Jed AI OS:** ตรวจ CLAUDE.md ของทีม — ตัดทุกบรรทัดที่ไม่ใช่ routing/rule จริงๆ ออก

---

### 5. 🪞 Mirror Skill — Progressive Draft Improvement
**แนวคิด:** ไม่รอให้ AI เก่งเอง แต่ capture pattern การแก้ไขของเรา

ขั้นตอน:
1. Agent ทำ draft แรก
2. เราแก้ไข
3. Mirror skill เปรียบเทียบ original vs edited
4. ดึง correction pattern → update voice profile
5. Agent รอบหน้าไม่ทำซ้ำข้อผิดพลาดเดิม

ผล: draft quality ดีขึ้น progressively โดยไม่ต้อง retrain model

**ประยุกต์กับ Jed AI OS:** Muse ควรมี voice profile ของ Jed — ทุกครั้งที่ Jed แก้ content → Vera capture pattern → update Muse

---

## Framework สรุป

| Concept | สาระสำคัญ | ประยุกต์ใช้ |
|---------|----------|-----------|
| **Session Compounding** | ทุก session build on ของเก่า | Sage diary ✅ |
| **Context Efficiency** | review ทันทีหลังทำงาน | Vera post-session review |
| **Cross-Model Validation** | AI ต่างตัว เจอ error ต่างชนิด | Vera ใช้ second model |
| **Token Audit** | ตัดทุก token ที่ไม่จำเป็น | ลด CLAUDE.md |
| **Pattern Capture** | จับ correction ไปสอน agent | Muse voice profile |

---

## ขนาดระบบของ Author
- Knowledge Base: 37 ไฟล์ (ep.1) → **390+ ไฟล์** (ปัจจุบัน)
- Active investment theses: 11 รายการ
- Candidate companies: 4 บริษัท
- Multi-agent: Rae, Libby, Indie + orchestrator
- ค่าใช้จ่าย: Claude Max $100/เดือน

---

## สิ่งที่ Jed ควรทำต่อ (Recommendation)

1. **ด่วน:** ตรวจ CLAUDE.md ว่ามีบรรทัดที่ตัดได้บ้างไหม → ลด token cost
2. **สัปดาห์นี้:** ให้ Vera run post-session review ทุกครั้งก่อน Sage เขียน diary
3. **เดือนนี้:** สร้าง Mirror Skill ให้ Muse — capture style ของ Jed จากการแก้ไข content
4. **ระยะยาว:** เพิ่ม Cross-Model check สำหรับงาน Forge ที่สำคัญ

---

Sources:
- [AI ยิ่งใช้ ยิ่งเก่ง — longtundiary Substack](https://longtundiary.substack.com/p/ai-ac5)
