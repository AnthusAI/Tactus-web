# AGENTS.md: Tactus-web

Operating manual for any agent or person working in this repository, whatever the tool. Read [README.md](README.md) first (what this is, where it runs, how a change ships). Engine-level rules for every Papyrus site live in the Papyrus [AGENTS.md](https://github.com/AnthusAI/Papyrus/blob/main/AGENTS.md); this file does not repeat them. Papyrus docs index: [docs/README.md](https://github.com/AnthusAI/Papyrus/blob/main/docs/README.md).

Tactus-web (tactus.anth.us) is a static Papyrus site with no CMS backend. It is the public site for the Tactus language.

## Map of the parts

| Part | Where | Docs |
| --- | --- | --- |
| Pages | `content/*.md`, in Markus Markdown with page blocks (`::band`, `::column`, `::button`, `::island`). One file per URL. Placeholders written as `{{name}}` stand for generated blocks (`{{videos-featured}}`, `{{books}}`, `{{example-snippet hello-world}}`, `{{stdlib-modules}}`); see `publication/authored.py`. | [building-a-papyrus-static-site](https://github.com/AnthusAI/Papyrus/blob/main/docs/building-a-papyrus-static-site.md), [markus-content-markup](https://github.com/AnthusAI/Papyrus/blob/main/docs/markus-content-markup.md), [Markus](https://github.com/AnthusAI/Markus) |
| Standard projector settings | `web/projection.json`: sections (`getting-started`, `use-cases`, `resources`, `stdlib`, `examples`, all without listings or feeds), navigation, footer, sitemap, `agents` (`llmsTxt` is off because `static/llms.txt` is hand-kept), `pageActions` (copy and open-in-AI actions), islands | same guide |
| Theme and hook | `web/css/site-theme.css`, `web/hooks.py`, `web/site_icons.py` | the same guide |
| Generated pages | `publication/` (`build.py`, `authored.py`, `catalog.py`, `indexes.py`, `media.py`): standard library pages from `src/data/stdlib.json`, example pages and the example chapter from `src/data/examples.json`. Both are written by `npm run stdlib:ingest` and `npm run examples:ingest`, which fetch `AnthusAI/Tactus` and `AnthusAI/Tactus-examples` at `main` (override with `TACTUS_REF`, `EXAMPLES_REF`, `STDLIB_DIR`, `EXAMPLES_DIR`). | `docs/examples-ingestion-plan.md` (written for an older Gatsby build; the ownership split it describes still holds) |
| Interactive demos (islands) | `publication/islands/` and `src/components/`, bundled by `scripts/build-islands.js` into `web/assets/islands.js` and `islands.css` (esbuild). Mounted with `::island{name="EvaluationsDiagram"}`. | the Papyrus guide, "Islands" |
| Agent-readable output | Markdown twins and `sitemap.xml` from Papyrus; `llms.txt` from `static/`; the edge serves the twin for `Accept: text/markdown` | [agent-readable-sites](https://github.com/AnthusAI/Papyrus/blob/main/docs/agent-readable-sites.md) |
| GA4 and consent | `chrome.ga_measurement_id` and `chrome.consent_mode` in `web/projection.json` | [site-hosting, Consent Mode v2](https://github.com/AnthusAI/Papyrus/blob/main/docs/site-hosting.md) |
| Edge | `infra/edge/tactus.yaml` and `infra/edge/README.md` (CloudFront in front of Amplify, in `papyrus-production`) | the same README |
| Deploy role | `infra/github-deploy/github-deploy-role.yaml` (legacy account) | [site-hosting, Deploy on merge to main](https://github.com/AnthusAI/Papyrus/blob/main/docs/site-hosting.md) |
| Videos | `videos/` (Remotion), `scripts/render-videos.js`, `scripts/upload-videos.js`, `amplify/backend.ts` (private bucket plus CloudFront), `data/videos.json` | the README |
| Board | Kanbus project key `tctw` (`.kanbus.yml`, `project/`). A leftover `.beads/` directory is the retired issue tracker; do not use it. | `CONTRIBUTING_AGENT.md` |

Papyrus features this site does not use: the CMS and newsroom backend, the projection lease and reconcile flow (nothing is projected into S3 by a backend), reader steering, the newsletter plugin, monitoring and the Cyclotron router, procedures and the knowledge run, automations and review requests. The site renders to static files at build time and Amplify hosts them. Tactus procedures are the subject of the site's content, not part of its operation.

## Common tasks

**Run the tests**: `npm test` (Python unit tests in `publication/tests`; `sh bin/publication.sh test`). **Build**: `npm run build` (output in `public/`). **Preview**: `npm run serve`. Use Node 20.x. The CI steps are exactly `npm ci`, `npm test`, `npm run build`.

**Bump the Papyrus pin**: edit the single line `papyrus-newsroom[markus]==X.Y.Z` in `requirements-publication.txt` (check `pip index versions papyrus-newsroom` first), run `npm test` and `npm run build`, and look at the diff in `public/` for surprises (new keys in `web/projection.json` can be required by newer versions; unknown keys are errors). Open a pull request to `main`; the merge deploys. The pin is currently `5.29.0`; the latest engine release at the time of writing is `5.32.0`.

**Deploy**: merge a pull request to `main`. The `CI` workflow then starts the Amplify job for that commit on app `dfkbdffs2viq8` (account `335163751677`) through GitHub OIDC; Amplify's auto-build on `main` is off. Never run `ampx pipeline-deploy` or `aws amplify start-deployment` from a laptop. After a merge, check `https://tactus.anth.us/` returns 200 and `AWS_PROFILE=legacy aws amplify list-jobs --app-id dfkbdffs2viq8 --branch-name main --max-results 3` shows the merged commit. Branch builds other than `main` get their own `noindex` origin.

**Change the edge**: edit `infra/edge/tactus.yaml` and read `infra/edge/README.md` first (alias attach order, DNS, rollback). Deploy with `AWS_PROFILE=papyrus-production`, read the change set before executing it, and tell the Papyrus session; shared infrastructure rules apply.

**Add or change a page**: edit `content/<name>.md`; add it to the navigation in `web/projection.json` if it needs a link; run `npm run build` and open the page under `public/`. For a new interactive demo, add the component under `src/components/` or `publication/islands/`, register it in `publication/islands/entry.jsx`, and reference it with `::island`.

**Refresh the video URL or upload videos**: see the README (uses the `legacy` profile).

**Start a new Papyrus static site**: [building-a-papyrus-static-site](https://github.com/AnthusAI/Papyrus/blob/main/docs/building-a-papyrus-static-site.md) and [site-hosting](https://github.com/AnthusAI/Papyrus/blob/main/docs/site-hosting.md).

## Hard rules

- Secrets go in SSM Parameter Store as SecureString, created by infrastructure code, never in this repository. Never commit `.env*`. Note that `amplify_outputs.json` is committed here (it holds the public video CloudFront URL only); do not add credentials to it.
- No real email addresses anywhere in the repository. Use placeholders.
- Shared checkouts: never switch branches and never `git stash`. Use `git worktree add` or a fresh clone.
- Gherkin specs for every behaviour change, narrative and complete. This repository has no Gherkin runner today; its tests are Python unit tests. Behaviour that belongs to the engine gets its Gherkin in the Papyrus repository; for site behaviour, add the scenarios as `.feature` files under `features/` in the same pull request and tell the owner that no runner executes them yet.
- If this site ever gains a CMS backend, the engine rules apply from then on: never run `papyrus ops content project --reconcile` without the deployed plugin list, never use `--allow-deletions`, and take the projection lease. Today there is nothing to reconcile.
- Do not add a projector, sitemap writer or feed generator here. If the standard front end cannot do something, add it to Papyrus core.
- Kanbus is mandatory for tasks (the section below). Do not read or write `project/` directly; use `KANBUS_REALTIME_BROKER=off kbs ...`. Stories go open, in_progress, blocked or closed. Human review is never a story state; use review requests.
- Pull requests go to `main`. Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`). Never force-push `main`.
- Wording: never write "desk"; say "section" or the role. Attribution is "AI". Use "Account", not "Organization", for the shared directory tenant.
- GA4 follows the anth.us standard: Consent Mode v2 with the banner and a Cookie settings link. Do not turn on `analytics_only` here.

## Ownership and coordination

- Engine changes belong in the Papyrus repository; this repository follows by bumping the pin. Language and runtime changes belong in the Tactus repository; the site's reference pages follow from the ingest scripts.
- Tell the Papyrus session before changing the edge stack or the reusable workflow `AnthusAI/Papyrus/.github/workflows/amplify-deploy.yml` that this repository's deploy job calls at `@main`.
- Never touch Anth.us from here. Ryan owns the site.

## Current state (2026-10-23)

- Live: `https://tactus.anth.us/` (200), `/llms.txt`, `/llms-full.txt`, `/sitemap.xml` (200), `Accept: text/markdown` returns Markdown; GA4 and the consent banner are in the pages. Last Amplify job on `main` succeeded for the Papyrus 5.29.0 and GA4 merge.
- Known gaps: the Amplify app and its deploy role are still in the legacy account `335163751677` while the edge is in `papyrus-production`; moving the app is not planned in this repository. `docs/examples-ingestion-plan.md` still mentions Gatsby. The build fetches `AnthusAI/Tactus` and `AnthusAI/Tactus-examples` at their `main`, so two builds of the same commit can differ. The `develop` branch is old; work from `main`.

## Where the docs live

This file, the README, `docs/examples-ingestion-plan.md` and `CONTRIBUTING_AGENT.md` (Kanbus workflow). Engine docs: the [Papyrus docs index](https://github.com/AnthusAI/Papyrus/blob/main/docs/README.md).

## Project management with Kanbus

Use Kanbus for task management.
Why: Kanbus task management is MANDATORY here; every task must live in Kanbus.
When: Create/update the Kanbus task before coding; close it only after the change lands.
How: See CONTRIBUTING_AGENT.md for the Kanbus workflow, hierarchy, status rules, priorities, command examples, and the sins to avoid. Never inspect project/ or issue JSON directly (including with cat or jq); use Kanbus commands only.
Performance: Prefer kanbusr (Rust) when available; kanbus (Python) is equivalent but slower.
Warning: Editing project/ directly is a sin against The Way. Do not read or write anything in project/; work only through Kanbus.

## Landing the plane (session completion)

Work is not complete until it is pushed. At the end of a session:

1. File Kanbus issues for remaining work.
2. Run the quality gates if code changed (`npm test`, `npm run build`).
3. Update issue status: close finished work, update in-progress items.
4. Push the branch and open or update the pull request. Check `git status` shows the branch up to date with origin.
5. Clean up worktrees and merged branches. Never use `git stash`.
6. Hand off with context for the next session.
