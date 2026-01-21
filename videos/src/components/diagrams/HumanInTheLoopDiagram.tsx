import React from "react";
import { getRemotionEnvironment } from "remotion";

/* eslint-disable @typescript-eslint/no-require-imports */
// Shared diagram implementation lives in the Gatsby app so the website and videos
// use the same source. We intentionally load it via `require()` here to avoid
// TypeScript conflicts between the two package dependency graphs.
const impl = require("../../../../src/components/diagrams/HumanInTheLoopDiagram");

type HumanInTheLoopDiagramImpl = React.ComponentType<{
  theme?: "light" | "dark";
  time?: number;
  scenario?: string;
  config?: Record<string, unknown>;
  disableCssTransitions?: boolean;
  style?: React.CSSProperties;
  className?: string;
}>;

const Impl = (impl.default ?? impl) as HumanInTheLoopDiagramImpl;

const HumanInTheLoopDiagram: React.FC<React.ComponentProps<HumanInTheLoopDiagramImpl>> = (
  props
) => {
  const { isRendering } = getRemotionEnvironment();
  return (
    <Impl
      {...props}
      disableCssTransitions={props.disableCssTransitions ?? isRendering}
    />
  );
};

export default HumanInTheLoopDiagram;
