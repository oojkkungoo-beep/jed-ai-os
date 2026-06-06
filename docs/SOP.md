# SOP — Jed's AI OS
## Standard Operating Procedure: การใช้งานและปรับแต่ง Dashboard

---

## 1. การเริ่มต้นใช้งาน

### เปิด Dashboard
```
1. เปิด PowerShell
2. รัน: D:\Claude_Cowork\Jed_org\serve.ps1
3. เปิด Browser → http://localhost:3334/
```

### เปิด AI Secretary (Claude Code)
```
1. เปิด Terminal / VS Code
2. cd D:\Claude_Cowork\Jed_org
3. พิมพ์: claude
4. Laura พร้อมรับคำสั่ง
```

---

## 2. การใช้งาน AI Secretary

### วิธีคุยกับ Laura
พูด/พิมพ์ตรงๆ ตามธรรมชาติ Laura จะ route ให้เอง:

| ต้องการอะไร | ตัวอย่างคำสั่ง |
|------------|--------------|
| จัดการ idea | "มีไอเดียอยากทำ YouTube เกี่ยวกับสุขภาพ" |
| CEO advice | "อยากเปิดคลินิก ควรเริ่มจากตรงไหน?" |
| วางแผนวัน | "ช่วยวางตาราง exercise สัปดาห์นี้หน่อย" |
| ค้นข้อมูล | "research ตลาด telemedicine ในไทย" |
| ตัดสินใจ | "ลังเลว่าจะซื้อคอนโดหรือบ้าน ช่วยวิเคราะห์" |
| เขียนโค้ด | "สร้าง script สำรองข้อมูลอัตโนมัติ" |
| การเงิน | "วิเคราะห์ P&L เดือนนี้ให้หน่อย" |
| บันทึกวัน | "สรุปวันนี้" หรือ "บันทึก diary" |

---

## 3. การใช้งาน Dashboard

### หน้า Team
- **กดที่ Card** → เปิด modal ดูรายละเอียด
- **Tab "Prompt"** → ดู system prompt ของ agent
- **Tab "Character"** → ดู character sheet + image prompt
- **เพิ่ม Comment** → พิมพ์ใน textarea แล้วกด "บันทึก Comment"

### หน้า Diary
- พิมพ์สรุปวัน → กด "บันทึก"
- ดู diary ย้อนหลังเป็น timeline

### หน้า Projects
- กด "+ เพิ่ม" → ใส่ชื่อโปรเจกต์ เลือก status
- Status: Active (กำลังทำ) / Pending (รอ) / Done (เสร็จ)

### หน้า Review
- Comment ที่เพิ่มในแต่ละ Agent card จะมารวมที่นี่
- กด "Export" → ได้ไฟล์ .md สำหรับนำไปสั่งปรับแต่ง AI

---

## 4. การปรับแต่ง Agent

### แก้ไขพฤติกรรม Agent
```
ไฟล์: D:\Claude_Cowork\Jed_org\team\[ชื่อ agent].md
เปิดด้วย: VS Code หรือ Notepad
แก้แล้ว: บันทึก → ใช้งานได้ทันทีใน session ถัดไป
```

**สิ่งที่ควรแก้:**
- `## Trigger` — เพิ่ม keyword ที่จะเรียก agent นี้
- `## Output Format` — เปลี่ยนรูปแบบผลลัพธ์
- `## Frameworks` — เพิ่ม framework ที่ต้องการ

### แก้ไข Character Sheet
```
ไฟล์: D:\Claude_Cowork\Jed_org\characters\[ชื่อ].md
→ ไม่กระทบการทำงานของ AI เลย (เป็นแค่ข้อมูลแสดงใน Dashboard)
```

---

## 5. การเพิ่ม Agent ใหม่

### ขั้นตอน (3 ไฟล์)

**Step 1:** สร้าง System Prompt
```
ไฟล์: team/[ชื่อ].md
เนื้อหา: Role, Trigger, Output Format, บันทึก Output
```

**Step 2:** สร้าง Character Sheet
```
ไฟล์: characters/[ชื่อ].md
เนื้อหา: เผ่าพันธุ์, ลักษณะ, นิสัย, Job Description, Image Prompt
```

**Step 3:** เพิ่มใน Dashboard
```javascript
// เปิด dashboard/app.js
// เพิ่มใน array AGENTS:
{
  id:'ชื่อ',
  name:'ชื่อแสดง',
  model:'sonnet', // opus / sonnet / haiku
  emoji:'🔥',
  role:'หน้าที่',
  desc:'คำอธิบายสั้น',
  file:'../team/ชื่อ.md',
  charFile:'../characters/ชื่อ.md'
}
```

**Step 4:** เพิ่ม Routing ใน CLAUDE.md
```markdown
ชื่องาน / keyword → AgentName
```

---

## 6. การ Generate ภาพ Character

### วิธีใช้ Image Prompt
1. เปิด Dashboard → Team → กดที่ Agent card
2. กด Tab "Character"
3. Copy ส่วน `Image Prompt` ที่ท้ายไฟล์
4. นำไป paste ใน:
   - **Midjourney:** `/imagine [prompt]`
   - **DALL-E 3:** วางใน ChatGPT
   - **Stable Diffusion:** ใช้ prompt โดยตรง

### Tips สำหรับ Midjourney
```
เพิ่มท้าย prompt:
--ar 1:1          (สี่เหลี่ยมจัตุรัส สำหรับ profile card)
--ar 2:3          (แนวตั้ง สำหรับ card เต็ม)
--style manga     (สไตล์มังงะ)
--v 6             (version ล่าสุด)
```

---

## 7. การ Backup ระบบ

### สิ่งที่ต้อง Backup
```
D:\Claude_Cowork\Jed_org\
├── CLAUDE.md         ← สำคัญมาก
├── team/             ← system prompts ทั้งหมด
├── characters/       ← character sheets
├── output/           ← ผลงานของ AI
└── docs/             ← SOP และเอกสาร
```

### วิธี Backup อย่างง่าย
```powershell
# รันใน PowerShell
$date = Get-Date -Format "yyyy-MM-dd"
Compress-Archive -Path "D:\Claude_Cowork\Jed_org" -DestinationPath "D:\Backup\JedAIOS-$date.zip"
```

---

## 8. Troubleshooting

| ปัญหา | วิธีแก้ |
|-------|---------|
| Dashboard ไม่เปิด | รัน `serve.ps1` ใหม่ |
| Laura ไม่เข้าใจ role | เพิ่ม keyword ใน `CLAUDE.md` section Routing |
| Agent ไม่ทำตาม format | เปิด `team/[ชื่อ].md` แก้ Output Format |
| Character ไม่แสดงใน modal | ตรวจสอบ path ใน `charFile` ใน `app.js` |

---

## 9. Tips การใช้งานให้มีประสิทธิภาพ

1. **วันละครั้ง** — บอก Sage ให้สรุปวันก่อนปิด session
2. **ใช้ Council อย่างระวัง** — เรียกเฉพาะการตัดสินใจสำคัญจริงๆ (ประหยัด token Opus)
3. **เพิ่ม Comment ที่ Dashboard** — เวลาเจอ agent ที่ต้องปรับ กด Export แล้วนำไปแก้พร้อมกันครั้งเดียว
4. **อ่าน output** ที่ `output/` โฟลเดอร์ — ทุก output ถูกบันทึกไว้
5. **อัปเดต Projects** — เวลาเริ่มงานใหม่ เพิ่มใน Dashboard เพื่อ track

---

*อัปเดตล่าสุด: 2026-06-05 | Jed's AI OS v1.0*
