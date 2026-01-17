# Tactus-web (Gatsby) on AWS Amplify (Gen 2)

## What this repo is

- Gatsby site deployed via **AWS Amplify Hosting** (CI/CD + static hosting).
- Includes an **Amplify Gen 2** backend in `amplify/` used for video hosting infrastructure.

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

Babulus generates TTS audio and timing JSON from `.babulus.yml` DSL files in `videos/content/`.

**Setup** (requires Python 3.11+):
```bash
conda create -n babulus python=3.12 -y
conda activate babulus
cd videos
pip install -r requirements.txt  # installs babulus from ../Babulus
```

**Generate audio**:
```bash
# Development mode (cheap/fast - OpenAI)
BABULUS_ENV=development babulus generate content/intro.babulus.yml

# Production mode (high quality - Eleven Labs, when quota available)
BABULUS_ENV=production babulus generate content/intro.babulus.yml

# Watch mode (auto-regenerate on DSL changes)
BABULUS_ENV=development babulus generate --watch content/intro.babulus.yml

# Watch all videos
BABULUS_ENV=development babulus generate --watch content/
```

**Outputs**:
- `src/videos/<video>/<video>.script.json` - Timing data for Remotion
- `src/videos/<video>/<video>.timeline.json` - Audio tracks
- `public/babulus/<video>.wav` - Voiceover audio
- `.babulus/out/<video>/env/<environment>/` - Cached audio segments

**Key benefit**: Environment-aware caching prevents burning through API quotas. Only regenerates changed segments (79x faster on cache hits).

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
