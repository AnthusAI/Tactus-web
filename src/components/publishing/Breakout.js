import React from "react"
import * as styles from "./Breakout.module.css"

const Breakout = ({
  title,
  children,
  id,
  size = "callout",
  bleed = true,
  withContainer = true,
  className = "",
  TitleTag = "h3",
  theme = "primary",
}) => {
  const rootClassName = [
    styles.root,
    styles[theme],
    size === "section" ? styles.section : styles.callout,
    bleed ? styles.bleed : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <section id={id} className={rootClassName}>
      {withContainer ? (
        <div className={styles.inner}>
          <div className={styles.content}>
            {title ? <TitleTag className={styles.title}>{title}</TitleTag> : null}
            <div className={styles.body}>{children}</div>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          {title ? <TitleTag className={styles.title}>{title}</TitleTag> : null}
          <div className={styles.body}>{children}</div>
        </div>
      )}
    </section>
  )
}

export default Breakout
