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
}

/**
 * @type {import('gatsby').GatsbyNode['onCreateWebpackConfig']}
 */
exports.onCreateWebpackConfig = ({ actions, stage }) => {
  // Exclude videos directory from Gatsby webpack processing
  // This prevents Remotion components from being evaluated during build
  actions.setWebpackConfig({
    externals: stage === 'build-html' || stage === 'develop-html'
      ? {
          // Externalize videos directory during SSR
          '../../../videos/src/components/AnimatedFuchsiaSquare': 'commonjs ../../../videos/src/components/AnimatedFuchsiaSquare',
        }
      : {},
  })
}
