import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import EvaluationsDiagram from "../components/diagrams/EvaluationsDiagram"
import AnimatedVisualEvaluationsDiagram from "../components/diagrams/AnimatedVisualEvaluationsDiagram"
import * as styles from "./evaluations.module.css"

const RUN_ONCE_COMMANDS = `tactus eval path/to/procedure.tac`

const MEASURE_CONSISTENCY_COMMANDS = `tactus eval path/to/procedure.tac --runs 10
tactus eval path/to/procedure.tac --runs 10 --no-parallel`

const COMPARE_WITH_SPECS_COMMANDS = `tactus test path/to/procedure.tac
tactus test path/to/procedure.tac --runs 10`

const EvaluationsPage = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Evaluations</p>
              <h1 className={styles.title}>Stop Shipping Lucky Demos</h1>
              <p className={styles.lede}>
                A behavior spec tells you whether one run is right. An evaluation tells you how often it is right across real inputs - so you can compare
                changes, catch drift, and ship with a reliability number instead of a vibe.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>From “It Works” to “It Works 98% of the Time”</h2>
            <p className={styles.bodyText}>
              Two engineers build an agentic procedure to flag compliance risks in emails. Both can give a great demo. Both can show you a run where it “works.”
            </p>
            <div style={{ margin: '2rem 0' }}>
               <AnimatedVisualEvaluationsDiagram theme={theme} />
            </div>
            <p className={styles.bodyText}>
              Then you run an evaluation: 100 realistic emails, scored the same way every time. One implementation is right 48% of the time. The other is right
              98% of the time. Those are not “both fine.” They are different systems.
            </p>
            <p className={styles.bodyTextMuted}>
              Specs let you decide what “right” means. Evaluations take that definition and turn it into a statistic: success rate, latency, tokens, and “did it
              break in the messy cases?”
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Specs vs evaluations</p>
              <ul className={styles.checkList}>
                <li><strong>Behavior specs</strong> answer “is it right?” for one run</li>
                <li><strong>Evaluations</strong> answer “how often is it right?” over a dataset</li>
                <li>Specs protect invariants and prevent “vanishing features”</li>
                <li>Evals reveal brittleness, drift, and reliability deltas</li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              Think of evals as a gauge, not a gate: specs are pass/fail guardrails; evals tell you whether your change made the system better or worse. Pair
              evals with <Link to="/validation/">validation</Link> to fail fast at the boundary, and with <Link to="/specifications/">behavior specifications</Link>{" "}
              to lock in what must not change. See <Link to="/guardrails/">Guardrails</Link>.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>First-Class Evaluations (Inline, Like Specs)</h2>
            <p className={styles.bodyText}>
              Tactus treats evaluation as part of the procedure file, not a separate test project. You declare an evaluation dataset and evaluators inline, next to
              the code they measure.
            </p>
            <p className={styles.bodyTextMuted}>
              If you want the background on why Tactus is opinionated about this, start with{" "}
              <Link to="/specifications/">behavior specifications</Link>. Evals build on the same idea: define “right,” then measure it across realistic inputs.
            </p>
            
            <div className={styles.diagramWrap}>
              <EvaluationsDiagram theme={theme} className={styles.diagram} />
            </div>

            <p className={styles.bodyText}>
              Run this against 50 or 500 cases. Tactus handles parallel execution, error catching, and aggregating results into a report you can track over time.
            </p>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>What to measure</p>
              <ul className={styles.checkList}>
                <li><strong>Accuracy:</strong> did it meet the spec for this case?</li>
                <li><strong>Reliability:</strong> does it keep meeting it across runs?</li>
                <li><strong>Semantic Quality:</strong> uses LLM-as-a-judge (via DSPy) to grade tone, helpfulness, and safety.</li>
                <li><strong>Cost + tokens:</strong> what does “good” cost at scale?</li>
                <li><strong>Tool usage:</strong> did it call the right tools (or the forbidden ones)?</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Run Evals (and Compare to Specs)</h2>
            <p className={styles.bodyText}>
              Run once to see detailed results, then run multiple times to measure consistency. Keep specs in the loop too: specs are great at catching hard
              invariant violations; evals are great at quantifying quality and reliability.
            </p>

            <div className={styles.commandGrid}>
              <div className={styles.commandCard}>
                <p className={styles.kicker}>Run once</p>
                <pre className={styles.codeBlock}><code>{RUN_ONCE_COMMANDS}</code></pre>
              </div>
              <div className={styles.commandCard}>
                <p className={styles.kicker}>Measure consistency</p>
                <pre className={styles.codeBlock}><code>{MEASURE_CONSISTENCY_COMMANDS}</code></pre>
              </div>
              <div className={styles.commandCard}>
                <p className={styles.kicker}>Repeat specs</p>
                <pre className={styles.codeBlock}><code>{COMPARE_WITH_SPECS_COMMANDS}</code></pre>
              </div>
            </div>

            <p className={styles.bodyTextMuted}>
              Treat evals as a scoreboard and a gate: if success rate drops after a change, you have an objective regression report instead of a debate (or a
              production incident).
            </p>
          </div>
        </section>

        <BottomCta
          title="Start measuring"
          text="Don’t guess. Know. Learn how to set up your first evaluation suite."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Evaluations"
    description="Measure agent reliability, cost, and accuracy with built-in evaluation primitives."
  />
)

export default EvaluationsPage
