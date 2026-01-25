import * as React from "react"
import { graphql } from "gatsby"
import { CitationsProvider } from "gatsby-citation-manager"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import * as styles from "./examples.module.css"

const ExampleTemplate = ({ data, children }) => {
  return (
    <Layout fullWidth={false}>
      <CitationsProvider>
        <div className={styles.article}>
          <h1>{data.mdx.frontmatter.title}</h1>
          {data.mdx.frontmatter.subtitle && (
            <p className={styles.subtitle}>{data.mdx.frontmatter.subtitle}</p>
          )}
          {children}
        </div>
      </CitationsProvider>
    </Layout>
  )
}

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      frontmatter {
        title
        subtitle
      }
    }
  }
`

export const Head = ({ data }) => <Seo title={data.mdx.frontmatter.title} />

export default ExampleTemplate
