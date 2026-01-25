import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import SpecificationsDiagram from "../components/diagrams/SpecificationsDiagram"
import AnimatedVisualSpecificationsDiagram from "../components/diagrams/AnimatedVisualSpecificationsDiagram"
// import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import * as styles from "./specifications.module.css"

const RUN_SPECS_COMMANDS = `tactus test path/to/procedure.tac
tactus test path/to/procedure.tac --scenario "Scenario name"`

const FAST_DETERMINISTIC_COMMANDS = `tactus test path/to/procedure.tac --mock
tactus test path/to/procedure.tac --mock --runs 10`

const MEASURE_RELIABILITY_COMMANDS = `tactus test path/to/procedure.tac --runs 10
tactus eval path/to/procedure.tac --runs 10`

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
              <h1 className={styles.title}>
                Trust, but Verify (and Re-verify)
              </h1>
              <p className={styles.lede}>
                Tactus turns procedures into verifiable artifacts. Specs live
                inline with the code, run as part of the toolchain, and fail
                loudly when behavior drifts - so you can iterate fast without
                losing features (or sleep).
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              What is a Behavior Specification?
            </h2>

            <p className={styles.bodyText}>
              Imagine you are hiring a human contractor. You don't give them a
              script saying "move your left foot, then your right foot." You
              give them a goal ("paint the house") and a set of rules ("don't
              spill paint on the driveway" and "finish by Friday").
            </p>

            <div style={{ margin: "2rem 0" }}>
              <AnimatedVisualSpecificationsDiagram theme={theme} />
            </div>

            <p className={styles.bodyText}>
              A <strong>Specification</strong> is that set of rules for your AI
              agent. It acts like a gatekeeper. It doesn't care exactly how the
              agent solves the problem—which words it chooses or which tool it
              picks first—as long as the final result meets the requirements and
              no safety rules were broken.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>The three rules of a spec</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>It defines success:</strong> "Did we get a valid
                  answer?"
                </li>
                <li>
                  <strong>It sets boundaries:</strong> "Did we avoid forbidden
                  tools?"
                </li>
                <li>
                  <strong>It allows variation:</strong> "Any path is fine, as
                  long as it works."
                </li>
              </ul>
            </div>

            <h3
              className={styles.sectionTitle}
              style={{ marginTop: "3rem", fontSize: "1.5rem" }}
            >
              Why "Old School" Testing Breaks
            </h3>
            <p className={styles.bodyText}>
              Traditional software tests are rigid. They often say:{" "}
              <em>"The output must be exactly 'Hello World'."</em> If the
              program outputs "Hello, World!" (with a comma), the test fails.
            </p>
            <p className={styles.bodyText}>
              That works for math, but it fails for AI. AI is creative. It might
              say "Hi there" or "Greetings." Both are correct, but a rigid test
              would mark them as failures.
            </p>
            <p className={styles.bodyTextMuted}>
              This is why specs focus on <strong>invariants</strong>. Instead of
              "text must be X," a spec says "text must be polite" or "text must
              contain the answer." Under the hood, Tactus can leverage powerful
              evaluator libraries like <strong>DSPy</strong> to implement
              "LLM-as-a-judge" assertions. This allows you to verify intent
              without being brittle about wording.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Verifiable Artifacts Scale Delegation
            </h2>
            <p className={styles.bodyText}>
              Agile works because it manages the risk of change with small,
              verifiable steps. AI makes iteration even cheaper: you can ask for
              ten changes before your coffee cools. That is a superpower - and a
              regression factory.
            </p>
            <p className={styles.bodyText}>
              When you hand a codebase to a human contractor, you do not just
              "hope they remember everything." You protect yourself with a
              verifiable test suite, and you ask for small changes so you can
              prove you did not lose anything important. Specs are that same
              safety net for AI coding assistants.
            </p>
            <p className={styles.bodyText}>
              Specs are also guardrails for change: you can refactor, swap
              models, or reorganize a procedure however you want, as long as the
              behaviors you care about still pass. That freedom-with-boundaries
              is how you get real leverage from AI without losing control.
            </p>
            <p className={styles.bodyText}>
              The goal is not perfection - it is controlled change. You let the
              agent innovate, but you keep a tight contract for what must stay
              true. That contract is executable. The verifier is always on.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Opinionated by design</p>
              <ul className={styles.checkList}>
                <li>Untested procedures are incomplete artifacts</li>
                <li>
                  Specs are supervision: they replace constant babysitting
                </li>
                <li>Cheap tests enable rapid, safe iteration</li>
                <li>Reliability is measured, not assumed</li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Specs Are Part of the Language
            </h2>
            <p className={styles.bodyText}>
              In Tactus, the procedure and the specs are one unit: one file, one
              parse tree, one artifact you can run and verify. This is why specs
              are written inline, right next to the code they test.
            </p>
            <p className={styles.bodyText}>
              Because the language can parse procedure + specs together, the
              toolchain can treat missing tests as a first-class problem: it can
              warn when a procedure ships without specs, extract scenario
              metadata, and feed results into your reliability loop.
            </p>
            <p className={styles.bodyText}>
              This is also token-efficient. Instead of repeating long prompt
              reminders like "never call the deploy tool" in every instruction,
              you can encode the invariant once as a spec - and let the runtime
              enforce it.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Why inline matters</p>
              <ul className={styles.checkList}>
                <li>Code and specs change together in a single diff</li>
                <li>The toolchain can warn when specs are missing</li>
                <li>
                  Agents can read, modify, and re-run tests without extra
                  context
                </li>
                <li>Specs replace long prompt rules, saving tokens</li>
                <li>Multi-run tests turn "it worked once" into a pass rate</li>
              </ul>
            </div>

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
              Notice what the spec asserts: it does not demand a specific JSON
              blob. It demands that a decision is produced, that the procedure
              completes, and that specific outputs exist.
            </p>
            <p className={styles.bodyTextMuted}>
              You can tighten the contract: "Then the response should contain a
              summary" or "Then the deploy tool should not be called." These
              constraints allow the agent freedom to solve the problem while
              guaranteeing the boundaries you care about (and keeping your
              laptop out of the incident postmortem).
            </p>
          </div>
        </section>

        <div className={styles.container}>
          <div className={styles.magentaBreakout}>
            <p className={styles.magentaEyebrow}>What is Gherkin?</p>
            <h3 className={styles.magentaTitle}>Given / When / Then</h3>
            <p className={styles.magentaText}>
              <a
                href="https://cucumber.io/docs/gherkin/reference/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Gherkin
              </a>{" "}
              is the plain-language syntax used by{" "}
              <a
                href="https://cucumber.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cucumber
              </a>{" "}
              (a popular testing tool for behavior-driven development). It uses
              the familiar "Given / When / Then" structure described in{" "}
              <a
                href="https://dannorth.net/blog/introducing-bdd/"
                target="_blank"
                rel="noopener noreferrer"
              >
                "Introducing BDD" (behavior-driven development)
              </a>
              , but with a strict, parseable grammar so it can run as an
              automated test.
            </p>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What Specs Actually Assert</h2>
            <p className={styles.bodyText}>
              A good spec is a set of invariants: what must be true no matter
              how the agent gets there. These are the properties that keep you
              out of incident postmortems.
            </p>
            <p className={styles.bodyText}>
              Three patterns show up again and again in production workflows:
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Three patterns</p>
              <ul className={styles.checkList}>
                <li>
                  Assert capability boundaries (what tools can or cannot happen)
                </li>
                <li>
                  Assert progress markers (state keys and stage transitions)
                </li>
                <li>
                  Assert output shape + constraints (existence, patterns,
                  ranges)
                </li>
              </ul>
            </div>
            <p className={styles.bodyText}>
              Tactus ships with a rich library of built-in steps so you can
              focus on intent, not glue code:
            </p>

            <div className={styles.specGrid}>
              <div className={styles.specCard}>
                <div className={styles.specCardHeader}>
                  <p className={styles.specCardTitle}>Tool policy</p>
                </div>
                <div className={styles.specCardBody}>
                  <ul className={styles.specList}>
                    <li>
                      <code>the send_email tool should not be called</code>
                    </li>
                    <li>
                      <code>
                        the search tool should be called at least 1 time
                      </code>
                    </li>
                    <li>
                      <code>
                        the deploy tool should be called with env=prod
                      </code>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specCardHeader}>
                  <p className={styles.specCardTitle}>State + stages</p>
                </div>
                <div className={styles.specCardBody}>
                  <ul className={styles.specList}>
                    <li>
                      <code>the state message_id should exist</code>
                    </li>
                    <li>
                      <code>the stage should be complete</code>
                    </li>
                    <li>
                      <code>
                        the stage should transition from draft to send
                      </code>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specCardHeader}>
                  <p className={styles.specCardTitle}>Outputs</p>
                </div>
                <div className={styles.specCardBody}>
                  <ul className={styles.specList}>
                    <li>
                      <code>the output summary should exist</code>
                    </li>
                    <li>
                      <code>the output subject should match pattern</code>
                    </li>
                    <li>
                      <code>the output action_items should exist</code>
                    </li>
                  </ul>
                </div>
              </div>

              <div className={styles.specCard}>
                <div className={styles.specCardHeader}>
                  <p className={styles.specCardTitle}>Flow + safety</p>
                </div>
                <div className={styles.specCardBody}>
                  <ul className={styles.specList}>
                    <li>
                      <code>the procedure should complete successfully</code>
                    </li>
                    <li>
                      <code>the total iterations should be less than 20</code>
                    </li>
                    <li>
                      <code>the stop reason should contain "approved"</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <p className={styles.bodyTextMuted}>
              Need a domain-specific check? Add a custom step in Lua. Keep it
              deterministic and small - custom steps are test code, not workflow
              code.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              The Vanishing Features Problem
            </h2>
            <p className={styles.bodyText}>
              If you build with AI assistants, you have seen this: you ship
              three features in a row, then notice the first one quietly
              disappeared. It was not malicious - it was just drift.
            </p>
            <p className={styles.bodyText}>
              Specs stop that. Each feature becomes a verifiable artifact. If
              the spec passes, the behavior you care about still exists. If it
              fails, you know exactly what vanished - and you can send the agent
              back to fix it before your cloud account becomes a crime scene.
            </p>
            <p className={styles.bodyTextMuted}>
              Specs are the part that does not forget. They are how you safely
              delegate work to AI: trust it to iterate, but give it a suite that
              can say "yes" or "no" without you in the loop.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Make Reliability Measurable</h2>
            <p className={styles.bodyText}>
              One successful run is luck. Reliability is a statistic. Specs
              answer "can it do the right thing?" Reliability asks "how often
              does it do the right thing?"{" "}
              <Link to="/evaluations/">Evaluations</Link> help you measure
              quality over real inputs. You need both to ship agentic systems
              with confidence.
            </p>

            <div className={styles.commandGrid}>
              <div className={styles.commandCard}>
                <p className={styles.kicker}>Run specs</p>
                <pre className={styles.codeBlock}>
                  <code>{RUN_SPECS_COMMANDS}</code>
                </pre>
              </div>
              <div className={styles.commandCard}>
                <p className={styles.kicker}>Fast + deterministic</p>
                <pre className={styles.codeBlock}>
                  <code>{FAST_DETERMINISTIC_COMMANDS}</code>
                </pre>
              </div>
              <div className={styles.commandCard}>
                <p className={styles.kicker}>Measure reliability</p>
                <pre className={styles.codeBlock}>
                  <code>{MEASURE_RELIABILITY_COMMANDS}</code>
                </pre>
              </div>
            </div>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>A practical loop</p>
              <ul className={styles.checkList}>
                <li>Write specs + mocks first</li>
                <li>
                  Run <code>tactus test --mock</code> until the logic is stable
                </li>
                <li>
                  Run in real mode, then measure pass rate with{" "}
                  <code>--runs</code>
                </li>
                <li>Add eval cases to track quality over realistic inputs</li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              Mock mode keeps tests cheap and deterministic by using{" "}
              <code>Mocks &#123; ... &#125;</code>. Multi-run specs and evals
              turn "it worked once" into a measurable reliability rate.
            </p>
            <p className={styles.bodyTextMuted}>
              This is a layered guardrails stack:{" "}
              <Link to="/validation/">validation</Link> catches missing fields
              and wrong types early, specs lock in what must not change (and
              prevent vanishing features), and{" "}
              <Link to="/evaluations/">evaluations</Link> act like a reliability
              gauge. Together they close the loop so an agent can iterate and
              self-check without you watching every step. See{" "}
              <Link to="/guardrails/">Guardrails</Link> and{" "}
              <Link to="/guiding-principles/">Guiding Principles</Link>.
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
    description="Turn procedures into verifiable artifacts with inline behavioral specifications."
  />
)

export default SpecificationsPage
