import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import {
  ApprovalPanel,
  HITLInputsPanel,
  ThemeProvider,
} from "@anthus/tactus-hitl-components"
import "@anthus/tactus-hitl-components/styles.css"
import * as styles from "./projects.module.css"

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
  request_id: "req_projects_01",
  procedure_id: "copilot-project",
  procedure_name: "Copilot Project",
  invocation_id: "inv_projects_01",
  subject: "Copilot Project",
  elapsed_seconds: 0,
  input_summary: {
    app: "Your product",
  },
}

const GettingStartedProjectsPage = () => {
  const systemTheme = usePreferredTheme()

  return (
    <Layout fullWidth={true}>
      <ThemeProvider defaultTheme={systemTheme}>
        <div className={styles.page}>
          <section className={styles.section}>
            <div className={styles.container}>
              <p className={styles.eyebrow}>Getting Started</p>
              <h1 className={styles.title}>Projects to try</h1>
              <p className={styles.lede}>
                A practical way to learn Tactus is to pick a concrete project and
                build a tiny end-to-end loop: chat UI, tools, and a couple of
                human checkpoints.
              </p>

              <div className={styles.callout}>
                <div className={styles.calloutTitle}>Use the IDE to explore</div>
                <p className={styles.calloutBody}>
                  The <Link to="/download/">Tactus IDE</Link> includes the standard
                  Human-in-the-Loop components. Use the IDE to experience the
                  interactions quickly, then embed the same components in your
                  own app when you are ready.
                </p>
                <p className={styles.calloutBody}>
                  Component reference:{" "}
                  <Link to="/resources/components/">
                    Resources → Standard Component Library
                  </Link>
                </p>
              </div>
            </div>
          </section>

          <section className={styles.sectionMuted}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>
                Project: embed a copilot in your app
              </h2>
              <p className={styles.body}>
                Imagine a chat-based copilot inside your product. It can call your
                tools to propose changes and drafts, but it pauses for explicit
                human confirmation at the seams where mistakes are costly.
              </p>

              <div className={styles.grid}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>Checkpoint 1: approve side effects</div>
                    <div className={styles.cardKicker}>
                      “I’m about to call a tool that changes the world.”
                    </div>
                  </div>
                  <ApprovalPanel
                    request={{
                      ...baseRequest,
                      request_type: "approval",
                      message: "Approve publishing this change? (Tool: publish_release)",
                      options: [
                        { label: "Publish", value: true, style: "primary" },
                        { label: "Hold", value: false, style: "secondary" },
                      ],
                      metadata: {
                        artifact_type: "release_note",
                        artifact:
                          "Release v0.1.1: Improve onboarding copy and add a new copilot use case page.",
                      },
                    }}
                    onRespond={() => {}}
                    showContext={false}
                  />
                </div>

                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      Checkpoint 2: collect missing details
                    </div>
                    <div className={styles.cardKicker}>
                      “I can do it, but I need two fields from you.”
                    </div>
                  </div>
                  <HITLInputsPanel
                    request={{
                      ...baseRequest,
                      request_type: "inputs",
                      message: "Fill in the last details (Tool: create_task)",
                      items: [
                        {
                          item_id: "title",
                          label: "Task title",
                          request_type: "input",
                          message: "Give this task a short title",
                          required: true,
                          metadata: { placeholder: "e.g., Update help center article" },
                        },
                        {
                          item_id: "owner",
                          label: "Owner",
                          request_type: "select",
                          message: "Who should own this?",
                          required: true,
                          options: [
                            { label: "Support", value: "support" },
                            { label: "Engineering", value: "engineering" },
                            { label: "Sales", value: "sales" },
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

              <div className={styles.linksRow}>
                <Link to="/use-cases/copilot-anything/" className={styles.primaryLink}>
                  Read the copilot use case
                </Link>
                <Link to="/use-cases/" className={styles.secondaryLink}>
                  Browse use cases
                </Link>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Next steps</h2>
              <ul className={styles.bullets}>
                <li>
                  Start from a runnable example: <Link to="/examples/">browse examples</Link>
                </li>
                <li>
                  Read the use case for the UX story:{" "}
                  <Link to="/use-cases/copilot-anything/">A copilot for anything</Link>
                </li>
                <li>
                  Embed the components directly in your app:{" "}
                  <a
                    href="https://github.com/AnthusAI/Tactus-HITL-components"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Tactus-HITL-components on GitHub
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </ThemeProvider>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Projects to try"
    description="Getting started projects: embed a copilot in your app and explore Human-in-the-Loop interactions using the Tactus IDE and component library."
  />
)

export default GettingStartedProjectsPage
