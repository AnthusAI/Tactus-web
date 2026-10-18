---
path: /getting-started/projects/
title: Projects to try
heading: Projects to try
eyebrow: Getting Started
description: "Getting started projects: embed a copilot in your app and explore Human-in-the-Loop interactions using the Tactus IDE and component library."
kind: landing
lede: "A practical way to learn Tactus is to pick a concrete project and build a tiny end-to-end loop: chat UI, tools, and a couple of human checkpoints."
muted: [2]
---

:::callout{kind="note" title="Use the IDE to explore"}
The [Tactus IDE](/download/) includes the standard Human-in-the-Loop components. Use the IDE to experience the interactions quickly, then embed the same components in your own app when you are ready.

Component reference: [Resources → Standard Component Library](/resources/components/)
:::

---

## Project: embed a copilot in your app

Imagine a chat-based copilot inside your product. It can call your tools to propose changes and drafts, but it pauses for explicit human confirmation at the seams where mistakes are costly.

:::card-grid{columns=2 label="Checkpoints"}
:::card{title="Checkpoint 1: approve side effects"}
*“I’m about to call a tool that changes the world.”*

{{island HitlDemo demo="projects-approval"}}
:::

:::card{title="Checkpoint 2: collect missing details"}
*“I can do it, but I need two fields from you.”*

{{island HitlDemo demo="projects-inputs"}}
:::
:::

{{actions}}

[Read the copilot use case](/use-cases/copilot-anything/) · [Browse use cases](/use-cases/)

---

## Next steps

- Start from a runnable example: [browse examples](/examples/)
- Read the use case for the UX story: [A copilot for anything](/use-cases/copilot-anything/)
- Embed the components directly in your app: [Tactus-HITL-components on GitHub](https://github.com/AnthusAI/Tactus-HITL-components)
