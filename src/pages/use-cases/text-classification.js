import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import * as styles from "./use-case.module.css"

const TextClassificationUseCasePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Use Case</p>
              <h1 className={styles.title}>Text Classification</h1>
              <p className={styles.lede}>
                A simple, high-signal workflow: take input text and classify it into a small set of labels, with guardrails that keep the output structured and
                measurable.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You’re Building</h2>
            <p className={styles.bodyText}>
              Given a piece of text (an email, a ticket, a note), return a label like <code>spam</code>, <code>support</code>, or <code>billing</code> - and do it
              reliably.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Guardrails to use</p>
              <ul className={styles.checkList}>
                <li><Link to="/validation/">Validation</Link>: output must always contain a valid label</li>
                <li><Link to="/specifications/">Behavior specs</Link>: hard rules (no forbidden tools, required fields exist)</li>
                <li><Link to="/evaluations/">Evaluations</Link>: measure accuracy and stability across a dataset</li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This page is a starter stub. Next we’ll add a runnable procedure, specs, and an evaluation dataset.
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
    title="Text Classification"
    description="Use case: text classification with validation, behavior specifications, and evaluations."
  />
)

export default TextClassificationUseCasePage

