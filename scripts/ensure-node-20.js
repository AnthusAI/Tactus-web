/* eslint-disable no-console */

const REQUIRED_MAJOR = 20
const current = process.versions.node
const major = Number.parseInt(String(current).split(".")[0], 10)

if (Number.isNaN(major) || major !== REQUIRED_MAJOR) {
  console.error("")
  console.error(
    `[tactus-web] Unsupported Node.js version: v${current} (expected ${REQUIRED_MAJOR}.x)`
  )
  console.error("")
  console.error("Fix:")
  console.error(`- Use Node ${REQUIRED_MAJOR} (Amplify uses Node 20).`)
  console.error(
    `- If you don't use a version manager, you can run:\n` +
      `  npx -y -p node@20.19.6 -c \"npm ci\"\n` +
      `  npx -y -p node@20.19.6 -c \"npm run develop\"`
  )
  console.error("")
  process.exit(1)
}
