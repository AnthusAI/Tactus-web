---
path: /use-cases/meeting-recap-approval/
title: Meeting Recap with Approval
heading: Meeting Recap with Approval
eyebrow: Use Case
description: "Use case: a durable meeting recap workflow with approval gates before sending."
kind: landing
lede: Draft an email recap from messy notes, pause for review, then send - with durable human-in-the-loop gates before irreversible actions.
muted: [1]
call_to_action:
  title: Browse more use cases
  text: Pick another workflow pattern to learn.
  label: Use Cases
  to: /use-cases/
---

## Why Tactus Fits

This is a classic “agent + tools + side effects” workflow. The hard part isn’t generating text - it’s making the system safe when you’re not watching every run.

:::callout{kind="tip" title="Guardrails to use"}
- [Guardrails](/guardrails/): staged tool access and “review before send”
- [Behavior specs](/specifications/): `send_email` must never be called without approval
- [Validation](/validation/): subject/body/action items must be present and shaped correctly
:::

This page is a starter stub. Next we’ll add a runnable procedure and a spec suite that prevents accidental double-sends and missing approvals.
