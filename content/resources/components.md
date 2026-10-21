---
title: Standard Component Library
description: 'Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege.'
type: page
---
::band{size="hero" eyebrow="Resources"}
# Standard Component Library

The Tactus component library provides a consistent set of Human-in-the-Loop UI primitives for approvals, inputs, reviews, and batched forms. Use these in host applications to keep HITL experiences predictable and on-brand while staying aligned with the Tactus runtime.

::band
:::card-grid{columns=1 label="Component library"}
:::card{title="Component library on GitHub" icon="svg-github"}
Browse the source, run Storybook, and integrate the standard HITL UI components into your own applications.

[Open the repository](https://github.com/AnthusAI/Tactus-HITL-components)
:::
:::

::band{tone="muted"}
## Approvals and Escalations

:::card-grid{columns=2 label="Approvals and escalations"}
:::card{}
::island{name="HitlDemo" demo="components-approval"}
:::

:::card{}
::island{name="HitlDemo" demo="components-escalation"}
:::
:::

::band
## Inputs and Selection

:::card-grid{columns=3 label="Inputs and selection"}
:::card{}
::island{name="HitlDemo" demo="components-text"}
:::

:::card{}
::island{name="HitlDemo" demo="components-select-single"}
:::

:::card{}
::island{name="HitlDemo" demo="components-select-multiple"}
:::
:::

::band{tone="muted"}
## Reviews and Uploads

:::card-grid{columns=2 label="Reviews and uploads"}
:::card{}
::island{name="HitlDemo" demo="components-review"}
:::

:::card{}
::island{name="HitlDemo" demo="components-upload"}
:::
:::

::band
## Batched Forms

Use batched inputs to collect multiple fields in one HITL interaction with tabbed navigation and validation.

::island{name="HitlDemo" demo="components-inputs"}
