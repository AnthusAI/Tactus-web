import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./use-cases.module.css"

const USE_CASES = [
  {
    title: "A copilot for anything",
    lede: "Embed agents in your app: chat UX, tools, and human checkpoints via standard HITL components.",
    to: "/use-cases/copilot-anything/",
  },
  {
    title: "Text classification",
    lede: "Classify text reliably with guardrails: validation, specs, and evals.",
    to: "/use-cases/text-classification/",
  },
]

const UseCasesPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Examples</p>
              <h1 className={styles.title}>Use Cases</h1>
              <p className={styles.lede}>
                Practical walkthroughs that show what to build, which guardrails matter, and how to keep behavior and reliability measurable as you iterate.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Start Here</h2>
            <p className={styles.bodyText}>
              New to Tactus? Start with{" "}
              <Link to="/guiding-principles/">Guiding Principles</Link>, then use cases help you apply the patterns to concrete workflows.
            </p>

            <div className={styles.cardGrid}>
              {USE_CASES.map((item) => (
                <Link key={item.to} to={item.to} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <p className={styles.cardTitle}>{item.title}</p>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardText}>{item.lede}</p>
                    <p className={styles.cardCta}>Read</p>
                  </div>
                </Link>
              ))}
            </div>

            <p className={styles.bodyTextMuted}>
              Some pages are early sketches. If you want a strong first project, start with{" "}
              <Link to="/use-cases/copilot-anything/">A copilot for anything</Link>.
            </p>
          </div>
        </section>

        <BottomCta
          title="Want runnable examples too?"
          text="Browse the examples overview and track the curated repo as it evolves."
          buttonLabel="Examples Overview"
          to="/examples/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Use Cases"
    description="Use case examples for learning Tactus patterns: validation, specifications, evaluations, and guardrails."
  />
)

export default UseCasesPage
