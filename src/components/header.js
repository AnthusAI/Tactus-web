import * as React from "react"
import { Link } from "gatsby"

import * as styles from "./header.module.css"

const Header = ({ siteTitle }) => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Link to="/" className={styles.brand} aria-label="Tactus home">
        <span className={styles.brandMark}>{siteTitle}</span>
      </Link>
      <nav className={styles.nav} aria-label="Primary">
        <Link to="/getting-started/">Getting Started</Link>
        <a href="https://anthusai.github.io/Learning-Tactus/">Learning</a>
        <a href="https://anthusai.github.io/Programming-Tactus/">Reference</a>
        <a href="https://anthusai.github.io/Tactus-in-a-Nutshell/">Nutshell</a>
        <a href="https://github.com/AnthusAI/Tactus">GitHub</a>
      </nav>
    </div>
  </header>
)

export default Header
