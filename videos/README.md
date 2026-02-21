# Tactus Videos (VideoML)

This folder is a VideoML-first video pipeline inside `Tactus-web/`. The canonical video sources live in `content/*.vml`.

## Quick Start

```bash
# From this folder:

# Install Node deps
npm install

# Set required environment variables
export VIDEOML_CLI="/Users/ryan.porter/Projects/VideoML/cli/bin/vml.js"
export BABULUS_BUNDLE="/Users/ryan.porter/Projects/Babulus/public/babulus-standard.js"

# Generate timelines + scripts from VML
npm run vml:generate

# Render MP4s to out/
npm run vml:render:all
```

## Project Structure

```
videos/
├── content/                      # One .vml per video (canonical source)
├── src/
│   ├── components/               # Custom React components used by VML
│   └── videos/                   # Generated script/timeline JSON outputs
├── public/
│   ├── browser-components.js     # Custom component bundle for renderer
│   └── videoml/                  # Provider segment cache (tracked) + local artifacts (ignored)
├── out/                          # Rendered MP4s (git-ignored)
└── package.json
```

## VideoML Pipeline

### Generate

`vml generate` reads `content/*.vml` and writes:

- `src/videos/<video>/<video>.script.json`
- `src/videos/<video>/<video>.timeline.json`

### Render

`vml render` uses:

- **Standard components** via `BABULUS_BUNDLE`
- **Custom components** via `public/browser-components.js`

Outputs:

- Frames: `out/frames/<video>/`
- MP4: `out/<video>.mp4`

## Audio Asset Policy

We **track provider-generated segment WAVs** (OpenAI / ElevenLabs / AWS) and ignore everything else.

Tracked:

- `public/videoml/**/env/**/segments/*--tts--*.wav`
- `public/videoml/**/env/**/segments/*--sfx--*.wav`

Ignored:

- `public/videoml/*.wav` (final mixes)
- `public/videoml/**/env/**/runs/**`
- `public/videoml/**/env/**/usage*.json`
- `public/videoml/**/env/**/manifest.json`
- `public/videoml/**/env/**/music/**`
- `public/videoml/**/env/**/segments/silence-*.wav`
