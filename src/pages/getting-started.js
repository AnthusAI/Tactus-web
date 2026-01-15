import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./getting-started.module.css"

const GettingStartedPage = () => (
  <Layout>
    <div className={styles.page}>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <h1 className={styles.title}>Start Building</h1>
            <p className={styles.subtitle}>
              Choose the workflow that matches what you want to do today.
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
                For running agents on servers, in CI/CD, or as distributed Python packages.
                Tactus runs as a standard Python module.
              </p>
              <div className={styles.codeBlock}>
                python -m pip install tactus
              </div>
            </div>
          </div>

          {/* Concepts */}
          <div className={styles.conceptSection}>
            <h2 className={styles.conceptTitle}>Two Ways to Run</h2>
            <div className={styles.pathGrid}>
              <div className={styles.pathCard}>
                <h3 className={styles.pathTitle}>Standalone Utility</h3>
                <p className={styles.pathText}>
                  Tactus is great for writing script-based agents. You can run 
                  <code>.tac</code> files directly from your terminal to perform tasks, 
                  process files, or automate workflows locally.
                </p>
              </div>
              <div className={styles.pathCard}>
                <h3 className={styles.pathTitle}>Embedded Runtime</h3>
                <p className={styles.pathText}>
                  A common use case is embedding the Tactus runtime inside another 
                  application or cloud backend. This lets your app "run" agent procedures 
                  to provide intelligent features to your users.
                </p>
              </div>
            </div>
          </div>

          {/* Learn */}
          <div className={styles.conceptSection} style={{borderTop: 'none', paddingTop: 'var(--space-4)'}}>
            <h2 className={styles.conceptTitle}>Learn the Language</h2>
            <p className={styles.pathText} style={{maxWidth: '48rem'}}>
              Tactus is a programming language. To get the most out of it, you'll want to 
              understand the core patterns: tools, durability, and context.
            </p>
            <div style={{marginTop: 'var(--space-4)'}}>
              <a href="https://anthusai.github.io/Learning-Tactus/" className={styles.primaryButton} style={{background: 'var(--color-surface-2)', color: 'var(--color-text)'}}>
                Read Learning Tactus
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  </Layout>
)

export const Head = () => <Seo title="Getting Started" pathname="/getting-started/" />

export default GettingStartedPage
