import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import Breakout from "../components/publishing/Breakout"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import AnimatedHumanInTheLoopDiagram from "../components/diagrams/AnimatedHumanInTheLoopDiagram"
import { HITL_PRESETS } from "../components/diagrams/hitlPresets"
import {
  ApprovalPanel,
  ReviewPanel,
  ThemeProvider,
} from "@anthus/tactus-hitl-components"
import {
  Conversation,
  ConversationContent,
} from "../components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "../components/ai-elements/message"
import "@anthus/tactus-hitl-components/styles.css"
import * as styles from "./human-in-the-loop.module.css"

const APPROVE_CODE = `local approved, timed_out = Human.approve({
  message = "Deploy to production?",
  timeout = 3600,
  default = false,
})

if approved then
  deploy()
end`

/**
 * Keep embedded HITL components in sync with the site's light/dark mode.
 * Gatsby SSR-safe (window access only in effect).
 */
const usePreferredTheme = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

const baseRequest = {
  request_id: "req_901",
  procedure_id: "ops-copilot",
  procedure_name: "Ops Copilot",
  invocation_id: "inv_4b12",
  subject: "Production",
  elapsed_seconds: 87,
  input_summary: {
    channel: "in-app-chat",
    user: "Alex",
  },
}

const HumanInTheLoopPage = () => {
  const systemTheme = usePreferredTheme()

  return (
    <Layout fullWidth={true}>
      <Seo title="Human in the Loop" />
      <ThemeProvider defaultTheme={systemTheme}>
        <div className={styles.page}>
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.hero}>
                <p className={styles.eyebrow}>Human in the loop</p>
                <h1 className={styles.title}>Durable HITL Workflows</h1>
                <p className={styles.lede}>
                  Human-in-the-loop is where agent workflows stop being demos
                  and start being trustworthy systems. In Tactus, HITL is not a
                  framework convention — it’s a language primitive backed by
                  runtime infrastructure.
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

          <section id="why" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Why HITL matters</h2>

              <p className={styles.bodyText}>
                Agentic programming is fundamentally about yielding control flow
                to a model: the agent decides what tool to call next, when to
                ask questions, and when it’s done. That’s powerful — and it’s
                also why “hope for the best” stops being an option once the
                agent can take real actions.
              </p>

              <p className={styles.bodyTextMuted}>
                HITL is how you keep humans in charge at the moments that
                matter: approving irreversible actions, correcting mistakes, and
                steering a procedure back on track without hovering over the run
                in real time.
              </p>

              <Breakout title="HITL is not a UX detail" withContainer={false}>
                <p>
                  It’s an operational primitive. If you want to delegate
                  meaningful work, you need a place for the workflow to{" "}
                  <strong>pause</strong>, wait for a decision, and then{" "}
                  <strong>resume</strong> — reliably.
                </p>
              </Breakout>
            </div>
          </section>

          <section id="patterns" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>
                Two HITL patterns: approve vs return
              </h2>
              <p className={styles.bodyText}>
                HITL isn’t just “ask the user a question.” In practice, there
                are two common patterns:
              </p>
              <p className={styles.bodyTextMuted}>
                <strong>Approval gates</strong> are yes/no checkpoints before
                risky actions. <strong>Return loops</strong> let a human send an
                artifact back for edits — and the procedure keeps going with the
                revised version.
              </p>

              <h3 className={styles.subsectionTitle}>
                What it looks like in a copilot UI
              </h3>
              <div className={styles.chatShell} aria-label="HITL chat demo">
                <div className={styles.chatHeader}>
                  <div className={styles.chatTitle}>Ops Copilot</div>
                  <div className={styles.chatMeta}>
                    Agent runs until it hits a checkpoint.
                  </div>
                </div>
                <Conversation>
                  <ConversationContent
                    className={styles.chatLog}
                    scrollClassName={styles.chatScroll}
                  >
                    <Message from="assistant">
                      <MessageContent>
                        <MessageResponse from="assistant">
                          Tell me what you want to do. I'll propose an action
                          and ask for approval before any side effects.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="user">
                      <MessageContent>
                        <MessageResponse from="user">
                          Schedule the database migration for tonight.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent>
                        <MessageResponse from="assistant">
                          I'm ready to schedule it. Please confirm the window
                          before I proceed.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent className={styles.fullWidthMessage}>
                        <ApprovalPanel
                          request={{
                            ...baseRequest,
                            request_type: "approval",
                            message:
                              "Schedule the migration window? (Tool: schedule_migration)",
                            options: [
                              {
                                label: "Approve",
                                value: true,
                                style: "primary",
                              },
                              {
                                label: "Cancel",
                                value: false,
                                style: "secondary",
                              },
                            ],
                            metadata: {
                              artifact_type: "plan",
                              artifact:
                                "Schedule: 2:00–2:30am UTC. Notify on-call, lock writes, run migration, verify, unlock writes.",
                            },
                          }}
                          onRespond={() => {}}
                          showContext={false}
                        />
                      </MessageContent>
                    </Message>
                  </ConversationContent>
                </Conversation>
                <div className={styles.chatFooter}>
                  <div className={styles.footerHint}>
                    These are the same HITL components used by the{" "}
                    <Link to="/download/">Tactus IDE</Link> and documented in{" "}
                    <Link to="/resources/components/">
                      Resources → Components
                    </Link>
                    .
                  </div>
                </div>
              </div>

              <h3 className={styles.subsectionTitle}>Return loop (human edits)</h3>
              <p className={styles.bodyTextMuted}>
                Return loops show up when the agent produces an artifact (an
                email, a ticket, a plan) and the human wants to revise it before
                the workflow continues.
              </p>

              <div className={styles.componentBlock}>
                <ReviewPanel
                  request={{
                    ...baseRequest,
                    request_type: "review",
                    message: "Review the rollout announcement before sending",
                    options: [
                      { label: "Send", value: "send", style: "primary" },
                      {
                        label: "Return for edits",
                        value: "return",
                        style: "secondary",
                      },
                    ],
                    metadata: {
                      artifact_type: "message",
                      artifact:
                        "Heads up: we will run a database migration tonight at 2:00am UTC. Expect brief write locks. We'll update when complete.",
                    },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
              </div>

              <h3 className={styles.subsectionTitle}>
                Interface patterns: supervised vs queued
              </h3>
              <p className={styles.bodyText}>
                In a chat UI, agents feel safe because you supervise every step.
                But that same tight loop becomes a bottleneck in production:
                when the human isn’t present, nothing progresses.
              </p>
              <p className={styles.bodyTextMuted}>
                The alternative is <strong>asynchronous</strong> HITL: the agent
                runs independently, and only pauses when it needs a decision.
                Requests queue up, and runs resume the moment the human
                responds.
              </p>

              <h4 className={styles.subsectionTitle}>
                Closely supervised (chat-only autonomy)
              </h4>
              <div className={styles.diagramWrap}>
                <AnimatedHumanInTheLoopDiagram
                  scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
                  config={{
                    ...HITL_PRESETS.CLOSELY_SUPERVISED.config,
                    stepBackAfterItems: 1,
                    outageDuration: 8000,
                  }}
                  className={styles.diagram}
                />
              </div>

              <h4 className={styles.subsectionTitle}>
                Asynchronous queued HITL (high throughput)
              </h4>
              <div className={styles.diagramWrap}>
                <AnimatedHumanInTheLoopDiagram
                  scenario={HITL_PRESETS.HUMAN_STEPS_BACK.scenario}
                  config={HITL_PRESETS.HUMAN_STEPS_BACK.config}
                  className={styles.diagram}
                />
              </div>

              <p className={styles.bodyTextMuted}>
                The key point isn’t the icons — it’s the shape of the workflow.
                When this is not built into the language/runtime, you end up
                recreating a state machine in Python: persist state, build
                queues, handle timeouts, resume idempotently, and reconcile
                edits. Tactus makes this pattern explicit and durable by
                default.
              </p>
            </div>
          </section>

          <section id="durability" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Durable suspend points</h2>

              <p className={styles.bodyText}>
                The reason HITL works in production is durability. When a
                procedure reaches a HITL call, it can suspend indefinitely
                without keeping a process alive. That means no wasted compute
                while waiting — and no fragile “hold this server open” hacks.
              </p>

              <p className={styles.bodyTextMuted}>
                You can also set timeouts and defaults so the procedure has a
                deterministic outcome when a human doesn’t respond in time.
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
                Real systems have real constraints: people go offline, review
                queues grow, and the agent loop can outrun your ability to
                supervise. HITL infrastructure has to make these failure modes
                visible and survivable.
              </p>

              <h3 className={styles.subsectionTitle}>
                Backlogs (work arrives faster than it’s reviewed)
              </h3>
              <p className={styles.bodyTextMuted}>
                Queues are not a bug — they’re the mechanism. They let the agent
                keep doing safe work while human attention is scarce, then
                quickly drain the backlog when reviewers return.
              </p>
              <div className={styles.diagramWrap}>
                <AnimatedHumanInTheLoopDiagram
                  scenario="backlog"
                  className={styles.diagram}
                />
              </div>

            </div>
          </section>

          <section id="testing" className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Testing and reliability</h2>

              <p className={styles.bodyText}>
                A HITL workflow you can’t test is a workflow you can’t trust.
                Tactus treats HITL points as structured events, which makes them
                easy to mock in tests and measure in evaluations.
              </p>

              <p className={styles.bodyTextMuted}>
                This is the recurring theme: the language expresses what the
                procedure needs, and the runtime makes it operable — durable
                checkpoints, repeatable runs, and a clear audit trail of what
                happened and why.
              </p>

              <h3 className={styles.subsectionTitle}>Runnable examples</h3>
              <p className={styles.bodyText}>
                Want to see full procedures that use HITL primitives? Start
                with the <Link to="/examples/human-in-the-loop/">Human-in-the-Loop examples</Link>{" "}
                chapter, or jump straight into{" "}
                <Link to="/examples/human-in-the-loop/basic-hitl/">Basic HITL</Link>{" "}
                and{" "}
                <Link to="/examples/human-in-the-loop/agent-driven-approval/">
                  Agent-driven approval
                </Link>
                .
              </p>
            </div>
          </section>

          <BottomCta
            to="/getting-started/"
            title="Ready to start building?"
            description="Follow a short walkthrough and run your first procedure."
          />
        </div>
      </ThemeProvider>
    </Layout>
  )
}

export default HumanInTheLoopPage
