const path = require("node:path")
const { build } = require("esbuild")

const root = path.join(__dirname, "..")
const outputDirectory = path.join(root, ".build", "islands")

build({
  entryPoints: [path.join(root, "publication", "islands", "entry.jsx")],
  outfile: path.join(outputDirectory, "islands.js"),
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  target: "es2019",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: {
    ".png": "dataurl",
    ".jpg": "dataurl",
    ".svg": "dataurl",
    ".module.css": "local-css",
    ".css": "css",
  },
  logLevel: "warning",
}).catch(() => process.exit(1))
