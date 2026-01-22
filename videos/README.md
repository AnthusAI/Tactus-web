# Tactus Videos (Remotion)

This folder is a Remotion subproject inside `Tactus-web/`. Video timing + audio generation are driven by the Node/TypeScript `babulus` CLI.

## Quick Start

```bash
# From this folder:

# Install Node deps (includes babulus)
npm install

# Start Remotion Studio
npm start

# Generate audio/timelines from `content/*.babulus.ts` (idempotent)
npm run babulus:generate

# Render videos to `out/`
npm run render
```

If you’re working from the Gatsby repo root (`Tactus-web/`):

```bash
# Open Remotion Studio
npm run videos:studio

# Render videos and copy them into `static/videos/`
npm run videos:render
```

## Project Structure

```
videos/
├── src/
│   ├── components/       # Reusable React components for videos
│   ├── videos/           # Individual video compositions
│   ├── Root.tsx          # Main composition registry
│   └── index.ts          # Entry point
├── scripts/
│   └── render-all.js     # Automated rendering script
├── out/                  # Rendered videos (git-ignored)
├── content/              # One `.babulus.ts` per video
├── public/babulus/       # Staged audio/timeline assets (git-ignored)
├── .babulus/             # Local config + generated cache (git-ignored)
└── package.json
```

## Babulus (Voiceover -> Timing)

Each video has one TypeScript DSL file under `content/`:

```bash
content/intro.babulus.ts
```

When you run `babulus:generate`, Babulus:

- Generates audio clips per voice segment (cached/idempotent).
- Computes `startSec/endSec` from the real audio durations.
- Stages the artifacts into Remotion-friendly locations under `public/babulus/` and `src/videos/*/*.script.json`.

### Poster Images (Thumbnails)

You can specify a poster timestamp per composition via the DSL:

```ts
comp.posterTime(3.5);
```

When you run `npm run render`, the render script will:
1. Extract a frame at the specified timestamp using FFmpeg
2. Save it as `{video-name}-poster.jpg` in the `out/` directory
3. Embed the poster directly into the MP4 file (no re-encoding, zero quality loss)

### Config / API keys

Put credentials in one of:

- `videos/.babulus/config.yml` (recommended for this repo)
- `~/.babulus/config.yml`

See `.babulus/config.example.yml` for a complete configuration template.

For full Babulus docs, see `../../Babulus/README.md`.
