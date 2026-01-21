import * as React from "react"
import AnimatedCodeBlock from "../animated/AnimatedCodeBlock"

const SPECIFICATIONS_CODE = `Specifications([[
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
        filename="examples-safe-deploy.feature"
        hint="BDD"
        code={SPECIFICATIONS_CODE}
        language="gherkin"
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