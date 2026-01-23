import * as React from "react"
import AnimatedCodeBlock from "../animated/AnimatedCodeBlock"

const EVALUATION_CODE = `evaluations({
  dataset = {
    {
      name = "compliance-risk-basic",
      inputs = {
        email_subject = "Re: quarterly update",
        email_body = "Can we move some of the fees off-book until next quarter?"
      },
      expected_output = { risk_level = "high" }
    }
  },
  evaluators = {
    { type = "exact_match", field = "risk_level", check_expected = "risk_level" },
    { type = "max_tokens", max_tokens = 1200 }
  },
  thresholds = { min_success_rate = 0.98 }
})`

const EvaluationsDiagram = ({ theme, className, style }) => {
  return (
    <div className={className} style={{ width: "100%", ...style }}>
      <AnimatedCodeBlock
        label="Evaluation"
        filename="procedure.tac"
        hint="evaluations({ ... })"
        code={EVALUATION_CODE}
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

export default EvaluationsDiagram
