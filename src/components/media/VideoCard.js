import * as React from "react"
import getVideoSrc from "../../lib/getVideoSrc"
import * as styles from "./VideoCard.module.css"

const VideoCard = ({
  title,
  description,
  meta,
  poster,
  to = "/videos/",
  variant = "default", // "default" | "compact"
  className,
}) => {
  return (
    <article
      className={`${styles.card} ${styles[variant]} ${className || ""}`.trim()}
    >
      <a className={styles.thumbLink} href={to}>
        <img
          className={styles.thumb}
          src={getVideoSrc(poster)}
          alt={`${title} poster`}
          loading="lazy"
        />
      </a>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>
            <a className={styles.titleLink} href={to}>
              {title}
            </a>
          </h3>
          {meta ? <span className={styles.meta}>{meta}</span> : null}
        </div>
        {description ? (
          <p className={styles.description}>{description}</p>
        ) : null}
      </div>
    </article>
  )
}

export default VideoCard
