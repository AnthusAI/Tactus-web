---
title: A copilot for anything
description: 'Embed Tactus agents in any application: chat UX, tools, and Human-in-the-Loop interactions using the standard HITL component library.'
type: page
---
::band{size="hero" eyebrow="Use Case"}
# A copilot for anything

Embed Tactus agents inside your app: a chat UI, real tools, and explicit human checkpoints when the agent is about to do something that matters.

::band
This walkthrough focuses on two Human-in-the-Loop interactions: an approval before side effects, and a structured inputs form when the agent needs missing details.

::island{name="HitlDemo" demo="copilot-chat"}

::band
## What this unlocks in your application

- A familiar chat surface for users (copilot UX), backed by a real procedure with tools and guardrails.
- Asynchronous human-in-the-loop: the agent can run independently, then pause to ask for a decision only when it hits a checkpoint (approval, missing input, high-risk side effect).
- Centralized control over where the agent is allowed to act, what it can call, and when a human must confirm.

### Architecture: Sidecar Chat

::island{name="SidecarChatDiagram"}

### Chat UI + async queued HITL

A copilot is more than “AI chat in your app.” You get the chat surface, plus an asynchronous interface paradigm: the agent can run on its own and only ask for human input at the moments that matter. Those requests queue up and the workflow resumes the moment the human responds.

:::card-grid{columns=2 label="HITL interface patterns"}
:::card{title="Closely supervised"}
The chat surface. Great when a human is present to steer and supervise each step.

::island{name="HitlDiagram" variant="supervised" withStart="true"}
:::

:::card{title="Asynchronous queued HITL"}
The unlock. The agent runs independently and queues approvals/inputs when needed, so throughput isn't gated on constant supervision.

::island{name="HitlDiagram" variant="queued" withStart="true"}
:::
:::

:::callout{kind="note" title="Where to start"}
Use the IDE to play with these interactions quickly, then embed the same components in your app when you are ready.

::button{href="/getting-started/projects/" label="Projects: build a copilot UI"}

::button{href="/resources/components/" label="HITL component docs" variant="secondary"}

:::

::band{columns="cta"}
## Want runnable procedures too?

Use cases show the UX and the guardrails. Examples give you runnable code with embedded specs.

::button{href="/examples/" label="Browse examples" size="lg"}
