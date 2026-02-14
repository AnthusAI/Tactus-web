import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import * as styles from "./index.module.css"

const AGENT_DECLARATION = `local done = require("tactus.tools.done")

lookup_customer = Tool {
  description = "Look up a customer record",
  input = { id = field.string{required = true} },
  function(args)
    -- In a real system, this would call your database or API.
    return {id = args.id, plan = "pro"}
  end
}

triage_agent = Agent {
  provider = "openai",
  model = "gpt-4o-mini",
  system_prompt = [[
You triage support messages into labels: billing, account, bug, other.
Use lookup_customer when you need account context. Call done when finished.
  ]],
  tools = {lookup_customer, done}
}`

const AGENT_USAGE = `Procedure {
  input = {
    message = field.string{required = true}
  },
  output = {
    label = field.string{required = true}
  },
  function(input)
    local result = triage_agent({message = input.message})
    return {label = result.output.label}
  end
}`

const AgentPrimitivePage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={`${styles.page} ${styles.wideProse}`}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={`${styles.eyebrow} ${styles.eyebrowPrimary}`}>
                Agent Primitive
              </p>
              <h1 className={styles.title}>Stateful reasoning, safely</h1>
              <p className={styles.lede}>
                The Agent primitive is a conversational, tool-using runtime.
                Agents can plan, call tools, and carry state across turns.
                Tactus wraps that flexibility in guardrails so you can ship
                real automation without losing control.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.narrativeSection}>
              <div className={styles.narrativeContent}>
                <h3>What an Agent is built for</h3>
                <ul>
                  <li>
                    <strong>Multi-turn reasoning:</strong> iterate until the
                    task is done.
                  </li>
                  <li>
                    <strong>Tool use:</strong> call APIs, query data, and stage
                    side effects.
                  </li>
                  <li>
                    <strong>Guardrails:</strong> specs, evaluations, and
                    human-in-the-loop checkpoints.
                  </li>
                </ul>
                <p>
                  If you just need repeatable predictions, use a Model. If you
                  need a system that can think, adapt, and act, you want an
                  Agent.
                </p>
              </div>
            </div>

            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Declare the agent</h2>
                <p className={styles.sectionSubtitle}>
                  Agents define a model, a system prompt, and the tools they can
                  call.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Agent"
                  filename="agent.tac"
                  hint="Agent declaration"
                  code={AGENT_DECLARATION}
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
                <h2 className={styles.sectionTitle}>Run the agent inside a procedure</h2>
                <p className={styles.sectionSubtitle}>
                  Agents live inside procedures so you can validate inputs,
                  outputs, and behavior.
                </p>
              </header>
              <div className={styles.codeBlockPlayer}>
                <AnimatedCodeBlock
                  label="Usage"
                  filename="procedure.tac"
                  hint="Agent in a procedure"
                  code={AGENT_USAGE}
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
                <h3>Guardrails matter more with Agents</h3>
                <p>
                  Agents can take actions. That power demands controls:
                  validations, behavior specifications, evaluations, and
                  approvals. Tactus bakes those in so autonomy does not mean
                  chaos.
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
    title="Agent Primitive"
    description="The Agent primitive is Tactus's stateful, tool-using runtime for multi-turn reasoning and autonomy."
  />
)

export default AgentPrimitivePage
