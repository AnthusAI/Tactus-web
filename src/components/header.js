import * as React from "react"
import { Link } from "gatsby"
import { Menu, X } from "lucide-react"

import * as styles from "./header.module.css"

const Header = ({ siteTitle }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Tactus home">
          <span className={styles.brandMark}>{siteTitle}</span>
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`} aria-label="Primary">
          <Link to="/paradigm/">The Paradigm</Link>
          <Link to="/getting-started/">Getting Started</Link>
          <Link to="/download/">Download</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
