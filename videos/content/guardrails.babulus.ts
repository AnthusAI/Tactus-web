import { defineVideo } from "babulus/dsl";
import { sharedDefaults, t, voiceSegments } from "./_babulus.shared.js";

export default defineVideo((video) => {
  video.composition("guardrails", (comp) => {
    comp.use(sharedDefaults);
    comp.posterTime(81);

    comp.scene("Guardrails for Agent Autonomy", { id: "title_card" }, (scene) => {
      scene.cue("Title", { id: "title" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            0.7,
            "Guardrails for agent autonomy.",
            0.45,
            "Why you can't drive fast without brakes.",
          ]);
        });
      });
    });

    comp.scene("The Paradox of Power", { id: "paradox" }, (scene) => {
      scene.cue("Brakes", { id: "brakes" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              Picture a Formula One car with its brake system removed.
              Lighter. Simpler. Fewer things to go wrong.
            `,
            0.5,
            "You’d crash on the first turn.",
            0.45,
            t`
              The best racing teams don’t debate whether brakes slow them down.
              They know something deeper: brakes are what let you go fast in the first place.
            `,
            0.55,
            t`
              That’s the paradox of agent autonomy.
              Guardrails are not a limitation on autonomy — they’re the prerequisite for it.
            `,
          ]);
        });
      });
    });

    comp.scene("The Pattern Repeats Across Domains", { id: "patterns" }, (scene) => {
      scene.cue("Patterns", { id: "patterns" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "This pattern repeats everywhere humans have built powerful, autonomous systems.",
            0.4,
            t`
              Aviation scaled autonomy by adding checklists, hard limits, and layered safety.
              Medicine made protocols standard because expertise alone isn’t enough under pressure.
              Organizations delegate power safely by creating budgets, approvals, audits, and reviews.
            `,
            0.5,
            t`
              The more powerful the actor, the more critical the guardrails.
              AI isn’t special — it’s just newer.
            `,
          ]);
        });
      });
    });

    comp.scene("The Prompt-Engineering Ceiling", { id: "prompt_ceiling" }, (scene) => {
      scene.cue("Prompt Ceiling", { id: "prompt_ceiling" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "Prompts matter. They shape behavior and reduce error rates.",
            0.4,
            t`
              But prompts are suggestions, not controls.
              When an agent has access to powerful tools, you eventually hit a ceiling.
              You can make failure less likely, but you can’t make it vanish.
            `,
            0.5,
            t`
              Production safety can’t be built out of suggestions alone.
              You need enforceable boundaries.
            `,
          ]);
        });
      });
    });

    comp.scene("The Manual Assembly Problem", { id: "manual_assembly" }, (scene) => {
      scene.cue("Manual Assembly", { id: "manual_assembly" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              The best teams already add guardrails in Python:
              schemas, validation, retries, approval gates, sandboxing, and secrets hygiene.
            `,
            0.4,
            t`
              The problem isn’t that people don’t know guardrails matter.
              The problem is that when you assemble everything by convention across mismatched systems,
              it’s easy to miss a layer.
            `,
            0.45,
            "Missing a layer won’t feel like a mistake until it becomes an incident.",
          ]);
        });
      });
    });

    comp.scene("Guardrails as First-Class Architecture", { id: "defense_in_depth" }, (scene) => {
      scene.cue("Defense in Depth", { id: "defense_in_depth" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              This is the philosophy behind Tactus.
              Guardrails are not add-ons you bolt on later.
              They're architectural decisions baked into the execution model.
            `,
            0.5,
            t`
              No single technique solves everything.
              Guardrails work as defense in depth: layers that each reduce a different class of risk.
            `,
            0.4,
            "At the top: cost and limits. Hard quotas prevent runaway loops before they become billing nightmares.",
            0.35,
            "Prompt engineering. Structured instructions guide behavior and reduce error rates.",
            0.35,
            "Context engineering. Curated context ensures the model has the right information, not just all information.",
            0.35,
            "Model selection. Choose and fine-tune models for specific capabilities and safety profiles.",
            0.35,
            "Tool selection. Give the agent only the capabilities it needs, and stage access over time.",
            0.35,
            "Code sandboxing. Isolated execution environments prevent unauthorized system access.",
            0.35,
            "Container isolation. Ephemeral containers constrain what the runtime can touch and firewall side effects inside the container.",
            0.35,
          ]);
        });
      });
    });

    comp.scene("Least Privilege by Design", { id: "least_privilege" }, (scene) => {
      scene.cue("Least Privilege", { id: "least_privilege" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "Tactus enforces least privilege by design, across multiple dimensions.",
            0.4,
            "Minimal toolsets: agents get only the tools they need, not a kitchen sink.",
            0.35,
            "Curated context: relevant information only, not everything.",
            0.35,
            "Network isolation: the runtime is networkless by default.",
            0.35,
            "Secretless broker: credentials stay outside, the agent requests work but never holds keys.",
            0.35,
            "Temporal gating: tools become available only when the workflow stage requires them.",
          ]);
        });
      });
    });

    comp.scene("Sandboxing + a Secretless Broker Boundary", { id: "sandbox_broker" }, (scene) => {
      scene.cue("Sandbox + Broker", { id: "sandbox_broker" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            t`
              Once you let an agent write files or run code, you want a cage.
              Tactus runs orchestration inside a sandboxed Lua environment,
              and when sandboxing is enabled, inside an ephemeral container.
            `,
            0.5,
            t`
              But containers answer only one security question: what can it touch?
              The other question is: what can it steal?
            `,
            0.5,
            t`
              The broker boundary is the game changer.
              Keep the runtime secretless and networkless by default.
              The sandbox can request tool calls, but it never holds provider keys.
              The keys live outside the sandbox, in a trusted broker.
            `,
            0.45,
            t`
              This is the security model: don’t make secrets hard to steal—make sure there are no secrets inside the runtime to steal.
              It’s like letting a burglar into an empty building. Even if they get in, there’s nothing valuable to take.
            `,
          ]);
        });
      });
    });

    comp.scene("A Concrete Example", { id: "example" }, (scene) => {
      scene.cue("Recap Emails", { id: "recap_emails" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "Consider a workflow that drafts and sends recap emails from meeting notes.",
            0.4,
            t`
              Without guardrails, you either supervise every run,
              or you give the agent side-effect tools and accept unacceptable risk.
            `,
            0.45,
            t`
              With staged tools and durable approvals, the agent drafts with read-only tools,
              a human reviews at a checkpoint,
              and only after approval does the send tool become available.
            `,
          ]);
        });
      });
    });

    comp.scene("Closing", { id: "closing" }, (scene) => {
      scene.cue("Closing", { id: "closing" }, (cue) => {
        cue.voice((voice) => {
          voiceSegments(voice, [
            "Guardrails aren’t a tax. They’re the engine of delegation.",
            0.4,
            t`
              The race car needs brakes.
              The surgeon needs protocols.
              The organization needs governance.
              The agent needs guardrails.
            `,
            0.5,
            "Read the full story at tactus dot run slash guardrails.",
          ]);
        });
      });
    });
  });
});
