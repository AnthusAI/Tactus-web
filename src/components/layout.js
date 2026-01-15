/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Header from "./header"
import * as styles from "./layout.module.css"
import "./layout.css"

const Layout = ({ children, fullWidth = false }) => {
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
      <Header siteTitle={data.site.siteMetadata?.title || `Tactus`} />
      <div className={fullWidth ? styles.contentFull : styles.content}>
        <main>{children}</main>
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerCenter}>
            <StaticImage
              src="../images/favicon.png"
              alt="Tactus icon"
              className={styles.footerIcon}
              layout="fixed"
              width={96}
              height={96}
              placeholder="none"
            />
            <div className={styles.footerTagline}>
              Code Responsibly
            </div>
          </div>
          <div className={styles.footerByline}>by Ryan Porter</div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
