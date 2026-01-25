const { execSync } = require("node:child_process")
const { existsSync, mkdirSync, copyFileSync, readdirSync } = require("node:fs")
const path = require("node:path")

const repoRoot = path.resolve(__dirname, "..")
const videosDir = path.join(repoRoot, "videos")
const outDir = path.join(videosDir, "out")
const siteStaticVideosDir = path.join(repoRoot, "static", "videos")

const run = (cmd, opts = {}) => {
  execSync(cmd, { stdio: "inherit", ...opts })
}

const main = () => {
  const args = process.argv.slice(2)
  const passThroughArgs = args.filter(Boolean).map(a => a.trim())
  const targetComposition = passThroughArgs.find(a => a && !a.startsWith("--"))

  if (!existsSync(videosDir)) {
    throw new Error(`Missing videos/ subproject at ${videosDir}`)
  }
  mkdirSync(siteStaticVideosDir, { recursive: true })

  // Install deps if needed.
  if (!existsSync(path.join(videosDir, "node_modules"))) {
    run("npm ci", { cwd: videosDir })
  }

  // Ensure generated audio + timelines exist for Remotion renders.
  // This stages assets under `videos/public/babulus/`, which Remotion expects at render time.
  const defaultPython = "/opt/anaconda3/envs/py311/bin/python"
  const env = { ...process.env }
  if (!env.BABULUS_PYTHON && existsSync(defaultPython)) {
    env.BABULUS_PYTHON = defaultPython
  }

  const compositionToSlug = {
    Intro: "intro",
    WhyNewLanguage: "why-new-language",
    Guardrails: "guardrails",
  }

  const slugsToGenerate = targetComposition
    ? [compositionToSlug[targetComposition] || targetComposition]
    : ["intro", "why-new-language"] // published videos only (avoid generating drafts)

  for (const slug of slugsToGenerate) {
    const babulusFile = `content/${slug}.babulus.yml`
    const babulusPath = path.join(videosDir, babulusFile)
    if (existsSync(babulusPath)) {
      run(`npm run babulus:generate -- ${babulusFile}`, { cwd: videosDir, env })
    } else if (slug === targetComposition) {
      // Fall back to generating all content if the user passed an unknown target.
      run("npm run babulus:generate -- content/", { cwd: videosDir, env })
      break
    }
  }

  run(`npm run render -- ${passThroughArgs.join(" ")}`.trim(), {
    cwd: videosDir,
  })

  // Copy rendered artifacts into Gatsby's `static/videos/` for local preview.
  // (These are not bundled; production should use the CDN URLs.)
  const outFiles = existsSync(outDir) ? readdirSync(outDir) : []
  const toCopy = outFiles.filter(
    f => f.toLowerCase().endsWith(".mp4") || f.toLowerCase().endsWith(".jpg")
  )

  for (const filename of toCopy) {
    const src = path.join(outDir, filename)
    const dst = path.join(siteStaticVideosDir, filename)
    copyFileSync(src, dst)
    console.log(`Copied ${src} -> ${dst}`)
  }
}

main()
