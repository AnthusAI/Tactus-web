import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import SpotlightSection from "../components/spotlight-section"
import GuardrailsSpotlight from "../components/guardrails-spotlight"
import WhyNewLanguageSpotlight from "../components/why-new-language-spotlight"
import AnimatedAIEngineersToolboxDiagram from "../components/diagrams/AnimatedAIEngineersToolboxDiagram"
import VideosSpotlightSection from "../components/videos-spotlight-section"
import BookSeriesSection from "../components/book-series-section"
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
                Deep-dive articles that explain the paradigm shift, the guardrails story, and the AI engineer’s toolbox.
              </p>
            </div>
          </div>
        </section>

        <WhyNewLanguageSpotlight id="learn-why-new-language" eyebrow="Learn More" />

        <GuardrailsSpotlight id="learn-guardrails" eyebrow="Learn More" />

        <SpotlightSection
          id="learn-toolbox"
          eyebrow="Learn More"
          title="The AI Engineer’s Toolbox"
          lede="A marketing-forward perspective on tool design: schema-first capabilities, inspectable tool calls, deterministic orchestration, and staged access."
          to="/ai-engineers-toolbox/"
          ctaText="Read: Toolbox"
          Diagram={AnimatedAIEngineersToolboxDiagram}
          flip={true}
        />

        <VideosSpotlightSection
          id="learn-videos"
          title="Videos"
          lede="Watch the story: visuals + narration that mirror the articles."
          featuredIds={["why-new-language", "guardrails"]}
          to="/videos/"
          ctaText="Watch videos"
          mutedBackground={true}
        />

        <BookSeriesSection id="learn-books" mutedBackground={true} />

      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Learn More" />

export default LearnMorePage
