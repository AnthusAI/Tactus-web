import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const GettingStartedPage = () => (
  <Layout>
    <h1>Getting Started</h1>

    <p>
      Tactus programs are designed to run <b>inside a host (runtime)</b>. The
      host is responsible for rendering <b>human-in-the-loop</b> interactions
      like approvals, reviews, and structured inputs.
    </p>

    <p>
      You can start with the CLI host (terminal prompts), then move to a richer
      host (the Tactus IDE), and ultimately embed Tactus into your own
      application so your app renders the UI components directly.
    </p>

    <h2 id="installation">Installation</h2>

    <p>
      Install the Python package to get the <code>tactus</code> CLI:
    </p>

    <pre>
      <code>{`python -m pip install -U pip
python -m pip install tactus

tactus --help
tactus version`}</code>
    </pre>

    <h2 id="first-run">Your First Run</h2>

    <p>
      The quickest way to run known-good examples is to use the book repo{" "}
      <a href="https://github.com/AnthusAI/Learning-Tactus">Learning Tactus</a>:
    </p>

    <pre>
      <code>{`git clone https://github.com/AnthusAI/Learning-Tactus.git
cd Learning-Tactus

# Fast, deterministic, no API key required:
tactus test code/chapter-01/04-basics-simple-agent.tac --mock`}</code>
    </pre>

    <p>
      For the full walkthrough, start at{" "}
      <a href="https://anthusai.github.io/Learning-Tactus/">
        Learning Tactus (online)
      </a>
      .
    </p>

    <h2 id="hosts">Choosing a Host (Runtime)</h2>

    <h3>1) CLI host (terminal)</h3>
    <p>
      When your procedure calls <code>Human.approve</code>,{" "}
      <code>Human.input</code>, or <code>Human.review</code>, the CLI host will
      prompt in the terminal. This is the simplest way to run and test Tactus
      programs.
    </p>

    <h3>2) Tactus IDE (web UI reference implementation)</h3>
    <p>
      The IDE runs Tactus procedures and renders human-in-the-loop interactions
      as UI components (buttons, forms, review panels). It’s a reference
      implementation of what embedding can look like in a real product.
    </p>

    <p>
      Today, the IDE requires the Tactus repo checkout (because it includes a
      React frontend):
    </p>

    <pre>
      <code>{`git clone https://github.com/AnthusAI/Tactus.git
cd Tactus

# Python (recommended: venv)
python -m pip install -U pip
python -m pip install -e .

# Node 20+ for the IDE frontend
cd tactus-ide/frontend
npm install
npm run build

# Back in repo root
cd ../..
tactus ide`}</code>
    </pre>

    <p>
      If you’re developing the IDE itself (hot reload), use{" "}
      <code>make dev-ide</code> from the Tactus repo.
    </p>

    <h3>3) Embed Tactus in your app</h3>
    <p>
      Tactus is intended to be embedded. Your application becomes the host: your
      UI renders the structured interaction requests declared by the procedure,
      and execution resumes when the user responds.
    </p>

    <hr />
    <p>
      Next: skim <Link to="/">the overview</Link>, or jump into{" "}
      <a href="https://anthusai.github.io/Learning-Tactus/">Learning Tactus</a>.
    </p>
  </Layout>
)

export const Head = () => <Seo title="Getting Started" pathname="/getting-started/" />

export default GettingStartedPage

