import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./use-cases.module.css"

const USE_CASES = [
  {
    title: "A copilot for anything",
    lede: "Bolt a chat copilot onto an existing app: tools, approvals, and human checkpoints.",
    to: "/use-cases/copilot-anything/",
  },
  {
    title: "Refund ops automation",
    lede: "A real finance workflow: batch Stripe refunds via tools, with human checkpoints and an audit trail—starting from a Claude Skill.",
    to: "/use-cases/refund-ops/",
  },
  {
    title: "Text classification",
    lede: "Embed a runtime and classify text reliably with guardrails: validation, specs, and evals.",
    to: "/use-cases/text-classification/",
  },
  {
    title: "Contact import (embedded feature)",
    lede: "Add a button-driven agent feature: trigger a procedure, call tools, and queue human review only when needed.",
    to: "/use-cases/contact-import/",
  },
  {
    title: "Business process automation",
    lede: "Automate intake, routing, and checklists with enforceable policies and approvals.",
    to: "/use-cases/business-process-automation/",
  },
  {
    title: "Level Zero Operator Agents",
    lede: "Agent-based incident response for ITSM: investigate early, document continuously, escalate with context.",
    to: "/use-cases/level-zero-operators/",
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
                Practical walkthroughs that show what to build, which guardrails
                matter, and how to keep behavior and reliability measurable as
                you iterate.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.cardGrid}>
              {USE_CASES.map(item => (
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
