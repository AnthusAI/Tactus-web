import type * as React from "react";

// Shared diagram implementation
const impl = require("../../../../src/components/diagrams/IsolatedToolsDiagram");

const IsolatedToolsDiagram = (impl.default ?? impl) as React.ComponentType<{
  theme?: "light" | "dark";
  style?: React.CSSProperties;
  className?: string;
}>;

export default IsolatedToolsDiagram;
