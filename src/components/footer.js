import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Github } from "lucide-react"
import * as styles from "./footer.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Left: Free and Open Source */}
        <div className={styles.left}>
          <p className={styles.text}>
            Tactus is{" "}
            <a
              href="https://en.wikipedia.org/wiki/Free_and_open-source_software"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              free and open source
            </a>
            .
          </p>
          <a
            href="https://github.com/AnthusAI/Tactus"
            target="_blank"
            rel="noreferrer"
            className={`${styles.link} ${styles.socialLink}`}
          >
            <Github size={16} />
            <span>View Source</span>
          </a>
        </div>

        {/* Center: Brand Icon + Tagline */}
        <div className={styles.center}>
          <StaticImage
            src="../images/favicon.png"
            alt="Tactus icon"
            className={styles.icon}
            layout="fixed"
            width={48}
            height={48}
            placeholder="none"
          />
          <div className={styles.tagline}>Code Responsibly</div>
        </div>

        {/* Right: Byline */}
        <div className={styles.right}>
          <div className={styles.madeWith}>Designed cybernetically</div>
          <div className={styles.byline}>
            <a
              href="https://anth.us/ryan/"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              by Ryan Porter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
