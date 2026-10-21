---
title: Download Tactus
description: 'Beyond prompts + hope: Tactus is a language + runtime for safe, reproducible tool-using agents—give them tools and a procedure, with approvals, durability, and the principle of least privilege.'
type: page
---
::band{size="hero"}
# Download Tactus

The desktop environment for building, running, and debugging Tactus agents.

::band
::island{name="ReleaseLinks"}

:::callout{kind="warning" title="Warning: Alpha Version"}
The version number starts with 0., which means this is an alpha release. The feature set is not complete and is changing rapidly. I am moving fast and breaking things, making breaking changes literally every day.

If you're willing to sign up for an adventure, you have a chance to get early, high-level support and shape the future of the language, but I can't make any guarantees about stability, especially over the next couple of months.

Tactus is already a mission-critical technology in production for my own projects, but it is not publicly supported yet—use it at your own risk.
:::

**Note on Desktop Apps:** Please note that the Electron apps are less tested than running the web application through Node. They share a common codebase, but have platform differences. My development focus is primarily on the Node web application.

:::card-grid{columns=3 label="Desktop downloads"}
:::card{title="macOS" icon="svg-apple"}
{{availability-chip beta}}

Universal (Intel & Apple Silicon)

**Distribution Warning** The distributed macOS app does not yet distribute smoothly. (I have to pay Apple to sign it and I will...) You are better off building the Electron app yourself or using the Node web application.

[View on GitHub](https://github.com/AnthusAI/Tactus/releases/latest#mac)
:::

:::card{title="Windows" icon="svg-windows"}
{{availability-chip beta}}

Windows 10/11 (x64)

[View on GitHub](https://github.com/AnthusAI/Tactus/releases/latest#windows)
:::

:::card{title="Linux" icon="svg-linux"}
{{availability-chip beta}}

Debian/Ubuntu (AppImage)

[View on GitHub](https://github.com/AnthusAI/Tactus/releases/latest#linux)
:::
:::

::band{tone="muted"}
## Install Tactus for Nerds

You don’t need the Electron app. You can run agents via the CLI, run the web IDE locally, or edit .tac files in VS Code.

:::card-grid{columns=3 label="Install options"}
:::card{title="Option 1: Tactus CLI"}
Install the Python package to run agents from your terminal. This is the core runtime. Docker is required for the default sandboxed execution mode.

```bash
$ pip install tactus
$ git clone https://github.com/AnthusAI/Tactus-examples.git
$ cd Tactus-examples

# Run specs (fast, mock mode)
$ tactus test 01-getting-started/01-hello-world.tac --mock

# Run live
$ export OPENAI_API_KEY=your-key
$ tactus run 01-getting-started/01-hello-world.tac

# No Docker? Opt out explicitly (no isolation)
$ tactus run 01-getting-started/01-hello-world.tac --no-sandbox
```
:::

:::card{title="Option 2: Web IDE Source"}
Prefer the visual IDE but hate Electron? Run the Node.js web application directly from source.

```bash
$ git clone https://github.com/AnthusAI/Tactus.git
$ cd Tactus
$ npm install
$ npm start

# Open http://localhost:3000
```

**[View Repository →](https://github.com/AnthusAI/Tactus)**
:::

:::card{title="Option 3: VS Code Extension"}
Get syntax highlighting, real-time validation, and code intelligence for .tac files. Install the extension from the marketplace; optional LSP server for advanced features.

**[Install from VS Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=AnthusAISolutions.tactus)**
:::
:::

::band
## Next Steps

:::card-grid{columns=3 label="Next steps"}
:::card{title="Get Started"}
[Install dependencies and run your first agent.](/getting-started/)
:::

:::card{title="Examples Library"}
[Browse runnable code examples for common patterns.](/examples/)
:::

:::card{title="Use Cases"}
[See full walkthroughs of production workflows.](/use-cases/)
:::
:::
