import { dirname, join } from "path"
import { fileURLToPath } from "url"

const rootDir = dirname(fileURLToPath(import.meta.url))

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "./**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/react-webpack5",
  webpackFinal: async webpackConfig => {
    webpackConfig.resolve = webpackConfig.resolve || {}
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      gatsby: join(rootDir, "mocks", "gatsby.js"),
      "gatsby-link": join(rootDir, "mocks", "gatsby.js"),
    }

    return webpackConfig
  },
}

export default config
