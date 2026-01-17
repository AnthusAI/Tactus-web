## Tactus-web

Gatsby site scaffolded for AWS Amplify Hosting and ready for Amplify Gen2 backend (optional).

### Local development

Node **20.x** is required (Gatsby may fail on newer non-LTS versions).

```bash
nvm install 20
nvm use 20
npm ci
npm run develop
```

If you don’t use `nvm`, you can run Node 20 via `npx`:

```bash
npx -y -p node@20.19.6 -c "npm ci"
npx -y -p node@20.19.6 -c "npm run develop"
```

### Deploy (Amplify Hosting)

1. Push this repo to GitHub (or another Git provider supported by Amplify Hosting).
2. In AWS Console (region `us-east-1`), create an Amplify app and connect the repo/branch.
3. Keep the default build settings, or use the build spec in `amplify.yml`.

### Amplify Gen2 (optional, no resources configured)

This repo includes a minimal Gen2 backend entrypoint at `amplify/backend.ts` that defines an empty backend.

To use local Gen2 workflows (no Gen 1 `amplify` CLI):

```bash
npx ampx sandbox --profile anthus --region us-east-1
```

### Videos (S3 + CloudFront)

The backend defines a private S3 bucket + CloudFront distribution for public MP4 hosting. The site's `src/pages/videos.js` uses `GATSBY_VIDEOS_BASE_URL` to point at the CDN.

#### Getting Backend Configuration

To retrieve the deployed backend configuration (bucket name, CloudFront URL, etc.):

```bash
npx ampx generate outputs --app-id dfkbdffs2viq8 --branch main --profile anthus
```

This creates `amplify_outputs.json` with:
- `custom.videosBucketName` - S3 bucket for videos
- `custom.videosCdnUrl` - CloudFront distribution URL

#### Local Video Workflow

```bash
# Generate audio assets only (fast, for iteration on scripts/timing)
npm run babulus

# Render videos to videos/out/ (and copies to static/videos/ for local preview)
# This automatically runs babulus generation first.
npm run videos:render

# Upload rendered MP4s and poster images to S3
# Requires AWS_PROFILE with access to the S3 bucket (reads bucket name from amplify_outputs.json)
AWS_PROFILE=anthus npm run videos:upload
```

The videos page automatically reads the CloudFront URL from `amplify_outputs.json` at build time. Commit `amplify_outputs.json` to your repository so it's available during the Amplify build.

## 🚀 Quick start (Netlify)

Deploy this starter with one click on [Netlify](https://app.netlify.com/signup):

[<img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" />](https://app.netlify.com/start/deploy?repository=https://github.com/gatsbyjs/gatsby-starter-default)

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a typical Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

1.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

1.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

1.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

1.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/) for more detail).

1.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

1.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

1.  **`LICENSE`**: This Gatsby starter is licensed under the 0BSD license. This means that you can see this file as a placeholder and replace it with your own license.

1.  **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

1.  **`README.md`**: A text file containing useful reference information about your project.

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.com/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.com/docs/tutorial/getting-started/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.com/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.

## 💫 Deploy

[Build, Deploy, and Host On Netlify](https://netlify.com)

The fastest way to combine your favorite tools and APIs to build the fastest sites, stores, and apps for the web. And also the best place to build, deploy, and host your Gatsby sites.

<!-- AUTO-GENERATED-CONTENT:END -->
