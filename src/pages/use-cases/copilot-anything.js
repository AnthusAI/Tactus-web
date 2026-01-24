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

          <section className={chatStyles.sectionMuted}>
            <div className={chatStyles.containerWide}>
              <div className={chatStyles.chatShell} aria-label="Copilot chat demo">
                <div className={chatStyles.chatHeader}>
                  <div className={chatStyles.chatTitle}>Acme Copilot</div>
                  <div className={chatStyles.chatMeta}>
                    Chat UI + Tactus runtime + HITL components
                  </div>
                </div>

                <div className={chatStyles.chatLog}>
                  <div className={chatStyles.rowAssistant}>
                    <div className={chatStyles.bubbleAssistant}>
                      I can help you draft responses, look up context via tools,
                      and propose actions. You stay in control of side effects.
                    </div>
                  </div>

                  <div className={chatStyles.rowUser}>
                    <div className={chatStyles.bubbleUser}>
                      Draft a short reply to the customer and send it.
                    </div>
                  </div>

                  <div className={chatStyles.rowAssistant}>
                    <div className={chatStyles.bubbleAssistant}>
                      Here’s a draft. Before I send anything, I’ll ask for an
                      explicit approval.
                    </div>
                  </div>

                  <div className={chatStyles.rowAssistant}>
                    <div className={chatStyles.cardBubble}>
                      <div className={chatStyles.cardLabel}>HITL: approval</div>
                      <ApprovalPanel
                        request={{
                          ...baseRequest,
                          request_type: "approval",
                          message:
                            "Send this reply to the customer? (Tool: send_email)",
                          options: [
                            { label: "Send", value: true, style: "primary" },
                            { label: "Cancel", value: false, style: "secondary" },
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
                    </div>
                  </div>

                  <div className={chatStyles.rowUser}>
                    <div className={chatStyles.bubbleUser}>
                      Looks good. Send it.
                    </div>
                  </div>

                  <div className={chatStyles.rowAssistant}>
                    <div className={chatStyles.bubbleAssistant}>
                      Done. Next, I can open a replacement ticket — I just need
                      two details.
                    </div>
                  </div>

                  <div className={chatStyles.rowAssistant}>
                    <div className={chatStyles.cardBubble}>
                      <div className={chatStyles.cardLabel}>HITL: inputs</div>
                      <HITLInputsPanel
                        request={{
                          ...baseRequest,
                          request_type: "inputs",
                          message: "Create a replacement ticket (Tool: create_ticket)",
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
                              metadata: { mode: "single", style: "radio" },
                            },
                          ],
                        }}
                        onRespond={() => {}}
                        showContext={false}
                      />
                    </div>
                  </div>
                </div>

                <div className={chatStyles.chatFooter}>
                  <div className={chatStyles.footerHint}>
                    These are the same components used by the{" "}
                    <Link to="/download/">Tactus IDE</Link> and documented in{" "}
                    <Link to="/resources/components/">Resources → Components</Link>
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
                  A consistent Human-in-the-Loop experience: approvals,
                  structured inputs, and review surfaces that look the same in
                  the IDE and in your product.
                </li>
                <li>
                  Centralized control over where the agent is allowed to act,
                  what it can call, and when a human must confirm.
                </li>
              </ul>

              <div className={chatStyles.noteCard}>
                <div className={chatStyles.noteTitle}>Where to start</div>
                <p className={chatStyles.noteBody}>
                  Use the IDE to play with these interactions quickly, then
                  embed the same components in your app when you are ready.
                </p>
                <div className={chatStyles.noteLinks}>
                  <Link to="/getting-started/projects/" className={chatStyles.primaryLink}>
                    Projects: build a copilot UI
                  </Link>
                  <Link to="/resources/components/" className={chatStyles.secondaryLink}>
                    Component library docs
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
