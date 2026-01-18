import * as React from "react"
import * as styles from "./feature-highlights-section.module.css"
import Button from "./ui/button"

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
              <div className={styles.iconWrapper}>
                {item.icon ? item.icon : null}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardBody}>{item.body}</p>
            </div>
          ))}
        </div>

        {ctaTo ? (
          <div className={styles.ctaRow}>
            <Button to={ctaTo} variant="primary" shadow>
              {ctaText}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default FeatureHighlightsSection
