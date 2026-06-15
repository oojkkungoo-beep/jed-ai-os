#!/usr/bin/env python3
"""
Session Analyzer Hook — Jed's AI OS
ทำงานเมื่อ Claude หยุด (Stop event)
อ่าน transcript ของ session ปัจจุบัน วิเคราะห์หมวดหมู่ + action items
แล้ว merge เข้า output/session_log.json เป็น 1 entry ต่อวัน (auto-log)

ถ้า Sage เคยเขียน entry ของวันนี้แบบ manual แล้ว (มี "auto": false)
hook จะไม่แก้ทับ summary/details — ปล่อยให้ Sage เป็นเจ้าของ entry นั้น
"""

import json
import sys
import os
from datetime import datetime

# ── อ่าน stdin (hook payload) ──
try:
    payload = json.load(sys.stdin)
except Exception:
    payload = {}

# ── อ่าน transcript จากไฟล์ JSONL (payload มี transcript_path ไม่ใช่ transcript ตรงๆ) ──
transcript_path = payload.get("transcript_path", "")
session_id = payload.get("session_id", "unknown")

text_chunks = []
if transcript_path and os.path.exists(transcript_path):
    try:
        with open(transcript_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                msg = obj.get("message", {})
                content = msg.get("content", "")
                if isinstance(content, str):
                    text_chunks.append(content)
                elif isinstance(content, list):
                    for block in content:
                        if isinstance(block, dict) and block.get("type") == "text":
                            text_chunks.append(block.get("text", ""))
    except Exception:
        pass

transcript = "\n".join(text_chunks)
if not transcript:
    sys.exit(0)

# ── กำหนด categories และ keywords ──
CATEGORIES = {
    "🎯 Strategy & CEO": ["strategy", "atlas", "ceo", "business", "ธุรกิจ", "วางแผน", "เป้าหมาย", "ทิศทาง", "mentor"],
    "💡 Creative & Content": ["muse", "content", "idea", "เขียน", "สร้างสรรค์", "prompt", "design", "ออกแบบ", "character"],
    "🌿 Life & Health": ["nova", "eir", "สุขภาพ", "นอน", "ออกกำลัง", "todo", "ตาราง", "นัด", "ชีวิต", "ไม่สดชื่น", "เหนื่อย"],
    "🔍 Research": ["scout", "ค้นหา", "วิจัย", "ข้อมูล", "research", "วิเคราะห์"],
    "⚖️ Decision": ["council", "ตัดสินใจ", "เลือก", "trade-off", "ควรทำ"],
    "🔧 Dev & Tech": ["forge", "โค้ด", "bug", "dashboard", "app", "script", "notion", "api", "integration"],
    "💰 Finance": ["mint", "เงิน", "รายได้", "budget", "ลงทุน", "freelance", "presentation", "slide"],
    "📝 Memory & Diary": ["sage", "diary", "บันทึก", "จำ", "สรุปวัน"],
    "🤖 System & Setup": ["laura", "settings", "prompt", "character", "image", "share", "bing", "canva"],
}

# ── นับ keywords per category สำหรับ session นี้ ──
text_lower = transcript.lower()
scores = {}
for cat, keywords in CATEGORIES.items():
    count = sum(text_lower.count(kw.lower()) for kw in keywords)
    if count > 0:
        scores[cat] = count

# ── ดึง action items จาก transcript ──
action_keywords = [
    "ต้องทำ", "todo", "action", "เริ่ม", "ลงมือ",
    "คืนนี้", "พรุ่งนี้", "สัปดาห์นี้",
    "ทดสอบ", "อัปเดต", "สร้าง", "เพิ่ม"
]

action_items = []
for line in transcript.split("\n"):
    line_lower = line.lower()
    if any(kw in line_lower for kw in action_keywords):
        clean = line.strip()
        if 10 < len(clean) < 200 and not clean.startswith("{") and not clean.startswith("//"):
            action_items.append(clean[:120])

seen = set()
unique_actions = []
for a in action_items:
    key = a[:50]
    if key not in seen:
        seen.add(key)
        unique_actions.append(a)
unique_actions = unique_actions[:8]

# ── path ── (project root = สองระดับขึ้นจาก .claude/hooks/)
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
output_dir = os.path.join(base_dir, "output")
os.makedirs(output_dir, exist_ok=True)

# ── วันที่แบบไทย (พ.ศ.) ให้ตรงกับ format ที่ Sage ใช้ ──
THAI_MONTHS = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
               "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
now = datetime.now()
today_thai = f"{now.day} {THAI_MONTHS[now.month]} {now.year + 543}"

# ── state file: เก็บ score/tasks ล่าสุดของแต่ละ session เพื่อไม่ให้นับซ้ำตอน merge ──
state_path = os.path.join(base_dir, ".claude", "output", "session_state.json")
os.makedirs(os.path.dirname(state_path), exist_ok=True)
try:
    with open(state_path, "r", encoding="utf-8") as f:
        state = json.load(f)
    if not isinstance(state, dict):
        state = {}
except Exception:
    state = {}

state[session_id] = {"date": today_thai, "scores": scores, "tasks": unique_actions}

with open(state_path, "w", encoding="utf-8") as f:
    json.dump(state, f, ensure_ascii=False, indent=2)

# ── รวม scores/tasks ของทุก session วันนี้ ──
agg_scores = {}
agg_tasks = []
for sid, s in state.items():
    if s.get("date") != today_thai:
        continue
    for cat, count in s.get("scores", {}).items():
        agg_scores[cat] = agg_scores.get(cat, 0) + count
    for t in s.get("tasks", []):
        if t not in agg_tasks:
            agg_tasks.append(t)
agg_tasks = agg_tasks[:8]

agg_total = sum(agg_scores.values()) or 1
agg_sorted = sorted(agg_scores.items(), key=lambda x: x[1], reverse=True)
top_cat = agg_sorted[0][0] if agg_sorted else "ไม่ระบุ"

categories_list = [
    {"name": cat, "count": count, "pct": round(count / agg_total * 100)}
    for cat, count in agg_sorted[:6]
]
tags_list = [c["name"] for c in categories_list[:4]]

# ── โหลด session_log.json ──
session_json_path = os.path.join(output_dir, "session_log.json")
try:
    with open(session_json_path, "r", encoding="utf-8") as f:
        session_log = json.load(f)
    if not isinstance(session_log, list):
        session_log = []
except Exception:
    session_log = []

existing = next((e for e in session_log if e.get("date") == today_thai), None)

if existing is not None and existing.get("auto") is False:
    # Sage เขียน entry นี้แบบ manual แล้ว — ไม่แก้ทับ summary/details/tasks
    status_msg = f"📊 Session วันนี้มี Sage บันทึกไว้แล้ว — ไม่ทับ entry (หมวดหลักล่าสุด: {top_cat})"
else:
    if existing is not None:
        existing["topCategory"] = top_cat
        existing["tags"] = tags_list
        existing["categories"] = categories_list
        existing["tasks"] = agg_tasks
        existing["summary"] = f"Auto-log: หมวดหลัก {top_cat} ({categories_list[0]['pct'] if categories_list else 0}%) — รอ Sage สรุปท้ายวัน"
        existing["auto"] = True
    else:
        new_id = max([e.get("id", 0) for e in session_log], default=0) + 1
        session_log.append({
            "id": new_id,
            "date": today_thai,
            "topCategory": top_cat,
            "tags": tags_list,
            "summary": f"Auto-log: หมวดหลัก {top_cat} ({categories_list[0]['pct'] if categories_list else 0}%) — รอ Sage สรุปท้ายวัน",
            "categories": categories_list,
            "tasks": agg_tasks,
            "details": "",
            "relatedProjects": [],
            "auto": True,
        })

    with open(session_json_path, "w", encoding="utf-8") as f:
        json.dump(session_log, f, ensure_ascii=False, indent=2)

    status_msg = f"📊 Session log อัปเดต | หมวดหลัก: {top_cat} | Tasks: {len(agg_tasks)} → output/session_log.json"

print(json.dumps({"systemMessage": status_msg}, ensure_ascii=False))
