---
path: /
title: Tactus
heading: Tactus
eyebrow: A language + runtime for tool-using agents
description: "Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege."
kind: landing
muted: [3, 5, 7]
hero_split: true
drop_caps: ["1:2"]
call_to_action:
  title: Ready to start building?
  text: Follow a short walkthrough and build your first tool-using agent workflow.
  label: Get Started
  to: /getting-started/
---

**Give AI agents powerful tools.** Safely and securely.

Tool-using agents are useful—and dangerous: run them unattended and you’re giving a monkey a razor blade and hoping for the best.

Tactus gives you a high-level language for building tool-using agents, with capability and context control, durable workflows, and default-on sandboxing and container isolation so they can run unattended without touching your host—or your API keys.

{{actions}}

[Get started](/getting-started/) · [View code](https://github.com/AnthusAI/Tactus)

{{island InstallCommand}}

:::figure{src="/assets/animals/learning-cover-animal.png" alt="An animal illustration in the style of a classic programming book cover" caption="Tools are sharp. Guardrails are not optional."}
:::

---

## Hello, world

Define an agent, then call it like a function.

{{island AnimatedCodeBlock label="Hello, world" filename="examples-hello-world.tac" hint="Agent" showTypewriter="true" typewriterDelay="0.2" typewriterSpeed="1.1" autoPlay="true" blockWidth="1400"}}
```tactus
World = Agent {
    model = "openai/gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").output
```

---

**Intro to Tactus** · 5 minutes

{{video-embed intro}}

---

*The paradigm shift*

## A new kind of computer program

Since the dawn of computing, programming has meant anticipating every scenario and writing code for it. But tool-using agents flip the script.

:::two-up
:::column
### The old way: anticipate everything

Traditional programs are brittle. Parse this format. Catch that error. Map these fields to those fields. Miss one case and the program breaks.
:::

:::column
{{island AnimatedOldWayFlowchartDiagram durationMs="4000"}}

Every new edge case requires more conditional logic
:::
:::

:::two-up
:::column
### The new way: agents with guardrails

Instead of handling every edge case yourself, you give an agent tools and a procedure, and let it work inside guardrails.
:::

:::column
{{island AnimatedNewWayFlowchartDiagram durationMs="3200"}}

Agent + Tools + Procedure, bounded by Guardrails
:::
:::

## Here's what that looks like in code {#paradigm}

Instead of anticipating every edge case, you define capabilities and let an agent do the mapping.

:::card-grid{columns=2 label="Old way and new way"}
:::card{title="The old way: think of everything"}
Traditional code is brittle because every new input format means more conditional logic. Miss one case and the program breaks.

{{island AnimatedCodeBlock label="The old way" hideTitleBar="true"}}
```python
def import_contact(row):
    # Expect a 1-row CSV string
    # ... parsing logic ...

    # Email column mapping?
    email = (
        row.get("email")
        or row.get("e-mail")
        or row.get("correo")
    )
    if not email:
        raise ValueError("Missing email")

    # Name mapping?
    name = row.get("name") or ""
    if "," in name:
        last, first = name.split(",", 1)
    else:
        first, last = name.split(" ", 1)

    # Each new variation = new code.
    return create_contact(first, last, email)
```
:::

:::card{title="The new way: give an agent a tool"}
You define the capability and give the agent the messy input. The agent applies judgment to map fields and handle variation—without rewriting your logic.

{{island AnimatedCodeBlock label="The new way" hideTitleBar="true"}}
```tactus
-- Define the capability (schema)
contact_tool = Tool.define {
    name = "create_contact",
    description = "Import a contact into CRM",
    input = {
        first_name = "string",
        last_name = "string",
        email = "string (email format)",
        notes = "string (optional)"
    }
}

-- The agent figures out the mapping
function import_contact(row_data)
    agent.use(contact_tool, {
        instruction = "Import this contact data",
        data = row_data
    })
end
```
:::
:::

*Human in the loop*

## Autonomy, asynchronously

In Cursor or Claude, tool-using agents feel safe because you're there to supervise: you see every tool call, you steer, and you can stop the run the moment it goes sideways.

But how do we step back and give agents more agency to do things on their own—with powerful tools that have full control and can act on the systems and data we care about?

The practical answer is **asynchronous human-in-the-loop**: let the agent run, and only interrupt a human when it hits a decision point (approval, missing input, high-risk side effect).

:::card-grid{columns=2 label="Supervised versus unattended"}
:::card{title="Supervised (chat)" icon="svg-eye"}
- You watch every step and tool call.
- You can correct course mid-run.
- You can halt before damage is done.
:::

:::card{title="Unattended (production)" icon="svg-alert"}
- Runs without you—and runs many times.
- Small failure rates become incidents.
- Needs enforcement, not hope.
:::
:::

### Closely supervised

The common user interface paradigm for AI agents is through a chat interface. But human engagement becomes a bottleneck: when the human steps away to eat or sleep, the interface stops doing anything. If you need to process a volume of items, everything is bottlenecked on your presence.

{{island HitlDiagram variant="supervised" withStart="true"}}

### Completely unattended

You can remove the human entirely and let the agent run free. This scales beautifully: you can process thousands of items at machine speed without waiting for anyone. But running an agent this way is like giving a monkey a razor blade — if you don't trust it perfectly, you're asking for trouble.

{{island HitlDiagram variant="unsupervised" withStart="true"}}

### Asynchronous human-in-the-loop

A durable queue changes the paradigm: the agent operates independently, then pauses and asks for human input *only when needed*. Requests queue up while the human is away, and the workflow resumes instantly when the response arrives. You get speed and throughput close to unattended execution—without requiring a human to supervise every step.

{{island HitlDiagram variant="queued" withStart="true"}}

## Durable pause and resume

When a workflow needs a human, it can pause and resume without losing its place.

{{island AnimatedCodeBlock label="Human in the loop" filename="examples-deploy.tac" hint="human checkpoint + timeout" blockWidth="1400"}}
```tactus
local approved = Human.approve({
    message = "Deploy to production?",
    context = {environment = "prod"},
    timeout = 3600,
    default = false
})

if approved then
    deploy()
    end
```

In Tactus, `Human.approve()` is a first-class primitive. Reaching it suspends the run and creates a durable “waiting for human” checkpoint.

This is what makes agents viable in real applications. Instead of “human supervision” being the default mode, humans become an *asynchronous checkpoint*: the runtime can queue requests, suspend safely with zero CPU cost, and resume the moment input arrives. Because it’s omni-channel, those approvals and inputs can come from wherever your team already works—email, Slack, or a custom UI.

{{actions}}

[Read: Human in the Loop](/human-in-the-loop/)

*Architectures*

## Examples of ways to use agents

These are three common patterns in real products: a copilot UI, embedded runtime workflows, and deeply integrated features with tool use and asynchronous human checkpoints.

### Sidecar chat copilot

{{actions}}

[See: Copilot for Anything](/use-cases/copilot-anything/)

Bolt a chat interface onto an existing product. Great for “help me do X” workflows, with tool use and human checkpoints when actions are high risk.

{{island SidecarChatDiagram}}

### Deeply integrated features

{{actions}}

[See: Contact Import](/use-cases/contact-import/)

Add agent-powered product features behind UI buttons and forms. The procedure can call tools to change real state, and pause asynchronously for human review when required.

{{island DeepIntegrationDiagram}}

### Embedded runtime for workflows

{{actions}}

[See: Text Classification](/use-cases/text-classification/)

Run procedures inside your application to keep behavior testable and outputs structured. Ideal for classification, routing, extraction, and other repeatable workflows.

{{island EmbeddedRuntimeDiagram}}

### One Tool For Everything

{{actions}}

[See: One Tool For Everything](/use-cases/one-tool-programmable-api/)

The MCP interface still works the same way: the client sees one tool in context. Behind that tool, Tactus runs a short program against a host module that exposes focused docs and SDK-backed capabilities on demand.

{{island ProgrammableToolGatewayDiagram}}

:::callout{kind="note" title="Case study"}
### Refund ops automation

A real finance workflow started as a supervised Skill that processes an Excel file and issues Stripe refunds in sequence. It was then hardened into a governed procedure: inputs validated up front, tool data fetched deterministically, human checkpoints added for high-risk rows, and an audit trail produced for confidence and compliance.

{{actions}}

[Read the case study](/use-cases/refund-ops/) · [Browse Use Cases](/use-cases/)
:::

:::callout{kind="tip" title="Tactus in a nutshell"}
A high-level agent programming model, with default-on sandboxing and container isolation, capability and context control, human-in-the-loop gates, and durable checkpoints so long-running workflows can pause, resume, and be audited safely.
:::

## Built for real systems

When you’re not there to supervise, the runtime has to be the guardrail: container isolation, networkless execution, and tools that can use secrets without putting them in the agent runtime.

:::card-grid{columns=3 label="Highlights"}
:::card{title="Docker sandbox by default" icon="svg-box"}
Procedures run in a Lua sandbox inside a Docker container: keep the monkey in the box, and keep sensitive information out of the box.
:::

:::card{title="Networkless by default" icon="svg-wifi-off"}
Keep the runtime container on `network: none`, while still calling models and tools through a host transport (e.g. `stdio`).
:::

:::card{title="API keys stay outside the sandbox" icon="svg-key"}
API keys never live in the runtime container—and never get passed into model prompts.
:::

:::card{title="Brokered tools" icon="svg-cable"}
Tools that need secrets or privileged access can run outside the sandbox via a broker, streaming back results so the agent gets answers, not credentials. Broad host modules use the same boundary: expose a narrow API surface while secrets stay on the host side.
:::

:::card{title="Least privilege controls" icon="svg-lock"}
Minimal toolsets, curated context, network isolation, secretless broker, and temporal gating—agents get only what they need, when they need it.
:::

:::card{title="Durable + testable" icon="svg-save"}
Checkpoint long workflows, add human checkpoints where needed, and measure reliability with specs + evaluations.
:::
:::

{{actions}}

[Learn more](/features/)

## The AI Engineer’s Toolbox {#toolbox}

Tools are how agents touch reality. Tactus treats them as first-class primitives: schema-first tools for narrow actions, programmable gateways for broad app surfaces, and governed runtime controls around both.

{{actions}}

[Read: Toolbox](/ai-engineers-toolbox/)

{{island AnimatedAIEngineersToolboxDiagram}}

## Guardrails for Agent Autonomy {#guardrails}

You can’t drive fast without brakes. Guardrails are the prerequisite for delegating powerful tools. Tactus is a language and runtime that give you control levers at every layer of the stack—from prompt engineering down to container isolation—so you can define the exact safety profile your application needs.

{{actions}}

[Read: Guardrails](/guardrails/)

{{island AnimatedGuardrailsStackDiagram}}

## Sandboxing & Isolation {#sandboxing}

Agents run in a Lua sandbox inside a networkless container, constraining what they can touch and firewalling side effects. Privileged operations are brokered by a separate process that holds the secrets. It’s like letting a burglar into an empty building: even if the agent is compromised, there’s nothing valuable inside to steal—and nowhere to send it.

{{actions}}

[Read: Sandboxing](/guardrails/#sandboxing)

{{island ContainerSandboxDiagram}}

:::callout{kind="tip" title="Why do we need a new language?"}
We have Python. We have TypeScript. We have powerful agent frameworks. But they were built to manipulate deterministic logic, not probabilistic behavior.

**The abstraction level is wrong.**

- Using general-purpose languages for agents feels like writing web apps in assembly.
- We need new primitives for a world where code doesn't strictly control execution.
- Tactus aligns the language with the actual problems of production AI.
:::

Programming languages evolve to match the problems we care about. When computers were banks of vacuum tubes, zeros and ones were the right tool—they matched the physical reality. When we moved to complex logic, we built languages like C to manage the new concerns: loops, branches, and reusability.

Today, the "atoms" of computing have changed again. We are building with stochastic, decision-making models that we guide rather than control. Tactus raises the abstraction level to match this new reality, giving you first-class primitives for the things that matter now: reliability, sandboxing, and human oversight. It's not just a new syntax—it's a language built for the new problem space.

{{actions}}

[Read: Why a New Language?](/why-new-language/)

---

**Why a New Language? (7 min)**

{{video-embed why-new-language}}

---

## Behavior Specifications {#specifications}

Tactus treats behavior specs as part of the language itself: inline with procedures, executable by the runtime, and visible in every run. They define invariants, prevent regressions, and keep reliability measurable as models and tools evolve.

{{actions}}

[Read: Specifications](/specifications/)

{{island SpecificationsDiagram}}

## Evaluations {#evaluations}

One successful run is luck. Reliability is a statistic. Evaluations let you measure accuracy, cost, and reliability performance across datasets so you can ship with confidence.

{{actions}}

[Read: Evaluations](/evaluations/)

{{island EvaluationsDiagram}}

## [Validation is built in](/validation/)

Procedures declare typed inputs and outputs, validated with Pydantic.

{{island AnimatedCodeBlock label="Validation" filename="examples-research.tac" hint="Input + output schemas" blockWidth="1400"}}
```tactus
researcher = Agent {
    model = "openai/gpt-5",
    system_prompt = "Research the topic. Return a concise answer.",
    initial_message = "Research: {input.topic}"
}

Procedure {
    input = {
        topic = field.string{required = true},
    },
    output = {
        approved = field.boolean{required = true},
        findings = field.string{required = true},
    },
    function(input)
        local findings = researcher().output

        local approved = Human.approve({
            message = "Publish these findings?",
            timeout = 3600,
            default = false,
            context = {topic = input.topic}
        })

        return {approved = approved, findings = findings}
    end,
}
```

That schema isn’t decoration: it’s the contract the runtime uses to validate inputs, structure outputs, and power tooling (like auto-generated forms and safer integrations).

{{actions}}

[Read: Validation](/validation/)

---

## The Tactus Book Series {#books}

Three complementary books: learn the patterns, dive into the reference, or keep the cheat sheet on your desk.

{{books}}

---

## Built on the shoulders of giants

:::card-grid{columns=4 label="Technology"}
:::card{title="Lua"}
![Lua logo](/assets/logos/lua.svg)

[A fast, lightweight, and securely sandboxable scripting runtime.](https://www.lua.org)
:::

:::card{title="DSPy"}
![DSPy logo](/assets/logos/dspy.png)

[Algorithmic optimization of prompts and weights for reliable agents.](https://dspy.ai)
:::

:::card{title="Pydantic"}
![Pydantic logo](/assets/logos/pydantic.svg)

[The industry standard for data validation and schema definition.](https://docs.pydantic.dev)
:::

:::card{title="Pydantic AI"}
![Pydantic AI logo](/assets/logos/pydantic.svg)

[Production-grade primitives for building agentic workflows.](https://ai.pydantic.dev)
:::
:::
