/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

function Seo({ description, title, children }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            siteUrl
            socialImage
            socialImageAlt
            socialIcon
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const siteUrl = site.siteMetadata?.siteUrl
  const socialImage = site.siteMetadata?.socialImage
  const socialIcon = site.siteMetadata?.socialIcon
  const socialImageAlt = site.siteMetadata?.socialImageAlt

  const resolvedTitle =
    title && defaultTitle && title !== defaultTitle
      ? `${title} | ${defaultTitle}`
      : defaultTitle || title

  const ogImageUrl = socialImage ? `${siteUrl}${socialImage}` : null
  const ogIconUrl = socialIcon ? `${siteUrl}${socialIcon}` : null

  return (
    <>
      <title>{resolvedTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      
      {/* Open Graph Images */}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      {ogIconUrl && <meta property="og:image" content={ogIconUrl} />}
      {socialImageAlt && <meta property="og:image:alt" content={socialImageAlt} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      {socialImageAlt && <meta name="twitter:image:alt" content={socialImageAlt} />}
      
      {children}
    </>
  )
}

export default Seo
