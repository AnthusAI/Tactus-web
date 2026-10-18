---
path: /learn-more/
title: Learn More
heading: Learn More
description: "Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege."
kind: landing
lede: Deep-dive articles that explain how to give agents tools, keep them safe with guardrails, and measure their reliability.
muted: [2, 8]
---

## Guiding Principles {#learn-guiding-principles}

Tactus is opinionated on purpose: close the loop with verifiable iteration, shift left to catch errors early, and use layered guardrails so agents can do real work safely.

{{actions}}

[Read: Principles](/guiding-principles/)

---

## The Tactus Book Series {#learn-books}

Three complementary books: learn the patterns, dive into the reference, or keep the cheat sheet on your desk.

{{books}}

---

## The AI Engineer’s Toolbox {#learn-toolbox}

A marketing-forward perspective on tool design: schema-first capabilities, inspectable tool calls, programmable gateways, context-efficient discovery, and staged access.

{{actions}}

[Read: Toolbox](/ai-engineers-toolbox/)

{{island AnimatedAIEngineersToolboxDiagram}}

---

## Guardrails for Agent Autonomy {#learn-guardrails}

Tactus gives you levers of control at every level: capability, context, network, and human oversight. You don't hope for safety—you engineer it.

{{actions}}

[Read: Guardrails](/guardrails/)

{{island AnimatedGuardrailsStackDiagram}}

---

## Validation {#learn-validation}

Procedures declare typed inputs and outputs, validated with Pydantic. This isn't just decoration: it's a contract that guarantees type safety at the edges of your agentic workflows.

{{actions}}

[Read: Validation](/validation/)

---

## Model Primitive {#learn-model-primitive}

A stateless prediction interface for training, inference, and evaluation. Clean contracts, versioned models, and reliable outputs.

{{actions}}

[Read: Model Primitive](/model-primitive/)

---

## Agent Primitive {#learn-agent-primitive}

A stateful, tool-using runtime for multi-turn reasoning. Guardrails turn autonomy into shippable behavior.

{{actions}}

[Read: Agent Primitive](/agent-primitive/)

---

## Videos {#learn-videos}

Watch the story: visuals + narration that mirror the articles.

{{videos-featured guardrails}}

{{actions}}

[Watch videos](/videos/)

---

## Sandboxing & Isolation {#learn-sandboxing}

Agents run in a Lua sandbox inside a networkless container, constraining what they can touch and firewalling side effects. Privileged operations are brokered by a separate process that holds the secrets. It’s like letting a burglar into an empty building: even if the agent is compromised, there’s nothing valuable inside to steal—and nowhere to send it.

{{actions}}

[Read: Sandboxing](/guardrails/#sandboxing)

{{island ContainerSandboxDiagram}}

---

:::callout{kind="tip" title="Why do we need a new language?"}
We have Python. We have TypeScript. We have powerful agent frameworks. But they were built to manipulate deterministic logic, not probabilistic behavior.

{{video-player why-new-language}}

{{actions}}

[Read: Why a New Language?](/why-new-language/)
:::

---

## Behavior Specifications {#learn-specifications}

Tactus treats behavior specs as part of the language itself: inline with procedures, executable by the runtime, and tied directly to evaluations so reliability stays visible as your system changes.

{{actions}}

[Read: Specifications](/specifications/)

{{island SpecificationsDiagram}}

---

## Evaluations {#learn-evaluations}

One successful run is luck. Reliability is a statistic. Evaluations let you measure accuracy, cost, and reliability performance across datasets so you can ship with confidence.

{{actions}}

[Read: Evaluations](/evaluations/)

{{island EvaluationsDiagram}}
