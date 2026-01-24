import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./example.module.css"

const ExampleTemplate = ({ pageContext }) => {
  const { example, chapter, prevExample, nextExample } = pageContext

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>
                <Link to="/examples/">Examples</Link> / <Link to={`/examples/${chapter.slug}/`}>{chapter.title}</Link> / {example.title}
              </p>
              <h1 className={styles.title}>{example.title}</h1>
              <div className={styles.badges}>
                {example.hasSpecs && <span className={styles.badge}>Has Specs</span>}
                {example.hasEvals && <span className={styles.badge}>Has Evals</span>}
                {example.requiresApiKeys && <span className={styles.badgeWarning}>Requires API Keys</span>}
              </div>
              <p className={styles.lede}>{example.description}</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Source Code</h2>
            <div className={styles.codeBlock}>
              <pre className={styles.pre}>
                <code className="language-lua">{example.code}</code>
              </pre>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Quick Start</h2>

            <div className={styles.commandSection}>
              <h3 className={styles.commandTitle}>Run the example:</h3>
              <pre className={styles.commandBlock}>
                <code>tactus run {example.tacPath}</code>
              </pre>
            </div>

            <div className={styles.commandSection}>
              <h3 className={styles.commandTitle}>Test with mocks:</h3>
              <pre className={styles.commandBlock}>
                <code>tactus test {example.tacPath} --mock</code>
              </pre>
            </div>

            {example.requiresApiKeys && (
              <div className={styles.note}>
                <p className={styles.noteTitle}>📝 Note</p>
                <p>This example requires API keys. Set your <code>OPENAI_API_KEY</code> environment variable before running.</p>
              </div>
            )}

            <p className={styles.bodyText}>
              <a href={example.githubUrl} target="_blank" rel="noopener noreferrer">
                View source on GitHub →
              </a>
            </p>
          </div>
        </section>

        {(prevExample || nextExample) && (
          <section className={`${styles.section} ${styles.bgMuted}`}>
            <div className={styles.container}>
              <div className={styles.navigation}>
                {prevExample ? (
                  <Link to={`/examples/${chapter.slug}/${prevExample.slug}/`} className={styles.navLink}>
                    <span className={styles.navLabel}>← Previous Example</span>
                    <span className={styles.navTitle}>{prevExample.title}</span>
                  </Link>
                ) : <div />}
                {nextExample && (
                  <Link to={`/examples/${chapter.slug}/${nextExample.slug}/`} className={`${styles.navLink} ${styles.navLinkNext}`}>
                    <span className={styles.navLabel}>Next Example →</span>
                    <span className={styles.navTitle}>{nextExample.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <BottomCta
          title="Explore more examples"
          text="Learn Tactus through practical, runnable examples organized by topic."
          buttonLabel="View All Examples"
          to="/examples/"
        />
      </div>
    </Layout>
  )
}

export const Head = ({ pageContext }) => (
  <Seo
    title={`${pageContext.example.title} - ${pageContext.chapter.title} Examples`}
    description={pageContext.example.description}
  />
)

export default ExampleTemplate
