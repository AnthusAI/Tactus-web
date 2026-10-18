---
path: /validation/
title: Validation
heading: Don’t Pass Mystery Blobs Around
eyebrow: Validation
description: "Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege."
kind: landing
lede: "Validation is the earliest (and cheapest) guardrail in the loop. It turns inputs and outputs into contracts so problems fail fast at the boundary - before they cascade into behavior specifications, evaluations, or incidents."
---

### The story: bags of data vs contracts

If your workflow passes around an unstructured blob of data, everything looks fine until it doesn’t. A key goes missing. A value changes type. A downstream step assumes something exists, and now you’re debugging a production incident that started as “just a small change.”

{{island AnimatedVisualValidationDiagram}}

Validation flips that around. Instead of "hope the data is shaped correctly," you get an explicit contract at the procedure boundary. Inputs are checked before your procedure runs, and outputs are verified before anything else can depend on them.

- **Fewer surprises:** mistakes fail fast at the boundary, not deep inside the workflow.
- **Safer iteration:** refactors can’t silently break callers.
- **More leverage:** schemas unlock generated forms and machine-readable API docs.

This is one way to “close the loop” for AI-assisted development: make a small change, run it, and get an objective signal immediately - not a vague feeling that it “probably works.”

## Schema-first design

In Tactus, schemas live with the procedure. They define what the procedure expects and what it guarantees to return.

{{island AnimatedCodeBlock label="Validation" filename="procedure.tac" hint="Input + output contracts" blockWidth="1400"}}
```tactus
Procedure {
    input = {
        topic = field.string{required = true},
    },
    output = {
        findings = field.string{required = true},
        approved = field.boolean{required = true},
    },
    function(input)
        local findings = "..."
        local approved = false
        return {findings = findings, approved = approved}
    end,
}
```

### What you get (even if you never say “Pydantic”)

When the “interface” is natural language, it’s easy for the shape of data to drift: missing fields, wrong types, half-structured JSON, and brittle glue code. Tactus uses schemas to keep the edges of your workflow predictable.

- **Input validation:** catch bad or missing inputs before any tools run.
- **Output validation:** guarantee that downstream code receives what it expects.
- **Generated UIs:** schemas can drive human-in-the-loop forms and approvals.
- **API docs:** procedures can expose machine-readable contracts (OpenAPI) automatically.

If you want the “how,” it’s built on a widely used Python validation layer: [Pydantic](https://docs.pydantic.dev/latest/).

Validation is the guardrail that catches problems earliest. Then come [behavior specifications](/specifications/) (hard “must not change” rules) and [evaluations](/evaluations/) (a reliability gauge that tells you when a change made things worse).

A practical pattern is pairing output validation with **agent-level retry**: if a model returns the wrong shape (or a transient provider error occurs), Tactus can retry that single agent turn (bounded, with history rollback) before your procedure sees a failure.

That is different from a workflow loop. Agent retry says “repeat this turn.” A procedure loop says “take the next step with new information or feedback.”

## Under the hood: Pydantic models

A schema is more than documentation. It becomes a real validator. If an agent “forgets” a required field, the run fails loudly instead of quietly returning a broken payload.

{{island AnimatedCodeBlock label="Pydantic" filename="schemas.py" hint="Validated classes (high level)" blockWidth="1400"}}
```python
from pydantic import BaseModel

class Output(BaseModel):
    findings: str
    approved: bool
```

The important part isn’t the library name. It’s the effect: the runtime can enforce contracts consistently, generate helpful errors, and keep your workflow honest as it evolves.

{{island AnimatedCodeBlock label="Agent retry" filename="agent.tac" hint="Retry a turn on infra + validation" blockWidth="1400"}}
```tactus
guide = Agent {
  name = "guide",
  provider = "openai",
  model = "openai/gpt-4o-mini",
  system_prompt = "...",
  output = {
    approved = field.boolean{required = true},
    findings = field.string{required = true},
  },
  retry = {
    enabled = true,
    attempts = 3,
    delay_seconds = 0.5,
    backoff = "exponential",
    on = "infra_plus_validation",
  },
}
```

Tactus has multiple retry layers: some standard-library helpers expose their own `max_retries`, Agent retry repeats a single turn, and procedure loops handle workflow-level iteration.

Next: pair this with [behavior specifications](/specifications/) to lock in “what must always be true,” then run [evaluations](/evaluations/) to quantify how often it stays true across real inputs. For the broader “layers of guardrails” story, see [Guardrails](/guardrails/) and [Guiding Principles](/guiding-principles/).
