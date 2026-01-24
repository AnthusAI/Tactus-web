import * as React from "react"
import { Link } from "gatsby"
import { Github } from "lucide-react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BookSeriesSection from "../components/book-series-section"
import VideosSpotlightSection from "../components/videos-spotlight-section"
import * as styles from "./getting-started.module.css"
import examplesData from "../data/examples.json"
import { ApprovalPanel, ThemeProvider } from "@anthus/tactus-hitl-components"
import "@anthus/tactus-hitl-components/styles.css"

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

  const baseRequest = {
    request_id: "req_getting_started_01",
    procedure_id: "getting-started",
    procedure_name: "Getting Started",
    invocation_id: "inv_getting_started_01",
    subject: "Getting Started",
    elapsed_seconds: 0,
    input_summary: { surface: "IDE" },
  }

  return (
    <Layout fullWidth={true}>
      <ThemeProvider defaultTheme="light">
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

          <div className={styles.projectsCallout}>
            <div className={styles.projectsHeader}>
              <h2 className={styles.examplesTitle}>Try a project</h2>
              <p className={styles.examplesText}>
                Use cases are concrete project ideas. If you want a strong first build, start with an embedded copilot and add one or two Human-in-the-Loop
                checkpoints.
              </p>
            </div>

            <div className={styles.projectsGrid}>
              <div className={styles.projectsCopy}>
                <p className={styles.projectsBody}>
                  The <Link to="/download/">Tactus IDE</Link> includes the standard Human-in-the-Loop components. Use the IDE as a safe playground to experience
                  approvals and structured inputs, then embed the same components in any application.
                </p>
                <div className={styles.projectsLinks}>
                  <Link to="/use-cases/copilot-anything/" className={styles.primaryButton}>
                    Read the copilot use case
                  </Link>
                  <Link to="/getting-started/projects/" className={styles.secondaryButton}>
                    Projects to try
                  </Link>
                </div>
                <p className={styles.projectsFootnote}>
                  Component reference: <Link to="/resources/components/">Standard Component Library</Link>
                </p>
              </div>

              <div className={styles.projectsDemo} aria-label="Human-in-the-loop demo">
                <div className={styles.demoLabel}>HITL preview</div>
                <ApprovalPanel
                  request={{
                    ...baseRequest,
                    request_type: "approval",
                    message: "Approve sending this message? (Tool: send_message)",
                    options: [
                      { label: "Send", value: true, style: "primary" },
                      { label: "Cancel", value: false, style: "secondary" },
                    ],
                    metadata: {
                      artifact_type: "chat_message",
                      artifact:
                        "I can draft the reply and prepare the tool call. You approve before I send anything.",
                    },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
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
      </ThemeProvider>
    </Layout>
)
}

export const Head = () => <Seo title="Getting Started" pathname="/getting-started/" />

export default GettingStartedPage
