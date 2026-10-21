---
title: Guiding Principles
description: 'Tactus is an opinionated system: principles like shift-left validation, inline behavior specs, and evaluations that close the loop on agent reliability.'
type: page
---
::band{size="hero" eyebrow="Concepts"}
# Opinions, On Purpose

Tactus is an opinionated system: a curated set of principles for building agentic software that stays safe, measurable, and maintainable while you iterate quickly.

::band{tone="muted"}
## Why “Opinionated” Is a Feature

Some tools are deliberately unopinionated: flexible, composable, and endlessly customizable. Others bundle a point of view about what works in practice.

**Ruby on Rails** popularized this idea in web development: conventions, defaults, and a coherent stack that helps teams move fast without reinventing the same decisions every week. Frameworks like **Django** and **Phoenix** carry a similar “batteries included” philosophy.

Tactus is that kind of system. Its opinions are about something very specific: how to build software with AI and agents without turning your repo (or your cloud account) into a crime scene.

::band
## Close the Loop: Verifiable Iteration

Agile engineering works because it makes change safe: small steps, continuously verified. AI makes iteration cheaper, which means it can either accelerate progress or accelerate regressions.

The core principle is a feedback loop the agent can use on its own: make a change, run checks, and get an objective signal. Without that loop, you get a lot of output and very little reality: all yang, no yin.

:::callout{kind="note" title="The loop, in layers"}
- **Validation** fails fast on shape/type problems at the boundary ([Validation](/validation/))
- **Behavior specifications** lock in invariants and prevent “vanishing features” ([Specifications](/specifications/))
- **Evaluations** quantify reliability over datasets (“98% vs 78%”) ([Evaluations](/evaluations/))
:::

::band
## Prompts Are Suggestions. Guardrails Are Controls.

Prompting helps. It reduces error rates and shapes behavior. But if your only safety story is “the prompt says don’t,” you’ve built a demo, not a system.

Tactus treats agent workflows as **untrusted execution with the ability to act**. The right approach is defense in depth: multiple layers that each reduce a different class of risk so you don’t bet everything on one fragile assumption.

This idea is explored in depth on [Guardrails](/guardrails/), but it also shows up concretely in the language design: schemas, policies, durable approvals, and tests that are part of the same executable artifact.

::band{tone="muted"}
## Shift Left: Catch Problems Earlier

A mistake is cheapest when you catch it early. The later you find it, the bigger the blast radius: more time wasted, more broken assumptions, more downstream confusion.

That’s why Tactus treats validation as a first-class runtime boundary: it catches missing fields, wrong types, and malformed outputs before you even spend time debugging a failing spec or a degrading evaluation score.

::band
## Everything Is Code (Including the Guardrails)

In Tactus, “the test suite” is not a separate project and “the eval harness” is not an ad-hoc script. Specs and evals live with procedures, in the same file, as one logical unit the tooling can parse and reason about.

That unlocks first-class warnings when code has no guardrails, and it makes it natural to keep behavior, reliability, and interfaces up to date as your system evolves.

::band
## Tools Are the Seam. Enforce Policy There.

Tools are where probabilistic behavior meets deterministic side effects. That’s the seam where you want strict rules: validate inputs, enforce allowlists, apply limits, and log what happened.

This is why Tactus pushes schema-first capabilities and inspectable tool calls: you’re not trying to “trust the model.” You’re engineering boundaries around what it can do.

For the tooling perspective, see [The AI Engineer’s Toolbox](/ai-engineers-toolbox/).

::band{tone="muted"}
## Bounded Autonomy: More Power, More Constraints

If you want agents to do meaningful work without you watching every step, you need constraints that are enforceable.

Some guardrails are “hard” (sandboxing, tool policies, specs). Some are “soft” (evaluation scores that drift). Both matter. Together they let you delegate responsibility while keeping the system inside the boundaries you care about.

For the broader story of layered guardrails beyond testing and validation, see [Guardrails for Agent Autonomy](/guardrails/).

::band
## Default-On Isolation (and Nothing to Steal)

Powerful agents need a cage. Tactus’s default posture is isolation: sandboxed execution, containers, minimal toolsets, and careful trust boundaries.

A key opinion is **secretless execution**: don’t just “hide” credentials from the model - keep them out of the runtime environment entirely. The agent gets results, not keys.

:::callout{kind="note" title="Isolation defaults"}
- Networkless by default, with model/tool calls brokered
- API keys stay outside the runtime and out of prompts
- Least-privilege toolsets and staged access by workflow phase
- Clear trust boundaries + a lightweight threat model
:::

This is the difference between “the agent promised not to” and “the system made it structurally impossible.”

::band{tone="muted"}
## Durability Makes Human-in-the-Loop Real

Approvals aren’t just UX - they’re a security primitive. But they only scale when the workflow can pause, checkpoint, and resume later without keeping a process alive.

That’s why durability shows up as a first-class concern: long-running workflows, staged access to tools, and “review before irreversible actions” can be the default instead of a fragile convention.

::band
## Where to Go Next

- [Guardrails](/guardrails/): sandboxing, least privilege, and enforceable boundaries
- [The AI Engineer’s Toolbox](/ai-engineers-toolbox/): schema-first tools, inspectable calls, staged access
- [Validation](/validation/): contracts at the procedure boundary
- [Behavior specifications](/specifications/): invariants, regression protection, vanishing features
- [Evaluations](/evaluations/): reliability over datasets, drift detection, measurable quality

::band{columns="cta"}
## Ready to build with guardrails?

Start with getting a procedure running, then add validation, specs, and evals as you iterate.

::button{href="/getting-started/" label="Get Started" size="lg"}
