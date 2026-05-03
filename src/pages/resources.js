import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import VideosCatalogSection from "../components/videos-catalog-section"
import BookSeriesSection from "../components/book-series-section"
import * as styles from "./resources.module.css"

const ResourcesPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Resources</p>
              <h1 className={styles.title}>Resources</h1>
              <p className={styles.lede}>
                Books and videos that pair with the site’s articles and
                patterns.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.editorSupportTitle}>Editor Support</h2>
            <p className={styles.editorSupportBody}>
              Use VS Code? Install the Tactus extension for syntax highlighting,
              validation, and code intelligence for .tac files.
            </p>
            <a
              href="https://marketplace.visualstudio.com/items?itemName=AnthusAISolutions.tactus"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.editorSupportLink}
            >
              Install from VS Code Marketplace →
            </a>
          </div>
        </section>

        <VideosCatalogSection id="videos" />
        <BookSeriesSection id="books" mutedBackground={false} />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Resources" />

export default ResourcesPage
