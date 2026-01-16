import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./features.module.css"

const Icons = {
  Box: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  WifiOff: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
  ),
  Lock: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Save: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  ),
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.icon}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}

const FeaturesPage = () => {
  return (
    <Layout>
      <Seo title="Features" />
      <div className={styles.page}>
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <h1 className={styles.title}>Built for Real Systems</h1>
              <p className={styles.lede}>
                Tactus gives you the tools to build agents that are safe, reliable, and production-ready.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Box />
              </div>
              <h2 className={styles.featureTitle}>Docker Sandbox by Default</h2>
              <p className={styles.featureText}>
                Every agent runs in an isolated Docker container with resource limits. 
                No more worrying about runaway processes consuming your entire server. 
                Memory, CPU, and disk usage are all constrained.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- Automatic sandboxing
agent = Agent {
    provider = "openai",
    model = "gpt-4o",
    -- Runs in isolated container
    -- Resource limits enforced
}`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.WifiOff />
              </div>
              <h2 className={styles.featureTitle}>Network Control</h2>
              <p className={styles.featureText}>
                Network access is <strong>disabled by default</strong>. Agents can't phone home, 
                exfiltrate data, or download malicious payloads unless you explicitly grant permission. 
                When you do need network access, you control exactly which domains are allowed.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- Opt-in networking
agent = Agent {
    provider = "openai",
    model = "gpt-4o",
    network = {
        allowed_domains = {
            "api.example.com",
            "docs.example.com"
        }
    }
}`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Key />
              </div>
              <h2 className={styles.featureTitle}>Secretless Execution</h2>
              <p className={styles.featureText}>
                API keys and credentials never enter the sandbox. The Tactus runtime handles 
                authentication on the host, so even if an agent is compromised, your secrets stay safe. 
                Agents can use tools without ever seeing the keys.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- Keys stay on host
agent = Agent {
    provider = "openai",  -- Key never enters sandbox
    model = "gpt-4o"
}

-- Agent can call APIs
-- But never sees credentials`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Lock />
              </div>
              <h2 className={styles.featureTitle}>Least Privilege Access</h2>
              <p className={styles.featureText}>
                Agents only get the tools you explicitly provide. Want an agent that can read files 
                but not write them? Grant read-only access. Need an agent that can query a database 
                but not modify it? Give it a read-only connection. Fine-grained control at the tool level.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- Explicit tool grants
agent = Agent {
    provider = "openai",
    model = "gpt-4o",
    tools = {
        FileSystem.read,      -- Read only
        Database.query,       -- No writes
        -- No shell access
        -- No file writes
    }
}`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Save />
              </div>
              <h2 className={styles.featureTitle}>Durability</h2>
              <p className={styles.featureText}>
                Workflows can be suspended and resumed. If your server crashes, your agent workflow 
                picks up where it left off. Long-running processes that need human approval? 
                No problem. The state is persisted, and the workflow resumes when the human responds.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- Suspend for human input
local approved = Human.approve({
    message = "Deploy to production?",
    timeout = 3600,  -- 1 hour
    default = false
})

-- Workflow suspends here
-- Resumes when human responds
-- Survives server restarts

if approved then
    deploy()
end`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.CheckCircle />
              </div>
              <h2 className={styles.featureTitle}>Testing & Specifications</h2>
              <p className={styles.featureText}>
                Write executable specifications for your agent workflows using Gherkin syntax. 
                Test that your agents behave correctly before deploying to production. 
                Measure reliability. Catch regressions. Build confidence.
              </p>
              <div className={styles.codeBlock}>
                <code>{`Specifications([[
Feature: Safe deployments

  Scenario: Requires approval
    Given a deployment request
    When the workflow runs
    Then it should wait for approval
    And not deploy without confirmation
    
  Scenario: Handles timeouts
    Given a deployment request
    When approval times out
    Then it should not deploy
    And should log the timeout
]])`}</code>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.callout}>
              <h2 className={styles.calloutTitle}>Ready to build safe agents?</h2>
              <p className={styles.bodyText}>
                These features work together to give you the reliability of traditional code 
                with the flexibility of AI agents.
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
}

export default FeaturesPage
