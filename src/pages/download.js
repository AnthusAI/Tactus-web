import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Breakout from "../components/publishing/Breakout"
import * as styles from "./download.module.css"

const Icons = {
  Apple: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-2.96-.9-3.86-.9s-2.53.93-3.86.9c-2.08-.03-3.7-2.17-4.75-3.68-2.12-3.03-1.85-7.58 1.05-8.74 1.42-.57 2.82-.13 3.78-.13.93 0 2.68-1.12 4.5-.95 1.15.11 2.18.57 2.97 1.43-2.57 1.57-2.15 5.8 1.22 7.6M13 3.5c.87-1.13 1.47-2.65 1.3-4.03-1.27.08-2.82.88-3.72 1.93-.8 1-1.52 2.62-1.32 4.02 1.42.1 2.87-.78 3.74-1.92" />
    </svg>
  ),
  Windows: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
      <path d="M0 3.449L9.75 2.1v9.451H0zm10.949-1.323L24 0v11.523h-13.051zm-10.949 9.958H9.75v9.451L0 20.551zm10.949 0H24v11.523L10.949 21.9z" />
    </svg>
  ),
  Linux: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
      <path d="M20 19V7H4v12h16m0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16m-7 14v-2h5v2h-5m-3.42-4L5.57 9H8.4l3.3 3.29l-3.3 3.29H5.57l4.01-3.29Z" />
    </svg>
  ),
}

const DownloadPage = () => {
  const [release, setRelease] = React.useState(null)

  React.useEffect(() => {
    fetch("https://api.github.com/repos/AnthusAI/Tactus/releases/latest")
      .then(res => res.json())
      .then(data => setRelease(data))
      .catch(err => console.error("Failed to fetch release", err))
  }, [])

  const getAssetUrl = keyword => {
    if (!release || !release.assets) return null
    return release.assets.find(a =>
      a.name.toLowerCase().endsWith(keyword.toLowerCase())
    )?.browser_download_url
  }

  const macUrl = getAssetUrl(".dmg")
  const winUrl = getAssetUrl(".exe")
  const linuxUrl = getAssetUrl(".appimage")
  const fallbackUrl = "https://github.com/AnthusAI/Tactus/releases/latest"
  const versionLabel = release?.tag_name || release?.name

  return (
    <Layout>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <h1 className={styles.title}>Download Tactus</h1>
              <p className={styles.subtitle}>
                The desktop environment for building, running, and debugging
                Tactus agents.
              </p>
              {versionLabel ? (
                <div
                  className={styles.latestVersion}
                  aria-label="Latest version"
                >
                  <span className={styles.latestVersionLabel}>
                    Latest version
                  </span>
                  <span className={styles.latestVersionNumber}>
                    {versionLabel}
                  </span>
                </div>
              ) : null}

              <div style={{ marginTop: "var(--space-5)", textAlign: "left" }}>
                <Breakout
                  title="Warning: Alpha Version"
                  theme="primary"
                  bleed={true}
                >
                  <p>
                    The version number starts with 0., which means this is an
                    alpha release. The feature set is not complete and is
                    changing rapidly. I am moving fast and breaking things,
                    making breaking changes literally every day.
                  </p>
                  <p>
                    If you're willing to sign up for an adventure, you have a
                    chance to get early, high-level support and shape the future
                    of the language, but I can't make any guarantees about
                    stability, especially over the next couple of months.
                  </p>
                  <p>
                    Tactus is already a mission-critical technology in
                    production for my own projects, but it is not publicly
                    supported yet—use it at your own risk.
                  </p>
                </Breakout>
                <div
                  style={{
                    marginTop: "var(--space-4)",
                    maxWidth: "var(--size-content)",
                    margin: "var(--space-4) auto 0",
                    textAlign: "left",
                  }}
                >
                  <p>
                    <strong>Note on Desktop Apps:</strong> Please note that the
                    Electron apps are less tested than running the web
                    application through Node. They share a common codebase, but
                    have platform differences. My development focus is primarily
                    on the Node web application.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.grid}>
              {/* macOS */}
              <div className={styles.card}>
                <Icons.Apple />
                <h2 className={styles.cardTitle}>macOS</h2>
                <p className={styles.cardMeta}>
                  Universal (Intel & Apple Silicon)
                </p>
                <div className={styles.macWarning}>
                  <strong>Distribution Warning</strong>
                  The distributed macOS app does not yet distribute smoothly. (I
                  have to pay Apple to sign it and I will...) You are better off
                  building the Electron app yourself or using the Node web
                  application.
                </div>
                <a
                  href={macUrl || fallbackUrl}
                  className={styles.downloadButton}
                >
                  {macUrl ? "Download for Mac" : "View on GitHub"}
                </a>
              </div>

              {/* Windows */}
              <div className={styles.card}>
                <Icons.Windows />
                <h2 className={styles.cardTitle}>Windows</h2>
                <p className={styles.cardMeta}>Windows 10/11 (x64)</p>
                <a
                  href={winUrl || fallbackUrl}
                  className={styles.downloadButton}
                >
                  {winUrl ? "Download for Windows" : "View on GitHub"}
                </a>
              </div>

              {/* Linux */}
              <div className={styles.card}>
                <Icons.Linux />
                <h2 className={styles.cardTitle}>Linux</h2>
                <p className={styles.cardMeta}>Debian/Ubuntu (AppImage)</p>
                <a
                  href={linuxUrl || fallbackUrl}
                  className={styles.downloadButton}
                >
                  {linuxUrl ? "Download for Linux" : "View on GitHub"}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.secondarySection}>
          <div className={styles.container}>
            <div className={styles.hero} style={{ paddingTop: 0 }}>
              <h2 className={styles.title} style={{ fontSize: "2rem" }}>
                Install Tactus for Nerds
              </h2>
              <p className={styles.subtitle}>
                You don’t need the Electron app. You can run agents via the CLI
                or run the web IDE locally.
              </p>
            </div>

            <div className={styles.nerdGrid}>
              {/* Option 1: CLI */}
              <div className={styles.nerdCard}>
                <h3 className={styles.nerdTitle}>Option 1: Tactus CLI</h3>
                <p className={styles.nerdText}>
                  Install the Python package to run agents from your terminal.
                  This is the core runtime. Docker is required for the default
                  sandboxed execution mode.
                </p>
                <div className={styles.codeBlock}>
                  $ pip install tactus{"\n"}$ git clone
                  https://github.com/AnthusAI/Tactus-examples.git{"\n"}$ cd
                  Tactus-examples{"\n"}
                  {"\n"}# Run specs (fast, mock mode){"\n"}$ tactus test
                  01-getting-started/01-hello-world.tac --mock{"\n"}
                  {"\n"}# Run live{"\n"}$ export OPENAI_API_KEY=your-key{"\n"}$
                  tactus run 01-getting-started/01-hello-world.tac{"\n"}
                  {"\n"}# No Docker? Opt out explicitly (no isolation){"\n"}$
                  tactus run 01-getting-started/01-hello-world.tac --no-sandbox
                </div>
              </div>

              {/* Option 2: Web IDE Source */}
              <div className={styles.nerdCard}>
                <h3 className={styles.nerdTitle}>Option 2: Web IDE Source</h3>
                <p className={styles.nerdText}>
                  Prefer the visual IDE but hate Electron? Run the Node.js web
                  application directly from source.
                </p>
                <div className={styles.codeBlock}>
                  $ git clone https://github.com/AnthusAI/Tactus.git{"\n"}$ cd
                  Tactus{"\n"}$ npm install{"\n"}$ npm start{"\n"}
                  {"\n"}# Open http://localhost:3000
                </div>
                <div style={{ marginTop: "var(--space-3)" }}>
                  <a
                    href="https://github.com/AnthusAI/Tactus"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 700 }}
                  >
                    View Repository →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={styles.container}>
            <div className={styles.nextSteps}>
              <h2 className={styles.nextStepsTitle}>Next Steps</h2>
              <div className={styles.nextStepsGrid}>
                <Link to="/getting-started/" className={styles.nextStepCard}>
                  <h3 className={styles.nextStepTitle}>Get Started</h3>
                  <p className={styles.nextStepText}>
                    Install dependencies and run your first agent.
                  </p>
                </Link>
                <Link to="/examples/" className={styles.nextStepCard}>
                  <h3 className={styles.nextStepTitle}>Examples Library</h3>
                  <p className={styles.nextStepText}>
                    Browse runnable code examples for common patterns.
                  </p>
                </Link>
                <Link to="/use-cases/" className={styles.nextStepCard}>
                  <h3 className={styles.nextStepTitle}>Use Cases</h3>
                  <p className={styles.nextStepText}>
                    See full walkthroughs of production workflows.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Download Tactus" />

export default DownloadPage
