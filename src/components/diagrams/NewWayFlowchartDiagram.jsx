import * as React from "react"
import { Brain, FileText, Wrench } from "lucide-react"

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

const clamp01 = v => Math.max(0, Math.min(1, v))
const smoothstep = t => t * t * (3 - 2 * t)
const appear = (progress, start, duration = 0.18) =>
  smoothstep(clamp01((progress - start) / duration))

const NewWayFlowchartDiagram = ({
  theme = "light",
  progress = 1,
  style,
  className,
}) => {
  const t = diagramTokens
  const p = clamp01(progress)

  const centerX = 200
  const centerY = 200

  const brainA = appear(p, 0.0, 0.22)
  const toolA = appear(p, 0.22, 0.22)
  const procedureA = appear(p, 0.44, 0.22)
  const railsA = appear(p, 0.74, 0.26)

  const pop = a => 0.88 + 0.12 * a

  const railsDraw = railsA

  // "Road in perspective" guardrails. Wider at bottom, narrower at top.
  // Keep them outside the icons.
  const railTopY = 78
  const railBottomY = 344
  const leftTopX = 118
  const leftBottomX = 44
  const rightTopX = 282
  const rightBottomX = 356

  const leftRailD = `M ${leftBottomX} ${railBottomY} L ${leftTopX} ${railTopY}`
  const rightRailD = `M ${rightBottomX} ${railBottomY} L ${rightTopX} ${railTopY}`

  const clipTopY = railBottomY - (railBottomY - railTopY) * railsDraw
  const clipHeight = railBottomY - clipTopY

  return (
    <svg
      className={className}
      style={{
        ...getDiagramThemeVars(theme),
        display: "block",
        width: "100%",
        height: "auto",
        background: "transparent",
        ...style,
      }}
      viewBox="0 0 400 400"
      role="img"
      aria-label="Diagram showing an agent with tools and tasks, bounded by guardrails."
    >
      {/* Guardrails: dashed rails revealed bottom→top */}
      <defs>
        <clipPath id="agdRailReveal">
          <rect x="0" y={clipTopY} width="400" height={clipHeight} />
        </clipPath>
      </defs>
      <g clipPath="url(#agdRailReveal)" opacity={railsDraw > 0 ? 1 : 0}>
        <path
          d={leftRailD}
          fill="none"
          stroke={t.primary}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="12 8"
        />
        <path
          d={rightRailD}
          fill="none"
          stroke={t.primary}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray="12 8"
        />
      </g>

      {/* Brain */}
      <g
        transform={`translate(${centerX - 36}, ${centerY - 36}) scale(${pop(
          brainA
        )})`}
        style={{ transformOrigin: `${centerX}px ${centerY}px` }}
        opacity={brainA}
      >
        <Brain size={72} color={t.primary} strokeWidth={1.5} />
      </g>

      {/* Tool (Wrench) */}
      <g
        transform={`translate(${centerX + 51}, ${centerY - 22}) scale(${pop(
          toolA
        )})`}
        opacity={toolA}
      >
        <Wrench size={44} color={t.inkSecondary} strokeWidth={1.5} />
      </g>

      {/* Procedure */}
      <g
        transform={`translate(${centerX - 95}, ${centerY - 22}) scale(${pop(
          procedureA
        )})`}
        opacity={procedureA}
      >
        <FileText size={44} color={t.inkSecondary} strokeWidth={1.5} />
      </g>
    </svg>
  )
}

export default NewWayFlowchartDiagram
