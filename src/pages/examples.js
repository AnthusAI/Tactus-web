import * as React from "react"
import { Link } from "gatsby"
import { Github } from "lucide-react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./examples.module.css"
import examplesData from "../data/examples.json"

const USE_CASE_HIGHLIGHTS = [
  {
    title: "A copilot for anything",
    description:
      "Embed agents in your app: chat UX, real tools, and explicit human checkpoints before side effects.",
    to: "/use-cases/copilot-anything/",
  },
  {
    title: "Text classification",
    description:
      "A simple, high-signal workflow: route messy text into an explicit label set with guardrails.",
    to: "/use-cases/text-classification/",
  },
]

const ExamplesPage = () => {
  const { chapters } = examplesData

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Examples</p>
              <h1 className={styles.title}>Learn by Running Real Procedures</h1>
              <p className={styles.lede}>
                Tactus is designed for executable, verifiable workflows.
                Examples are the fastest way to learn: read a procedure, run it,
                then iterate with validation, specs, and evaluations as your
                guardrails.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Start with Use Cases</h2>
            <p className={styles.bodyText}>
              Use cases are the quickest way to see what you can build with
              Tactus. Start with the first two walkthroughs, then browse the
              rest.
            </p>

            <div className={styles.cardGrid}>
              {USE_CASE_HIGHLIGHTS.map(useCase => (
                <Link key={useCase.to} to={useCase.to} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <p className={styles.cardTitle}>{useCase.title}</p>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardText}>{useCase.description}</p>
                    <p className={styles.cardCta}>Read</p>
                  </div>
                </Link>
              ))}

              <Link to="/use-cases/" className={styles.card}>
                <div className={styles.cardHeader}>
                  <p className={styles.cardTitle}>More use cases</p>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardText}>
                    Browse the complete list, including business process
                    automation and Level Zero Operators.
                  </p>
                  <p className={styles.cardCta}>Browse</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Explore the Examples Library
            </h2>
            <p className={styles.bodyText}>
              Runnable, tested examples organized progressively from basics to
              advanced topics. Each example includes embedded specifications and
              can be executed directly.
            </p>

            <div className={styles.cardGrid}>
              {chapters.map(chapter => (
                <Link
                  key={chapter.id}
                  to={`/examples/${chapter.slug}/`}
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <p className={styles.cardTitle}>{chapter.title}</p>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardText}>{chapter.description}</p>
                    <p className={styles.cardMeta}>
                      {chapter.examples.length}{" "}
                      {chapter.examples.length === 1 ? "example" : "examples"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <h3
              className={styles.sectionTitle}
              style={{ marginTop: "var(--space-6)" }}
            >
              Also Explore
            </h3>
            <div className={styles.cardGrid}>
              <a
                href="https://github.com/AnthusAI/Tactus-examples"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.card} ${styles.githubCard}`}
              >
                <div className={styles.cardHeader}>
                  <p className={styles.cardTitle}>
                    <Github
                      size={20}
                      style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                    />
                    Examples on GitHub
                  </p>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardText}>
                    Clone the repository, run examples locally, and see the
                    continuous integration tests in action.
                  </p>
                </div>
              </a>
            </div>

            <p className={styles.bodyTextMuted}>
              If you're new, start with{" "}
              <Link to="/guiding-principles/">Guiding Principles</Link>, then
              learn the guardrails stack:{" "}
              <Link to="/validation/">validation</Link>,{" "}
              <Link to="/specifications/">behavior specifications</Link>, and{" "}
              <Link to="/evaluations/">evaluations</Link>.
            </p>
          </div>
        </section>

        <BottomCta
          title="Ready to run your first procedure?"
          text="Start with a minimal workflow, then add guardrails as you iterate."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Examples"
    description="Executable examples and use cases for learning Tactus by running real procedures."
  />
)

export default ExamplesPage
