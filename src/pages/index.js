import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { Github, Copy, Check, Cable } from "lucide-react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import BottomCta from "../components/bottom-cta"
import SpotlightSection from "../components/spotlight-section"
import GuardrailsSpotlight from "../components/guardrails-spotlight"
import AnimatedAIEngineersToolboxDiagram from "../components/diagrams/AnimatedAIEngineersToolboxDiagram"
import HitlReturnsAllDiagram from "../components/diagrams/HitlReturnsAllDiagram"
import AnimatedHumanInTheLoopDiagram from "../components/diagrams/AnimatedHumanInTheLoopDiagram"
import { HITL_PRESETS } from "../components/diagrams/hitlPresets"
import AnimatedOldWayFlowchartDiagram from "../components/diagrams/AnimatedOldWayFlowchartDiagram"
import AnimatedNewWayFlowchartDiagram from "../components/diagrams/AnimatedNewWayFlowchartDiagram"
import FeatureHighlightsSection from "../components/feature-highlights-section"
import BookSeriesSection from "../components/book-series-section"
import Button from "../components/ui/button"
import Breakout from "../components/publishing/Breakout"
import getVideoSrc from "../lib/getVideoSrc"
import * as styles from "./index.module.css"

const Icons = {
  Box: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  WifiOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
  ),
  Terminal: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  ),
  Cable: () => (
    <Cable className={styles.icon} />
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  )
}

const HELLO_WORLD_EXAMPLE = `World = Agent {
    provider = "openai",
    model = "gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").response`

const DURABILITY_EXAMPLE = `local approved = Human.approve({
    message = "Deploy to production?",
    context = {environment = "prod"},
    timeout = 3600,
    default = false
})

if approved then
    deploy()
end`

const SPECIFICATIONS_EXAMPLE = `Specifications([[
Feature: Deployments are safe

  Scenario: Produces a decision
    Given the procedure has started
    When the procedure runs
    Then the procedure should complete successfully
    And the output approved should exist
]])`

const VALIDATION_EXAMPLE = `researcher = Agent {
    provider = "openai",
    model = "gpt-5",
    system_prompt = "Research the topic. Return a concise answer.",
    initial_message = "Research: {input.topic}"
}

Procedure {
    input = {
        topic = field.string{required = true},
    },
    output = {
        approved = field.boolean{required = true},
        findings = field.string{required = true},
    },
    function(input)
        local findings = researcher().response

        local approved = Human.approve({
            message = "Publish these findings?",
            timeout = 3600,
            default = false,
            context = {topic = input.topic}
        })

        return {approved = approved, findings = findings}
    end,
}`

const PARADIGM_OLD_WAY_CODE = `def import_contact(row):
    # Expect a 1-row CSV string
    # ... parsing logic ...

    # Email column mapping?
    email = (
        row.get("email")
        or row.get("e-mail")
        or row.get("correo")
    )
    if not email:
        raise ValueError("Missing email")

    # Name mapping?
    name = row.get("name") or ""
    if "," in name:
        last, first = name.split(",", 1)
    else:
        first, last = name.split(" ", 1)

    # Each new variation = new code.
    return create_contact(first, last, email)`

const PARADIGM_NEW_WAY_CODE = `-- Define the capability (schema)
contact_tool = Tool.define {
    name = "create_contact",
    description = "Import a contact into CRM",
    input = {
        first_name = "string",
        last_name = "string",
        email = "string (email format)",
        notes = "string (optional)"
    }
}

-- The agent figures out the mapping
function import_contact(row_data)
    agent.use(contact_tool, {
        instruction = "Import this contact data",
        data = row_data
    })
end`

const INSTALL_COPY_VALUE = "pip install tactus"

const InstallCommand = () => {
  const [copied, setCopied] = React.useState(false)

  const doCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COPY_VALUE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      try {
        const el = document.createElement("textarea")
        el.value = INSTALL_COPY_VALUE
        el.setAttribute("readonly", "")
        el.style.position = "absolute"
        el.style.left = "-9999px"
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      } catch (e2) {
        // No-op: clipboard unavailable
      }
    }
  }

  return (
    <Button
      as="div"
      variant="secondary"
      size="large"
      shadow
      className={styles.installCommand}
      role="group"
      aria-label="Install Tactus"
    >
      <span className={styles.installPrompt} aria-hidden="true">
        $
      </span>
      <code className={styles.installCode}>pip install tactus</code>
      <button
        type="button"
        className={styles.copyButton}
        onClick={doCopy}
        aria-label={copied ? "Copied" : "Copy install command"}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </Button>
  )
}

const FEATURE_HIGHLIGHTS = [
  {
    title: "Docker sandbox by default",
    body: (
      <>
        Procedures run in a Lua sandbox inside a Docker container: keep the monkey in the box, and keep sensitive information out of
        the box.
      </>
    ),
    icon: <Icons.Box />,
  },
  {
    title: "Networkless by default",
    body: (
      <>
        Keep the runtime container on <code>network: none</code>, while still calling models and tools through a host transport (e.g.{" "}
        <code>stdio</code>).
      </>
    ),
    icon: <Icons.WifiOff />,
  },
  {
    title: "API keys stay outside the sandbox",
    body: <>API keys never live in the runtime container—and never get passed into model prompts.</>,
    icon: <Icons.Key />,
  },
  {
    title: "Brokered tools",
    body: (
      <>
        Tools that need secrets or privileged access can run outside the sandbox via a broker, streaming back results so the agent
        gets answers, not credentials.
      </>
    ),
    icon: <Icons.Cable />,
  },
  {
    title: "Least privilege controls",
    body: <>Minimal toolsets, curated context, network isolation, secretless broker, and temporal gating—agents get only what they need, when they need it.</>,
    icon: <Icons.Lock />,
  },
  {
    title: "Durable + testable",
    body: <>Checkpoint long workflows, add HITL where needed, and measure reliability with specs + evaluations.</>,
    icon: <Icons.Save />,
  },
]

const IndexPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <aside className={styles.heroAside}>
                <div className={styles.animalCard}>
                  <StaticImage
                    src="../images/animals/learning-cover-animal.png"
                    alt="An animal illustration in the style of a classic programming book cover"
                    loading="eager"
                    width={640}
                    quality={90}
                    formats={["auto", "webp", "avif"]}
                    className={styles.animalImage}
                  />
                  <p className={styles.animalCaption}>
                    Tools are sharp. Guardrails are not optional.
                  </p>
                </div>
              </aside>

              <p className={styles.eyebrow}>
                A language + runtime for tool-using agents
              </p>
              <h1 className={styles.title}>
                <span className={styles.titleBlock}>Tactus</span>
              </h1>
              <p className={styles.subtitle}>
                <b>Give AI agents powerful tools.</b> Safely and securely.
              </p>

              <p className={`${styles.lede} drop-cap`}>
                Tool-using agents are useful—and dangerous: run them unattended
                and you’re giving a monkey a razor blade and hoping for the best.
              </p>
              <p className={styles.lede}>
                Tactus gives you a high-level language for building tool-using
                agents, with capability and context control, durable workflows,
                and default-on sandboxing and container isolation so they can run
                unattended without touching your host—or your API keys.
              </p>

              <div className={styles.ctaGrid}>
                <Button to="/getting-started/" variant="primary" size="large" shadow>
                  Get started
                </Button>
                <Button
                  href="https://github.com/AnthusAI/Tactus"
                  variant="secondary"
                  size="large"
                  shadow
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github size={18} />
                  View code
                </Button>
                <div className={styles.ctaGridInstall}>
                  <InstallCommand />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hello World - moved up from below */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Hello, world</h2>
                <p className={styles.sectionSubtitle}>
                  Define an agent, then call it like a function.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Hello, world"
                  filename="examples-hello-world.tac"
                  hint="Agent"
                  code={HELLO_WORLD_EXAMPLE}
                  language="tactus"
                  showTypewriter={true}
                  typewriterLoop={false}
                  typewriterDelay={0.2}
                  typewriterSpeed={1.1}
                  autoHeight={true}
                  blockWidth={1400}
                  width="100%"
                  autoPlay={true}
                  controls={false}
                  loop={false}
                />
              </div>

              <div className={styles.videoCard}>
                <div className={styles.videoHeader}>
                  <span className={styles.videoTitle}>Intro to Tactus (4 min)</span>
                  <Link className={styles.videoLink} to="/videos/">
                    All videos
                  </Link>
                </div>
                <video
                  className={styles.video}
                  controls
                  preload="metadata"
                  playsInline
                  src={getVideoSrc("intro.mp4")}
                  poster={getVideoSrc("intro-poster.jpg")}
                />
              </div>

              <div className={styles.exampleCopy}>
                <p className={styles.exampleLead}>
                  In Cursor or Claude, tool-using agents feel safe because you're
                  there to supervise: you see every tool call, you steer, and you
                  can stop the run the moment it goes sideways.
                </p>
                <p className={styles.exampleLead}>
                  But how do we step back and give agents more agency to do things on their own—with
                  powerful tools that have full control and can act on the systems and data we care about?
                </p>

                <div className={styles.compareGrid}>
                  <div className={styles.compareCard}>
                    <h3 className={styles.compareTitle}><Icons.Eye /> Supervised (chat)</h3>
                    <ul className={styles.compareList}>
                      <li>You watch every step and tool call.</li>
                      <li>You can correct course mid-run.</li>
                      <li>You can halt before damage is done.</li>
                    </ul>
                  </div>
                  <div className={styles.compareCard}>
                    <h3 className={styles.compareTitle}><Icons.Alert /> Unattended (production)</h3>
                    <ul className={styles.compareList}>
                      <li>Runs without you—and runs many times.</li>
                      <li>Small failure rates become incidents.</li>
                      <li>Needs enforcement, not hope.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Paradigm Shift - Main Header */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <p className={styles.eyebrow}>The paradigm shift</p>
              <h2 className={styles.sectionTitle}>
                A new kind of computer program
              </h2>
              <p className={styles.sectionSubtitle}>
                Since the dawn of computing, programming has meant anticipating every scenario and writing code for it.
                But tool-using agents flip the script.
              </p>
            </header>
          </div>
        </section>

        {/* Old Way - Show the Problem First */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <div className={styles.narrativeSection}>
              <div className={styles.narrativeGrid}>
                <div className={styles.narrativeContent}>
                  <h3 className={styles.sectionTitle}>
                    The old way: anticipate everything
                  </h3>
                  <p className={styles.sectionSubtitle}>
                    Traditional programs are brittle. Parse this format. Catch that error.
                    Map these fields to those fields. Miss one case and the program breaks.
                  </p>
                </div>
                <div className={styles.narrativeDiagramColumn}>
                  <div className={styles.narrativeDiagram}>
                    <AnimatedOldWayFlowchartDiagram durationMs={4000} />
                  </div>
                  <p className={styles.narrativeCaption}>
                    Every new edge case requires more conditional logic
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Way - Then Show the Solution */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <div className={styles.narrativeSection}>
              <div className={styles.narrativeGrid}>
                <div className={styles.narrativeContent}>
                  <h3 className={styles.sectionTitle}>
                    The new way: agents with guardrails
                  </h3>
                  <p className={styles.sectionSubtitle}>
                    Instead of handling every edge case yourself, you give an agent tools and a procedure,
                    and let it work inside guardrails.
                  </p>
                </div>
                <div className={styles.narrativeDiagramColumn}>
                  <div className={styles.narrativeDiagram}>
                    <AnimatedNewWayFlowchartDiagram durationMs={3200} />
                  </div>
                  <p className={styles.narrativeCaption}>
                    Agent + Tools + Procedure, bounded by Guardrails
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.section}`} id="paradigm">
          <div className={styles.container}>
            <div className={styles.paradigm}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Here's what that looks like in code
                </h2>
                <p className={styles.sectionSubtitle}>
                  Instead of anticipating every edge case, you define
                  capabilities and let an agent do the mapping.
                </p>
              </header>

              <div className={styles.paradigmGrid}>
                <div className={styles.paradigmCard}>
                  <h3 className={styles.paradigmCardTitle}>
                    The old way: think of everything
                  </h3>
                  <p className={styles.paradigmBody}>
                    Traditional code is brittle because every new input format
                    means more conditional logic. Miss one case and the program
                    breaks.
                  </p>
                  <div className={styles.paradigmCode}>
                    <AnimatedCodeBlock
                      label="The old way"
                      code={PARADIGM_OLD_WAY_CODE}
                      language="python"
                      showTypewriter={false}
                      typewriterLoop={false}
                      hideTitleBar={true}
                      autoHeight={true}
                      blockWidth={1400}
                      width="100%"
                      autoPlay={false}
                      controls={false}
                      loop={false}
                    />
                  </div>
                </div>

                <div className={styles.paradigmCard}>
                  <h3 className={styles.paradigmCardTitle}>
                    The new way: give an agent a tool
                  </h3>
                  <p className={styles.paradigmBody}>
                    You define the capability and give the agent the messy
                    input. The agent applies judgment to map fields and handle
                    variation—without rewriting your logic.
                  </p>
                  <div className={styles.paradigmCode}>
                    <AnimatedCodeBlock
                      label="The new way"
                      code={PARADIGM_NEW_WAY_CODE}
                      language="tactus"
                      showTypewriter={false}
                      typewriterLoop={false}
                      hideTitleBar={true}
                      autoHeight={true}
                      blockWidth={1400}
                      width="100%"
                      autoPlay={false}
                      controls={false}
                      loop={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HITL Variants */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hitlVariants}>
              <header className={styles.sectionHeader}>
                <p className={styles.eyebrow}>Human in the loop</p>
                <h2 className={styles.sectionTitle}>Scale autonomy safely</h2>
                <p className={styles.sectionSubtitle}>
                  Approve, reject, and provide input — without babysitting a chat window.
                </p>
              </header>

              <div className={styles.hitlVariantsIntro}>
                <p className={styles.exampleLead}>
                  Tool-using agents are useful — and dangerous. The moment an agent can take irreversible actions, “hope for the
                  best” stops being a viable safety strategy.
                </p>
                <p className={styles.exampleLead}>
                  Chat feels safe because you’re supervising the agent in real time. But that model doesn’t scale. To run automations
                  safely, you need human gates as first‑class primitives: durable checkpoints where you can approve, reject, or send
                  work back for edits. In Tactus, those show up as <code>Human.approve()</code>, <code>Human.review()</code>, and{" "}
                  <code>Human.input()</code> — and the procedure can pause and resume later without losing its place.
                </p>
              </div>

              <div className={styles.hitlVariantsStack}>
                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>Closely supervised (absence)</h3>
                  <p className={styles.hitlVariantBody}>
                    Chat-style supervision: every item requires human approval. But when the human steps away, the system stalls until they return.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
                      config={HITL_PRESETS.CLOSELY_SUPERVISED.config}
                      startAtMs={HITL_PRESETS.CLOSELY_SUPERVISED.recommendedStartAtMs}
                    />
                  </div>
                </div>

                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>Durable HITL (default)</h3>
                  <p className={styles.hitlVariantBody}>
                    The procedure keeps moving. Only the moments that matter stop for a human decision — approve, reject, or return
                    for edits.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.DURABLE_DEFAULT.scenario}
                      config={HITL_PRESETS.DURABLE_DEFAULT.config}
                      startAtMs={HITL_PRESETS.DURABLE_DEFAULT.recommendedStartAtMs}
                    />
                  </div>
                </div>

                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>Human steps back</h3>
                  <p className={styles.hitlVariantBody}>
                    When you're away, work queues instead of breaking. When you return, the run resumes where it left off.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.HUMAN_STEPS_BACK.scenario}
                      config={HITL_PRESETS.HUMAN_STEPS_BACK.config}
                      startAtMs={HITL_PRESETS.HUMAN_STEPS_BACK.recommendedStartAtMs}
                    />
                  </div>
                </div>

                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>Unsupervised</h3>
                  <p className={styles.hitlVariantBody}>
                    No humans required. The agent handles everything autonomously — but only if you trust it with a razor blade.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.UNSUPERVISED_MONKEY.scenario}
                      config={HITL_PRESETS.UNSUPERVISED_MONKEY.config}
                      startAtMs={HITL_PRESETS.UNSUPERVISED_MONKEY.recommendedStartAtMs}
                      cycleMonkey={HITL_PRESETS.UNSUPERVISED_MONKEY.cycleMonkey}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Breakout title="Tactus in a nutshell" size="section">
          <p>
            A high-level agent programming model, with default-on sandboxing and
            container isolation, capability and context control, human-in-the-loop
            gates, and durable checkpoints so long-running workflows can pause,
            resume, and be audited safely.
          </p>
        </Breakout>

        <FeatureHighlightsSection
          title="Built for real systems"
          subtitle="When you’re not there to supervise, the runtime has to be the guardrail: container isolation, networkless execution, and tools that can use secrets without putting them in the agent runtime."
          items={FEATURE_HIGHLIGHTS}
          ctaTo="/features/"
          ctaText="Learn more"
        />

        <SpotlightSection
          id="human-in-the-loop"
          eyebrow="Learn"
          title="Human in the loop, durably"
          lede="Agents shouldn’t be trusted with irreversible actions. Tactus makes human review a first-class, durable checkpoint—so a procedure can pause, you can send it back for edits, and it can resume hours later without keeping a process alive."
          to="/human-in-the-loop/"
          ctaText="Read: Human in the Loop"
          Diagram={HitlReturnsAllDiagram}
        />

		        <GuardrailsSpotlight id="guardrails" eyebrow="Learn" />

        <SpotlightSection
          id="toolbox"
          eyebrow="Learn"
          title="The AI Engineer’s Toolbox"
          lede="Tools are how agents touch reality. Tactus treats tools as explicit capabilities: schema-first, inspectable, and controllable — so you can build workflows you can deploy."
          to="/ai-engineers-toolbox/"
          ctaText="Read: Toolbox"
          Diagram={AnimatedAIEngineersToolboxDiagram}
        />

        {/* Code Examples Group */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>

            {/* HITL */}
            <div className={styles.example} style={{ marginBottom: 'var(--space-6)' }}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Human-in-the-loop, durably</h2>
                <p className={styles.sectionSubtitle}>
                  When a workflow needs a human, it can pause and resume without
                  losing its place.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Human in the loop"
                  filename="examples-deploy.tac"
                  hint="HITL + timeout"
                  code={DURABILITY_EXAMPLE}
                  language="tactus"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  blockWidth={1400}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
              <div className={styles.exampleCopy}>
                <p className={styles.exampleLead}>
                  In Tactus, <code>Human.approve()</code> is a first-class
                  primitive. Reaching it suspends the run and creates a durable
                  “waiting for human” checkpoint.
                </p>
              </div>
            </div>

            {/* Specs */}
            <div className={styles.example} style={{ marginBottom: 'var(--space-6)' }}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  Specifications + evaluations
                </h2>
                <p className={styles.sectionSubtitle}>
                  Write behavior as specs, then measure reliability across runs and
                  datasets.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Specifications"
                  filename="examples-safe-deploy.feature"
                  hint="BDD"
                  code={SPECIFICATIONS_EXAMPLE}
                  language="gherkin"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  blockWidth={1400}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
              <div className={styles.exampleCopy}>
                <p className={styles.exampleLead}>
                  Specs encode what must be true. They let you test workflows
                  directly and catch regressions as prompts, tools, and models
                  evolve.
                </p>
              </div>
            </div>

            {/* Validation */}
            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Validation is built in</h2>
                <p className={styles.sectionSubtitle}>
                  Procedures declare typed inputs and outputs, validated with
                  Pydantic.
                </p>
              </header>
              <div className={styles.codeBlockPlayerTall}>
                <AnimatedCodeBlock
                  label="Validation"
                  filename="examples-research.tac"
                  hint="Input + output schemas"
                  code={VALIDATION_EXAMPLE}
                  language="tactus"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  blockWidth={1400}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
              <div className={styles.exampleCopy}>
                <p className={styles.exampleLead}>
                  That schema isn’t decoration: it’s the contract the runtime uses
                  to validate inputs, structure outputs, and power tooling (like
                  auto-generated forms and safer integrations).
                </p>
              </div>
            </div>

          </div>
        </section>

        <Breakout title="Why do we need a new language?" size="section">
          <p>
            We already have Python. We already have frameworks for agent workflows (and even
            no-code tools). So what’s missing?
          </p>
          <p>
            <strong>Because “hope for the best” isn’t a strategy for production systems.</strong>
          </p>
          <ul>
            <li>If Python is “good enough”, what do we gain by introducing a new language?</li>
            <li>
              What’s missing from libraries like LangChain and LangGraph when you move from demos
              to production systems?
            </li>
            <li>
              Why do no-code agent tools tend to break down once you need safety, reliability, and
              testability?
            </li>
          </ul>
        </Breakout>

        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <div className={styles.whyLanguageAnswer}>
              <p className={styles.whyLanguageAnswerText}>
                Tool-using agent systems don’t behave like traditional programs. Control flow
                isn’t fully specified up front; it emerges from learned behavior, probabilistic
                inference, and interaction with tools and the world. That shift changes what it
                means to “write code”: you’re no longer encoding every branch, you’re describing
                intent and shaping decision-making.
              </p>
              <p className={styles.whyLanguageAnswerText}>
                A prompt alone can’t give you production-grade reliability. You need structure:
                explicit tool boundaries, human approvals when stakes are high, durable workflows
                that can pause and resume, and specifications you can test. A language makes that
                structure first-class—so you can build behavior-driven systems with the same
                seriousness we apply to conventional software.
              </p>
              <div className={styles.whyLanguageCta}>
                <Link className={styles.secondaryButton} to="/why-new-language/">
                  Read the full article
                </Link>
              </div>

              <div className={styles.videoCard}>
                <div className={styles.videoHeader}>
                  <span className={styles.videoTitle}>
                    Why a New Language? (7 min)
                  </span>
                </div>
                <video
                  className={styles.video}
                  controls
                  preload="metadata"
                  playsInline
                  src={getVideoSrc("why-new-language.mp4")}
                  poster={getVideoSrc("why-new-language-poster.jpg")}
                />
              </div>
            </div>
          </div>
        </section>

        <BookSeriesSection id="books" mutedBackground={true} />

        <BottomCta
          title="Ready to start building?"
          text="Follow a short walkthrough and build your first tool-using agent workflow."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 *
 */
export const Head = () => <Seo title="Tactus" />

export default IndexPage
