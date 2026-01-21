import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import SpotlightSection from "../components/spotlight-section"
import AnimatedAIEngineersToolboxDiagram from "../components/diagrams/AnimatedAIEngineersToolboxDiagram"
import ContainerSandboxDiagram from "../components/diagrams/ContainerSandboxDiagram"
import SpecificationsDiagram from "../components/diagrams/SpecificationsDiagram"
import EvaluationsDiagram from "../components/diagrams/EvaluationsDiagram"
import VideosSpotlightSection from "../components/videos-spotlight-section"
import BookSeriesSection from "../components/book-series-section"
import Breakout from "../components/publishing/Breakout"
import Button from "../components/ui/button"
import getVideoSrc from "../lib/getVideoSrc"
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
                Deep-dive articles that explain how to give agents tools, keep them safe with guardrails, and measure their reliability.
              </p>
            </div>
          </div>
        </section>

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

        <SpotlightSection
          id="learn-guardrails"
          eyebrow="Learn More"
          title="Guardrails for Agent Autonomy"
          lede="Tactus gives you levers of control at every level: capability, context, network, and human oversight. You don't hope for safety—you engineer it."
          to="/guardrails/"
          ctaText="Read: Guardrails"
          Diagram={null}
        />

        <SpotlightSection
          id="learn-validation"
          eyebrow="Learn More"
          title="Validation"
          lede="Procedures declare typed inputs and outputs, validated with Pydantic. This isn't just decoration: it's a contract that guarantees type safety at the edges of your agentic workflows."
          to="/validation/"
          ctaText="Read: Validation"
          Diagram={null} // Or reuse code block if we want
          flip={true}
        />

        <VideosSpotlightSection
          id="learn-videos"
          title="Videos"
          lede="Watch the story: visuals + narration that mirror the articles."
          featuredIds={["guardrails"]}
          to="/videos/"
          ctaText="Watch videos"
          ctaVariant="tertiary"
          mutedBackground={true}
        />

        <SpotlightSection
          id="learn-sandboxing"
          eyebrow="Learn More"
          title="Sandboxing & Isolation"
          lede="Agents run in a Lua sandbox inside a networkless container, constraining what they can touch and firewalling side effects. Privileged operations are brokered by a separate process that holds the secrets. It’s like letting a burglar into an empty building: even if the agent is compromised, there’s nothing valuable inside to steal—and nowhere to send it."
          to="/guardrails/#sandboxing"
          ctaText="Read: Sandboxing"
          Diagram={ContainerSandboxDiagram}
        />

        <Breakout title="Why do we need a new language?" size="section">
          <p>
            We have Python. We have TypeScript. We have powerful agent frameworks.
            But they were built to manipulate deterministic logic, not probabilistic behavior.
          </p>
          <div className={styles.videoCard}>
            <div className={styles.videoHeader}>
              <span className={styles.videoTitle}>
                Why a New Language? (7 min)
              </span>
            </div>
            <video
              className={styles.video}
              controls
              preload="metadata"
              playsInline
              src={getVideoSrc("why-new-language.mp4")}
              poster={getVideoSrc("why-new-language-poster.jpg")}
            />
          </div>
          <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
            <Button to="/why-new-language/" variant="tertiary" shadow>
              Read: Why a New Language?
            </Button>
          </div>
        </Breakout>

        <SpotlightSection
          id="learn-specifications"
          eyebrow="Learn More"
          title="Behavior Specifications"
          lede="Tactus treats Gherkin specs as a first-class feature, integrating them directly into the language and toolchain. This provides constant visibility into procedure reliability, ensuring your agents act correctly even as models and tools evolve."
          to="/specifications/"
          ctaText="Read: Specifications"
          Diagram={SpecificationsDiagram}
          flip={true}
        />

        <SpotlightSection
          id="learn-evaluations"
          eyebrow="Learn More"
          title="Evaluations"
          lede="One successful run is luck. Reliability is a statistic. Evaluations let you measure accuracy, cost, and reliability performance across datasets so you can ship with confidence."
          to="/evaluations/"
          ctaText="Read: Evaluations"
          Diagram={EvaluationsDiagram}
        />

        <BookSeriesSection id="learn-books" mutedBackground={true} />

      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Learn More" />

export default LearnMorePage
