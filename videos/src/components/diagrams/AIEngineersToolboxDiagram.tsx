import type * as React from "react";

const impl = require("../../../../src/components/diagrams/AIEngineersToolboxDiagram");

const AIEngineersToolboxDiagram = (impl.default ?? impl) as React.ComponentType<{
  theme?: "light" | "dark";
  progress?: number;
  style?: React.CSSProperties;
  className?: string;
}>;

export default AIEngineersToolboxDiagram;
