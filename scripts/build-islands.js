const path = require("node:path")
const { build } = require("esbuild")

const root = path.join(__dirname, "..")
const outputDirectory = path.join(root, ".build", "islands")

const shared = {
  bundle: true,
  minify: true,
  target: "es2020",
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
}

Promise.all([
  build({
    ...shared,
    entryPoints: { islands: path.join(root, "publication", "islands", "entry.jsx") },
    outdir: outputDirectory,
    format: "iife",
  }),
  build({
    ...shared,
    entryPoints: { "hitl-islands": path.join(root, "publication", "islands", "hitl-entry.jsx") },
    outdir: path.join(outputDirectory, "hitl"),
    format: "esm",
    splitting: true,
    chunkNames: "chunks/[name]-[hash]",
  }),
]).catch(() => process.exit(1))
