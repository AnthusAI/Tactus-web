import * as React from "react"
import StagedToolAccessDiagram from "./StagedToolAccessDiagram"

export default {
  title: "Diagrams/Staged Tool Access",
  component: StagedToolAccessDiagram,
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
      <StagedToolAccessDiagram {...args} />
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
      <StagedToolAccessDiagram {...args} />
    </div>
  ),
}

