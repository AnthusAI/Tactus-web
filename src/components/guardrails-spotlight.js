import * as React from "react"
import SpotlightSection from "./spotlight-section"
import AnimatedGuardrailsStackDiagram from "./diagrams/AnimatedGuardrailsStackDiagram"

const GuardrailsSpotlight = ({ id = "guardrails", eyebrow = "Learn" }) => {
  return (
    <SpotlightSection
      id={id}
      eyebrow={eyebrow}
      title="Guardrails for Agent Autonomy"
      lede="You can’t drive fast without brakes. Guardrails are the prerequisite for delegating powerful tools. Tactus is a language and runtime that give you control levers at every layer of the stack—from prompt engineering down to container isolation—so you can define the exact safety profile your application needs."
      to="/guardrails/"
      ctaText="Read: Guardrails"
      Diagram={AnimatedGuardrailsStackDiagram}
    />
  )
}

export default GuardrailsSpotlight
