import * as React from "react"
import { Link } from "gatsby"
import { Github } from "lucide-react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BookSeriesSection from "../components/book-series-section"
import VideosSpotlightSection from "../components/videos-spotlight-section"
import * as styles from "./getting-started.module.css"
import examplesData from "../data/examples.json"

function findExampleById(exampleId) {
  for (const chapter of examplesData?.chapters || []) {
    for (const ex of chapter.examples || []) {
      if (ex.id === exampleId) return ex
    }
  }
  return null
}

const GettingStartedPage = () => {
  const helloWorld = findExampleById("hello-world")

  const helloWorldCode =
    helloWorld?.code ||
    "// Example not found. Run: npm run examples:ingest\n"

  const QUICKSTART_COMMANDS = `$ pip install tactus
$ git clone https://github.com/AnthusAI/Tactus-examples.git
$ cd Tactus-examples

# Run the spec suite without API keys (fast, deterministic)
$ tactus test 01-getting-started/01-hello-world.tac --mock

# Run it for real (requires OPENAI_API_KEY)
$ export OPENAI_API_KEY=your-key
$ tactus run 01-getting-started/01-hello-world.tac`

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <h1 className={styles.title}>Get Started</h1>
              <p className={styles.subtitle}>
                The fastest way to learn Tactus is to clone the examples repo and run procedures that already have embedded specifications.
              </p>
            </div>

          <div className={styles.pathGrid}>
            {/* Path 1: IDE */}
            <div className={styles.pathCard}>
              <h2 className={styles.pathTitle}>Tactus IDE</h2>
              <p className={styles.pathText}>
                The best way to write, run, and debug agents. Includes a visual interface 
                for human-in-the-loop interactions and a live view of agent execution.
              </p>
              <Link to="/download/" className={styles.primaryButton}>
                Download IDE
              </Link>
            </div>

            {/* Path 2: CLI */}
              <div className={styles.pathCard}>
                <h2 className={styles.pathTitle}>Command Line</h2>
                <p className={styles.pathText}>
                Install the CLI, clone <code>Tactus-examples</code>, then run specs in mock mode (no API keys) before running against real models.
                </p>
                <div className={styles.codeBlock}>
                  {QUICKSTART_COMMANDS}
                </div>
              </div>
          </div>

          {/* Walkthrough */}
          <div className={styles.conceptSection}>
            <h2 className={styles.conceptTitle}>Hello, world (from Tactus-examples)</h2>
            <p className={styles.conceptIntro}>
              This is the canonical Hello World example from the <code>Tactus-examples</code> repository. It includes an embedded behavior specification so you can
              test it deterministically in mock mode.
            </p>

            <div className={styles.longCodeBlock} aria-label="Hello world example">
              {helloWorldCode}
            </div>

            <p className={styles.conceptIntro} style={{ marginTop: "var(--space-3)" }}>
              {helloWorld?.githubUrl ? (
                <>
                  Source:{" "}
                  <a href={helloWorld.githubUrl} target="_blank" rel="noreferrer">
                    {helloWorld.tacPath}
                  </a>
                  {" · "}
                  <Link to="/examples/">How to download and run examples</Link>
                </>
              ) : (
                <>
                  <Link to="/examples/">How to download and run examples</Link>
                </>
              )}
            </p>

            <div className={styles.stepsGrid}>
              <div className={styles.stepsCard}>
                <h3 className={styles.stepsTitle}>Run it with the IDE</h3>
                <ol className={styles.stepsList}>
                  <li>
                    Download the Tactus IDE for your OS from <Link to="/download/">Download</Link>.
                  </li>
                  <li>
                    Open the app — it includes example procedures ready to run.
                  </li>
                  <li>
                    Open the Hello World example, then press <b>Run</b>.
                  </li>
                </ol>
              </div>

              <div className={styles.stepsCard}>
                <h3 className={styles.stepsTitle}>Run it with the CLI</h3>
                <ol className={styles.stepsList}>
                  <li>
                    Install Tactus: <code>pip install tactus</code>
                  </li>
                  <li>
                    Clone examples: <code>git clone https://github.com/AnthusAI/Tactus-examples.git</code>
                  </li>
                  <li>
                    Run specs without API keys: <code>tactus test 01-getting-started/01-hello-world.tac --mock</code>
                  </li>
                  <li>
                    Run for real: <code>export OPENAI_API_KEY=your-key</code>, then <code>tactus run 01-getting-started/01-hello-world.tac</code>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className={styles.examplesCallout}>
            <h2 className={styles.examplesTitle}>Explore More Examples</h2>
            <p className={styles.examplesText}>
              Start with the curated examples repo. Each example is designed to be runnable and includes embedded behavior specifications, so you can verify your
              environment before you spend tokens.
            </p>
            <div className={styles.examplesButtons}>
              <Link to="/examples/" className={styles.primaryButton}>
                Browse Examples
              </Link>
              <a
                href="https://github.com/AnthusAI/Tactus-examples"
                className={styles.secondaryButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
                Examples on GitHub
              </a>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className={styles.useCasesCallout}>
            <h2 className={styles.examplesTitle}>Try a use case</h2>
            <p className={styles.examplesText}>
              Use cases are a good way to get unstuck when you're learning: pick a concrete project and adapt it. Start with the text classification use case,
              then browse the rest for ideas.
            </p>

            <div className={styles.useCasesGrid}>
              <div className={styles.useCaseFeatured}>
                <p className={styles.useCaseEyebrow}>Recommended starting point</p>
                <h3 className={styles.useCaseTitle}>Text classification</h3>
                <p className={styles.useCaseBody}>
                  Route real-world text into a small set of labels (e.g., inbox triage) using built-in guardrails like strict label validation and retry loops.
                </p>
                <div className={styles.useCaseActions}>
                  <Link to="/use-cases/text-classification/" className={styles.primaryButton}>
                    Open text classification
                  </Link>
                  <Link to="/use-cases/" className={styles.secondaryButton}>
                    Browse all use cases
                  </Link>
                </div>
              </div>

              <div className={styles.useCaseSecondary}>
                <h3 className={styles.useCaseSecondaryTitle}>More ideas</h3>
                <p className={styles.useCaseSecondaryBody}>
                  These are early sketches — useful for inspiration, but not as polished as the text classification walkthrough.
                </p>
                <ul className={styles.useCaseLinks}>
                  <li>
                    <Link to="/use-cases/meeting-recap-approval/">Meeting recap approval</Link>
                  </li>
                  <li>
                    <Link to="/use-cases/contact-import/">Contact import</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className={styles.resourcesIntroSection}>
        <div className={styles.container}>
          <h2 className={styles.conceptTitle}>More learning resources</h2>
          <p className={styles.conceptIntro}>
            If you want to go deeper, the books and videos cover the ideas, patterns, and design philosophy behind Tactus.
          </p>
        </div>
      </section>

      <BookSeriesSection id="books" mutedBackground={true} />

      <div style={{ height: 'var(--space-6)', backgroundColor: 'var(--color-bg)' }} />

      <VideosSpotlightSection id="videos" title="Videos" mutedBackground={true} />
    </div>
  </Layout>
)
}

export const Head = () => <Seo title="Getting Started" pathname="/getting-started/" />

export default GettingStartedPage
