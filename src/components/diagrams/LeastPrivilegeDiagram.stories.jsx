import * as React from "react"
import LeastPrivilegeDiagram from "./LeastPrivilegeDiagram"

export default {
  title: "Diagrams/Least Privilege",
  component: LeastPrivilegeDiagram,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
    progress: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Animation progress (0-1)",
    },
  },
}

const Frame = ({ children }) => (
  <div style={{ width: "min(1100px, 95vw)", padding: "24px" }}>{children}</div>
)

export const Default = {
  args: {
    theme: "light",
    progress: 0.1, // Selects first item (0-0.2)
  },
  render: args => (
    <Frame>
      <LeastPrivilegeDiagram {...args} />
    </Frame>
  ),
}

export const DarkMode = {
  args: {
    theme: "dark",
    progress: 0.5, // Selects middle item
  },
  render: args => (
    <Frame>
      <LeastPrivilegeDiagram {...args} />
    </Frame>
  ),
}

export const VideoFrame = {
  args: {
    theme: "light",
    progress: 0,
  },
  parameters: {
    videoCanvas: { enabled: true, showGuides: true },
  },
  render: args => (
    <div style={{ width: "85%", maxWidth: 1400 }}>
      <LeastPrivilegeDiagram {...args} />
    </div>
  ),
}
