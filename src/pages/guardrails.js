import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import Breakout from "../components/publishing/Breakout"
import AnimatedGuardrailsStackDiagram from "../components/diagrams/AnimatedGuardrailsStackDiagram"
import LeastPrivilegeDiagram from "../components/diagrams/LeastPrivilegeDiagram"
import ContainerSandboxDiagram from "../components/diagrams/ContainerSandboxDiagram"
import PromptEngineeringCeilingDiagram from "../components/diagrams/PromptEngineeringCeilingDiagram"
import * as styles from "./guardrails.module.css"

const usePreferredTheme = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

const GuardrailsPage = () => {
  const theme = usePreferredTheme()

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Guardrails</p>
              <h1 className={styles.title}>Guardrails for Agent Autonomy</h1>
              <p className={styles.lede}>
                Guardrails are not a limitation on agent autonomy — they’re a prerequisite for it. The brakes enable the speed.
              </p>
            </div>

            <nav className={styles.toc} aria-label="Table of contents">
              <h2 className={styles.tocTitle}>Contents</h2>
              <ol className={styles.tocList}>
                <li>
                  <a href="#paradox">The paradox of power</a>
                </li>
                <li>
                  <a href="#patterns">The pattern repeats across domains</a>
                </li>
                <li>
                  <a href="#ai-is-learning">Why AI is still learning this lesson</a>
                </li>
                <li>
                  <a href="#first-class">Guardrails as first-class architecture</a>
                </li>
                <li>
                  <a href="#what-becomes-possible">What this makes possible</a>
                </li>
                <li>
                  <a href="#trust">Not a technical problem — a trust problem</a>
                </li>
                <li>
                  <a href="#next">Next steps</a>
                </li>
              </ol>
            </nav>
          </div>
        </section>

        <section id="paradox" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>The paradox of power</h2>

            <Breakout title="You can’t drive fast without brakes" withContainer={false}>
              <p>Picture a Formula 1 car with its brake system removed. Lighter. Simpler. Fewer things to go wrong.</p>
              <p>
                <strong>You’d crash on the first turn.</strong>
              </p>
              <p>
                The best racing teams don’t debate whether brakes slow them down. They know something deeper:{" "}
                <strong>brakes are what let you go fast in the first place.</strong>
              </p>
            </Breakout>

            <p className={styles.bodyText}>
              The same paradox shows up whenever humans build powerful systems that take real action in the world. Constraints enable
              capability. Protocols enable autonomy. Boundaries enable delegation.
            </p>
            <p className={styles.bodyTextMuted}>
              This is the central tension in agent development today. If you want agents to do meaningful work without you watching
              every step — and if those agents can take real actions with side effects — guardrails stop being a nice-to-have.
              They become the price of admission.
            </p>
            <p className={styles.bodyTextMuted}>
              Guardrails are not a limitation on autonomy. They’re the prerequisite for it. You can’t drive fast without brakes.
            </p>
          </div>
        </section>

        <section id="patterns" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>The pattern repeats across domains</h2>
            <p className={styles.bodyText}>
              Look across fields where humans have successfully built systems that operate with meaningful autonomy: aviation,
              medicine, and organizations. You’ll find the same story again and again.
            </p>

            <div className={styles.domainGrid}>
              <article className={styles.domainCard}>
                <h3 className={styles.domainTitle}>Aviation</h3>
                <p className={styles.bodyTextMuted}>
                  Early aviation relied on skill and hope. Modern flight systems embed hard limits, checklists, and layered safety —
                  not because pilots became less trustworthy, but because{" "}
                  <strong>small failure rates become catastrophic at scale</strong>.
                </p>
              </article>
              <article className={styles.domainCard}>
                <h3 className={styles.domainTitle}>Medicine</h3>
                <p className={styles.bodyTextMuted}>
                  Surgical checklists weren’t an insult to expertise — they were a recognition that{" "}
                  <strong>expertise plus protocols beats expertise alone</strong>, especially under pressure.
                </p>
              </article>
              <article className={styles.domainCard}>
                <h3 className={styles.domainTitle}>Organizations</h3>
                <p className={styles.bodyTextMuted}>
                  Delegation requires boundaries: budgets, approval gates, audits, and reviews. It’s not micromanagement — it’s how
                  you scale autonomy safely.
                </p>
              </article>
            </div>

            <h3 className={styles.subsectionTitle}>Aviation: autonomy grew as guardrails became standard</h3>
            <p className={styles.bodyText}>
              In the early days of aviation, safety meant hiring skilled pilots and hoping for the best. When something went wrong,
              the cause was often labeled “pilot error” — as if competence alone could eliminate mistakes.
            </p>
            <p className={styles.bodyTextMuted}>
              Modern aviation took a different path. Flight systems don’t just follow instructions — they operate within hard limits.
              Checklists, redundant systems, and layered safety became defaults not because pilots became less trustworthy, but because
              the industry learned a hard truth: small failure rates become catastrophic at scale.
            </p>

            <h3 className={styles.subsectionTitle}>Medicine: protocols aren’t an insult to expertise</h3>
            <p className={styles.bodyText}>
              A skilled surgeon doesn’t need a checklist to remember to wash their hands, right?
            </p>
            <p className={styles.bodyTextMuted}>
              Except that under pressure, even world-class teams miss steps. Modern medicine treats protocols and checklists as
              enablement: a recognition that expertise plus guardrails beats expertise alone when consequences are real.
            </p>

            <h3 className={styles.subsectionTitle}>Organizations: delegation requires boundaries</h3>
            <p className={styles.bodyText}>
              Every functional organization learns the same lesson: you can’t delegate authority without also defining constraints.
            </p>
            <p className={styles.bodyTextMuted}>
              Budgets, approval gates, audits, and reviews aren’t bureaucracy for its own sake. They’re how you safely distribute
              power. The clearer the boundaries, the more autonomy you can grant.
            </p>

            <Breakout title="The lesson is simple" withContainer={false}>
              <p>
                <strong>The more powerful the actor, the more critical the guardrails.</strong> AI is not special — it’s just newer.
              </p>
            </Breakout>
          </div>
        </section>

        <section id="ai-is-learning" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why AI is still learning this lesson</h2>

            <p className={styles.bodyText}>
              AI is new enough that the guardrails lesson still feels optional. We’re in the “let’s see what’s possible” phase — and
              that’s where innovation happens.
            </p>
            <p className={styles.bodyTextMuted}>
              But “cool demos” and “production systems” live in different worlds. Production systems aren’t supervised. They run many
              times. They run when you’re asleep. And in those environments, “most of the time” is not a strategy.
            </p>
            <p className={styles.bodyTextMuted}>
              Other fields learned this lesson the hard way — after decades of incidents, postmortems, and iteration. AI hasn’t had
              fifty years of flight-safety reports yet. So we’re still debating questions that mature domains already settled:
              constraints don’t block autonomy — they enable it.
            </p>
            <p className={styles.bodyTextMuted}>
              If your only guardrail is “the prompt says don’t do X,” you’ve built something that works until the day it doesn’t — and
              you won’t know the difference ahead of time.
            </p>

            <h3 className={styles.subsectionTitle}>The prompt-engineering ceiling</h3>
            <p className={styles.bodyText}>
              Prompts matter. They shape behavior, reduce error rates, and make models more reliable. But prompts are suggestions, not
              controls.
            </p>
            <p className={styles.bodyText}>
              When an agent has access to powerful tools, you eventually hit a ceiling. You can reduce the error rate. You can make
              failure less likely. But you can’t make it vanish — not with probabilistic instruction-following alone.
            </p>

            <div className={styles.diagramWrap}>
              <PromptEngineeringCeilingDiagram theme={theme} className={styles.diagram} />
            </div>

            <p className={styles.bodyTextMuted}>
              This isn’t a criticism of prompt engineering. It’s the nature of probabilistic systems. The answer isn’t “prompts don’t
              matter.” The answer is that you can’t build a production safety story out of suggestions alone.
            </p>

            <h3 className={styles.subsectionTitle}>The manual assembly problem</h3>
            <p className={styles.bodyText}>
              The best AI engineering teams already build guardrails in Python: schemas, validation, retries, approval gates,
              sandboxing, and secrets hygiene. The problem isn’t ignorance — it’s that you have to remember and assemble all of it,
              under pressure, across layers that weren’t designed to fit together.
            </p>
            <p className={styles.bodyTextMuted}>
              It’s like building a car from parts. You can do it. Smart teams do. But you have to remember every safety system
              yourself — and missing a layer won’t feel like a mistake until it becomes an incident.
            </p>
            <p className={styles.bodyTextMuted}>
              Frameworks can help, but they can’t eliminate the underlying fragmentation. Prompts live here. Tool wrappers live there.
              Approval gates are conventions. Sandboxing is a separate system. Secrets hygiene is “best practice.” You end up
              translating, mentally, between how the system behaves and how your code expresses it — and that translation cost shows up
              as fragility.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Guardrails teams build manually</p>
              <ul className={styles.checkList}>
                <li>Tool schemas + deterministic validation</li>
                <li>Policy enforcement (allowlists, limits, invariants)</li>
                <li>Retries and backoff for partial failures</li>
                <li>Approval gates for irreversible actions</li>
                <li>Sandboxing for code and filesystem access</li>
                <li>Secrets isolation to prevent credential theft</li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This is where a language and runtime designed for agentic systems helps: not because it makes models perfect, but
              because it makes the guardrails systemic. The layers become defaults instead of responsibilities you can forget.
            </p>
          </div>
        </section>

        <section id="first-class" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Guardrails as first-class architecture</h2>
            <p className={styles.bodyText}>
              This is the philosophy behind Tactus: guardrails are not add-ons you bolt on later. They are architectural decisions
              baked into the execution model.
            </p>
            <p className={styles.bodyTextMuted}>
              Treat agent workflows as <strong>untrusted execution with the ability to act</strong>. Then build boundaries that
              constrain what the untrusted part can do — without making development miserable.
            </p>
            <p className={styles.bodyTextMuted}>
              No single technique solves everything. Guardrails work as <strong>defense in depth</strong>: layers that each reduce a
              different class of risk, so you don’t have to bet your entire safety story on one fragile assumption.
            </p>

            <div className={styles.diagramWrap}>
              <AnimatedGuardrailsStackDiagram theme={theme} className={styles.diagram} />
            </div>

            <h3 className={styles.subsectionTitle}>Least privilege by design</h3>
            <p className={styles.bodyText}>
              Tactus enforces least privilege across multiple dimensions, not just tool access. The runtime architecture ensures
              that agents operate with minimal capability at every level.
            </p>
            <p className={styles.bodyText}>
              Agents receive minimal toolsets (only what's needed for the task), curated context (relevant information, not everything),
              default network isolation (networkless by default), secretless execution via broker (credentials stay outside), and temporal
              gating of capabilities (tools available only when workflow stage requires them).
            </p>
            <p className={styles.bodyTextMuted}>
              This is the difference between "the agent promised not to" and "the system made it structurally impossible."
            </p>

            <div className={styles.diagramWrap}>
              <LeastPrivilegeDiagram theme={theme} className={styles.diagram} />
            </div>

            <p className={styles.bodyTextMuted}>
              Each dimension reduces a different class of risk. Together, they create a holistic approach to safe agent autonomy
              where the right thing is structurally easier than the wrong thing.
            </p>

            <h3 className={styles.subsectionTitle}>Tool boundaries (validation and policy)</h3>
            <p className={styles.bodyText}>
              Tools are the seam where probabilistic behavior meets deterministic code — which makes them the right place to enforce
              rules you can’t safely delegate to a model.
            </p>
            <p className={styles.bodyTextMuted}>
              Validate inputs. Enforce policy. Apply allowlists and limits. Log what happened. Even if the model tries something
              weird, the boundary can say “no.”
            </p>
            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Typical policies belong at the tool boundary</p>
              <ul className={styles.checkList}>
                <li>Recipient/domain allowlists for outbound messages</li>
                <li>Path + size restrictions for file writes</li>
                <li>Explicit side-effect toggles and dry-run modes</li>
                <li>Structured logs for auditing and incident review</li>
              </ul>
            </div>

            <h3 className={styles.subsectionTitle}>Human in the loop (durable gates)</h3>
            <p className={styles.bodyText}>
              Approvals aren’t just UX — they’re a security primitive. The trick is making them practical. Tactus treats a human gate
              as a durable suspend point: hit the gate, checkpoint, pause, and resume later when the human responds.
            </p>
            <p className={styles.bodyTextMuted}>
              Most systems can’t afford to keep a long-running process alive while someone is away from their keyboard. Durability is
              what makes human-in-the-loop workflows real: you can wait minutes or hours, then resume safely without losing state.
            </p>

            <Breakout title="Durable HITL changes the default" withContainer={false}>
              <p>
                Without durable approvals, “human in the loop” only works in toy workflows. With it,{" "}
                <strong>approval before irreversible actions</strong> can be the default in real systems.
              </p>
            </Breakout>

            <h3 className={styles.subsectionTitle}>Sandboxing + secretless execution</h3>
            <p className={styles.bodyText}>
              Once you let an agent write files or run code, you want a cage. Tactus runs orchestration inside a sandboxed Lua
              environment, and (when sandboxing is enabled) executes within an ephemeral container.
            </p>
            <p className={styles.bodyTextMuted}>
              The goal isn’t to prevent all mistakes. It’s to reduce blast radius: limit what the runtime can touch, keep runs
              isolated from each other, and avoid accidental leakage of sensitive information.
            </p>
            <p className={styles.bodyTextMuted}>
              Put simply: keep the monkey in the box — and keep sensitive information out of the box.
            </p>

            <div className={styles.diagramWrap}>
              <ContainerSandboxDiagram theme={theme} className={styles.diagram} />
            </div>

            <p className={styles.bodyText}>
              To make this practical, Tactus uses a <strong>broker</strong> boundary for privileged operations. The sandbox can request
              work, but the broker performs the work: model API calls and allowlisted host-side tools, with credentials and policy
              enforced outside the untrusted runtime.
            </p>
            <p className={styles.bodyTextMuted}>
              This is how you can keep the runtime container secretless and (by default) networkless — while still letting the system
              do real work. The broker becomes the narrow bridge between untrusted execution and the privileged world.
            </p>

            <p className={styles.bodyText}>
              But containers answer only one security question: “what can it touch?” The other question is the one that matters most
              in real systems: “what can it steal?”
            </p>

            <Breakout title="When there’s nothing to steal, a whole class of attacks collapses" withContainer={false}>
              <p>
                Containers answer “what can it touch?” Secretless execution answers “what can it steal?” If the runtime never holds
                API keys, prompt injection can’t turn into credential theft.
              </p>
            </Breakout>
          </div>
        </section>

        <section id="what-becomes-possible" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What this makes possible</h2>
            <p className={styles.bodyText}>
              Guardrails aren’t only about preventing bad outcomes. They enable good outcomes that would otherwise be too risky:
              delegation, scale, and real side effects.
            </p>
            <p className={styles.bodyTextMuted}>
              Without guardrails, you can only trust agents with narrow, read-only tools — or you supervise every run. With layered
              guardrails, you can delegate real work and step back.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>With layered guardrails, you can</p>
              <ul className={styles.checkList}>
                <li>Delegate real work and keep humans for the decisions that matter</li>
                <li>Allow powerful tools safely, because usage is staged and audited</li>
                <li>Scale across many runs without cross-contamination</li>
                <li>Operate workflows that pause for review and resume later</li>
                <li>Build a safety story that isn’t “hope the prompt works”</li>
              </ul>
            </div>

            <h3 className={styles.subsectionTitle}>A concrete example: meeting recap emails</h3>
            <p className={styles.bodyTextMuted}>
              Consider a workflow that drafts and sends recap emails from meeting notes. Without guardrails, you either supervise
              every run or accept unacceptable risk. With staged tools + durable approvals, the agent does the work and a human only
              intervenes at the right moment.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>A safe delegation pattern</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>Stage 1 (Draft):</strong> read notes, format text — no side effects
                </li>
                <li>
                  <strong>Stage 2 (Review):</strong> durable approval with preview/diff
                </li>
                <li>
                  <strong>Stage 3 (Send):</strong> send tool becomes available only after approval
                </li>
              </ul>
            </div>

            <p className={styles.bodyText}>
              This is the point: the agent doesn’t need to be “perfect.” The system needs to be engineered so that mistakes are
              contained before they become catastrophic.
            </p>
            <p className={styles.bodyTextMuted}>
              That’s the unlock. Guardrails don’t just prevent bad outcomes — they make autonomy practical.
            </p>
          </div>
        </section>

        <section id="trust" className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Not a technical problem — a trust problem</h2>
            <p className={styles.bodyText}>
              At its core, this is about trust: can you trust an agent to run semi-unattended, with powerful tools and sensitive data?
              The answer isn’t “make the model smarter.” The answer is to make constraints visible and enforceable.
            </p>
            <p className={styles.bodyTextMuted}>
              Aviation didn’t get safe by hiring better pilots. Medicine didn’t eliminate error by hiring smarter surgeons.
              Organizations didn’t become governable by finding more ethical executives. They built systems where the right thing is
              structurally easier than the wrong thing — and where failures are constrained before they become disasters.
            </p>
            <p className={styles.bodyText}>
              That’s the promise of guardrails: not restriction, but enablement. The brakes let you go fast.
            </p>

            <Breakout title="Guardrails aren’t a tax — they’re the engine of delegation" withContainer={false}>
              <p>The race car needs brakes. The surgeon needs protocols. The organization needs governance. The agent needs guardrails.</p>
              <p>
                Tactus makes them first-class — so you can build systems that are powerful <em>and</em> trustworthy.
              </p>
            </Breakout>
          </div>
        </section>

        <section id="next" className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Next steps</h2>
            <p className={styles.bodyTextMuted}>
              If you want the deeper technical details, these chapters go into the implementation layers: threat modeling, sandboxing,
              and secretless execution.
            </p>
            <div className={styles.linksRow}>
              <a href="https://anthusai.github.io/Learning-Tactus/" target="_blank" rel="noreferrer">
                Learning Tactus
              </a>
              <a
                href="https://anthusai.github.io/Learning-Tactus/chapters/12-threat-modeling-and-guardrails/"
                target="_blank"
                rel="noreferrer"
              >
                Threat modeling + guardrails
              </a>
              <a
                href="https://anthusai.github.io/Learning-Tactus/chapters/13-sandboxing-layers-lua-vm-and-containers/"
                target="_blank"
                rel="noreferrer"
              >
                Sandboxing layers
              </a>
              <a href="https://anthusai.github.io/Learning-Tactus/chapters/14-secretless-execution/" target="_blank" rel="noreferrer">
                Secretless execution
              </a>
            </div>
          </div>
        </section>

        <BottomCta
          title="Ready to start building?"
          text="Write your first Tactus procedure and learn the patterns that make semi-unattended agents safe."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Guardrails for Agent Autonomy"
    description="Guardrails aren’t a limitation on autonomy — they’re a prerequisite. Learn the layered boundaries that make powerful tools safe to delegate."
  />
)

export default GuardrailsPage
