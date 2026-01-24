import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./guiding-principles.module.css"

const GuidingPrinciplesPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Concepts</p>
              <h1 className={styles.title}>Opinions, On Purpose</h1>
              <p className={styles.lede}>
                Tactus is an opinionated system: a curated set of principles for building agentic software that stays safe, measurable, and maintainable while you
                iterate quickly.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why “Opinionated” Is a Feature</h2>
            <p className={styles.bodyText}>
              Some tools are deliberately unopinionated: flexible, composable, and endlessly customizable. Others bundle a point of view about what works in
              practice.
            </p>
            <p className={styles.bodyTextMuted}>
              <strong>Ruby on Rails</strong> popularized this idea in web development: conventions, defaults, and a coherent stack that helps teams move fast without
              reinventing the same decisions every week. Frameworks like <strong>Django</strong> and <strong>Phoenix</strong> carry a similar “batteries included”
              philosophy.
            </p>
            <p className={styles.bodyTextMuted}>
              Tactus is that kind of system. Its opinions are about something very specific: how to build software with AI and agents without turning your repo (or
              your cloud account) into a crime scene.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Close the Loop: Verifiable Iteration</h2>
            <p className={styles.bodyText}>
              Agile engineering works because it makes change safe: small steps, continuously verified. AI makes iteration cheaper, which means it can either
              accelerate progress or accelerate regressions.
            </p>
            <p className={styles.bodyTextMuted}>
              The core principle is a feedback loop the agent can use on its own: make a change, run checks, and get an objective signal. Without that loop, you
              get a lot of output and very little reality: all yang, no yin.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>The loop, in layers</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>Validation</strong> fails fast on shape/type problems at the boundary (
                  <Link to="/validation/">Validation</Link>)
                </li>
                <li>
                  <strong>Behavior specifications</strong> lock in invariants and prevent “vanishing features” (
                  <Link to="/specifications/">Specifications</Link>)
                </li>
                <li>
                  <strong>Evaluations</strong> quantify reliability over datasets (“98% vs 78%”) (
                  <Link to="/evaluations/">Evaluations</Link>)
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Prompts Are Suggestions. Guardrails Are Controls.</h2>
            <p className={styles.bodyText}>
              Prompting helps. It reduces error rates and shapes behavior. But if your only safety story is “the prompt says don’t,” you’ve built a demo, not a
              system.
            </p>
            <p className={styles.bodyTextMuted}>
              Tactus treats agent workflows as <strong>untrusted execution with the ability to act</strong>. The right approach is defense in depth: multiple
              layers that each reduce a different class of risk so you don’t bet everything on one fragile assumption.
            </p>
            <p className={styles.bodyTextMuted}>
              This idea is explored in depth on <Link to="/guardrails/">Guardrails</Link>, but it also shows up concretely in the language design: schemas,
              policies, durable approvals, and tests that are part of the same executable artifact.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Shift Left: Catch Problems Earlier</h2>
            <p className={styles.bodyText}>
              A mistake is cheapest when you catch it early. The later you find it, the bigger the blast radius: more time wasted, more broken assumptions, more
              downstream confusion.
            </p>
            <p className={styles.bodyTextMuted}>
              That’s why Tactus treats validation as a first-class runtime boundary: it catches missing fields, wrong types, and malformed outputs before you even
              spend time debugging a failing spec or a degrading evaluation score.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Everything Is Code (Including the Guardrails)</h2>
            <p className={styles.bodyText}>
              In Tactus, “the test suite” is not a separate project and “the eval harness” is not an ad-hoc script. Specs and evals live with procedures, in the
              same file, as one logical unit the tooling can parse and reason about.
            </p>
            <p className={styles.bodyTextMuted}>
              That unlocks first-class warnings when code has no guardrails, and it makes it natural to keep behavior, reliability, and interfaces up to date as
              your system evolves.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Tools Are the Seam. Enforce Policy There.</h2>
            <p className={styles.bodyText}>
              Tools are where probabilistic behavior meets deterministic side effects. That’s the seam where you want strict rules: validate inputs, enforce
              allowlists, apply limits, and log what happened.
            </p>
            <p className={styles.bodyTextMuted}>
              This is why Tactus pushes schema-first capabilities and inspectable tool calls: you’re not trying to “trust the model.” You’re engineering boundaries
              around what it can do.
            </p>
            <p className={styles.bodyTextMuted}>
              For the tooling perspective, see <Link to="/ai-engineers-toolbox/">The AI Engineer’s Toolbox</Link>.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Bounded Autonomy: More Power, More Constraints</h2>
            <p className={styles.bodyText}>
              If you want agents to do meaningful work without you watching every step, you need constraints that are enforceable.
            </p>
            <p className={styles.bodyTextMuted}>
              Some guardrails are “hard” (sandboxing, tool policies, specs). Some are “soft” (evaluation scores that drift). Both matter. Together they let you
              delegate responsibility while keeping the system inside the boundaries you care about.
            </p>
            <p className={styles.bodyTextMuted}>
              For the broader story of layered guardrails beyond testing and validation, see{" "}
              <Link to="/guardrails/">Guardrails for Agent Autonomy</Link>.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Default-On Isolation (and Nothing to Steal)</h2>
            <p className={styles.bodyText}>
              Powerful agents need a cage. Tactus’s default posture is isolation: sandboxed execution, containers, minimal toolsets, and careful trust boundaries.
            </p>
            <p className={styles.bodyTextMuted}>
              A key opinion is <strong>secretless execution</strong>: don’t just “hide” credentials from the model - keep them out of the runtime environment
              entirely. The agent gets results, not keys.
            </p>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Isolation defaults</p>
              <ul className={styles.checkList}>
                <li>Networkless by default, with model/tool calls brokered</li>
                <li>API keys stay outside the runtime and out of prompts</li>
                <li>Least-privilege toolsets and staged access by workflow phase</li>
                <li>Clear trust boundaries + a lightweight threat model</li>
              </ul>
            </div>
            <p className={styles.bodyTextMuted}>
              This is the difference between “the agent promised not to” and “the system made it structurally impossible.”
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Durability Makes Human-in-the-Loop Real</h2>
            <p className={styles.bodyText}>
              Approvals aren’t just UX - they’re a security primitive. But they only scale when the workflow can pause, checkpoint, and resume later without
              keeping a process alive.
            </p>
            <p className={styles.bodyTextMuted}>
              That’s why durability shows up as a first-class concern: long-running workflows, staged access to tools, and “review before irreversible actions” can
              be the default instead of a fragile convention.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Where to Go Next</h2>
            <ul className={styles.linkList}>
              <li>
                <Link to="/guardrails/">Guardrails</Link>: sandboxing, least privilege, and enforceable boundaries
              </li>
              <li>
                <Link to="/ai-engineers-toolbox/">The AI Engineer’s Toolbox</Link>: schema-first tools, inspectable calls, staged access
              </li>
              <li>
                <Link to="/validation/">Validation</Link>: contracts at the procedure boundary
              </li>
              <li>
                <Link to="/specifications/">Behavior specifications</Link>: invariants, regression protection, vanishing features
              </li>
              <li>
                <Link to="/evaluations/">Evaluations</Link>: reliability over datasets, drift detection, measurable quality
              </li>
            </ul>
          </div>
        </section>

        <BottomCta
          title="Ready to build with guardrails?"
          text="Start with getting a procedure running, then add validation, specs, and evals as you iterate."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Guiding Principles"
    description="Tactus is an opinionated system: principles like shift-left validation, inline behavior specs, and evaluations that close the loop on agent reliability."
  />
)

export default GuidingPrinciplesPage
