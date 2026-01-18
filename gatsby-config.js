/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Tactus`,
    description: `Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege.`,
    author: `@AnthusAI`,
    siteUrl: `https://main.dfkbdffs2viq8.amplifyapp.com/`,
    socialImage: `/og/monkey.png`,
    socialImageAlt: `A small monkey holding a straight razor.`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `example-usage`,
        path: `${__dirname}/src/content/example-usage`,
      },
    },
    `gatsby-plugin-mdx`,
    `gatsby-citation-manager`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Tactus`,
        short_name: `Tactus`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `#c7007e`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
