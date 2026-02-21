# Browser Components Bundling

This directory contains scripts for bundling custom browser components used by VideoML rendering.

## bundle-browser-components.ts

Builds `public/browser-components.js` (and sourcemap) from `scripts/browser-components.tsx`.

### Usage

Run from the `videos/` directory:

```bash
npx tsx scripts/bundle-browser-components.ts
```

### Notes

- The bundle is loaded by `vml render` via `--browser-bundle public/browser-components.js`.
- `esbuild-globals-plugin.ts` maps React/Remotion imports to the browser globals expected by the renderer.
- Output files in `public/` are generated artifacts and should not be committed.
