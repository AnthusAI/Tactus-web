import * as React from "react"
import AnimatedSpotlightDiagram from "./AnimatedSpotlightDiagram"

const SidecarChatDiagram = (props) => {
  const config = {
    nodes: [
      {
        id: "host-app",
        label: "Host Application",
        icon: "Monitor",
        position: { x: 120, y: 200 },
      },
      {
        id: "chat-ui",
        label: "Chat UI",
        icon: "MessageSquare",
        position: { x: 280, y: 200 },
      },
      {
        id: "runtime",
        label: "Tactus Runtime",
        icon: "Code2",
        position: { x: 480, y: 200 },
      },
      {
        id: "human-checkpoints",
        label: "Human Checkpoints",
        icon: "CheckCircle",
        position: { x: 480, y: 320 },
      },
      {
        id: "tools",
        label: "Tools & APIs",
        icon: "Server",
        position: { x: 680, y: 200 },
      },
    ],
    edges: [
      { id: "e1", from: "host-app", to: "chat-ui", bidirectional: true },
      { id: "e2", from: "chat-ui", to: "runtime", bidirectional: true },
      { id: "e3", from: "runtime", to: "tools", bidirectional: true },
      {
        id: "e4",
        from: "runtime",
        to: "human-checkpoints",
        bidirectional: true,
      },
    ],
  }

  const steps = [
    {
      nodeIds: ["host-app", "chat-ui"],
      edgeIds: ["e1"],
      caption: "User interacts with the embedded Chat UI in your application.",
    },
    {
      nodeIds: ["chat-ui", "runtime"],
      edgeIds: ["e2"],
      caption: "Messages flow to the runtime, which executes the procedure.",
    },
    {
      nodeIds: ["runtime", "tools"],
      edgeIds: ["e3"],
      caption: "The agent processes the request and calls Tools/APIs safely.",
    },
    {
      nodeIds: ["runtime", "human-checkpoints"],
      edgeIds: ["e4"],
      caption:
        "For sensitive actions, the agent pauses and requests human approval or input.",
    },
    {
      nodeIds: ["runtime", "chat-ui"],
      edgeIds: ["e2"],
      caption: "Structured responses and tool outputs flow back to the UI.",
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

export default SidecarChatDiagram
