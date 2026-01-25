import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import * as styles from "./use-case.module.css"

const PROTOTYPE_SKILL_SNIPPET = `---
name: refund-ops
description: Process daily Stripe refunds from an Excel upload and produce a reconciliation report.
---

# Refund Ops Automation

## When to use this skill
- Batch refunds (e.g., ~100/day) from a spreadsheet.
- Generate a "success/failure" report for fast manual cleanup.

## Inputs (expected)
- Excel file with columns: payment_intent_id, amount_cents, reason, ticket_id (optional)

## Procedure (high level)
1) Read rows in order and validate required columns
2) For each row:
   - Lookup the Payment Intent in Stripe (via MCP)
   - If high-risk (large amount / unusual pattern), ask for approval
   - Create the refund and record the result
3) Export a report spreadsheet (successes + failures + error messages)
`

const TACTUS_PROCEDURE_SNIPPET = `-- refund_ops.tac (illustrative example)
--
-- Key idea: prototype supervised as a Skill, then harden into a governed procedure:
-- validate inputs, pre-call tools, add human checkpoints, and measure drift.

Stripe = Toolset.mcp {
  server = "stripe",
}

refund_row = Tool.define {
  name = "stripe_refund",
  description = "Create a refund for a payment intent",
  input = {
    payment_intent_id = "string",
    amount_cents = "number",
    reason = "string",
    ticket_id = "string (optional)",
  },
  output = {
    refund_id = "string",
    status = "string",
  },
}

RefundAgent = Agent {
  provider = "openai",
  model = "gpt-4o-mini",
  system_prompt = [[
You are a finance ops assistant.
Follow the procedure and never execute a refund without either:
  (a) passing automated checks, or
  (b) receiving explicit human approval.
Return structured outputs only.
]],
}

Procedure {
  input = {
    rows = field.list{required = true, description = "Validated refund rows"},
  },
  output = {
    results = field.list{required = true},
  },
  function(input)
    local results = {}

    for i, row in ipairs(input.rows) do
      -- 1) Deterministic lookup first (agent can't "forget" to do it)
      local pi = Stripe.payment_intents.retrieve({id = row.payment_intent_id})

      -- 2) Risk check (hard-coded guardrail)
      local high_risk = (row.amount_cents >= 50000) -- example threshold

      if high_risk then
        local approved = Human.approve({
          message = "Approve refund?",
          context = {
            payment_intent_id = row.payment_intent_id,
            amount_cents = row.amount_cents,
            reason = row.reason,
            ticket_id = row.ticket_id,
            stripe_summary = pi,
          },
          timeout = 3600,
          default = false,
        })
        if not approved then
          table.insert(results, {index = i, ok = false, error = "not approved"})
          goto continue
        end
      end

      -- 3) Tool call with structured input
      local r = refund_row(row)
      table.insert(results, {index = i, ok = true, refund_id = r.refund_id})

      ::continue::
    end

    return {results = results}
  end,
}
`

const RefundOpsUseCasePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Use Case</p>
              <h1 className={styles.title}>Refund Ops Automation</h1>
              <p className={styles.lede}>
                A real workflow that started life as a Claude Skill, then grew
                into a governed automation: tool use, human checkpoints, and
                audit trails.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              The story: 100 Stripe refunds a day
            </h2>
            <p className={styles.bodyText}>
              A finance team lead at a growing startup manually processed credit
              notes and refunds. After an acquisition, her workload shifted
              toward higher-value work--but the refunds didn't disappear. The
              result: an hour of repetitive, error-prone work every day.
            </p>
            <p className={styles.bodyTextMuted}>
              The prototype was a <b>Claude Skill</b> that uses the out-of-the-box{" "}
              <b>Stripe MCP server</b>. Each morning, she drops in an Excel file
              in a known format. The agent walks the rows in order, issues
              refunds against Payment Intents, records successes and failures,
              and exports a report for quick manual cleanup.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Why this is compelling</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>Time:</strong> ~60 minutes/day becomes seconds to
                  kick off + a quick final check.
                </li>
                <li>
                  <strong>Throughput:</strong> automation scales with volume
                  (100+ refunds) without adding headcount.
                </li>
                <li>
                  <strong>Transparency:</strong> every action is logged, and
                  failures produce an explicit exception queue.
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This is not "give a monkey a razor blade." The point is controlled
              delegation: let the agent do the repetitive steps, and keep a
              human responsible for the business process.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Prototype first (supervised)</h2>
            <p className={styles.bodyText}>
              In the early days, you want speed. A supervised interface like
              Claude Code or Cursor is perfect for prototyping: you watch the
              agent work, you correct it when it drifts, and you iterate quickly
              on the steps until the procedure feels right.
            </p>

            <h3 className={styles.subsectionTitle}>Prototype Skill (example)</h3>
            <pre className={styles.codeBlock}>
              <code>{PROTOTYPE_SKILL_SNIPPET}</code>
            </pre>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Links</p>
              <ul className={styles.checkList}>
                <li>
                  Agent Skills standard:{" "}
                  <a
                    href="https://agentskills.io/home"
                    target="_blank"
                    rel="noreferrer"
                  >
                    agentskills.io
                  </a>
                </li>
                <li>
                  Model Context Protocol (MCP):{" "}
                  <a
                    href="https://modelcontextprotocol.io/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    modelcontextprotocol.io
                  </a>
                </li>
                <li>
                  Reference:{" "}
                  <a
                    href="https://www.blog.langchain.com/how-to-think-about-agent-frameworks/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    How to think about agent frameworks (LangChain)
                  </a>
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              Supervision is a feature during prototyping. But it's also a
              ceiling: if a human must watch every step, the workflow can't run
              while they're asleep, in meetings, or handling higher-priority
              work.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Why migrate from a Skill to a procedure?
            </h2>
            <p className={styles.bodyText}>
              Skills are a low-friction way to prototype: a human is present,
              the agent has freedom, and you can iterate quickly. But the same
              flexibility that makes Skills productive also makes them harder to
              operate at scale.
            </p>
            <p className={styles.bodyTextMuted}>
              The goal is not "more autonomy at any cost." The goal is to move
              along the predictability vs agency curve on purpose: keep agency
              where it helps (messy mapping and judgment calls), and enforce
              predictability where it matters (tool use, data flow, approvals,
              reporting).
            </p>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>What you gain</p>
              <ul className={styles.flatList}>
                <li>
                  <strong>Predictable data flow:</strong> you decide what gets
                  fetched and when (e.g., lookup Stripe objects before the model
                  runs).
                </li>
                <li>
                  <strong>Guardrails you can prove:</strong> validation, specs,
                  and evaluations turn "it usually works" into measured
                  reliability.
                </li>
                <li>
                  <strong>Human checkpoints that scale:</strong> approvals and
                  missing inputs can queue asynchronously instead of blocking a
                  live chat session.
                </li>
                <li>
                  <strong>Audit trails:</strong> structured inputs/outputs,
                  tool-call logs, and checkpoints make monitoring and compliance
                  tractable.
                </li>
                <li>
                  <strong>Higher ceiling:</strong> long-running workflows can
                  pause/resume, fan out, retry safely, and integrate deeply into
                  real systems.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Then add guardrails (and step back)
            </h2>
            <p className={styles.bodyText}>
              To automate a business process responsibly, you progressively move
              uncertainty out of the agent loop:
            </p>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>A pragmatic hardening path</p>
              <ul className={styles.flatList}>
                <li>
                  <strong>Make inputs explicit:</strong> validate the Excel
                  schema and normalize IDs before the agent touches them.
                </li>
                <li>
                  <strong>Pre-call tools when possible:</strong> fetch Payment
                  Intent details deterministically and pass results to the model
                  so it can't "forget" to look them up.
                </li>
                <li>
                  <strong>Constrain outputs:</strong> require structured results
                  (e.g., which refund to create, why, and what evidence was
                  used).
                </li>
                <li>
                  <strong>Require human checkpoints:</strong> pause for approval
                  on high-risk rows (large amounts, unusual patterns, mismatched
                  invoice data).
                </li>
                <li>
                  <strong>Measure drift:</strong> add behavior specs and
                  evaluations so reliability improves over time.
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This is the core promise of Tactus for business process automation:
              you can start with natural-language prototyping, then gradually
              put guardrails around the parts that matter until you can step
              back safely--without removing humans from accountability.
            </p>

            <h3 className={styles.subsectionTitle}>
              Hardened procedure (Tactus example)
            </h3>
            <pre className={styles.codeBlock}>
              <code>{TACTUS_PROCEDURE_SNIPPET}</code>
            </pre>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Where to go next</h2>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Related pages</p>
              <ul className={styles.checkList}>
                <li>
                  <Link to="/use-cases/business-process-automation/">
                    Business Process Automation (overview)
                  </Link>
                </li>
                <li>
                  <Link to="/human-in-the-loop/">Human in the loop</Link>
                </li>
                <li>
                  <Link to="/guardrails/">Guardrails</Link>
                </li>
                <li>
                  <Link to="/evaluations/">Evaluations</Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <BottomCta
          title="Browse more use cases"
          text="See other architecture patterns and workflows."
          buttonLabel="Use Cases"
          to="/use-cases/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Refund Ops Automation"
    description="Use case: automate Stripe refunds with tool use, human checkpoints, and audit trails--starting from a Claude Skill and hardening into a governed procedure."
  />
)

export default RefundOpsUseCasePage
