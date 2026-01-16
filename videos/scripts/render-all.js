#!/usr/bin/env node

/**
 * Render all video compositions to the out/ directory
 * 
 * Usage: npm run render
 * 
 * This script will render all compositions defined in src/Root.tsx
 * and output them to the out/ directory with appropriate filenames.
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// Define all compositions to render
const compositions = [
  {
    id: "Intro",
    outputFile: "intro.mp4",
  },
  // Add more compositions here as you create them
  // {
  //   id: "FeatureOverview",
  //   outputFile: "feature-overview.mp4",
  // },
];

// Ensure output directory exists
const outDir = path.join(__dirname, "..", "out");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("🎬 Starting video rendering...\n");

let successCount = 0;
let failCount = 0;

for (const composition of compositions) {
  const outputPath = path.join(outDir, composition.outputFile);
  
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
  } catch (error) {
    console.error(`❌ Failed to render: ${composition.id}\n`);
    failCount++;
  }
}

console.log("\n" + "=".repeat(50));
console.log(`🎉 Rendering complete!`);
console.log(`✅ Success: ${successCount}`);
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount}`);
}
console.log(`📁 Output directory: ${outDir}`);
console.log("=".repeat(50));

process.exit(failCount > 0 ? 1 : 0);
