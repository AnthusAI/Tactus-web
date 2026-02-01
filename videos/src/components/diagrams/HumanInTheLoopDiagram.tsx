import React from "react"
import { getRemotionEnvironment } from "remotion"
import { DiagramPositionWrapper } from "./DiagramPositionWrapper"

/* eslint-disable @typescript-eslint/no-require-imports */
// Shared diagram implementation lives in the Gatsby app so the website and videos
// use the same source. We intentionally load it via `require()` here to avoid
// TypeScript conflicts between the two package dependency graphs.
const impl = require("../../../../src/components/diagrams/HumanInTheLoopDiagram")

type HumanInTheLoopDiagramImpl = React.ComponentType<{
  theme?: "light" | "dark"
  time?: number
  scenario?: string
  config?: Record<string, unknown>
  disableCssTransitions?: boolean
  style?: React.CSSProperties
  className?: string
}>

const Impl = (impl.default ?? impl) as HumanInTheLoopDiagramImpl

const HumanInTheLoopDiagram: React.FC<
  React.ComponentProps<HumanInTheLoopDiagramImpl> & {
    timeSec?: number;
    scene?: any;
    x?: number;
    y?: number;
    scale?: number;
    containerWidth?: number;
    containerHeight?: number;
  }
> = props => {
  const { isRendering } = getRemotionEnvironment()
  const { x, y, scale, containerWidth, containerHeight, style, ...rest } = props

  // Convert Babulus timeSec to scene-relative time in milliseconds
  // timeSec is absolute from video start, need to subtract scene startSec
  const sceneStartSec = props.scene?.startSec ?? 0
  const sceneRelativeSec = (props.timeSec ?? 0) - sceneStartSec
  const time = props.timeSec !== undefined ? sceneRelativeSec * 1000 : props.time

  return (
    <DiagramPositionWrapper x={x} y={y} scale={scale} containerWidth={containerWidth} containerHeight={containerHeight}>
      <Impl
        {...rest}
        time={time}
        disableCssTransitions={rest.disableCssTransitions ?? isRendering}
        style={style}
      />
    </DiagramPositionWrapper>
  )
}

export default HumanInTheLoopDiagram
