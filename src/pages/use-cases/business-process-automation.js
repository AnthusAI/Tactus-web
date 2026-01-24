import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import * as styles from "./use-case.module.css"

const BUSINESS_PROCESS_AUTOMATION_SNIPPET = `-- Business Process Automation (SMB-friendly)
--
-- Pattern:
--   1) Normalize intake (email/chat/forms)
--   2) Classify into explicit workflow buckets
--   3) Return a structured "next action" plan
--   4) Add guardrails: validation + specs + evals

Procedure {
  input = {
    channel = field.string{required = true, description = "Where it came from: email | chat | form"},
    message = field.string{required = true, description = "Raw customer or internal message"}
  },
  output = {
    case = field.string{required = true, description = "One of: privacy_request, security_alert, billing_dispute, support, other"},
    priority = field.string{required = true, description = "One of: low, normal, high"},
    next_steps = field.string{required = true, description = "Short structured plan for a human or downstream agent"}
  },
  function(input)
    local classify_case = Classify {
      name = "bpa_router",
      method = "llm",
      classes = {"privacy_request", "security_alert", "billing_dispute", "support", "other"},
      prompt = [[
You triage operational requests for a small business.

Return only one label:
- privacy_request: GDPR/CCPA \"delete my data\", \"forget me\", \"data access request\"
- security_alert: suspicious login, phishing, compromise, ransomware, leaked credentials
- billing_dispute: invoice dispute, refund, chargeback, double charged
- support: regular product/service support
- other: anything else
]],
      model = "openai/gpt-4o-mini",
      temperature = 0,
      max_retries = 3
    }

    local classify_priority = Classify {
      name = "bpa_priority",
      method = "llm",
      classes = {"low", "normal", "high"},
      prompt = [[
Assign priority (low, normal, high) based on urgency and risk.
High for security incidents or regulatory deadlines.
Return only one label.
]],
      model = "openai/gpt-4o-mini",
      temperature = 0,
      max_retries = 3
    }

    local c = classify_case(input.message).value
    local p = classify_priority(input.message).value

    if c == "privacy_request" then
      return {
        case = c,
        priority = "high",
        next_steps = "Open a privacy case. Confirm identity. Record request type (delete/access). Locate systems of record. Start an evidence log. Prepare an approval before deleting anything."
      }
    end

    if c == "security_alert" then
      return {
        case = c,
        priority = "high",
        next_steps = "Open a security incident. Preserve logs. Identify affected accounts/systems. Rotate exposed credentials. Prepare a containment plan and request approval for disruptive actions."
      }
    end

    if c == "billing_dispute" then
      return {
        case = c,
        priority = p,
        next_steps = "Open a billing ticket. Gather invoice IDs and payment processor evidence. Propose a resolution (refund/credit/explain) and request approval before issuing credits."
      }
    end

    if c == "support" then
      return {
        case = c,
        priority = p,
        next_steps = "Route to support. Ask for missing context (order ID, account email, screenshots). Suggest troubleshooting steps from the runbook."
      }
    end

    return {case = "other", priority = "normal", next_steps = "Route to an operations inbox with a short summary and recommended owner."}
  end
}
`

const BusinessProcessAutomationUseCasePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Use Case</p>
              <h1 className={styles.title}>Business Process Automation</h1>
              <p className={styles.lede}>
                Automate the boring parts of operations without giving up
                control: intake, routing, checklists, documentation, and
                approvals — all as code.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>The “Tuesday” problem</h2>
            <p className={styles.bodyText}>
              A small business gets a steady stream of operational pings:
              “please refund this,” “delete my data,” “someone logged in from a
              weird location,” “why did the site go down,” “can you send an
              invoice copy.” None of it is intellectually hard — it’s hard
              because it’s constant, interrupt-driven, and full of rules that
              only exist in someone’s head.
            </p>
            <p className={styles.bodyTextMuted}>
              The goal of business process automation is not to replace people.
              It’s to make sure that the right steps happen every time: the
              request is categorized, the checklist is followed, the
              documentation is captured, and risky actions require an explicit
              approval.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Where agents shine</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>Intake + routing:</strong> turn messy language into an
                  explicit work queue.
                </li>
                <li>
                  <strong>Policy + checklists:</strong> “Don’t escalate until
                  fields X/Y/Z exist” is enforceable code.
                </li>
                <li>
                  <strong>Audit trails:</strong> capture what happened, why, and
                  who approved side effects.
                </li>
                <li>
                  <strong>Iteration:</strong> add new detectors as new
                  regulations and failure modes appear.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              A simple, high-leverage automation
            </h2>
            <p className={styles.bodyText}>
              Start with something boring and measurable: classify inbound
              requests and return a structured plan. This is “just routing,” but
              it’s the beginning of a defensible operations workflow: the output
              is constrained, testable, and easy to extend.
            </p>
            <p className={styles.bodyTextMuted}>
              The example below shows an operations router that buckets requests
              into explicit labels like <code>privacy_request</code> or{" "}
              <code>security_alert</code>, then emits a short plan that humans
              (or downstream agents) can execute. The important part is the
              contract: if your output is always one of a fixed set of labels,
              you can build reliable automation around it.
            </p>

            <pre className={styles.codeBlock}>
              <code>{BUSINESS_PROCESS_AUTOMATION_SNIPPET}</code>
            </pre>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Guardrails to add next</p>
              <ul className={styles.checkList}>
                <li>
                  <Link to="/validation/">Validation</Link>: enforce the label
                  set and required output fields.
                </li>
                <li>
                  <Link to="/specifications/">Behavior specs</Link>: lock down
                  “must ask for approval before deletion/refunds.”
                </li>
                <li>
                  <Link to="/evaluations/">Evaluations</Link>: measure accuracy
                  and drift on a real inbox dataset.
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              If you want a runnable, end-to-end example of the same pattern,
              start with{" "}
              <Link to="/use-cases/text-classification/">
                Text Classification
              </Link>
              .
            </p>
          </div>
        </section>

        <BottomCta
          title="Next: agent-based incident response"
          text="See how the same automation patterns apply to IT service management and escalation."
          buttonLabel="Level Zero Operators"
          to="/use-cases/level-zero-operators/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Business Process Automation"
    description="Use case: business process automation with agents — intake, routing, checklists, documentation, and approvals, all with validation/specs/evals."
  />
)

export default BusinessProcessAutomationUseCasePage
