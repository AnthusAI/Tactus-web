---
title: Text Classification
description: 'Use case: text classification with validation, behavior specifications, and evaluations.'
type: page
---
::band{size="hero" eyebrow="Use Case"}
# Text Classification

A simple, high-signal workflow: take input text and classify it into a small set of labels, with guardrails that keep the output structured and measurable.

::band
## Example: Support inbox triage

Imagine a small team triaging a support inbox. If a billing issue gets labeled as a bug, customers wait longer and engineers lose focus. A lightweight classifier gives you fast routing, but it only works if you keep the output constrained and measurable.

::island{name="EmbeddedRuntimeDiagram"}

{{example-snippet support-inbox-triage}}

Source: {{example-link support-inbox-triage}}

:::callout{kind="note" title="Why this works"}
- The label set is explicit, so validation is trivial.
- The prompt is domain-specific, not a generic classifier.
- `temperature = 0` and `max_retries = 3` keep output stable. Here `max_retries` is the standard-library classifier's own retry loop, not `Agent { retry = ... }`.
- Behavior specs can lock down edge cases like "double charged" being billing.
- Evaluations let you measure accuracy and drift on real tickets.
:::

::band
## What the standard library handles for you

The high-level `Classify` primitive is designed so you can focus on your task (triage, tagging, routing) instead of rewriting the same reliability plumbing every time. Under the hood, it enforces the contract “the answer must be one of these labels” and does the annoying parts: parsing, validation, and retries. You can use `method = "llm"` for semantic classification or `method = "fuzzy"` for fast string similarity matching.

Important: this page uses `max_retries` on the standard-library `Classify` helper. That is a helper-level micro-loop. It is different from the newer `retry = { ... }` option on `Agent`, which retries a full agent turn.

:::callout{kind="note" title="LLM classification guardrails"}
- **Strict label contract:** it only accepts values from your `classes` list.
- **Defensive parsing:** it extracts the classification from the first line, tolerates common formatting (quotes, markdown, punctuation), and handles cases like `"billing - because..."`.
- **Retry loop with feedback:** if the model responds with an invalid label, it retries up to `max_retries` and tells the model exactly what went wrong and what labels are allowed.
- **Structured results:** you get `value`, `confidence` (optional), `explanation`, `retry_count`, and the `raw_response` for debugging.
:::

:::callout{kind="note" title="Fuzzy matching (no LLM calls)"}
- **Fast and offline:** string similarity matching is nearly instant and needs no API keys.
- **Two modes:** binary `expected` matching (Yes/No) or multi-class “best match” from a `classes` list.
- **Tunable behavior:** adjust `threshold` and choose an `algorithm` like `token_set_ratio` to handle reordering and extra words.
:::

:::callout{kind="note" title="Knobs you can tune (no rewrites)"}
- `name`: a stable identifier for traces and BDD mocking.
- `classes`: the allowed output space (and your evaluation labels).
- `prompt`: your domain rules and edge-case guidance.
- `max_retries`: how hard to push for a valid label before failing.
- `temperature`: determinism vs. flexibility (lower = more stable).
- `model`: pick a faster/cheaper model for routing, or a stronger one for nuance.
- `confidence_mode`: keep the default heuristic confidence, or disable it for pure labels.
:::

This behavior is centralized and covered by Tactus’s behavior specs, so you get the improvements without duplicating the logic in every procedure. Want the full API and implementation details? Start with the [Classification module](/stdlib/classify/) docs, then check the [Classify primitive](https://github.com/AnthusAI/Tactus/blob/main/tactus/stdlib/classify/primitive.py) and [LLM classifier](https://github.com/AnthusAI/Tactus/blob/main/tactus/stdlib/classify/llm.py) source.

::band{tone="muted"}
## What You’re Building

Given a piece of text (an email, a ticket, a note), return a label like `spam`, `support`, or `billing` - and do it reliably.

:::callout{kind="note" title="Guardrails to use"}
- [Validation](/validation/): output must always contain a valid label
- [Behavior specs](/specifications/): hard rules (no forbidden tools, required fields exist)
- [Evaluations](/evaluations/): measure accuracy and stability across a dataset
:::

You can also mix strategies. For example, use fuzzy matching to cheaply catch “obvious” cases (typos, reordering, abbreviations), then fall back to the LLM for the messy long tail.

{{example-snippet composite-fuzzy-then-llm}}

Source: {{example-link composite-fuzzy-then-llm}}

:::callout{kind="note" title="More runnable examples"}
- Download and run these locally: [Examples](/examples/)
- Source repo: [github.com/AnthusAI/Tactus-examples](https://github.com/AnthusAI/Tactus-examples)
- Support inbox triage: {{example-link support-inbox-triage}}
- Compose fuzzy matching and LLM classification: {{example-link composite-fuzzy-then-llm}}
:::

Next we can add a runnable spec suite and a small evaluation dataset to measure stability over time.

::band{columns="cta"}
## Browse more use cases

Pick another workflow pattern to learn.

::button{href="/use-cases/" label="Use Cases" size="lg"}
