import * as React from "react"

import AnimatedHumanInTheLoopDiagram from "../../src/components/diagrams/AnimatedHumanInTheLoopDiagram"
import { HITL_PRESETS } from "../../src/components/diagrams/hitlPresets"

const DIAGRAMS = {
  supervised: {
    scenario: HITL_PRESETS.CLOSELY_SUPERVISED.scenario,
    config: { ...HITL_PRESETS.CLOSELY_SUPERVISED.config, stepBackAfterItems: 1, outageDuration: 8000 },
    startAtMs: HITL_PRESETS.CLOSELY_SUPERVISED.recommendedStartAtMs,
  },
  unsupervised: {
    scenario: HITL_PRESETS.UNSUPERVISED_MONKEY.scenario,
    config: HITL_PRESETS.UNSUPERVISED_MONKEY.config,
    startAtMs: HITL_PRESETS.UNSUPERVISED_MONKEY.recommendedStartAtMs,
    cycleMonkey: HITL_PRESETS.UNSUPERVISED_MONKEY.cycleMonkey,
  },
  queued: {
    scenario: HITL_PRESETS.HUMAN_STEPS_BACK.scenario,
    config: HITL_PRESETS.HUMAN_STEPS_BACK.config,
    startAtMs: HITL_PRESETS.HUMAN_STEPS_BACK.recommendedStartAtMs,
  },
  backlog: { scenario: "backlog" },
}

export const HitlDiagram = ({ variant, withStart }) => {
  const { startAtMs, ...rest } = DIAGRAMS[variant]
  return (
    <div style={{ margin: "var(--space-4) 0" }}>
      <AnimatedHumanInTheLoopDiagram {...rest} {...(withStart ? { startAtMs } : {})} />
    </div>
  )
}
