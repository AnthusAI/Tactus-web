---
path: /evaluations/
title: Evaluations
heading: Stop Shipping Lucky Demos
eyebrow: Evaluations
description: Measure agent reliability, cost, and accuracy with built-in evaluation primitives.
kind: landing
lede: "A behavior spec tells you whether one run is right. An evaluation tells you how often it is right across real inputs - so you can compare changes, catch drift, and ship with a reliability number instead of a vibe."
call_to_action:
  title: Start measuring
  text: Don’t guess. Know. Learn how to set up your first evaluation suite.
  label: Get Started
  to: /getting-started/
---

## From “It Works” to “It Works 98% of the Time”

Two engineers build an agentic procedure to flag compliance risks in emails. Both can give a great demo. Both can show you a run where it “works.”

{{island AnimatedVisualEvaluationsDiagram}}

Then you run an evaluation: 100 realistic emails, scored the same way every time. One implementation is right 48% of the time. The other is right 98% of the time. Those are not “both fine.” They are different systems.

Specs let you decide what “right” means. Evaluations take that definition and turn it into a statistic: success rate, latency, tokens, and “did it break in the messy cases?”

:::callout{kind="note" title="Specs vs evaluations"}
- **Behavior specs** answer “is it right?” for one run
- **Evaluations** answer “how often is it right?” over a dataset
- Specs protect invariants and prevent “vanishing features”
- Evals reveal brittleness, drift, and reliability deltas
:::

Think of evals as a gauge, not a gate: specs are pass/fail guardrails; evals tell you whether your change made the system better or worse. Pair evals with [validation](/validation/) to fail fast at the boundary, and with [behavior specifications](/specifications/) to lock in what must not change. See [Guardrails](/guardrails/) and [Guiding Principles](/guiding-principles/).

---

## First-Class Evaluations (Inline, Like Specs)

Tactus treats evaluation as part of the procedure file, not a separate test project. You declare an evaluation dataset and evaluators inline, next to the code they measure.

If you want the background on why Tactus is opinionated about this, start with [behavior specifications](/specifications/). Evals build on the same idea: define “right,” then measure it across realistic inputs.

{{island EvaluationsDiagram}}

Run this against 50 or 500 cases. Tactus handles parallel execution, error catching, and aggregating results into a report you can track over time.

:::callout{kind="note" title="What to measure"}
- **Accuracy:** did it meet the spec for this case?
- **Reliability:** does it keep meeting it across runs?
- **Semantic Quality:** uses LLM-as-a-judge (via DSPy) to grade tone, helpfulness, and safety.
- **Cost + tokens:** what does “good” cost at scale?
- **Tool usage:** did it call the right tools (or the forbidden ones)?
:::

---

## Run Evals (and Compare to Specs)

Run once to see detailed results, then run multiple times to measure consistency. Keep specs in the loop too: specs are great at catching hard invariant violations; evals are great at quantifying quality and reliability.

:::card-grid{columns=3 label="Commands"}
:::card{title="Run once"}
```bash
tactus eval path/to/procedure.tac
```
:::

:::card{title="Measure consistency"}
```bash
tactus eval path/to/procedure.tac --runs 10
tactus eval path/to/procedure.tac --runs 10 --no-parallel
```
:::

:::card{title="Repeat specs"}
```bash
tactus test path/to/procedure.tac
tactus test path/to/procedure.tac --runs 10
```
:::
:::

Treat evals as a scoreboard and a gate: if success rate drops after a change, you have an objective regression report instead of a debate (or a production incident).
