// Bundles the islands (React components mounted by Papyrus's islands runtime) into web/assets:
//   islands.js    one ES module; it loads chunks/ on demand (the HITL chat demo)
//   islands.css   the bundle's CSS plus the Tailwind utilities the components use
const fs = require("node:fs")
const path = require("node:path")
const { build } = require("esbuild")
const postcss = require("postcss")
const tailwind = require("@tailwindcss/postcss")

const root = path.join(__dirname, "..")
const outputDirectory = path.join(root, "web", "assets")

const utilities = async () => {
  const input = `@import "tailwindcss/utilities";\n@config "${path.join(root, "tailwind.config.js")}";\n`
  const result = await postcss([tailwind({ base: root })]).process(input, { from: path.join(root, "web", "islands-utilities.css") })
  return result.css
}

const main = async () => {
  fs.rmSync(path.join(outputDirectory, "chunks"), { recursive: true, force: true })
  await build({
    bundle: true,
    minify: true,
    target: "es2020",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    loader: { ".png": "dataurl", ".jpg": "dataurl", ".svg": "dataurl", ".module.css": "local-css", ".css": "css" },
    logLevel: "warning",
    entryPoints: { islands: path.join(root, "publication", "islands", "entry.jsx") },
    outdir: outputDirectory,
    format: "esm",
    splitting: true,
    chunkNames: "chunks/[name]-[hash]",
  })
  const stylesheet = path.join(outputDirectory, "islands.css")
  fs.appendFileSync(stylesheet, "\n" + (await utilities()))
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
