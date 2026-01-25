import * as React from "react"
import { Github } from "lucide-react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import {
  ApprovalPanel,
  EscalationAlert,
  FileUpload,
  HITLInputsPanel,
  ReviewPanel,
  SelectMultiple,
  SelectSingle,
  TextInput,
  ThemeProvider,
} from "@anthus/tactus-hitl-components"
import "@anthus/tactus-hitl-components/styles.css"
import * as styles from "./components.module.css"

/**
 * Hook to detect system theme preference (light/dark)
 * Syncs with the system's prefers-color-scheme setting
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
  request_id: "req_123",
  procedure_id: "customer-intake",
  procedure_name: "Customer Intake",
  invocation_id: "inv_456",
  subject: "John Doe",
  elapsed_seconds: 120,
  input_summary: {
    customer_name: "John Doe",
    request_type: "Support",
  },
}

const ResourcesComponentsPage = () => {
  const systemTheme = usePreferredTheme()

  return (
    <Layout fullWidth={true}>
      <ThemeProvider defaultTheme={systemTheme}>
        <div className={styles.page}>
          <section className={styles.section}>
            <div className={styles.container}>
              <div className={styles.hero}>
                <p className={styles.eyebrow}>Resources</p>
                <h1 className={styles.title}>Standard Component Library</h1>
                <p className={styles.lede}>
                  The Tactus component library provides a consistent set of
                  Human-in-the-Loop UI primitives for approvals, inputs,
                  reviews, and batched forms. Use these in host applications to
                  keep HITL experiences predictable and on-brand while staying
                  aligned with the Tactus runtime.
                </p>
              </div>

              <div className={styles.cardGrid}>
                <a
                  href="https://github.com/AnthusAI/Tactus-HITL-components"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  <div className={styles.cardHeader}>
                    <p className={styles.cardTitle}>
                      <Github
                        size={20}
                        style={{
                          marginRight: "0.5rem",
                          verticalAlign: "middle",
                        }}
                      />
                      Component library on GitHub
                    </p>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardText}>
                      Browse the source, run Storybook, and integrate the
                      standard HITL UI components into your own applications.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </section>

          <section className={styles.sectionAlt}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Approvals and Escalations</h2>
              <div className={`${styles.demoGrid}`}>
                <ApprovalPanel
                  request={{
                    ...baseRequest,
                    request_type: "approval",
                    message: "Approve the proposed response?",
                    options: [
                      { label: "Approve", value: true, style: "primary" },
                      { label: "Reject", value: false, style: "danger" },
                    ],
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
                <EscalationAlert
                  request={{
                    ...baseRequest,
                    request_type: "escalation",
                    message: "Manual intervention required",
                    metadata: {
                      severity: "warning",
                      context: {
                        reason: "Ambiguous policy exception",
                        attempts: 2,
                      },
                    },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Inputs and Selection</h2>
              <div className={`${styles.demoGrid}`}>
                <TextInput
                  request={{
                    ...baseRequest,
                    request_type: "input",
                    message: "Capture a short reason for the decision",
                    metadata: {
                      placeholder: "Add a note for the audit log...",
                    },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
                <SelectSingle
                  request={{
                    ...baseRequest,
                    request_type: "select",
                    message: "Choose a deployment target",
                    options: [
                      { label: "Development", value: "dev" },
                      { label: "Staging", value: "staging" },
                      { label: "Production", value: "prod", style: "danger" },
                    ],
                    metadata: { mode: "single", style: "radio" },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
                <SelectMultiple
                  request={{
                    ...baseRequest,
                    request_type: "select",
                    message: "Select features to enable",
                    options: [
                      { label: "Analytics", value: "analytics" },
                      { label: "Notifications", value: "notifications" },
                      { label: "Export", value: "export" },
                    ],
                    metadata: { mode: "multiple", min: 1, max: 2 },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
              </div>
            </div>
          </section>

          <section className={styles.sectionAlt}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Reviews and Uploads</h2>
              <div className={`${styles.demoGrid}`}>
                <ReviewPanel
                  request={{
                    ...baseRequest,
                    request_type: "review",
                    message: "Review the draft response",
                    options: [
                      {
                        label: "Approve",
                        value: "approve",
                        style: "primary",
                      },
                      {
                        label: "Request changes",
                        value: "changes",
                        style: "secondary",
                      },
                      { label: "Reject", value: "reject", style: "danger" },
                    ],
                    metadata: {
                      artifact_type: "document",
                      artifact:
                        "Thank you for reaching out. We can offer a partial refund and expedited shipping on your replacement item.",
                    },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
                <FileUpload
                  request={{
                    ...baseRequest,
                    request_type: "upload",
                    message: "Upload supporting documents",
                    metadata: {
                      accept: [".pdf", ".docx"],
                      max_size: 10 * 1024 * 1024,
                      multiple: true,
                    },
                  }}
                  onRespond={() => {}}
                  showContext={false}
                />
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.container}>
              <h2 className={styles.sectionTitle}>Batched Forms</h2>
              <p className={styles.sectionBody}>
                Use batched inputs to collect multiple fields in one HITL
                interaction with tabbed navigation and validation.
              </p>
              <HITLInputsPanel
                request={{
                  ...baseRequest,
                  request_type: "inputs",
                  message: "Deployment checklist",
                  items: [
                    {
                      item_id: "target",
                      label: "Target",
                      request_type: "select",
                      message: "Choose target environment",
                      options: [
                        { label: "Dev", value: "dev" },
                        { label: "Staging", value: "staging" },
                        { label: "Prod", value: "prod" },
                      ],
                      metadata: { mode: "single", style: "radio" },
                      required: true,
                    },
                    {
                      item_id: "confirm",
                      label: "Confirm",
                      request_type: "approval",
                      message: "Confirm the rollout window",
                      required: true,
                    },
                    {
                      item_id: "notes",
                      label: "Notes",
                      request_type: "input",
                      message: "Deployment notes (optional)",
                      required: false,
                      metadata: {
                        placeholder: "Add notes...",
                        multiline: true,
                      },
                    },
                  ],
                }}
                onRespond={() => {}}
                showContext={false}
              />
            </div>
          </section>
        </div>
      </ThemeProvider>
    </Layout>
  )
}

export const Head = () => <Seo title="Standard Component Library" />

export default ResourcesComponentsPage
