import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import Breakout from "../components/publishing/Breakout"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import AnimatedHumanInTheLoopDiagram from "../components/diagrams/AnimatedHumanInTheLoopDiagram"
import { HITL_PRESETS } from "../components/diagrams/hitlPresets"
import * as styles from "./human-in-the-loop.module.css"

const APPROVE_CODE = `local approved, timed_out = Human.approve({
  message = "Deploy to production?",
  timeout = 3600,
  default = false,
})

if approved then
  deploy()
end`

const HumanInTheLoopPage = () => {
  return (
    <Layout fullWidth={true}>
      <Seo title="Human in the Loop" />
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Human in the loop</p>
              <h1 className={styles.title}>Durable HITL Workflows</h1>
              <p className={styles.lede}>
                Human-in-the-loop is where agent workflows stop being demos and start being trustworthy systems. In Tactus, HITL is
                not a framework convention — it’s a language primitive backed by runtime infrastructure.
              </p>
            </div>

            <nav className={styles.toc} aria-label="Table of contents">
              <h2 className={styles.tocTitle}>Contents</h2>
              <ol className={styles.tocList}>
                <li>
                  <a href="#why">Why HITL matters</a>
                </li>
                <li>
                  <a href="#patterns">Two HITL patterns: approve vs return</a>
                </li>
                <li>
                  <a href="#durability">Durable suspend points</a>
                </li>
                <li>
                  <a href="#real-world">When humans are busy</a>
                </li>
                <li>
                  <a href="#testing">Testing and reliability</a>
                </li>
              </ol>
            </nav>
          </div>
        </section>

        <section id="why" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why HITL matters</h2>

            <p className={styles.bodyText}>
              Agentic programming is fundamentally about yielding control flow to a model: the agent decides what tool to call next,
              when to ask questions, and when it’s done. That’s powerful — and it’s also why “hope for the best” stops being an option
              once the agent can take real actions.
            </p>

            <p className={styles.bodyTextMuted}>
              HITL is how you keep humans in charge at the moments that matter: approving irreversible actions, correcting mistakes,
              and steering a procedure back on track without hovering over the run in real time.
            </p>

            <Breakout title="HITL is not a UX detail" withContainer={false}>
              <p>
                It’s an operational primitive. If you want to delegate meaningful work, you need a place for the workflow to{" "}
                <strong>pause</strong>, wait for a decision, and then <strong>resume</strong> — reliably.
              </p>
            </Breakout>
          </div>
        </section>

        <section id="patterns" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Two HITL patterns: approve vs return</h2>
            <p className={styles.bodyText}>
              HITL isn’t just “ask the user a question.” In practice, there are two common patterns:
            </p>
            <p className={styles.bodyTextMuted}>
              <strong>Approval gates</strong> are yes/no checkpoints before risky actions. <strong>Return loops</strong> let a human
              send an artifact back for edits — and the procedure keeps going with the revised version.
            </p>

            <h3 className={styles.subsectionTitle}>Approval gate (human approves)</h3>
            <div className={styles.diagramWrap}>
              <AnimatedHumanInTheLoopDiagram
                scenario={HITL_PRESETS.APPROVES_ALL.scenario}
                config={HITL_PRESETS.APPROVES_ALL.config}
                className={styles.diagram}
              />
            </div>

            <h3 className={styles.subsectionTitle}>Return loop (human returns for edits)</h3>
            <div className={styles.diagramWrap}>
              <AnimatedHumanInTheLoopDiagram
                scenario={HITL_PRESETS.RETURNS_ALL.scenario}
                config={HITL_PRESETS.RETURNS_ALL.config}
                className={styles.diagram}
              />
            </div>

            <p className={styles.bodyTextMuted}>
              The key point isn’t the icons — it’s the shape of the workflow. When this is not built into the language/runtime, you
              end up recreating a state machine in Python: persist state, build queues, handle timeouts, resume idempotently, and
              reconcile edits. Tactus makes this pattern explicit and durable by default.
            </p>
          </div>
        </section>

        <section id="durability" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Durable suspend points</h2>

            <p className={styles.bodyText}>
              The reason HITL works in production is durability. When a procedure reaches a HITL call, it can suspend indefinitely
              without keeping a process alive. That means no wasted compute while waiting — and no fragile “hold this server open”
              hacks.
            </p>

            <p className={styles.bodyTextMuted}>
              You can also set timeouts and defaults so the procedure has a deterministic outcome when a human doesn’t respond in
              time.
            </p>

            <div className={styles.codeEmbed}>
              <AnimatedCodeBlock
                label="Human approval"
                code={APPROVE_CODE}
                language="tactus"
                filename="examples-approval.tac"
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
        </section>

        <section id="real-world" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>When humans are busy</h2>

            <p className={styles.bodyText}>
              Real systems have real constraints: people go offline, review queues grow, and the agent loop can outrun your ability
              to supervise. HITL infrastructure has to make these failure modes visible and survivable.
            </p>

            <h3 className={styles.subsectionTitle}>Backlogs (work arrives faster than it’s reviewed)</h3>
            <div className={styles.diagramWrap}>
              <AnimatedHumanInTheLoopDiagram scenario="backlog" className={styles.diagram} />
            </div>

            <h3 className={styles.subsectionTitle}>A human steps back (temporary outage)</h3>
            <div className={styles.diagramWrap}>
              <AnimatedHumanInTheLoopDiagram scenario="steps_back" className={styles.diagram} />
            </div>

            <h3 className={styles.subsectionTitle}>Capacity limits (too many concurrent runs)</h3>
            <div className={styles.diagramWrap}>
              <AnimatedHumanInTheLoopDiagram scenario="low_capacity" className={styles.diagram} />
            </div>
          </div>
        </section>

        <section id="testing" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Testing and reliability</h2>

            <p className={styles.bodyText}>
              A HITL workflow you can’t test is a workflow you can’t trust. Tactus treats HITL points as structured events, which
              makes them easy to mock in tests and measure in evaluations.
            </p>

            <p className={styles.bodyTextMuted}>
              This is the recurring theme: the language expresses what the procedure needs, and the runtime makes it operable —
              durable checkpoints, repeatable runs, and a clear audit trail of what happened and why.
            </p>
          </div>
        </section>

        <BottomCta
          to="/getting-started/"
          title="Ready to start building?"
          description="Follow a short walkthrough and run your first procedure."
        />
      </div>
    </Layout>
  )
}

export default HumanInTheLoopPage
