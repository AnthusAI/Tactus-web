import * as React from "react"
import GuardrailsStackDiagram from "./GuardrailsStackDiagram"

export default {
  title: "Diagrams/Guardrails Stack",
  component: GuardrailsStackDiagram,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
  },
}

const Frame = ({ children }) => (
  <div style={{ width: "min(1100px, 95vw)", padding: "24px" }}>{children}</div>
)

export const Default = {
  args: {
    theme: "light",
  },
  render: (args) => (
    <Frame>
      <GuardrailsStackDiagram {...args} />
    </Frame>
  ),
}

export const VideoFrame = {
  args: {
    theme: "light",
  },
  parameters: {
    videoCanvas: { enabled: true, showGuides: true },
  },
  render: (args) => (
    <div style={{ width: "85%", maxWidth: 1400 }}>
      <GuardrailsStackDiagram {...args} />
    </div>
  ),
}

