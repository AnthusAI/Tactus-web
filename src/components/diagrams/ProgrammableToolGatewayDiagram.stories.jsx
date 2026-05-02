import * as React from "react"
import ProgrammableToolGatewayDiagram from "./ProgrammableToolGatewayDiagram"

export default {
  title: "Diagrams/Programmable Tool Gateway",
  component: ProgrammableToolGatewayDiagram,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
  },
}

const Frame = ({ children }) => (
  <div style={{ width: "min(1100px, 95vw)", padding: "var(--space-4)" }}>
    {children}
  </div>
)

export const Default = {
  args: {
    theme: "light",
  },
  render: args => (
    <Frame>
      <ProgrammableToolGatewayDiagram {...args} />
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
    <div style={{ width: "85%", maxWidth: 1400 }}>
      <ProgrammableToolGatewayDiagram {...args} />
    </div>
  ),
}
