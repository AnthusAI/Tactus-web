import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import LandingLearnSection from "../components/landing-learn-section"
import GuardrailsStackDiagram from "../components/diagrams/GuardrailsStackDiagram"
import ToolboxDiagram from "../components/diagrams/ToolboxDiagram"
import BookSeriesSection from "../components/book-series-section"
import VideosCatalogSection from "../components/videos-catalog-section"
import * as styles from "./learn-more.module.css"

const LearnMorePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Learn More</p>
              <h1 className={styles.title}>Learn More</h1>
              <p className={styles.lede}>
                A catalog of the learning resources: the core feature overview, deep-dive articles, videos, and the book series.
              </p>
            </div>
          </div>
        </section>

        <LandingLearnSection
          id="learn-features"
          eyebrow="Learn More"
          title="Features Overview"
          lede="A concise overview of the control surface that makes Tactus production-friendly: durability, approvals, sandboxing, and reliability patterns."
          to="/features/"
          ctaText="Learn: Features"
        />

        <LandingLearnSection
          id="learn-guardrails"
          eyebrow="Learn More"
          title="Guardrails for Agent Autonomy"
          lede="A deep dive into the duality: autonomy requires brakes. Threat modeling, least privilege, durable HITL, sandboxing layers, and secretless execution."
          to="/procedure-sandboxing/"
          ctaText="Read: Guardrails"
          Diagram={GuardrailsStackDiagram}
        />

        <LandingLearnSection
          id="learn-toolbox"
          eyebrow="Learn More"
          title="The AI Engineer’s Toolbox"
          lede="A marketing-forward perspective on tool design: schema-first capabilities, inspectable tool calls, deterministic orchestration, and staged access."
          to="/ai-engineers-toolbox/"
          ctaText="Read: Toolbox"
          Diagram={ToolboxDiagram}
        />

        <VideosCatalogSection />
        <BookSeriesSection id="learn-books" mutedBackground={false} />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Learn More" />

export default LearnMorePage
