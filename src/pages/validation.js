import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import AnimatedVisualValidationDiagram from "../components/diagrams/AnimatedVisualValidationDiagram"
import * as styles from "./index.module.css"

const VALIDATION_EXAMPLE = `Procedure {
    input = {
        topic = field.string{required = true},
    },
    output = {
        findings = field.string{required = true},
        approved = field.boolean{required = true},
    },
    function(input)
        local findings = "..."
        local approved = false
        return {findings = findings, approved = approved}
    end,
}`

const PYDANTIC_EXAMPLE = `from pydantic import BaseModel

class Output(BaseModel):
    findings: str
    approved: bool`

const ValidationPage = () => {
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
      <div className={`${styles.page} ${styles.wideProse}`}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={`${styles.eyebrow} ${styles.eyebrowPrimary}`}>
                Validation
              </p>
              <h1 className={styles.title}>Don’t Pass Mystery Blobs Around</h1>
              <p className={styles.lede}>
                Validation is the earliest (and cheapest) guardrail in the loop.
                It turns inputs and outputs into contracts so problems fail fast
                at the boundary - before they cascade into behavior
                specifications, evaluations, or incidents.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.narrativeSection}>
              <div className={styles.narrativeContent}>
                <h3>The story: bags of data vs contracts</h3>
                <p>
                  If your workflow passes around an unstructured blob of data,
                  everything looks fine until it doesn’t. A key goes missing. A
                  value changes type. A downstream step assumes something
                  exists, and now you’re debugging a production incident that
                  started as “just a small change.”
                </p>

                <div style={{ margin: "2rem 0" }}>
                  <AnimatedVisualValidationDiagram theme={theme} />
                </div>

                <p>
                  Validation flips that around. Instead of "hope the data is
                  shaped correctly," you get an explicit contract at the
                  procedure boundary. Inputs are checked before your procedure
                  runs, and outputs are verified before anything else can depend
                  on them.
                </p>
                <ul>
                  <li>
                    <strong>Fewer surprises:</strong> mistakes fail fast at the
                    boundary, not deep inside the workflow.
                  </li>
                  <li>
                    <strong>Safer iteration:</strong> refactors can’t silently
                    break callers.
                  </li>
                  <li>
                    <strong>More leverage:</strong> schemas unlock generated
                    forms and machine-readable API docs.
                  </li>
                </ul>
                <p>
                  This is one way to “close the loop” for AI-assisted
                  development: make a small change, run it, and get an objective
                  signal immediately - not a vague feeling that it “probably
                  works.”
                </p>
              </div>
            </div>

            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Schema-first design</h2>
                <p className={styles.sectionSubtitle}>
                  In Tactus, schemas live with the procedure. They define what
                  the procedure expects and what it guarantees to return.
                </p>
              </header>
              <div className={styles.codeBlockPlayerTall}>
                <AnimatedCodeBlock
                  label="Validation"
                  filename="procedure.tac"
                  hint="Input + output contracts"
                  code={VALIDATION_EXAMPLE}
                  language="tactus"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  blockWidth={1400}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
            </div>

            <div className={styles.narrativeSection}>
              <div className={styles.narrativeContent}>
                <h3>What you get (even if you never say “Pydantic”)</h3>
                <p>
                  When the “interface” is natural language, it’s easy for the
                  shape of data to drift: missing fields, wrong types,
                  half-structured JSON, and brittle glue code. Tactus uses
                  schemas to keep the edges of your workflow predictable.
                </p>
                <ul>
                  <li>
                    <strong>Input validation:</strong> catch bad or missing
                    inputs before any tools run.
                  </li>
                  <li>
                    <strong>Output validation:</strong> guarantee that
                    downstream code receives what it expects.
                  </li>
                  <li>
                    <strong>Generated UIs:</strong> schemas can drive
                    human-in-the-loop forms and approvals.
                  </li>
                  <li>
                    <strong>API docs:</strong> procedures can expose
                    machine-readable contracts (OpenAPI) automatically.
                  </li>
                </ul>
                <p>
                  If you want the “how,” it’s built on a widely used Python
                  validation layer:{" "}
                  <a
                    href="https://docs.pydantic.dev/latest/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Pydantic
                  </a>
                  .
                </p>
                <p>
                  Validation is the guardrail that catches problems earliest.
                  Then come{" "}
                  <Link to="/specifications/">behavior specifications</Link>{" "}
                  (hard “must not change” rules) and{" "}
                  <Link to="/evaluations/">evaluations</Link> (a reliability
                  gauge that tells you when a change made things worse).
                </p>
              </div>
            </div>

            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Under the hood: Pydantic models
                </h2>
                <p className={styles.sectionSubtitle}>
                  A schema is more than documentation. It becomes a real
                  validator. If an agent “forgets” a required field, the run
                  fails loudly instead of quietly returning a broken payload.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Pydantic"
                  filename="schemas.py"
                  hint="Validated classes (high level)"
                  code={PYDANTIC_EXAMPLE}
                  language="python"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  blockWidth={1400}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
              <p className={styles.sectionSubtitle}>
                The important part isn’t the library name. It’s the effect: the
                runtime can enforce contracts consistently, generate helpful
                errors, and keep your workflow honest as it evolves.
              </p>
              <p className={styles.sectionSubtitle}>
                Next: pair this with{" "}
                <Link to="/specifications/">behavior specifications</Link> to
                lock in “what must always be true,” then run{" "}
                <Link to="/evaluations/">evaluations</Link> to quantify how
                often it stays true across real inputs. For the broader “layers
                of guardrails” story, see{" "}
                <Link to="/guardrails/">Guardrails</Link> and{" "}
                <Link to="/guiding-principles/">Guiding Principles</Link>.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Validation" />

export default ValidationPage
