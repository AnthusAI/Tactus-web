import * as React from "react"
import getVideoSrc from "../lib/getVideoSrc"
import * as styles from "./videos-catalog-section.module.css"

const VideosCatalogSection = ({ showHeader = true }) => {
  const videos = [
    {
      id: "intro",
      title: "Intro to Tactus (4 min)",
      description: "What Tactus is, why tool-using agents need guardrails, and how the runtime helps.",
      poster: "intro-poster.jpg",
    },
    {
      id: "why-new-language",
      title: "Why a New Language? (7 min)",
      description: "The evolution of programming paradigms and why Tactus was created for the age of AI agents.",
      poster: "why-new-language-poster.jpg",
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {showHeader ? (
          <header className={styles.header}>
            <h2 className={styles.title}>Videos</h2>
            <p className={styles.subtitle}>Short walkthroughs and longer deep dives, paired with the articles and diagrams.</p>
          </header>
        ) : null}

        <div className={styles.grid}>
          {videos.map((v) => (
            <article key={v.id} className={styles.card}>
              <a className={styles.thumbLink} href="/videos/">
                <img className={styles.thumb} src={getVideoSrc(v.poster)} alt={`${v.title} poster`} loading="lazy" />
              </a>
              <h3 className={styles.cardTitle}>
                <a className={styles.thumbLink} href="/videos/">
                  {v.title}
                </a>
              </h3>
              <p className={styles.description}>{v.description}</p>
              <div className={styles.ctaRow}>
                <a href="/videos/">Watch</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideosCatalogSection

