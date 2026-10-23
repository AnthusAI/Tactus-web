# Tactus-web

The site for [Tactus](https://tactus.anth.us), the language and runtime for safe, reproducible, tool-using agents. It is a Papyrus static documentation and marketing site: there is no CMS and no newsroom backend. Pages are authored here in Markus Markdown and rendered by Papyrus.

## What this repository is

[Papyrus](https://github.com/AnthusAI/Papyrus) renders the pages, the header, the Anthus family footer, the sitemap, `robots.txt`, the 404 page, the Markdown twins and the Google Analytics code. This repository supplies the content, the theme, the interactive demos and the build around them. It is pre-production.

| Repository | Role |
| --- | --- |
| [Papyrus](https://github.com/AnthusAI/Papyrus) | The engine. This site installs `papyrus-newsroom[markus]` from PyPI at an exact version (`requirements-publication.txt`). |
| [Markus](https://github.com/AnthusAI/Markus) | The Markdown dialect the pages are written in (`::band`, `::island` and the other directives). |
| This repository | The Tactus site. |
| [Tactus](https://github.com/AnthusAI/Tactus) | The language. The site fetches its standard library documentation at build time (`npm run stdlib:ingest`). |
| [Tactus-examples](https://github.com/AnthusAI/Tactus-examples) | The runnable examples. The site fetches them at build time (`npm run examples:ingest`; set `EXAMPLES_DIR` to use a local checkout). |
| [Tactus-HITL-components](https://github.com/AnthusAI/Tactus-HITL-components) | React components for the human-in-the-loop demos (npm dependency from GitHub `main`). |
| [Babulus](https://github.com/AnthusAI/Babulus) | Narration and audio for the Remotion videos in `videos/`. |

Sister Papyrus sites: Anth.us, Pilobol.us, Threat Intelligence, Markus, p.apyr.us. Cyclotron and Prospectus are separate products and are not used here.

## Where it runs

| Thing | Value |
| --- | --- |
| Public site | `https://tactus.anth.us` |
| Edge | CloudFront distribution `E35IFFXU9ZV3KW` (`duynaf832slz8.cloudfront.net`), stack `papyrus-edge-tactus-site`, in `papyrus-production` (`712236451410`, `us-east-1`). Template: `infra/edge/tactus.yaml`. It exists to answer `Accept: text/markdown` with the page's `.md` twin. DNS is the `tactus` record in the `anth.us` zone of `papyrus-production`. |
| Origin and deploy | Amplify Hosting app `Tactus-web`, app id `dfkbdffs2viq8`, in the legacy account `335163751677` (not in `papyrus-production`). Branch `main` is production (Amplify auto-build is off); the edge reads `main.dfkbdffs2viq8.amplifyapp.com`. The app's Gen 2 backend (`amplify/backend.ts`) holds the private video bucket and its CloudFront distribution. |
| Deploy role | `arn:aws:iam::335163751677:role/tactus-web-github-deploy` (`infra/github-deploy/github-deploy-role.yaml`), trusted by GitHub OIDC for this repository's `main` only. |
| Repository | Public, `AnthusAI/Tactus-web`. Default branch `main`. |
| Analytics | Google Analytics 4 (`G-31SC26SDGX`) with Consent Mode v2 and a cookie banner; privacy link `https://anth.us/privacy/`. |

## Quick start

Prerequisites: Node 20.x (`.nvmrc`; the install refuses other majors) and Python 3.12 or newer (`bin/publication.sh` builds `.build/python` from `requirements-publication.txt`, using `uv` when no supported Python exists). Without `nvm`: `npx -y -p node@20.19.6 -c "npm ci"`.

```bash
nvm use 20
npm ci
npm test             # Python build tests (publication/tests), 28 tests
npm run build        # ingest examples and stdlib, bundle islands, render into public/
npm run serve        # http://localhost:8000
```

Papyrus is pinned at `5.29.0` in `requirements-publication.txt`. To bump it, change that one line, run `npm test` and `npm run build`, and open a pull request. Papyrus releases through semantic-release; see its [releasing](https://github.com/AnthusAI/Papyrus/blob/main/docs/releasing.md) doc.

## How a change reaches production

1. Branch from `main`, open a pull request to `main`. (`develop` is an old branch, already merged; do not use it.)
2. The `CI` workflow (`.github/workflows/deploy.yml`) runs `npm ci`, `npm test` and `npm run build` on every push and pull request.
3. On a green push to `main`, the same workflow calls `AnthusAI/Papyrus/.github/workflows/amplify-deploy.yml`, which assumes the OIDC deploy role (no stored keys) and starts an Amplify RELEASE job for the merged commit on app `dfkbdffs2viq8`.
4. Amplify builds with `amplify.yml` (backend `ampx pipeline-deploy`, then `npm ci` and `npm run build`) and publishes `public/`. The CloudFront edge revalidates on every request, so the deploy shows at once.

## Content layout

| Where | What |
| --- | --- |
| `content/` | Authored pages in Markus Markdown. One file per URL: `content/features.md` is `/features/`. Pages start with front matter (`title`, `description`, `type: page`) and a `::band` line. |
| `web/projection.json` | Site settings: URLs, header navigation, footer, head tags, GA4 and consent, the islands bundle, page actions. |
| `web/css/site-theme.css` | The only stylesheet. |
| `web/hooks.py`, `web/site_icons.py` | The one hook: inline icons and availability chips. |
| `web/assets/` | Images (committed) and the islands bundle (built, not committed). |
| `static/` | Files published at the site root as they are: web manifest, icons, share images, `llms.txt`. |
| `data/` | `videos.json` and `books.json` for the video and book placeholders. |
| `publication/` | The build: placeholders, standard library and example pages (generated from `src/data`), islands source (`publication/islands`, React). |
| `src/components/` | React components for the islands. |
| `videos/` | The Remotion video project. |

Videos are served from the Gen 2 backend's S3 and CloudFront bucket. Refresh the URL the site reads with `npx ampx generate outputs --app-id dfkbdffs2viq8 --branch main --profile legacy`; render and upload with `npm run videos:render` and `AWS_PROFILE=legacy npm run videos:upload`.

## Where to read next

[AGENTS.md](AGENTS.md) is the operating manual. The Papyrus [static site guide](https://github.com/AnthusAI/Papyrus/blob/main/docs/building-a-papyrus-static-site.md) explains every key in `web/projection.json`.
