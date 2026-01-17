import * as React from "react"
import { Link } from "gatsby"
import * as styles from "./landing-learn-section.module.css"

const usePreferredTheme = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

const LandingLearnSection = ({ id, eyebrow = "Learn", title, lede, to, ctaText = "Read more", Diagram }) => {
  const theme = usePreferredTheme()

  return (
    <section id={id} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={`${styles.grid} ${!Diagram ? styles.gridNoDiagram : ""}`}>
            <div>
              <p className={styles.eyebrow}>{eyebrow}</p>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.lede}>{lede}</p>
              <div className={styles.ctaRow}>
                <Link className={styles.secondaryButton} to={to}>
                  {ctaText}
                </Link>
              </div>
            </div>
            {Diagram ? (
              <div className={styles.diagramWrap}>
                <Diagram theme={theme} className={styles.diagram} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default LandingLearnSection
