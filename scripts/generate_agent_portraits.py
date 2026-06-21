#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate photorealistic portraits for all AI agents using Gemini image generation.
Saves directly to dashboard/images/, replacing existing files.
Usage:
    python scripts/generate_agent_portraits.py
    python scripts/generate_agent_portraits.py --agent Laura
"""

import argparse
import io
import os
import sys
import time

from PIL import Image
from google import genai
from google.genai import types

# ─── Base style ─────────────────────────────────────────────────────────────
BASE = (
    "photorealistic portrait, hyperrealistic, sharp focus, "
    "professional photography, cinematic lighting, 8K UHD, "
    "detailed skin texture, natural depth of field, "
    "no cartoon, no anime, no illustration, no painting"
)
NEG = "cartoon, anime, illustration, painting, 3D render, CGI, blurry, watermark, deformed"

# ─── Agent prompts ───────────────────────────────────────────────────────────
AGENTS = {
    "Laura": (
        "photorealistic portrait of an elegant Thai professional woman in her late 20s, "
        "orchestrator and personal assistant, wearing a smart navy blue blazer, "
        "calm confident warm smile, modern office background with soft bokeh, "
        "short neat dark hair, intelligent eyes, "
        f"{BASE}"
    ),
    "Atlas": (
        "photorealistic portrait of a distinguished Thai professional man in his mid-40s, "
        "CEO coach and strategist, wearing a crisp dark suit with no tie, "
        "powerful confident posture, strong jaw, sharp focused eyes, "
        "subtle smile of a mentor, modern executive office background, "
        f"{BASE}"
    ),
    "Nova": (
        "photorealistic portrait of a cheerful Thai professional woman in her mid-20s, "
        "life manager and scheduler, wearing a bright clean white blouse, "
        "warm energetic smile, holding a tablet lightly, "
        "organized bright modern workspace background, lively expressive eyes, "
        f"{BASE}"
    ),
    "Eir": (
        "photorealistic portrait of a serene healer woman, "
        "inspired by Norse mythology healer goddess Eir, "
        "soft silver-white flowing hair, gentle luminous pale skin, "
        "wearing an elegant white and gold cleric robe, subtle magical glow around her, "
        "calm compassionate eyes, misty ethereal background, "
        "Lord of the Rings realism level, Weta Digital quality, "
        f"{BASE}"
    ),
    "Scout": (
        "photorealistic portrait of a sharp Thai professional man in his early 30s, "
        "researcher and analyst, wearing smart casual dark shirt and jacket, "
        "intelligent curious eyes, slight stubble, "
        "surrounded by subtle bookshelves and data screens in background, "
        f"{BASE}"
    ),
    "Council": (
        "photorealistic portrait of a wise distinguished Thai man in his 50s, "
        "strategic decision advisor, wearing a formal dark suit, "
        "silver-streaked hair, calm authoritative presence, "
        "thoughtful serious gaze, dark formal chamber background with soft lighting, "
        f"{BASE}"
    ),
    "Forge": (
        "photorealistic portrait of a focused Thai man in his early 30s, "
        "software developer and engineer, wearing a dark technical t-shirt, "
        "sharp focused eyes behind thin glasses, "
        "subtle code screens reflected in glasses, dark modern workspace background, "
        "capable hands visible at keyboard edge, "
        f"{BASE}"
    ),
    "Mint": (
        "photorealistic portrait of a sharp Thai professional woman in her early 30s, "
        "finance analyst, wearing a tailored emerald green blazer, "
        "confident precise gaze, sleek dark hair pulled back, "
        "subtle financial charts visible in background bokeh, "
        f"{BASE}"
    ),
    "Sage": (
        "photorealistic portrait of a calm wise Thai man in his late 40s, "
        "memory keeper and chronicler, wearing a simple dark linen shirt, "
        "kind deep eyes, reading glasses resting on nose, "
        "surrounded by warm candlelight and old leather books in background, "
        "serene thoughtful expression, "
        f"{BASE}"
    ),
    "Vera": (
        "photorealistic portrait of a precise sharp Thai professional woman in her early 30s, "
        "quality assurance specialist, wearing a structured grey blazer, "
        "watchful penetrating eyes behind thin-frame glasses, "
        "slight firm expression, clean minimal office background, "
        f"{BASE}"
    ),
    "Devil": (
        "photorealistic portrait of an intense Thai professional man in his 30s, "
        "adversarial reviewer and critical thinker, wearing a sharp black shirt, "
        "intense challenging eyes with a slight knowing smirk, "
        "dramatic chiaroscuro lighting, dark moody background, "
        "confident unsettling presence, "
        f"{BASE}"
    ),
    "Muse": (
        "photorealistic portrait of a vibrant creative Thai woman in her late 20s, "
        "content creator and idea generator, wearing a flowing artistic blouse, "
        "bright expressive eyes, slight ink stain on fingers, "
        "warm creative studio background with scattered notes and warm golden light, "
        "joyful imaginative expression, "
        f"{BASE}"
    ),
    "Lena": (
        "photorealistic portrait of an elegant knowledgeable Thai woman in her early 30s, "
        "vault librarian and knowledge synthesizer, wearing a sophisticated deep purple dress, "
        "calm intelligent eyes, hair in a neat bun with a pencil tucked in, "
        "surrounded by floor-to-ceiling bookshelves with soft warm library light, "
        f"{BASE}"
    ),
    "Cinder": (
        "photorealistic portrait of a calm Thai woman in her early 20s, "
        "maintenance and operations specialist, wearing a slightly scorched brown work apron "
        "over a simple dark shirt, short dark auburn hair, steady warm amber eyes, "
        "soft dim workshop background with warm ember-orange bokeh lighting, "
        "attentive composed expression, "
        f"{BASE}"
    ),
}

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "dashboard-svelte", "static", "images")
TARGET_SIZE = (1024, 1536)


def generate_portrait(client, name: str, prompt: str) -> bool:
    print(f"  Generating {name}...", end=" ", flush=True)
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash-image",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE", "TEXT"]
            ),
        )
        for part in response.candidates[0].content.parts:
            if part.inline_data is not None:
                img = Image.open(io.BytesIO(part.inline_data.data))
                img = img.resize(TARGET_SIZE, Image.LANCZOS)
                out_path = os.path.join(OUTPUT_DIR, f"{name}.png")
                img.save(out_path, "PNG")
                print(f"saved → {out_path}")
                return True
        print("no image in response")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--agent", help="Generate only this agent (optional)")
    args = parser.parse_args()

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        sys.exit("ERROR: GEMINI_API_KEY ไม่ถูกตั้งค่า")

    client = genai.Client(api_key=api_key)

    targets = {args.agent: AGENTS[args.agent]} if args.agent else AGENTS
    if args.agent and args.agent not in AGENTS:
        sys.exit(f"ERROR: ไม่พบ agent '{args.agent}'. ตัวเลือก: {list(AGENTS.keys())}")

    print(f"Generating {len(targets)} portrait(s)...\n")
    ok, fail = 0, []
    for name, prompt in targets.items():
        success = generate_portrait(client, name, prompt)
        if success:
            ok += 1
        else:
            fail.append(name)
        if len(targets) > 1:
            time.sleep(3)  # rate limit buffer

    print(f"\nDone: {ok} success, {len(fail)} failed")
    if fail:
        print(f"Failed: {fail}")


if __name__ == "__main__":
    main()
