import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import {
  ApprovalPanel,
  HITLInputsPanel,
  ThemeProvider,
} from "@anthus/tactus-hitl-components"
import AnimatedHumanInTheLoopDiagram from "../../components/diagrams/AnimatedHumanInTheLoopDiagram"
import SidecarChatDiagram from "../../components/diagrams/SidecarChatDiagram"
import { HITL_PRESETS } from "../../components/diagrams/hitlPresets"
import {
  Conversation,
  ConversationContent,
} from "../../components/ai-elements/conversation"
import {
  Message,
  MessageContent,
  MessageResponse,
} from "../../components/ai-elements/message"
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "../../components/ai-elements/chain-of-thought"
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "../../components/ai-elements/tool"
import "@anthus/tactus-hitl-components/styles.css"
import * as chatStyles from "./copilot-anything.module.css"

/**
 * Keep the embedded HITL components in sync with the site's light/dark mode.
 * Gatsby SSR-safe (window access only in effect).
 */
function usePreferredTheme() {
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
  request_id: "req_2471",
  procedure_id: "acme-copilot",
  procedure_name: "Acme Copilot",
  invocation_id: "inv_92a1",
  subject: "Acme Copilot",
  elapsed_seconds: 42,
  input_summary: {
    channel: "in-app-chat",
    user: "Sam",
  },
}

const CopilotAnythingUseCasePage = () => {
  const systemTheme = usePreferredTheme()

  return (
    <Layout fullWidth={true}>
      <ThemeProvider defaultTheme={systemTheme}>
        <div className={chatStyles.page}>
          <section className={chatStyles.section}>
            <div className={chatStyles.container}>
              <p className={chatStyles.eyebrow}>Use Case</p>
              <h1 className={chatStyles.title}>A copilot for anything</h1>
              <p className={chatStyles.lede}>
                Embed Tactus agents inside your app: a chat UI, real tools, and
                explicit human checkpoints when the agent is about to do
                something that matters.
              </p>
              <p className={chatStyles.ledeMuted}>
                This walkthrough focuses on two Human-in-the-Loop interactions:
                an approval before side effects, and a structured inputs form
                when the agent needs missing details.
              </p>
            </div>
          </section>

          <section className={chatStyles.section} style={{ paddingTop: 0 }}>
            <div className={chatStyles.containerWide}>
              <div
                className={chatStyles.chatShell}
                aria-label="Copilot chat demo"
              >
                <div className={chatStyles.chatHeader}>
                  <div className={chatStyles.chatTitle}>Acme Copilot</div>
                  <div className={chatStyles.chatMeta}>
                    Chat UI + Tactus runtime + HITL components
                  </div>
                </div>

                <Conversation>
                  <ConversationContent
                    className={chatStyles.chatLog}
                    scrollClassName={chatStyles.chatScroll}
                  >
                    <Message from="assistant">
                      <MessageContent>
                        <MessageResponse from="assistant">
                          I can help you draft responses, look up context via
                          tools, and propose actions. You stay in control of
                          side effects.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="user">
                      <MessageContent>
                        <MessageResponse from="user">
                          Draft a short reply to the customer and send it.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent>
                        <MessageResponse from="assistant">
                          Here’s a draft. Before I send anything, I’ll ask for
                          an explicit approval.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent>
                        <ApprovalPanel
                          request={{
                            ...baseRequest,
                            request_type: "approval",
                            message:
                              "Send this reply to the customer? (Tool: send_email)",
                            options: [
                              {
                                label: "Send",
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
                              artifact_type: "email",
                              artifact:
                                "Thanks for reaching out — we can replace the item and waive shipping. If you confirm the order number, I’ll get it started.",
                            },
                          }}
                          onRespond={() => {}}
                          showContext={false}
                        />
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent className={chatStyles.assistantFullWidth}>
                        <ChainOfThought defaultOpen={false}>
                          <ChainOfThoughtHeader>
                            Agent reasoning
                          </ChainOfThoughtHeader>
                          <ChainOfThoughtContent>
                            <ChainOfThoughtStep
                              label="Approval received"
                              status="complete"
                            >
                              The human approved sending the reply to the
                              customer.
                            </ChainOfThoughtStep>
                          </ChainOfThoughtContent>
                        </ChainOfThought>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent className={chatStyles.assistantFullWidth}>
                        <Tool defaultOpen={false}>
                          <ToolHeader
                            title="send_email"
                            type="tool-send_email"
                            state="output-available"
                          />
                          <ToolContent>
                            <ToolInput
                              input={{
                                to: "customer@acme.com",
                                subject: "Replacement order confirmation",
                                body: "Thanks for reaching out — we can replace the item and waive shipping. If you confirm the order number, I’ll get it started.",
                              }}
                            />
                            <ToolOutput
                              output={{
                                status: "sent",
                                message_id: "msg_4810",
                              }}
                            />
                          </ToolContent>
                        </Tool>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent className={chatStyles.assistantFullWidth}>
                        <MessageResponse from="assistant">
                          Done. Next, I can open a replacement ticket — I just
                          need two details.
                        </MessageResponse>
                      </MessageContent>
                    </Message>

                    <Message from="assistant">
                      <MessageContent>
                        <HITLInputsPanel
                          request={{
                            ...baseRequest,
                            request_type: "inputs",
                            message:
                              "Create a replacement ticket (Tool: create_ticket)",
                            items: [
                              {
                                item_id: "order_id",
                                label: "Order ID",
                                request_type: "input",
                                message: "What is the order number?",
                                required: true,
                                metadata: { placeholder: "e.g., 104829" },
                              },
                              {
                                item_id: "priority",
                                label: "Priority",
                                request_type: "select",
                                message: "How urgent is this?",
                                required: true,
                                options: [
                                  { label: "Low", value: "low" },
                                  { label: "Normal", value: "normal" },
                                  { label: "High", value: "high" },
                                ],
                                metadata: {
                                  mode: "single",
                                  style: "radio",
                                },
                              },
                            ],
                          }}
                          onRespond={() => {}}
                          showContext={false}
                        />
                      </MessageContent>
                    </Message>
                  </ConversationContent>
                </Conversation>

                <div className={chatStyles.chatFooter}>
                  <div className={chatStyles.footerHint}>
                    These are the same components used by the{" "}
                    <Link to="/download/">Tactus IDE</Link> and documented in{" "}
                    <Link to="/resources/components/">
                      Resources → Components
                    </Link>
                    .
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={chatStyles.section}>
            <div className={chatStyles.container}>
              <h2 className={chatStyles.sectionTitle}>
                What this unlocks in your application
              </h2>
              <ul className={chatStyles.bullets}>
                <li>
                  A familiar chat surface for users (copilot UX), backed by a
                  real procedure with tools and guardrails.
                </li>
                <li>
                  Asynchronous human-in-the-loop: the agent can run
                  independently, then pause to ask for a decision only when it
                  hits a checkpoint (approval, missing input, high-risk side
                  effect).
                </li>
                <li>
                  Centralized control over where the agent is allowed to act,
                  what it can call, and when a human must confirm.
                </li>
              </ul>

              <h3 className={chatStyles.subsectionTitle}>
                Architecture: Sidecar Chat
              </h3>
              <div className={chatStyles.diagramBlock}>
                <SidecarChatDiagram />
              </div>

              <h3 className={chatStyles.subsectionTitle}>
                Chat UI + async queued HITL
              </h3>
              <p
                className={chatStyles.ledeMuted}
                style={{ marginBottom: "var(--space-4)" }}
              >
                A copilot is more than “AI chat in your app.” You get the chat
                surface, plus an asynchronous interface paradigm: the agent can
                run on its own and only ask for human input at the moments that
                matter. Those requests queue up and the workflow resumes the
                moment the human responds.
              </p>

              <div className={chatStyles.diagramGrid} aria-label="HITL interface patterns">
                <div className={chatStyles.diagramCard}>
                  <div className={chatStyles.diagramTitle}>Closely supervised</div>
                  <div className={chatStyles.diagramBody}>
                    The chat surface. Great when a human is present to steer and
                    supervise each step.
                  </div>
                  <AnimatedHumanInTheLoopDiagram
                    scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
                    config={{
                      ...HITL_PRESETS.CLOSELY_SUPERVISED.config,
                      stepBackAfterItems: 1,
                      outageDuration: 8000,
                    }}
                    startAtMs={HITL_PRESETS.CLOSELY_SUPERVISED.recommendedStartAtMs}
                  />
                </div>
                <div className={chatStyles.diagramCard}>
                  <div className={chatStyles.diagramTitle}>Asynchronous queued HITL</div>
                  <div className={chatStyles.diagramBody}>
                    The unlock. The agent runs independently and queues
                    approvals/inputs when needed, so throughput isn't gated on
                    constant supervision.
                  </div>
                  <AnimatedHumanInTheLoopDiagram
                    scenario={HITL_PRESETS.HUMAN_STEPS_BACK.scenario}
                    config={HITL_PRESETS.HUMAN_STEPS_BACK.config}
                    startAtMs={HITL_PRESETS.HUMAN_STEPS_BACK.recommendedStartAtMs}
                  />
                </div>
              </div>

              <div className={chatStyles.noteCard}>
                <div className={chatStyles.noteTitle}>Where to start</div>
                <p className={chatStyles.noteBody}>
                  Use the IDE to play with these interactions quickly, then
                  embed the same components in your app when you are ready.
                </p>
                <div className={chatStyles.noteLinks}>
                  <Link
                    to="/getting-started/projects/"
                    className={chatStyles.primaryLink}
                  >
                    Projects: build a copilot UI
                  </Link>
                  <Link
                    to="/resources/components/"
                    className={chatStyles.secondaryLink}
                  >
                    HITL component docs
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <BottomCta
            title="Want runnable procedures too?"
            text="Use cases show the UX and the guardrails. Examples give you runnable code with embedded specs."
            buttonLabel="Browse examples"
            to="/examples/"
          />
        </div>
      </ThemeProvider>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="A copilot for anything"
    description="Embed Tactus agents in any application: chat UX, tools, and Human-in-the-Loop interactions using the standard HITL component library."
  />
)

export default CopilotAnythingUseCasePage
