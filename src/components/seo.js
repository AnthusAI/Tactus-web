/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

function resolveSocialUrl(siteUrl, value) {
  if (!value) return null
  if (value.startsWith("http://") || value.startsWith("https://")) return value
  return `${siteUrl}${value}`
}

function Seo({
  description,
  title,
  // By default we prefer a small icon-style preview (Discord/Twitter summary).
  // Pages that want a large feature image can pass `useIconPreview={false}` or
  // explicitly pass `image`.
  useIconPreview = true,
  image,
  imageAlt,
  twitterCard,
  children,
}) {
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

  const defaultPreviewPath = useIconPreview ? socialIcon : socialImage
  const ogImageUrl = resolveSocialUrl(siteUrl, image || defaultPreviewPath)
  const resolvedImageAlt = imageAlt || socialImageAlt

  const isIconPreview =
    useIconPreview &&
    !image &&
    Boolean(socialIcon) &&
    socialIcon === defaultPreviewPath
  const resolvedTwitterCard =
    twitterCard || (isIconPreview ? "summary" : "summary_large_image")

  return (
    <>
      <title>{resolvedTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />

      {/* Open Graph Images */}
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      {resolvedImageAlt && (
        <meta property="og:image:alt" content={resolvedImageAlt} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content={resolvedTwitterCard} />
      <meta name="twitter:creator" content={site.siteMetadata?.author || ``} />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImageUrl && <meta name="twitter:image" content={ogImageUrl} />}
      {resolvedImageAlt && (
        <meta name="twitter:image:alt" content={resolvedImageAlt} />
      )}

      {children}
    </>
  )
}

export default Seo
