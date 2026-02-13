import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import * as styles from "./index.module.css"

const MODEL_DECLARATION = `Model "sentiment_model" {
  type = "hf_transformers",
  model = "distilbert-base-uncased",

  input = { text = "string" },
  output = { label = "string", confidence = "float" }
}`

const MODEL_USAGE = `Procedure {
  input = {
    text = field.string{required = true}
  },
  output = {
    label = field.string{required = true},
    confidence = field.number{required = true}
  },
  function(input)
    local result = sentiment_model({text = input.text})
    return result.output
  end
}`

const ModelPrimitivePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={`${styles.page} ${styles.wideProse}`}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={`${styles.eyebrow} ${styles.eyebrowPrimary}`}>
                Model Primitive
              </p>
              <h1 className={styles.title}>Stateless predictions, built in</h1>
              <p className={styles.lede}>
                The Model primitive is for one thing: predictable inference.
                A Model takes a structured input, returns a structured output,
                and stays out of your control flow. No conversation state. No
                tool loops. Just a clean predict() contract that can be trained,
                versioned, and evaluated over time.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.narrativeSection}>
              <div className={styles.narrativeContent}>
                <h3>What a Model is (and isn't)</h3>
                <ul>
                  <li>
                    <strong>Stateless:</strong> each prediction is independent.
                  </li>
                  <li>
                    <strong>Schema-first:</strong> inputs and outputs are
                    validated like any other contract.
                  </li>
                  <li>
                    <strong>Versioned:</strong> you can register models and
                    choose which version to run.
                  </li>
                  <li>
                    <strong>Composable:</strong> combine models with ensembles,
                    A/B routing, or fallbacks.
                  </li>
                </ul>
                <p>
                  If you need multi-turn reasoning, tool calls, or adaptive
                  dialogue, that is an <Link to="/agent-primitive/">Agent</Link>.
                  Models are for repeatable predictions with crisp contracts.
                </p>
              </div>
            </div>

            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Declare the model</h2>
                <p className={styles.sectionSubtitle}>
                  Models are declared with their backend, then bound to typed
                  inputs and outputs.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Model"
                  filename="model.tac"
                  hint="Model declaration"
                  code={MODEL_DECLARATION}
                  language="tactus"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
            </div>

            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Use it like a function</h2>
                <p className={styles.sectionSubtitle}>
                  A Model call returns a typed result and optional metadata.
                  That keeps your procedure predictable and easy to test.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Usage"
                  filename="procedure.tac"
                  hint="Inference"
                  code={MODEL_USAGE}
                  language="tactus"
                  showTypewriter={false}
                  typewriterLoop={false}
                  autoHeight={true}
                  width="100%"
                  autoPlay={false}
                  controls={false}
                  loop={false}
                />
              </div>
            </div>

            <div className={styles.narrativeSection}>
              <div className={styles.narrativeContent}>
                <h3>Where Models shine</h3>
                <ul>
                  <li>Classification, extraction, embeddings, and scoring.</li>
                  <li>Stable outputs that power downstream logic.</li>
                  <li>Training + evaluation flows you can automate.</li>
                </ul>
                <p>
                  If you want the full MLOps loop, combine Models with training
                  configs and the registry so you can evaluate candidates and
                  promote the winner with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const Head = () => (
  <Seo
    title="Model Primitive"
    description="The Model primitive is Tactus's stateless prediction interface for training, inference, and evaluation."
  />
)

export default ModelPrimitivePage
