import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import * as styles from "./use-case.module.css"

const MeetingRecapApprovalUseCasePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Use Case</p>
              <h1 className={styles.title}>Meeting Recap with Approval</h1>
              <p className={styles.lede}>
                Draft an email recap from messy notes, pause for review, then
                send - with durable human-in-the-loop gates before irreversible
                actions.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Tactus Fits</h2>
            <p className={styles.bodyText}>
              This is a classic “agent + tools + side effects” workflow. The
              hard part isn’t generating text - it’s making the system safe when
              you’re not watching every run.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Guardrails to use</p>
              <ul className={styles.checkList}>
                <li>
                  <Link to="/guardrails/">Guardrails</Link>: staged tool access
                  and “review before send”
                </li>
                <li>
                  <Link to="/specifications/">Behavior specs</Link>:{" "}
                  <code>send_email</code> must never be called without approval
                </li>
                <li>
                  <Link to="/validation/">Validation</Link>: subject/body/action
                  items must be present and shaped correctly
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This page is a starter stub. Next we’ll add a runnable procedure
              and a spec suite that prevents accidental double-sends and missing
              approvals.
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
    title="Meeting Recap with Approval"
    description="Use case: a durable meeting recap workflow with approval gates before sending."
  />
)

export default MeetingRecapApprovalUseCasePage
