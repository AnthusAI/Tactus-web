# Examples Ingestion & Publishing Plan

Purpose: keep runnable examples in the `Tactus-examples` repo, generate site content from that single source of truth, and ensure all showcased examples are continuously tested.

## Repos and Ownership
- `Tactus-examples`: only examples. Contains `.tac` files and sibling `.md` docs with frontmatter (title, category, tags, summary, tac path, flags like `has_specs`, `has_evals`, `requires_api_keys`). No web logic.
- `Tactus-web`: the site. Fetches/parses the examples repo, emits data for Gatsby, and renders pages.

## Taxonomy (folder hints for Tactus-examples)
- `basics/` — hello, params, simple agent, multi-model, streaming.
- `stdlib/` — structured output, JSON parsing, file-io (text/csv/tsv/json/parquet/hdf5/excel), tool schemas/toolsets.
- `state-sessions/` — state, message history, sessions, per-turn tools.
- `guardrails/` — specs, mocking patterns, invariants.
- `evals/` — simple → thresholds → dataset → trace → advanced/comprehensive.
- `durability/` — checkpoints, sub-procedures, script mode.
- `models/` — http/text-classifier/pytorch/multi-model, Bedrock/Gemini as needed.
- `use-cases/` — text-classification (fuzzy/LLM stdlib), contact-import, meeting-recap-approval, pipelines, compliance-lite.

## Metadata (frontmatter) per example `.md`
```yaml
title: "Hello World"
category: "basics"
tags: ["hello", "state"]
tac: "examples/basics/01-hello-world.tac"
has_specs: true
has_evals: false
requires_api_keys: false
summary: "Simple hello world with state + output schema."
```
Body: human-friendly explanation, how to run, guardrails used, inputs/outputs, notes on specs/evals.

## Web Ingestion (Tactus-web)
- Add an ingest script (`scripts/ingest-examples.js`) that:
  1) Determines `EXAMPLES_DIR` (env override). If absent, fetches the examples repo (tarball or shallow clone) into `.cache/tactus-examples/`.
  2) Parses all example `.md` files with `gray-matter`.
  3) Writes `src/data/examples.json` (or MDX) with frontmatter + body + relative paths to `.tac`.
- Add npm script: `"examples:ingest": "node scripts/ingest-examples.js"`.
- Build order for the site: `npm run examples:ingest` → `gatsby build`.

### Fetch strategy (agnostic to hosting/CI)
- Env vars:
  - `EXAMPLES_DIR` (if you already have the repo on disk; optional).
  - `EXAMPLES_REPO_URL` (default `https://github.com/AnthusAI/Tactus-examples.git`).
  - `EXAMPLES_REF` (default `main`).
- If `EXAMPLES_DIR` is unset, ingest script downloads a tarball or shallow clones to `.cache/tactus-examples/` and reads from there. No assumption about sibling checkouts.

## Testing the examples (Tactus-examples)
- Keep a simple runner (in that repo) that discovers all `.tac` and runs:
  - `tactus test <file> --mock` when specs exist.
  - Optionally `tactus eval <file>` for examples marked `has_evals` (can be a flag to skip in quick CI).
- CI in `Tactus-examples` should fail on broken examples so the source of truth stays green.

## Website consumption
- Gatsby pages read `src/data/examples.json` and render:
  - Title, summary, tags, category.
  - “Run” snippet (`tactus run ...`) and links to source `.tac` and `.md` on GitHub.
  - Flags (needs API keys, has specs/evals).
- Category index pages are generated from the same data; no hand-maintained duplication.

## Why this structure
- Single source of truth: examples repo holds code + docs together.
- Web build pulls and generates its data; no manual copy/paste.
- CI on the examples repo keeps showcased examples runnable.
- Hosting-agnostic: fetch during build via env-configured URL/REF; works locally and in any cloud pipeline.
