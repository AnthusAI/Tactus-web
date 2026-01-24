import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./stdlib.module.css"

// Import will be available after stdlib:ingest runs
let stdlibData = { modules: [] }
try {
  stdlibData = require("../data/stdlib.json")
} catch (e) {
  console.warn("stdlib.json not found - run npm run stdlib:ingest")
}

const StdlibPage = () => {
  const { modules } = stdlibData

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Standard Library</p>
              <h1 className={styles.title}>Built-in Modules for Common Tasks</h1>
              <p className={styles.lede}>
                Tactus includes a standard library of reusable modules for classification, extraction,
                generation, and more. Each module is written in Tactus itself with comprehensive BDD specifications.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Available Modules</h2>
            <p className={styles.bodyText}>
              The standard library provides high-quality, tested implementations for common AI workflow tasks.
              Each module follows the same patterns and can be extended for custom use cases.
            </p>

            <div className={styles.cardGrid}>
              {modules.map((module) => (
                <Link key={module.id} to={`/stdlib/${module.slug}/`} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <p className={styles.cardTitle}>{module.name}</p>
                    <div className={styles.badges}>
                      {module.hasSpecs && (
                        <span className={styles.badge}>
                          {module.specCount} {module.specCount === 1 ? 'spec' : 'specs'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardText}>{module.description}</p>
                    <p className={styles.cardMeta}>
                      {module.submodules.length} {module.submodules.length === 1 ? 'class' : 'classes'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Design Philosophy</h2>

            <div className={styles.principlesList}>
              <div className={styles.principle}>
                <h3 className={styles.principleTitle}>Written in Tactus</h3>
                <p className={styles.principleText}>
                  The stdlib is dogfooding - it's written in Tactus itself. This ensures the language
                  is expressive enough for real-world use and surfaces any pain points.
                </p>
              </div>

              <div className={styles.principle}>
                <h3 className={styles.principleTitle}>BDD Specifications</h3>
                <p className={styles.principleText}>
                  Every module has comprehensive Gherkin specifications that serve as tests,
                  documentation, and contract. If the specs pass, the module works correctly.
                </p>
              </div>

              <div className={styles.principle}>
                <h3 className={styles.principleTitle}>Extensible Classes</h3>
                <p className={styles.principleText}>
                  All modules use a class hierarchy. Extend BaseClassifier, BaseExtractor, or
                  BaseGenerator to create your own implementations with the same interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        <BottomCta
          title="Want to contribute?"
          text="The standard library is open source. Improve existing modules or add new ones."
          buttonLabel="View on GitHub"
          to="https://github.com/AnthusAI/Tactus/tree/main/tactus/stdlib"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Standard Library"
    description="Built-in Tactus modules for classification, extraction, generation, and more."
  />
)

export default StdlibPage
