import * as React from "react"
import * as styles from "./BookCard.module.css"

const BookCard = ({
  title,
  description,
  coverSrc,
  href,
  pdf,
  repo,
  className,
}) => {
  return (
    <article className={`${styles.card} ${className || ""}`.trim()}>
      <a
        className={styles.coverLink}
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        <div className={styles.coverFrame}>
          <img
            className={styles.cover}
            src={coverSrc}
            alt={`${title} cover`}
            loading="lazy"
          />
        </div>
      </a>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <a
            className={styles.titleLink}
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {title}
          </a>
        </h3>
        <p className={styles.description}>{description}</p>
        <div className={styles.links}>
          <a href={href} target="_blank" rel="noreferrer">
            Read
          </a>
          <a href={pdf} target="_blank" rel="noreferrer">
            PDF
          </a>
          <a href={repo} target="_blank" rel="noreferrer">
            Repo
          </a>
        </div>
      </div>
    </article>
  )
}

export default BookCard
