import re
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

FONT_DIR = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("Thai", f"{FONT_DIR}\\tahoma.ttf"))
pdfmetrics.registerFont(TTFont("Thai-Bold", f"{FONT_DIR}\\tahomabd.ttf"))

styles = getSampleStyleSheet()
base = ParagraphStyle("base", parent=styles["Normal"], fontName="Thai", fontSize=10, leading=15)
h1 = ParagraphStyle("h1", parent=base, fontName="Thai-Bold", fontSize=18, leading=24, spaceAfter=10, spaceBefore=6)
h2 = ParagraphStyle("h2", parent=base, fontName="Thai-Bold", fontSize=14, leading=20, spaceAfter=8, spaceBefore=12)
h3 = ParagraphStyle("h3", parent=base, fontName="Thai-Bold", fontSize=12, leading=18, spaceAfter=6, spaceBefore=8)
quote = ParagraphStyle("quote", parent=base, leftIndent=20, textColor=colors.HexColor("#333333"), spaceAfter=4)
bullet = ParagraphStyle("bullet", parent=base, leftIndent=18, bulletIndent=6, spaceAfter=2)
italic_note = ParagraphStyle("italic", parent=base, textColor=colors.HexColor("#555555"), spaceAfter=4)


def inline(text):
    # bold **text**
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    # italic *text*
    text = re.sub(r"(?<!\*)\*([^*]+?)\*(?!\*)", r"<i>\1</i>", text)
    return text


def parse_table(lines, idx):
    rows = []
    while idx < len(lines) and lines[idx].strip().startswith("|"):
        row = [c.strip() for c in lines[idx].strip().strip("|").split("|")]
        rows.append(row)
        idx += 1
    # drop separator row (---)
    if len(rows) > 1 and all(re.match(r"^:?-+:?$", c) for c in rows[1]):
        rows.pop(1)
    rows = [[inline(c) for c in r] for r in rows]
    data = [[Paragraph(c, base) for c in r] for r in rows]
    t = Table(data, repeatRows=1)
    t.setStyle(TableStyle([
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e8e8e8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTNAME", (0, 0), (-1, -1), "Thai"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return t, idx


def build_story(md_text):
    story = []
    lines = md_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped == "":
            i += 1
            continue

        if stripped == "---":
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", color=colors.grey, thickness=0.5))
            story.append(Spacer(1, 4))
            i += 1
            continue

        if stripped.startswith("# "):
            story.append(Paragraph(inline(stripped[2:]), h1))
            i += 1
            continue
        if stripped.startswith("## "):
            story.append(Paragraph(inline(stripped[3:]), h2))
            i += 1
            continue
        if stripped.startswith("### "):
            story.append(Paragraph(inline(stripped[4:]), h3))
            i += 1
            continue

        if stripped.startswith("|"):
            table, i = parse_table(lines, i)
            story.append(table)
            story.append(Spacer(1, 8))
            continue

        if stripped.startswith("> "):
            story.append(Paragraph(inline(stripped[2:]), quote))
            i += 1
            continue

        if stripped.startswith("- ") or re.match(r"^\d+\.\s", stripped):
            text = re.sub(r"^- ", "", stripped)
            text = re.sub(r"^\d+\.\s", "", text)
            story.append(Paragraph("&bull;&nbsp;&nbsp;" + inline(text), bullet))
            i += 1
            continue

        story.append(Paragraph(inline(stripped), base))
        i += 1

    return story


def main(src, dst):
    with open(src, "r", encoding="utf-8") as f:
        md_text = f.read()

    doc = SimpleDocTemplate(
        dst, pagesize=A4,
        topMargin=1.5 * cm, bottomMargin=1.5 * cm,
        leftMargin=1.8 * cm, rightMargin=1.8 * cm,
    )
    story = build_story(md_text)
    doc.build(story)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
