import * as React from "react"
import * as styles from "./videos-catalog-section.module.css"
import { VIDEOS } from "../content/videos"
import VideoCard from "./media/VideoCard"

const VideosCatalogSection = ({ id = "videos", showHeader = true }) => {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.container}>
        {showHeader ? (
          <header className={styles.header}>
            <h2 className={styles.title}>Videos</h2>
            <p className={styles.subtitle}>Short walkthroughs and longer deep dives, paired with the articles and diagrams.</p>
          </header>
        ) : null}

        <div className={styles.grid}>
          {VIDEOS.map((v) => (
            <VideoCard
              key={v.id}
              className={styles.card}
              title={v.title}
              meta={v.meta}
              description={v.description}
              poster={v.poster}
              to={`/videos/#${v.id}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideosCatalogSection
