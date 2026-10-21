---
title: Behavior Specifications
description: Turn procedures into verifiable artifacts with inline behavioral specifications.
type: page
---
::band{size="hero" eyebrow="Behavior Specifications"}
# Trust, but Verify (and Re-verify)

Tactus turns procedures into verifiable artifacts. Specs live inline with the code, run as part of the toolchain, and fail loudly when behavior drifts - so you can iterate fast without losing features (or sleep).

::band{tone="muted"}
## What is a Behavior Specification?

Imagine you are hiring a human contractor. You don't give them a script saying "move your left foot, then your right foot." You give them a goal ("paint the house") and a set of rules ("don't spill paint on the driveway" and "finish by Friday").

::island{name="AnimatedVisualSpecificationsDiagram"}

A **Specification** is that set of rules for your AI agent. It acts like a gatekeeper. It doesn't care exactly how the agent solves the problem—which words it chooses or which tool it picks first—as long as the final result meets the requirements and no safety rules were broken.

:::callout{kind="note" title="The three rules of a spec"}
- **It defines success:** "Did we get a valid answer?"
- **It sets boundaries:** "Did we avoid forbidden tools?"
- **It allows variation:** "Any path is fine, as long as it works."
:::

### Why "Old School" Testing Breaks

Traditional software tests are rigid. They often say: *"The output must be exactly 'Hello World'."* If the program outputs "Hello, World!" (with a comma), the test fails.

That works for math, but it fails for AI. AI is creative. It might say "Hi there" or "Greetings." Both are correct, but a rigid test would mark them as failures.

This is why specs focus on **invariants**. Instead of "text must be X," a spec says "text must be polite" or "text must contain the answer." Under the hood, Tactus can leverage powerful evaluator libraries like **DSPy** to implement "LLM-as-a-judge" assertions. This allows you to verify intent without being brittle about wording.

::band
## Verifiable Artifacts Scale Delegation

Agile works because it manages the risk of change with small, verifiable steps. AI makes iteration even cheaper: you can ask for ten changes before your coffee cools. That is a superpower - and a regression factory.

When you hand a codebase to a human contractor, you do not just "hope they remember everything." You protect yourself with a verifiable test suite, and you ask for small changes so you can prove you did not lose anything important. Specs are that same safety net for AI coding assistants.

Specs are also guardrails for change: you can refactor, swap models, or reorganize a procedure however you want, as long as the behaviors you care about still pass. That freedom-with-boundaries is how you get real leverage from AI without losing control.

The goal is not perfection - it is controlled change. You let the agent innovate, but you keep a tight contract for what must stay true. That contract is executable. The verifier is always on.

:::callout{kind="note" title="Opinionated by design"}
- Untested procedures are incomplete artifacts
- Specs are supervision: they replace constant babysitting
- Cheap tests enable rapid, safe iteration
- Reliability is measured, not assumed
:::

::band
## Specs Are Part of the Language

In Tactus, the procedure and the specs are one unit: one file, one parse tree, one artifact you can run and verify. This is why specs are written inline, right next to the code they test.

Because the language can parse procedure + specs together, the toolchain can treat missing tests as a first-class problem: it can warn when a procedure ships without specs, extract scenario metadata, and feed results into your reliability loop.

This is also token-efficient. Instead of repeating long prompt reminders like "never call the deploy tool" in every instruction, you can encode the invariant once as a spec - and let the runtime enforce it.

:::callout{kind="note" title="Why inline matters"}
- Code and specs change together in a single diff
- The toolchain can warn when specs are missing
- Agents can read, modify, and re-run tests without extra context
- Specs replace long prompt rules, saving tokens
- Multi-run tests turn "it worked once" into a pass rate
:::

::island{name="SpecificationsDiagram"}

Notice what the spec asserts: it does not demand a specific JSON blob. It demands that a decision is produced, that the procedure completes, and that specific outputs exist.

You can tighten the contract: "Then the response should contain a summary" or "Then the deploy tool should not be called." These constraints allow the agent freedom to solve the problem while guaranteeing the boundaries you care about (and keeping your laptop out of the incident postmortem).

::band
:::callout{kind="tip" title="What is Gherkin?"}
**Given / When / Then**

[Gherkin](https://cucumber.io/docs/gherkin/reference/) is the plain-language syntax used by [Cucumber](https://cucumber.io/) (a popular testing tool for behavior-driven development). It uses the familiar "Given / When / Then" structure described in ["Introducing BDD" (behavior-driven development)](https://dannorth.net/blog/introducing-bdd/), but with a strict, parseable grammar so it can run as an automated test.
:::

::band
## What Specs Actually Assert

A good spec is a set of invariants: what must be true no matter how the agent gets there. These are the properties that keep you out of incident postmortems.

Three patterns show up again and again in production workflows:

:::callout{kind="note" title="Three patterns"}
- Assert capability boundaries (what tools can or cannot happen)
- Assert progress markers (state keys and stage transitions)
- Assert output shape + constraints (existence, patterns, ranges)
:::

Tactus ships with a rich library of built-in steps so you can focus on intent, not glue code:

:::card-grid{columns=2 label="Built-in steps"}
:::card{title="Tool policy"}
- `the send_email tool should not be called`
- `the search tool should be called at least 1 time`
- `the deploy tool should be called with env=prod`
:::

:::card{title="State + stages"}
- `the state message_id should exist`
- `the stage should be complete`
- `the stage should transition from draft to send`
:::

:::card{title="Outputs"}
- `the output summary should exist`
- `the output subject should match pattern`
- `the output action_items should exist`
:::

:::card{title="Flow + safety"}
- `the procedure should complete successfully`
- `the total iterations should be less than 20`
- `the stop reason should contain "approved"`
:::
:::

Need a domain-specific check? Add a custom step in Lua. Keep it deterministic and small - custom steps are test code, not workflow code.

::band{tone="muted"}
## The Vanishing Features Problem

If you build with AI assistants, you have seen this: you ship three features in a row, then notice the first one quietly disappeared. It was not malicious - it was just drift.

Specs stop that. Each feature becomes a verifiable artifact. If the spec passes, the behavior you care about still exists. If it fails, you know exactly what vanished - and you can send the agent back to fix it before your cloud account becomes a crime scene.

Specs are the part that does not forget. They are how you safely delegate work to AI: trust it to iterate, but give it a suite that can say "yes" or "no" without you in the loop.

::band
## Make Reliability Measurable

One successful run is luck. Reliability is a statistic. Specs answer "can it do the right thing?" Reliability asks "how often does it do the right thing?" [Evaluations](/evaluations/) help you measure quality over real inputs. You need both to ship agentic systems with confidence.

:::card-grid{columns=3 label="Commands"}
:::card{title="Run specs"}
```bash
tactus test path/to/procedure.tac
tactus test path/to/procedure.tac --scenario "Scenario name"
```
:::

:::card{title="Fast + deterministic"}
```bash
tactus test path/to/procedure.tac --mock
tactus test path/to/procedure.tac --mock --runs 10
```
:::

:::card{title="Measure reliability"}
```bash
tactus test path/to/procedure.tac --runs 10
tactus eval path/to/procedure.tac --runs 10
```
:::
:::

:::callout{kind="note" title="A practical loop"}
- Write specs + mocks first
- Run `tactus test --mock` until the logic is stable
- Run in real mode, then measure pass rate with `--runs`
- Add eval cases to track quality over realistic inputs
:::

Mock mode keeps tests cheap and deterministic by using `Mocks { ... }`. Multi-run specs and evals turn "it worked once" into a measurable reliability rate.

This is a layered guardrails stack: [validation](/validation/) catches missing fields and wrong types early, specs lock in what must not change (and prevent vanishing features), and [evaluations](/evaluations/) act like a reliability gauge. Together they close the loop so an agent can iterate and self-check without you watching every step. See [Guardrails](/guardrails/) and [Guiding Principles](/guiding-principles/).

::band{columns="cta"}
## Ready to write specs?

Learn how to add behavioral testing to your agent workflows.

::button{href="/getting-started/" label="Get Started" size="lg"}
