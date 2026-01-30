#!/usr/bin/env node

/**
 * Render all video compositions using Babulus renderer
 *
 * Usage:
 *   npm run render              # Render all videos (skip existing)
 *   npm run render -- --fresh   # Re-render all videos
 *   npm run render -- intro     # Render only intro video (skip if exists)
 *   npm run render -- intro --fresh  # Force re-render intro video
 */

const { execSync } = require("child_process")
const path = require("path")
const fs = require("fs")

// Parse command line arguments
const args = process.argv.slice(2)
const freshFlag = args.includes("--fresh")
const targetComposition = args.find(arg => !arg.startsWith("--"))

// Define all compositions to render
const allCompositions = [
  {
    id: "intro",
    outputFile: "intro.mp4",
  },
  {
    id: "why-a-new-language",
    outputFile: "why-new-language.mp4",
  },
  {
    id: "guardrails-for-agent-autonomy",
    outputFile: "guardrails.mp4",
  },
]

// Filter compositions based on target
const compositions = targetComposition
  ? allCompositions.filter(
      c => c.id === targetComposition || c.id.includes(targetComposition) || c.outputFile.replace(".mp4", "") === targetComposition
    )
  : allCompositions

if (targetComposition && compositions.length === 0) {
  console.error(`❌ Unknown composition: ${targetComposition}`)
  console.log(`Available: ${allCompositions.map(c => c.id).join(", ")}`)
  process.exit(1)
}

// Ensure output directory exists
const outDir = path.join(__dirname, "..", "out")
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

console.log("🎬 Starting video rendering with Babulus...")
if (freshFlag) {
  console.log("🔄 Fresh render mode: re-rendering all videos")
}
if (targetComposition) {
  console.log(`🎯 Target: ${compositions[0].id}`)
}
console.log()

let successCount = 0
let failCount = 0
let skippedCount = 0

for (const composition of compositions) {
  const outputPath = path.join(outDir, composition.outputFile)
  const slug = composition.id
  const scriptPath = path.join(__dirname, "..", "src", "videos", slug, `${slug}.script.json`)
  const timelinePath = path.join(__dirname, "..", "src", "videos", slug, `${slug}.timeline.json`)
  const audioPath = path.join(__dirname, "..", "public", "babulus", `${slug}.wav`)
  const framesDir = path.join(__dirname, "..", ".babulus", "frames", slug)

  // Check if video already exists (skip unless --fresh)
  if (!freshFlag && fs.existsSync(outputPath)) {
    console.log(
      `⏭️  Skipping: ${composition.id} (already exists, use --fresh to re-render)`
    )
    skippedCount++
    continue
  }

  // Check if required files exist
  if (!fs.existsSync(scriptPath)) {
    console.error(`❌ Script not found: ${scriptPath}`)
    console.log(`   Run: npm run generate`)
    failCount++
    continue
  }
  if (!fs.existsSync(audioPath)) {
    console.error(`❌ Audio not found: ${audioPath}`)
    console.log(`   Run: npm run generate`)
    failCount++
    continue
  }

  console.log(`📹 Rendering: ${composition.id} → ${composition.outputFile}`)

  try {
    // Use our custom render script that registers components
    const renderScript = path.join(__dirname, "render-video-from-script.ts")
    const tsxBin = path.join(__dirname, "..", "node_modules", "babulus", "node_modules", ".bin", "tsx")

    // Read script to get metadata
    const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"))
    const fps = script.meta?.fps || 30
    const width = script.meta?.width || 1280
    const height = script.meta?.height || 720

    const cmd = `node "${tsxBin}" "${renderScript}" --script "${scriptPath}" --frames "${framesDir}" --out "${outputPath}" --audio "${audioPath}" --fps ${fps} --width ${width} --height ${height} --workers 2 --title "${composition.id}"`

    execSync(cmd, {
      stdio: "inherit",
      cwd: path.join(__dirname, ".."),
    })

    console.log(`✅ Successfully rendered: ${composition.outputFile}\n`)
    successCount++

    // Extract poster frame if configured in the generated script JSON
    const posterTimeSec = script.posterTimeSec
    if (typeof posterTimeSec === "number" && posterTimeSec > 0) {
      try {
        const posterPath = outputPath.replace(".mp4", "-poster.jpg")
        console.log(`🖼️  Extracting thumbnail at ${posterTimeSec}s...`)

        // FFmpeg: extract frame at timestamp with 85% JPG quality (q:v 4)
        execSync(
          `ffmpeg -y -ss ${posterTimeSec} -i "${outputPath}" -frames:v 1 -q:v 4 "${posterPath}"`,
          { stdio: "inherit" }
        )
        console.log(`✅ Thumbnail saved: ${path.basename(posterPath)}`)

        // Embed poster directly into the MP4 (no re-encoding, just adds thumbnail stream)
        const tempPath = outputPath.replace(".mp4", "-temp.mp4")
        console.log(`📦 Embedding poster into ${path.basename(outputPath)}...`)

        execSync(
          `ffmpeg -y -i "${outputPath}" -i "${posterPath}" -map 0 -map 1 -c copy -disposition:v:1 attached_pic "${tempPath}"`,
          { stdio: "inherit" }
        )

        // Replace original with poster-embedded version
        fs.renameSync(tempPath, outputPath)
        console.log(`✅ Poster embedded into ${path.basename(outputPath)}\n`)
      } catch (posterError) {
        console.error(
          `⚠️  Failed to extract/embed poster frame: ${posterError.message}\n`
        )
        // Don't fail the entire build if poster extraction fails
      }
    }
  } catch (error) {
    console.error(`❌ Failed to render: ${composition.id}`)
    console.error(error.message)
    console.log()
    failCount++
  }
}

console.log("\n" + "=".repeat(50))
console.log(`🎉 Rendering complete!`)
console.log(`✅ Success: ${successCount}`)
if (skippedCount > 0) {
  console.log(`⏭️  Skipped: ${skippedCount}`)
}
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount}`)
}
console.log(`📁 Output directory: ${outDir}`)
console.log("=".repeat(50))

process.exit(failCount > 0 ? 1 : 0)
