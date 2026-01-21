import * as React from "react"
import AnimatedCodeBlock from "../animated/AnimatedCodeBlock"

const EVALUATION_CODE = `Eval.run("research-accuracy", {
  dataset = "golden-questions",
  scorers = {
    accuracy = Scorer.llm_classify("is this correct?"),
    latency = Scorer.latency(),
    cost = Scorer.cost()
  },
  experiment = my_procedure
})`

const EvaluationsDiagram = ({ theme, className, style }) => {
  return (
    <div className={className} style={{ width: "100%", ...style }}>
      <AnimatedCodeBlock
        label="Evaluation"
        filename="eval.tac"
        hint="Eval.run"
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
