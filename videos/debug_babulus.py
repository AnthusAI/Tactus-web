#!/usr/bin/env python3
"""Debug script to find the problematic segment in guardrails.babulus.yml"""

import yaml
import sys
from pathlib import Path

def check_voice_segments(yaml_file):
    """Check all voice segments for issues"""
    with open(yaml_file) as f:
        data = yaml.safe_load(f)

    issues = []

    for scene in data.get('scenes', []):
        scene_id = scene.get('id', 'unknown')

        for cue in scene.get('cues', []):
            cue_id = cue.get('id', 'unknown')
            voice = cue.get('voice', {})

            if not isinstance(voice, dict):
                continue

            segments = voice.get('segments', [])

            for seg_idx, seg in enumerate(segments):
                if not isinstance(seg, dict):
                    continue

                if 'voice' in seg:
                    text = seg['voice']

                    # Check various conditions
                    if text is None:
                        issues.append({
                            'scene': scene_id,
                            'cue': cue_id,
                            'segment': seg_idx + 1,
                            'issue': 'Text is None',
                            'text': text
                        })
                    elif not isinstance(text, str):
                        issues.append({
                            'scene': scene_id,
                            'cue': cue_id,
                            'segment': seg_idx + 1,
                            'issue': f'Text is {type(text).__name__}, not string',
                            'text': text
                        })
                    elif len(text.strip()) == 0:
                        issues.append({
                            'scene': scene_id,
                            'cue': cue_id,
                            'segment': seg_idx + 1,
                            'issue': 'Text is empty or whitespace',
                            'text': repr(text)
                        })
                    elif len(text.strip()) < 10:
                        issues.append({
                            'scene': scene_id,
                            'cue': cue_id,
                            'segment': seg_idx + 1,
                            'issue': f'Text is very short ({len(text.strip())} chars)',
                            'text': repr(text.strip())
                        })
                    elif text.strip() == 'Tactus':
                        issues.append({
                            'scene': scene_id,
                            'cue': cue_id,
                            'segment': seg_idx + 1,
                            'issue': 'Text is exactly "Tactus"',
                            'text': repr(text)
                        })

    return issues

def main():
    yaml_file = Path(__file__).parent / 'content' / 'guardrails.babulus.yml'

    print(f"Checking {yaml_file}...")
    print()

    issues = check_voice_segments(yaml_file)

    if not issues:
        print("✓ No issues found!")
        return 0

    print(f"✗ Found {len(issues)} issue(s):\n")

    for i, issue in enumerate(issues, 1):
        print(f"{i}. {issue['issue']}")
        print(f"   Scene: {issue['scene']}")
        print(f"   Cue: {issue['cue']}")
        print(f"   Segment: {issue['segment']}")
        print(f"   Text: {issue['text']}")
        print()

    return 1

if __name__ == '__main__':
    sys.exit(main())
