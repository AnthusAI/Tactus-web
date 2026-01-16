const { execSync } = require("node:child_process")
const { existsSync, mkdirSync, copyFileSync } = require("node:fs")
const path = require("node:path")

const repoRoot = path.resolve(__dirname, "..")
const videosDir = path.join(repoRoot, "videos")
const outDir = path.join(videosDir, "out")
const siteStaticVideosDir = path.join(repoRoot, "static", "videos")

const run = (cmd, opts = {}) => {
  execSync(cmd, { stdio: "inherit", ...opts })
}

const main = () => {
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
  run("npm run babulus:generate", { cwd: videosDir, env })

  run("npm run render:intro", { cwd: videosDir })

  const src = path.join(outDir, "intro.mp4")
  const dst = path.join(siteStaticVideosDir, "intro.mp4")
  copyFileSync(src, dst)
  console.log(`Copied ${src} -> ${dst}`)
}

main()
