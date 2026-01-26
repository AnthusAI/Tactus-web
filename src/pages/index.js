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
import ContainerSandboxDiagram from "../components/diagrams/ContainerSandboxDiagram"
import SpecificationsDiagram from "../components/diagrams/SpecificationsDiagram"
import EvaluationsDiagram from "../components/diagrams/EvaluationsDiagram"
import AnimatedHumanInTheLoopDiagram from "../components/diagrams/AnimatedHumanInTheLoopDiagram"
import { HITL_PRESETS } from "../components/diagrams/hitlPresets"
import AnimatedOldWayFlowchartDiagram from "../components/diagrams/AnimatedOldWayFlowchartDiagram"
import AnimatedNewWayFlowchartDiagram from "../components/diagrams/AnimatedNewWayFlowchartDiagram"
import SidecarChatDiagram from "../components/diagrams/SidecarChatDiagram"
import EmbeddedRuntimeDiagram from "../components/diagrams/EmbeddedRuntimeDiagram"
import DeepIntegrationDiagram from "../components/diagrams/DeepIntegrationDiagram"
import FeatureHighlightsSection from "../components/feature-highlights-section"
import BookSeriesSection from "../components/book-series-section"
import TechStackSection from "../components/tech-stack-section"
import Button from "../components/ui/button"
import Breakout from "../components/publishing/Breakout"
import getVideoSrc from "../lib/getVideoSrc"
import * as styles from "./index.module.css"

const Icons = {
  Box: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  WifiOff: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  ),
  Key: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="m21 2-9.6 9.6" />
      <path d="m15.5 7.5 3 3L22 7l-3-3" />
    </svg>
  ),
  Terminal: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  Cable: () => <Cable className={styles.icon} />,
  Lock: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Save: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Eye: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Alert: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.icon}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
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
        Procedures run in a Lua sandbox inside a Docker container: keep the
        monkey in the box, and keep sensitive information out of the box.
      </>
    ),
    icon: <Icons.Box />,
  },
  {
    title: "Networkless by default",
    body: (
      <>
        Keep the runtime container on <code>network: none</code>, while still
        calling models and tools through a host transport (e.g.{" "}
        <code>stdio</code>).
      </>
    ),
    icon: <Icons.WifiOff />,
  },
  {
    title: "API keys stay outside the sandbox",
    body: (
      <>
        API keys never live in the runtime container—and never get passed into
        model prompts.
      </>
    ),
    icon: <Icons.Key />,
  },
  {
    title: "Brokered tools",
    body: (
      <>
        Tools that need secrets or privileged access can run outside the sandbox
        via a broker, streaming back results so the agent gets answers, not
        credentials.
      </>
    ),
    icon: <Icons.Cable />,
  },
  {
    title: "Least privilege controls",
    body: (
      <>
        Minimal toolsets, curated context, network isolation, secretless broker,
        and temporal gating—agents get only what they need, when they need it.
      </>
    ),
    icon: <Icons.Lock />,
  },
  {
    title: "Durable + testable",
    body: (
      <>
        Checkpoint long workflows, add human checkpoints where needed, and
        measure
        reliability with specs + evaluations.
      </>
    ),
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
                and you’re giving a monkey a razor blade and hoping for the
                best.
              </p>
              <p className={styles.lede}>
                Tactus gives you a high-level language for building tool-using
                agents, with capability and context control, durable workflows,
                and default-on sandboxing and container isolation so they can
                run unattended without touching your host—or your API keys.
              </p>

              <div className={styles.ctaGrid}>
                <Button
                  to="/getting-started/"
                  variant="primary"
                  size="large"
                  shadow
                >
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
            </div>
          </div>
        </section>

        <Breakout theme="muted" size="section">
          <div className={styles.videoCard} style={{ marginTop: 0 }}>
            <div className={styles.videoHeader}>
              <span className={styles.videoTitle}>Intro to Tactus</span>
              <div className={styles.videoHeaderExtras}>
                <span className={styles.videoDuration}>5 minutes</span>
              </div>
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
        </Breakout>

        {/* Paradigm Shift - Main Header */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <p className={styles.eyebrow}>The paradigm shift</p>
              <h2 className={styles.sectionTitle}>
                A new kind of computer program
              </h2>
              <p className={styles.sectionSubtitle}>
                Since the dawn of computing, programming has meant anticipating
                every scenario and writing code for it. But tool-using agents
                flip the script.
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
                  <h3 className={styles.paradigmCardTitle}>
                    The old way: anticipate everything
                  </h3>
                  <p className={styles.sectionSubtitle}>
                    Traditional programs are brittle. Parse this format. Catch
                    that error. Map these fields to those fields. Miss one case
                    and the program breaks.
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
                  <h3 className={styles.paradigmCardTitle}>
                    The new way: agents with guardrails
                  </h3>
                  <p className={styles.sectionSubtitle}>
                    Instead of handling every edge case yourself, you give an
                    agent tools and a procedure, and let it work inside
                    guardrails.
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

        {/* Human-in-the-loop Variants */}
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hitlVariants}>
              <header className={styles.sectionHeader}>
                <p className={styles.eyebrow}>Human in the loop</p>
                <h2 className={styles.sectionTitle}>
                  Autonomy, asynchronously
                </h2>
              </header>

              <div className={styles.hitlVariantsIntro}>
                <p className={styles.exampleLead}>
                  In Cursor or Claude, tool-using agents feel safe because
                  you're there to supervise: you see every tool call, you steer,
                  and you can stop the run the moment it goes sideways.
                </p>
                <p className={styles.exampleLead}>
                  But how do we step back and give agents more agency to do
                  things on their own—with powerful tools that have full control
                  and can act on the systems and data we care about?
                </p>
                <p className={styles.exampleLead}>
                  The practical answer is <b>asynchronous human-in-the-loop</b>:
                  let the agent run, and only interrupt a human when it hits a
                  decision point (approval, missing input, high-risk side
                  effect).
                </p>

                <div className={styles.compareGrid}>
                  <div className={styles.compareCard}>
                    <h3 className={styles.compareTitle}>
                      <Icons.Eye />
                      <div className={styles.compareTitleText}>
                        Supervised{" "}
                        <span className={styles.compareSubtitle}>(chat)</span>
                      </div>
                    </h3>
                    <ul className={styles.compareList}>
                      <li>You watch every step and tool call.</li>
                      <li>You can correct course mid-run.</li>
                      <li>You can halt before damage is done.</li>
                    </ul>
                  </div>
                  <div className={styles.compareSeparator}>
                    <div className={styles.vsLine}></div>
                    <span className={styles.vsBadge}>vs</span>
                  </div>
                  <div className={styles.compareCard}>
                    <h3 className={styles.compareTitle}>
                      <Icons.Alert />
                      <div className={styles.compareTitleText}>
                        Unattended{" "}
                        <span className={styles.compareSubtitle}>
                          (production)
                        </span>
                      </div>
                    </h3>
                    <ul className={styles.compareList}>
                      <li>Runs without you—and runs many times.</li>
                      <li>Small failure rates become incidents.</li>
                      <li>Needs enforcement, not hope.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className={styles.hitlVariantsStack}>
                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>
                    Closely supervised
                  </h3>
                  <p className={styles.hitlVariantBody}>
                    The common user interface paradigm for AI agents is through
                    a chat interface. But human engagement becomes a bottleneck:
                    when the human steps away to eat or sleep, the interface
                    stops doing anything. If you need to process a volume of
                    items, everything is bottlenecked on your presence.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
                      config={{
                        ...HITL_PRESETS.CLOSELY_SUPERVISED.config,
                        stepBackAfterItems: 1,
                        outageDuration: 8000,
                      }}
                      startAtMs={
                        HITL_PRESETS.CLOSELY_SUPERVISED.recommendedStartAtMs
                      }
                    />
                  </div>
                </div>

                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>
                    Completely unattended
                  </h3>
                  <p className={styles.hitlVariantBody}>
                    You can remove the human entirely and let the agent run
                    free. This scales beautifully: you can process thousands of
                    items at machine speed without waiting for anyone. But
                    running an agent this way is like giving a monkey a razor
                    blade — if you don't trust it perfectly, you're asking for
                    trouble.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.UNSUPERVISED_MONKEY.scenario}
                      config={HITL_PRESETS.UNSUPERVISED_MONKEY.config}
                      startAtMs={
                        HITL_PRESETS.UNSUPERVISED_MONKEY.recommendedStartAtMs
                      }
                      cycleMonkey={HITL_PRESETS.UNSUPERVISED_MONKEY.cycleMonkey}
                    />
                  </div>
                </div>

                <div className={styles.hitlVariant}>
                  <h3 className={styles.hitlVariantTitle}>
                    Asynchronous human-in-the-loop
                  </h3>
                  <p className={styles.hitlVariantBody}>
                    A durable queue changes the paradigm: the agent operates
                    independently, then pauses and asks for human input{" "}
                    <i>only when needed</i>. Requests queue up while the human
                    is away, and the workflow resumes instantly when the
                    response arrives. You get speed and throughput close to
                    unattended execution—without requiring a human to supervise
                    every step.
                  </p>
                  <div className={styles.hitlVariantDiagram}>
                    <AnimatedHumanInTheLoopDiagram
                      scenario={HITL_PRESETS.HUMAN_STEPS_BACK.scenario}
                      config={HITL_PRESETS.HUMAN_STEPS_BACK.config}
                      startAtMs={
                        HITL_PRESETS.HUMAN_STEPS_BACK.recommendedStartAtMs
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Code Example: Human Checkpoint Durability */}
              <div style={{ margin: "var(--space-6) 0" }}>
                <div className={styles.sectionHeader}>
                  <h2
                    className={styles.sectionTitle}
                    style={{ fontSize: "1.5rem" }}
                  >
                    Durable pause and resume
                  </h2>
                  <p className={styles.sectionSubtitle}>
                    When a workflow needs a human, it can pause and resume
                    without losing its place.
                  </p>
                </div>
                <div className={styles.codeBlockPlayer}>
                  <AnimatedCodeBlock
                    label="Human in the loop"
                    filename="examples-deploy.tac"
                    hint="human checkpoint + timeout"
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
                <div style={{ marginTop: "var(--space-3)" }}>
                  <p className={styles.exampleLead}>
                    In Tactus, <code>Human.approve()</code> is a first-class
                    primitive. Reaching it suspends the run and creates a
                    durable “waiting for human” checkpoint.
                  </p>
                </div>
              </div>

              <div className={styles.hitlCta}>
                <p
                  className={styles.hitlVariantBody}
                  style={{ marginBottom: "var(--space-4)" }}
                >
                  This is what makes agents viable in real applications. Instead
                  of “human supervision” being the default mode, humans become
                  an <i>asynchronous checkpoint</i>: the runtime can queue
                  requests, suspend safely with zero CPU cost, and resume the
                  moment input arrives. Because it’s omni-channel, those
                  approvals and inputs can come from wherever your team already
                  works—email, Slack, or a custom UI.
                </p>
                <Button to="/human-in-the-loop/" variant="primary" shadow>
                  Read: Human in the Loop
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Architectures */}
        <section className={styles.section}>
          <div className={styles.container}>
            <header className={styles.sectionHeader}>
              <p className={styles.eyebrow}>Architectures</p>
              <h2 className={styles.sectionTitle}>
                Three example ways to use agents
              </h2>
              <p className={styles.sectionSubtitle}>
                These are three common patterns in real products: a copilot UI,
                embedded runtime workflows, and deeply integrated features with
                tool use and asynchronous human checkpoints.
              </p>
            </header>

            <div className={styles.architectureStack}>
              <div className={styles.architectureItem}>
                <div className={styles.architectureHeaderRow}>
                  <h3 className={styles.architectureTitle}>
                    Sidecar chat copilot
                  </h3>
                  <div className={styles.architectureLinkRow}>
                    <Button
                      to="/use-cases/copilot-anything/"
                      variant="secondary"
                      shadow
                    >
                      See: Copilot for Anything
                    </Button>
                  </div>
                </div>
                <p className={styles.architectureBody}>
                  Bolt a chat interface onto an existing product. Great for
                  “help me do X” workflows, with tool use and human checkpoints
                  when actions are high risk.
                </p>
                <div className={styles.architectureDiagram}>
                  <SidecarChatDiagram />
                </div>
              </div>

              <div className={styles.architectureItem}>
                <div className={styles.architectureHeaderRow}>
                  <h3 className={styles.architectureTitle}>
                    Embedded runtime for workflows
                  </h3>
                  <div className={styles.architectureLinkRow}>
                    <Button
                      to="/use-cases/text-classification/"
                      variant="secondary"
                      shadow
                    >
                      See: Text Classification
                    </Button>
                  </div>
                </div>
                <p className={styles.architectureBody}>
                  Run procedures inside your application to keep behavior
                  testable and outputs structured. Ideal for classification,
                  routing, extraction, and other repeatable workflows.
                </p>
                <div className={styles.architectureDiagram}>
                  <EmbeddedRuntimeDiagram />
                </div>
              </div>

              <div className={styles.architectureItem}>
                <div className={styles.architectureHeaderRow}>
                  <h3 className={styles.architectureTitle}>
                    Deeply integrated features
                  </h3>
                  <div className={styles.architectureLinkRow}>
                    <Button
                      to="/use-cases/contact-import/"
                      variant="secondary"
                      shadow
                    >
                      See: Contact Import
                    </Button>
                  </div>
                </div>
                <p className={styles.architectureBody}>
                  Add agent-powered product features behind UI buttons and forms.
                  The procedure can call tools to change real state, and pause
                  asynchronously for human review when required.
                </p>
                <div className={styles.architectureDiagram}>
                  <DeepIntegrationDiagram />
                </div>
              </div>
            </div>

            <div className={styles.architectureFooter}>
              <div className={styles.architectureCallout}>
                <p className={styles.architectureCalloutEyebrow}>Case study</p>
                <h3 className={styles.architectureCalloutTitle}>
                  Refund ops automation
                </h3>
                <p className={styles.architectureCalloutBody}>
                  A real finance workflow started as a supervised Skill that
                  processes an Excel file and issues Stripe refunds in sequence.
                  It was then hardened into a governed procedure: inputs
                  validated up front, tool data fetched deterministically, human
                  checkpoints added for high-risk rows, and an audit trail
                  produced for confidence and compliance.
                </p>
                <div className={styles.architectureCalloutButtons}>
                  <Button to="/use-cases/refund-ops/" variant="secondary" shadow>
                    Read the case study
                  </Button>
                  <Button to="/use-cases/" variant="primary" shadow>
                    Browse Use Cases
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Breakout title="Tactus in a nutshell" size="section">
          <p>
            A high-level agent programming model, with default-on sandboxing and
            container isolation, capability and context control,
            human-in-the-loop gates, and durable checkpoints so long-running
            workflows can pause, resume, and be audited safely.
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
          id="toolbox"
          eyebrow={null}
          title="The AI Engineer’s Toolbox"
          lede="Tools are how agents touch reality. Tactus treats them as first-class primitives—safe, inspectable, and effortless to deploy—so your agents can get real work done without the security headaches."
          to="/ai-engineers-toolbox/"
          ctaText="Read: Toolbox"
          Diagram={AnimatedAIEngineersToolboxDiagram}
        />

        <GuardrailsSpotlight id="guardrails" eyebrow={null} />

        <SpotlightSection
          id="sandboxing"
          eyebrow={null}
          title="Sandboxing & Isolation"
          lede="Agents run in a Lua sandbox inside a networkless container, constraining what they can touch and firewalling side effects. Privileged operations are brokered by a separate process that holds the secrets. It’s like letting a burglar into an empty building: even if the agent is compromised, there’s nothing valuable inside to steal—and nowhere to send it."
          to="/guardrails/#sandboxing"
          ctaText="Read: Sandboxing"
          Diagram={ContainerSandboxDiagram}
        />

        <Breakout
          title="Why do we need a new language?"
          size="section"
          className={styles.whyLanguageBreakout}
        >
          <p>
            We have Python. We have TypeScript. We have powerful agent
            frameworks. But they were built to manipulate deterministic logic,
            not probabilistic behavior.
          </p>
          <p>
            <strong>The abstraction level is wrong.</strong>
          </p>
          <ul>
            <li>
              Using general-purpose languages for agents feels like writing web
              apps in assembly.
            </li>
            <li>
              We need new primitives for a world where code doesn't strictly
              control execution.
            </li>
            <li>
              Tactus aligns the language with the actual problems of production
              AI.
            </li>
          </ul>
        </Breakout>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.whyLanguageAnswer}>
              <p className={styles.whyLanguageAnswerText}>
                Programming languages evolve to match the problems we care
                about. When computers were banks of vacuum tubes, zeros and ones
                were the right tool—they matched the physical reality. When we
                moved to complex logic, we built languages like C to manage the
                new concerns: loops, branches, and reusability.
              </p>
              <p className={styles.whyLanguageAnswerText}>
                Today, the "atoms" of computing have changed again. We are
                building with stochastic, decision-making models that we guide
                rather than control. Tactus raises the abstraction level to
                match this new reality, giving you first-class primitives for
                the things that matter now: reliability, sandboxing, and human
                oversight. It's not just a new syntax—it's a language built for
                the new problem space.
              </p>
              <div className={styles.whyLanguageCta}>
                <Button to="/why-new-language/" variant="primary" shadow>
                  Read: Why a New Language?
                </Button>
              </div>
            </div>
          </div>
        </section>

        <Breakout theme="muted" size="section">
          <div className={styles.videoCard} style={{ marginTop: 0 }}>
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
        </Breakout>

        <SpotlightSection
          id="specifications"
          eyebrow={null}
          title="Behavior Specifications"
          lede="Tactus treats behavior specs as part of the language itself: inline with procedures, executable by the runtime, and visible in every run. They define invariants, prevent regressions, and keep reliability measurable as models and tools evolve."
          to="/specifications/"
          ctaText="Read: Specifications"
          Diagram={SpecificationsDiagram}
          flip={true}
        />

        <SpotlightSection
          id="evaluations"
          eyebrow={null}
          title="Evaluations"
          lede="One successful run is luck. Reliability is a statistic. Evaluations let you measure accuracy, cost, and reliability performance across datasets so you can ship with confidence."
          to="/evaluations/"
          ctaText="Read: Evaluations"
          Diagram={EvaluationsDiagram}
        />

        {/* Code Examples Group */}
        <section className={`${styles.section}`}>
          <div className={styles.container}>
            {/* Validation */}
            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Link to="/validation/" className={styles.titleLink}>
                    Validation is built in
                  </Link>
                </h2>
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
                  That schema isn’t decoration: it’s the contract the runtime
                  uses to validate inputs, structure outputs, and power tooling
                  (like auto-generated forms and safer integrations).
                </p>
                <div style={{ marginTop: "var(--space-4)" }}>
                  <Button to="/validation/" variant="secondary" shadow>
                    Read: Validation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <BookSeriesSection id="books" mutedBackground={true} />

        <TechStackSection />

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
