import * as React from "react"
import ToolboxDiagram from "./ToolboxDiagram"

export default {
  title: "Diagrams/Toolbox",
  component: ToolboxDiagram,
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
      <ToolboxDiagram {...args} />
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
      <ToolboxDiagram {...args} />
    </div>
  ),
}

