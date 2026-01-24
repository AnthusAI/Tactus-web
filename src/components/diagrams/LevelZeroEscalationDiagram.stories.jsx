import * as React from "react"
import LevelZeroEscalationDiagram from "./LevelZeroEscalationDiagram"

export default {
  title: "Diagrams/Level Zero Escalation",
  component: LevelZeroEscalationDiagram,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
  },
}

const Frame = ({ children }) => (
  <div style={{ width: "min(980px, 94vw)", padding: "24px" }}>{children}</div>
)

export const Static = {
  args: {
    theme: "light",
  },
  render: args => (
    <Frame>
      <LevelZeroEscalationDiagram {...args} />
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
  render: args => (
    <div style={{ width: "70%", maxWidth: 1200 }}>
      <LevelZeroEscalationDiagram {...args} />
    </div>
  ),
}
