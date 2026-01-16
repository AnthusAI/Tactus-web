const { execSync } = require("node:child_process")
const { existsSync, readdirSync } = require("node:fs")
const path = require("node:path")

const repoRoot = path.resolve(__dirname, "..")

const readOutputs = () => {
  const outputsPath = path.join(repoRoot, "amplify_outputs.json")
  if (!existsSync(outputsPath)) return null
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(outputsPath)
}

const parseArgs = () => {
  const args = process.argv.slice(2)
  const out = {
    bucket: process.env.VIDEOS_BUCKET || null,
    prefix: process.env.VIDEOS_PREFIX || "videos",
    outDir: process.env.VIDEOS_OUT_DIR
      ? path.resolve(process.env.VIDEOS_OUT_DIR)
      : path.join(repoRoot, "videos", "out"),
    dryRun: false,
    cacheControl: process.env.VIDEOS_CACHE_CONTROL || "public,max-age=300",
  }

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === "--bucket") out.bucket = args[++i]
    else if (a === "--prefix") out.prefix = args[++i]
    else if (a === "--out-dir") out.outDir = path.resolve(args[++i])
    else if (a === "--dry-run") out.dryRun = true
    else if (a === "--cache-control") out.cacheControl = args[++i]
    else {
      throw new Error(
        `Unknown arg: ${a}\n\n` +
          "Usage:\n" +
          "  node scripts/upload-videos.js [--bucket <name>] [--prefix videos] [--out-dir <path>] [--cache-control <value>] [--dry-run]\n"
      )
    }
  }

  return out
}

const listMp4s = (dir) => {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".mp4"))
    .map((f) => path.join(dir, f))
}

const run = (cmd, opts = {}) => {
  execSync(cmd, { stdio: "inherit", ...opts })
}

const main = () => {
  const opts = parseArgs()

  if (!opts.bucket) {
    const outputs = readOutputs()
    const bucketFromOutputs = outputs?.custom?.videosBucketName
    if (bucketFromOutputs) opts.bucket = bucketFromOutputs
  }

  if (!opts.bucket) {
    throw new Error(
      "Missing S3 bucket name.\n\n" +
        "Either:\n" +
        "- Deploy the Amplify Gen2 backend and generate `amplify_outputs.json`, or\n" +
        "- Pass `--bucket <name>`.\n"
    )
  }

  const mp4s = listMp4s(opts.outDir)
  if (mp4s.length === 0) {
    throw new Error(`No .mp4 files found in ${opts.outDir}`)
  }

  const s3Dest = `s3://${opts.bucket}/${opts.prefix}/`
  const dry = opts.dryRun ? "--dryrun" : ""

  console.log(`Uploading ${mp4s.length} video(s) from ${opts.outDir} -> ${s3Dest}`)
  run(
    [
      "aws s3 sync",
      `"${opts.outDir}"`,
      `"${s3Dest}"`,
      "--exclude \"*\"",
      "--include \"*.mp4\"",
      `--cache-control "${opts.cacheControl}"`,
      dry,
    ]
      .filter(Boolean)
      .join(" ")
  )

  console.log("Done.")
}

main()
