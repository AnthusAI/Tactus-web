import * as React from "react"
import AnimatedSpotlightDiagram from "./AnimatedSpotlightDiagram"

const EmbeddedRuntimeDiagram = (props) => {
  const config = {
    nodes: [
      {
        id: "external-app",
        label: "Your Application",
        icon: "Monitor",
        position: { x: 120, y: 200 },
      },
      {
        id: "runtime",
        label: "Tactus Runtime (embedded)",
        icon: "Cpu",
        position: { x: 300, y: 200 },
      },
      {
        id: "procedure",
        label: "Triage Procedure",
        icon: "Code2",
        position: { x: 480, y: 150 },
      },
      {
        id: "guardrails",
        label: "Guardrails",
        icon: "ShieldCheck",
        position: { x: 480, y: 280 },
      },
      {
        id: "output",
        label: "Structured Output",
        icon: "FileJson",
        position: { x: 680, y: 200 },
      },
    ],
    edges: [
      { id: "e1", from: "external-app", to: "runtime", bidirectional: true },
      { id: "e2", from: "runtime", to: "procedure", bidirectional: true },
      { id: "e3", from: "procedure", to: "guardrails", bidirectional: true },
      { id: "e4", from: "procedure", to: "output", bidirectional: false },
      { id: "e5", from: "output", to: "runtime", bidirectional: false },
    ],
  }

  const steps = [
    {
      nodeIds: ["external-app"],
      edgeIds: [],
      caption:
        "Your application hands raw text (e.g., an email) to the embedded runtime.",
    },
    {
      nodeIds: ["runtime", "procedure"],
      edgeIds: ["e1", "e2"],
      caption: "The runtime executes the Triage Procedure inside your app.",
    },
    {
      nodeIds: ["procedure", "guardrails"],
      edgeIds: ["e3"],
      caption: "The Classify module runs, checking validation rules and retrying if needed.",
    },
    {
      nodeIds: ["guardrails", "output"],
      edgeIds: ["e4"],
      caption: "Once valid, the procedure produces a strictly structured result.",
    },
    {
      nodeIds: ["output", "external-app", "runtime"],
      edgeIds: ["e5", "e1"],
      caption: "The clean JSON result returns to your application for routing.",
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

export default EmbeddedRuntimeDiagram
