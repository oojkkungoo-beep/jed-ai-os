"""
Sync YAML frontmatter ในไฟล์ team/, characters/, output/ แล้ว rebuild Index.md ที่ root
ไม่ใช้ AI เลย — เป็น deterministic script ตามที่เรียนรู้จาก NotebookLM research
(ดู output/research/2026-06-28-notebooklm-skill-workflow-pipeline.md)

เจ้าของ: Cinder (Maintenance & Ops) — รันทุกครั้งที่มีไฟล์ใหม่/แก้ไฟล์ใน 3 โฟลเดอร์นี้
ใช้งาน: python scripts/sync_index.py
"""

import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCAN_DIRS = ["team", "characters", "output"]
INDEX_PATH = ROOT / "Index.md"

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
HEADING_RE = re.compile(r"^#\s+(.+)$", re.MULTILINE)

FILE_TYPE_MAP = {
    "team": "agent_definition",
    "characters": "character_definition",
    "output/diary": "diary",
    "output/research": "research",
    "output/decisions": "decision",
    "output/qa": "qa",
    "output/projects": "project",
    "output/content": "content",
}


def guess_file_type(rel_path: str) -> str:
    rel_path = rel_path.replace("\\", "/")
    for prefix, ftype in FILE_TYPE_MAP.items():
        if rel_path.startswith(prefix):
            return ftype
    if rel_path.startswith("output/"):
        return "output_other"
    return "other"


def guess_title(content: str, path: Path) -> str:
    match = HEADING_RE.search(content)
    if match:
        return match.group(1).strip()
    return path.stem


def parse_existing_frontmatter(content: str):
    match = FRONTMATTER_RE.match(content)
    if not match:
        return None, content
    raw = match.group(1)
    fields = {}
    for line in raw.split("\n"):
        if ":" in line:
            key, _, value = line.partition(":")
            fields[key.strip()] = value.strip()
    body = content[match.end():]
    return fields, body


def build_frontmatter(fields: dict) -> str:
    lines = ["---"]
    for key in ["title", "file_type", "agent_owner", "last_updated"]:
        lines.append(f"{key}: {fields.get(key, '')}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def ensure_frontmatter(path: Path):
    content = path.read_text(encoding="utf-8")
    existing, body = parse_existing_frontmatter(content)
    rel_path = str(path.relative_to(ROOT))
    file_type = guess_file_type(rel_path)
    mtime = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).strftime("%Y-%m-%d")

    if existing is None:
        title = guess_title(content, path)
        fields = {
            "title": title,
            "file_type": file_type,
            "agent_owner": "unspecified",
            "last_updated": mtime,
        }
        new_content = build_frontmatter(fields) + "\n" + content
        path.write_text(new_content, encoding="utf-8")
        return fields, rel_path

    # มี frontmatter อยู่แล้ว — เคารพค่าที่ตั้งไว้ ไม่ทับ title/agent_owner ที่กรอกมือ
    fields = {
        "title": existing.get("title") or guess_title(body, path),
        "file_type": existing.get("file_type") or file_type,
        "agent_owner": existing.get("agent_owner") or "unspecified",
        "last_updated": existing.get("last_updated") or mtime,
    }
    return fields, rel_path


def main():
    entries = []
    for scan_dir in SCAN_DIRS:
        base = ROOT / scan_dir
        if not base.exists():
            continue
        for path in sorted(base.rglob("*.md")):
            if path.name == "Index.md":
                continue
            fields, rel_path = ensure_frontmatter(path)
            entries.append({**fields, "path": rel_path.replace("\\", "/")})

    by_type = {}
    for entry in entries:
        by_type.setdefault(entry["file_type"], []).append(entry)

    lines = ["# Index — Jed_org\n",
             "อัปเดตอัตโนมัติด้วย `scripts/sync_index.py` (Cinder รันทุกครั้งที่มีไฟล์ใหม่/แก้ไฟล์ใน team, characters, output) ห้ามแก้ไฟล์นี้ตรงๆ\n",
             f"\nสร้างล่าสุด: {datetime.now().strftime('%Y-%m-%d %H:%M')}\n"]

    type_order = ["agent_definition", "character_definition", "diary", "research",
                  "decision", "qa", "project", "content", "output_other", "other"]
    type_labels = {
        "agent_definition": "Agent Definitions (team/)",
        "character_definition": "Character Definitions (characters/)",
        "diary": "Diary (output/diary/)",
        "research": "Research (output/research/)",
        "decision": "Decisions (output/decisions/)",
        "qa": "QA (output/qa/)",
        "project": "Projects (output/projects/)",
        "content": "Content (output/content/)",
        "output_other": "Output — Other",
        "other": "Other",
    }

    for ftype in type_order:
        if ftype not in by_type:
            continue
        lines.append(f"\n## {type_labels.get(ftype, ftype)}\n")
        for entry in sorted(by_type[ftype], key=lambda e: e["last_updated"], reverse=True):
            owner = f" — {entry['agent_owner']}" if entry["agent_owner"] not in ("", "unspecified") else ""
            lines.append(f"- [{entry['title']}]({entry['path']}) ({entry['last_updated']}){owner}")

    INDEX_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Indexed {len(entries)} files -> {INDEX_PATH}")


if __name__ == "__main__":
    main()
