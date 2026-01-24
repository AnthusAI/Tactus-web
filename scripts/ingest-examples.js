#!/usr/bin/env node

/**
 * Tactus Examples Ingestion Script
 *
 * Fetches the Tactus-examples repository, parses chapter READMEs and .tac files,
 * and generates src/data/examples.json for the Gatsby website.
 *
 * Environment variables:
 * - EXAMPLES_DIR: Path to local Tactus-examples repo (optional, for development)
 * - EXAMPLES_REPO_URL: Git URL (default: https://github.com/AnthusAI/Tactus-examples.git)
 * - EXAMPLES_REF: Branch/tag to fetch (default: main)
 */

const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

// Configuration
const EXAMPLES_DIR = process.env.EXAMPLES_DIR
const EXAMPLES_REPO_URL = process.env.EXAMPLES_REPO_URL || 'https://github.com/AnthusAI/Tactus-examples.git'
const EXAMPLES_REF = process.env.EXAMPLES_REF || 'main'
const CACHE_DIR = path.join(__dirname, '../.cache/tactus-examples')
const OUTPUT_FILE = path.join(__dirname, '../src/data/examples.json')

/**
 * Get the path to the examples directory (local or cached clone)
 */
function getExamplesDir() {
  if (EXAMPLES_DIR) {
    console.log(`Using local examples directory: ${EXAMPLES_DIR}`)
    return EXAMPLES_DIR
  }

  console.log(`Cloning examples repo from ${EXAMPLES_REPO_URL}...`)

  // Clean cache if it exists
  if (fs.existsSync(CACHE_DIR)) {
    fs.removeSync(CACHE_DIR)
  }

  // Clone repo
  fs.ensureDirSync(path.dirname(CACHE_DIR))
  execSync(`git clone --depth 1 --branch ${EXAMPLES_REF} ${EXAMPLES_REPO_URL} ${CACHE_DIR}`, {
    stdio: 'inherit'
  })

  return CACHE_DIR
}

/**
 * Discover chapter directories (pattern: 01-chapter-name)
 */
function discoverChapters(examplesDir) {
  const entries = fs.readdirSync(examplesDir, { withFileTypes: true })

  return entries
    .filter(entry => entry.isDirectory() && /^\d{2}-/.test(entry.name))
    .map(entry => {
      const match = entry.name.match(/^(\d{2})-(.+)$/)
      return {
        order: parseInt(match[1], 10),
        slug: match[2],
        path: path.join(examplesDir, entry.name)
      }
    })
    .sort((a, b) => a.order - b.order)
}

/**
 * Parse chapter README to extract title and description
 */
function parseChapterReadme(chapterPath) {
  const readmePath = path.join(chapterPath, 'README.md')

  if (!fs.existsSync(readmePath)) {
    return { title: 'Untitled Chapter', description: '' }
  }

  const content = fs.readFileSync(readmePath, 'utf-8')
  const lines = content.split('\n')

  // Extract title (first # heading)
  const titleMatch = lines.find(line => line.startsWith('# '))
  const title = titleMatch ? titleMatch.replace(/^# /, '').trim() : 'Untitled Chapter'

  // Extract description (text between title and first ## or ### heading)
  const titleIndex = lines.findIndex(line => line.startsWith('# '))
  const nextHeadingIndex = lines.findIndex((line, i) => i > titleIndex && line.match(/^##/))
  const descLines = lines.slice(titleIndex + 1, nextHeadingIndex > 0 ? nextHeadingIndex : lines.length)
  const description = descLines.join('\n').trim()

  return { title, description }
}

/**
 * Discover examples in a chapter (both .tac files and folders)
 */
function discoverExamples(chapterPath) {
  const entries = fs.readdirSync(chapterPath, { withFileTypes: true })

  const examples = entries
    .filter(entry => {
      if (entry.isFile() && entry.name.endsWith('.tac')) return true
      if (entry.isDirectory() && /^\d{2}-/.test(entry.name)) return true
      return false
    })
    .map(entry => {
      const match = entry.name.match(/^(\d{2})-(.+?)(\.tac)?$/)
      return {
        order: parseInt(match[1], 10),
        slug: match[2],
        isFolder: entry.isDirectory(),
        path: path.join(chapterPath, entry.name)
      }
    })
    .sort((a, b) => a.order - b.order)

  return examples
}

/**
 * Parse example metadata from chapter README
 * Looks for example descriptions in the chapter README
 */
function parseExampleMetadata(example, chapterPath, chapterSlug, chapterDirName) {
  // Read the .tac file content
  const tacPath = example.isFolder
    ? path.join(example.path, `${example.slug}.tac`) // Assume main file has same name
    : example.path

  let code = ''
  let hasSpecs = false
  let hasEvals = false

  if (fs.existsSync(tacPath)) {
    code = fs.readFileSync(tacPath, 'utf-8')
    hasSpecs = code.includes('Specification([[')
    hasEvals = code.includes('Evaluation([[')
  }

  // Try to extract description from chapter README
  const chapterReadme = fs.readFileSync(path.join(chapterPath, 'README.md'), 'utf-8')
  const exampleSection = chapterReadme.match(new RegExp(`###.*${example.slug}.*?\\n([\\s\\S]*?)(?=###|$)`, 'i'))
  let description = ''

  if (exampleSection) {
    // Extract first paragraph after heading
    const paragraphs = exampleSection[1].split('\n\n')
    description = paragraphs.find(p => p.trim() && !p.startsWith('```') && !p.startsWith('**'))?.trim() || ''
  }

  // Generate title from slug
  const title = example.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Determine if it requires API keys (basic heuristic)
  const requiresApiKeys = code.includes('provider = "openai"') ||
                          code.includes('provider = "anthropic"') ||
                          code.includes('bedrock') ||
                          code.includes('gemini')

  const relativePath = path.relative(path.dirname(chapterPath), tacPath)

  return {
    id: example.slug,
    title,
    slug: example.slug,
    order: example.order,
    description: description || `Example: ${title}`,
    code,
    tacPath: relativePath,
    githubUrl: `https://github.com/AnthusAI/Tactus-examples/blob/main/${chapterDirName}/${path.basename(tacPath)}`,
    hasSpecs,
    hasEvals,
    requiresApiKeys
  }
}

/**
 * Main ingestion function
 */
async function ingestExamples() {
  console.log('Starting Tactus examples ingestion...')

  // Get examples directory
  const examplesDir = getExamplesDir()

  // Discover chapters
  const chapters = discoverChapters(examplesDir)
  console.log(`Found ${chapters.length} chapters`)

  // Build data structure
  const data = {
    chapters: chapters.map(chapter => {
      const { title, description } = parseChapterReadme(chapter.path)
      const examples = discoverExamples(chapter.path)
      const chapterDirName = path.basename(chapter.path)

      console.log(`  Chapter: ${title} (${examples.length} examples)`)

      return {
        id: chapter.slug,
        title,
        order: chapter.order,
        description,
        slug: chapter.slug,
        examples: examples.map(example => {
          const metadata = parseExampleMetadata(example, chapter.path, chapter.slug, chapterDirName)
          console.log(`    - ${metadata.title}`)
          return metadata
        })
      }
    })
  }

  // Ensure output directory exists
  fs.ensureDirSync(path.dirname(OUTPUT_FILE))

  // Write JSON file
  fs.writeJsonSync(OUTPUT_FILE, data, { spaces: 2 })
  console.log(`\nGenerated: ${OUTPUT_FILE}`)
  console.log(`Total: ${data.chapters.length} chapters, ${data.chapters.reduce((sum, ch) => sum + ch.examples.length, 0)} examples`)
}

// Run if called directly
if (require.main === module) {
  ingestExamples().catch(err => {
    console.error('Error during ingestion:', err)
    process.exit(1)
  })
}

module.exports = { ingestExamples }
