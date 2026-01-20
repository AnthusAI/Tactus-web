#!/usr/bin/env python3
"""Test compile guardrails.babulus.yml and show what segments are generated"""

import sys
import os
from pathlib import Path

# Add Babulus to path
babulus_path = Path.home() / 'Projects' / 'Babulus'
sys.path.insert(0, str(babulus_path))

from babulus.voiceover_dsl import load_voiceover_yaml

def main():
    dsl_file = Path(__file__).parent / 'content' / 'guardrails.babulus.yml'

    print(f"Compiling {dsl_file}...")
    print()

    try:
        with open(dsl_file) as f:
            text = f.read()
        voiceover, scenes, audio = load_voiceover_yaml(text)
    except Exception as e:
        print(f"Error compiling: {e}")
        import traceback
        traceback.print_exc()
        return 1

    print(f"Compiled successfully!")
    print(f"Scenes: {len(scenes)}")
    print()

    # Check each scene for voice segments
    for scene in scenes:
        print(f"Scene: {scene.id}")

        for cue in scene.cues:
            voice = getattr(cue, 'voice', None)
            if voice is None:
                continue

            print(f"  Cue: {cue.id}")

            segments = getattr(voice, 'segments', [])
            for i, seg in enumerate(segments):
                seg_type = type(seg).__name__
                if hasattr(seg, 'text'):
                    text = seg.text
                    text_preview = text[:50] if len(text) > 50 else text
                    print(f"    Segment {i+1}: {seg_type} - {len(text)} chars - {text_preview!r}{'...' if len(text) > 50 else ''}")

                    # Flag short or problematic segments
                    if len(text.strip()) == 0:
                        print(f"      ⚠️  EMPTY TEXT!")
                    elif len(text.strip()) < 10:
                        print(f"      ⚠️  VERY SHORT: {text.strip()!r}")
                    elif text.strip() == 'Tactus':
                        print(f"      ⚠️  EXACTLY 'Tactus'")
                elif hasattr(seg, 'seconds'):
                    print(f"    Segment {i+1}: {seg_type} - {seg.seconds}s pause")
                else:
                    print(f"    Segment {i+1}: {seg_type}")

            print()

    return 0

if __name__ == '__main__':
    sys.exit(main())
