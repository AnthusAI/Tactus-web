---
path: /why-new-language/
title: Why a New Language?
heading: Why a New Language?
eyebrow: Understanding Tactus
description: Understanding why Tactus was created and how it addresses the unique challenges of operating AI-driven systems in production.
kind: landing
lede: "Since the dawn of electronic computing, there has effectively been only one way to write a computer program. Today, for the first time in more than eighty years, that assumption no longer holds."
muted: [2, 4, 6, 8, 10]
call_to_action:
  title: Ready to start building?
  text: Learn how to write your first Tactus procedure and explore the language features that make behavior-driven programming natural.
  label: Get Started
  to: /getting-started/
---

## Contents

1. [In the Beginning, There Was Machine Code](#beginning)
2. [When Control Flow Stops Being Imperative](#control-flow)
3. [Why Existing Languages and Frameworks Start to Strain](#existing-tools)
4. [The Collapse of Deterministic Best Practices](#determinism)
5. [Why MLOps Alone Is Not Enough](#mlops)
6. [Behavioral Specifications and Evaluation](#specifications)
7. [PrOps: Operating Procedures, Not Just Code or Models](#props)
8. [Why This Leads to a New Language](#new-language)
9. [Conclusion: Evolution, Not Alien DNA](#conclusion)

---

## 1. In the Beginning, There Was Machine Code {#beginning}

In the beginning, there was machine code. At the lowest level, every computer program consists of zeros and ones. These binary patterns encode instructions that the processor executes directly: moving data, performing arithmetic, comparing values, and jumping to different locations based on conditions.

{{island AnimatedCodeBlock label="Machine code" filename="machine-code.bin" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```text
01001000 10001001 11100101
01001000 10000011 11101100 00001000
10001011 00000101 00000000 00000000 00000000 00000000
```

In the earliest era of computing, this was the only way to program a machine. The programmers who worked on ENIAC in 1945, and on EDSAC just a few years later, lived in this world. They didn't write code—they wired circuits and flipped switches. When stored-program computers arrived, they punched cards with numeric opcodes.

It’s hard to overstate how unforgiving—and how literal—that was. At that level, zeros and ones weren’t “data types”; they corresponded to physical states: voltage on a wire, a relay position, or a vacuum tube being on or off. Early programmers didn’t just “write code” — they were often working close enough to the hardware that the constructs they cared about were the machine’s own guts: registers, addresses, and bit patterns.

That’s a recurring theme in the history of programming: as the *problem space* changes, the language evolves so its constructs match what people actually care about. When you’re building a computer, bit patterns are a reasonable abstraction. When you’re trying to make software repeatable, reusable, and fast to change, you need different primitives.

### Assembly Language: Naming the Zeros and Ones

Before assemblers, there was a small mercy: **hexadecimal**. Hex wasn’t invented for computers — it’s ancient — but it became newly useful here. It didn’t change what the machine executed, but it gave humans something to recognize: patterns, boundaries, and chunks you could scan without counting bits.

{{island AnimatedCodeBlock label="Hexadecimal" filename="machine-code.hex" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```text
48 89 E5
48 83 EC 08
8B 05 00 00 00 00
```

Assembly language emerged almost immediately as a response to this problem—as early as the late 1940s on machines like EDSAC at Cambridge. Instead of writing binary encodings, programmers could write symbolic instructions and labels that an assembler would translate into the underlying zeros and ones.

{{island AnimatedCodeBlock label="Assembly language" filename="hello.asm" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```text
section .data
    msg db 'Hello, World!', 0

section .text
    global _start

_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, 13
    syscall
```

Assembly did not change the paradigm. Control flow was still explicit and imperative. But it made the machine's behavior legible to humans. This was the beginning of a long trend: **making the computer do more work so the human could think more clearly.**

And once you have an assembler, you have something bigger than a nicer notation: you have a new kind of workflow. You write one program, and then you run a program to translate it into something the machine can execute.

Put differently: an assembler is itself a computer program. You run it first, and it outputs a new artifact—the machine code your computer will actually run. That means the “act of programming” becomes a two‑step process: write code for humans, then run a program that turns it into code for machines.

This matters because early computer time was incredibly valuable, and yet people still spent some of that precious time on tools that made programming faster, safer, and more repeatable. Almost immediately, we took the new machine and put *other programs* between humans and hardware—so the machine could help us use the machine.

You also get early building blocks for reuse and repeatability. Labels and named routines let you turn “the sequence of steps I do all the time” into something you can call again and again—one of the roots of the subroutine and the function.

From there, the ladder of abstraction rose quickly. In the late 1950s and 1960s, early high-level languages like Fortran, Lisp, COBOL, and ALGOL showed that you could describe computation in terms closer to the problem—math, symbols, business rules, structured control flow—while compilers handled the low-level details. APL pushed this idea even further, compressing entire computations into a dense notation that made the *computer* do more work so the *human* could say more with less.

### Lisp: Code as Data

Lisp emerged in the late 1950s with a different kind of ambition: make symbolic computation practical. One of its defining ideas was that code and data share the same shape — which made programs easier to generate, transform, and reason about. Lists, recursion, and symbolic manipulation weren’t accidental language features—they were the constructs the researchers cared about.

{{island AnimatedCodeBlock label="Lisp" filename="hello.lisp" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```lisp
(defun hello-world ()
  (format t "Hello, World!~%"))

(hello-world)
```

### C: Structured Control Flow

One especially influential descendant of this era was C. Programmers could write structured control flow—functions, loops, conditionals—without manually managing jumps and memory addresses. The compiler handled translation to machine code. The CPU still executed imperative instructions. But humans could now reason about behavior at a higher level.

{{island AnimatedCodeBlock label="C" filename="hello.c" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

Crucially, the mental model remained unchanged: the programmer still fully specified how decisions were made. The abstraction moved up a level, but the paradigm stayed the same.

### C++ and Object-Oriented Programming

C++ and object-oriented programming pushed abstraction further by trying to match a new problem space: large systems made of interacting “things” with state and responsibilities. Instead of reasoning only about control flow, you could reason about entities, boundaries, and relationships—then let the language and runtime enforce some structure.

{{island AnimatedCodeBlock label="C++" filename="greeter.cpp" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```cpp
#include <iostream>
#include <string>

class Greeter {
public:
    std::string name;
    Greeter(std::string n) : name(n) {}
    void greet() {
        std::cout << "Hello, " << name << "!" << std::endl;
    }
};

int main() {
    Greeter g("World");
    g.greet();
    return 0;
}
```

### Ruby: Pseudocode as Code

Languages like Ruby represent another step along the same trajectory: express intent more directly. Ruby deliberately prioritizes expressiveness and readability, allowing code to resemble structured pseudocode. The computer does more work on behalf of the human so the human can focus on the problem, not the bookkeeping.

{{island AnimatedCodeBlock label="Ruby" filename="greeter.rb" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```ruby
class Greeter
  def initialize(name)
    @name = name
  end

  def greet
    puts "Hello, #{@name}!"
  end
end

Greeter.new("World").greet
```

But the role of the programmer had not fundamentally changed. The programmer still described the control flow. The computer still followed instructions.

These examples aren’t meant as a tour of “important languages.” They’re snapshots of a repeating pattern: as software changes, programmers want their language to expose the constructs they actually reason about — and hide the ones they don’t.

### The Pattern Repeats with AI

Today, we're seeing the same pattern repeat. One of the first valuable uses of AI has been to turn it on itself: using AI to write better code, to make programming easier. GitHub Copilot, ChatGPT writing functions, Claude refactoring modules—these tools follow the same trajectory that began with assemblers in the 1940s.

Tactus continues that tradition: it raises the level of abstraction to match what engineers actually care about in agentic systems — procedures, tool use, guardrails, checkpoints, and evaluation — so you can express those concerns directly.

{{island AnimatedCodeBlock label="Tactus: Hello World" filename="hello_world.tactus" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```tactus
World = Agent {
    model = "openai/gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").output
```

But this time, something deeper is changing. It's not just another layer of abstraction over imperative code. The way decisions are made is fundamentally different. Control flow is no longer something you fully specify in advance—it emerges from interaction between models, data, and constraints.

For most of computing history, progress in programming meant raising the level at which humans describe imperative control flow for a CPU. What comes next is not another step along that same line. It is a change in direction.

---

## 2. When Control Flow Stops Being Imperative {#control-flow}

For most of computing history, control flow has been something the programmer fully specifies in advance. Every branch, every loop, every decision point is encoded explicitly in the program. Given the same inputs, the program follows the same path and produces the same outputs.

That assumption no longer holds.

In modern systems, an increasing share of decisions are made not by imperative logic written by a human, but by machine learning and AI models making predictions. These systems do not follow a single, pre-defined execution path. Instead, they evaluate inputs against learned representations and produce outcomes probabilistically.

:::card-grid{columns=2 label="Comparison"}
:::card{title="Traditional Programming"}
- Control flow is explicit and predetermined
- Same input → same output (deterministic)
- All branches encoded by programmer
- Correctness can be proven in advance
:::

:::card{title="AI-Driven Systems"}
- Control flow emerges from learned behavior
- Same input → varying outputs (probabilistic)
- Decisions made by models, not code
- Correctness measured empirically
:::
:::

Importantly, this does not mean that programs have ceased to be programs. These systems still run on traditional hardware. They are still composed of instructions. From the perspective of the theory of computation, they remain Turing-complete.

What has changed is where decisions live. Instead of being encoded entirely in imperative logic, decisions are now distributed across models, prompts, policies, and data. The programmer no longer dictates every step the system will take. Instead, they define procedures: high-level structures that describe goals, constraints, tools, and acceptable outcomes.

### Agentic Control Flow: The ReAct Loop

One clear way to see this shift is the ReAct pattern: you give a model a set of tools, then you run a loop where the model decides whether to call a tool, incorporate the results, and repeat — or declare that it’s done.

In other words, the model isn’t just producing text. It’s making decisions about the program’s next step — the control flow. That’s a common practical definition of agentic programming: **the agent chooses the control flow.**

{{island AnimatedCodeBlock label="Agentic control flow" filename="react_loop.py" blockWidth="1400" showTypewriter="true" autoPlay="true"}}
```python
# A typical ReAct-style agent loop (simplified)
MAX_TOOL_CALLS = 12

for step in range(MAX_TOOL_CALLS):
    decision = model(context, tools=available_tools)

    if decision.tool_call:
        observation = call_tool(decision.tool_call)
        context.append(observation)
        continue

    if decision.done:
        break

# Guardrails are what make this safe to run at scale:
# tool allowlists, approvals, timeouts, sandboxes, audits, etc.
```

That creates a new kind of responsibility problem. If the agent is making control-flow decisions, your traditional **if/then** branches aren’t what governs the procedure anymore — they’re a layer removed from what actually happens. But you still need a procedure with a beginning and an end, and you still need it to complete reliably.

So instead of only asking “what code path runs?”, you have to ask “what behavior is acceptable?” — and then design the procedure so it *stays* within those bounds. That means iterating on decision-making configurations (prompts, models, tool access, policies), searching through alternatives, and measuring outcomes — not just editing imperative branching logic.

But a loop like that is only usable in real systems if it has guardrails from the very beginning. The simplest guardrail is a hard cap on tool calls — for example, “stop after 12 tool calls.” Without at least that, you can’t even safely run the loop unattended.

And once you accept that, you quickly realize guardrails aren’t an add‑on — they’re part of the program. Tool allowlists, approvals, sandboxes, timeouts, durable checkpoints, and audits aren’t implementation details. They’re the structure that makes agentic control flow trustworthy.

In a chat interface, humans provide those guardrails manually: you watch every step, approve risky actions in real time, and steer the run back on course when it drifts. That can be a great way to prototype. But it doesn’t scale — and it breaks down the moment you want the procedure to run while you’re away.

Durable human‑in‑the‑loop is how you keep humans in charge without turning them into synchronous control flow: approvals before irreversible actions, reviews that can send work back for edits, and input requests that collect missing information at the moment it’s needed. These aren’t “UI details.” They’re part of the program’s structure.

---

## 3. Why Existing Languages and Frameworks Start to Strain {#existing-tools}

At first glance, it's reasonable to ask why any of this requires a new language at all. Python, TypeScript, and other general-purpose languages are flexible, expressive, and powerful. Entire ecosystems of agent frameworks already exist, layered on top of them.

The problem is not capability. The problem is fit.

Python, TypeScript, and JavaScript are still valuable behind host APIs: they can run SDKs, services, queues, databases, and internal systems. The strain appears when a general-purpose language becomes the untrusted payload that a model writes for the current task. That payload needs a smaller, more controlled boundary than a full application runtime.

General-purpose programming languages were designed around an imperative mental model. Even when they support functional or declarative styles, they still assume that control flow is something the programmer explicitly encodes. When stochastic, behavior-driven systems are built in these languages, the core concepts are typically bolted on rather than represented directly.

:::card-grid{columns=2 label="Comparison"}
:::card{title="Traditional Approach"}
agent.py

```python
# Trying to make Python do agent workflows
async def process_with_agent(input_data):
    try:
        result = await openai.chat.completions.create(...)
        # Now what? How do we checkpoint?
        # How do we test this?
        # How do we prevent it from reading /etc/passwd?
        return result
    except Exception as e:
        # Hope for the best?
        pass
```
:::

:::card{title="Tactus"}
agent.tactus

```tactus
Procedure {
  function(input)
    local result = agent {
      instruction = "Process this input",
      data = input
    }
    -- Designed for durable checkpoints
    -- Designed for sandboxed execution
    -- Designed to be evaluated with specs
    return result
  end
}
```
:::
:::

As a result, the essential structure of these systems becomes fragmented. Decision-making logic lives partly in code, partly in prompts, partly in configuration, and partly in external models. Tool usage, retries, fallbacks, approvals, and evaluations are implemented as ad hoc patterns rather than first-class constructs.

This creates a mismatch between how the system actually behaves and how the language encourages the programmer to think. The code describes steps and branches, but the system operates as a procedure whose behavior emerges from interaction between models, data, and constraints.

When control decisions move into the model, “the code” can become a thin wrapper around the real moving parts. You end up managing the most important concerns — guardrails, tool capability boundaries, evaluation criteria, and human checkpoints — through scattered conventions instead of first-class constructs.

Tactus is designed to close that gap: to let you express procedures and guardrails in a form that matches the problem you’re actually solving, so your code is aligned with how the system runs.

---

## 4. The Collapse of Deterministic Best Practices {#determinism}

For decades, the dominant best practices in software engineering have been built around a single assumption: determinism. Traditional testing strategies assume that given the same inputs, a program will produce the same outputs. Unit tests assert exact values. Regression tests verify that behavior does not change unexpectedly.

Stochastic, behavior-driven systems break this assumption at its core.

| Traditional Best Practice | Works with AI Agents? | Why It Breaks |
| --- | --- | --- |
| Unit tests with exact assertions | ✗ | Output varies between runs |
| 100% code coverage | ✗ | Behavior comes from models, not code |
| Regression tests | ✗ | Natural variation looks like regression |
| Debuggers with replay | ✗ | Can't replay non-deterministic execution |
| Binary pass/fail gates | ✗ | Need probabilistic quality metrics |

When decisions are made probabilistically, variability is not a defect—it is an inherent property of the system. Two executions may both be acceptable while differing in structure, phrasing, or internal reasoning.

Instead of correctness, the relevant concept becomes **alignment**. The question is no longer "does the system do exactly what it did before?" but "does the system behave acceptably according to our criteria?"

---

## 5. Why MLOps Alone Is Not Enough {#mlops}

Machine learning practitioners have been dealing with stochastic systems for years. They don't talk about correctness; they talk about metrics, experiments, and optimization. They have tooling—MLflow being a canonical example—for tracking runs, comparing models, and selecting better-performing variants.

It helps, but it doesn't fully solve the problem.

MLOps is optimized around models, not behavior. The primary unit of evaluation is a model trained to perform a narrowly defined task, measured using relatively simple, quantifiable metrics such as accuracy, precision, recall, or loss.

:::card-grid{columns=2 label="Pipelines"}
:::card{title="MLOps Pipeline"}
1. Prepare training data
2. Train model
3. Evaluate on test set
4. Compare metrics
5. Deploy best model
6. Monitor drift

Focus: **Model Quality**
:::

:::card{title="PrOps Pipeline"}
1. Define procedure with tools
2. Write behavioral specifications
3. Run evaluation suite
4. Measure reliability rate
5. Deploy with guardrails
6. Monitor behavior in production

Focus: **System Behavior**
:::
:::

Agentic systems are different. They do not just produce predictions; they take actions, use tools, interact with external systems, and generate multi-step behaviors. Success is rarely captured by a single scalar metric. Two runs may both succeed while differing significantly in how they arrive at that success.

Specifications are the missing piece. To evaluate behavior, specifications themselves must become more flexible. They must be able to express constraints, expectations, and boundaries without requiring identical outputs.

---

## 6. Behavioral Specifications and Evaluation {#specifications}

When correctness becomes alignment and determinism gives way to probability, you need new ways to say what "good" looks like.

Behavioral specifications express what a system should do without prescribing exactly how. Instead of asserting that output equals a specific string, a behavioral specification might assert that the output contains certain information, follows a particular structure, or satisfies semantic constraints.

**Behavioral Specification** · import.tac

```gherkin
Feature: Contact import works reliably

  Scenario: Handles varied formats
    Given 100 contact records in different formats
    When the agent imports them
    Then at least 95% should import successfully
    And all required fields should be populated
```

In Tactus, these specs live in the same file as the procedure, so the language and toolchain can warn when a workflow has no tests. The result is a self-validating artifact that an AI agent can change and re-verify without a human babysitter.

But specifications alone aren't enough. Because these systems are stochastic, you also need evaluation—repeated measurement to understand how reliably the system meets its specifications.

A specification says: "The agent should call the search tool before answering a factual question." An evaluation asks: "How often does it actually do that? 95% of the time? 80%? 60%?"

The combination of behavioral specifications and evaluation provides the foundation for a new operational discipline:

- **Specifications** define acceptable behavior in human-readable terms
- **Evaluations** measure how consistently the system meets those specifications
- **Experiments** compare different configurations, prompts, or approaches
- **Monitoring** tracks reliability in production over time

This is what it means to "align" a system rather than "prove it correct." You define what you want, measure what you get, and iterate toward better alignment.

---

## 7. PrOps: Operating Procedures, Not Just Code or Models {#props}

Once behavior becomes the primary unit of concern, it becomes clear that neither DevOps nor MLOps fully describes the operational problem we are trying to solve.

DevOps is built around operating deterministic programs. MLOps is built around training and serving statistical models. Agentic systems do not fit cleanly into either category. They are not just programs, and they are not just models. They are **procedures**: systems that combine imperative logic, learned components, tools, constraints, and evaluation into a single decision-making process.

This is the gap that PrOps is meant to fill.

:::callout{kind="tip" title="PrOps = Procedure Operations"}
Operating procedures rather than code artifacts or trained models. A procedure may include prompts, models, policies, tool interfaces, guardrails, and evaluation criteria. Its correctness cannot be proven in advance, and its quality cannot be reduced to a single metric. Instead, it must be observed, measured, and aligned over time.
:::

| Aspect | DevOps | MLOps | PrOps |
| --- | --- | --- | --- |
| **Unit of Operation** | Programs | Models | Procedures |
| **Quality Metric** | Correct or incorrect | Better or worse | Aligned or misaligned |
| **Deployment Gate** | Tests pass | Metrics improve | Behavior acceptable |
| **Problem Indicator** | Bug (regression) | Model drift | Misalignment |
| **Gate Type** | Binary (pass/fail) | Threshold-based | Behavioral evaluation |

In a PrOps mindset, deployment is not a binary event. A procedure is introduced, evaluated against behavioral specifications, compared to alternatives, and iteratively refined. Changes are assessed based on how they affect observed behavior, not whether they preserve identical outputs.

Human judgment becomes a first-class component of the system. Humans define what acceptable behavior looks like, design evaluations to capture it, and make decisions about whether a procedure is ready to be relied upon.

---

## 8. Why This Leads to a New Language {#new-language}

Once procedures become the primary unit of computation, the limitations of existing languages become impossible to ignore.

Programming languages do more than instruct machines. They shape how humans think about problems. They determine what is easy to express, what is awkward, and what is invisible. For decades, languages have been optimized around imperative control flow because that is where decisions lived.

Procedural, behavior-driven systems require a different set of primitives.

### What Tactus Provides:

:::card-grid{columns=3 label="What Tactus provides"}
:::card{title="Durability by Default"}
Automatic checkpointing and resumption for long-running procedures
:::

:::card{title="Sandboxing by Default"}
Agent code runs in isolated environment with controlled access
:::

:::card{title="Tool Capability Control"}
First-class primitives for defining and constraining tool usage
:::

:::card{title="Human Gates"}
Durable approve/review/input primitives
:::

:::card{title="Behavioral Testing"}
Native support for specifications and evaluation primitives
:::

:::card{title="Observable Execution"}
Audit trails and monitoring built into the runtime
:::
:::

### Durable Human-in-the-Loop

One of the most important “first-class primitives” in Tactus isn’t a syntax feature — it’s operational infrastructure. Human‑in‑the‑loop is where tool‑using agents stop being cool demos and start being trustworthy systems: approvals before irreversible actions, review loops that let you send work back for edits, and input requests that capture the missing details the workflow shouldn’t guess.

{{island HitlReturnsAllDiagram}}

Tactus treats these as durable suspend points. When a procedure reaches a HITL call, the runtime checkpoints state, emits a pending request, and suspends execution. Hours later (or after a crash), the procedure can resume from the same point — without keeping a process alive while it waits.

This is also how you move beyond the “everyone uses chat” paradigm. Instead of steering agents turn‑by‑turn, your application can surface minimal, structured interactions: approve one risky action, revise a draft, or provide one missing field — and let the rest of the procedure run.

In a typical Python stack, making this reliable means building a workflow engine: persisting state, handling timeouts, keeping an audit trail, resuming idempotently after crashes, and integrating queues and UI. You can do it — but it’s an enormous amount of bespoke infrastructure that sits next to your “agent code,” and it’s easy for the mental model to fragment.

This fragmentation is not accidental. It is a symptom of languages being asked to represent concepts they were never designed to model directly. A language designed for procedures must treat checkpoints, guardrails, and human oversight as first‑class concepts — because they’re part of how these systems actually run.

[Read more about Human‑in‑the‑Loop in Tactus](/human-in-the-loop/).

---

## 9. Conclusion: Evolution, Not Alien DNA {#conclusion}

It's important to be precise about what has changed—and what has not.

From the perspective of computer science theory, nothing fundamental has broken. These systems still run on conventional hardware. They are still composed of instructions. They are still Turing-complete. There is no new computational substrate, no alien machinery hiding beneath the surface.

What has changed is the way decisions are made and, more importantly, the way humans must reason about those decisions.

For most of computing history, programming meant specifying control flow in advance. Languages, tools, and best practices evolved to make that process safer, clearer, and more efficient for humans. That entire ecosystem was built around deterministic execution and binary notions of correctness.

Today, many of the most important systems we build no longer operate that way. Decisions emerge from learned behavior, probabilistic inference, and interaction with the world. Control flow becomes dynamic. Outcomes are evaluated empirically. Variation is expected, not eliminated.

:::callout{kind="tip" title="This is evolution"}
PrOps names this new operational reality. It captures the need to supervise, evaluate, and refine behavior-driven systems with the same seriousness that DevOps brought to deterministic software and MLOps brought to machine learning models.

Languages follow mental models. When the mental model changes, new languages emerge—not to replace what came before, but to make the new reality intelligible and tractable for humans.
:::

This is not a revolution in computation. It is the next stage in a long, continuous effort: helping humans work effectively with increasingly powerful machines, as the nature of decision-making itself evolves.

:::aside{title="Sidebar: Still Turing-Complete"}
A reasonable question arises: if these systems are still Turing-complete, are they really different?

The answer is yes and no.

From a theoretical standpoint, any computation that a behavior-driven procedure can perform could also be expressed as a traditional imperative program. Turing-completeness means the expressive power is equivalent. You could, in principle, write a Python script that simulates everything a Tactus procedure does.

But this misses the point. The value of a programming language is not just what it can compute—it's how it shapes the programmer's thinking.

Assembly is Turing-complete. So is C. So is Ruby. They're all equivalent in what they can compute. But they're radically different in how they help humans organize and express their intent.

That's the same reason we don't write web applications in assembly, even though we could.
:::
