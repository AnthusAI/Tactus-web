import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./index.module.css"

const HELLO_WORLD_EXAMPLE = `World = Agent {
    provider = "openai",
    model = "gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World({message = "Hello, World!"}).response`

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

const BOOKS = [
  {
    title: "Learning Tactus",
    description:
      "A coherent introduction: the why, the mental model, and the core patterns.",
    href: "https://anthusai.github.io/Learning-Tactus/",
    pdf: "https://anthusai.github.io/Learning-Tactus/pdf/Learning-Tactus.pdf",
    repo: "https://github.com/AnthusAI/Learning-Tactus",
    image: (
      <StaticImage
        src="../images/books/learning-tactus.png"
        alt="Learning Tactus book cover"
        formats={["auto", "webp", "avif"]}
        placeholder="blurred"
        className={styles.bookCover}
      />
    ),
  },
  {
    title: "Programming Tactus",
    description: "The reference: a deeper and broader tour of the language.",
    href: "https://anthusai.github.io/Programming-Tactus/",
    pdf: "https://anthusai.github.io/Programming-Tactus/pdf/Programming-Tactus.pdf",
    repo: "https://github.com/AnthusAI/Programming-Tactus",
    image: (
      <StaticImage
        src="../images/books/programming-tactus.png"
        alt="Programming Tactus book cover"
        formats={["auto", "webp", "avif"]}
        placeholder="blurred"
        className={styles.bookCover}
      />
    ),
  },
  {
    title: "Tactus in a Nutshell",
    description: "A quick reference for when you’re writing and debugging.",
    href: "https://anthusai.github.io/Tactus-in-a-Nutshell/",
    pdf: "https://anthusai.github.io/Tactus-in-a-Nutshell/pdf/Tactus-in-a-Nutshell.pdf",
    repo: "https://github.com/AnthusAI/Tactus-in-a-Nutshell",
    image: (
      <StaticImage
        src="../images/books/tactus-in-a-nutshell.png"
        alt="Tactus in a Nutshell book cover"
        formats={["auto", "webp", "avif"]}
        placeholder="blurred"
        className={styles.bookCover}
      />
    ),
  },
]

const IndexPage = () => {
  return (
    <Layout>
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <p className={styles.eyebrow}>
              A language + runtime for tool-using agents
            </p>
            <h1 className={styles.title}>
              <span className={styles.titleBlock}>Tactus</span>
            </h1>
            <p className={styles.subtitle}>
              <b>Give AI agents powerful tools.</b> Safely and securely.
            </p>

            <p className={styles.lede}>
              Tool-using agents are useful—and dangerous: run them unattended
              and you’re giving a monkey a razor blade and hoping for the best.
            </p>
            <p className={styles.lede}>
              Tactus gives you a high-level language for building tool-using
              agents, with capability and context control, durable workflows,
              and default-on sandboxing and container isolation so they can run
              unattended without touching your host—or your API keys.
            </p>

            <div className={styles.ctaRow}>
              <a className={styles.primaryButton} href={BOOKS[0].href}>
                Read Learning Tactus
              </a>
              <a
                className={styles.secondaryButton}
                href="https://github.com/AnthusAI/Tactus"
              >
                View on GitHub
              </a>
            </div>
          </div>

          <aside className={styles.heroAside}>
            <div className={styles.animalCard}>
              <StaticImage
                src="../images/animals/learning-cover-animal.png"
                alt="An animal illustration in the style of a classic programming book cover"
                loading="eager"
                width={420}
                quality={90}
                formats={["auto", "webp", "avif"]}
              />
              <p className={styles.animalCaption}>
                Tools are sharp. Guardrails are not optional.
              </p>
            </div>
          </aside>
        </section>

        <section className={styles.example}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Hello, world</h2>
            <p className={styles.sectionSubtitle}>
              Define an agent, then call it like a function.
            </p>
          </header>
          <div className={styles.codeCard}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFile}>Hello, world</span>
              <span className={styles.codeHint}>Agent</span>
            </div>
            <pre className={styles.codePre}>
              <code>{HELLO_WORLD_EXAMPLE}</code>
            </pre>
          </div>

          <div className={styles.exampleCopy}>
            <p className={styles.exampleLead}>
              In Cursor or Claude, tool-using agents feel safe because you’re
              there to supervise: you see every tool call, you steer, and you
              can stop the run the moment it goes sideways.
            </p>
            <p className={styles.exampleLead}>
              The danger starts when you move that same pattern into the
              background—running unattended, at volume, with real side effects.
              That’s where you need guardrails that don’t depend on a human
              watching the screen.
            </p>

            <div className={styles.compareGrid}>
              <div className={styles.compareCard}>
                <h3 className={styles.compareTitle}>Supervised (chat)</h3>
                <ul className={styles.compareList}>
                  <li>You watch every step and tool call.</li>
                  <li>You can correct course mid-run.</li>
                  <li>You can halt before damage is done.</li>
                </ul>
              </div>
              <div className={styles.compareCard}>
                <h3 className={styles.compareTitle}>Unattended (production)</h3>
                <ul className={styles.compareList}>
                  <li>Runs without you—and runs many times.</li>
                  <li>Small failure rates become incidents.</li>
                  <li>Needs enforcement, not hope.</li>
                </ul>
              </div>
            </div>

            <div className={styles.tactusAdds}>
              <h3 className={styles.tactusAddsTitle}>What Tactus adds</h3>
              <p className={styles.tactusAddsBody}>
                A high-level agent programming model, with default-on sandboxing
                and container isolation, capability and context control,
                human-in-the-loop gates, and durable checkpoints so long-running
                workflows can pause, resume, and be audited safely.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Built for real systems</h2>
            <p className={styles.sectionSubtitle}>
              When you’re not there to supervise, the runtime has to be the
              guardrail: container isolation, networkless execution, and tools
              that can use secrets without putting them in the agent runtime.
            </p>
          </header>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <h3>Docker sandbox by default</h3>
              <p>
                Procedures run in a Docker container (when available), with
                configurable CPU/memory/timeouts and an ephemeral workspace.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Networkless by default</h3>
              <p>
                Keep the runtime container on <code>network: none</code>, while
                still calling models and tools through a host transport (e.g.{" "}
                <code>stdio</code>).
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>API keys stay outside the sandbox</h3>
              <p>
                API keys never live in the runtime container—and never get
                passed into model prompts.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Host-run tools</h3>
              <p>
                Tools that need secrets or privileged access can run outside the
                sandbox, streaming back results so the agent gets answers, not
                credentials.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Least privilege controls</h3>
              <p>
                Give the right tools and context at the right time: default-deny
                capabilities, per-step tool access, and approval gates.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3>Durable + testable</h3>
              <p>
                Checkpoint long workflows, add HITL where needed, and measure
                reliability with specs + evaluations.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.example}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Human-in-the-loop, durably</h2>
            <p className={styles.sectionSubtitle}>
              When a workflow needs a human, it can pause and resume without
              losing its place.
            </p>
          </header>
          <div className={styles.codeCard}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFile}>Approval gate</span>
              <span className={styles.codeHint}>HITL + timeout</span>
            </div>
            <pre className={styles.codePre}>
              <code>{DURABILITY_EXAMPLE}</code>
            </pre>
          </div>

          <div className={styles.exampleCopy}>
            <p className={styles.exampleLead}>
              In Tactus, <code>Human.approve()</code> is a first-class
              primitive. Reaching it suspends the run and creates a durable
              “waiting for human” checkpoint.
            </p>
            <p className={styles.exampleLead}>
              You can wait indefinitely, or set a timeout + default. When the
              human responds (or the timeout triggers), the procedure resumes
              exactly where it left off—no state machines and no “keep a process
              alive” hacks.
            </p>
          </div>
        </section>

        <section className={styles.example}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Specifications + evaluations
            </h2>
            <p className={styles.sectionSubtitle}>
              Write behavior as specs, then measure reliability across runs and
              datasets.
            </p>
          </header>
          <div className={styles.codeCard}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFile}>Behavior spec</span>
              <span className={styles.codeHint}>BDD</span>
            </div>
            <pre className={styles.codePre}>
              <code>{SPECIFICATIONS_EXAMPLE}</code>
            </pre>
          </div>

          <div className={styles.exampleCopy}>
            <p className={styles.exampleLead}>
              Specs encode what must be true. Evaluations answer the harder
              question: how often is it true when inputs vary and model behavior
              isn’t deterministic?
            </p>
            <p className={styles.exampleLead}>
              Run specs as tests, and run evaluations to track success rates and
              regressions over time (e.g. <code>tactus test</code> and{" "}
              <code>tactus evaluate --runs 50</code>).
            </p>
          </div>
        </section>

        <section className={styles.example}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Validation is built in</h2>
            <p className={styles.sectionSubtitle}>
              Procedures declare typed inputs and outputs, validated with
              Pydantic.
            </p>
          </header>
          <div className={styles.codeCard}>
            <div className={styles.codeHeader}>
              <span className={styles.codeFile}>Validated procedure</span>
              <span className={styles.codeHint}>Input + output schemas</span>
            </div>
            <pre className={styles.codePre}>
              <code>{VALIDATION_EXAMPLE}</code>
            </pre>
          </div>

          <div className={styles.exampleCopy}>
            <p className={styles.exampleLead}>
              That schema isn’t decoration: it’s the contract the runtime uses
              to validate inputs, structure outputs, and power tooling (like
              auto-generated forms and safer integrations).
            </p>
          </div>
        </section>

        <section className={styles.books}>
          <header className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Start here</h2>
            <p className={styles.sectionSubtitle}>
              Three complementary books: learn the patterns, dive into the
              reference, or keep the cheat sheet on your desk.
            </p>
          </header>

          <div className={styles.bookGrid}>
            {BOOKS.map(book => (
              <article key={book.title} className={styles.bookCard}>
                <a
                  className={styles.bookLink}
                  href={book.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {book.image}
                </a>
                <h3 className={styles.bookTitle}>{book.title}</h3>
                <p className={styles.bookDescription}>{book.description}</p>
                <div className={styles.bookLinks}>
                  <a href={book.href} target="_blank" rel="noreferrer">
                    Read online
                  </a>
                  <a href={book.pdf} target="_blank" rel="noreferrer">
                    PDF
                  </a>
                  <a href={book.repo} target="_blank" rel="noreferrer">
                    Repo
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Tactus" />

export default IndexPage
