import { defineVideo } from "babulus/dsl"
import { sharedDefaults, t, voiceSegments } from "./_babulus.shared.js"

export default defineVideo(video => {
  video.composition("intro", comp => {
    comp.use(sharedDefaults)
    comp.posterTime(48)

    comp.scene("A New Kind of Computer Program", { id: "paradigm" }, scene => {
      scene.music("bed", {
        prompt:
          "Warm ambient background music, energetic percussion, deep bass, no vocals, clean, unobtrusive",
        playThrough: true,
        volume: 0.7,
        fadeTo: { volume: 0.12, afterSeconds: 6, fadeDurationSeconds: 3 },
        fadeOut: { volume: 0.7, beforeEndSeconds: 5, fadeDurationSeconds: 3 },
      })

      scene.cue("Paradigm", { id: "paradigm" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            0.6,
            t`
              Since the dawn of computing, programming has always meant the same thing: anticipate every scenario and write code for it.
              If you miss a case, the program breaks.
            `,
            0.35,
            t`
              But tool‑using agents flip the script.
              Instead of explicitly handling every possible scenario, you depend on AI models to make decisions and take action for you.
            `,
            0.18,
            "In this new kind of programming, first you start with an agent—a language model. Then you give it a tool.",
            0.18,
            "And then you assign it a procedure to follow.",
            0.18,
            "And then you put guardrails around that to guide it toward the goal.",
            0.18,
            "This is a completely new way to automate work with computers. A new kind of computer program.",
          ])
        })
      })

      scene.cue("Paradigm Wrap", { id: "paradigm_wrap" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            0.4,
            t`
              Okay... But how do you do that, exactly? Is there some new way to write code that's about giving agents tools and procedures? Instead of a bunch of if/then statements?
            `,
            0.6,
            "Yes. Tactus is a programming language for this new paradigm.",
          ])
        })
      })
    })

    comp.scene("Hello, World", { id: "hello_world" }, scene => {
      scene.cue("Hello World", { id: "hello_world" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            t`
              Tactus procedures are computer programs that include imperative instructions, like any other language, but they have first-class, high-level constructs for the building blocks that we work with in AI engineering: agents, tools, context, and prompts.
            `,
            0.35,
            t`
              You run Tactus procedures just like you would run a program in any other language like Python or Node—as command-line programs or by embedding them in applications.
            `,
            t`
              Here's an example of running a hello-world program. The procedure runs and returns the response from the agent. It doesn't use a framework because the capabilities are built right into the language.
            `,
            0.2,
          ])
        })
      })
    })

    comp.scene("The Human Interface", { id: "interface" }, scene => {
      scene.cue("Closely Supervised", { id: "interface_supervised" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            t`
              Connecting to agents and tools is just the beginning. The real challenge is the interface layer between the agent and the operator.
            `,
            0.4,
            t`
              The common interface for agents today is chat. You watch every step, you steer, and you stop the agent if it goes sideways. That works great for some things but depends on the human operator.
            `,
            0.4,
            t`
              The user becomes a bottleneck. When you step away to eat or sleep, the whole system stops doing anything. If you're trying to process a lot of items at scale then your capacity is limited by the human operator.You can't scale this up.
            `,
            0.4,
          ])
        })
      })

      scene.cue("Unsupervised", { id: "interface_unsupervised" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            "You could remove the human entirely and let the agent run free. This scales beautifully—you can process thousands of items at machine speed.",
            0.4,
            "But running an agent this way is like giving a monkey a razor blade. And scaling that up to industrial levels is a recipe for disaster.",
            0.4,
          ])
        })
      })

      scene.cue("Durable HITL", { id: "interface_hitl" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            t`
              Tactus provides a new interface layer between the human and the computer. It enables agents to send requests to the human operator and wait for a response. Requests can queue up, so that the system can continue running while the human operator isn't available.
            `,
            0.4,
            t`
              When a procedure needs a human—to approve a risky action, or to provide a missing detail—it pauses. It doesn't use any compute while it's suspended, and it doesn't depend on the runtime to continue running in memory.
            `,
            0.4,
            "It can resume hours or days later, exactly where it left off. This lets you move from synchronous chat to asynchronous, industrial-scale workflows.",
          ])
        })
      })
    })

    comp.scene("No Graphs Required", { id: "graphs" }, scene => {
      scene.cue("No Graphs Required", { id: "graphs" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            0.2,
            t`
              In most programming languages, if you want execution that can pause and resume like this, you're forced into something like a graph workflow, where you have to write code that's structured around nodes, edges, and conditional edges. With Tactus, it's transparent. You write normal code, and the runtime handles pausing and resuming behind the scenes. The graph nodes are still there, but you don't have to think about them.
            `,
          ])
        })
      })
    })

    comp.scene(
      "The Prompt-Engineering Ceiling",
      { id: "prompt_ceiling_intro" },
      scene => {
        scene.cue("Prompt Ceiling", { id: "prompt_ceiling_intro" }, cue => {
          cue.voice(voice => {
            voiceSegments(voice, [
              "To operate confidently in production—safely and securely—you need a minimum threshold of reliability.",
              0.5,
              "The obvious first type of control that everyone reaches for is prompt engineering.",
              0.5,
              "But prompts are suggestions, not controls. There are things you just can't reliably make a model do or not do with prompts alone.",
              0.5,
              "There's a gap between what you can achieve with prompt engineering and the minimum reliability you need to run at scale in production.",
              0.5,
              "To close that gap, you need different types of control.",
            ])
          })
        })
      }
    )

    comp.scene("Defense in Depth", { id: "defense_layers" }, scene => {
      scene.cue("Defense Layers", { id: "defense_layers" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            "Tactus gives you multiple types of control. Because no single type is sufficient on its own.",
            0.5,
            "Prompt engineering guides model behavior, but it's not enough on its own.",
            0.4,
            "Cost and limits block requests before they hit the model—preventing runaway loops and billing surprises.",
            0.4,
            "Context engineering ensures the model has the right information, not just all information.",
            0.4,
            "Model selection for the right capabilities and safety profiles.",
            0.4,
            "Tool selection. Give the agent only the capabilities it needs.",
            0.4,
            "Code sandboxing. Running agent code in a restricted environment so it can't cause damage.",
            0.4,
            "And container isolation. Firewalling agent activity so it can't reach the network or touch your server.",
          ])
        })
      })
    })

    comp.scene("Sandboxing", { id: "sandboxing" }, scene => {
      scene.cue("Sandboxing", { id: "sandboxing" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            "We know AI models make mistakes. Maybe your agent writes buggy tool code. Or maybe an attacker uses a prompt injection to hijack the agent and try something malicious.",
            0.4,
            "You want agents that can write files and run programs—they need to be powerful and useful. But you don't want them reaching out to the network or deleting files on your server.",
            0.5,
            "Tactus runs agent code in a restricted Lua sandbox inside a networkless container. The agent can do real work, but it can't vandalize your system or phone home to some attacker's website.",
            0.5,
            t`
              The other risk is credentials. Your procedure might need keys to call third-party services, but you don't want the agent to see them.
              Tactus keeps secrets outside the container in a separate process. Even if something goes wrong, there's nothing for the agent to steal.
            `,
          ])
        })
      })
    })

    comp.scene("Tactus in a Nutshell", { id: "nutshell" }, scene => {
      scene.cue("Nutshell", { id: "nutshell" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            1.2,
            t`
              In a nutshell, Tactus is a high-level agent programming model, with default-on sandboxing and container isolation, capability and context control, human-in-the-loop gates, and durable checkpoints so long-running workflows can pause, resume, and be audited safely.
            `,
            0.35,
          ])
        })
      })
    })

    comp.scene("Get Started", { id: "cta" }, scene => {
      scene.cue("CTA", { id: "cta" }, cue => {
        cue.voice(voice => {
          voiceSegments(voice, [
            t`
              Ready to try it?
              Visit the Tactus website to download the IDE and run your first procedure.
            `,
            0.35,
          ])
        })
      })
    })
  })
})
