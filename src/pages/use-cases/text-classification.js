import * as React from "react"
import { Link } from "gatsby"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import BottomCta from "../../components/bottom-cta"
import * as styles from "./use-case.module.css"
import EmbeddedRuntimeDiagram from "../../components/diagrams/EmbeddedRuntimeDiagram"
import examplesData from "../../data/examples.json"

function findExampleById(exampleId) {
  for (const chapter of examplesData?.chapters || []) {
    for (const ex of chapter.examples || []) {
      if (ex.id === exampleId) return ex
    }
  }
  return null
}

function extractSnippet(code) {
  if (!code) return null
  const startToken = "-- SNIPPET START"
  const endToken = "-- SNIPPET END"

  const start = code.indexOf(startToken)
  const end = code.indexOf(endToken)
  if (start === -1 || end === -1 || end <= start) return null

  const afterStart = start + startToken.length
  return code.slice(afterStart, end).trim()
}

const TextClassificationUseCasePage = () => {
  const triageExample = findExampleById("support-inbox-triage")
  const compositeExample = findExampleById("composite-fuzzy-then-llm")

  const triageSnippet =
    extractSnippet(triageExample?.code) ||
    "// Example not found. Run: npm run examples:ingest"
  const compositeSnippet =
    extractSnippet(compositeExample?.code) ||
    "// Example not found. Run: npm run examples:ingest"

  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Use Case</p>
              <h1 className={styles.title}>Text Classification</h1>
              <p className={styles.lede}>
                A simple, high-signal workflow: take input text and classify it
                into a small set of labels, with guardrails that keep the output
                structured and measurable.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              Example: Support inbox triage
            </h2>
            <p className={styles.bodyText}>
              Imagine a small team triaging a support inbox. If a billing issue
              gets labeled as a bug, customers wait longer and engineers lose
              focus. A lightweight classifier gives you fast routing, but it
              only works if you keep the output constrained and measurable.
            </p>

            <div className={styles.diagramBlock}>
              <EmbeddedRuntimeDiagram />
            </div>

            <pre className={styles.codeBlock}>
              <code>{triageSnippet}</code>
            </pre>

            <p className={styles.bodyTextMuted}>
              Source:{" "}
              {triageExample?.githubUrl ? (
                <a
                  href={triageExample.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {triageExample.tacPath}
                </a>
              ) : (
                <code>02-classification/01-support-inbox-triage.tac</code>
              )}
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Why this works</p>
              <ul className={styles.checkList}>
                <li>The label set is explicit, so validation is trivial.</li>
                <li>
                  The prompt is domain-specific, not a generic classifier.
                </li>
                <li>
                  <code>temperature = 0</code> and <code>max_retries = 3</code>{" "}
                  keep output stable.
                </li>
                <li>
                  Behavior specs can lock down edge cases like "double charged"
                  being billing.
                </li>
                <li>
                  Evaluations let you measure accuracy and drift on real
                  tickets.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>
              What the standard library handles for you
            </h2>
            <p className={styles.bodyText}>
              The high-level <code>Classify</code> primitive is designed so you
              can focus on your task (triage, tagging, routing) instead of
              rewriting the same reliability plumbing every time. Under the
              hood, it enforces the contract “the answer must be one of these
              labels” and does the annoying parts: parsing, validation, and
              retries. You can use <code>method = "llm"</code> for semantic
              classification or <code>method = "fuzzy"</code> for fast string
              similarity matching.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>LLM classification guardrails</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>Strict label contract:</strong> it only accepts values
                  from your <code>classes</code> list.
                </li>
                <li>
                  <strong>Defensive parsing:</strong> it extracts the
                  classification from the first line, tolerates common
                  formatting (quotes, markdown, punctuation), and handles cases
                  like <code>"billing - because..."</code>.
                </li>
                <li>
                  <strong>Retry loop with feedback:</strong> if the model
                  responds with an invalid label, it retries up to{" "}
                  <code>max_retries</code> and tells the model exactly what went
                  wrong and what labels are allowed.
                </li>
                <li>
                  <strong>Structured results:</strong> you get{" "}
                  <code>value</code>, <code>confidence</code> (optional),{" "}
                  <code>explanation</code>, <code>retry_count</code>, and the{" "}
                  <code>raw_response</code> for debugging.
                </li>
              </ul>
            </div>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Fuzzy matching (no LLM calls)</p>
              <ul className={styles.checkList}>
                <li>
                  <strong>Fast and offline:</strong> string similarity matching
                  is nearly instant and needs no API keys.
                </li>
                <li>
                  <strong>Two modes:</strong> binary <code>expected</code>{" "}
                  matching (Yes/No) or multi-class “best match” from a{" "}
                  <code>classes</code> list.
                </li>
                <li>
                  <strong>Tunable behavior:</strong> adjust{" "}
                  <code>threshold</code> and choose an <code>algorithm</code>{" "}
                  like <code>token_set_ratio</code> to handle reordering and
                  extra words.
                </li>
              </ul>
            </div>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Knobs you can tune (no rewrites)</p>
              <ul className={styles.checkList}>
                <li>
                  <code>name</code>: a stable identifier for traces and BDD
                  mocking.
                </li>
                <li>
                  <code>classes</code>: the allowed output space (and your
                  evaluation labels).
                </li>
                <li>
                  <code>prompt</code>: your domain rules and edge-case guidance.
                </li>
                <li>
                  <code>max_retries</code>: how hard to push for a valid label
                  before failing.
                </li>
                <li>
                  <code>temperature</code>: determinism vs. flexibility (lower =
                  more stable).
                </li>
                <li>
                  <code>model</code>: pick a faster/cheaper model for routing,
                  or a stronger one for nuance.
                </li>
                <li>
                  <code>confidence_mode</code>: keep the default heuristic
                  confidence, or disable it for pure labels.
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              This behavior is centralized and covered by Tactus’s behavior
              specs, so you get the improvements without duplicating the logic
              in every procedure. Want the full API and implementation details?
              Start with the{" "}
              <Link to="/stdlib/classify/">Classification module</Link> docs,
              then check the{" "}
              <a
                href="https://github.com/AnthusAI/Tactus/blob/main/tactus/stdlib/classify/primitive.py"
                target="_blank"
                rel="noreferrer"
              >
                Classify primitive
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/AnthusAI/Tactus/blob/main/tactus/stdlib/classify/llm.py"
                target="_blank"
                rel="noreferrer"
              >
                LLM classifier
              </a>{" "}
              source.
            </p>
          </div>
        </section>

        <section className={`${styles.section} ${styles.bgMuted}`}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What You’re Building</h2>
            <p className={styles.bodyText}>
              Given a piece of text (an email, a ticket, a note), return a label
              like <code>spam</code>, <code>support</code>, or{" "}
              <code>billing</code> - and do it reliably.
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>Guardrails to use</p>
              <ul className={styles.checkList}>
                <li>
                  <Link to="/validation/">Validation</Link>: output must always
                  contain a valid label
                </li>
                <li>
                  <Link to="/specifications/">Behavior specs</Link>: hard rules
                  (no forbidden tools, required fields exist)
                </li>
                <li>
                  <Link to="/evaluations/">Evaluations</Link>: measure accuracy
                  and stability across a dataset
                </li>
              </ul>
            </div>

            <p className={styles.bodyText}>
              You can also mix strategies. For example, use fuzzy matching to
              cheaply catch “obvious” cases (typos, reordering, abbreviations),
              then fall back to the LLM for the messy long tail.
            </p>

            <pre className={styles.codeBlock}>
              <code>{compositeSnippet}</code>
            </pre>

            <p className={styles.bodyTextMuted}>
              Source:{" "}
              {compositeExample?.githubUrl ? (
                <a
                  href={compositeExample.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {compositeExample.tacPath}
                </a>
              ) : (
                <code>02-classification/02-composite-fuzzy-then-llm.tac</code>
              )}
            </p>

            <div className={styles.subtleCard}>
              <p className={styles.kicker}>More runnable examples</p>
              <ul className={styles.checkList}>
                <li>
                  Download and run these locally:{" "}
                  <Link to="/examples/">Examples</Link>
                </li>
                <li>
                  Source repo:{" "}
                  <a
                    href="https://github.com/AnthusAI/Tactus-examples"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/AnthusAI/Tactus-examples
                  </a>
                </li>
                <li>
                  Support inbox triage:{" "}
                  {triageExample?.githubUrl ? (
                    <a
                      href={triageExample.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {triageExample.tacPath}
                    </a>
                  ) : (
                    <code>02-classification/01-support-inbox-triage.tac</code>
                  )}
                </li>
                <li>
                  Compose fuzzy matching and LLM classification:{" "}
                  {compositeExample?.githubUrl ? (
                    <a
                      href={compositeExample.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {compositeExample.tacPath}
                    </a>
                  ) : (
                    <code>
                      02-classification/02-composite-fuzzy-then-llm.tac
                    </code>
                  )}
                </li>
              </ul>
            </div>

            <p className={styles.bodyTextMuted}>
              Next we can add a runnable spec suite and a small evaluation
              dataset to measure stability over time.
            </p>
          </div>
        </section>

        <BottomCta
          title="Browse more use cases"
          text="Pick another workflow pattern to learn."
          buttonLabel="Use Cases"
          to="/use-cases/"
        />
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Text Classification"
    description="Use case: text classification with validation, behavior specifications, and evaluations."
  />
)

export default TextClassificationUseCasePage
