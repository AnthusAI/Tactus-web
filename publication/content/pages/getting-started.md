---
path: /getting-started/
title: Getting Started
heading: Get Started
description: "Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege."
kind: landing
lede: The fastest way to learn Tactus is to clone the examples repo and run procedures that already have embedded specifications.
muted: [3, 4]
---

:::card-grid{columns=2 label="Ways to start"}
:::card{title="Tactus IDE"}
The best way to write, run, and debug agents. Includes a visual interface for human-in-the-loop interactions and a live view of agent execution.

[Download IDE](/download/)
:::

:::card{title="Command Line"}
Install the CLI, clone `Tactus-examples`, then run specs in mock mode (no API keys) before running against real models.

Editing in VS Code? Install the [Tactus extension](https://marketplace.visualstudio.com/items?itemName=AnthusAISolutions.tactus) for syntax highlighting and code intelligence.

```bash
$ pip install tactus
$ git clone https://github.com/AnthusAI/Tactus-examples.git
$ cd Tactus-examples

# Run the spec suite without API keys (fast, deterministic)
$ tactus test 01-getting-started/01-hello-world.tac --mock

# Docker sandboxing is required by default
# Use --no-sandbox to opt out when isolation is not needed

# Run it for real (requires OPENAI_API_KEY)
$ export OPENAI_API_KEY=your-key
$ tactus run 01-getting-started/01-hello-world.tac
```
:::
:::

## Hello, world (from Tactus-examples)

This is the canonical Hello World example from the `Tactus-examples` repository. It includes an embedded behavior specification so you can test it deterministically in mock mode.

{{example-code hello-world}}

Source: {{example-link hello-world}} · [How to download and run examples](/examples/)

:::card-grid{columns=2 label="Run it"}
:::card{title="Run it with the IDE"}
1. Download Tactus for your OS from [Download](/download/).
2. Open the app — it includes example procedures ready to run.
3. Open the Hello World example, then press **Run**.
:::

:::card{title="Run it with the CLI"}
1. Install Tactus: `pip install tactus`
2. Clone examples: `git clone https://github.com/AnthusAI/Tactus-examples.git`
3. Run specs without API keys: `tactus test 01-getting-started/01-hello-world.tac --mock`
4. Run for real: `export OPENAI_API_KEY=your-key`, then `tactus run 01-getting-started/01-hello-world.tac`
5. No Docker? Add `--no-sandbox` to the `tactus run` command to opt out explicitly.
:::
:::

## Explore More Examples

Start with the curated examples repo. Each example is designed to be runnable and includes embedded behavior specifications, so you can verify your environment before you spend tokens.

[Browse Examples](/examples/) · [Examples on GitHub](https://github.com/AnthusAI/Tactus-examples)

## Try a project

Use cases are concrete project ideas. If you want a strong first build, start with an embedded copilot and add one or two Human-in-the-Loop checkpoints.

The [Tactus IDE](/download/) includes the standard Human-in-the-Loop components. Use the IDE as a safe playground to experience approvals and structured inputs, then embed the same components in any application.

[Read the copilot use case](/use-cases/copilot-anything/) · [Projects to try](/getting-started/projects/)

Component reference: [Standard Component Library](/resources/components/)

**HITL preview**

{{island HitlDemo demo="getting-started-approval"}}

## Docker sandbox by default

The CLI runs procedures inside a Docker sandbox by default and will error if Docker is not available. This prevents accidental non-isolated runs.

If your architecture does not require container isolation for every invocation, opt out explicitly with `--no-sandbox` or set `sandbox.enabled: false` in your config.

When you install from PyPI, the sandbox image builds by installing the matching Tactus version inside the container. When a source checkout is available, the image bakes in the local source instead.

## Prototype supervised, then step back safely

A practical way to automate real work is to start in a supervised interface (Claude Code, Cursor, etc.), then gradually harden what you built into governed procedures. Supervision is a feature while you're exploring—but it becomes a bottleneck if a human must watch every step.

### Prototype (closely supervised)

Start with a Skill and iterate fast while you're watching: the agent has freedom, and you can correct course in real time.

1. Prototype a workflow as an agent Skill.
2. Use MCP servers to connect narrow toolsets like Stripe or Freshdesk; for broad internal APIs, expose one programmable Tactus gateway with focused docs on demand.
3. Tighten the steps until the workflow is boring and repeatable.

{{island HitlDiagram variant="supervised" withStart="true"}}

### Step back (asynchronous human checkpoint)

Then harden the workflow into a governed procedure: make data flow predictable, add guardrails, and pause for human input only when needed so the system can run while you're away.

1. Pre-call tools in imperative code when possible (fetch first, then pass results to the model).
2. Add validation, specs, and evaluations so reliability is measurable.
3. Add human checkpoints for high-risk steps so a person stays accountable.

{{island HitlDiagram variant="queued" withStart="true"}}

This workflow pairs well with open standards: [Agent Skills](https://agentskills.io/home) for packaging repeatable agent behavior, and [MCP](https://modelcontextprotocol.io/) for connecting tools like Stripe, ticketing systems, and internal APIs. For a small set of unrelated actions, a normal MCP tool catalog is a good fit; for a large application surface, the one-tool Tactus gateway keeps context smaller and lets the agent discover details only when needed.

:::callout{kind="note" title="Case study: Refund ops automation"}
This started as a supervised Skill that processes an Excel file and issues Stripe refunds in sequence. Once it proved useful, it was hardened into a governed procedure: inputs validated up front, tool data fetched deterministically, human checkpoints added for high-risk rows, and an audit trail produced for confidence and compliance.

[Read the case study](/use-cases/refund-ops/) · [Business process automation overview](/use-cases/business-process-automation/)
:::

The goal is not to give a monkey a razor blade and hope for the best. The goal is controlled delegation: let the agent do the repetitive work, and keep humans in charge of the outcomes with full transparency through logging and tracing.

---

## More learning resources

If you want to go deeper, the books and videos cover the ideas, patterns, and design philosophy behind Tactus.

---

## The Tactus Book Series

Three complementary books: learn the patterns, dive into the reference, or keep the cheat sheet on your desk.

{{books}}

---

## Videos

Short walkthroughs and longer deep dives. Start with these two — then browse the rest.

{{videos-featured}}

[Watch videos](/videos/)
