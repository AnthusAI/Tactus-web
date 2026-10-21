---
title: Human in the Loop
description: 'Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege.'
type: page
---
::band{size="hero" eyebrow="Human in the loop"}
# Durable HITL Workflows

Human-in-the-loop is where agent workflows stop being demos and start being trustworthy systems. In Tactus, HITL is not a framework convention — it’s a language primitive backed by runtime infrastructure.

::band
## Contents

1. [Why HITL matters](#why)
2. [Two HITL patterns: approve vs return](#patterns)
3. [Durable suspend points](#durability)
4. [When humans are busy](#real-world)
5. [Testing and reliability](#testing)

::band
## Why HITL matters {#why}

Agentic programming is fundamentally about yielding control flow to a model: the agent decides what tool to call next, when to ask questions, and when it’s done. That’s powerful — and it’s also why “hope for the best” stops being an option once the agent can take real actions.

HITL is how you keep humans in charge at the moments that matter: approving irreversible actions, correcting mistakes, and steering a procedure back on track without hovering over the run in real time.

:::callout{kind="tip" title="HITL is not a UX detail"}
It’s an operational primitive. If you want to delegate meaningful work, you need a place for the workflow to **pause**, wait for a decision, and then **resume** — reliably.
:::

::band
## Two HITL patterns: approve vs return {#patterns}

HITL isn’t just “ask the user a question.” In practice, there are two common patterns:

**Approval gates** are yes/no checkpoints before risky actions. **Return loops** let a human send an artifact back for edits — and the procedure keeps going with the revised version.

### What it looks like in a copilot UI

::island{name="HitlDemo" demo="ops-chat"}

### Return loop (human edits)

Return loops show up when the agent produces an artifact (an email, a ticket, a plan) and the human wants to revise it before the workflow continues.

::island{name="HitlDemo" demo="hitl-review"}

### Interface patterns: supervised vs queued

In a chat UI, agents feel safe because you supervise every step. But that same tight loop becomes a bottleneck in production: when the human isn’t present, nothing progresses.

The alternative is **asynchronous** HITL: the agent runs independently, and only pauses when it needs a decision. Requests queue up, and runs resume the moment the human responds.

#### Closely supervised (chat-only autonomy)

::island{name="HitlDiagram" variant="supervised"}

#### Asynchronous queued HITL (high throughput)

::island{name="HitlDiagram" variant="queued"}

The key point isn’t the icons — it’s the shape of the workflow. When this is not built into the language/runtime, you end up recreating a state machine in Python: persist state, build queues, handle timeouts, resume idempotently, and reconcile edits. Tactus makes this pattern explicit and durable by default.

::band
## Durable suspend points {#durability}

The reason HITL works in production is durability. When a procedure reaches a HITL call, it can suspend indefinitely without keeping a process alive. That means no wasted compute while waiting — and no fragile “hold this server open” hacks.

You can also set timeouts and defaults so the procedure has a deterministic outcome when a human doesn’t respond in time.

::island{name="AnimatedCodeBlock" label="Human approval" filename="examples-approval.tac" blockWidth="1400"}
```tactus
local approved, timed_out = Human.approve({
  message = "Deploy to production?",
  timeout = 3600,
  default = false,
})

if approved then
  deploy()
end
```

::band
## When humans are busy {#real-world}

Real systems have real constraints: people go offline, review queues grow, and the agent loop can outrun your ability to supervise. HITL infrastructure has to make these failure modes visible and survivable.

### Backlogs (work arrives faster than it’s reviewed)

Queues are not a bug — they’re the mechanism. They let the agent keep doing safe work while human attention is scarce, then quickly drain the backlog when reviewers return.

::island{name="HitlDiagram" variant="backlog"}

::band
## Testing and reliability {#testing}

A HITL workflow you can’t test is a workflow you can’t trust. Tactus treats HITL points as structured events, which makes them easy to mock in tests and measure in evaluations.

This is the recurring theme: the language expresses what the procedure needs, and the runtime makes it operable — durable checkpoints, repeatable runs, and a clear audit trail of what happened and why.

### Runnable examples

Want to see full procedures that use HITL primitives? Start with the [Human-in-the-Loop examples](/examples/human-in-the-loop/) chapter, or jump straight into [Basic HITL](/examples/human-in-the-loop/basic-hitl/) and [Agent-driven approval](/examples/human-in-the-loop/agent-driven-approval/).

::band{columns="cta"}
## Ready to start building?

::button{href="/getting-started/" label="Get Started" size="lg"}
