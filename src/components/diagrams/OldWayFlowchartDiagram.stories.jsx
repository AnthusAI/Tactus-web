import * as React from "react"
import OldWayFlowchartDiagram from "./OldWayFlowchartDiagram"

export default {
  title: "Diagrams/Old Way Flowchart",
  component: OldWayFlowchartDiagram,
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
  render: args => (
    <Frame>
      <OldWayFlowchartDiagram {...args} />
    </Frame>
  ),
}

function AnimatedDemo({ theme }) {
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const durationMs = 4200

    const tick = now => {
      const t = ((now - start) % durationMs) / durationMs
      // Pause briefly on the fully-drawn state so the end is easy to inspect.
      const hold = t < 0.85 ? t / 0.85 : 1
      setProgress(hold)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <Frame>
      <OldWayFlowchartDiagram theme={theme} progress={progress} />
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
  render: args => <AnimatedDemo theme={args.theme} />,
}

export const VideoFrame = {
  args: {
    theme: "light",
    progress: 1,
  },
  parameters: {
    videoCanvas: { enabled: true, showGuides: true },
  },
  render: args => (
    <div style={{ width: "70%", maxWidth: 1200 }}>
      <OldWayFlowchartDiagram {...args} />
    </div>
  ),
}

function ProofDemo({ theme, progress }) {
  const wrapperRef = React.useRef(null)
  const [proof, setProof] = React.useState({
    renderer: "unknown",
    childCount: 0,
  })

  React.useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    const svg = el.querySelector("svg")
    if (!svg) return
    setProof({
      renderer: svg.getAttribute("data-diagram-renderer") || "missing",
      childCount: svg.querySelectorAll("*").length,
    })
  }, [theme, progress])

  return (
    <Frame>
      <div ref={wrapperRef}>
        <OldWayFlowchartDiagram theme={theme} progress={progress} />
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--color-text-muted)",
        }}
      >
        renderer: {proof.renderer} • svg nodes: {proof.childCount}
      </div>
    </Frame>
  )
}

export const ProofItsD3 = {
  name: "Proof (D3)",
  args: {
    theme: "light",
    progress: 1,
  },
  render: args => <ProofDemo theme={args.theme} progress={args.progress} />,
}
