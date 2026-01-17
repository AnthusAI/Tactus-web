#!/usr/bin/env node

/**
 * Render all video compositions to the out/ directory
 *
 * Usage:
 *   npm run render              # Render all videos (skip existing)
 *   npm run render -- --fresh   # Re-render all videos
 *   npm run render -- intro     # Render only intro video (skip if exists)
 *   npm run render -- intro --fresh  # Force re-render intro video
 *
 * This script will render all compositions defined in src/Root.tsx
 * and output them to the out/ directory with appropriate filenames.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Parse command line arguments
const args = process.argv.slice(2);
const freshFlag = args.includes("--fresh");
const targetComposition = args.find(arg => !arg.startsWith("--"));

// Define all compositions to render
const allCompositions = [
  {
    id: "Intro",
    outputFile: "intro.mp4",
  },
  {
    id: "WhyNewLanguage",
    outputFile: "why-new-language.mp4",
  },
];

// Filter compositions based on target
const compositions = targetComposition
  ? allCompositions.filter(c => c.id.toLowerCase() === targetComposition.toLowerCase())
  : allCompositions;

if (targetComposition && compositions.length === 0) {
  console.error(`❌ Unknown composition: ${targetComposition}`);
  console.log(`Available: ${allCompositions.map(c => c.id).join(", ")}`);
  process.exit(1);
}

// Ensure output directory exists
const outDir = path.join(__dirname, "..", "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("🎬 Starting video rendering...");
if (freshFlag) {
  console.log("🔄 Fresh render mode: re-rendering all videos");
}
if (targetComposition) {
  console.log(`🎯 Target: ${compositions[0].id}`);
}
console.log();

let successCount = 0;
let failCount = 0;
let skippedCount = 0;

for (const composition of compositions) {
  const outputPath = path.join(outDir, composition.outputFile);

  // Check if video already exists (skip unless --fresh)
  if (!freshFlag && fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping: ${composition.id} (already exists, use --fresh to re-render)`);
    skippedCount++;
    continue;
  }

  console.log(`📹 Rendering: ${composition.id} → ${composition.outputFile}`);

  try {
    execSync(
      `npx remotion render src/index.ts ${composition.id} ${outputPath}`,
      {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      }
    );
    console.log(`✅ Successfully rendered: ${composition.outputFile}\n`);
    successCount++;

    // Extract poster frame if configured in Babulus YAML
    const yamlPath = path.join(__dirname, "..", "content",
                               composition.outputFile.replace(".mp4", ".babulus.yml"));
    if (fs.existsSync(yamlPath)) {
      try {
        const yaml = require('js-yaml');
        const config = yaml.load(fs.readFileSync(yamlPath, 'utf8'));

        if (config.poster_time) {
          const posterPath = outputPath.replace(".mp4", "-poster.jpg");
          console.log(`🖼️  Extracting thumbnail at ${config.poster_time}...`);

          // FFmpeg: extract frame at timestamp with 85% JPG quality (q:v 4)
          execSync(
            `ffmpeg -y -ss ${config.poster_time} -i "${outputPath}" -frames:v 1 -q:v 4 "${posterPath}"`,
            { stdio: "inherit" }
          );
          console.log(`✅ Thumbnail saved: ${path.basename(posterPath)}`);

          // Embed poster directly into the MP4 (no re-encoding, just adds thumbnail stream)
          const tempPath = outputPath.replace(".mp4", "-temp.mp4");
          console.log(`📦 Embedding poster into ${path.basename(outputPath)}...`);

          // Use FFmpeg to copy streams and add poster/thumbnail attachment
          // -map 0 copies all streams, -c copy avoids re-encoding, -disposition:v:1 attached_pic marks as thumbnail
          execSync(
            `ffmpeg -y -i "${outputPath}" -i "${posterPath}" -map 0 -map 1 -c copy -disposition:v:1 attached_pic "${tempPath}"`,
            { stdio: "inherit" }
          );

          // Replace original with poster-embedded version
          fs.renameSync(tempPath, outputPath);
          console.log(`✅ Poster embedded into ${path.basename(outputPath)}\n`);
        }
      } catch (posterError) {
        console.error(`⚠️  Failed to extract/embed poster frame: ${posterError.message}\n`);
        // Don't fail the entire build if poster extraction fails
      }
    }
  } catch (error) {
    console.error(`❌ Failed to render: ${composition.id}\n`);
    failCount++;
  }
}

console.log("\n" + "=".repeat(50));
console.log(`🎉 Rendering complete!`);
console.log(`✅ Success: ${successCount}`);
if (skippedCount > 0) {
  console.log(`⏭️  Skipped: ${skippedCount}`);
}
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount}`);
}
console.log(`📁 Output directory: ${outDir}`);
console.log("=".repeat(50));

process.exit(failCount > 0 ? 1 : 0);
