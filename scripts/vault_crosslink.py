from pathlib import Path

VAULT = Path(r"D:\NB_G_Drive\Second_Brain")

CLUSTERS = [
    [
        "30-Business/Jed-AI-OS/2026-06-12-model-assignment.md",
        "30-Business/Strategy/2026-06-12-council-vera-model-assignment-fixes.md",
    ],
    [
        "30-Business/Strategy/2026-06-07-framework-01-4level.md",
        "30-Business/Strategy/2026-06-12-framework-90day-action-plan.md",
        "30-Business/Strategy/2026-06-14-atlas-reflection-ceo-lens.md",
        "40-Life/Diary/2026-06-07.md",
        "40-Life/Diary/2026-06-08.md",
    ],
    [
        "40-Life/Diary/2026-06-06.md",
        "20-AI-Learning/Research-Notes/2026-06-06-ai-agent-guide-jedi-trinupab.md",
        "20-AI-Learning/Research-Notes/2026-06-06-ai-ยิ่งใช้ยิ่งเก่ง-longtundiary.md",
    ],
    [
        "40-Life/Diary/2026-06-15.md",
        "40-Life/Diary/2026-06-16.md",
    ],
]

def add_related(path: Path, link_targets):
    text = path.read_text(encoding="utf-8")
    if "## Related" in text:
        print(f"SKIP (already has Related): {path.name}")
        return
    links = "\n".join(f"- [[{t}]]" for t in link_targets)
    text = text.rstrip("\n") + f"\n\n## Related\n{links}\n"
    path.write_text(text, encoding="utf-8")
    print(f"LINKED: {path.name} -> {link_targets}")

for cluster in CLUSTERS:
    for rel in cluster:
        p = VAULT / rel
        targets = [Path(o).stem for o in cluster if o != rel]
        add_related(p, targets)

print("DONE")
