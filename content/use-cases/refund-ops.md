---
title: Refund Ops Automation
description: 'Use case: automate Stripe refunds with tool use, human checkpoints, and audit trails--starting from a Claude Skill and hardening into a governed procedure.'
type: page
---
::band{size="hero" eyebrow="Use Case"}
# Refund Ops Automation

A real workflow that started life as a Claude Skill, then grew into a governed automation: tool use, human checkpoints, and audit trails.

::band{tone="muted"}
## The story: 100 Stripe refunds a day

A finance team lead at a growing startup manually processed credit notes and refunds. After an acquisition, her workload shifted toward higher-value work--but the refunds didn't disappear. The result: an hour of repetitive, error-prone work every day.

The prototype was a **Claude Skill** that uses the out-of-the-box **Stripe MCP server**. Each morning, she drops in an Excel file in a known format. The agent walks the rows in order, issues refunds against Payment Intents, records successes and failures, and exports a report for quick manual cleanup.

:::callout{kind="note" title="Why this is compelling"}
- **Time:** ~60 minutes/day becomes seconds to kick off + a quick final check.
- **Throughput:** automation scales with volume (100+ refunds) without adding headcount.
- **Transparency:** every action is logged, and failures produce an explicit exception queue.
:::

This is not "give a monkey a razor blade." The point is controlled delegation: let the agent do the repetitive steps, and keep a human responsible for the business process.

::band
## Prototype first (supervised)

In the early days, you want speed. A supervised interface like Claude Code or Cursor is perfect for prototyping: you watch the agent work, you correct it when it drifts, and you iterate quickly on the steps until the procedure feels right.

### Prototype Skill (example)

```markdown
---
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
```

:::callout{kind="note" title="Links"}
- Agent Skills standard: [agentskills.io](https://agentskills.io/home)
- Model Context Protocol (MCP): [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- Reference: [How to think about agent frameworks (LangChain)](https://www.blog.langchain.com/how-to-think-about-agent-frameworks/)
:::

Supervision is a feature during prototyping. But it's also a ceiling: if a human must watch every step, the workflow can't run while they're asleep, in meetings, or handling higher-priority work.

::band
## Why migrate from a Skill to a procedure?

Skills are a low-friction way to prototype: a human is present, the agent has freedom, and you can iterate quickly. But the same flexibility that makes Skills productive also makes them harder to operate at scale.

The goal is not "more autonomy at any cost." The goal is to move along the predictability vs agency curve on purpose: keep agency where it helps (messy mapping and judgment calls), and enforce predictability where it matters (tool use, data flow, approvals, reporting).

:::callout{kind="note" title="What you gain"}
- **Predictable data flow:** you decide what gets fetched and when (e.g., lookup Stripe objects before the model runs).
- **Guardrails you can prove:** validation, specs, and evaluations turn "it usually works" into measured reliability.
- **Human checkpoints that scale:** approvals and missing inputs can queue asynchronously instead of blocking a live chat session.
- **Audit trails:** structured inputs/outputs, tool-call logs, and checkpoints make monitoring and compliance tractable.
- **Higher ceiling:** long-running workflows can pause/resume, fan out, retry safely, and integrate deeply into real systems.
:::

::band{tone="muted"}
## Then add guardrails (and step back)

To automate a business process responsibly, you progressively move uncertainty out of the agent loop:

:::callout{kind="note" title="A pragmatic hardening path"}
- **Make inputs explicit:** validate the Excel schema and normalize IDs before the agent touches them.
- **Pre-call tools when possible:** fetch Payment Intent details deterministically and pass results to the model so it can't "forget" to look them up.
- **Constrain outputs:** require structured results (e.g., which refund to create, why, and what evidence was used).
- **Require human checkpoints:** pause for approval on high-risk rows (large amounts, unusual patterns, mismatched invoice data).
- **Measure drift:** add behavior specs and evaluations so reliability improves over time.
:::

This is the core promise of Tactus for business process automation: you can start with natural-language prototyping, then gradually put guardrails around the parts that matter until you can step back safely--without removing humans from accountability.

### Hardened procedure (Tactus example)

```lua
-- refund_ops.tac (illustrative example)
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
  model = "openai/gpt-4o-mini",
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
```

::band
## Where to go next

:::callout{kind="note" title="Related pages"}
- [Business Process Automation (overview)](/use-cases/business-process-automation/)
- [Human in the loop](/human-in-the-loop/)
- [Guardrails](/guardrails/)
- [Evaluations](/evaluations/)
:::

::band{columns="cta"}
## Browse more use cases

See other architecture patterns and workflows.

::button{href="/use-cases/" label="Use Cases" size="lg"}
