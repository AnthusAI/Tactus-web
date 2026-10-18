---
path: /use-cases/contact-import/
title: Contact Import
heading: Contact Import
eyebrow: Use Case
description: "Use case: import contacts by combining schema-first tools with agent mapping and evaluation guardrails."
kind: landing
lede: Turn messy input formats into structured records by defining the capability (schema) and letting an agent do the mapping inside strict tool boundaries.
call_to_action:
  title: Browse more use cases
  text: Pick another workflow pattern to learn.
  label: Use Cases
  to: /use-cases/
---

## The Pattern

Instead of writing endless conditional logic for every input variation, you define a tool like `create_contact` with a strict schema, then give the agent the messy row and a clear instruction.

### Architecture: Deep Integration

:::figure{src="/assets/deep-integration.svg" alt="A user presses a button in your product. The Tactus runtime starts a procedure, which calls tools and APIs that change state in your system, or queues work for human review." caption="A user clicks a button in your product (e.g., “Import”)."}
:::

:::callout{kind="note" title="What makes this “deep integration”"}
- It feels like a normal product feature: a button, a form, a menu item—not “go talk to a bot.”
- The procedure can call tools to change real state (create a record, attach a note, push to your CRM).
- When it hits a risky step, it can pause and request human approval asynchronously—without blocking the rest of the system.
:::

:::callout{kind="tip" title="Guardrails to use"}
- [Validation](/validation/): the tool schema is the contract
- [Guardrails](/guardrails/): least privilege + allowlists at the tool boundary
- [Evaluations](/evaluations/): measure success rate across varied input formats
:::

This page is a starter stub. Next we’ll add a runnable procedure, a small dataset of varied contact formats, and a simple review flow so you can evaluate reliability end-to-end.
