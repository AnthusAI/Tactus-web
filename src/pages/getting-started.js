import * as React from "react"
import { Link } from "gatsby"
import { Github } from "lucide-react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BookSeriesSection from "../components/book-series-section"
import VideosSpotlightSection from "../components/videos-spotlight-section"
import * as styles from "./getting-started.module.css"

const GettingStartedPage = () => (
  <Layout fullWidth={true}>
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Get Started</h1>
            <p className={styles.subtitle}>
              Run your first procedure in minutes — from the CLI or the IDE.
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
                For running procedures locally, on servers, or in CI/CD. Install once, then run
                any <code>.tac</code> file.
                </p>
                <div className={styles.codeBlock}>
                  $ pip install tactus
                </div>
              </div>
          </div>

          {/* Walkthrough */}
          <div className={styles.conceptSection}>
            <h2 className={styles.conceptTitle}>Hello, world (walkthrough)</h2>
            <p className={styles.conceptIntro}>
              Use the IDE to run the built-in Hello World example, or paste this into <code>hello.tac</code> and run it from the CLI.
            </p>

            <div className={styles.longCodeBlock} aria-label="Hello world example">
              {`World = Agent {
    provider = "openai",
    model = "gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").response`}
            </div>

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
                    Set your OpenAI key: <code>export OPENAI_API_KEY=your-key</code>
                  </li>
                  <li>
                    Run: <code>tactus run hello.tac</code>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Examples Section */}
          <div className={styles.examplesCallout}>
            <h2 className={styles.examplesTitle}>Explore More Examples</h2>
            <p className={styles.examplesText}>
              The best way to learn Tactus is by running real examples. Browse our curated collection of runnable, tested examples — from basics to advanced patterns. Each example includes embedded specifications and can be executed directly from your machine.
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

export const Head = () => <Seo title="Getting Started" pathname="/getting-started/" />

export default GettingStartedPage
