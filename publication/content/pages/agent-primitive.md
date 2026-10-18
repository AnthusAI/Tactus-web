---
path: /agent-primitive/
title: Agent Primitive
heading: Stateful reasoning, safely
eyebrow: Agent Primitive
description: The Agent primitive is Tactus's stateful, tool-using runtime for multi-turn reasoning and autonomy.
kind: landing
lede: "The Agent primitive is a conversational, tool-using runtime. Agents can plan, call tools, and carry state across turns. Tactus wraps that flexibility in guardrails so you can ship real automation without losing control."
---

### What an Agent is built for

- **Multi-turn reasoning:** iterate until the task is done.
- **Tool use:** call APIs, query data, and stage side effects.
- **Guardrails:** specs, evaluations, and human-in-the-loop checkpoints.

If you just need repeatable predictions, use a Model. If you need a system that can think, adapt, and act, you want an Agent.

## Declare the agent

Agents define a model, a system prompt, and the tools they can call.

{{island AnimatedCodeBlock label="Agent" filename="agent.tac" hint="Agent declaration"}}
```tactus
local done = require("tactus.tools.done")

lookup_customer = Tool {
  description = "Look up a customer record",
  input = { id = field.string{required = true} },
  function(args)
    -- In a real system, this would call your database or API.
    return {id = args.id, plan = "pro"}
  end
}

triage_agent = Agent {
  model = "openai/gpt-4o-mini",
  system_prompt = [[
You triage support messages into labels: billing, account, bug, other.
Use lookup_customer when you need account context. Call done when finished.
  ]],
  tools = {lookup_customer, done}
}
```

## Run the agent inside a procedure

Agents live inside procedures so you can validate inputs, outputs, and behavior.

{{island AnimatedCodeBlock label="Usage" filename="procedure.tac" hint="Agent in a procedure"}}
```tactus
Procedure {
  input = {
    message = field.string{required = true}
  },
  output = {
    label = field.string{required = true}
  },
  function(input)
    local result = triage_agent({message = input.message})
    return {label = result.output}
  end
}
```

## Control tools per turn

Tools are an agent's capability boundary. You can override them per call to keep autonomy safe and predictable.

{{island AnimatedCodeBlock label="Tools" filename="turns.tac" hint="Per-turn tool control"}}
```tactus
-- Full tools turn: gather facts.
triage_agent({message = "Look up the customer before deciding.", tools = {lookup_customer, done}})

-- No-tools turn: summarize/decide without new capabilities.
triage_agent({message = "Summarize findings. No new tool calls.", tools = {}})
```

## Test with mocks

Specs should validate your control flow. Mock agent tool calls and messages so tests are deterministic and cheap.

{{island AnimatedCodeBlock label="Mocks" filename="mocks.tac" hint="Mock agent behavior"}}
```tactus
Mocks {
  triage_agent = {
    tool_calls = {
      {tool = "lookup_customer", args = {id = "123"}},
      {tool = "done", args = {reason = "Classified"}}
    },
    message = "billing"
  }
}
```

{{island AnimatedCodeBlock label="CLI" filename="terminal" hint="Mocked vs real runs"}}
```bash
# In CI, run deterministically (no LLM calls).
tactus test file.tac --mock

# When you're ready, run against a real model.
tactus test file.tac
```

### Guardrails matter more with Agents

Agents can take actions. That power demands controls: validations, behavior specifications, evaluations, and approvals. Tactus bakes those in so autonomy does not mean chaos.
