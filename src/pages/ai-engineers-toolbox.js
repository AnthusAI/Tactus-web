import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import AnimatedAIEngineersToolboxDiagram from "../components/diagrams/AnimatedAIEngineersToolboxDiagram"
import Breakout from "../components/publishing/Breakout"
import * as styles from "./ai-engineers-toolbox.module.css"

const usePreferredTheme = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

const AIToolboxPage = () => {
  const theme = usePreferredTheme()

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Learn</p>
              <h1 className={styles.title}>The AI Engineer’s Toolbox</h1>
              <p className={styles.lede}>
                Agents are not useful because they talk. They’re useful because they <em>do work</em>.
                Tools are where AI meets the real world — files, APIs, databases, deployments — and where “toy demo” becomes a real
                system.
              </p>
            </div>

            <nav className={styles.toc} aria-label="Table of contents">
              <h2 className={styles.tocTitle}>Contents</h2>
              <ol className={styles.tocList}>
                <li>
                  <a href="#tools-are-capabilities">Tools are capabilities, not callbacks</a>
                </li>
                <li>
                  <a href="#schemas">Schema-first interfaces (typed I/O)</a>
                </li>
                <li>
                  <a href="#inspectable">Inspectable tool use (what happened?)</a>
                </li>
                <li>
                  <a href="#determinism">Deterministic orchestration (agent proposes, code decides)</a>
                </li>
                <li>
                  <a href="#least-privilege">Least privilege and staged tool access</a>
                </li>
                <li>
                  <a href="#reliability">Reliability: specs, checkpoints, and safe retries</a>
                </li>
              </ol>
            </nav>

            <section id="tools-are-capabilities" style={{ marginTop: "var(--space-6)" }}>
              <Breakout title="Tools are how agents touch reality">
                <p>
                  In many frameworks, tools are “just functions you register.” That’s fine in a prototype, but in production it
                  becomes a trap: arbitrary callbacks and side effects are hard to reason about, hard to test, and hard to secure.
                </p>
                <p>
                  <strong>
                    In Tactus, tools are explicit capabilities: schema-first, inspectable, and controllable.
                  </strong>
                </p>
                <ul>
                  <li>
                    <strong>Schema-first</strong> inputs so the model can’t hand-wave arguments
                  </li>
                  <li>
                    <strong>Deterministic implementations</strong> so “doing work” is reliable and testable
                  </li>
                  <li>
                    <strong>Control surfaces</strong> so you decide which tools exist and when they’re available
                  </li>
                </ul>
              </Breakout>

              <div className={styles.diagramWrap}>
                <AnimatedAIEngineersToolboxDiagram theme={theme} className={styles.diagram} />
              </div>

              <p className={styles.bodyText}>
                This is the core pattern: agents propose; deterministic code enforces; tools do work. It’s the difference between “ask
                the model nicely” and “build a system you can deploy.”
              </p>
            </section>

            <section id="schemas" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Schema-first interfaces (typed I/O)</h2>
              <p className={styles.bodyText}>
                A tool’s schema is not documentation — it’s a boundary. It’s where you define what the model is allowed to ask for,
                what your system will accept, and what “valid” means.
              </p>
              <div className={styles.subtleCard}>
                <p className={styles.bodyText} style={{ marginTop: 0 }}>
                  In the Tactus DSL, tools have explicit input fields (with types, defaults, and descriptions). Procedures also declare
                  typed inputs and outputs. That structure makes it easier to:
                </p>
                <p className={styles.bodyText} style={{ marginBottom: 0 }}>
                  • validate inputs before execution
                  <br />• validate outputs after execution
                  <br />• generate safer UI/CLI forms
                  <br />• reduce “stringly typed” glue code
                </p>
              </div>
              <p className={styles.bodyText}>
                When you treat schemas as executable boundaries, you get more than type safety: you get a place to enforce policy,
                prevent misuse, and make workflows legible to humans.
              </p>
            </section>

            <section id="inspectable" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Inspectable tool use (what happened?)</h2>
              <p className={styles.bodyText}>
                Production systems fail in boring ways. The hard part is diagnosis: what did the agent do, and why? Tactus treats tool
                calls as first-class events you can inspect (e.g., whether a tool was called, the last arguments, and the last result).
              </p>
              <p className={styles.bodyText}>
                This matters for debugging, yes — but it’s also a reliability and safety tool. If you can’t tell whether a “send” step
                happened, retries become terrifying. If you can inspect tool calls, you can build idempotency guards and safe
                re-entrancy.
              </p>
            </section>

            <section id="determinism" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Deterministic orchestration</h2>
              <p className={styles.bodyText}>
                The biggest mindset shift for tool-using systems is separating what the model is good at from what software is good at.
              </p>
              <div className={styles.subtleCard}>
                <p className={styles.bodyText} style={{ marginTop: 0 }}>
                  Use the agent for synthesis: drafting, planning, classification, and turning messy inputs into structured proposals.
                </p>
                <p className={styles.bodyText} style={{ marginBottom: 0 }}>
                  Use deterministic code for control: validation, policy, staging, retries, and irreversible actions.
                </p>
              </div>
              <p className={styles.bodyText}>
                Tactus supports directly invoking tools from procedure code as well — which gives you deterministic control over when a
                tool runs, without involving the model at all. That makes “do the work” composable and testable.
              </p>
            </section>

            <section id="least-privilege" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Least privilege and staged tool access</h2>
              <p className={styles.bodyText}>
                The safest tool is the one the agent doesn’t have. Instead of granting everything up front, treat tool access as a
                stage-gated capability: drafting stage, review stage, then commit stage.
              </p>
              <p className={styles.bodyText}>
                This is how you build bounded autonomy: the workflow can run on its own for long stretches, and it can still be safe
                when it reaches a step that needs credentials or could cause real side effects.
              </p>
            </section>

            <section id="reliability" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Reliability: specs, checkpoints, and safe retries</h2>
              <p className={styles.bodyText}>
                Tooling is the interface to reality — and reality is messy. The path to semi-unattended operation is not “better
                prompting.” It’s guardrails: durable checkpoints, human-in-the-loop gates, and behavioral specs you can test.
              </p>
              <p className={styles.bodyTextMuted}>
                This page is intentionally marketing-forward. If you want the precise DSL semantics and tool patterns, the canonical
                reference is the Tactus specification and the tools chapters in Learning Tactus.
              </p>
            </section>
          </div>
        </section>

        <BottomCta
          title="Ready to Start Building?"
          description="Get started with Tactus in minutes."
          buttonText="Get Started"
          buttonTo="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="The AI Engineer’s Toolbox" />

export default AIToolboxPage
