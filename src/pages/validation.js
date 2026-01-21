import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import AnimatedCodeBlock from "../components/animated/AnimatedCodeBlock"
import * as styles from "./index.module.css"

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

const ValidationPage = () => {
  return (
    <Layout fullWidth={true}>
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <p className={styles.eyebrow}>Learn More</p>
              <h1 className={styles.title}>Validation</h1>
              <p className={styles.lede}>
                Tactus procedures declare typed inputs and outputs, validated with Pydantic.
                This isn't just decoration: it's a contract that guarantees type safety at the
                edges of your agentic workflows.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.example}>
              <header className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Schema-first design</h2>
                <p className={styles.sectionSubtitle}>
                  Validation happens at the runtime boundary. Inputs are checked before your code runs,
                  and outputs are verified before they are returned to the caller.
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
            </div>
            
            <div className={styles.narrativeSection}>
              <div className={styles.narrativeContent}>
                <h3>Why it matters</h3>
                <p>
                  When building agentic systems, the "interface" is often natural language. But 
                  applications need structured data. Tactus bridges this gap by enforcing
                  strict schemas at the procedure boundary.
                </p>
                <ul>
                  <li><strong>Type Safety:</strong> Catch errors early when inputs don't match expectations.</li>
                  <li><strong>Auto-generated UIs:</strong> Use the schema to generate forms for human-in-the-loop interfaces.</li>
                  <li><strong>API Contracts:</strong> Procedures automatically expose OpenAPI specifications.</li>
                  <li><strong>Structured Outputs:</strong> Guarantee that your agents return data your application can parse.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Validation" />

export default ValidationPage
