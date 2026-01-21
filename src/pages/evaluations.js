import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import EvaluationsDiagram from "../components/diagrams/EvaluationsDiagram"
import * as styles from "./evaluations.module.css"

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
              <h1 className={styles.title}>Measure Accuracy, Cost, and Reliability</h1>
              <p className={styles.lede}>
                One successful run is luck. Reliability is a statistic. Evaluations let you measure performance across datasets so you can ship with confidence.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>From "It Works" to "It Works 95% of the Time"</h2>
            <p className={styles.bodyText}>
              In traditional software, if a test passes once, it passes forever. In AI, a prompt change might improve accuracy on one topic but regress it on another.
            </p>
            <p className={styles.bodyTextMuted}>
              You cannot manage what you cannot measure. Evaluations (evals) are the practice of running your agent against a dataset of inputs and scoring the results.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>First-Class Evaluations</h2>
            <p className={styles.bodyText}>
              Tactus treats evaluation as a core part of the development loop, not an external script. You define experiments, datasets, and scorers directly.
            </p>
            
            <div className={styles.diagramWrap}>
              <EvaluationsDiagram theme={theme} className={styles.diagram} />
            </div>

            <p className={styles.bodyText}>
              Run this against a dataset of 50 or 500 examples. The runtime handles the parallel execution, error catching, and metric aggregation.
            </p>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>What to measure</p>
              <ul className={styles.checkList}>
                <li><strong>Accuracy:</strong> Did the agent arrive at the correct answer?</li>
                <li><strong>Cost:</strong> How many tokens did it consume?</li>
                <li><strong>Latency:</strong> Is it fast enough for the user?</li>
                <li><strong>Tool Usage:</strong> Did it use the expected tools?</li>
              </ul>
            </div>
          </div>
        </section>

        <BottomCta
          title="Start measuring"
          text="Don't guess. Know. Learn how to set up your first evaluation suite."
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
