import React from "react"
import { DiagramPositionWrapper } from "./DiagramPositionWrapper"

// Shared diagram implementation lives in the Gatsby app so the website and videos
// use the same source. We intentionally load it via `require()` here to avoid
// TypeScript conflicts between the two package dependency graphs.
const impl = require("../../../../src/components/diagrams/GuardrailsStackDiagram")

type GuardrailsStackDiagramImpl = React.ComponentType<{
  theme?: "light" | "dark"
  progress?: number
  style?: React.CSSProperties
  className?: string
}>

const Impl = (impl.default ?? impl) as GuardrailsStackDiagramImpl

const GuardrailsStackDiagram: React.FC<
  React.ComponentProps<GuardrailsStackDiagramImpl> & { x?: number; y?: number; scale?: number; containerWidth?: number; containerHeight?: number }
> = ({ x, y, scale, containerWidth, containerHeight, ...rest }) => {
  return (
    <DiagramPositionWrapper x={x} y={y} scale={scale} containerWidth={containerWidth} containerHeight={containerHeight}>
      <Impl {...rest} />
    </DiagramPositionWrapper>
  )
}

export default GuardrailsStackDiagram
