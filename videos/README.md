# Tactus Videos (Remotion)

This folder is a Remotion subproject inside `Tactus-web/`. Video timing + audio generation are driven by the Python package `babulus`.

## Quick Start

```bash
# From this folder:

# Install Node deps
npm install

# Start Remotion Studio
npm start

# Generate audio/timelines from `content/*.babulus.yml` (idempotent)
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
│   │   └── Title.tsx     # Example: Animated title component
│   ├── videos/           # Individual video compositions
│   │   └── intro/        # Intro video
│   ├── lib/              # Utility functions and helpers
│   ├── tactus/           # Tactus-specific logic and assets
│   ├── Root.tsx          # Main composition registry
│   └── index.ts          # Entry point
├── scripts/
│   └── render-all.js     # Automated rendering script
├── out/                  # Rendered videos (git-ignored)
├── content/              # One `.babulus.yml` per video
├── public/babulus/       # Staged audio/timeline assets (git-ignored)
├── .babulus/             # Local config + generated cache (git-ignored)
├── package.json
├── tsconfig.json
└── remotion.config.ts
```

## Path Aliases

The project uses TypeScript path aliases for clean imports:

| Alias | Resolves To | Purpose |
|-------|-------------|---------|
| `@/components/*` | `src/components/*` | Shared UI components |
| `@/videos/*` | `src/videos/*` | Video compositions |
| `@/lib/*` | `src/lib/*` | Utility functions |
| `@/tactus/*` | `src/tactus/*` | Tactus-specific code |
| `@/babulus/*` | `src/babulus/*` | Narration DSL + script types |

Example:
```typescript
import { Title } from "@/components/Title";
```

## Babulus (Voiceover → Timing)

Each video has exactly one YAML DSL file under `content/`:

```bash
content/intro.babulus.yml
```

When you run `babulus:generate`, Babulus:

- Generates audio clips per `voice:` segment (cached/idempotent).
- Computes `startSec/endSec` from the real audio durations.
- Stages the artifacts into the Remotion-friendly locations under `public/babulus/` and `src/videos/*/*.script.json`.

### Poster Images (Thumbnails)

You can specify a timestamp for extracting a poster image (thumbnail) that displays before the video plays:

```yaml
# At the root level of your .babulus.yml file:
poster_time: "3.5s"  # Extract frame at 3.5 seconds

audio:
  # ... audio config

scenes:
  # ... scene definitions
```

When you run `npm run render`, the render script will:
1. Extract a frame at the specified timestamp using FFmpeg
2. Save it as `{video-name}-poster.jpg` in the `out/` directory
3. Embed the poster directly into the MP4 file (no re-encoding, zero quality loss)
4. Upload all files to S3

The poster JPG will be displayed in the HTML5 video player before playback starts. The MP4 file also contains an embedded thumbnail (using FFmpeg's `-c copy` with no re-encoding) that will be visible in file browsers (Finder, Windows Explorer, etc.).

#### Caching and Selective Rendering

The render script supports caching to avoid re-rendering existing videos:

```bash
# Render all videos (skip existing)
npm run render

# Re-render all videos from scratch
npm run render -- --fresh

# Render only one video (skip if exists)
npm run render -- intro

# Force re-render one video
npm run render -- intro --fresh
```

Videos are cached based on the presence of the output `.mp4` file. Use `--fresh` to force re-rendering.

### Install Babulus (local dev)

In your Python env (example uses your existing conda env):

```bash
/opt/anaconda3/envs/py311/bin/python -m pip install -e ../../Babulus -U
```

### Config / API keys

Put credentials in one of:

- `videos/.babulus/config.yml` (recommended for this repo)
- `~/.babulus/config.yml`

See `.babulus/config.example.yml` for a complete configuration template.

### TTS Provider Configuration

Babulus supports multiple TTS providers with configurable models and voices. Configuration happens at two levels:

#### 1. Global Config (`.babulus/config.yml`)

Set default providers, models, and voices for your project:

```yaml
providers:
  elevenlabs:
    api_key: "sk_xxxxx"
    voice_id: "your_voice_id"
    model_id: "eleven_v3"           # Best quality for production

  openai:
    api_key: "sk_xxxxx"
    model: "tts-1"                  # Fast for development
    voice: "alloy"
```

#### 2. Per-Video Overrides (DSL files)

Override model/voice for specific videos or environments in your `.babulus.yml`:

```yaml
voiceover:
  provider:
    development: openai             # Fast iteration
    production: elevenlabs          # Best quality

  # Optional: Override model per environment
  model:
    development: "tts-1"
    production: "eleven_v3"

  # Optional: Override voice per environment
  voice:
    development: "alloy"
    production: "your_voice_id"
```

**Available models:**
- **ElevenLabs:** `eleven_v3` (best), `eleven_multilingual_v2`, `eleven_turbo_v2_5`, `eleven_flash_v2_5`
- **OpenAI:** `tts-1` (standard), `tts-1-hd` (higher quality), `gpt-4o-mini-tts`
- **AWS Polly:** No model parameter (use `engine: "neural"` or `"standard"`)
- **Azure Speech:** No model parameter (tier is in voice name: `*-Neural` or `*-Standard`)

For complete documentation, see:
- [Babulus README](../../Babulus/README.md) - Full model/voice configuration guide
- [ElevenLabs Guide](../../Babulus/docs/elevenlabs-guide.md) - ElevenLabs-specific features
- [Config Example](.babulus/config.example.yml) - All available options

## Commands

### Common

- `npm start` - Remotion Studio
- `npm run babulus:generate` - Generate audio + timings (cached by default)
- `npm run babulus:watch` - Regenerate on edits
- `npm run render` - Render all compositions listed in `scripts/render-all.js`
- `npm run render:intro` - Render just the intro video
- `npm test` - Lint + typecheck

### No confusing `npm -- --args`

If you don’t want npm’s argument separator, run Babulus directly:

```bash
./bin/babulus generate
./bin/babulus sfx next --clip whoosh --variants 8
```

## Creating New Videos

1. **Create video directory**: `src/videos/<video-name>/`
2. **Create component file**: `src/videos/<video-name>/<VideoName>.tsx`
3. **Implement the video component**:
   ```typescript
   import React from "react";
   import { AbsoluteFill, Sequence } from "remotion";
   import { Title } from "@/components/Title";

   export const MyVideo: React.FC = () => {
     return (
       <AbsoluteFill>
         <Sequence from={0} durationInFrames={150}>
           <Title text="My Video" subtitle="Description" />
         </Sequence>
       </AbsoluteFill>
     );
   };
   ```
4. **Register in Root.tsx**:
   ```typescript
   import { MyVideo } from "@/videos/<video-name>/<VideoName>";
   
   // Add to RemotionRoot component:
   <Composition
     id="MyVideo"
     component={MyVideo}
     durationInFrames={150}
     fps={30}
     width={1920}
     height={1080}
   />
   ```

## Tactus Branding

The project uses the Tactus website's light mode design system with:
- **Primary Color**: `#c7007e` (Magenta/Pink)
- **Fonts**: Source Sans 3, Source Serif 4, Source Code Pro
- **Background**: Off-white paper texture (`#fdfdfd`)

## Reusable Components

The `src/components/` directory contains branded components:

- **GlobalStyles**: Font loading and global styling wrapper
- **Layout/Container**: Flexbox containers with consistent spacing
- **Typography**: H1, H2, H3, Body, Code, Subtitle components
- **Card/CodeBlock**: Surface components with elevation
- **Title**: Legacy animated title component

### Creating a Reusable Component

1. Create file: `src/components/<ComponentName>.tsx`
2. Export the component with proper TypeScript types
3. Import using path alias: `import { ComponentName } from "@/components/ComponentName";`

## Remotion Fundamentals

- **Composition**: A registered video that can be rendered. Defined in `Root.tsx`.
- **AbsoluteFill**: A component that fills the entire video frame.
- **Sequence**: Controls when content appears (from frame X for Y frames).
- **useCurrentFrame()**: Hook to get the current frame number for animations.
- **useVideoConfig()**: Hook to get video configuration (fps, width, height, duration).

### Animation Pattern

Use Remotion's `spring()` function for smooth animations:

```typescript
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const animation = spring({
  frame,
  fps,
  config: {
    damping: 100,
    stiffness: 200,
    mass: 0.5,
  },
});

// Use animation value (0 to 1) for opacity, transforms, etc.
```

## Best Practices

1. **Use path aliases** for all imports within `src/`
2. **Keep components small and focused** for reusability
3. **Use TypeScript types** for all props and function signatures
4. **Follow naming conventions**:
   - Components: PascalCase (e.g., `Title.tsx`)
   - Utilities: camelCase (e.g., `formatTime.ts`)
   - Videos: PascalCase with "Video" suffix (e.g., `IntroVideo.tsx`)
5. **Document complex logic** with comments
6. **Leverage Remotion hooks** for frame-based animations

## Troubleshooting

### Path alias not resolving
- Ensure both `tsconfig.json` and `remotion.config.ts` have matching alias configurations
- Restart the Remotion studio after configuration changes

### Type errors
- Run `npm test` to see all TypeScript errors
- Check that all imports use correct paths and exported names

### Video not appearing in studio
- Ensure the composition is registered in `Root.tsx`
- Check that the component is properly exported
- Verify the import path is correct

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion API Reference](https://www.remotion.dev/docs/api)
- [Tactus Language Documentation](../Tactus-web)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## License

MIT
