import * as React from "react"
import { Link, navigate } from "gatsby"

import * as styles from "./nav-menu.module.css"

// Navigation configuration
export const NAV_CONFIG = {
  categories: [
    {
      label: 'Learn',
      items: [
        { label: 'Features', to: '/features/' },
        { label: 'Why a New Language?', to: '/why-new-language/' },
      ]
    },
    {
      label: 'Get Started',
      items: [
        { label: 'Getting Started', to: '/getting-started/' },
        { label: 'Download', to: '/download/' },
      ]
    },
    {
      label: 'Resources',
      items: [
        { label: 'Videos', to: '/videos/' },
        { label: 'Books', to: '/#books' },
      ]
    }
  ]
}

const NavMenu = ({ onNavigate }) => {
  const handleClick = (to) => (e) => {
    e.preventDefault()
    onNavigate?.()
    navigate(to)
  }

  return (
    <div className={styles.navMenu}>
      <div className={styles.navMenuInner}>
        <h1 className={styles.navMenuTitle}>Site Navigation</h1>

        <div className={styles.navCategories}>
          {NAV_CONFIG.categories.map((category) => (
            category.items.length > 0 && (
              <section
                key={category.label}
                className={styles.navCategory}
              >
                <h2 className={styles.navCategoryLabel}>
                  {category.label}
                </h2>
                <ul className={styles.navCategoryItems}>
                  {category.items.map((item) => (
                    <li key={item.to} className={styles.navCategoryItem}>
                      <Link
                        to={item.to}
                        activeClassName="active"
                        onClick={handleClick(item.to)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          ))}
        </div>
      </div>
    </div>
  )
}

export default NavMenu
