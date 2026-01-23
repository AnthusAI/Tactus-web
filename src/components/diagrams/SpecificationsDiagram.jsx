import * as React from "react"
import AnimatedCodeBlock from "../animated/AnimatedCodeBlock"

const SPECIFICATIONS_CODE = `Procedure {
  -- ... orchestration, tools, agent turns ...
}

Specifications([[
Feature: Deployments are safe

  Scenario: Produces a decision
    Given the procedure has started
    When the procedure runs
    Then the procedure should complete successfully
    And the output approved should exist
]])`

const SpecificationsDiagram = ({ theme, className, style }) => {
  return (
    <div className={className} style={{ width: "100%", ...style }}>
      <AnimatedCodeBlock
        label="Specifications"
        filename="safe-deploy.tac"
        hint="Given/When/Then"
        code={SPECIFICATIONS_CODE}
        language="tactus"
        showTypewriter={false}
        typewriterLoop={false}
        autoHeight={false}
        blockWidth={1400}
        width="100%"
        autoPlay={false}
        controls={false}
        loop={false}
        theme={theme}
      />
    </div>
  )
}

export default SpecificationsDiagram
