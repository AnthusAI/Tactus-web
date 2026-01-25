import type * as React from "react"

// Shared diagram implementation lives in the Gatsby app so the website and videos
// use the same source. We intentionally load it via `require()` here to avoid
// TypeScript conflicts between the two package dependency graphs.
const impl = require("../../../../src/components/diagrams/PromptEngineeringCeilingDiagram")

const PromptEngineeringCeilingDiagram = (impl.default ??
  impl) as React.ComponentType<{
  theme?: "light" | "dark"
  style?: React.CSSProperties
  className?: string
  progress?: number
}>

export default PromptEngineeringCeilingDiagram
