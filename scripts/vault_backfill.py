import shutil
from pathlib import Path
from datetime import date

ORG = Path(r"D:\Claude_Cowork\Jed_org")
VAULT = Path(r"D:\NB_G_Drive\Second_Brain")

def frontmatter(title, dt, type_, agent, status="synced"):
    return (
        "---\n"
        f"title: \"{title}\"\n"
        f"date: {dt}\n"
        f"type: {type_}\n"
        f"agent: {agent}\n"
        f"status: {status}\n"
        "---\n\n"
    )

def copy_with_frontmatter(src, dest, title, dt, type_, agent, status="synced"):
    if dest.exists():
        print(f"SKIP (exists): {dest.name}")
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    content = src.read_text(encoding="utf-8")
    dest.write_text(frontmatter(title, dt, type_, agent, status) + content, encoding="utf-8")
    print(f"SYNCED: {src.relative_to(ORG)} -> {dest.relative_to(VAULT)}")

# 1) Diary backfill (output/diary -> vault 40-Life/Diary)
diary_src = ORG / "output" / "diary"
diary_dst = VAULT / "40-Life" / "Diary"
for f in sorted(diary_src.glob("*.md")):
    dt = f.stem[:10]
    copy_with_frontmatter(f, diary_dst / f.name, f"Diary {f.stem}", dt, "diary", "Sage")

# 2) Decisions (output/decisions -> vault 30-Business/Strategy)
dec_src = ORG / "output" / "decisions"
dec_dst = VAULT / "30-Business" / "Strategy"
for f in sorted(dec_src.glob("*.md")):
    dt = f.stem[:10]
    copy_with_frontmatter(f, dec_dst / f.name, f.stem, dt, "decision", "Atlas/Council")

# 3) Research (output/research -> vault 20-AI-Learning/Research-Notes)
res_src = ORG / "output" / "research"
res_dst = VAULT / "20-AI-Learning" / "Research-Notes"
for f in sorted(res_src.glob("*.md")):
    dt = f.stem[:10]
    copy_with_frontmatter(f, res_dst / f.name, f.stem, dt, "research", "Scout")

# 4) QA (output/qa -> vault 30-Business/Jed-AI-OS)
qa_src = ORG / "output" / "qa"
qa_dst = VAULT / "30-Business" / "Jed-AI-OS"
for f in sorted(qa_src.glob("*.md")):
    dt = f.stem[:10]
    copy_with_frontmatter(f, qa_dst / f.name, f.stem, dt, "qa", "Vera")

print("DONE")
