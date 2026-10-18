---
path: /use-cases/level-zero-operators/
title: Level Zero Operator Agents
heading: Level Zero Operator Agents
eyebrow: Use Case
description: "Use case: agent-based incident response for ITSM. Level Zero Operators investigate early, enforce SOPs, and escalate with better documentation."
kind: landing
lede: "Agent-based business process automation for IT service management: investigate early, document continuously, and escalate with better context."
muted: [2]
call_to_action:
  title: Browse more use cases
  text: Pick another workflow pattern to learn.
  label: Use Cases
  to: /use-cases/
---

The Level Zero Operator augments people. Humans still make the hard calls. The difference is that the first human on the incident sees a structured brief instead of a mystery.

---

## Escalation is a protocol

In ITSM (often influenced by ITIL), incidents move through levels. Level 1 and above are typically human operators; higher levels represent deeper expertise, more privileged access, and higher cost. A Level Zero Operator is an agent layer that runs first: it gathers context and enforces the protocol before a human ever reads the ticket.

{{island LevelZeroEscalationDiagram}}

:::callout{kind="note" title="Two ways agents help in incident response"}
- **Process supervisor:** enforce SOPs (required fields, approvals, evidence) and flag violations early.
- **Level Zero operator:** investigate immediately, summarize, and propose next actions before escalation.
:::

---

## What “good documentation” means during escalation

Escalation should be cheap for the receiving team. That means the ticket has to carry context, not just urgency. In practice, this looks like a lightweight runbook embedded in the incident itself: what happened, what we tried, what we observed, and what we’re asking the next level to do.

A Level Zero Operator can enforce this: it can refuse to escalate without the required fields, and it can fill in many fields automatically from tooling (logs, metrics, deploy history) while keeping disruptive actions behind approvals.

:::callout{kind="note" title="Minimum escalation package"}
- **Impact:** who is affected, what is broken, and how bad it is (severity rubric).
- **Timeline:** first signal, detection source, key changes since last known good.
- **Evidence:** links to dashboards/log queries, symptoms observed, error signatures.
- **Ownership:** primary service/team, related dependencies, current on-call.
- **Actions taken:** only confirmed actions, with approver + time when relevant.
:::

---

## A Level Zero Operator as code

The core trick is to make incident handling a procedure with explicit inputs/outputs. Once the output is structured (category, severity, escalation recommendation, incident brief), it becomes testable. You can run behavior specs on it, and you can run evaluations on historical incident summaries to quantify reliability.

```lua
-- Level Zero Operator (ITSM incident response)
--
-- A Level Zero Operator is agent-based business process automation for incidents:
-- it gathers context early, enforces SOPs, and produces an incident brief before a human joins.

IncidentBrief = Agent {
  model = "openai/gpt-4o-mini",
  system_prompt = [[
You are a Level Zero Operator for IT incident response.
You write concise incident briefs and propose next steps.
You do not claim actions were taken unless explicitly stated.
]]
}

Procedure {
  input = {
    incident_summary = field.string{required = true, description = "Alert text or ticket summary"},
    service = field.string{required = true, description = "Service or system name"},
    environment = field.string{required = true, description = "prod | staging | dev"}
  },
  output = {
    category = field.string{required = true, description = "One of: availability, performance, security, change, data, unknown"},
    severity = field.string{required = true, description = "One of: sev0, sev1, sev2, sev3"},
    escalation = field.string{required = true, description = "One of: hold, page_l1, page_l2, engage_security"},
    brief = field.string{required = true, description = "Structured incident brief for a human on-call"}
  },
  function(input)
    local categorize = Classify {
      name = "incident_category",
      method = "llm",
      classes = {"availability", "performance", "security", "change", "data", "unknown"},
      prompt = "Classify the incident summary into one label: availability, performance, security, change, data, unknown. Return only the label.",
      model = "openai/gpt-4o-mini",
      temperature = 0,
      max_retries = 3
    }

    local severitize = Classify {
      name = "incident_severity",
      method = "llm",
      classes = {"sev0", "sev1", "sev2", "sev3"},
      prompt = [[
Assign incident severity:
- sev0: widespread outage or safety/legal risk
- sev1: major customer impact
- sev2: partial degradation, workaround exists
- sev3: minor/localized
Return only one label.
]],
      model = "openai/gpt-4o-mini",
      temperature = 0,
      max_retries = 3
    }

    local category = categorize(input.incident_summary).value
    local severity = severitize(input.incident_summary).value

    local escalation = "hold"
    if category == "security" then escalation = "engage_security" end
    if severity == "sev0" or severity == "sev1" then escalation = "page_l1" end
    if severity == "sev0" then escalation = "page_l2" end

    local prompt = [[
Write an incident brief with these sections:
1) What we know (facts)
2) Suspected causes (hypotheses)
3) Immediate checks to run (safe diagnostics)
4) Suggested next actions (ask for approval before disruptive actions)
5) Documentation checklist (fields to capture before escalation)

Inputs:
- service: ]] .. input.service .. [[
- environment: ]] .. input.environment .. [[
- summary: ]] .. input.incident_summary .. [[
]]

    local brief = IncidentBrief(prompt).output

    return {category = category, severity = severity, escalation = escalation, brief = brief}
  end
}
```

In this example, `max_retries` belongs to the standard-library `Classify` helper. It is a helper-level retry loop, not `retry = { ... }` on an `Agent`.

:::callout{kind="note" title="Guardrails that matter most here"}
- [Validation](/validation/): severity/category/escalation outputs are always one of known values.
- [Behavior specs](/specifications/): “no escalation unless evidence exists” becomes enforceable.
- [Evaluations](/evaluations/): measure how often the operator recommends the right escalation level.
:::

A good Level Zero Operator doesn’t make heroic decisions. It makes the human decision-maker fast: categorize, gather facts, propose hypotheses, and surface next steps — then ask for explicit approval when the next step has side effects.
