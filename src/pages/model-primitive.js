import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import * as styles from "./index.module.css"

const MODEL_DECLARATION = `Model "imdb_nb" {
  type = "registry",
  name = "imdb_nb",
  version = "latest",

  input = { text = "string" },
  output = { label = "string", confidence = "float" },

  training = {
    data = {
      source = "hf",
      name = "imdb",
      train = "train",
      test = "test",
      text_field = "text",
      label_field = "label"
    },
    candidates = {
      {
        name = "nb-tfidf",
        trainer = "naive_bayes",
        hyperparameters = {
          alpha = 1.0,
          max_features = 50000,
          ngram_min = 1,
          ngram_max = 2
        }
      }
    }
  }
}`

const MODEL_USAGE = `Procedure {
  input = {
    text = field.string{required = true}
  },
  output = {
    decision = field.string{required = true},
    label = field.string{required = true},
    confidence = field.number{required = true}
  },
  function(input)
    local classifier = Model("imdb_nb")
    local result = classifier({text = input.text})
    local out = result.output or result

    if out.confidence < 0.75 then
      return {decision = "review", label = out.label, confidence = out.confidence}
    end

    if out.label == "positive" then
      return {decision = "ship", label = out.label, confidence = out.confidence}
    end

    return {decision = "reject", label = out.label, confidence = out.confidence}
  end
}`

const MODEL_TRAIN_EVAL = `# Install training extras (keeps core install lightweight)
pip install tactus[ml]

# Train and register artifacts
tactus train file.tac --model imdb_nb

# Evaluate a registered version (default tag: latest)
tactus models evaluate file.tac --model imdb_nb

# Evaluate a specific candidate (tag: candidate/<name>)
tactus models evaluate file.tac --model imdb_nb --candidate nb-tfidf
`

const MODEL_MOCKS = `Mocks {
  imdb_nb = {
    conditional = {
      {when = {text = "i love this movie"}, returns = {label = "positive", confidence = 0.92}},
      {when = {text = "this was terrible"}, returns = {label = "negative", confidence = 0.88}},
      {when = {text = "meh"}, returns = {label = "positive", confidence = 0.51}}
    }
  }
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
                  Models are declared with a runtime backend and a schema. When
                  a model is trainable, training config lives in the same block
                  under <code>training</code>.
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

            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Train + evaluate</h2>
                <p className={styles.sectionSubtitle}>
                  The CLI selects which model to train by name (handy when a
                  file declares multiple models). Training writes to the
                  registry. Evaluation runs against registered versions and
                  reports metrics.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="CLI"
                  filename="terminal"
                  hint="Training + evaluation"
                  code={MODEL_TRAIN_EVAL}
                  language="bash"
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
                <h2 className={styles.sectionTitle}>Test with mocks</h2>
                <p className={styles.sectionSubtitle}>
                  Specs should test your logic, not model quality. Use{" "}
                  <code>Mocks</code> for deterministic, CI-safe tests.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Mocks"
                  filename="mocks.tac"
                  hint="Deterministic tests"
                  code={MODEL_MOCKS}
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
                  If you want the full loop, combine Models with the registry
                  so you can train candidates, evaluate them on held-out data,
                  and promote a winner with confidence.
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
