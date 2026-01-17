import * as React from "react"
import { Link } from "gatsby"
import * as styles from "./feature-highlights-section.module.css"

const FeatureHighlightsSection = ({ title, subtitle, items, ctaTo, ctaText = "Learn more" }) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>

        <div className={styles.grid}>
          {items.map((item) => (
            <div key={item.title} className={styles.card}>
              <h3 className={styles.cardTitle}>
                {item.icon ? item.icon : null} {item.title}
              </h3>
              <p className={styles.cardBody}>{item.body}</p>
            </div>
          ))}
        </div>

        {ctaTo ? (
          <div className={styles.ctaRow}>
            <Link className={styles.secondaryButton} to={ctaTo}>
              {ctaText}
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FeatureHighlightsSection
