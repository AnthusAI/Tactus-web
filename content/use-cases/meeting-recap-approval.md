---
title: Meeting Recap with Approval
description: 'Use case: a durable meeting recap workflow with approval gates before sending.'
type: page
---
::band{size="hero" eyebrow="Use Case"}
# Meeting Recap with Approval

Draft an email recap from messy notes, pause for review, then send - with durable human-in-the-loop gates before irreversible actions.

::band{tone="muted"}
## Why Tactus Fits

This is a classic “agent + tools + side effects” workflow. The hard part isn’t generating text - it’s making the system safe when you’re not watching every run.

:::callout{kind="tip" title="Guardrails to use"}
- [Guardrails](/guardrails/): staged tool access and “review before send”
- [Behavior specs](/specifications/): `send_email` must never be called without approval
- [Validation](/validation/): subject/body/action items must be present and shaped correctly
:::

This page is a starter stub. Next we’ll add a runnable procedure and a spec suite that prevents accidental double-sends and missing approvals.

::band{columns="cta"}
## Browse more use cases

Pick another workflow pattern to learn.

::button{href="/use-cases/" label="Use Cases" size="lg"}
