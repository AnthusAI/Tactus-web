import * as React from "react"
import Button from "./ui/button"
import { getVideoById, VIDEOS } from "../content/videos"
import VideoCard from "./media/VideoCard"
import * as styles from "./videos-spotlight-section.module.css"

const VideosSpotlightSection = ({
  id = "videos-spotlight",
  title = "Videos",
  lede = "Short walkthroughs and longer deep dives. Start with these two — then browse the rest.",
  featuredIds = ["why-new-language", "guardrails"],
  to = "/videos/",
  ctaText = "Watch videos",
  withContainer = true,
  withPadding = true,
  mutedBackground = false,
}) => {
  const featuredVideos = featuredIds.map((videoId) => getVideoById(videoId)).filter(Boolean)
  const moreCount = Math.max(0, VIDEOS.length - featuredVideos.length)

  const content = (
    <React.Fragment>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.lede}>{lede}</p>
      </header>

      <div className={styles.grid}>
        {featuredVideos.map((video) => (
          <VideoCard
            key={video.id}
            variant="compact"
            title={video.title}
            meta={video.meta}
            description={video.description}
            poster={video.poster}
            to={`/videos/#${video.id}`}
          />
        ))}
      </div>

      <div className={styles.footerRow}>
        <p className={styles.moreCopy}>
          {moreCount > 0 ? `Plus ${moreCount} more video${moreCount === 1 ? "" : "s"} on the videos page.` : null}
        </p>
        <Button to={to} variant="secondary" shadow>
          {ctaText}
        </Button>
      </div>
    </React.Fragment>
  )

  return (
    <section
      id={id}
      className={`${withPadding ? styles.section : styles.sectionNoPadding} ${withContainer ? "" : styles.sectionNoContainer} ${
        mutedBackground ? styles.muted : ""
      }`}
    >
      {withContainer ? <div className={styles.container}>{content}</div> : content}
    </section>
  )
}

export default VideosSpotlightSection
