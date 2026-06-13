"""
Scout's Gemini bridge — วิเคราะห์/ถอดสคริปต์วิดีโอสำหรับงานวิจัย
รับไฟล์วิดีโอ (local) หรือ YouTube URL แล้วถอด transcript + สรุปประเด็นสำคัญ

Usage:
    python scripts/gemini_video.py --file path/to/clip.mp4
    python scripts/gemini_video.py --youtube https://www.youtube.com/watch?v=...
"""

import argparse
import os
import sys
import time

from google import genai
from google.genai import types

PROMPT = (
    "วิเคราะห์วิดีโอนี้สำหรับงานวิจัยของ Scout:\n"
    "1. ถอด transcript คำพูดสำคัญ (ภาษาเดิมของวิดีโอ)\n"
    "2. สรุปประเด็นหลัก 3-5 ข้อ\n"
    "3. ถ้ามีข้อมูล/ตัวเลข/ภาพหน้าจอที่สำคัญ ระบุช่วงเวลาและอธิบาย\n"
    "ตอบเป็นภาษาไทย ใน format:\n"
    "## Transcript สรุป\n...\n\n## ประเด็นหลัก\n1. ...\n\n## ข้อมูล/ภาพสำคัญ\n- [mm:ss] ..."
)


def main():
    parser = argparse.ArgumentParser(description="Scout video analysis via Gemini")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--file", help="path to local video file")
    group.add_argument("--youtube", help="YouTube URL")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Gemini model (default: gemini-2.5-flash — gemini-2.5-pro ติด quota=0 บน free tier)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("ERROR: GEMINI_API_KEY ไม่ถูกตั้งค่า — ดู .env.example")

    client = genai.Client(api_key=api_key)

    if args.youtube:
        contents = [
            types.Content(parts=[
                types.Part(file_data=types.FileData(file_uri=args.youtube)),
                types.Part(text=PROMPT),
            ])
        ]
    else:
        uploaded = client.files.upload(file=args.file)
        # รอให้ Gemini ประมวลผลไฟล์วิดีโอเสร็จก่อนใช้งาน
        while uploaded.state.name == "PROCESSING":
            time.sleep(3)
            uploaded = client.files.get(name=uploaded.name)
        if uploaded.state.name == "FAILED":
            sys.exit("ERROR: อัปโหลดวิดีโอไป Gemini ไม่สำเร็จ")
        contents = [uploaded, PROMPT]

    response = client.models.generate_content(model=args.model, contents=contents)
    print(response.text)


if __name__ == "__main__":
    main()
