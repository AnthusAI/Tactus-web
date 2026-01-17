import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import ContainerSandboxDiagram from "../components/diagrams/ContainerSandboxDiagram"
import GuardrailsStackDiagram from "../components/diagrams/GuardrailsStackDiagram"
import StagedToolAccessDiagram from "../components/diagrams/StagedToolAccessDiagram"
import * as styles from "./procedure-sandboxing.module.css"

const ProcedureSandboxingPage = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Security</p>
              <h1 className={styles.title}>Guardrails for Agent Autonomy</h1>
              <p className={styles.lede}>
                You can’t have agent autonomy with powerful tools unless you also have strong guardrails. This article is a deep dive
                into the security features that let you run workflows in a{" "}
                <strong>semi-unattended</strong> way: humans in the loop when it matters, and enforceable boundaries in code the rest
                of the time.
              </p>
            </div>

            <nav className={styles.toc} aria-label="Table of contents">
              <h2 className={styles.tocTitle}>Contents</h2>
              <ol className={styles.tocList}>
                <li>
                  <a href="#brakes">Why autonomy needs brakes</a>
                </li>
                <li>
                  <a href="#threat-model">A practical threat model</a>
                </li>
                <li>
                  <a href="#guardrails-stack">Guardrails (defense in depth)</a>
                </li>
                <li>
                  <a href="#least-privilege">Least privilege and staged tool access</a>
                </li>
                <li>
                  <a href="#tool-boundaries">Tool boundaries: validation and policy</a>
                </li>
                <li>
                  <a href="#hitl">Human in the loop, durably</a>
                </li>
                <li>
                  <a href="#sandboxing">Sandboxing layers: Lua + containers</a>
                </li>
                <li>
                  <a href="#secretless">Secretless execution and the broker boundary</a>
                </li>
              </ol>
            </nav>

            <section id="brakes" style={{ marginTop: "var(--space-6)" }}>
              <div className={styles.magentaSection}>
                <h2 className={styles.magentaTitle}>You can’t drive fast without brakes</h2>
                <div className={styles.magentaBody}>
                  <p className={styles.magentaLead}>
                    Agents are compelling because they make decisions. Tools are compelling because they take real action. Put them
                    together, and you get autonomy — but you also get a new category of failure modes.
                  </p>
                  <p className={styles.magentaTagline}>
                    The more power you give a workflow, the more you need guardrails that are enforced in code — not “best effort”
                    prompts.
                  </p>
                  <ul className={styles.magentaList}>
                    <li>
                      <strong>Safety:</strong> prevent harmful side effects (files, code execution, irreversible actions)
                    </li>
                    <li>
                      <strong>InfoSec:</strong> keep secrets and sensitive data from being stolen (and prevent cross-run leakage)
                    </li>
                    <li>
                      <strong>Reliability:</strong> make behavior testable, reviewable, and repeatable across runs
                    </li>
                  </ul>
                </div>
              </div>
              <p className={styles.bodyText}>
                Tactus’s “guardrails” story is built around a simple posture: treat agent workflows as{" "}
                <strong>untrusted execution with the ability to act</strong>. Then build boundaries that constrain what that untrusted
                part can do — while keeping the developer experience (streaming, tracing, iteration) intact.
              </p>
            </section>

            <section id="threat-model" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>A practical threat model</h2>
              <p className={styles.bodyText}>
                You don’t need a heavyweight security process to get real benefits. For agent workflows, a practical threat model fits
                on one page if you keep it concrete:
              </p>
              <div className={styles.subtleCard}>
                <p className={styles.bodyText} style={{ marginTop: 0 }}>
                  <strong>Assets:</strong> secrets (API keys), sensitive data, system integrity, and tenant/session isolation.
                </p>
                <p className={styles.bodyText} style={{ marginBottom: 0 }}>
                  <strong>Failure modes:</strong> prompt injection, tool misuse, over-broad capabilities, malicious tool code, and
                  cross-run leakage.
                </p>
              </div>
              <p className={styles.bodyText}>
                A key mental shift: <strong>all text is untrusted</strong>. User inputs, tool outputs, web pages, files, and even
                “helpful” content can contain instructions that try to override policy. If your only guardrail is a prompt, you’ve
                built a suggestion — not a control.
              </p>
            </section>

            <section id="guardrails-stack" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Guardrails (defense in depth)</h2>
              <p className={styles.bodyText}>
                No single technique solves everything. Tactus uses layers that each reduce risk in a different way — and together make
                it realistic to run workflows semi-unattended.
              </p>
              <div className={`${styles.diagramWrap} ${styles.diagramWrapTight}`}>
                <GuardrailsStackDiagram theme={theme} className={styles.diagram} />
              </div>
            </section>

            <section id="least-privilege" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Least privilege and staged tool access</h2>
              <p className={styles.bodyText}>
                The principle of least privilege isn’t just a slogan here — it’s a concrete workflow pattern. Don’t hand the agent a
                broad, always-on toolbelt. Instead, design your procedure in stages and expose only what’s needed for the current
                stage.
              </p>
              <div className={`${styles.diagramWrap} ${styles.diagramWrapTight}`}>
                <StagedToolAccessDiagram theme={theme} className={styles.diagram} />
              </div>
              <p className={styles.bodyText}>
                This is one of the simplest ways to avoid catastrophic mistakes. In a drafting stage, the agent can read and propose.
                In a review stage, you introduce a human checkpoint. Only in the final “commit” stage do you expose the tool that can
                send email, deploy, or touch production.
              </p>
            </section>

            <section id="tool-boundaries" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Tool boundaries: validation and policy</h2>
              <p className={styles.bodyText}>
                Tools are not just convenience; they are a security boundary. A “tool” is where probabilistic behavior meets
                deterministic code — which makes it the right place to enforce rules you can’t safely delegate to a model:
              </p>
              <div className={styles.subtleCard}>
                <p className={styles.bodyText} style={{ marginTop: 0 }}>
                  <strong>Validate inputs</strong> (schemas, types, required fields) and reject malformed requests.
                </p>
                <p className={styles.bodyText}>
                  <strong>Enforce policy</strong> (allowlists, domain restrictions, max sizes, content rules).
                </p>
                <p className={styles.bodyText} style={{ marginBottom: 0 }}>
                  <strong>Log and audit</strong> what was requested and what happened (who called what, when, with which args).
                </p>
              </div>
              <p className={styles.bodyText}>
                This is how you avoid “the prompt told it not to do that” as your primary control. A model can propose. Your tool
                boundary decides.
              </p>
            </section>

            <section id="hitl" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Human in the loop, durably</h2>
              <p className={styles.bodyText}>
                “Approvals” are not just UX — they are a security primitive. If an action is irreversible, high-impact, or externally
                visible, requiring an explicit human decision is often the right default.
              </p>
              <p className={styles.bodyText}>
                The hard part is making this practical. Tactus treats human-in-the-loop as a first-class primitive: reaching a human
                gate can create a durable “waiting for human” checkpoint. The procedure can pause and resume without keeping a process
                alive, without losing context, and without you building bespoke state machines.
              </p>
            </section>

            <section id="sandboxing" style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Sandboxing layers: Lua + containers</h2>
              <p className={styles.bodyText}>
                Once you let an agent write files or run code, you want a cage. Tactus uses two isolation boundaries that security
                professionals already recognize:
              </p>
              <div className={styles.subtleCard}>
                <p className={styles.bodyText} style={{ marginTop: 0 }}>
                  <strong>Language sandboxing (Lua):</strong> untrusted orchestration code runs in a restricted Lua VM with no ambient
                  OS, filesystem, or network access.
                </p>
                <p className={styles.bodyText} style={{ marginBottom: 0 }}>
                  <strong>OS-level sandboxing (containers):</strong> code execution can run in an ephemeral container with explicit
                  mounts and resource limits — reducing blast radius and cross-run leakage.
                </p>
              </div>
              <p className={styles.bodyText}>
                Containers dramatically improve safety — but they do not, by themselves, solve the secrets problem. If you inject
                credentials into a container, the agent can still leak them through tool misuse or prompt injection.
              </p>
            </section>

            <section id="secretless" style={{ marginTop: "var(--space-6)" }}>
              <div className={styles.magentaSection}>
                <h2 className={styles.magentaTitle}>Secretless execution changes the game</h2>
                <div className={styles.magentaBody}>
                  <p className={styles.magentaLead}>
                    Containers answer “what can it touch?” Secretless execution answers “what can it steal?” If the runtime has API
                    keys, then prompt injection can become credential theft.
                  </p>
                  <p className={styles.magentaTagline}>
                    When there’s nothing to steal, a whole class of attacks collapses.
                  </p>
                  <ul className={styles.magentaList}>
                    <li>Keep the runtime container secretless (don’t pass provider keys into it).</li>
                    <li>Keep it networkless by default to reduce data-leak paths.</li>
                    <li>Broker privileged operations behind a narrow, auditable interface.</li>
                  </ul>
                </div>
              </div>
              <div className={`${styles.diagramWrap} ${styles.diagramWrapTight}`}>
                <ContainerSandboxDiagram theme={theme} className={styles.diagram} />
              </div>
              <p className={styles.bodyText}>
                In this model, your procedure code runs in the Lua sandbox inside the container. It can request tool calls, but it
                never holds API keys. The broker (outside the sandbox) performs privileged work — model calls and credentialed tools —
                and streams results back so the agent gets answers, not credentials.
              </p>
              <p className={styles.bodyTextMuted}>
                This article is based on the security chapters in{" "}
                <a href="https://anthusai.github.io/Learning-Tactus/" target="_blank" rel="noreferrer">
                  Learning Tactus
                </a>
                , especially: threat modeling + guardrails, sandboxing layers, and secretless execution.
              </p>
            </section>

            <section style={{ marginTop: "var(--space-6)" }}>
              <h2 className={styles.sectionTitle}>Next</h2>
              <p className={styles.bodyText}>
                Video version: coming soon. The first cut will be a detailed walkthrough of the same guardrails story: threat model,
                least privilege stages, durable approvals, and the sandbox + broker architecture.
              </p>
              <div style={{ marginTop: "var(--space-4)" }}>
                <a className={styles.primaryButton} href="/getting-started/">
                  Get Started
                </a>
                <div className={styles.secondaryLinkRow}>
                  Or read <a href="/why-new-language/">Why a New Language?</a>
                </div>
              </div>
            </section>
          </div>
        </section>

        <BottomCta
          title="Ready to Start Building?"
          description="Get started with Tactus in minutes."
          buttonText="Get Started"
          buttonTo="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Guardrails for Agent Autonomy" />

export default ProcedureSandboxingPage
