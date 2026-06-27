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
# Every prompt keeps a visible, photorealistic trace of the agent's fantasy
# race/species fused with Jed's present-day world — NOT a plain human in
# costume. See characters/*.md for the full per-agent reference and
# memory/feedback_photorealistic_character_prompts.md for why this matters.
AGENTS = {
    "Laura": (
        "photorealistic portrait of a young Silver Elf woman in her mid-20s, subtly pointed elf "
        "ears, luminous pale skin with a faint silver sheen, calm silver-toned hair styled "
        "half-up half-down, soft grey-purple eyes — elven heritage fused naturally into a "
        "polished modern office aesthetic, wearing a smart navy-and-silver blazer, calm "
        "confident expression, modern office background with soft bokeh, "
        f"{BASE}"
    ),
    "Atlas": (
        "photorealistic portrait of a broad-shouldered Dwarven-Human half-blood man in his "
        "early 50s, stocky dwarvish build with a dignified stone-grey undertone to his "
        "skin, faintly pointed ears half-hidden under short dark grey hair, a trimmed "
        "salt-and-pepper beard with two small braided locks held by tiny metal beads — fantasy "
        "heritage fused naturally with modern executive style, wearing a crisp dark suit with "
        "no tie, powerful confident posture, sharp focused eyes, modern executive office "
        "background, "
        f"{BASE}"
    ),
    "Nova": (
        "photorealistic portrait of a young Forest Sprite woman in her early 20s, subtly "
        "pointed elf-like ears, faint leaf-green vein-like markings at her temples, hair with "
        "a few natural leaf-green highlights — forest sprite heritage fused naturally into a "
        "practical modern athleisure-meets-herbalist look, wearing a light sage-green outfit "
        "with a herbalist-style apron, warm energetic smile, organized bright modern workspace "
        "background, "
        f"{BASE}"
    ),
    "Eir": (
        "photorealistic portrait of a young Half-Elf Cleric woman, subtly pointed elf ears, "
        "soft icy-blue toned hair, calm turquoise eyes, a faint soft golden healing-rune glow "
        "visible on her palms — elven heritage fused naturally into a modern healthcare-worker "
        "aesthetic, wearing a white-and-pastel-blue medical-cleric-inspired uniform, calm "
        "compassionate eyes, soft modern wellness-clinic background, "
        f"{BASE}"
    ),
    "Scout": (
        "photorealistic portrait of a young Halfling-Rogue man in his mid-20s, noticeably "
        "shorter halfling stature with a slim nimble build, slightly rounded ears — halfling "
        "heritage fused naturally into a modern streetwear-meets-field-researcher look, "
        "wearing an oversized beige trench coat over a dark turtleneck, intelligent curious "
        "eyes, subtle bookshelves and data screens in background, "
        f"{BASE}"
    ),
    "Council": (
        "photorealistic portrait of an ancient-construct humanoid figure (one voice of the "
        "Triumvirate), immaculately polished bronze-and-stone plating across visible joints fused "
        "seamlessly with sleek matte-black modern tech panels, faint glowing rune-etched seams, "
        "softly glowing eyes — ancient golem craftsmanship blended with contemporary minimalist "
        "design, wearing a modern tailored dark suit layered over the construct frame, calm "
        "authoritative presence, dark formal chamber background with soft lighting, "
        f"{BASE}"
    ),
    "Forge": (
        "photorealistic portrait of a stocky muscular Gnome-Dwarf hybrid man in his early 30s, "
        "a dwarvish stocky build with subtly pointed gnome-like ears, clean well-maintained "
        "forearms, AR smart-glasses pushed up on his forehead — a deliberate three-way fusion "
        "of classic blacksmith, industrial machinist, and modern digital-tech engineer, all "
        "rendered spotless and professional: wearing a crisp leather blacksmith apron layered "
        "over a clean pressed industrial machinist coverall with neatly organized tool loops, "
        "plus a modern tech utility vest with a sleek tablet clipped to it, confident focused "
        "eyes, clean polished workshop background blending a gleaming anvil and well-maintained "
        "gears with a floating holographic schematic, "
        f"{BASE}"
    ),
    "Mint": (
        "photorealistic portrait of a tall elegant High Human Merchant Noble woman in her early "
        "30s, sharp golden-brown eyes with faint golden flecks, a small noble-crest signet ring "
        "hinting at her merchant-noble lineage — noble heritage fused naturally into sharp "
        "modern finance-executive style, wearing a tailored emerald green blazer, confident "
        "precise gaze, sleek dark hair pulled back, subtle financial charts in background "
        "bokeh, "
        f"{BASE}"
    ),
    "Sage": (
        "photorealistic portrait of an androgynous Spirit Fox / Kitsune Elder with an ageless "
        "youthful appearance, subtle fox-like ears peeking through long straight white hair "
        "with a soft-lavender sheen, a softly visible fox tail, faint fox-marking patterns near "
        "the eyes, heterochromia eyes (left light purple, right gold) — kitsune heritage fused "
        "naturally into a modern minimalist fashion sensibility, wearing a minimalist "
        "cardigan-robe blending traditional kitsune motifs with contemporary style, calm "
        "observant expression, warm candlelit library background, "
        f"{BASE}"
    ),
    "Vera": (
        "photorealistic portrait of a precise Clockwork Inspector / Golem-kin woman in her "
        "early 30s, faint visible brass clockwork seams and fine engraved metallic patterns at "
        "her neck and wrists, a subtly metallic-toned undertone to her skin — golem-kin "
        "heritage fused naturally into a crisp modern inspector look, wearing a structured grey "
        "blazer with brass clockwork accents, watchful penetrating eyes, clean minimal office "
        "background, "
        f"{BASE}"
    ),
    "Devil": (
        "photorealistic portrait of a composed Mirror Demon man in his 30s, a faint dark "
        "violet-grey undertone to his skin, small smooth curved horns subtly visible through "
        "swept-back dark hair, sharp glowing amber-red eyes with faint vertical pupils — "
        "demonic heritage rendered with restraint and fused into a sharp modern silhouette, "
        "wearing a sharp black shirt, dramatic chiaroscuro lighting, dark moody background, "
        f"{BASE}"
    ),
    "Muse": (
        "photorealistic portrait of a young Lumina Fairy woman in her late teens/early 20s, "
        "faint small luminous wing silhouettes shimmering behind her shoulders, softly glowing "
        "skin where her freckles catch the light like tiny stars — fairy heritage fused "
        "naturally into a modern creative streetwear look, wearing a flowing artistic blouse, "
        "bright expressive eyes, warm creative studio background with a few soft light "
        "particles drifting around her, "
        f"{BASE}"
    ),
    "Lena": (
        "photorealistic portrait of a young Archive Sprite / Sylph woman in her early 20s, "
        "faint translucent dragonfly-like wing silhouettes barely visible behind her shoulders, "
        "a subtle soft blue-white glow beneath her skin — sprite heritage fused quietly into a "
        "modern archivist look, wearing a sophisticated deep purple outfit, calm intelligent "
        "eyes, hair in a neat bun with a pencil tucked in, floor-to-ceiling bookshelves with "
        "soft warm library light, "
        f"{BASE}"
    ),
    "Cinder": (
        "photorealistic portrait of a young Ember Sprite woman in her late teens, a warm "
        "ember-glow undertone to her skin and faint glowing hairline cracks like cooling lava "
        "across her forearms and collarbone, an AR welding visor flipped up on her forehead — "
        "a deliberate three-way fusion of classic blacksmith, industrial machinist, and modern "
        "digital-tech engineer, all rendered spotless and professional: wearing a crisp "
        "leather apron layered over a clean pressed industrial mechanic coverall, plus a "
        "modern tech repair vest holding a sleek digital diagnostic tablet, steady warm amber "
        "eyes, clean polished workshop background blending a well-kept forge anvil with "
        "humming machinery and a floating holographic schematic, "
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
