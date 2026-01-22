# Tactus-web (Gatsby) on AWS Amplify (Gen 2)

## CRITICAL PROTOCOL: GIT COMMITS
**NEVER** commit changes without explicit user approval.
- Always show the user what you have done and ask for confirmation before running `git commit`.
- If the user asks you to "do X", implementing X is your job. Committing X is a separate step that requires separate approval.
- Exception: If the user explicitly says "fix X and commit", you may commit. Otherwise, assume you are in a "review pending" state.

## What this repo is

- Gatsby site deployed via **AWS Amplify Hosting** (CI/CD + static hosting).
- Includes an **Amplify Gen 2** backend in `amplify/` used for video hosting infrastructure.

## UI & Design Guidelines (Strict)

### 1. Limited Color Palette

**Policy:** We strictly adhere to a minimal, defined color palette. Do not use arbitrary colors (e.g., `red`, `blue`, `#123456`). Always use the CSS variables defined in `src/components/layout.css`.

**Color Reference (`src/components/layout.css`):**

*   **Brand**:
    *   `--color-primary`: `#c7007e` (Magenta - primary brand color)
    *   `--color-primary-ink`: `#ffffff` (Text on primary backgrounds)

*   **Surfaces** (Softened "Paper" Tones):
    *   `--color-bg`: `#fdfdfd` (Main page background - off-white)
    *   `--color-surface`: `#ffffff` (Elevated surfaces - pure white)
    *   `--color-card-title`: `#f5f5f5` (Card title bars)
    *   `--color-surface-2`: `#ededed` (Muted sections, subtle backgrounds)

*   **Text** (Softened Charcoal):
    *   `--color-text`: `#27272a` (Main text)
    *   `--color-text-secondary`: `#3f3f46` (Card titles)
    *   `--color-text-muted`: `#52525b` (Secondary text, captions)

*   **Code**:
    *   `--color-code-bg`: `#ededed` (Same as surface-2)
    *   `--color-code`: `#27272a` (Same as main text)

**Dark Mode Note:** All variables automatically adapt in dark mode (defined in the same file). Do not write manual dark mode overrides unless absolutely necessary for specific components not covered by these semantic variables.

### 2. No Borders/Outlines Policy

**Policy:** **NEVER use borders or outlines** to define UI elements or separate content.

*   **Incorrect:** `border: 1px solid #ccc`, `outline: 1px solid black`
*   **Correct:** Use flat background colors and spacing to convey grouping.
    *   To separate a card from the background: Use `background: var(--color-surface)` on the card against `var(--color-bg)` or `var(--color-surface-2)`.
    *   To separate a header within a card: Use `background: var(--color-card-title)` against `var(--color-surface)`.
    *   To highlight a section: Use `background: var(--color-surface-2)`.

### 3. No Fuzzy Drop Shadows

**Policy:** Never use fuzzy/blurred shadows. This includes `box-shadow` values with blur/spread, SVG/filters like `feDropShadow`, and CSS `filter: drop-shadow(...)`.

*   **Incorrect:** `box-shadow: 0 4px 12px rgba(...);`, `box-shadow: 0 1px 3px rgba(...);`, `filter: drop-shadow(...)`, SVG `feDropShadow`
*   **Correct:** If a shadow is needed, use a **flat shadow** with **no blur**, in the “CTA button” style:
    *   Example: `box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.1);`
    *   Hover example: `box-shadow: 0 6px 0 0 rgba(0, 0, 0, 0.1);`

### 4. No Horizontal Rules (`<hr>`)

**Policy:** Never use horizontal rules (`<hr>`) or “divider lines” as separators in this branding.

*   **Incorrect:** `<hr />`, or adding divider lines at section boundaries (e.g., footer/header rules)
*   **Correct:** Use spacing and flat surface/background changes (`--color-bg`, `--color-surface`, `--color-surface-2`, `--color-card-title`) to communicate separation.

### 5. Typography

*   **UI / Headers**: `var(--font-sans)` ("Source Sans 3")
    *   Use for: Navigation, Buttons, Headings (h1-h6), UI labels.
*   **Body / Reading**: `var(--font-serif)` ("Source Serif 4")
    *   Use for: Long-form text, blog posts, documentation body.
*   **Code**: `var(--font-mono)` ("Source Code Pro")
    *   Use for: Code blocks, snippets, technical terms.

### 6. Shape & Spacing

*   **Corner Radius**: Always use `var(--border-radius)` (8px). Do not hardcode `8px` or other values.
*   **Spacing**: Use the spacing scale variables (`--space-1` through `--space-6`) for margins and padding.

### 7. Visuals & Diagrams

*   **Reusable Components**: All visuals must be implemented as reusable React components.
*   **Cross-Platform Compatibility**: Components must be designed to work in both:
    *   **Remotion**: For video generation (rendering to MP4).
    *   **Gatsby**: For interactive web display.
*   **Storybook**: Every visual component must have a Storybook story to verify its behavior in isolation.
*   **Responsiveness & Safe Areas**:
    *   **Title-Safe**: Visuals must fit within the standard title-safe region when rendered in 16:9 video format.
    *   **Responsive**: On the web, visuals must fill the full width of their container and adapt gracefully to different screen sizes.

---

## Important IDs / config

- Amplify app name: `Tactus-web`
- Amplify app id: `dfkbdffs2viq8` (region `us-east-1`)
- GitHub repo: `https://github.com/AnthusAI/Tactus-web`
- Build spec: `amplify.yml` (Gatsby output is `public/`)
- Node version: pinned to `20.x` via `package.json` (`engines`) and `amplify.yml` (`nvm install/use 20`)

## Gen 2 tooling (no `amplify` CLI)

- **Do not use** `amplify` (Gen 1 CLI).
- Gen 2 uses `npx ampx ...` and `@aws-amplify/backend` / `@aws-amplify/backend-cli`.
- Local Gen 2 sandbox (optional; CI deploy is the default):
  - `npx ampx sandbox --profile anthus --region us-east-1`

## Videos (Remotion subproject)

- The Remotion project lives in `videos/` and renders MP4s to `videos/out/`.
- The marketing site should not bundle large videos into the Gatsby build; it should reference a public URL.

### Babulus (Voiceover Generation)

Babulus generates TTS audio and timing JSON from TypeScript DSL files (`.babulus.ts`) in `videos/content/`.

**Quick Start**:
```bash
# From Tactus-web root - generate audio for all videos
cd videos
npm run babulus

# Watch mode (auto-regenerate on DSL or config changes)
npm run babulus:watch

# Development mode with explicit environment
npm run babulus:dev
```

**All Available Commands** (run from `videos/` directory):
```bash
# Basic generation
npm run babulus              # Generate all videos with OpenAI (development mode)
npm run babulus:watch        # Watch mode - auto-regenerate on changes
npm run babulus:dev          # Same as watch, explicitly sets --env development

# Testing & iteration
npm run babulus:dry          # Dry-run mode - no API calls, instant generation
npm run babulus:fresh        # Force fresh regeneration (ignore cache)

# Maintenance
npm run babulus:clean        # Clean generated files for current environment
npm run babulus:sfx          # SFX variant management (next/prev/set)
```

**Remotion Studio**:
```bash
# Start the Remotion studio to preview videos (from videos/ directory)
npm run start
```

**DSL Files**:
- **Input**: `videos/content/<video>.babulus.ts` - TypeScript DSL defining scenes, cues, narration
- **Shared**: `videos/content/_babulus.shared.ts` - Default settings for all videos

**Outputs**:
- `videos/src/videos/<video>/<video>.script.json` - Timing data for Remotion
- `videos/src/videos/<video>/<video>.timeline.json` - Audio tracks
- `videos/public/babulus/<video>.wav` - Concatenated voiceover audio
- `.babulus/out/<video>/env/<environment>/` - Cached audio segments per environment

**Environment-Aware Caching**:
- Cache structure: `.babulus/out/<video>/env/<environment>/`
- Environments: `development` (OpenAI), `production` (ElevenLabs), `aws` (Polly), `azure`, `static`
- Fallback chain: development → aws → azure → production → static
- **Key benefit**: Switch TTS providers without regenerating unchanged segments (79x faster on cache hits)
- Only regenerates segments that changed or don't exist in cache for current environment

**Configuration**:
- Config file: `.babulus/config.yml` (in Tactus-web root, not in videos/)
- Example: `.babulus/config.example.yml`
- Environment: Set via `BABULUS_ENV` or `--env` flag (defaults to `development`)

### Infra (S3 + CloudFront)

- `amplify/backend.ts` defines:
  - a private S3 bucket for MP4 objects
  - a CloudFront distribution (Origin Access Identity) for public HTTPS playback
- `amplify.yml` runs `npx ampx pipeline-deploy ...` so the backend deploy happens automatically on commit/push.

### Publishing workflow

1) Generate backend configuration (one-time or when backend changes):
```bash
npx ampx generate outputs --app-id dfkbdffs2viq8 --branch main --profile anthus
```
This creates `amplify_outputs.json` with bucket name and CloudFront URL.

2) Render videos:
```bash
npm run videos:render
```
Renders videos to `videos/out/` and copies to `static/videos/` for local preview.

3) Upload to S3:
```bash
AWS_PROFILE=anthus npm run videos:upload
```
Reads bucket name from `amplify_outputs.json` and uploads videos and poster images.

4) Commit and deploy:
- The `/videos` page automatically reads the CloudFront URL from `amplify_outputs.json` at build time.
- Commit `amplify_outputs.json` to the repository so it's available during the Amplify build.
- Push to trigger a new deployment.
- Videos will be served from CloudFront with proper poster images.

### Finding the bucket + CDN after deploy

Generate the `amplify_outputs.json` file from the deployed backend:

```bash
npx ampx generate outputs --app-id dfkbdffs2viq8 --branch main --profile anthus
```

This creates `amplify_outputs.json` in the current directory with the backend configuration including:
- `custom.videosBucketName` - The S3 bucket name for video storage
- `custom.videosCdnUrl` - The CloudFront distribution URL for public access

Alternatively, query CloudFormation directly for the videos stack outputs:
```bash
aws cloudformation describe-stacks --stack-name <videos-stack> --query "Stacks[0].Outputs" --profile anthus
```

## AWS credentials (required for video upload)

The video upload workflow requires AWS credentials with access to the S3 bucket.

### Using AWS Profile (recommended)

Set up an AWS CLI profile named `anthus` that authenticates to AWS account `335163751677`:

```bash
aws configure --profile anthus
# Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)
```

Then use the profile for all AWS operations:
```bash
AWS_PROFILE=anthus npm run videos:upload
AWS_PROFILE=anthus npx ampx generate outputs --app-id dfkbdffs2viq8 --branch main --profile anthus
```

### Using Default Credentials

Alternatively, configure default AWS credentials (no profile needed):
```bash
aws configure
# Or set environment variables:
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
```

### Common Gotchas

- Amplify app lives in AWS account `335163751677`.
- If `aws amplify get-app --app-id dfkbdffs2viq8 ...` says "App not found", you're almost certainly in the wrong AWS account/profile.
- Upload script reads bucket name from `amplify_outputs.json` (generated by `npx ampx generate outputs`).

## Debugging Amplify Hosting build failures (CLI)

All commands below assume `--profile anthus --region us-east-1`.

- App info: `aws amplify get-app --app-id dfkbdffs2viq8`
- Recent jobs: `aws amplify list-jobs --app-id dfkbdffs2viq8 --branch-name main --max-items 10`
- Job details/log URL: `aws amplify get-job --app-id dfkbdffs2viq8 --branch-name main --job-id 0000000002`
  - The response includes a `steps[].logUrl` (pre-signed S3 URL) you can open/download to see the build output.

## Build reproducibility (lockfile gotcha)

Amplify runs `npm ci`. If `package.json` changes but `package-lock.json` is not updated, the build fails with “Missing: … from lock file”.

- Regenerate lockfile using Node 20 (matching Amplify):
  - `npx -y -p node@20.19.6 -c "npm install --package-lock-only"`
  - Commit the updated `package-lock.json`.

## Hosting cache gotcha (hashed assets vs. stale HTML)

If you see broken images/CSS/JS in production but everything works locally, suspect stale cached HTML pointing at old hashed asset URLs.

- Fix: set Amplify Hosting custom headers so HTML is not cached at the CDN edge (`s-maxage=0`).
- Current setting (Amplify app config, not in-repo): `Cache-Control: public, max-age=0, s-maxage=0, must-revalidate` for `/`, `/index.html`, and `**/*.html`.
