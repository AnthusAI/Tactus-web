## Tactus-web

The marketing site for [Tactus](https://tactus.anth.us). It is a standard [Papyrus](https://github.com/AnthusAI/Papyrus)
static site: Papyrus renders the pages, the header, the family footer, the sitemap, `robots.txt`, the 404 page and the
Markdown twins; this repository supplies the content, the theme and the interactive demos.

| Where | What |
|---|---|
| `content/` | Authored pages in Markus Markdown with Papyrus page blocks (`::band`, `::column`, `::button`, `::island`). One file per URL: `content/features.md` is `/features/`, `content/use-cases/refund-ops.md` is `/use-cases/refund-ops/`. |
| `web/projection.json` | Site settings: URLs, header navigation, footer, head tags, the islands bundle. |
| `web/css/site-theme.css` | The only stylesheet. |
| `web/hooks.py`, `web/site_icons.py` | The one hook: inline icons and availability chips (`{{icon name}}`, `{{availability-chip kind}}`). |
| `web/assets/` | Images (committed) and the islands bundle (built, not committed). |
| `static/` | Files published at the site root as they are: web manifest, icons, share images, `llms.txt`, the old redirect stub. |
| `data/` | `videos.json` and `books.json`, read by the video and book placeholders. |
| `publication/` | The build: placeholders, the standard library and example pages (generated from `src/data`), and the islands source (`publication/islands`, React). |
| `src/components/` | React components for the islands (diagrams, animated code block, chat demo parts). |
| `videos/` | The Remotion video project. |

### Content

Every page starts with front matter (`title`, `description`, `type: page`) and a `::band` line. A band is a full-width
section; `tone="muted"` shades it and `columns="..."` names a layout that `site-theme.css` styles. Interactive demos
are islands: `::island{name="EvaluationsDiagram"}`. The `AnimatedCodeBlock` island takes the fenced code block that
follows it. Placeholders written as `{{name}}` stand for generated blocks (`{{videos-featured}}`, `{{books}}`,
`{{example-snippet hello-world}}`, `{{stdlib-modules}}`, ...); see `publication/authored.py`.

The standard library, example chapter and example pages are written from `src/data/stdlib.json` and
`src/data/examples.json`, which `npm run stdlib:ingest` and `npm run examples:ingest` produce from the Tactus and
Tactus-examples repositories (set `EXAMPLES_DIR` to use a local checkout of the examples).

### Local development

Node **20.x** and Python 3.12 or newer are required (`bin/publication.sh` makes a virtual environment from
`requirements-publication.txt`, using `uv` when no supported Python is installed).

```bash
nvm use 20
npm ci
npm run build        # ingest data, bundle the islands, render the site into public/
npm run serve        # http://localhost:8000
npm test             # build tests (Python)
```

Without `nvm`: `npx -y -p node@20.19.6 -c "npm ci"`.

### Deploy (Amplify Hosting)

Merging to `main` deploys: the Amplify app `Tactus-web` (account 335163751677, app id `dfkbdffs2viq8`) builds with
`amplify.yml` and publishes `public/`. Branch builds other than `main` get their own `noindex` origin. The Amplify
Gen 2 backend (`amplify/backend.ts`) holds the video bucket and its CloudFront distribution.

### Videos (S3 + CloudFront)

The videos page reads the CloudFront URL from `amplify_outputs.json` at build time (or `VIDEOS_BASE_URL`). To refresh it:

```bash
npx ampx generate outputs --app-id dfkbdffs2viq8 --branch main --profile legacy
```

Local video workflow:

```bash
npm run babulus            # generate audio assets only
npm run videos:render      # render videos to videos/out/
AWS_PROFILE=legacy npm run videos:upload   # upload MP4s and posters to the bucket
```
