import * as React from "react"
import {
  Monitor,
  Code2,
  Database,
  Mail,
  MessageSquare,
  Search,
  Box,
  Server,
  FileText,
  User,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  MousePointerClick,
  FileJson,
  CheckCircle,
  AlertTriangle,
  Play,
} from "lucide-react"
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

// Icon mapping to allow string references in config
const ICON_MAP = {
  Monitor,
  Code2,
  Database,
  Mail,
  MessageSquare,
  Search,
  Box,
  Server,
  FileText,
  User,
  ArrowRight,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  MousePointerClick,
  FileJson,
  CheckCircle,
  AlertTriangle,
  Play,
}

// Helper: Cubic easing for smooth transitions
const easeInOutCubic = t =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

const SpotlightDiagram = ({
  theme = "light",
  config = { nodes: [], edges: [] },
  steps = [],
  stepIndex = 0,
  stepProgress = 0, // 0 to 1
  className,
  style,
  isMobile = false,
}) => {
  const t = diagramTokens
  const activeStep = steps[stepIndex] || {}
  const nextStepIndex = (stepIndex + 1) % steps.length
  
  // Transition logic:
  // We want to dwell on the current step for most of the time, then transition to the next.
  // Let's say last 20% is transition.
  const TRANSITION_THRESHOLD = 0.8
  
  let transitionProgress = 0
  if (stepProgress > TRANSITION_THRESHOLD) {
    transitionProgress = (stepProgress - TRANSITION_THRESHOLD) / (1 - TRANSITION_THRESHOLD)
  }
  
  // Eased transition for smooth visual updates
  const easedTransition = easeInOutCubic(transitionProgress)

  // Resolve targets for highlighting.
  //
  // Important: do NOT pre-highlight the next step. In earlier versions we
  // crossfaded current->next, which made "future" edges turn primary during the
  // last part of the step (reads like a bug). Instead we fade the current step
  // back to idle, then the next step becomes active on the next tick.
  const currentActiveNodes = new Set(activeStep.nodeIds || [])
  const currentActiveEdges = new Set(activeStep.edgeIds || [])
  
  const nextActiveStep = steps[nextStepIndex] || {}
  const nextActiveNodes = new Set(nextActiveStep.nodeIds || [])
  const nextActiveEdges = new Set(nextActiveStep.edgeIds || [])

  // Helper to get visual state for a node
  const getNodeState = (nodeId) => {
    const isCurrent = currentActiveNodes.has(nodeId)
    const isNext = nextActiveNodes.has(nodeId)
    
    let opacity = 0.5 // Base opacity for inactive
    let scale = 1.0
    let strokeWidth = 1
    let strokeColor = t.surface2 // Default border
    
    if (isCurrent) {
      // Active, but optionally fading out near the end of the step.
      opacity = 0.5 + 0.5 * (1 - easedTransition)
      strokeColor = t.primary
      strokeWidth = 1 + 2 * (1 - easedTransition)
    }
    
    return { opacity, scale, strokeWidth, strokeColor }
  }

  // Helper to get visual state for an edge
  const getEdgeState = (edgeId) => {
    const isCurrent = currentActiveEdges.has(edgeId)
    
    // Edges need to be visible even when inactive, otherwise the diagram reads
    // like a collection of floating boxes. Use a darker ink tone + mid opacity.
    let opacity = 0.45
    let width = 3
    let color = t.inkSecondary
    
    if (isCurrent) {
      opacity = 0.45 + 0.55 * (1 - easedTransition)
      color = t.primary
      width = 3 + 3 * (1 - easedTransition)
    }
    
    return { opacity, width, color }
  }

  // Layout constants
  // Keep a fixed viewBox so all diagrams render at the same scale.
  // (Auto-fitting per diagram makes some diagrams look "smaller".)
  const VIEWBOX_WIDTH = 800
  const VIEWBOX_HEIGHT = 450 // 16:9

  // Node dimensions must match the rendering below.
  const NODE_WIDTH = 140
  const NODE_HEIGHT = 80

  // Mobile adjustment: scale coordinates or use a different viewbox?
  // For simplicity in this v1, we'll assume the config provides coordinates that work well
  // or we scale the whole SVG.
  
  return (
    <div className={className} style={{ ...getDiagramThemeVars(theme), ...style }}>
      <div style={{ width: "100%", aspectRatio: "16 / 9" }}>
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: "100%", height: "100%", display: "block" }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Edges */}
          {config.edges
            .map(edge => ({ edge, state: getEdgeState(edge.id) }))
            // Render most important edges last so they sit above crossing lines.
            .sort((a, b) => a.state.width - b.state.width)
            .map(({ edge, state }) => {
              const sourceNode = config.nodes.find(n => n.id === edge.from)
              const targetNode = config.nodes.find(n => n.id === edge.to)

              if (!sourceNode || !targetNode) return null

              // Simple straight line for now.
              // Coordinates are node centers.
              const x1 = sourceNode.position.x
              const y1 = sourceNode.position.y
              const x2 = targetNode.position.x
              const y2 = targetNode.position.y

              return (
                <g key={edge.id}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={state.color}
                    strokeWidth={state.width}
                    opacity={state.opacity}
                  />
                  {edge.bidirectional && (
                    <polygon
                      points="-6,-4 0,0 -6,4"
                      fill={state.color}
                      opacity={state.opacity}
                      transform={`translate(${x1 + (x2 - x1) * 0.1}, ${y1 + (y2 - y1) * 0.1}) rotate(${Math.atan2(y1 - y2, x1 - x2) * 180 / Math.PI})`}
                    />
                  )}
                  <polygon
                    points="-6,-4 0,0 -6,4"
                    fill={state.color}
                    opacity={state.opacity}
                    transform={`translate(${x2 - (x2 - x1) * 0.1}, ${y2 - (y2 - y1) * 0.1}) rotate(${Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI})`}
                  />
                </g>
              )
            })}

          {/* Nodes */}
          {config.nodes.map(node => {
            const state = getNodeState(node.id)
            const Icon = ICON_MAP[node.icon] || Box

            // Node dimensions (keep in sync with the viewBox auto-fit).
            const width = NODE_WIDTH
            const height = NODE_HEIGHT
            const x = node.position.x - width / 2
            const y = node.position.y - height / 2

            return (
              <g key={node.id} transform={`translate(${x}, ${y})`}>
                {/* Node Background */}
                <rect
                  width={width}
                  height={height}
                  rx={8}
                  fill={t.surface}
                  stroke={state.strokeColor}
                  strokeWidth={state.strokeWidth}
                  opacity={Math.max(0.6, state.opacity)} // Nodes never fully disappear
                />

                {/* Icon */}
                <g transform="translate(56, 15)">
                  <Icon
                    size={28}
                    color={t.ink}
                    strokeWidth={1.5}
                    opacity={state.opacity}
                  />
                </g>

                {/* Label */}
                <text
                  x={width / 2}
                  y={60}
                  textAnchor="middle"
                  fill={t.ink}
                  fontSize="12"
                  fontWeight="600"
                  fontFamily={t.fontSans}
                  opacity={state.opacity}
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
      
      {/* Caption Area */}
      <div style={{ 
          marginTop: "1rem", 
          minHeight: "4rem", 
          textAlign: "center",
          transition: "opacity 0.3s ease"
      }}>
        <p style={{
             color: "var(--color-text)", 
             fontSize: "1.1rem", 
             fontWeight: "500",
             margin: 0,
             opacity: 1 - easedTransition // Fade out active caption during transition
        }}>
           {activeStep.caption}
        </p>
         {/* Pre-render next caption invisible to prevent layout shift? 
             Actually fixed height min-height handles most shifts. */}
      </div>
      
      {/* Progress Dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "0.5rem" }}>
         {steps.map((_, idx) => (
             <div 
                key={idx}
                style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: idx === stepIndex ? "var(--color-primary)" : "var(--color-surface-2)",
                    transition: "background-color 0.3s ease"
                }}
             />
         ))}
      </div>
    </div>
  )
}

export default SpotlightDiagram
