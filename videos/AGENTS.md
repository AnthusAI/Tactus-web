# Agent Documentation - Tactus Videos

This document provides structured information for AI agents working with the Tactus Videos project.

## Technology Stack

- **Framework**: Remotion (React-based video generation)
- **Language**: TypeScript
- **Runtime**: Node.js 18+
- **Package Manager**: npm

## Directory Structure

```
src/
├── components/     # Reusable UI components for videos
│   ├── GlobalStyles.tsx  # Font loading and global styles
│   ├── Layout.tsx        # Layout containers
│   ├── Typography.tsx    # H1, H2, Body, Code, Subtitle components
│   ├── Card.tsx          # Card and CodeBlock components
│   └── Title.tsx         # Legacy title component
├── videos/         # Video composition directories (one per video)
│   └── intro/      # Intro video
├── lib/           # Utility functions and helpers
│   └── theme.ts   # Tactus design tokens (colors, fonts, spacing)
├── tactus/        # Tactus language-specific code and assets
├── Root.tsx       # Composition registry (registers all videos)
└── index.ts       # Entry point (registers Root with Remotion)
```

## Path Aliases

Configured in both `tsconfig.json` and `remotion.config.ts`:

| Alias | Resolves To | Purpose |
|-------|-------------|---------|
| `@/components/*` | `src/components/*` | Shared UI components |
| `@/videos/*` | `src/videos/*` | Video compositions |
| `@/lib/*` | `src/lib/*` | Utility functions |
| `@/tactus/*` | `src/tactus/*` | Tactus-specific code |

## Tactus Branding

The project uses the Tactus website's light mode design system:

### Design Tokens (`src/lib/theme.ts`)
- **Primary Color**: `#c7007e` (Magenta/Pink)
- **Background**: `#fdfdfd` (Off-white paper)
- **Text**: `#27272a` (Charcoal)
- **Fonts**: Source Sans 3 (headers), Source Serif 4 (body), Source Code Pro (code)

### Core Components
- **GlobalStyles**: Wraps content, loads fonts, applies background
- **Layout**: Flexbox container with consistent spacing
- **Typography**: H1, H2, H3, Body, Code, Subtitle components
- **Card**: Surface component with elevation

## Common Tasks

### Adding a New Video

1. **Create video directory**: `src/videos/<video-name>/`
2. **Create component file**: `src/videos/<video-name>/<VideoName>.tsx`
3. **Implement the video component**:
   ```typescript
   import React from "react";
   import { Sequence } from "remotion";
   import { GlobalStyles } from "../../components/GlobalStyles";
   import { Layout } from "../../components/Layout";
   import { H1, Subtitle } from "../../components/Typography";

   export const MyVideo: React.FC = () => {
     return (
       <GlobalStyles>
         <Sequence from={0} durationInFrames={150}>
           <Layout>
             <H1>My Video Title</H1>
             <Subtitle>Description</Subtitle>
           </Layout>
         </Sequence>
       </GlobalStyles>
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
5. **Add to render script** (optional): Edit `scripts/render-all.js`:
   ```javascript
   const compositions = [
     { id: "Intro", outputFile: "intro.mp4" },
     { id: "MyVideo", outputFile: "my-video.mp4" },
   ];
   ```

### Adding a Reusable Component

1. **Create component file**: `src/components/<ComponentName>.tsx`
2. **Export the component** with proper TypeScript types
3. **Import using path alias**: `import { ComponentName } from "@/components/ComponentName";`

### Adding Utility Functions

1. **Create utility file**: `src/lib/<utility-name>.ts`
2. **Export functions** with proper TypeScript types
3. **Import using path alias**: `import { utilityFunction } from "@/lib/<utility-name>";`

## Key Concepts

### Remotion Fundamentals

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

## Configuration Files

### package.json
- Defines dependencies and scripts
- Scripts: `start` (studio), `render` (all videos), `render:intro` (single video), `test` (lint + typecheck)

### tsconfig.json
- TypeScript configuration
- Path aliases defined in `compilerOptions.paths`

### remotion.config.ts
- Remotion-specific configuration
- Webpack alias configuration (mirrors tsconfig paths)
- Video format settings
- Output directory: `out/`

## Development Workflow

1. **Start studio**: `npm start` (opens browser-based editor)
2. **Edit code**: Modify components/videos with hot reload
3. **Test**: `npm test` (runs linter and type checker)
4. **Render videos**:
   - All videos: `npm run render`
   - Single video: `npm run render:intro` or `npx remotion render src/index.ts <CompositionId> out/<filename>.mp4`
5. **Upload videos to S3**:
   - Use the AWS profile `anthus`: `AWS_PROFILE=anthus npm run videos:upload`

## Babulus Watch Mode

### Development Mode (Fast Iteration)
```bash
npm run babulus:watch
```
Uses fast/cheap providers (configured in `.babulus/config.yml`) for quick iteration.

### Production Mode (High Quality)
```bash
BABULUS_ENV=production npm run babulus:watch
```
Uses production providers (typically Eleven Labs for TTS) for high-quality audio generation. Watch mode continuously re-generates timelines and audio when `.babulus.ts` files change.

### Production Rendering Workflow
When working with production audio and videos:

**Terminal 1** - Generate production audio with watch:
```bash
BABULUS_ENV=production npm run babulus:watch
```

**Terminal 2** - Re-render videos (run this after Babulus updates timelines):
```bash
npm run videos:render
```

Or render a specific video:
```bash
npm run videos:render Intro
```

### Available Babulus Commands
| Command | Description |
|---------|-------------|
| `npm run babulus:watch` | Watch DSL files and regenerate (development mode) |
| `BABULUS_ENV=production npm run babulus:watch` | Watch DSL files and regenerate (production mode) |
| `npm run babulus:generate -- content/intro.babulus.ts` | One-time generation of a specific video |
| `BABULUS_ENV=production npm run babulus:generate -- content/intro.babulus.ts` | One-time production generation |
| `npm run babulus:clean` | Remove all generated artifacts |
| `npm run babulus:sfx` | Manage sound-effect variants |

### Environment Variables
- `BABULUS_ENV`: Set to `production` for high-quality audio (default: `development`)
- `BABULUS_PYTHON`: Path to Python executable if not in PATH
- Uses fallback chain: `development → aws → azure → production → static` (allows reusing production audio during development)

## Rendering System

### Output Directory
All rendered videos are saved to `out/` directory (git-ignored by default).

### Render Scripts

**Automated rendering** (`scripts/render-all.js`):
- Renders all compositions defined in the script
- Provides progress feedback
- Handles errors gracefully
- Usage: `npm run render`

**Manual rendering**:
```bash
npx remotion render src/index.ts <CompositionId> out/<output-file>.mp4
```

### Adding Videos to Render Script

Edit `scripts/render-all.js` and add to the `compositions` array:

```javascript
const compositions = [
  {
    id: "Intro",
    outputFile: "intro.mp4",
  },
  {
    id: "YourNewVideo",
    outputFile: "your-new-video.mp4",
  },
];
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

### Babulus DSL Conventions

- Prefer `snake_case` for YAML keys.
- Prefer names that include units (e.g. `pause_seconds`, `duration_seconds`, `sample_rate_hz`).

## Syncing Diagrams with Voice Cues

Many diagrams have a `progress` prop (0-1) that controls animation state or which section is highlighted. To sync diagram state with voiceover:

### 1. Get voice cue timestamps from the timeline

The generated timeline JSON contains segment start times. Use `getCueTtsStarts()`:

```typescript
// In the video component, extract TTS segment start times
const getCueTtsStarts = (sceneId: string, cueId: string): number[] => {
  const items = timeline?.items ?? [];
  const cueItem = items.find(it => it.type === "tts" && it.sceneId === sceneId && it.cueId === cueId);
  return (cueItem?.segments ?? []).filter(s => s.type === "tts").map(s => s.startSec);
};

// Pass to scene component
<MyScene ttsStartsSec={getCueTtsStarts("my_scene", "my_cue")} />
```

### 2. Map voice cue beats to diagram progress

In the scene component, use Remotion's `interpolate()` to map time to progress:

```typescript
const MyScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;

  // Convert absolute timestamps to scene-local times
  const cueStartsLocal = ttsStartsSec.map(s => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 3;
  const beat3 = cueStartsLocal[2] ?? beat2 + 3;

  // Map time to diagram progress (0-1)
  const diagramProgress = interpolate(
    localSec,
    [beat1, beat2, beat3, beat3 + 5],  // keyframe times
    [0, 0.33, 0.66, 1],                 // progress values
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return <GuardrailsStackDiagram theme="light" progress={diagramProgress} />;
};
```

### 3. Available diagrams with progress/pointer control

| Diagram | Progress Prop | Behavior |
|---------|--------------|----------|
| `GuardrailsStackDiagram` | `progress` (0-1) | Highlights layer index = floor(progress * 8), moves pointer |
| `LeastPrivilegeDiagram` | `progress` (0-1) | Highlights dimension index = floor(progress * 5), shows 5 dimensions of least privilege |
| `PromptEngineeringCeilingDiagram` | `progress` (0-1) | Animates ceiling visualization |
| `HumanInTheLoopDiagram` | `time` (ms) + `scenario` + `config` | Runs simulation at given time |

### 4. Babulus YAML voice segment structure

Each voice segment in the YAML gets a timestamp. Structure segments to match diagram states:

```yaml
cues:
  - id: defense_layers
    voice:
      segments:
        - voice: "First layer: cost limits..."    # → progress 0.0
        - pause_seconds: 0.5
        - voice: "Second layer: prompts..."       # → progress 0.125
        - pause_seconds: 0.5
        - voice: "Third layer: context..."        # → progress 0.25
```

## LeastPrivilegeDiagram

Shows how Tactus enforces least privilege across 5 dimensions in a radial hub design.

### Five Dimensions:
1. **Minimal Toolsets** - Only tools needed for the task
2. **Curated Context** - Limited information, not everything
3. **Network Isolation** - Default networkless execution
4. **API Boundaries** - Secretless broker keeps credentials out
5. **Temporal Gating** - Tools available only when workflow stage requires

### Props:
- `progress` (0-1): Animates through dimensions sequentially (each dimension gets 0.2 of progress range)
- `theme`: "light" | "dark"
- `style`: Optional CSS properties
- `className`: Optional CSS class

### Usage Example:
```jsx
// Static usage (web page)
<LeastPrivilegeDiagram theme="light" />

// Animated usage (video with voice sync)
const diagramProgress = interpolate(
  localSec,
  [introEnd, dim1Start, dim2Start, dim3Start, dim4Start, dim5Start],
  [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
<LeastPrivilegeDiagram theme="light" progress={diagramProgress} />
```

### Visual Layout:
- Center hub displays "TACTUS Least Privilege Engine"
- 5 dimensions radiate outward at different angles
- Active dimension (based on progress) has higher opacity and colored border
- Connection lines from center to each dimension
- Each dimension card shows icon, title, and description

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

- [Remotion Docs](https://www.remotion.dev/docs)
- [Remotion API Reference](https://www.remotion.dev/docs/api)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

## Babulus DSL Conventions

- Use `snake_case` for YAML keys (not camelCase).
- Prefer names that include units, e.g. `pause_seconds`, `duration_seconds`, `sample_rate_hz`.
