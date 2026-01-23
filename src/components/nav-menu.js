import * as React from "react"
import { Link, navigate } from "gatsby"

import * as styles from "./nav-menu.module.css"

// Navigation configuration
export const NAV_CONFIG = {
  categories: [
    {
      id: "learn-more",
      label: 'Learn More',
      to: "/learn-more/",
      items: [
        { label: 'Features', to: '/features/' },
        { label: 'Human in the Loop', to: '/human-in-the-loop/' },
        { label: 'The AI Engineer’s Toolbox', to: '/ai-engineers-toolbox/' },
        { label: 'Behavior Specifications', to: '/specifications/' },
        { label: 'Evaluations', to: '/evaluations/' },
        { label: 'Validation', to: '/validation/' },
      ]
    },
    {
      id: "concepts",
      label: 'Concepts',
      // No top-level link for Concepts as per current structure of other similar items unless requested
      items: [
        { label: 'Why a New Language?', to: '/why-new-language/' },
        { label: 'Guardrails for Agent Autonomy', to: '/guardrails/' },
      ]
    },
    {
      id: "get-started",
      label: 'Get Started',
      to: "/getting-started/",
      items: [
        { label: 'Download', to: '/download/' },
      ]
    },
    /*
    {
      id: "example-usage",
      label: "Example Usage",
      // to: "/examples/", // Optional top-level link
      items: [
        { label: "Automated Scientific Discovery", to: "/examples/automated-scientific-discovery/" },
        { label: "Text Classification", to: "/examples/text-classification/" },
        { label: "Self-Evolving Agents", to: "/examples/self-evolving-agents/" },
      ],
    },
    */
    {
      id: "resources",
      label: "Resources",
      to: "/resources/",
      items: [
        { label: "Videos", to: "/resources/#videos" },
        { label: "Books", to: "/resources/#books" },
      ],
    },
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
        <div className={styles.navCategories}>
          {NAV_CONFIG.categories.map((category) => (
            (category.to || category.items.length > 0) && (
              <section
                key={category.label}
                className={styles.navCategory}
                data-category={category.id || category.label}
              >
                <h2 className={styles.navCategoryLabel}>
                  {category.to ? (
                    <Link
                      to={category.to}
                      onClick={handleClick(category.to)}
                      aria-label={category.label}
                    >
                      {category.label}
                    </Link>
                  ) : (
                    category.label
                  )}
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
