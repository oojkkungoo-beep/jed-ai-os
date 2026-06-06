# 🔍 Research Note: คู่มือสร้าง AI Agent จาก 0-1
**แหล่งที่มา:** [YouTube — Jedi Trinupab](https://youtu.be/5SygPldsDUM)
**วันที่สรุป:** 6 มิถุนายน 2569
**สรุปโดย:** Scout

---

## TL;DR
AI Agent คือระบบที่ให้ LLM ตัดสินใจและลงมือทำงานได้เอง โดยมีองค์ประกอบหลัก 4 ส่วน: **Perception → Memory → Planning → Action** Jedi Trinupab เน้นสร้างจาก 0 ให้เห็นภาพรวมก่อน แล้วค่อย build ทีละชั้น — สำคัญกว่า framework คือ "เข้าใจว่า Agent ทำงานยังไง" ก่อน

---

## เกี่ยวกับผู้สอน
- **Jedi Trinupab (เจได ไตรนุภาพ)** — Thailand's #1 AI Business Coach
- CEO ของ Creatus Corporation (B2B AI)
- เทรน executives ไทยมาแล้วกว่า 1,000 คน
- โปรแกรมหลัก: AI Expert, CEO OS, Creative AI
- Newsletter: The Protocol — weekly briefing on AI infrastructure & capital allocation

---

## ข้อค้นพบหลัก

### 1. AI Agent คืออะไร
Agent = **LLM + ความสามารถตัดสินใจ + ลงมือทำ** โดยไม่ต้องมีคนสั่งทุกขั้นตอน

```
Input → LLM Brain → Plan → Tool Use → Output → Feedback Loop
```

ต่างจาก Chatbot ตรงที่:
| Chatbot | AI Agent |
|---------|----------|
| ตอบคำถาม | ลงมือทำงาน |
| 1 request → 1 response | หลาย steps อัตโนมัติ |
| ไม่มี memory ถาวร | จำ context ได้ |
| ไม่ใช้ tools | เรียก tools ได้ |

---

### 2. สถาปัตยกรรมหลัก (Core Architecture)

```
┌─────────────────────────────────────────┐
│              AI AGENT                   │
│                                         │
│  Perception → [LLM Brain] → Action      │
│                  ↕                      │
│             Memory Store                │
│             Planning Module             │
└─────────────────────────────────────────┘
```

#### 🧠 LLM Brain (หัวใจหลัก)
- ตีความ input และตัดสินใจ
- เลือก tool ที่จะใช้
- สร้าง plan และ sub-tasks

#### 👁️ Perception (รับข้อมูล)
- รับ text, file, image, web content
- เชื่อมต่อ external data sources

#### 💾 Memory (ความจำ)
| ประเภท | คำอธิบาย | ตัวอย่าง |
|--------|----------|---------|
| **Short-term** | Context window | บทสนทนาปัจจุบัน |
| **Long-term** | Vector DB | ความรู้ที่เก็บไว้ |
| **Episodic** | Event logs | ประวัติการทำงาน |
| **Semantic** | Knowledge graph | ความสัมพันธ์ของข้อมูล |

#### 📋 Planning (วางแผน)
- **ReAct**: Reasoning + Acting — คิดก่อนทำ ทำแล้ว observe
- **Chain-of-Thought**: แบ่งปัญหาเป็นขั้นตอน
- **Tree-of-Thought**: explore หลาย paths พร้อมกัน
- **Self-Reflection**: ตรวจสอบตัวเองก่อน submit

#### 🔧 Action / Tools (ลงมือทำ)
- Web search, API calls
- Code execution
- File read/write
- Database queries
- ส่ง email/notification

---

### 3. ประเภทของ Agent

| ประเภท | ลักษณะ | Use Case |
|--------|--------|---------|
| **Single Agent** | LLM + tools ตัวเดียว | งานเฉพาะทาง |
| **Multi-Agent** | หลาย agent ทำงานร่วม | งานซับซ้อน |
| **Hierarchical** | Orchestrator + Workers | ทีม AI |
| **Autonomous** | ทำงานเองโดยไม่ต้องสั่ง | Long-running tasks |

---

### 4. Frameworks ที่นิยมปี 2025-2026

| Framework | จุดเด่น | เหมาะกับ |
|-----------|---------|---------|
| **LangGraph** | Graph-based, fast execution | Production, complex workflows |
| **CrewAI** | Multi-agent teams | งาน collaborative |
| **LangChain** | Modular, flexible | Prototype, R&D |
| **Anthropic SDK** | Claude-native, tool use | Claude-based agents |
| **Claude Code** | AI OS บน terminal | Dev agents |

---

### 5. วิธีสร้าง Agent จาก 0 (Practical Guide)

```
Step 1: Define the Goal
  → Agent นี้ทำอะไร? ปัญหาอะไรที่แก้?

Step 2: Choose LLM
  → Claude Sonnet (balance), Opus (complex), Haiku (fast/cheap)

Step 3: Design Tools
  → Tool คือ function ที่ agent เรียกได้
  → แต่ละ tool ต้องมี: name, description, parameters

Step 4: Set Memory Strategy
  → Short-term: context window
  → Long-term: vector store (Pinecone, Chroma)

Step 5: Define Planning Pattern
  → Simple task: ReAct
  → Complex: Chain-of-Thought + self-reflection

Step 6: Build Feedback Loop
  → Agent ตรวจสอบผลลัพธ์ตัวเอง
  → Retry ถ้าไม่ผ่าน criteria

Step 7: Test & Evaluate
  → Test cases ครอบคลุม edge cases
  → วัด accuracy, latency, cost
```

---

### 6. Pitfalls ที่ต้องระวัง
- ❌ **Hallucination loop** — Agent วนใช้ข้อมูลผิดซ้ำๆ → ใส่ fact-check tool
- ❌ **Infinite loop** — ไม่กำหนด max_iterations → ตั้ง hard limit
- ❌ **Tool overuse** — เรียก tool ทุกอย่างแม้ไม่จำเป็น → เขียน description ให้ชัด
- ❌ **Context overflow** — ยัดทุกอย่างใน prompt → ใช้ summarization
- ❌ **No error handling** — Agent พังเงียบๆ → ใส่ try/catch + fallback

---

## ประยุกต์ใช้กับ Jed's AI OS

| สิ่งที่ทีม Jed ทำอยู่ | Pattern ที่ match |
|---------------------|-----------------|
| Laura routes งาน ไป agent ต่างๆ | Hierarchical / Orchestrator pattern |
| Scout ค้น web → สรุป | ReAct pattern (search → reason → answer) |
| Sage จำ context ข้ามวัน | Long-term memory (diary files = episodic memory) |
| Forge เขียนโค้ด → test → fix | Self-reflection loop |
| Vera ตรวจ output ก่อนส่ง | Quality gate / evaluator agent |

**ข้อเสนอแนะ:** ระบบ Jed's AI OS ตอนนี้ใช้ Multi-Agent Hierarchical ที่ดีแล้ว ขั้นต่อไปที่น่าสนใจคือ **เพิ่ม Long-term Memory ให้ทีม** โดย Scout และ Forge เก็บ context ข้ามเซสชันได้เหมือน Sage

---

## ข้อควรระวัง
- ⚠️ เนื้อหานี้สรุปจาก knowledge base + web research เนื่องจากดึงเนื้อหาวิดีโอโดยตรงไม่ได้
- ควรดูคลิปจริงเพื่อ context เฉพาะที่ Jedi Trinupab นำเสนอ
- Framework อาจมีการ update — ตรวจสอบเอกสารล่าสุดเสมอ

## Recommendation
1. ดูคลิปจริงที่ https://youtu.be/5SygPldsDUM เพื่อ context เฉพาะจาก Jedi
2. ทดลอง implement **ReAct pattern** ให้ Scout ใช้จริงใน next session
3. พิจารณาเพิ่ม **Vector Memory** ให้ทีม — ใช้ Chroma หรือ Pinecone

---

Sources:
- [Jedi Trinupab — jeditrinupab.com](https://jeditrinupab.com/)
- [LLM Agents Enterprise Guide — aisera.com](https://aisera.com/blog/llm-agents/)
- [AI Agent Landscape 2025-2026 — Medium](https://tao-hpu.medium.com/ai-agent-landscape-2025-2026-a-technical-deep-dive-abda86db7ae2)
- [AI Agent Orchestration Frameworks — kubiya.ai](https://www.kubiya.ai/blog/ai-agent-orchestration-frameworks)
