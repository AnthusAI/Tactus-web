import * as React from "react"
import { Brain, ShieldCheck, FileText, Check, X } from "lucide-react"
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

const CYCLE_DURATION = 4000 // 4 seconds per item cycle

// --- Easing Functions ---
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// --- Helper: Quadratic Bezier ---
const getQuadBezierPoint = (t, p0, p1, p2) => {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
  return { x, y }
}

const VisualSpecificationsDiagram = ({
  theme = "light",
  time = 0,
  style,
  className,
  disableCssTransitions = false
}) => {
  const t = diagramTokens
  const timeMs = time

  // Layout
  const startX = 60
  const agentX = 180
  const specX = 300
  const endX = 420
  const centerY = 140

  const pStart = { x: startX, y: centerY }
  const pAgent = { x: agentX, y: centerY }
  const pSpec = { x: specX, y: centerY }
  const pEnd = { x: endX, y: centerY }
  const pReject = { x: specX, y: centerY + 80 } // Drop down for rejection

  // Control points
  const cToAgent = { x: (startX + agentX) / 2, y: centerY - 40 }
  const cToSpec = { x: (agentX + specX) / 2, y: centerY + 40 }
  const cToEnd = { x: (specX + endX) / 2, y: centerY - 40 }
  const cToReject = { x: specX + 40, y: centerY + 40 }

  // Item Definition
  const ITEMS = [
    { id: 1, type: "pass", offset: 0 },
    { id: 2, type: "pass", offset: CYCLE_DURATION },
    { id: 3, type: "fail", offset: CYCLE_DURATION * 2 },
    { id: 4, type: "pass", offset: CYCLE_DURATION * 3 },
  ]

  // Render Logic
  const renderItems = ITEMS.map(item => {
    // Relativize time to item's cycle
    // We want infinite loop, so we mod time by total sequence duration if we want full loop,
    // or just let them scroll by. Let's let them scroll by for now, looping every 4 * CYCLE
    const totalLoop = ITEMS.length * CYCLE_DURATION
    const localTime = (timeMs - item.offset) % totalLoop
    if (localTime < 0) return null // Haven't started yet (or in future loop)

    // Phases
    // 0-800: Travel Start -> Agent
    // 800-1800: Agent Processing
    // 1800-2600: Travel Agent -> Spec
    // 2600-3600: Spec Check
    // 3600-4000: Exit

    let x = 0, y = 0, opacity = 1, scale = 1, status = "neutral"

    if (localTime < 800) {
      // Travel to Agent
      const p = easeInOutCubic(localTime / 800)
      const pt = getQuadBezierPoint(p, pStart, cToAgent, pAgent)
      x = pt.x; y = pt.y
      opacity = p // Fade in
    } else if (localTime < 1800) {
      // Agent Processing (Orbit)
      const p = (localTime - 800) / 1000
      const angle = p * Math.PI * 4 // 2 spins
      x = pAgent.x + Math.cos(angle) * 15
      y = pAgent.y + Math.sin(angle) * 15
    } else if (localTime < 2600) {
      // Travel to Spec
      const p = easeInOutCubic((localTime - 1800) / 800)
      const pt = getQuadBezierPoint(p, pAgent, cToSpec, pSpec)
      x = pt.x; y = pt.y
    } else if (localTime < 3600) {
      // Spec Check (Scanning)
      x = pSpec.x
      y = pSpec.y
      // Pulse scale
      const p = (localTime - 2600) / 1000
      scale = 1 + Math.sin(p * Math.PI * 2) * 0.2
      // Color change at end of check
      if (p > 0.8) {
        status = item.type
      }
    } else if (localTime < 4000) {
      // Exit
      const p = easeInOutCubic((localTime - 3600) / 400)
      if (item.type === "pass") {
        const pt = getQuadBezierPoint(p, pSpec, cToEnd, pEnd)
        x = pt.x; y = pt.y
        status = "pass"
      } else {
        // Fall away
        x = pSpec.x + p * 20
        y = pSpec.y + p * 60
        opacity = 1 - p
        status = "fail"
      }
    } else {
      return null
    }

    return { ...item, x, y, opacity, scale, status }
  }).filter(Boolean)

  // Pulse effect for nodes
  const agentPulse = (Math.sin(timeMs / 200) + 1) / 2
  const specPulse = (Math.sin(timeMs / 300) + 1) / 2

  return (
    <svg
      className={className}
      style={{
        ...getDiagramThemeVars(theme),
        display: "block",
        width: "100%",
        height: "auto",
        background: "transparent",
        overflow: "visible",
        ...style,
      }}
      viewBox="0 50 480 180"
    >
      <defs>
        <marker id="specArrow" viewBox="0 -5 10 10" refX={8} refY={0} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,-4L10,0L0,4" fill="currentColor" />
        </marker>
      </defs>

      {/* Connection Lines */}
      <path d={`M ${pStart.x},${pStart.y} Q ${cToAgent.x},${cToAgent.y} ${pAgent.x},${pAgent.y}`} fill="none" stroke={t.surface2} strokeWidth={2} strokeDasharray="4 4" />
      <path d={`M ${pAgent.x},${pAgent.y} Q ${cToSpec.x},${cToSpec.y} ${pSpec.x},${pSpec.y}`} fill="none" stroke={t.surface2} strokeWidth={2} strokeDasharray="4 4" />
      <path d={`M ${pSpec.x},${pSpec.y} Q ${cToEnd.x},${cToEnd.y} ${pEnd.x},${pEnd.y}`} fill="none" stroke={t.surface2} strokeWidth={2} strokeDasharray="4 4" />

      {/* Nodes */}
      
      {/* Input Node */}
      <g transform={`translate(${pStart.x}, ${pStart.y})`}>
        <circle r={24} fill={t.surface} stroke={t.surface2} strokeWidth={2} />
        <g transform="translate(-12, -12)">
          <FileText size={24} color={t.muted} />
        </g>
        <text y={40} textAnchor="middle" fontSize="11" fill={t.muted} fontFamily="sans-serif">Input</text>
      </g>

      {/* Agent Node */}
      <g transform={`translate(${pAgent.x}, ${pAgent.y})`}>
        <circle r={32} fill={t.surface} stroke={t.primary} strokeWidth={2} strokeOpacity={0.5 + agentPulse * 0.5} />
        <g transform="translate(-16, -16)">
          <Brain size={32} color={t.primary} />
        </g>
        <text y={48} textAnchor="middle" fontSize="11" fill={t.primary} fontFamily="sans-serif">Procedure</text>
      </g>

      {/* Spec Node */}
      <g transform={`translate(${pSpec.x}, ${pSpec.y})`}>
        <circle r={32} fill={t.surface} stroke={t.ink} strokeWidth={2} />
        <g transform="translate(-16, -16)">
          <ShieldCheck size={32} color={t.ink} />
        </g>
        <text y={48} textAnchor="middle" fontSize="11" fill={t.ink} fontFamily="sans-serif">Behavior Spec</text>
      </g>

      {/* End Node (Success) */}
      <g transform={`translate(${pEnd.x}, ${pEnd.y})`}>
        <circle r={24} fill={t.surface} stroke={t.surface2} strokeWidth={2} />
        <g transform="translate(-12, -12)">
          <Check size={24} color="green" />
        </g>
        <text y={40} textAnchor="middle" fontSize="11" fill={t.muted} fontFamily="sans-serif">Verified</text>
      </g>


      {/* Moving Items */}
      {renderItems.map(item => {
        let color = t.ink
        let Icon = FileText
        if (item.status === "pass") {
          color = "green"
          Icon = Check
        } else if (item.status === "fail") {
          color = "red"
          Icon = X
        }

        return (
          <g key={item.id} transform={`translate(${item.x}, ${item.y}) scale(${item.scale})`} opacity={item.opacity} style={{ transition: disableCssTransitions ? "none" : "opacity 0.2s" }}>
            {/* Flat Circle (Filled) */}
            <circle r={14} fill={color} stroke="none" />
            
            {/* Icon as a Hole (using mask or just matching background color) 
                Since we can't easily mask in this simple setup without defs, 
                we'll use the surface color (white/dark-grey) for the icon to look like a cutout 
                against the colored circle.
            */}
            <g transform="translate(-8, -8)">
              <Icon size={16} color={t.bg} strokeWidth={3} />
            </g>
          </g>
        )
      })}

    </svg>
  )
}

export default VisualSpecificationsDiagram
