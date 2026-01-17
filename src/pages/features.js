import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import BottomCta from "../components/bottom-cta"
import * as styles from "./features.module.css"
import { Cable } from "lucide-react"

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
  Cable: () => (
    <Cable className={styles.icon} />
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
                Tactus is a language + runtime for building tool-using agents that can run safely in production.
              </p>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.featuresSection}`}>
          <div className={styles.container}>
            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.CheckCircle />
              </div>
              <h2 className={styles.featureTitle}>Human-in-the-loop approvals</h2>
              <p className={styles.featureText}>
                Approvals are a first-class primitive. When a workflow reaches an approval, it can
                suspend and wait—without hacks like “keep a process alive.”
              </p>
              <div className={styles.codeBlock}>
                <code>{`local approved = Human.approve({
    message = "Deploy to production?",
    timeout = 3600,
    default = false
})

if approved then
    deploy()
end`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Save />
              </div>
              <h2 className={styles.featureTitle}>Transparent durability</h2>
              <p className={styles.featureText}>
                Long-running workflows are durable: they can pause, resume, and survive restarts.
                The key is transparency—the workflow’s durable “waiting” points are explicit in code
                and visible in behavior.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- A durable workflow can pause...
local approved = Human.approve({
    message = "Publish these findings?",
    timeout = 3600,
    default = false
})

-- ...and resume later, without losing state.`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Box />
              </div>
              <h2 className={styles.featureTitle}>Docker sandbox by default</h2>
              <p className={styles.featureText}>
                Procedures run in a Lua sandbox inside a Docker container: keep the
                monkey in the box, and keep sensitive information out of the box.
              </p>
              <div className={styles.codeBlock}>
                <code>{`agent = Agent {
    provider = "openai",
    model = "gpt-4o",
    -- Runs in an isolated container by default
}`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.WifiOff />
              </div>
              <h2 className={styles.featureTitle}>Networkless by default</h2>
              <p className={styles.featureText}>
                Keep the sandbox on <strong>network: none</strong>. This reduces the blast radius:
                the agent can’t download arbitrary code or exfiltrate data directly from inside the
                runtime environment.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- In production, keep the runtime container networkless.
-- Model calls and tool calls happen through controlled host transports.`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Cable />
              </div>
              <h2 className={styles.featureTitle}>Brokered tools (secrets stay out of prompts)</h2>
              <p className={styles.featureText}>
                Some tools need secrets or privileged access. Tactus supports a brokered model:
                sensitive tools run outside the sandbox, and the agent receives results—not credentials.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- The broker can call privileged tools...
-- ...while keeping secrets outside the agent runtime.
-- The agent gets outputs, not API keys.`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.Lock />
              </div>
              <h2 className={styles.featureTitle}>Capability control (least privilege)</h2>
              <p className={styles.featureText}>
                Agents only get the tools you explicitly provide. The default posture is deny-by-default:
                no ambient access to files, shell, or network—only what you grant.
              </p>
              <div className={styles.codeBlock}>
                <code>{`-- Tools are explicit; nothing is implicit.
agent = Agent {
    provider = "openai",
    model = "gpt-4o",
    tools = {
        create_contact,
        -- no other tools granted
    }
}`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.CheckCircle />
              </div>
              <h2 className={styles.featureTitle}>Specifications (executable behavior)</h2>
              <p className={styles.featureText}>
                Specifications define what must be true. They help you test workflows, catch regressions,
                and build confidence before you run unattended in production.
              </p>
              <div className={styles.codeBlock}>
                <code>{`Specifications([[
Feature: Safe deployments

  Scenario: Requires approval
    Given a deployment request
    When the workflow runs
    Then it should wait for approval
    And not deploy without confirmation
]])`}</code>
              </div>
            </div>

            <div className={styles.featureDetail}>
              <div className={styles.featureIcon}>
                <Icons.CheckCircle />
              </div>
              <h2 className={styles.featureTitle}>Validation built in</h2>
              <p className={styles.featureText}>
                Procedures declare typed inputs and outputs. The runtime validates inputs at the boundary,
                structures outputs, and makes failures explicit instead of silently drifting.
              </p>
              <div className={styles.codeBlock}>
                <code>{`Procedure {
    input = {topic = field.string{required = true}},
    output = {approved = field.boolean{required = true}},
    function(input)
        -- ...
    end,
}`}</code>
              </div>
            </div>
          </div>
        </section>

        <BottomCta
          title="Ready to start building?"
          text="Follow a short walkthrough and write your first durable procedure."
          buttonLabel="Get Started"
          to="/getting-started/"
        />
      </div>
    </Layout>
  )
}

export default FeaturesPage
