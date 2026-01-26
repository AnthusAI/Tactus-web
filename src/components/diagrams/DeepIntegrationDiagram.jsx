import * as React from "react"
import AnimatedSpotlightDiagram from "./AnimatedSpotlightDiagram"

const DeepIntegrationDiagram = (props) => {
  const config = {
    nodes: [
      {
        id: "user",
        label: "User",
        icon: "User",
        position: { x: 120, y: 120 },
      },
      {
        id: "ui-button",
        label: "UI Button",
        icon: "MousePointerClick",
        position: { x: 120, y: 230 },
      },
      {
        id: "runtime",
        label: "Tactus Runtime",
        icon: "Code2",
        position: { x: 320, y: 230 },
      },
      {
        id: "procedure",
        label: "Procedure",
        icon: "Play",
        position: { x: 520, y: 155 },
      },
      {
        id: "tools",
        label: "Tools & APIs",
        icon: "Server",
        position: { x: 700, y: 155 },
      },
      {
        id: "human-review",
        label: "Human Review Queue",
        icon: "CheckCircle",
        position: { x: 520, y: 310 },
      },
      {
        id: "system",
        label: "Your System",
        icon: "Database",
        position: { x: 700, y: 310 },
      },
    ],
    edges: [
      { id: "e1", from: "user", to: "ui-button", bidirectional: false },
      { id: "e2", from: "ui-button", to: "runtime", bidirectional: false },
      { id: "e3", from: "runtime", to: "procedure", bidirectional: false },
      { id: "e4", from: "procedure", to: "tools", bidirectional: true },
      { id: "e5", from: "procedure", to: "human-review", bidirectional: true },
      { id: "e6", from: "tools", to: "system", bidirectional: true },
      { id: "e7", from: "system", to: "runtime", bidirectional: false },
      { id: "e8", from: "runtime", to: "ui-button", bidirectional: false },
    ],
  }

  const steps = [
    {
      nodeIds: ["user", "ui-button"],
      edgeIds: ["e1"],
      caption: "A user clicks a button in your product (e.g., “Import”).",
    },
    {
      nodeIds: ["ui-button", "runtime", "procedure"],
      edgeIds: ["e2", "e3"],
      caption:
        "That UI event triggers a Tactus procedure, embedded in your application.",
    },
    {
      nodeIds: ["procedure", "tools", "system"],
      edgeIds: ["e4", "e6"],
      caption:
        "The procedure uses tools to act on your system (create records, call APIs, write data).",
    },
    {
      nodeIds: ["procedure", "human-review"],
      edgeIds: ["e5"],
      caption:
        "When needed, it pauses and requests human input asynchronously via a review queue.",
    },
    {
      nodeIds: ["runtime", "ui-button"],
      edgeIds: ["e7", "e8"],
      caption:
        "When the work completes (or resumes), your UI updates with a structured result.",
    },
  ]

  return (
    <AnimatedSpotlightDiagram
      config={config}
      steps={steps}
      stepDurationMs={3000}
      {...props}
    />
  )
}

export default DeepIntegrationDiagram
