import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import SpecificationsDiagram from "../components/diagrams/SpecificationsDiagram"
// import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import * as styles from "./specifications.module.css"

const SpecificationsPage = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    if (typeof window === "undefined") return
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Behavior Specifications</p>
              <h1 className={styles.title}>Define What "Good" Looks Like</h1>
              <p className={styles.lede}>
                Tactus treats Gherkin specifications as a first-class feature, integrating them directly into the language and toolchain. This provides constant visibility into procedure reliability—critical for agents with powerful tools and delegated responsibilities.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>The Problem with "Assert Equals"</h2>
            <p className={styles.bodyText}>
              Traditional testing relies on deterministic assertions: <code>assert(result == expected)</code>. This works for code, but it breaks for agents.
            </p>
            <p className={styles.bodyTextMuted}>
              An agent might phrase an answer differently, use a different tool order, or take a slightly different path to the same goal. If your tests demand bit-for-bit equality, they will fail even when the agent succeeds.
            </p>
            <p className={styles.bodyTextMuted}>
              But if you remove assertions entirely, you have no safety net. You need a way to assert <strong>invariants</strong> and <strong>intent</strong> without over-specifying execution details.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Built-in, Not Bolted On</h2>
            <p className={styles.bodyText}>
              In traditional languages, testing is often agnostic and bolted on after the fact. Tactus is opinionated: behavioral specifications are built into the language and the toolchain.
            </p>
            <p className={styles.bodyText}>
              Tactus uses Gherkin-style specifications to describe behavior. These specs are readable by humans but executable by the runtime. The toolchain monitors the presence of specs and their results, feeding directly into evaluations so you have constant visibility on whether your procedures are doing the right thing.
            </p>
            
            <div className={styles.diagramWrap}>
              <SpecificationsDiagram theme={theme} className={styles.diagram} />
              {/* <div style={{ padding: 40, background: '#eee', textAlign: 'center' }}>Diagram Temporarily Disabled for Debugging</div> */}
              {/* <AnimatedCodeBlock
                label="Direct Test"
                code="Test Code"
                theme={theme}
              /> */}
            </div>

            <p className={styles.bodyText}>
              This specification doesn't demand a specific JSON response. It demands that a decision is produced, that the procedure completes, and that specific output fields exist.
            </p>
            <p className={styles.bodyTextMuted}>
              You can get more specific: "Then the response should contain a summary" or "Then no external tools should be called." These constraints allow the agent freedom to solve the problem while guaranteeing the boundaries you care about.
            </p>
          </div>
        </section>

        <BottomCta
          title="Ready to write specs?"
          text="Learn how to add behavioral testing to your agent workflows."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Behavior Specifications"
    description="Define correctness for probabilistic systems using Gherkin-style behavioral specifications."
  />
)

export default SpecificationsPage
