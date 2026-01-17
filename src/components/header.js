import * as React from "react"
import { Link } from "gatsby"
import { Menu, X } from "lucide-react"

import * as styles from "./header.module.css"

// Primary navigation items shown inline on desktop
const PRIMARY_NAV = [
  { label: 'Learn More', to: '/learn-more/' },
  { label: 'Get Started', to: '/getting-started/' },
  { label: 'Download', to: '/download/' },
]

const Header = ({ siteTitle, isMenuOpen, setIsMenuOpen }) => {
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Handle ESC key to close menu
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen, setIsMenuOpen])

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link to="/" className={styles.brand} aria-label="Tactus home" onClick={() => setIsMenuOpen(false)}>
          <span className={styles.brandMark}>{siteTitle}</span>
        </Link>

        {/* Primary Navigation (Desktop Inline) */}
        <nav className={styles.primaryNav} aria-label="Primary navigation">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeClassName="active"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Button */}
        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X size={18} strokeWidth={1.5} />
          ) : (
            <Menu size={18} strokeWidth={1.5} />
          )}
        </button>
      </div>
    </header>
  )
}

export default Header
