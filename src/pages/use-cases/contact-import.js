import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import * as styles from "./use-case.module.css"
import DeepIntegrationDiagram from "../../components/diagrams/DeepIntegrationDiagram"

const ContactImportUseCasePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Use Case</p>
              <h1 className={styles.title}>Contact Import</h1>
              <p className={styles.lede}>
                Turn messy input formats into structured records by defining the
                capability (schema) and letting an agent do the mapping inside
                strict tool boundaries.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>The Pattern</h2>
            <p className={styles.bodyText}>
              Instead of writing endless conditional logic for every input
              variation, you define a tool like <code>create_contact</code> with
              a strict schema, then give the agent the messy row and a clear
              instruction.
            </p>

            <h3 className={styles.subsectionTitle}>
              Architecture: Deep Integration
            </h3>
            <div className={styles.diagramBlock}>
              <DeepIntegrationDiagram />
            </div>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>What makes this “deep integration”</p>
              <ul className={styles.checkList}>
                <li>
                  It feels like a normal product feature: a button, a form, a
                  menu item—not “go talk to a bot.”
                </li>
                <li>
                  The procedure can call tools to change real state (create a
                  record, attach a note, push to your CRM).
                </li>
                <li>
                  When it hits a risky step, it can pause and request human
                  approval asynchronously—without blocking the rest of the
                  system.
                </li>
              </ul>
            </div>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Guardrails to use</p>
              <ul className={styles.checkList}>
                <li>
                  <Link to="/validation/">Validation</Link>: the tool schema is
                  the contract
                </li>
                <li>
                  <Link to="/guardrails/">Guardrails</Link>: least privilege +
                  allowlists at the tool boundary
                </li>
                <li>
                  <Link to="/evaluations/">Evaluations</Link>: measure success
                  rate across varied input formats
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This page is a starter stub. Next we’ll add a runnable procedure,
              a small dataset of varied contact formats, and a simple review
              flow so you can evaluate reliability end-to-end.
            </p>
          </div>
        </section>

        <BottomCta
          title="Browse more use cases"
          text="Pick another workflow pattern to learn."
          buttonLabel="Use Cases"
          to="/use-cases/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Contact Import"
    description="Use case: import contacts by combining schema-first tools with agent mapping and evaluation guardrails."
  />
)

export default ContactImportUseCasePage
