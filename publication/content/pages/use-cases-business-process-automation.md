---
path: /use-cases/business-process-automation/
title: Business Process Automation
heading: Business Process Automation
eyebrow: Use Case
description: "Use case: business process automation with agents — intake, routing, checklists, documentation, and approvals, all with validation/specs/evals."
kind: landing
lede: "Automate the boring parts of operations without giving up control: intake, routing, checklists, documentation, and approvals — all as code."
muted: [1]
call_to_action:
  title: "Next: agent-based incident response"
  text: See how the same automation patterns apply to IT service management and escalation.
  label: Level Zero Operators
  to: /use-cases/level-zero-operators/
---

## The “Tuesday” problem

A small business gets a steady stream of operational pings: “please refund this,” “delete my data,” “someone logged in from a weird location,” “why did the site go down,” “can you send an invoice copy.” None of it is intellectually hard — it’s hard because it’s constant, interrupt-driven, and full of rules that only exist in someone’s head.

The goal of business process automation is not to replace people. It’s to make sure that the right steps happen every time: the request is categorized, the checklist is followed, the documentation is captured, and risky actions require an explicit approval.

:::callout{kind="note" title="Where agents shine"}
- **Intake + routing:** turn messy language into an explicit work queue.
- **Policy + checklists:** “Don’t escalate until fields X/Y/Z exist” is enforceable code.
- **Audit trails:** capture what happened, why, and who approved side effects.
- **Iteration:** add new detectors as new regulations and failure modes appear.
:::

---

## A simple, high-leverage automation

Start with something boring and measurable: classify inbound requests and return a structured plan. This is “just routing,” but it’s the beginning of a defensible operations workflow: the output is constrained, testable, and easy to extend.

The example below shows an operations router that buckets requests into explicit labels like `privacy_request` or `security_alert`, then emits a short plan that humans (or downstream agents) can execute. The important part is the contract: if your output is always one of a fixed set of labels, you can build reliable automation around it.

:::callout{kind="note" title="Real-world example"}
A finance ops workflow processing ~100 Stripe refunds/day started as a supervised Claude Skill, then got hardened into governed automation with tool use, human checkpoints, and audit trails. [Read the case study](/use-cases/refund-ops/).
:::

```lua
-- Business Process Automation (SMB-friendly)
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
- privacy_request: GDPR/CCPA "delete my data", "forget me", "data access request"
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
```

Here, `max_retries` is part of the standard-library `Classify` primitive. It is not the same as `Agent { retry = ... }`, which retries a full agent turn.

:::callout{kind="note" title="Guardrails to add next"}
- [Validation](/validation/): enforce the label set and required output fields.
- [Behavior specs](/specifications/): lock down “must ask for approval before deletion/refunds.”
- [Evaluations](/evaluations/): measure accuracy and drift on a real inbox dataset.
:::

If you want a runnable, end-to-end example of the same pattern, start with [Text Classification](/use-cases/text-classification/).
