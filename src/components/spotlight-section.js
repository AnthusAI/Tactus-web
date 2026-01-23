import * as React from "react"
import * as styles from "./spotlight-section.module.css"
import Button from "./ui/button"

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

const SpotlightSection = ({ 
  id, 
  eyebrow = "Learn", 
  title, 
  lede, 
  to, 
  ctaText = "Read more", 
  Diagram, 
}) => {
  const theme = usePreferredTheme()

  return (
    <section id={id} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.stack}>
          <div className={styles.content}>
            {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.lede}>{lede}</p>
            {to && (
              <div className={styles.ctaRow}>
                <Button to={to} variant="primary" shadow>
                  {ctaText}
                </Button>
              </div>
            )}
          </div>
          {Diagram ? (
            <div className={styles.diagramWrap}>
              <Diagram theme={theme} className={styles.diagram} />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default SpotlightSection
