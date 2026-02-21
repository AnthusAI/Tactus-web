# Agent Documentation - Tactus Videos (VideoML)

This document provides structured information for AI agents working with the Tactus Videos project in its **VideoML-first** workflow.

## Technology Stack

- **Source format**: VideoML (`.vml`)
- **Renderer**: VideoML CLI + Babulus renderer bundles
- **Language**: TypeScript (custom components)
- **Runtime**: Node.js 20+

## Directory Structure

```
videos/
├── content/                      # Canonical VideoML sources (.vml)
├── src/
│   ├── components/               # Custom React components used by VideoML
│   └── videos/                   # Generated script/timeline JSON outputs
├── scripts/
│   ├── browser-components.tsx    # Registers custom components
│   └── bundle-browser-components.ts # Bundles custom components to browser JS
├── public/
│   ├── browser-components.js     # Built custom components bundle
│   └── videoml/                  # Provider segment cache (tracked) + local artifacts (ignored)
├── out/                          # Rendered MP4s (git-ignored)
└── package.json
```

## Required Environment Variables

- `VIDEOML_CLI` — absolute path to VideoML CLI (`VideoML/cli/bin/vml.js`)
- `BABULUS_BUNDLE` — absolute path to Babulus standard bundle (`Babulus/public/babulus-standard.js`)

## Core Workflow

1. **Edit VideoML** in `content/*.vml`
2. **Generate** scripts/timelines:
   ```bash
   npm run vml:generate
   ```
3. **Bundle custom components** (if components changed):
   ```bash
   npx tsx videos/scripts/bundle-browser-components.ts
   ```
4. **Render MP4s**:
   ```bash
   npm run vml:render:all
   ```

### Example render command (intro)

```bash
node $VIDEOML_CLI render \
  --script src/videos/intro/intro.script.json \
  --timeline src/videos/intro/intro.timeline.json \
  --audio public/videoml/intro.wav \
  --frames out/frames/intro \
  --out out/intro.mp4 \
  --browser-bundle $BABULUS_BUNDLE \
  --browser-bundle public/browser-components.js
```

## Adding a Custom Component

1. Implement a component in `src/components/`.
2. Register it in `scripts/browser-components.tsx`.
3. Rebuild the bundle:
   ```bash
   npx tsx videos/scripts/bundle-browser-components.ts
   ```

## Audio Asset Policy

We **track provider-generated segment WAVs** and ignore all other audio artifacts:

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
