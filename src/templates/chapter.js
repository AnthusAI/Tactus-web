import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./chapter.module.css"

const ChapterTemplate = ({ pageContext }) => {
  const { chapter, allChapters } = pageContext
  const currentIndex = allChapters.findIndex(c => c.id === chapter.id)
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>
                <Link to="/examples/">Examples</Link> / {chapter.title}
              </p>
              <h1 className={styles.title}>{chapter.title}</h1>
              <p className={styles.lede}>{chapter.description}</p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Examples in This Chapter</h2>

            <div className={styles.examplesList}>
              {chapter.examples.map((example) => (
                <Link
                  key={example.id}
                  to={`/examples/${chapter.slug}/${example.slug}/`}
                  className={styles.exampleCard}
                >
                  <div className={styles.exampleHeader}>
                    <h3 className={styles.exampleTitle}>{example.title}</h3>
                    <div className={styles.badges}>
                      {example.hasSpecs && <span className={styles.badge}>Has Specs</span>}
                      {example.hasEvals && <span className={styles.badge}>Has Evals</span>}
                      {example.requiresApiKeys && <span className={styles.badgeWarning}>Requires API Keys</span>}
                    </div>
                  </div>
                  <p className={styles.exampleDescription}>{example.description}</p>
                  <p className={styles.exampleCta}>View example →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {(prevChapter || nextChapter) && (
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.navigation}>
                {prevChapter && (
                  <Link to={`/examples/${prevChapter.slug}/`} className={styles.navLink}>
                    <span className={styles.navLabel}>← Previous Chapter</span>
                    <span className={styles.navTitle}>{prevChapter.title}</span>
                  </Link>
                )}
                {nextChapter && (
                  <Link to={`/examples/${nextChapter.slug}/`} className={`${styles.navLink} ${styles.navLinkNext}`}>
                    <span className={styles.navLabel}>Next Chapter →</span>
                    <span className={styles.navTitle}>{nextChapter.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </section>
        )}

        <BottomCta
          title="Want to contribute?"
          text="The examples repository is open source.
Add your own examples or improve existing ones."
          buttonLabel="View on GitHub"
          to="https://github.com/AnthusAI/Tactus-examples"
        />
      </div>
    </Layout>
  )
}

export const Head = ({ pageContext }) => (
  <Seo
    title={`${pageContext.chapter.title} Examples`}
    description={pageContext.chapter.description}
  />
)

export default ChapterTemplate
