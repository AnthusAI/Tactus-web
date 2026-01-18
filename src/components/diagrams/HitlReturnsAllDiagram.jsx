import * as React from "react"
import AnimatedHumanInTheLoopDiagram from "./AnimatedHumanInTheLoopDiagram"

const RETURNS_ALL_CONFIG = {
  autoProcessRate: 0.1,
  returnToAgentRate: 1.0,
  itemCount: 6,
  queueTime: 1000,
}

const HitlReturnsAllDiagram = ({ theme, className, style }) => {
  return (
    <AnimatedHumanInTheLoopDiagram
      theme={theme}
      scenario="custom"
      config={RETURNS_ALL_CONFIG}
      className={className}
      style={style}
    />
  )
}

export default HitlReturnsAllDiagram
