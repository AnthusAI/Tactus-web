# Tactus-web Agent Instructions

This repo is the Gatsby site for Tactus. The goal is to keep the website's
docs pages, embedded examples, and AI guidance (llms.txt) consistent with the
canonical Tactus language and CLI.

## Development

Requirements:
- Node.js 20.x (see package.json engines)

Common commands:
```bash
npm install

# Local dev server
npm run develop

# Production build (also ingests examples + stdlib content)
npm run build

# Format (Prettier)
npm run format
```

Notes:
- `npm test` is intentionally not implemented in this repo.
- `npm run build` is the closest thing to a quality gate (it will fail on build
  errors and bad ingest scripts).

## Content Rules

- Prefer linking to runnable examples in `../Tactus-examples` or canonical docs
  in `../Tactus/docs/` over duplicating long code samples.
- Do not invent old/unsupported syntax. Use current canon:
  - Model training config lives in `Model.training`
  - Train: `tactus train file.tac --model <name>`
  - Evaluate: `tactus models evaluate file.tac --model <name> ...`
  - Models are called like functions (no `Model.predict()` method)

## Landing The Plane (Session Completion)

Work is not complete until `git push` succeeds.

1. File issues for remaining work
2. Run quality gates (typically `npm run build`)
3. Update issue status (close/advance Beads)
4. Push:
   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # must show up to date
   ```
5. Clean up: clear stashes, prune remote branches
