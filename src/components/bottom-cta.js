import * as React from "react"

import * as styles from "./bottom-cta.module.css"
import Button from "./ui/button"

const BottomCta = ({
  kicker,
  title = "Ready to start building?",
  text,
  buttonLabel = "Get Started",
  to = "/getting-started/",
}) => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.cta}>
          {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
          <h2 className={styles.title}>{title}</h2>
          {text ? <p className={styles.text}>{text}</p> : null}
          <div className={styles.buttons}>
            <Button to={to} variant="primary" size="large" shadow>
              {buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BottomCta
