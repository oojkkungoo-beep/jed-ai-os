"""
Devil's Gemini bridge — adversarial review ของงานจาก Claude agent อื่น
ใช้เมื่อ agent ต้นทาง (Muse, Scout, Council, Atlas) ใช้ Claude model อยู่แล้ว
เพื่อให้ได้มุมมองจาก "คนละ provider" จริงๆ

Usage:
    python scripts/gemini_review.py --mode A --file path/to/draft.md
    python scripts/gemini_review.py --mode B --text "เนื้อหา kill-condition ..."
"""

import argparse
import os
import sys

from google import genai

MODE_PROMPTS = {
    "A": (
        "คุณคือ 'Devil' — adversarial reviewer Mode A (Bear Case)\n"
        "อ่าน draft/research ต่อไปนี้ แล้วหาเหตุผลที่ 'นี่อาจผิด' หรือ 'นี่อาจไม่เวิร์ก' "
        "อย่างน้อย 3 ข้อ พร้อมอธิบายผลกระทบถ้าข้อนั้นเป็นจริง\n"
        "ตอบเป็นภาษาไทย ใน format:\n"
        "## ท้าทาย\n1. ...\n2. ...\n3. ...\n\n## ถ้าข้อ 1 เป็นจริง\n...\n\n## สรุป\n[ยังไปต่อได้ / ควรแก้ก่อน / เสี่ยงเกินไป]"
    ),
    "B": (
        "คุณคือ 'Devil' — adversarial reviewer Mode B (Polarity Audit)\n"
        "อ่าน decision/kill-condition ต่อไปนี้ แล้วเช็คว่าเงื่อนไข 'เมื่อไหร่จะหยุด/เปลี่ยนทาง' "
        "ครอบคลุมพอไหม มี edge case ที่ทำให้ติดอยู่ในทางที่ผิดได้ไหม\n"
        "ตอบเป็นภาษาไทย ใน format:\n"
        "## ท้าทาย\n1. ...\n2. ...\n\n## Edge case ที่ยังไม่ครอบคลุม\n...\n\n## สรุป\n[ยังไปต่อได้ / ควรแก้ก่อน / เสี่ยงเกินไป]"
    ),
    "C": (
        "คุณคือ 'Devil' — adversarial reviewer Mode C (Evidence Match)\n"
        "อ่าน claim/insight ต่อไปนี้ที่จะนำไป publish แล้วเทียบกับความรู้ทั่วไปที่คุณมี "
        "ว่ามีอะไรขัดแย้ง หรือไม่ถูกพูดถึงในเนื้อหานี้ไหม\n"
        "ตอบเป็นภาษาไทย ใน format:\n"
        "## ท้าทาย\n1. ...\n2. ...\n\n## สิ่งที่ขัดแย้ง/ไม่ถูกพูดถึง\n...\n\n## สรุป\n[ยังไปต่อได้ / ควรแก้ก่อน / เสี่ยงเกินไป]"
    ),
}


def main():
    parser = argparse.ArgumentParser(description="Devil adversarial review via Gemini")
    parser.add_argument("--mode", required=True, choices=["A", "B", "C"], help="Devil review mode")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--file", help="path to file ที่จะตรวจ")
    group.add_argument("--text", help="เนื้อหาตรงๆ ที่จะตรวจ")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model (default: gemini-2.5-flash — gemini-2.5-pro ติด quota=0 บน free tier)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("ERROR: GEMINI_API_KEY ไม่ถูกตั้งค่า — ดู .env.example")

    content = open(args.file, encoding="utf-8").read() if args.file else args.text

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=args.model,
        contents=f"{MODE_PROMPTS[args.mode]}\n\n---\n\n{content}",
    )
    print(response.text)


if __name__ == "__main__":
    main()
