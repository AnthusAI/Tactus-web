import * as React from "react"
import SpotlightSection from "./spotlight-section"
import GuardrailsStackDiagram from "./diagrams/GuardrailsStackDiagram"

const GuardrailsSpotlight = ({ id = "guardrails", eyebrow = "Learn" }) => {
  return (
    <SpotlightSection
      id={id}
      eyebrow={eyebrow}
      title="Guardrails for Agent Autonomy"
      lede="You can’t drive fast without brakes. Guardrails are the prerequisite for delegating powerful tools: staged capabilities, durable approvals, sandboxing, and a secretless broker boundary."
      to="/guardrails/"
      ctaText="Read: Guardrails"
      Diagram={GuardrailsStackDiagram}
    />
  )
}

export default GuardrailsSpotlight
