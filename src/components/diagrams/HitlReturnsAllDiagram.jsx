import * as React from "react"
import AnimatedHumanInTheLoopDiagram from "./AnimatedHumanInTheLoopDiagram"
import { HITL_PRESETS } from "./hitlPresets"

const HitlReturnsAllDiagram = ({ theme, className, style }) => {
  return (
    <AnimatedHumanInTheLoopDiagram
      theme={theme}
      scenario={HITL_PRESETS.RETURNS_ALL.scenario}
      config={HITL_PRESETS.RETURNS_ALL.config}
      className={className}
      style={style}
    />
  )
}

export default HitlReturnsAllDiagram
