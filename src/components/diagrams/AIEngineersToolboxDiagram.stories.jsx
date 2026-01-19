import * as React from "react"
import AIEngineersToolboxDiagram from "./AIEngineersToolboxDiagram"

export default {
  title: "Diagrams/AIEngineersToolboxDiagram",
  component: AIEngineersToolboxDiagram,
}

function Frame({ children, theme = "light" }) {
  return (
    <div
      style={{
        background: theme === "dark" ? "#1a1a1a" : "#ffffff",
        padding: "2rem",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  )
}

export const LightMode = (args) => (
  <Frame theme="light">
    <AIEngineersToolboxDiagram {...args} />
  </Frame>
)

export const DarkMode = (args) => (
  <Frame theme="dark">
    <AIEngineersToolboxDiagram {...args} theme="dark" />
  </Frame>
)

export const VideoMode = (args) => (
  <div
    style={{
      background: "transparent",
      padding: "2rem",
      minHeight: "500px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <AIEngineersToolboxDiagram {...args} />
  </div>
)
