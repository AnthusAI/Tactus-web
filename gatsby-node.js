/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */
exports.createPages = async ({ actions }) => {
  const { createPage, createRedirect } = actions
  const path = require('path')
  const fs = require('fs')

  createRedirect({
    fromPath: "/paradigm",
    toPath: "/#paradigm",
    isPermanent: true,
    redirectInBrowser: true,
  })
  createRedirect({
    fromPath: "/paradigm/",
    toPath: "/#paradigm",
    isPermanent: true,
    redirectInBrowser: true,
  })

  createRedirect({
    fromPath: "/procedure-sandboxing",
    toPath: "/guardrails/",
    isPermanent: true,
    redirectInBrowser: true,
  })
  createRedirect({
    fromPath: "/procedure-sandboxing/",
    toPath: "/guardrails/",
    isPermanent: true,
    redirectInBrowser: true,
  })

  createPage({
    path: "/using-dsg",
    component: require.resolve("./src/templates/using-dsg.js"),
    context: {},
    defer: true,
  })

  // Load examples data and create dynamic pages
  const examplesDataPath = path.resolve(__dirname, './src/data/examples.json')

  if (fs.existsSync(examplesDataPath)) {
    const examplesData = JSON.parse(fs.readFileSync(examplesDataPath, 'utf-8'))
    const { chapters } = examplesData

    // Create chapter pages
    chapters.forEach(chapter => {
      createPage({
        path: `/examples/${chapter.slug}/`,
        component: path.resolve('./src/templates/chapter.js'),
        context: {
          chapter,
          allChapters: chapters,
        },
      })

      // Create example detail pages
      chapter.examples.forEach((example, index) => {
        const prevExample = index > 0 ? chapter.examples[index - 1] : null
        const nextExample = index < chapter.examples.length - 1 ? chapter.examples[index + 1] : null

        createPage({
          path: `/examples/${chapter.slug}/${example.slug}/`,
          component: path.resolve('./src/templates/example.js'),
          context: {
            example,
            chapter,
            prevExample,
            nextExample,
          },
        })
      })
    })

    console.log(`✅ Created ${chapters.length} chapter pages and ${chapters.reduce((sum, ch) => sum + ch.examples.length, 0)} example pages`)
  } else {
    console.warn('⚠️  examples.json not found. Run `npm run examples:ingest` first.')
  }

  // Load stdlib data and create dynamic pages
  const stdlibDataPath = path.resolve(__dirname, './src/data/stdlib.json')

  if (fs.existsSync(stdlibDataPath)) {
    const stdlibData = JSON.parse(fs.readFileSync(stdlibDataPath, 'utf-8'))
    const { modules } = stdlibData

    // Create module detail pages
    modules.forEach((module, index) => {
      const prevModule = index > 0 ? modules[index - 1] : null
      const nextModule = index < modules.length - 1 ? modules[index + 1] : null

      createPage({
        path: `/stdlib/${module.slug}/`,
        component: path.resolve('./src/templates/stdlib-module.js'),
        context: {
          module,
          prevModule,
          nextModule,
          allModules: modules,
        },
      })
    })

    console.log(`✅ Created ${modules.length} stdlib module pages`)
  } else {
    console.warn('⚠️  stdlib.json not found. Run `npm run stdlib:ingest` first.')
  }
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']}
 */
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  const path = require("path")

  // If the HITL component library isn't installed (e.g. Amplify builds without
  // private registry access), alias it to a local shim so the site still builds.
  const resolveAlias = {}
  try {
    require.resolve("@anthus/tactus-hitl-components")
  } catch (e) {
    resolveAlias["@anthus/tactus-hitl-components"] = path.resolve(
      __dirname,
      "./src/shims/tactus-hitl-components.js"
    )
    resolveAlias["@anthus/tactus-hitl-components/styles.css"] = path.resolve(
      __dirname,
      "./src/shims/tactus-hitl-components.css"
    )
  }

  // Exclude videos directory from Gatsby webpack processing
  // This prevents Remotion components from being evaluated during build
  actions.setWebpackConfig({
    externals: stage === 'build-html' || stage === 'develop-html'
      ? {
          // Externalize videos directory during SSR
          '../../../videos/src/components/AnimatedFuchsiaSquare': 'commonjs ../../../videos/src/components/AnimatedFuchsiaSquare',
        }
      : {},
    resolve: Object.keys(resolveAlias).length ? { alias: resolveAlias } : {},
  })
}
