import * as React from "react"
import { Link } from "gatsby"
import { Copy, Check } from "lucide-react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./stdlib-module.module.css"

const CommandBlock = ({ command }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <pre className={styles.commandBlock}>
      <span className={styles.commandPrompt}>$</span>
      <code>{command}</code>
      <button
        className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
        onClick={handleCopy}
        aria-label="Copy command"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </pre>
  )
}

// Simple markdown renderer for code blocks and basic formatting
const renderMarkdown = markdown => {
  if (!markdown) return null

  // Split into sections by code blocks
  const sections = []
  let currentText = ""
  let inCodeBlock = false
  let codeContent = ""
  let codeLang = ""

  const lines = markdown.split("\n")

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End code block
        sections.push({
          type: "code",
          lang: codeLang,
          content: codeContent.trim(),
        })
        codeContent = ""
        codeLang = ""
        inCodeBlock = false
      } else {
        // Start code block
        if (currentText.trim()) {
          sections.push({ type: "text", content: currentText.trim() })
          currentText = ""
        }
        codeLang = line.slice(3).trim() || "lua"
        inCodeBlock = true
      }
    } else if (inCodeBlock) {
      codeContent += line + "\n"
    } else {
      currentText += line + "\n"
    }
  }

  // Push remaining text
  if (currentText.trim()) {
    sections.push({ type: "text", content: currentText.trim() })
  }

  return sections.map((section, i) => {
    if (section.type === "code") {
      return (
        <div key={i} className={styles.codeBlock}>
          <pre className={styles.pre}>
            <code className={`language-${section.lang}`}>
              {section.content}
            </code>
          </pre>
        </div>
      )
    }

    // Parse text for headings, paragraphs, lists, and tables
    const content = section.content
    const elements = []
    let tableLines = []
    let inTable = false

    const textLines = content.split("\n")

    for (let j = 0; j < textLines.length; j++) {
      const line = textLines[j]

      // Check for table start (line with | characters)
      if (line.includes("|") && line.trim().startsWith("|")) {
        if (!inTable) {
          inTable = true
          tableLines = []
        }
        tableLines.push(line)
        continue
      } else if (inTable) {
        // End of table
        elements.push(renderTable(tableLines, `table-${i}-${j}`))
        tableLines = []
        inTable = false
      }

      // Headings
      if (line.startsWith("### ")) {
        elements.push(
          <h4 key={`${i}-${j}`} className={styles.h4}>
            {line.slice(4)}
          </h4>
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h3 key={`${i}-${j}`} className={styles.h3}>
            {line.slice(3)}
          </h3>
        )
      } else if (line.startsWith("# ")) {
        // Skip H1 as it's the title
        continue
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        // List item
        elements.push(
          <li key={`${i}-${j}`} className={styles.listItem}>
            {renderInlineFormatting(line.slice(2))}
          </li>
        )
      } else if (line.trim()) {
        // Regular paragraph
        elements.push(
          <p key={`${i}-${j}`} className={styles.paragraph}>
            {renderInlineFormatting(line)}
          </p>
        )
      }
    }

    // Handle table at end
    if (inTable && tableLines.length > 0) {
      elements.push(renderTable(tableLines, `table-${i}-end`))
    }

    return <div key={i}>{elements}</div>
  })
}

// Render inline formatting (bold, code, links)
const renderInlineFormatting = text => {
  const parts = []
  let remaining = text
  let key = 0

  while (remaining) {
    // Inline code
    const codeMatch = remaining.match(/`([^`]+)`/)
    // Bold
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    // Link
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)

    const matches = [
      codeMatch
        ? { type: "code", match: codeMatch, index: codeMatch.index }
        : null,
      boldMatch
        ? { type: "bold", match: boldMatch, index: boldMatch.index }
        : null,
      linkMatch
        ? { type: "link", match: linkMatch, index: linkMatch.index }
        : null,
    ]
      .filter(Boolean)
      .sort((a, b) => a.index - b.index)

    if (matches.length === 0) {
      parts.push(remaining)
      break
    }

    const first = matches[0]

    // Add text before match
    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index))
    }

    // Add formatted element
    if (first.type === "code") {
      parts.push(
        <code key={key++} className={styles.inlineCode}>
          {first.match[1]}
        </code>
      )
    } else if (first.type === "bold") {
      parts.push(<strong key={key++}>{first.match[1]}</strong>)
    } else if (first.type === "link") {
      parts.push(
        <a key={key++} href={first.match[2]} className={styles.link}>
          {first.match[1]}
        </a>
      )
    }

    remaining = remaining.slice(first.index + first.match[0].length)
  }

  return parts
}

// Render markdown table
const renderTable = (lines, key) => {
  if (lines.length < 2) return null

  const parseRow = line =>
    line
      .split("|")
      .map(cell => cell.trim())
      .filter(Boolean)

  const headers = parseRow(lines[0])
  // Skip separator row (lines[1])
  const rows = lines.slice(2).map(parseRow)

  return (
    <div key={key} className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{renderInlineFormatting(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{renderInlineFormatting(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const StdlibModuleTemplate = ({ pageContext }) => {
  const { module, prevModule, nextModule, allModules } = pageContext

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>
                <Link to="/stdlib/">Standard Library</Link> / {module.name}
              </p>
              <h1 className={styles.title}>{module.name}</h1>
              <div className={styles.badges}>
                {module.hasSpecs && (
                  <span className={styles.badge}>
                    {module.specCount}{" "}
                    {module.specCount === 1 ? "spec" : "specs"}
                  </span>
                )}
                <span className={styles.badge}>
                  {module.submodules.length}{" "}
                  {module.submodules.length === 1 ? "class" : "classes"}
                </span>
              </div>
              <p className={styles.lede}>{module.description}</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            {renderMarkdown(module.markdown)}
          </div>
        </section>

        {module.submodules.length > 0 && (
          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Classes</h2>
              <div className={styles.submodulesList}>
                {module.submodules.map(sub => (
                  <a
                    key={sub.name}
                    href={`${module.githubUrl}/${sub.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.submodule}
                  >
                    <h3 className={styles.submoduleName}>{sub.name}</h3>
                    <p className={styles.submoduleFile}>
                      <code>{sub.file}</code>
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Quick Start</h2>

            <div className={styles.commandSection}>
              <h3 className={styles.commandTitle}>Load the module:</h3>
              <div className={styles.codeBlock}>
                <pre className={styles.pre}>
                  <code>{`local ${module.slug} = require("tactus.${module.slug}")`}</code>
                </pre>
              </div>
            </div>

            {module.hasSpecs && (
              <div className={styles.commandSection}>
                <h3 className={styles.commandTitle}>Run the specs:</h3>
                <CommandBlock
                  command={`tactus test tactus/stdlib/tac/tactus/${module.slug}.spec.tac`}
                />
              </div>
            )}

            <p className={styles.bodyText}>
              <a
                href={module.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View source on GitHub →
              </a>
            </p>
          </div>
        </section>

        {(prevModule || nextModule) && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.navigation}>
                {prevModule ? (
                  <Link
                    to={`/stdlib/${prevModule.slug}/`}
                    className={styles.navLink}
                  >
                    <span className={styles.navLabel}>← Previous Module</span>
                    <span className={styles.navTitle}>{prevModule.name}</span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextModule && (
                  <Link
                    to={`/stdlib/${nextModule.slug}/`}
                    className={`${styles.navLink} ${styles.navLinkNext}`}
                  >
                    <span className={styles.navLabel}>Next Module →</span>
                    <span className={styles.navTitle}>{nextModule.name}</span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <BottomCta
          title="Explore more modules"
          text="The standard library includes modules for classification, extraction, generation, and more."
          buttonLabel="View All Modules"
          to="/stdlib/"
        />
      </div>
    </Layout>
  )
}

export const Head = ({ pageContext }) => (
  <Seo
    title={`${pageContext.module.name} - Standard Library`}
    description={pageContext.module.description}
  />
)

export default StdlibModuleTemplate
