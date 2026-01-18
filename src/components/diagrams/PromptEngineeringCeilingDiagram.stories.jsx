import * as React from "react"
import PromptEngineeringCeilingDiagram from "./PromptEngineeringCeilingDiagram"

export default {
  title: "Diagrams/Prompt Engineering Ceiling",
  component: PromptEngineeringCeilingDiagram,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
    progress: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
}

const Frame = ({ children }) => (
  <div style={{ width: "min(1100px, 95vw)", padding: "24px" }}>{children}</div>
)

export const Default = {
  args: {
    theme: "light",
    progress: 1,
  },
  render: (args) => (
    <Frame>
      <PromptEngineeringCeilingDiagram {...args} />
    </Frame>
  ),
}

export const VideoFrame = {
  args: {
    theme: "light",
    progress: 1,
  },
  parameters: {
    videoCanvas: { enabled: true, showGuides: true },
  },
  render: (args) => (
    <div style={{ width: "85%", maxWidth: 1400 }}>
      <PromptEngineeringCeilingDiagram {...args} />
    </div>
  ),
}
