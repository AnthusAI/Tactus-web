/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Header from "./header"
import NavMenu from "./nav-menu"
import Footer from "./footer"
import * as styles from "./layout.module.css"
import "./layout.css"

const Layout = ({ children, fullWidth = false }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  React.useEffect(() => {
    if (!isMenuOpen) return
    if (typeof window === "undefined") return

    const scrollToTop = () =>
      window.scrollTo({ top: 0, left: 0, behavior: "auto" })
    scrollToTop()
    window.requestAnimationFrame(scrollToTop)
  }, [isMenuOpen])

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div className={styles.page}>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Tactus`}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      {isMenuOpen ? (
        <NavMenu onNavigate={() => setIsMenuOpen(false)} />
      ) : (
        <div className={fullWidth ? styles.contentFull : styles.content}>
          <main>{children}</main>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Layout
