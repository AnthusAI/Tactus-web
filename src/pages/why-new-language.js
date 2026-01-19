import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import Breakout from "../components/publishing/Breakout"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import HitlReturnsAllDiagram from "../components/diagrams/HitlReturnsAllDiagram"
import * as styles from "./why-new-language.module.css"

const MACHINE_CODE = `01001000 10001001 11100101
01001000 10000011 11101100 00001000
10001011 00000101 00000000 00000000 00000000 00000000`

const HEX_CODE = `48 89 E5
48 83 EC 08
8B 05 00 00 00 00`

const ASSEMBLY_CODE = `section .data
    msg db 'Hello, World!', 0

section .text
    global _start

_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, 13
    syscall`

const LISP_CODE = `(defun hello-world ()
  (format t "Hello, World!~%"))

(hello-world)`

const C_CODE = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`

const CPP_CODE = `#include <iostream>
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
}`

const RUBY_CODE = `class Greeter
  def initialize(name)
    @name = name
  end

  def greet
    puts "Hello, #{@name}!"
  end
end

Greeter.new("World").greet`

const TACTUS_HELLO_WORLD_CODE = `World = Agent {
    provider = "openai",
    model = "gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").response`

const PYTHON_AGENT_CODE = `# Trying to make Python do agent workflows
async def process_with_agent(input_data):
    try:
        result = await openai.chat.completions.create(...)
        # Now what? How do we checkpoint?
        # How do we test this?
        # How do we prevent it from reading /etc/passwd?
        return result
    except Exception as e:
        # Hope for the best?
        pass`

const TACTUS_AGENT_CODE = `Procedure {
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
}`

const BDD_SPEC_CODE = `Feature: Contact import works reliably

  Scenario: Handles varied formats
    Given 100 contact records in different formats
    When the agent imports them
    Then at least 95% should import successfully
    And all required fields should be populated`

const REACT_LOOP_CODE = `# A typical ReAct-style agent loop (simplified)
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
# tool allowlists, approvals, timeouts, sandboxes, audits, etc.`

const WhyNewLanguagePage = () => (
  <Layout fullWidth={true}>
    <div className={styles.page}>

      {/* Hero Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>Understanding Tactus</p>
            <h1 className={styles.title}>
              Why a New Language?
            </h1>
            <p className={styles.lede}>
              Since the dawn of electronic computing, there has effectively been only one way
              to write a computer program. Today, for the first time in more than eighty years,
              that assumption no longer holds.
            </p>
          </div>

          {/* Table of Contents */}
          <nav className={styles.toc}>
            <h2 className={styles.tocTitle}>Contents</h2>
            <ol className={styles.tocList}>
              <li><a href="#beginning">In the Beginning, There Was Machine Code</a></li>
              <li><a href="#control-flow">When Control Flow Stops Being Imperative</a></li>
              <li><a href="#existing-tools">Why Existing Languages and Frameworks Start to Strain</a></li>
              <li><a href="#determinism">The Collapse of Deterministic Best Practices</a></li>
              <li><a href="#mlops">Why MLOps Alone Is Not Enough</a></li>
              <li><a href="#specifications">Behavioral Specifications and Evaluation</a></li>
              <li><a href="#props">PrOps: Operating Procedures, Not Just Code or Models</a></li>
              <li><a href="#new-language">Why This Leads to a New Language</a></li>
              <li><a href="#conclusion">Conclusion: Evolution, Not Alien DNA</a></li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Section 1: In the Beginning */}
      <section id="beginning" className={`${styles.section} ${styles.bgMuted}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>1. In the Beginning, There Was Machine Code</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            In the beginning, there was machine code. At the lowest level, every computer program
            consists of zeros and ones. These binary patterns encode instructions that the processor
            executes directly: moving data, performing arithmetic, comparing values, and jumping to
            different locations based on conditions.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Machine code"
              code={MACHINE_CODE}
              language="text"
              filename="machine-code.bin"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            In the earliest era of computing, this was the only way to program a machine. The
            programmers who worked on ENIAC in 1945, and on EDSAC just a few years later, lived
            in this world. They didn't write code—they wired circuits and flipped switches. When
            stored-program computers arrived, they punched cards with numeric opcodes.
          </p>

          <p className={styles.bodyText}>
            It’s hard to overstate how unforgiving—and how literal—that was. At that level, zeros and
            ones weren’t “data types”; they corresponded to physical states: voltage on a wire, a relay
            position, or a vacuum tube being on or off. Early programmers didn’t just “write code” —
            they were often working close enough to the hardware that the constructs they cared about
            were the machine’s own guts: registers, addresses, and bit patterns.
          </p>

          <p className={styles.bodyText}>
            That’s a recurring theme in the history of programming: as the *problem space* changes, the
            language evolves so its constructs match what people actually care about. When you’re
            building a computer, bit patterns are a reasonable abstraction. When you’re trying to make
            software repeatable, reusable, and fast to change, you need different primitives.
          </p>

          <h3 className={styles.subsectionTitle}>Assembly Language: Naming the Zeros and Ones</h3>

          <p className={styles.bodyText}>
            Before assemblers, there was a small mercy: <strong>hexadecimal</strong>. Hex wasn’t
            invented for computers — it’s ancient — but it became newly useful here. It didn’t change
            what the machine executed, but it gave humans something to recognize: patterns, boundaries,
            and chunks you could scan without counting bits.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Hexadecimal"
              code={HEX_CODE}
              language="text"
              filename="machine-code.hex"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            Assembly language emerged almost immediately as a response to this problem—as early as
            the late 1940s on machines like EDSAC at Cambridge. Instead of writing binary encodings,
            programmers could write symbolic instructions and labels that an assembler would translate
            into the underlying zeros and ones.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Assembly language"
              code={ASSEMBLY_CODE}
              language="text"
              filename="hello.asm"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            Assembly did not change the paradigm. Control flow was still explicit and imperative. But
            it made the machine's behavior legible to humans. This was the beginning of a long trend:
            <strong> making the computer do more work so the human could think more clearly.</strong>
          </p>

          <p className={styles.bodyText}>
            And once you have an assembler, you have something bigger than a nicer notation: you have
            a new kind of workflow. You write one program, and then you run a program to translate it
            into something the machine can execute.
          </p>

          <p className={styles.bodyText}>
            Put differently: an assembler is itself a computer program. You run it first, and it
            outputs a new artifact—the machine code your computer will actually run. That means the
            “act of programming” becomes a two‑step process: write code for humans, then run a program
            that turns it into code for machines.
          </p>

          <p className={styles.bodyText}>
            This matters because early computer time was incredibly valuable, and yet people still
            spent some of that precious time on tools that made programming faster, safer, and more
            repeatable. Almost immediately, we took the new machine and put *other programs* between
            humans and hardware—so the machine could help us use the machine.
          </p>

          <p className={styles.bodyText}>
            You also get early building blocks for reuse and repeatability. Labels and named routines
            let you turn “the sequence of steps I do all the time” into something you can call again and
            again—one of the roots of the subroutine and the function.
          </p>

          <p className={styles.bodyText}>
            From there, the ladder of abstraction rose quickly. In the late 1950s and 1960s, early
            high-level languages like Fortran, Lisp, COBOL, and ALGOL showed that you could describe
            computation in terms closer to the problem—math, symbols, business rules, structured
            control flow—while compilers handled the low-level details. APL pushed this idea even
            further, compressing entire computations into a dense notation that made the *computer*
            do more work so the *human* could say more with less.
          </p>

          <h3 className={styles.subsectionTitle}>Lisp: Code as Data</h3>

          <p className={styles.bodyText}>
            Lisp emerged in the late 1950s with a different kind of ambition: make symbolic
            computation practical. One of its defining ideas was that code and data share the same
            shape — which made programs easier to generate, transform, and reason about. Lists,
            recursion, and symbolic manipulation weren’t accidental language features—they were the
            constructs the researchers cared about.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Lisp"
              code={LISP_CODE}
              language="lisp"
              filename="hello.lisp"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <h3 className={styles.subsectionTitle}>C: Structured Control Flow</h3>

          <p className={styles.bodyText}>
            One especially influential descendant of this era was C. Programmers could write
            structured control flow—functions, loops, conditionals—without manually managing jumps
            and memory addresses. The compiler handled translation to machine code. The CPU still
            executed imperative instructions. But humans could now reason about behavior at a
            higher level.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="C"
              code={C_CODE}
              language="c"
              filename="hello.c"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            Crucially, the mental model remained unchanged: the programmer still fully specified how
            decisions were made. The abstraction moved up a level, but the paradigm stayed the same.
          </p>

          <h3 className={styles.subsectionTitle}>C++ and Object-Oriented Programming</h3>

          <p className={styles.bodyText}>
            C++ and object-oriented programming pushed abstraction further by trying to match a new
            problem space: large systems made of interacting “things” with state and responsibilities.
            Instead of reasoning only about control flow, you could reason about entities, boundaries,
            and relationships—then let the language and runtime enforce some structure.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="C++"
              code={CPP_CODE}
              language="cpp"
              filename="greeter.cpp"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <h3 className={styles.subsectionTitle}>Ruby: Pseudocode as Code</h3>

          <p className={styles.bodyText}>
            Languages like Ruby represent another step along the same trajectory: express intent more
            directly. Ruby deliberately prioritizes expressiveness and readability, allowing code to
            resemble structured pseudocode. The computer does more work on behalf of the human so the
            human can focus on the problem, not the bookkeeping.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Ruby"
              code={RUBY_CODE}
              language="ruby"
              filename="greeter.rb"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            But the role of the programmer had not fundamentally changed. The programmer still
            described the control flow. The computer still followed instructions.
          </p>

          <p className={styles.bodyText}>
            These examples aren’t meant as a tour of “important languages.” They’re snapshots of a
            repeating pattern: as software changes, programmers want their language to expose the
            constructs they actually reason about — and hide the ones they don’t.
          </p>

          <h3 className={styles.subsectionTitle}>The Pattern Repeats with AI</h3>

          <p className={styles.bodyText}>
            Today, we're seeing the same pattern repeat. One of the first valuable uses of AI has
            been to turn it on itself: using AI to write better code, to make programming easier.
            GitHub Copilot, ChatGPT writing functions, Claude refactoring modules—these tools follow
            the same trajectory that began with assemblers in the 1940s.
          </p>

          <p className={styles.bodyText}>
            Tactus continues that tradition: it raises the level of abstraction to match what
            engineers actually care about in agentic systems — procedures, tool use, guardrails,
            checkpoints, and evaluation — so you can express those concerns directly.
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Tactus: Hello World"
              code={TACTUS_HELLO_WORLD_CODE}
              language="tactus"
              filename="hello_world.tactus"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            But this time, something deeper is changing. It's not just another layer of abstraction
            over imperative code. The way decisions are made is fundamentally different. Control flow
            is no longer something you fully specify in advance—it emerges from interaction between
            models, data, and constraints.
          </p>

          <p className={`${styles.bodyText} ${styles.emphasis}`}>
            For most of computing history, progress in programming meant raising the level at which
            humans describe imperative control flow for a CPU. What comes next is not another step
            along that same line. It is a change in direction.
          </p>
        </div>
      </section>

      {/* Section 2: Control Flow */}
      <section id="control-flow" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>2. When Control Flow Stops Being Imperative</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            For most of computing history, control flow has been something the programmer fully
            specifies in advance. Every branch, every loop, every decision point is encoded
            explicitly in the program. Given the same inputs, the program follows the same path
            and produces the same outputs.
          </p>

          <p className={styles.bodyText}>
            That assumption no longer holds.
          </p>

          <p className={styles.bodyText}>
            In modern systems, an increasing share of decisions are made not by imperative logic
            written by a human, but by machine learning and AI models making predictions. These
            systems do not follow a single, pre-defined execution path. Instead, they evaluate
            inputs against learned representations and produce outcomes probabilistically.
          </p>

          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <h3 className={styles.comparisonTitle}>Traditional Programming</h3>
              <ul className={styles.comparisonList}>
                <li>Control flow is explicit and predetermined</li>
                <li>Same input → same output (deterministic)</li>
                <li>All branches encoded by programmer</li>
                <li>Correctness can be proven in advance</li>
              </ul>
            </div>
            <div className={styles.comparisonCard}>
              <h3 className={styles.comparisonTitle}>AI-Driven Systems</h3>
              <ul className={styles.comparisonList}>
                <li>Control flow emerges from learned behavior</li>
                <li>Same input → varying outputs (probabilistic)</li>
                <li>Decisions made by models, not code</li>
                <li>Correctness measured empirically</li>
              </ul>
            </div>
          </div>

          <p className={styles.bodyText}>
            Importantly, this does not mean that programs have ceased to be programs. These systems
            still run on traditional hardware. They are still composed of instructions. From the
            perspective of the theory of computation, they remain Turing-complete.
          </p>

          <p className={styles.bodyText}>
            What has changed is where decisions live. Instead of being encoded entirely in imperative
            logic, decisions are now distributed across models, prompts, policies, and data. The
            programmer no longer dictates every step the system will take. Instead, they define
            procedures: high-level structures that describe goals, constraints, tools, and acceptable
            outcomes.
          </p>

          <h3 className={styles.subsectionTitle}>Agentic Control Flow: The ReAct Loop</h3>

          <p className={styles.bodyText}>
            One clear way to see this shift is the ReAct pattern: you give a model a set of tools,
            then you run a loop where the model decides whether to call a tool, incorporate the
            results, and repeat — or declare that it’s done.
          </p>

          <p className={styles.bodyText}>
            In other words, the model isn’t just producing text. It’s making decisions about the
            program’s next step — the control flow. That’s a common practical definition of
            agentic programming: <strong>the agent chooses the control flow.</strong>
          </p>

          <div className={styles.codeEmbed}>
            <AnimatedCodeBlock
              label="Agentic control flow"
              code={REACT_LOOP_CODE}
              language="python"
              filename="react_loop.py"
              showTypewriter={true}
              typewriterLoop={false}
              autoHeight={true}
              blockWidth={1400}
              width="100%"
              autoPlay={true}
              controls={false}
              loop={false}
            />
          </div>

          <p className={styles.bodyText}>
            That creates a new kind of responsibility problem. If the agent is making control-flow
            decisions, your traditional <strong>if/then</strong> branches aren’t what governs the
            procedure anymore — they’re a layer removed from what actually happens. But you still
            need a procedure with a beginning and an end, and you still need it to complete
            reliably.
          </p>

          <p className={styles.bodyText}>
            So instead of only asking “what code path runs?”, you have to ask “what behavior is
            acceptable?” — and then design the procedure so it <em>stays</em> within those bounds.
            That means iterating on decision-making configurations (prompts, models, tool access,
            policies), searching through alternatives, and measuring outcomes — not just editing
            imperative branching logic.
          </p>

          <p className={styles.bodyText}>
            But a loop like that is only usable in real systems if it has guardrails from the very
            beginning. The simplest guardrail is a hard cap on tool calls — for example, “stop after
            12 tool calls.” Without at least that, you can’t even safely run the loop unattended.
          </p>

          <p className={styles.bodyText}>
            And once you accept that, you quickly realize guardrails aren’t an add‑on — they’re part
            of the program. Tool allowlists, approvals, sandboxes, timeouts, durable checkpoints, and
            audits aren’t implementation details. They’re the structure that makes agentic control
            flow trustworthy.
          </p>

          <p className={styles.bodyText}>
            In a chat interface, humans provide those guardrails manually: you watch every step, approve
            risky actions in real time, and steer the run back on course when it drifts. That can be a
            great way to prototype. But it doesn’t scale — and it breaks down the moment you want the
            procedure to run while you’re away.
          </p>

          <p className={styles.bodyText}>
            Durable human‑in‑the‑loop is how you keep humans in charge without turning them into
            synchronous control flow: approvals before irreversible actions, reviews that can send work
            back for edits, and input requests that collect missing information at the moment it’s needed.
            These aren’t “UI details.” They’re part of the program’s structure.
          </p>
        </div>
      </section>

      {/* Section 3: Existing Tools Strain */}
      <section id="existing-tools" className={`${styles.section} ${styles.bgMuted}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>3. Why Existing Languages and Frameworks Start to Strain</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            At first glance, it's reasonable to ask why any of this requires a new language at all.
            Python, TypeScript, and other general-purpose languages are flexible, expressive, and
            powerful. Entire ecosystems of agent frameworks already exist, layered on top of them.
          </p>

          <p className={styles.bodyText}>
            The problem is not capability. The problem is fit.
          </p>

          <p className={styles.bodyText}>
            General-purpose programming languages were designed around an imperative mental model.
            Even when they support functional or declarative styles, they still assume that control
            flow is something the programmer explicitly encodes. When stochastic, behavior-driven
            systems are built in these languages, the core concepts are typically bolted on rather
            than represented directly.
          </p>

          <div className={styles.codeGrid}>
            <div className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLabel}>Traditional Approach</span>
                <span className={styles.codeFile}>agent.py</span>
              </div>
              <pre className={styles.codeBlock}><code>{PYTHON_AGENT_CODE}</code></pre>
            </div>
            <div className={styles.codePanel}>
              <div className={styles.codeHeader}>
                <span className={styles.codeLabel}>Tactus</span>
                <span className={styles.codeFile}>agent.tactus</span>
              </div>
              <pre className={styles.codeBlock}><code>{TACTUS_AGENT_CODE}</code></pre>
            </div>
          </div>

          <p className={styles.bodyText}>
            As a result, the essential structure of these systems becomes fragmented. Decision-making
            logic lives partly in code, partly in prompts, partly in configuration, and partly in
            external models. Tool usage, retries, fallbacks, approvals, and evaluations are implemented
            as ad hoc patterns rather than first-class constructs.
          </p>

          <p className={styles.bodyText}>
            This creates a mismatch between how the system actually behaves and how the language
            encourages the programmer to think. The code describes steps and branches, but the system
            operates as a procedure whose behavior emerges from interaction between models, data, and
            constraints.
          </p>

          <p className={styles.bodyText}>
            When control decisions move into the model, “the code” can become a thin wrapper around
            the real moving parts. You end up managing the most important concerns — guardrails, tool
            capability boundaries, evaluation criteria, and human checkpoints — through scattered
            conventions instead of first-class constructs.
          </p>

          <p className={styles.bodyText}>
            Tactus is designed to close that gap: to let you express procedures and guardrails in a
            form that matches the problem you’re actually solving, so your code is aligned with how
            the system runs.
          </p>
        </div>
      </section>

      {/* Section 4: Determinism Collapses */}
      <section id="determinism" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>4. The Collapse of Deterministic Best Practices</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            For decades, the dominant best practices in software engineering have been built around
            a single assumption: determinism. Traditional testing strategies assume that given the
            same inputs, a program will produce the same outputs. Unit tests assert exact values.
            Regression tests verify that behavior does not change unexpectedly.
          </p>

          <p className={styles.bodyText}>
            Stochastic, behavior-driven systems break this assumption at its core.
          </p>

          <div className={styles.practicesTable}>
            <table>
              <thead>
                <tr>
                  <th>Traditional Best Practice</th>
                  <th>Works with AI Agents?</th>
                  <th>Why It Breaks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Unit tests with exact assertions</td>
                  <td className={styles.fail}>✗</td>
                  <td>Output varies between runs</td>
                </tr>
                <tr>
                  <td>100% code coverage</td>
                  <td className={styles.fail}>✗</td>
                  <td>Behavior comes from models, not code</td>
                </tr>
                <tr>
                  <td>Regression tests</td>
                  <td className={styles.fail}>✗</td>
                  <td>Natural variation looks like regression</td>
                </tr>
                <tr>
                  <td>Debuggers with replay</td>
                  <td className={styles.fail}>✗</td>
                  <td>Can't replay non-deterministic execution</td>
                </tr>
                <tr>
                  <td>Binary pass/fail gates</td>
                  <td className={styles.fail}>✗</td>
                  <td>Need probabilistic quality metrics</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.bodyText}>
            When decisions are made probabilistically, variability is not a defect—it is an inherent
            property of the system. Two executions may both be acceptable while differing in structure,
            phrasing, or internal reasoning.
          </p>

          <p className={styles.bodyText}>
            Instead of correctness, the relevant concept becomes <strong>alignment</strong>. The
            question is no longer "does the system do exactly what it did before?" but "does the
            system behave acceptably according to our criteria?"
          </p>
        </div>
      </section>

      {/* Section 5: MLOps */}
      <section id="mlops" className={`${styles.section} ${styles.bgMuted}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>5. Why MLOps Alone Is Not Enough</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            Machine learning practitioners have been dealing with stochastic systems for years.
            They don't talk about correctness; they talk about metrics, experiments, and
            optimization. They have tooling—MLflow being a canonical example—for tracking runs,
            comparing models, and selecting better-performing variants.
          </p>

          <p className={styles.bodyText}>
            It helps, but it doesn't fully solve the problem.
          </p>

          <p className={styles.bodyText}>
            MLOps is optimized around models, not behavior. The primary unit of evaluation is a
            model trained to perform a narrowly defined task, measured using relatively simple,
            quantifiable metrics such as accuracy, precision, recall, or loss.
          </p>

          <div className={styles.pipelineComparison}>
            <div className={styles.pipelineCard}>
              <h3 className={styles.pipelineTitle}>MLOps Pipeline</h3>
              <ol className={styles.pipelineSteps}>
                <li>Prepare training data</li>
                <li>Train model</li>
                <li>Evaluate on test set</li>
                <li>Compare metrics</li>
                <li>Deploy best model</li>
                <li>Monitor drift</li>
              </ol>
              <p className={styles.pipelineFocus}>Focus: <strong>Model Quality</strong></p>
            </div>
            <div className={styles.pipelineCard}>
              <h3 className={styles.pipelineTitle}>PrOps Pipeline</h3>
              <ol className={styles.pipelineSteps}>
                <li>Define procedure with tools</li>
                <li>Write behavioral specifications</li>
                <li>Run evaluation suite</li>
                <li>Measure reliability rate</li>
                <li>Deploy with guardrails</li>
                <li>Monitor behavior in production</li>
              </ol>
              <p className={styles.pipelineFocus}>Focus: <strong>System Behavior</strong></p>
            </div>
          </div>

          <p className={styles.bodyText}>
            Agentic systems are different. They do not just produce predictions; they take actions,
            use tools, interact with external systems, and generate multi-step behaviors. Success is
            rarely captured by a single scalar metric. Two runs may both succeed while differing
            significantly in how they arrive at that success.
          </p>

          <p className={styles.bodyText}>
            Specifications are the missing piece. To evaluate behavior, specifications themselves
            must become more flexible. They must be able to express constraints, expectations, and
            boundaries without requiring identical outputs.
          </p>
        </div>
      </section>

      {/* Section 6: Specifications */}
      <section id="specifications" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>6. Behavioral Specifications and Evaluation</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            When correctness becomes alignment and determinism gives way to probability, you need
            new ways to say what "good" looks like.
          </p>

          <p className={styles.bodyText}>
            Behavioral specifications express what a system should do without prescribing exactly
            how. Instead of asserting that output equals a specific string, a behavioral
            specification might assert that the output contains certain information, follows a
            particular structure, or satisfies semantic constraints.
          </p>

          <div className={styles.codeCard}>
            <div className={styles.codeHeader}>
              <span className={styles.codeLabel}>Behavioral Specification</span>
              <span className={styles.codeFile}>import.feature</span>
            </div>
            <pre className={styles.codeBlock}><code>{BDD_SPEC_CODE}</code></pre>
          </div>

          <p className={styles.bodyText}>
            But specifications alone aren't enough. Because these systems are stochastic, you also
            need evaluation—repeated measurement to understand how reliably the system meets its
            specifications.
          </p>

          <p className={styles.bodyText}>
            A specification says: "The agent should call the search tool before answering a factual
            question." An evaluation asks: "How often does it actually do that? 95% of the time?
            80%? 60%?"
          </p>

          <p className={styles.bodyText}>
            The combination of behavioral specifications and evaluation provides the foundation for
            a new operational discipline:
          </p>

          <ul className={styles.principlesList}>
            <li><strong>Specifications</strong> define acceptable behavior in human-readable terms</li>
            <li><strong>Evaluations</strong> measure how consistently the system meets those specifications</li>
            <li><strong>Experiments</strong> compare different configurations, prompts, or approaches</li>
            <li><strong>Monitoring</strong> tracks reliability in production over time</li>
          </ul>

          <p className={styles.bodyText}>
            This is what it means to "align" a system rather than "prove it correct." You define
            what you want, measure what you get, and iterate toward better alignment.
          </p>
        </div>
      </section>

      {/* Section 7: PrOps */}
      <section id="props" className={`${styles.section} ${styles.bgMuted}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>7. PrOps: Operating Procedures, Not Just Code or Models</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            Once behavior becomes the primary unit of concern, it becomes clear that neither DevOps
            nor MLOps fully describes the operational problem we are trying to solve.
          </p>

          <p className={styles.bodyText}>
            DevOps is built around operating deterministic programs. MLOps is built around training
            and serving statistical models. Agentic systems do not fit cleanly into either category.
            They are not just programs, and they are not just models. They are <strong>procedures</strong>:
            systems that combine imperative logic, learned components, tools, constraints, and
            evaluation into a single decision-making process.
          </p>

          <p className={styles.bodyText}>
            This is the gap that PrOps is meant to fill.
          </p>

          <div className={styles.propsExplainer}>
            <h3 className={styles.propsTitle}>PrOps = Procedure Operations</h3>
            <p className={styles.propsDescription}>
              Operating procedures rather than code artifacts or trained models. A procedure may
              include prompts, models, policies, tool interfaces, guardrails, and evaluation
              criteria. Its correctness cannot be proven in advance, and its quality cannot be
              reduced to a single metric. Instead, it must be observed, measured, and aligned
              over time.
            </p>
          </div>

          <div className={styles.comparisonTable}>
            <table>
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>DevOps</th>
                  <th>MLOps</th>
                  <th>PrOps</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Unit of Operation</strong></td>
                  <td>Programs</td>
                  <td>Models</td>
                  <td>Procedures</td>
                </tr>
                <tr>
                  <td><strong>Quality Metric</strong></td>
                  <td>Correct or incorrect</td>
                  <td>Better or worse</td>
                  <td>Aligned or misaligned</td>
                </tr>
                <tr>
                  <td><strong>Deployment Gate</strong></td>
                  <td>Tests pass</td>
                  <td>Metrics improve</td>
                  <td>Behavior acceptable</td>
                </tr>
                <tr>
                  <td><strong>Problem Indicator</strong></td>
                  <td>Bug (regression)</td>
                  <td>Model drift</td>
                  <td>Misalignment</td>
                </tr>
                <tr>
                  <td><strong>Gate Type</strong></td>
                  <td>Binary (pass/fail)</td>
                  <td>Threshold-based</td>
                  <td>Behavioral evaluation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className={styles.bodyText}>
            In a PrOps mindset, deployment is not a binary event. A procedure is introduced,
            evaluated against behavioral specifications, compared to alternatives, and iteratively
            refined. Changes are assessed based on how they affect observed behavior, not whether
            they preserve identical outputs.
          </p>

          <p className={styles.bodyText}>
            Human judgment becomes a first-class component of the system. Humans define what
            acceptable behavior looks like, design evaluations to capture it, and make decisions
            about whether a procedure is ready to be relied upon.
          </p>
        </div>
      </section>

      {/* Section 8: New Language */}
      <section id="new-language" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>8. Why This Leads to a New Language</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            Once procedures become the primary unit of computation, the limitations of existing
            languages become impossible to ignore.
          </p>

          <p className={styles.bodyText}>
            Programming languages do more than instruct machines. They shape how humans think about
            problems. They determine what is easy to express, what is awkward, and what is invisible.
            For decades, languages have been optimized around imperative control flow because that is
            where decisions lived.
          </p>

          <p className={styles.bodyText}>
            Procedural, behavior-driven systems require a different set of primitives.
          </p>

          <div className={styles.requirementsList}>
            <h3 className={styles.requirementsTitle}>What Tactus Provides:</h3>
            <div className={styles.requirementGrid}>
              <div className={styles.requirementCard}>
                <h4 className={styles.requirementName}>Durability by Default</h4>
                <p className={styles.requirementDesc}>
                  Automatic checkpointing and resumption for long-running procedures
                </p>
              </div>
              <div className={styles.requirementCard}>
                <h4 className={styles.requirementName}>Sandboxing by Default</h4>
                <p className={styles.requirementDesc}>
                  Agent code runs in isolated environment with controlled access
                </p>
              </div>
              <div className={styles.requirementCard}>
                <h4 className={styles.requirementName}>Tool Capability Control</h4>
                <p className={styles.requirementDesc}>
                  First-class primitives for defining and constraining tool usage
                </p>
              </div>
              <div className={styles.requirementCard}>
                <h4 className={styles.requirementName}>Human Gates</h4>
                <p className={styles.requirementDesc}>
                  Durable approve/review/input primitives
                </p>
              </div>
              <div className={styles.requirementCard}>
                <h4 className={styles.requirementName}>Behavioral Testing</h4>
                <p className={styles.requirementDesc}>
                  Native support for specifications and evaluation primitives
                </p>
              </div>
              <div className={styles.requirementCard}>
                <h4 className={styles.requirementName}>Observable Execution</h4>
                <p className={styles.requirementDesc}>
                  Audit trails and monitoring built into the runtime
                </p>
              </div>
            </div>
          </div>

          <h3 className={styles.subsectionTitle}>Durable Human-in-the-Loop</h3>

          <p className={styles.bodyText}>
            One of the most important “first-class primitives” in Tactus isn’t a syntax feature — it’s operational
            infrastructure. Human‑in‑the‑loop is where tool‑using agents stop being cool demos and start being
            trustworthy systems: approvals before irreversible actions, review loops that let you send work back for
            edits, and input requests that capture the missing details the workflow shouldn’t guess.
          </p>

          <div className={styles.diagramEmbed}>
            <HitlReturnsAllDiagram />
          </div>

          <p className={styles.bodyText}>
            Tactus treats these as durable suspend points. When a procedure reaches a HITL call, the runtime checkpoints
            state, emits a pending request, and suspends execution. Hours later (or after a crash), the procedure can
            resume from the same point — without keeping a process alive while it waits.
          </p>

          <p className={styles.bodyText}>
            This is also how you move beyond the “everyone uses chat” paradigm. Instead of steering agents turn‑by‑turn,
            your application can surface minimal, structured interactions: approve one risky action, revise a draft, or
            provide one missing field — and let the rest of the procedure run.
          </p>

          <p className={styles.bodyText}>
            In a typical Python stack, making this reliable means building a workflow engine: persisting state, handling
            timeouts, keeping an audit trail, resuming idempotently after crashes, and integrating queues and UI. You
            can do it — but it’s an enormous amount of bespoke infrastructure that sits next to your “agent code,” and
            it’s easy for the mental model to fragment.
          </p>

          <p className={`${styles.bodyText} ${styles.emphasis}`}>
            This fragmentation is not accidental. It is a symptom of languages being asked to represent concepts they
            were never designed to model directly. A language designed for procedures must treat checkpoints, guardrails,
            and human oversight as first‑class concepts — because they’re part of how these systems actually run.
          </p>

          <p className={styles.bodyText}>
            <Link to="/human-in-the-loop/">Read more about Human‑in‑the‑Loop in Tactus</Link>.
          </p>
        </div>
      </section>

      {/* Section 9: Conclusion */}
      <section id="conclusion" className={`${styles.section} ${styles.bgMuted}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>9. Conclusion: Evolution, Not Alien DNA</h2>

          <p className={`${styles.bodyText} drop-cap`}>
            It's important to be precise about what has changed—and what has not.
          </p>

          <p className={styles.bodyText}>
            From the perspective of computer science theory, nothing fundamental has broken. These
            systems still run on conventional hardware. They are still composed of instructions.
            They are still Turing-complete. There is no new computational substrate, no alien
            machinery hiding beneath the surface.
          </p>

          <p className={styles.bodyText}>
            What has changed is the way decisions are made and, more importantly, the way humans
            must reason about those decisions.
          </p>

          <p className={styles.bodyText}>
            For most of computing history, programming meant specifying control flow in advance.
            Languages, tools, and best practices evolved to make that process safer, clearer, and
            more efficient for humans. That entire ecosystem was built around deterministic
            execution and binary notions of correctness.
          </p>

          <p className={styles.bodyText}>
            Today, many of the most important systems we build no longer operate that way.
            Decisions emerge from learned behavior, probabilistic inference, and interaction with
            the world. Control flow becomes dynamic. Outcomes are evaluated empirically. Variation
            is expected, not eliminated.
          </p>

          <Breakout title="This is evolution" withContainer={false}>
            <p>
              PrOps names this new operational reality. It captures the need to supervise,
              evaluate, and refine behavior-driven systems with the same seriousness that DevOps
              brought to deterministic software and MLOps brought to machine learning models.
            </p>
            <p>
              Languages follow mental models. When the mental model changes, new languages
              emerge—not to replace what came before, but to make the new reality intelligible and
              tractable for humans.
            </p>
          </Breakout>

          <p className={`${styles.bodyText} ${styles.emphasis}`}>
            This is not a revolution in computation. It is the next stage in a long, continuous
            effort: helping humans work effectively with increasingly powerful machines, as the
            nature of decision-making itself evolves.
          </p>

          {/* Sidebar: Still Turing-Complete */}
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Sidebar: Still Turing-Complete</h3>
            <p className={styles.sidebarText}>
              A reasonable question arises: if these systems are still Turing-complete, are they
              really different?
            </p>
            <p className={styles.sidebarText}>
              The answer is yes and no.
            </p>
            <p className={styles.sidebarText}>
              From a theoretical standpoint, any computation that a behavior-driven procedure can
              perform could also be expressed as a traditional imperative program. Turing-completeness
              means the expressive power is equivalent. You could, in principle, write a Python
              script that simulates everything a Tactus procedure does.
            </p>
            <p className={styles.sidebarText}>
              But this misses the point. The value of a programming language is not just what it
              can compute—it's how it shapes the programmer's thinking.
            </p>
            <p className={styles.sidebarText}>
              Assembly is Turing-complete. So is C. So is Ruby. They're all equivalent in what
              they can compute. But they're radically different in how they help humans organize
              and express their intent.
            </p>
            <p className={`${styles.sidebarText} ${styles.sidebarEmphasis}`}>
              That's the same reason we don't write web applications in assembly, even though
              we could.
            </p>
          </aside>
        </div>
      </section>

      <BottomCta
        title="Ready to start building?"
        text="Learn how to write your first Tactus procedure and explore the language features that make behavior-driven programming natural."
        buttonLabel="Get Started"
        to="/getting-started/"
      />

    </div>
  </Layout>
)

export const Head = () => (
  <Seo
    title="Why a New Language?"
    description="Understanding why Tactus was created and how it addresses the unique challenges of operating AI-driven systems in production."
  />
)

export default WhyNewLanguagePage
