#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""สร้าง PDF คู่มือ: วิธีทำทีมเลขา AI Agent แบบ Laura Orchestrator"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem, HRFlowable
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ลงทะเบียนฟอนต์ไทย
pdfmetrics.registerFont(TTFont("Leelawadee", "C:/Windows/Fonts/LeelawUI.ttf"))
pdfmetrics.registerFont(TTFont("Leelawadee-Bold", "C:/Windows/Fonts/LeelaUIb.ttf"))

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "ThaiTitle", parent=styles["Title"], fontName="Leelawadee-Bold",
    fontSize=20, leading=26, spaceAfter=6, textColor=colors.HexColor("#1a3c6e")
)
h1_style = ParagraphStyle(
    "ThaiH1", parent=styles["Heading1"], fontName="Leelawadee-Bold",
    fontSize=14, leading=20, spaceBefore=14, spaceAfter=6,
    textColor=colors.HexColor("#1a3c6e")
)
h2_style = ParagraphStyle(
    "ThaiH2", parent=styles["Heading2"], fontName="Leelawadee-Bold",
    fontSize=12, leading=18, spaceBefore=8, spaceAfter=4,
    textColor=colors.HexColor("#2e5a9e")
)
body_style = ParagraphStyle(
    "ThaiBody", parent=styles["Normal"], fontName="Leelawadee",
    fontSize=10.5, leading=16, spaceAfter=4
)
bullet_style = ParagraphStyle(
    "ThaiBullet", parent=body_style, leftIndent=12, bulletIndent=0, spaceAfter=3
)
caption_style = ParagraphStyle(
    "ThaiCaption", parent=body_style, fontSize=9, textColor=colors.grey,
    spaceBefore=2, spaceAfter=12
)

story = []

story.append(Paragraph("คู่มือสร้างทีมเลขา AI Agent", title_style))
story.append(Paragraph("แนวทาง Laura Orchestrator (Claude Code)", caption_style))
story.append(HRFlowable(width="100%", color=colors.HexColor("#cccccc")))
story.append(Spacer(1, 10))

story.append(Paragraph(
    "เอกสารนี้สรุปวิธีตั้งระบบ \"ทีมเลขา AI\" ที่มี orchestrator หลัก 1 ตัว "
    "ทำหน้าที่รับงานแล้วส่งต่อให้ agent ผู้เชี่ยวชาญแต่ละด้าน "
    "(แนวทางที่ Jed ใช้งานจริงผ่าน Claude Code)",
    body_style
))

# ภาพรวมระบบ
story.append(Paragraph("ภาพรวมระบบ", h1_style))
story.append(Paragraph(
    "ระบบประกอบด้วยไฟล์ <b>CLAUDE.md</b> 1 ไฟล์เป็นสมองกลาง กำหนดตัวตนของ "
    "agent หลัก (orchestrator) และตาราง routing ว่างานแบบไหนส่งต่อให้ agent "
    "ไหน จากนั้นแต่ละ agent ย่อยจะมีไฟล์บุคลิก/scope ของตัวเองแยกไว้ในโฟลเดอร์ "
    "<b>team/</b>",
    body_style
))

# ขั้นตอน
story.append(Paragraph("ขั้นตอนการทำ", h1_style))

story.append(Paragraph("1. สมัครและติดตั้ง", h2_style))
story.append(ListFlowable([
    ListItem(Paragraph(
        "สมัครบัญชี Claude ที่ claude.ai (แนะนำแพ็กเกจ Pro ขึ้นไป "
        "ถ้าจะใช้งานหนักทุกวัน)", bullet_style)),
    ListItem(Paragraph(
        "ติดตั้ง <b>Claude Code</b> (CLI) — เครื่องมือที่รันระบบ orchestrator "
        "แบบนี้ได้ ต้องมี Node.js ก่อน แล้วลงแพ็กเกจ <b>@anthropic-ai/claude-code</b>",
        bullet_style)),
], bulletType="bullet"))

story.append(Paragraph("2. สร้างโฟลเดอร์โปรเจกต์", h2_style))
story.append(ListFlowable([
    ListItem(Paragraph(
        "สร้างโฟลเดอร์เปล่า 1 อันเป็น \"บ้าน\" ของระบบ (เช่น <b>MyOrg/</b>)",
        bullet_style)),
    ListItem(Paragraph(
        "ใน root ใส่ไฟล์ <b>CLAUDE.md</b> — ไฟล์นี้ Claude Code จะโหลดอ่าน "
        "อัตโนมัติทุกครั้งที่เริ่ม session", bullet_style)),
], bulletType="bullet"))

story.append(Paragraph("3. เขียน CLAUDE.md — ตัวตน Orchestrator", h2_style))
story.append(ListFlowable([
    ListItem(Paragraph(
        "กำหนดชื่อ/บุคลิกของ agent หลัก (เช่น Laura)", bullet_style)),
    ListItem(Paragraph(
        "เขียนตาราง routing: คำ/เรื่องแบบไหน → ส่งต่อ agent ไหน → อ่านไฟล์ "
        "บุคลิกที่ไหน", bullet_style)),
    ListItem(Paragraph(
        "กำหนดกฎกลาง เช่น ต้องระบุชื่อ agent ก่อนตอบทุกครั้ง, โทนการพูด, "
        "ข้อห้าม (เช่น ห้าม push code โดยไม่ขออนุญาต)", bullet_style)),
], bulletType="bullet"))

story.append(Paragraph("4. สร้างทีม agent ย่อย", h2_style))
story.append(ListFlowable([
    ListItem(Paragraph(
        "สร้างโฟลเดอร์ <b>team/</b> แล้วทำไฟล์ .md แยกตามหน้าที่ เช่น "
        "<b>idea.md</b>, <b>life.md</b>, <b>finance.md</b>, <b>forge.md</b> "
        "(โค้ด), <b>qa.md</b>", bullet_style)),
    ListItem(Paragraph(
        "แต่ละไฟล์เขียนบุคลิก + scope งาน + วิธีทำงานของ agent นั้น",
        bullet_style)),
], bulletType="bullet"))

story.append(Paragraph("5. ระบบ memory ระยะยาว (ถ้าอยากให้จำข้าม session)", h2_style))
story.append(ListFlowable([
    ListItem(Paragraph(
        "ใช้โฟลเดอร์ memory (เช่น <b>MEMORY.md</b> + ไฟล์ย่อยตามหัวข้อ) "
        "ให้ agent บันทึกข้อมูลผู้ใช้/feedback/บริบทโปรเจกต์ แล้วโหลดมาอ่าน "
        "ทุกครั้ง", bullet_style)),
], bulletType="bullet"))

story.append(Paragraph("6. ทดลองใช้ + ปรับ", h2_style))
story.append(ListFlowable([
    ListItem(Paragraph(
        "เริ่มคุยงานจริง ดูว่า routing แม่นไหม ปรับคำสั่งใน CLAUDE.md เรื่อยๆ",
        bullet_style)),
    ListItem(Paragraph(
        "ค่อยๆ เพิ่ม agent ใหม่ตามงานที่ขาดไป", bullet_style)),
], bulletType="bullet"))

# โครงสร้างตัวอย่าง
story.append(Paragraph("โครงสร้างไฟล์ตัวอย่าง", h1_style))
example_style = ParagraphStyle(
    "ThaiCode", parent=body_style, fontName="Leelawadee",
    backColor=colors.HexColor("#f4f4f4"), borderPadding=6, leading=14
)
story.append(Paragraph(
    "MyOrg/<br/>"
    "&nbsp;&nbsp;CLAUDE.md&nbsp;&nbsp;&nbsp;&nbsp;# ตัวตน orchestrator + ตาราง routing<br/>"
    "&nbsp;&nbsp;team/<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;idea.md<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;life.md<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;finance.md<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;forge.md<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;qa.md<br/>"
    "&nbsp;&nbsp;memory/<br/>"
    "&nbsp;&nbsp;&nbsp;&nbsp;MEMORY.md&nbsp;&nbsp;# ดัชนีความจำระยะยาว",
    example_style
))

story.append(Spacer(1, 16))
story.append(HRFlowable(width="100%", color=colors.HexColor("#cccccc")))
story.append(Paragraph(
    "สรุปโดย Laura — Personal AI Orchestrator ของ Jed", caption_style
))

doc = SimpleDocTemplate(
    "D:/Claude_Cowork/Jed_org/output/content/AI_Secretary_Team_Guide.pdf",
    pagesize=A4,
    topMargin=2*cm, bottomMargin=2*cm, leftMargin=2*cm, rightMargin=2*cm,
)
doc.build(story)
print("Done")
