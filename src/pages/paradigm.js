import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./paradigm.module.css"

const OLD_WAY_CODE = `def import_contact(row):
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
    if row.get("name"):
        # Handle "Last, First" vs "First Last"
        if "," in row["name"]:
            last, first = row["name"].split(",")
        else:
            first, last = row["name"].split(" ")
    elif row.get("First Name"):
        # ...
    
    # Each new variation = new code.
    # The function grows. Edge cases multiply.
    return create_contact(first, last, email)`

const NEW_WAY_CODE = `
-- Define the capability (schema)
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

const ParadigmPage = () => (
  <Layout fullWidth={true}>
    <div className={styles.page}>
      
      {/* Hero Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.hero}>
            <p className={styles.eyebrow}>The Paradigm Shift</p>
            <h1 className={styles.title}>
              A New Kind of Computer Program
            </h1>
            <p className={styles.lede}>
              For the first time since the dawn of computer programming, we have a way 
              to write software that doesn't require anticipating every possible scenario.
            </p>
          </div>
        </div>
      </section>

      {/* The Old Way */}
      <section className={`${styles.section} ${styles.bgMuted}`}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>The Old Way: Think of Everything</h2>
              <p className={styles.bodyText}>
                Since the 1950s, programming has meant one thing: anticipate every scenario 
                and write code to handle it. Parse this format. Catch that error. Map these 
                fields to those fields.
              </p>
              <p className={styles.bodyText}>
                Consider a simple contact importer. Even if you restrict it to CSV, you 
                end up writing endless conditional logic to handle "First Name" vs "nombre", 
                or "Last, First" vs "First Last".
              </p>
              <p className={styles.bodyText}>
                If you miss a case, the program breaks.
              </p>
            </div>
            <div className={styles.col}>
              <div className={styles.codeCard}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeFile}>importer.py</span>
                  <span className={styles.codeHint}>Imperative</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{OLD_WAY_CODE}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The New Way */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.col}>
              <h2 className={styles.sectionTitle}>The New Way: Give an Agent a Tool</h2>
              <p className={styles.bodyText}>
                The agent-based approach inverts the problem. Instead of writing code to 
                handle every input variation, you <b>define a capability</b> and describe 
                what you want.
              </p>
              <p className={styles.bodyText}>
                You give the agent the \`create_contact\` tool. You give it the messy input. 
                The agent applies its judgment to map "correo" to "email" or split a name 
                string correctly.
              </p>
              <p className={styles.bodyText}>
                When new formats arrive—JSON, Spanish headers, or just weird formatting—the 
                program adapts without you rewriting the logic.
              </p>
            </div>
            <div className={styles.col}>
              <div className={styles.codeCard}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeFile}>importer.tac</span>
                  <span className={styles.codeHint}>Agentic</span>
                </div>
                <pre className={styles.codePre}>
                  <code>{NEW_WAY_CODE}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Tactus */}
      <section className={`${styles.section} ${styles.bgPrimary}`}>
        <div className={styles.container}>
          <div className={styles.hero} style={{maxWidth: '64rem'}}>
            <h2 className={styles.title} style={{color: 'white', fontSize: '2.5rem', marginBottom: 'var(--space-2)'}}>
              Why do you need a language for this?
            </h2>
            <p className={styles.lede} style={{color: 'rgba(255,255,255,0.9)'}}>
              If agents are so smart, why not just write a prompt?
            </p>
          </div>
        </div>
      </section>

      {/* The Answer */}
      <section className={styles.section} style={{paddingTop: 'var(--space-5)'}}>
        <div className={styles.container}>
          <div className={styles.hero} style={{maxWidth: '52rem', padding: 0}}>
            <p className={styles.lede} style={{marginBottom: 'var(--space-4)', color: 'var(--color-text)'}}>
              Because "hope for the best" isn't a strategy for production systems. 
            </p>
            <p className={styles.bodyText}>
              Tactus gives you the <b>reliability of code</b> with the <b>flexibility of agents</b>.
            </p>
            <p className={styles.bodyText}>
              It provides <b>durability</b> (so workflows survive crashes), 
              <b>sandboxing</b> (so agents can't trash your server), and 
              <b>structure</b> (so you can test and measure reliability).
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.callout}>
            <h2 className={styles.calloutTitle}>Ready to write your first agent?</h2>
            <p className={styles.bodyText}>
              You don't need to be an AI expert. Tactus is designed for developers who know 
              how to write code and want to orchestrate agents safely.
            </p>
            <div style={{marginTop: 'var(--space-4)'}}>
              <Link to="/getting-started/" className={styles.primaryButton}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  </Layout>
)

export const Head = () => <Seo title="The Paradigm" />

export default ParadigmPage
