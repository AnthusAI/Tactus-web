import type * as React from "react";

/* eslint-disable @typescript-eslint/no-require-imports */
// Shared diagram implementation lives in the Gatsby app so the website and videos
// use the same source. We intentionally load it via `require()` here to avoid
// TypeScript conflicts between the two package dependency graphs.
const impl = require("../../../../src/components/diagrams/HumanInTheLoopDiagram");

const HumanInTheLoopDiagram = (impl.default ?? impl) as React.ComponentType<{
  theme?: "light" | "dark";
  time?: number;
  scenario?: string;
  config?: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
}>;

export default HumanInTheLoopDiagram;
