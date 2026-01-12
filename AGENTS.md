# Tactus-web (Gatsby) on AWS Amplify (Gen 2)

## What this repo is

- Gatsby site deployed via **AWS Amplify Hosting** (CI/CD + static hosting).
- Includes an **Amplify Gen 2** backend skeleton in `amplify/` (currently empty backend: `defineBackend({})`).

## Important IDs / config

- Amplify app name: `Tactus-web`
- Amplify app id: `dfkbdffs2viq8` (region `us-east-1`)
- GitHub repo: `https://github.com/AnthusAI/Tactus-web`
- Build spec: `amplify.yml` (Gatsby output is `public/`)
- Node version: pinned to `20.x` via `package.json` (`engines`) and `amplify.yml` (`nvm install/use 20`)

## Gen 2 tooling (no `amplify` CLI)

- **Do not use** `amplify` (Gen 1 CLI).
- Gen 2 uses `npx ampx ...` and `@aws-amplify/backend` / `@aws-amplify/backend-cli`.
- Local Gen 2 sandbox (only needed if/when adding backend resources):
  - `npx ampx sandbox --profile anthus --region us-east-1`

## AWS profiles (common gotcha)

- Amplify app lives in AWS account `335163751677`.
- Use the AWS CLI profile that authenticates to that account (currently: `anthus`).
- If `aws amplify get-app --app-id dfkbdffs2viq8 ...` says “App not found”, you’re almost certainly in the wrong AWS account/profile.

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
