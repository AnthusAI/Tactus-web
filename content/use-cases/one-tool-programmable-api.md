---
title: One Tool For Everything
description: Replace a long MCP tool catalog with one context-efficient MCP gateway that runs programmable, self-documenting Tactus APIs.
type: page
---
::band{size="hero" eyebrow="Use Case"}
# One Tool For Everything

Instead of exposing your application as a long list of fine-grained MCP tools, expose one programmable tool that runs sandboxed Tactus code. The host provides an application module, and the model discovers focused documentation only when it needs it, then writes short snippets that compose that module’s APIs into exactly the tool it needs.

::band{tone="muted"}
::island{name="ProgrammableToolGatewayDiagram"}

:::callout{kind="note" title="The pattern"}
The client starts with one tool in context. Tactus provides a programmable runtime. The host module can disclose focused docs and examples on demand, keeping the base context small.
:::

::band
## The problem with many small tools

MCP tool catalogs are easy to start and hard to scale. Every separate tool brings its own name, description, schema, parameters, examples, and selection guidance into the model context. That context is paid for on every LLM call: more tokens, more latency, more cost, and less room for the actual user task.

The deeper cost is attention. A large tool list makes the model spend context and reasoning budget choosing between fine-grained actions. It also displaces other useful context: the user’s request, relevant documents, prior work, domain rules, or examples. The model is learning your application one tool schema at a time instead of working inside a compact, discoverable interface.

:::callout{kind="note" title="The replacement"}
- One MCP tool in the initial context, such as `execute_tactus`.
- One host-provided module, such as `require("your_app")`.
- Self-discovery and focused documentation inside that module.
- Programmatic composition in Tactus after the agent has loaded only the docs it needs.
:::

## Progressive disclosure beats tool catalogs

With one programmable tool, the base context only needs to explain the gateway and its discovery surface. The first thing to document is how to ask the tool what it can do. From there, the agent can call focused documentation APIs for the specific capability it needs, get examples, and then write a small Tactus snippet against that part of the host module.

```lua
local app = require("your_app")

local topics = app.docs.list({})
local refunds = app.docs.get({
  topic = "billing.refunds",
  include_examples = true,
})

return {
  available_topics = topics,
  refund_guide = refunds,
}
```

The result is not less documentation. It is documentation loaded at the moment it is useful, instead of a full application manual competing with the user’s request on every turn.

::band{tone="muted"}
## Start with one API call

The host registers a module that Tactus code can import. The smallest useful snippet just loads that module, calls one application API, and returns the result. The module can be written in Tactus or Lua, or it can delegate to Python, SDK calls, internal services, documentation indexes, and background job systems.

```lua
local app = require("your_app")

return app.customers.get({ id = input.customer_id })
```

That is already enough to change the integration shape. The MCP client does not need a dedicated `get_customer` tool schema. It needs one governed way to run a short program against the host-provided API surface.

These generic examples use an explicit `return` because Lua chunks do not automatically return the final expression. A host can still wrap submitted snippets with convenience bindings. Plexus does that: it injects `plexus` and captures the result of the last Plexus API call, so explicit `return` is only needed when the snippet wants to shape a custom response.

:::callout{kind="note" title="When a normal catalog is simpler"}
If you only have a few unrelated operations, ordinary MCP tools are easier to explain and operate. Use this one-tool pattern when the host application has a broad, related API surface that benefits from discovery, composition, and focused docs on demand.
:::

:::callout{kind="note" title="Then add the next call"}
Once a single call is clear, the next step is ordinary programming: use the result of one app API call to parameterize another.
:::

```lua
local app = require("your_app")

local customer = app.customers.get({ id = input.customer_id })
local tickets = app.tickets.search({
  customer_id = customer.id,
  status = "open",
  limit = 5,
})

return {
  name = customer.name,
  open_ticket_count = #tickets,
  tickets = tickets,
}
```

::band
## Why not just run Python or JavaScript?

It is natural to ask why the programmable payload is Tactus instead of Python or JavaScript. Those languages are excellent for implementing the host application. Your Tactus module can still delegate to Python SDKs, TypeScript services, queues, databases, documentation indexes, and internal APIs.

The payload is different. It is code the agent writes for the current task. If that payload is general-purpose Python or JavaScript, the host has to build a separate safety system around it: import rules, package rules, filesystem rules, network rules, timeouts, approvals, traces, budget accounting, and structured return handling.

Tactus starts from the other direction. The snippet is already a bounded procedure. It gets capabilities through the host module, asks for focused docs when needed, calls explicit tools or `Agent`s, and returns a structured result. The host can still be implemented in Python or JavaScript; Tactus is the controlled boundary where agent-written code runs.

:::callout{kind="note" title="The boundary"}
Use Python or JavaScript behind the host API. Use Tactus at the boundary where agent-written code runs.
:::

::band
## The model can create task-specific tools

AI models are strong at writing glue code. With this pattern, the model can turn low-level application APIs into a one-off tool for the current task, then return only the structured result the MCP client needs.

```lua
local app = require("your_app")

local function build_account_brief(customer_id)
  local customer = app.customers.get({ id = customer_id })
  local invoices = app.billing.list_invoices({ customer_id = customer_id })
  local tickets = app.tickets.search({ customer_id = customer_id })

  return app.summaries.account_brief({
    customer = customer,
    invoices = invoices,
    tickets = tickets,
  })
end

return build_account_brief(input.customer_id)
```

The host still owns capability boundaries. The snippet can only call the module APIs you expose, within the runtime controls you configure.

::band{tone="muted"}
## The one tool can call a sub-agent

Tactus has `Agent` as a first-class primitive, so the code submitted to the programmable tool can define or call a bounded sub-agent. That sub-agent can run agentic patterns such as investigation loops while its tools remain restricted to the application APIs the host provides.

```lua
local app = require("your_app")
local done = require("tactus.tools.done")

find_cases = Tool {
  description = "Find related cases for a customer",
  input = { customer_id = field.string{ required = true } },
  function(args)
    return app.cases.search({ customer_id = args.customer_id })
  end,
}

investigator = Agent {
  model = "openai/gpt-4o-mini",
  system_prompt = [[
Investigate the customer history. Use find_cases when you need facts.
Call done when you can explain the likely next step.
  ]],
  tools = {find_cases, done},
}

return investigator({
  message = "Decide what should happen next for " .. input.customer_id,
})
```

This changes the integration boundary. The outer assistant does not just call your app’s tools. It can delegate a small, governed agentic workflow into your app’s runtime and receive a structured result back.

::band
## Controls stay attached

A programmable gateway is only useful if it stays governed. Tactus gives the host a place to enforce sandboxing, module boundaries, API-call accounting, structured errors, trace files, budgets, human approvals, and async handles for long-running work. This is the reason to use Tactus at the payload boundary: the agent-written code starts inside the governed runtime instead of relying on a separate safety harness wrapped around a general-purpose script.

:::callout{kind="note" title="Use this pattern when"}
- Your product has many related operations.
- Agents need to compose multiple calls in one task.
- You want lazy documentation and self-discovery.
- You need sandboxing, budget controls, HITL, and traces around AI-contributed code.
:::

::band{tone="muted"}
## Case study: Plexus

Plexus uses this pattern for its MCP integration. The client gets one tool, `execute_tactus`. Inside that tool, Tactus snippets call Plexus APIs for scorecards, scores, feedback, evaluations, reports, procedures, documentation, budgets, and async handles.

The general host-module pattern is still `require("your_app")`. Plexus hides that bootstrap inside `execute_tactus`: the runtime injects a global `plexus` module and helper aliases before the snippet runs, so the agent does not have to remember the import line.

```lua
local docs = plexus.docs.get({ key = "overview" })
local score = plexus.score.info({
  scorecard_identifier = "Quality Assurance",
  score_identifier = "Compliance",
})

return {
  docs_preview = docs.content,
  score = score,
}
```

The public Plexus docs describe the concrete runtime surface: [Plexus MCP / Tactus Runtime](https://plexus.anth.us/documentation/advanced/mcp-server).

::band{columns="cta"}
## See the broader architecture

The same control surfaces show up across Tactus: sandboxing, secretless execution, staged capabilities, and human checkpoints.

::button{href="/guardrails/" label="Read the Guardrails" size="lg"}
