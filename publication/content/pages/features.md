---
path: /features/
title: Features
heading: Built for Real Systems
description: "Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege."
kind: landing
lede: Tactus is a language + runtime for building tool-using agents that can run safely in production.
call_to_action:
  title: Ready to start building?
  text: Follow a short walkthrough and build your first tool-using agent workflow.
  label: Get Started
  to: /getting-started/
---

## Built for real systems

The headline feature is not a keyword — it’s the control surface: sandboxing, capability control, durable HITL, and a secretless broker boundary (so even if something breaks in, there’s nothing valuable inside to steal).

:::card-grid{columns=3 label="Highlights"}
:::card{title="Docker sandbox by default"}
Procedures run in a Lua sandbox inside a Docker container: keep the monkey in the box, and keep sensitive information out of the box.
:::

:::card{title="Networkless by default"}
Keep the sandbox on **network: none**. This reduces the blast radius: the agent can’t download arbitrary code or steal data directly from inside the runtime environment.
:::

:::card{title="API keys stay outside the sandbox"}
API keys never live in the runtime container, and never get passed into model prompts. The agent gets answers, not credentials.
:::

:::card{title="Brokered tools"}
Tools that need secrets or privileged access can run outside the sandbox via a broker, streaming back results so the agent gets answers, not credentials. Host modules can expose broad application APIs through the same controlled boundary.
:::

:::card{title="Least privilege controls"}
Give the right tools and context at the right time: default-deny capabilities, per-step tool access, host-module API boundaries, and approval gates.
:::

:::card{title="Durable + testable"}
Checkpoint long workflows, add HITL where needed, and measure reliability with specs + evaluations.
:::

:::card{title="Agent-level retry (with rollback)"}
Retry a single agent turn on transient failures (and optional output validation failures) without committing partial turns into durable conversation state.
:::
:::

---

## Human-in-the-loop approvals

Approvals are a first-class primitive. When a workflow reaches an approval, it can suspend and wait—without hacks like “keep a process alive.”

{{island HitlReturnsAllDiagram}}

```lua
local approved = Human.approve({
    message = "Deploy to production?",
    timeout = 3600,
    default = false
})

if approved then
    deploy()
end
```

## Transparent durability

Long-running workflows are durable: they can pause, resume, and survive restarts. The key is transparency—the workflow’s durable “waiting” points are explicit in code and visible in behavior.

```lua
-- A durable workflow can pause...
local approved = Human.approve({
    message = "Publish these findings?",
    timeout = 3600,
    default = false
})

-- ...and resume later, without losing state.
```

## Docker sandbox by default

Procedures run in a Lua sandbox inside a Docker container: keep the monkey in the box, and keep sensitive information out of the box.

```lua
agent = Agent {
    model = "openai/gpt-4o",
    -- Runs in an isolated container by default
}
```

## Networkless by default

Keep the sandbox on **network: none**. This reduces the blast radius: the agent can’t download arbitrary code or exfiltrate data directly from inside the runtime environment.

```lua
-- In production, keep the runtime container networkless.
-- Model calls and tool calls happen through controlled host transports.
```

## Brokered tools (secrets stay out of prompts)

Some tools need secrets or privileged access. Tactus supports a brokered model: sensitive tools run outside the sandbox, and the agent receives results—not credentials.

```lua
-- The broker can call privileged tools...
-- ...while keeping secrets outside the agent runtime.
-- The agent gets outputs, not API keys.
```

## Capability control (least privilege)

Agents only get the tools you explicitly provide. The default posture is deny-by-default: no ambient access to files, shell, or network—only what you grant.

```lua
-- Tools are explicit; nothing is implicit.
agent = Agent {
    model = "openai/gpt-4o",
    tools = {
        create_contact,
        -- no other tools granted
    }
}
```

## Specifications (executable behavior)

Specifications define what must be true. They help you test workflows, catch regressions, and build confidence before you run unattended in production.

```lua
Specifications([[
Feature: Safe deployments

  Scenario: Requires approval
    Given a deployment request
    When the workflow runs
    Then it should wait for approval
    And not deploy without confirmation
]])
```

## Validation built in

Procedures declare typed inputs and outputs. The runtime validates inputs at the boundary, structures outputs, and makes failures explicit instead of silently drifting.

```lua
Procedure {
    input = {topic = field.string{required = true}},
    output = {approved = field.boolean{required = true}},
    function(input)
        -- ...
    end,
}
```
