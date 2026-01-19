import * as React from "react"
import NewWayFlowchartDiagram from "./NewWayFlowchartDiagram"

export default {
  title: "Diagrams/New Way Flowchart",
  component: NewWayFlowchartDiagram,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
    progress: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
  },
}

const Frame = ({ children }) => (
  <div style={{ width: "min(900px, 90vw)", padding: "24px" }}>{children}</div>
)

export const Static = {
  args: {
    theme: "light",
    progress: 1,
  },
  render: (args) => (
    <Frame>
      <NewWayFlowchartDiagram {...args} />
    </Frame>
  ),
}

function AnimatedDemo({ theme }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const durationMs = 2600

    const tick = (now) => {
      const t = ((now - start) % durationMs) / durationMs
      setProgress(t)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <Frame>
      <NewWayFlowchartDiagram theme={theme} progress={progress} />
    </Frame>
  )
}

export const Animated = {
  args: {
    theme: "light",
  },
  argTypes: {
    progress: { table: { disable: true } },
  },
  render: (args) => <AnimatedDemo theme={args.theme} />,
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
    <div style={{ width: "70%", maxWidth: 1200 }}>
      <NewWayFlowchartDiagram {...args} />
    </div>
  ),
}

