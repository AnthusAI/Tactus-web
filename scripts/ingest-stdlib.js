#!/usr/bin/env node

/**
 * Tactus Standard Library Ingestion Script
 *
 * Fetches the Tactus repository, parses stdlib module documentation and .tac files,
 * and generates src/data/stdlib.json for the Gatsby website.
 *
 * Environment variables:
 * - STDLIB_DIR: Path to local Tactus repo (optional, for development)
 * - TACTUS_REPO_URL: Git URL (default: https://github.com/AnthusAI/Tactus.git)
 * - TACTUS_REF: Branch/tag to fetch (default: main)
 */

const fs = require("fs-extra")
const path = require("path")
const { execSync } = require("child_process")

// Configuration
const STDLIB_DIR = process.env.STDLIB_DIR
const TACTUS_REPO_URL =
  process.env.TACTUS_REPO_URL || "https://github.com/AnthusAI/Tactus.git"
const TACTUS_REF = process.env.TACTUS_REF || "main"
const CACHE_DIR = path.join(__dirname, "../.cache/tactus-stdlib")
const OUTPUT_FILE = path.join(__dirname, "../src/data/stdlib.json")

// Path within Tactus repo to stdlib modules
const STDLIB_SUBPATH = "tactus/stdlib/tac/tactus"

/**
 * Get the path to the stdlib directory (local or cached clone)
 */
function getStdlibDir() {
  if (STDLIB_DIR) {
    const stdlibPath = path.join(STDLIB_DIR, STDLIB_SUBPATH)
    console.log(`Using local stdlib directory: ${stdlibPath}`)
    return stdlibPath
  }

  console.log(`Cloning Tactus repo from ${TACTUS_REPO_URL}...`)

  // Clean cache if it exists
  if (fs.existsSync(CACHE_DIR)) {
    fs.removeSync(CACHE_DIR)
  }

  // Clone repo (sparse checkout for just the stdlib)
  fs.ensureDirSync(path.dirname(CACHE_DIR))
  execSync(
    `git clone --depth 1 --branch ${TACTUS_REF} --filter=blob:none --sparse ${TACTUS_REPO_URL} ${CACHE_DIR}`,
    {
      stdio: "inherit",
    }
  )

  // Sparse checkout just the stdlib directory
  execSync(`git sparse-checkout set ${STDLIB_SUBPATH}`, {
    cwd: CACHE_DIR,
    stdio: "inherit",
  })

  return path.join(CACHE_DIR, STDLIB_SUBPATH)
}

/**
 * Discover stdlib modules (directories with index.md)
 */
function discoverModules(stdlibDir) {
  const entries = fs.readdirSync(stdlibDir, { withFileTypes: true })

  return entries
    .filter(entry => {
      if (!entry.isDirectory()) return false
      // Check if directory has index.md (indicating it's a documented module)
      const indexPath = path.join(stdlibDir, entry.name, "index.md")
      return fs.existsSync(indexPath)
    })
    .map(entry => ({
      slug: entry.name,
      path: path.join(stdlibDir, entry.name),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

/**
 * Parse module index.md to extract title, description, and full markdown
 */
function parseModuleIndex(modulePath) {
  const indexPath = path.join(modulePath, "index.md")

  if (!fs.existsSync(indexPath)) {
    return { title: "Untitled Module", description: "", markdown: "" }
  }

  const content = fs.readFileSync(indexPath, "utf-8")
  const lines = content.split("\n")

  // Extract title (first # heading)
  const titleMatch = lines.find(line => line.startsWith("# "))
  const title = titleMatch
    ? titleMatch.replace(/^# /, "").trim()
    : "Untitled Module"

  // Extract description (first paragraph after title)
  const titleIndex = lines.findIndex(line => line.startsWith("# "))
  let descriptionLines = []
  let foundNonEmpty = false

  for (let i = titleIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith("##")) break // Stop at next heading

    if (line.trim()) {
      foundNonEmpty = true
      descriptionLines.push(line)
    } else if (foundNonEmpty) {
      break // Stop at first blank line after content
    }
  }

  const description = descriptionLines.join(" ").trim()

  return { title, description, markdown: content }
}

/**
 * Count scenarios in a spec file
 */
function countScenarios(specContent) {
  const matches = specContent.match(/Scenario:/g)
  return matches ? matches.length : 0
}

/**
 * Discover submodules (.tac files) in a module directory
 */
function discoverSubmodules(modulePath) {
  const entries = fs.readdirSync(modulePath, { withFileTypes: true })

  return entries
    .filter(
      entry =>
        entry.isFile() &&
        entry.name.endsWith(".tac") &&
        entry.name !== "init.tac"
    )
    .map(entry => {
      const name = entry.name.replace(".tac", "")
      // Convert filename to class name (e.g., "llm" -> "LLMClassifier")
      const className = name.charAt(0).toUpperCase() + name.slice(1)

      return {
        name: className,
        file: entry.name,
        path: path.join(modulePath, entry.name),
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Parse module metadata
 */
function parseModuleMetadata(module, stdlibDir) {
  const { title, description, markdown } = parseModuleIndex(module.path)

  // Check for spec file
  const specPath = path.join(stdlibDir, `${module.slug}.spec.tac`)
  let hasSpecs = false
  let specCount = 0

  if (fs.existsSync(specPath)) {
    const specContent = fs.readFileSync(specPath, "utf-8")
    hasSpecs = specContent.includes("Specification([[")
    specCount = countScenarios(specContent)
  }

  // Discover submodules
  const submodules = discoverSubmodules(module.path)

  // Build GitHub URL
  const githubUrl = `https://github.com/AnthusAI/Tactus/tree/main/${STDLIB_SUBPATH}/${module.slug}`

  return {
    id: module.slug,
    name: title,
    slug: module.slug,
    description,
    markdown,
    hasSpecs,
    specCount,
    submodules,
    githubUrl,
  }
}

/**
 * Main ingestion function
 */
async function ingestStdlib() {
  console.log("Starting Tactus stdlib ingestion...")

  // Get stdlib directory
  const stdlibDir = getStdlibDir()

  // Discover modules
  const modules = discoverModules(stdlibDir)
  console.log(`Found ${modules.length} stdlib modules`)

  // Build data structure
  const data = {
    modules: modules.map(module => {
      const metadata = parseModuleMetadata(module, stdlibDir)
      console.log(
        `  Module: ${metadata.name} (${metadata.submodules.length} submodules, ${metadata.specCount} specs)`
      )
      return metadata
    }),
  }

  // Ensure output directory exists
  fs.ensureDirSync(path.dirname(OUTPUT_FILE))

  // Write JSON file
  fs.writeJsonSync(OUTPUT_FILE, data, { spaces: 2 })
  console.log(`\nGenerated: ${OUTPUT_FILE}`)
  console.log(
    `Total: ${data.modules.length} modules, ${data.modules.reduce(
      (sum, m) => sum + m.specCount,
      0
    )} specs`
  )
}

// Run if called directly
if (require.main === module) {
  ingestStdlib().catch(err => {
    console.error("Error during ingestion:", err)
    process.exit(1)
  })
}

module.exports = { ingestStdlib }
