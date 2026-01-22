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

const remotionBin = process.platform === "win32"
  ? "node_modules/.bin/remotion.cmd"
  : "node_modules/.bin/remotion";

const ensurePublicAssetsFromTimeline = (slug) => {
  const envName = process.env.BABULUS_ENV || "development";
  const timelinePath = path.join(__dirname, "..", "src", "videos", slug, `${slug}.timeline.json`);
  if (!fs.existsSync(timelinePath)) return;

  const timeline = JSON.parse(fs.readFileSync(timelinePath, "utf8"));
  const stack = [timeline];
  const referencedAssets = new Set();

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;

    if (Array.isArray(node)) {
      for (const item of node) stack.push(item);
      continue;
    }

    if (typeof node !== "object") continue;

    const src = node.src;
    if (typeof src === "string" && src.startsWith("babulus/")) {
      referencedAssets.add(src);
    }

    for (const value of Object.values(node)) stack.push(value);
  }

  const copyAsset = (src) => {
    const relative = src.slice("babulus/".length);
    let fromRelative = null;
    const slugEnvPrefix = `${slug}/env/${envName}/`;
    const envPrefix = `env/${envName}/`;

    if (relative.startsWith(slugEnvPrefix)) {
      const suffix = relative.slice(slugEnvPrefix.length);
      fromRelative = path.join(".babulus", "out", slug, "env", envName, suffix);
    } else if (relative.startsWith(envPrefix)) {
      const suffix = relative.slice(envPrefix.length);
      const segments = suffix.split("/");
      if (segments[0] === "music" || segments[0] === "sfx") {
        const filename = segments[segments.length - 1];
        fromRelative = path.join(".babulus", "out", slug, "env", envName, segments[0], filename);
      } else {
        fromRelative = path.join(".babulus", "out", slug, "env", envName, suffix);
      }
    } else if (relative.startsWith(`${slug}/`)) {
      const suffix = relative.slice(`${slug}/`.length);
      fromRelative = path.join(".babulus", "out", slug, suffix);
    } else {
      fromRelative = path.join(".babulus", "out", slug, relative);
    }

    const absFrom = path.join(__dirname, "..", fromRelative);
    const absTo = path.join(__dirname, "..", "public", src);

    if (fs.existsSync(absFrom) && !fs.existsSync(absTo)) {
      fs.mkdirSync(path.dirname(absTo), { recursive: true });
      fs.copyFileSync(absFrom, absTo);
    }
  };

  for (const src of referencedAssets) {
    copyAsset(src);
  }
};

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
  {
    id: "Guardrails",
    outputFile: "guardrails.mp4",
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
  const slug = composition.outputFile.replace(".mp4", "");

  // Check if video already exists (skip unless --fresh)
  if (!freshFlag && fs.existsSync(outputPath)) {
    console.log(`⏭️  Skipping: ${composition.id} (already exists, use --fresh to re-render)`);
    skippedCount++;
    continue;
  }

  console.log(`📹 Rendering: ${composition.id} → ${composition.outputFile}`);

  try {
    // Remotion serves `public/` assets under the `/public/` path. Some Babulus
    // generators only materialize assets for the last-generated video, so we
    // ensure any referenced `.babulus/out/...` assets exist in `public/`.
    ensurePublicAssetsFromTimeline(slug);

    execSync(
      `${remotionBin} render src/index.ts ${composition.id} ${outputPath} --concurrency=1`,
      {
        stdio: "inherit",
        cwd: path.join(__dirname, ".."),
      }
    );
    console.log(`✅ Successfully rendered: ${composition.outputFile}\n`);
    successCount++;

    // Extract poster frame if configured in the generated script JSON
    const scriptPath = path.join(
      __dirname,
      "..",
      "src",
      "videos",
      slug,
      `${slug}.script.json`
    );
    if (fs.existsSync(scriptPath)) {
      try {
        const script = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
        const posterTimeSec = script.posterTimeSec;
        if (typeof posterTimeSec === "number" && posterTimeSec > 0) {
          const posterPath = outputPath.replace(".mp4", "-poster.jpg");
          console.log(`🖼️  Extracting thumbnail at ${posterTimeSec}s...`);

          // FFmpeg: extract frame at timestamp with 85% JPG quality (q:v 4)
          execSync(
            `ffmpeg -y -ss ${posterTimeSec} -i "${outputPath}" -frames:v 1 -q:v 4 "${posterPath}"`,
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
