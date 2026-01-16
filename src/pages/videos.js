import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./videos.module.css"

const VIDEOS = [
  {
    id: "intro",
    title: "Intro to Tactus",
    description: "What Tactus is, why tool-using agents need guardrails, and how the runtime helps.",
    filename: "intro.mp4",
  },
]

const getVideoSrc = (filename) => {
  const base = process.env.GATSBY_VIDEOS_BASE_URL
  if (base && typeof base === "string") {
    return `${base.replace(/\/$/, "")}/${filename}`
  }
  // Local dev fallback: put files in `static/videos/` (not committed).
  return `/videos/${filename}`
}

const VideosPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <h1 className={styles.title}>Videos</h1>
            <p className={styles.subtitle}>
              Short, practical walkthroughs of Tactus: the mental model, safety design, and real workflows.
            </p>

            <div className={styles.grid}>
              {VIDEOS.map((v) => (
                <article key={v.id} className={styles.card}>
                  <div className={styles.cardBody}>
                    <h2 className={styles.cardTitle}>{v.title}</h2>
                    <p className={styles.cardDescription}>{v.description}</p>
                  </div>

                  <div className={styles.player}>
                    <video
                      className={styles.video}
                      controls
                      preload="metadata"
                      playsInline
                      src={getVideoSrc(v.filename)}
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.note}>
              <b>Tip:</b> Set <code>GATSBY_VIDEOS_BASE_URL</code> to point at your public video bucket/CDN for
              production. If unset, the page expects local files under <code>static/videos/</code>.
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default VideosPage

export const Head = () => <Seo title="Videos" />
