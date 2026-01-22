import { defineVideo } from "babulus/dsl";
import { sharedDefaults, t, voiceSegments } from "./_babulus.shared.js";

export default defineVideo((video) => {
  video.composition("why-new-language", (comp) => {
    comp.use(sharedDefaults);
    comp.posterTime(383);

    comp.scene("Why a New Language?", { id: "title_card" }, (scene) => {
      scene.music("bed", {
        prompt: "Contemplative ambient music, subtle piano, warm strings, thoughtful and educational tone, no vocals",
        playThrough: true,
        volume: 0.6,
        fadeTo: { volume: 0.1, afterSeconds: 4, fadeDurationSeconds: 2 },
        fadeOut: { volume: 0.6, beforeEndSeconds: 5, fadeDurationSeconds: 3 },
      });

      scene.cue("Title", { id: "title" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            0.8,
            "Why do we need a new language?",
            0.4,
          ]);
        });
      });
    });


    comp.scene("In the Beginning", { id: "machine_code_era" }, (scene) => {
      scene.cue("History", { id: "history" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              In the beginning, programmers wrote raw machine code. Zeros and ones.
              It was cumbersome, confusing, slow, and error-prone.
              And it was *low-level* in a very literal sense: those zeros and ones corresponded to physical states—
              voltage on a wire, a relay position, or a vacuum tube being on or off.
              Sometimes that meant wiring plugboards or toggling switches. Later it meant punching numeric opcodes.
              You were squinting down in the guts of the machine, and your “program” was basically a description of that machine.
            `,
            0.35,
            t`
              One practical mercy was hexadecimal notation.
              Hex wasn’t invented for computers — it’s ancient — but it became newly useful here.
              It didn’t change what the computer executed, but it gave humans patterns and chunks they could recognize.
            `,
            0.4,
            t`
              Assemblers emerged almost immediately. Instead of binary opcodes, you could write
              symbolic instructions. Researchers formalized those patterns into names and labels,
              making “machine instructions” legible to humans.
              The computer translated them into machine code.
              And once you can name things, you can reuse them: labels, macros, and early subroutines made programs repeatable instead of handcrafted.
            `,
            0.4,
            t`
              But the deeper shift is that assemblers introduced a two‑step workflow.
              Now there are two programs in the story: the assembler, and *your* program.
            `,
            0.35,
            t`
              You write code in a form that’s easier for humans to understand.
              Then you run the assembler — a program — to turn that into machine code.
              And *then* the computer runs the machine code.
            `,
            0.35,
            t`
              That’s the key step: one of the first useful things people ever did with computers
              was use them to make using computers easier.
              Even when computer time was precious, people spent some of it on tools that made programming faster, safer, and more repeatable.
            `,
            0.3,
            t`
              From there, the ladder of abstraction rose quickly.
              In the late 1950s and 1960s, early high-level languages like Fortran, Lisp, COBOL, ALGOL, and APL
              let humans describe problems more directly, while compilers handled the low-level details.
              Lisp, for example, was built for symbolic problems: lists, recursion, and treating code as data so you can transform programs like any other structure.
            `,
            0.3,
            t`
              One especially influential descendant of that era was C.
              It kept you close to the machine, but its constructs made repetition and reuse explicit:
              functions you could call again, and control flow you could reason about.
            `,
            0.3,
            t`
              C plus plus — and object-oriented programming more broadly — tried to match another problem space:
              large systems made of interacting “things” with state and responsibilities.
            `,
            0.3,
            t`
              And languages like Ruby pushed toward expressing intent directly:
              code that reads closer to what a human means, so the computer does more of the bookkeeping.
            `,
            0.4,
            t`
              But through all of this, the paradigm never changed.
              The programmer still specified control flow. The computer still followed instructions.
            `,
            0.4,
            t`
              Today, we're seeing the same pattern repeat with AI. One of the first valuable uses
              of AI is to turn it on itself: using AI to make programming easier, and to write better code.
            `,
            0.35,
            t`
              Tactus continues that tradition. It raises the level of abstraction to match what engineers care about in agentic systems:
              procedures, tools, guardrails, checkpoints, and evaluation. So you can express those concerns directly.
            `,
            0.3,
            t`
              But this time, something deeper is changing. It's not just a higher level of abstraction.
              It's a fundamentally different way of making decisions.
            `,
          ]);
        });
      });
    });

    comp.scene("Control Flow Evolution", { id: "control_flow" }, (scene) => {
      scene.cue("The Shift", { id: "shift" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "Today, decisions are no longer made entirely by imperative logic written by programmers.",
            0.35,
            t`
              In agentic patterns like the ReAct loop, you *explicitly* hand control flow to the model:
              it decides what tool to call next, and when it’s done.
            `,
            0.4,
            t`
              That’s one of the clearest definitions of “agentic programming”:
              the agent is making the control-flow decisions.
            `,
            0.35,
            t`
              And that’s what we mean by a new kind of computer program.
              Instead of specifying every branch, you yield control to the AI model —
              and you surround that loop with guardrails.
            `,
            0.35,
            t`
              Even a basic guardrail matters immediately: you can’t let the loop run forever.
              So you might cap it at, say, twelve tool calls — and require the agent to stop or ask for help after that.
            `,
            0.35,
            "Tactus is designed to make that style of program—and those guardrails—explicit and easy to reason about.",
          ]);
        });
      });
    });

    comp.scene("Existing Tools Strain", { id: "tools_strain" }, (scene) => {
      scene.cue("Python Problem", { id: "python_problem" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "So why not just use Python? Or TypeScript? They're powerful, flexible languages.",
            0.35,
            "The problem isn't capability. It's fit.",
            0.4,
            t`
              Look at this code. How do you checkpoint an agent call? How do you test it?
              How do you prevent it from reading slash-etsy-slash-password?
            `,
            0.5,
            t`
              These concerns exist, but they're bolted on. Fragmented across code, prompts,
              configuration, and external frameworks.
            `,
            0.35,
            "The language wasn't designed for this.",
          ]);
        });
      });
    });

    comp.scene("Deterministic Practices Collapse", { id: "practices_collapse" }, (scene) => {
      scene.cue("Testing Breaks", { id: "testing_breaks" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              For decades, software engineering best practices have been built around one assumption:
              determinism.
            `,
            0.35,
            t`
              Unit tests assert exact values. Code coverage measures every line.
              Regression tests catch unexpected changes.
            `,
            0.4,
            "But when your system makes decisions probabilistically, all of these practices break.",
            0.35,
            t`
              Output varies between runs. Behavior comes from models, not code.
              Natural variation looks like regression.
            `,
            0.4,
            "Instead of proving correctness, you measure alignment.",
          ]);
        });
      });
    });

    comp.scene("Beyond MLOps", { id: "beyond_mlops" }, (scene) => {
      scene.cue("MLOps Comparison", { id: "mlops_comparison" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              Machine learning practitioners have dealt with stochastic systems for years.
              They track experiments. Compare models. Optimize metrics.
            `,
            0.35,
            "But MLOps is optimized for models, not behavior.",
            0.4,
            t`
              Agentic systems don't just produce predictions.
              They take actions. Use tools. Generate multi-step behaviors.
            `,
            0.35,
            t`
              Success isn't a single number. It's whether the system behaves acceptably
              given the situation.
            `,
          ]);
        });
      });
    });

    comp.scene("Behavioral Specifications", { id: "specifications" }, (scene) => {
      scene.cue("Specs and Evals", { id: "specs_and_evals" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`When correctness becomes alignment, you need new ways to say what "good" looks like.`,
            0.35,
            t`
              Behavioral specifications express what a system should do without prescribing
              exactly how.
            `,
            0.4,
            t`
              A specification might say: the agent should call the search tool before
              answering a factual question.
            `,
            0.35,
            t`
              Then evaluation measures reliability. Does it do that ninety-five percent
              of the time? Eighty percent? Sixty?
            `,
            0.4,
            "Specifications plus evaluations give you a foundation for alignment.",
          ]);
        });
      });
    });

    comp.scene("PrOps", { id: "props" }, (scene) => {
      scene.cue("Procedures", { id: "procedures" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "This brings us to a new operational discipline: PrOps. Procedure Operations.",
            0.4,
            "DevOps operates deterministic programs. MLOps trains and serves models.",
            0.35,
            "But agentic systems are neither. They're procedures.",
            0.4,
            t`
              Systems that combine imperative logic, learned components, tools, constraints,
              and evaluation into a single decision-making process.
            `,
            0.35,
            "A procedure's quality can't be proven in advance or reduced to a single metric.",
            0.35,
            "It must be observed, measured, and aligned over time.",
          ]);
        });
      });
    });

    comp.scene("Why a New Language", { id: "new_language" }, (scene) => {
      scene.cue("First Class Primitives", { id: "first_class_primitives" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              Once procedures become the primary unit of computation, the limitations
              of existing languages become impossible to ignore.
            `,
            0.4,
            t`
              Programming languages shape how humans think about problems.
              They determine what's easy to express and what's invisible.
            `,
            0.35,
            "Procedural, behavior-driven systems need different primitives.",
            0.5,
            "Durability by default. Automatic checkpointing and resumption.",
            0.25,
            "Sandboxing by default. Isolated execution with controlled access.",
            0.25,
            "Tool capability control.",
            0.25,
            t`
              Durable human‑in‑the‑loop: approvals and review loops that can pause and resume
              without keeping a process alive.
            `,
            0.25,
            "Behavioral testing. Observable execution.",
            0.4,
            "These concerns can't be bolted onto languages that weren't designed for them.",
            0.35,
            "They need to be first-class.",
          ]);
        });
      });
    });

    comp.scene("Evolution, Not Alien DNA", { id: "evolution" }, (scene) => {
      scene.cue("Conclusion", { id: "conclusion" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "From a theoretical standpoint, nothing fundamental has broken.",
            0.35,
            t`
              These systems still run on conventional hardware. They're still Turing-complete.
              There's no alien machinery hiding beneath the surface.
            `,
            0.4,
            t`
              What has changed is how decisions are made and how humans must reason
              about those decisions.
            `,
            0.4,
            "For most of computing history, programming meant specifying control flow in advance.",
            0.35,
            "Today, many of the most important systems we build no longer operate that way.",
            0.4,
            t`
              Languages follow mental models. When the mental model changes, new languages
              emerge—not to replace what came before, but to make the new reality tractable
              for humans.
            `,
            0.5,
            "This isn't a revolution in computation. It's evolution.",
          ]);
        });
      });
    });

    comp.scene("Call to Action", { id: "cta" }, (scene) => {
      scene.cue("CTA", { id: "cta" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "Learn more at tactus dot anth dot u s.",
          ]);
        });
      });
    });
  });
});
