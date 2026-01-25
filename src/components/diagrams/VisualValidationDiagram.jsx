import * as React from "react"
import { Square, Triangle, Circle } from "lucide-react"
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

const CYCLE_DURATION = 4000
const ITEM_COUNT = 4

// --- Easing ---
const clamp01 = v => Math.min(1, Math.max(0, v))
const easeLinear = t => t
const easeOutBack = t => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

const VisualValidationDiagram = ({
  theme = "light",
  time = 0,
  style,
  className,
  disableCssTransitions = false,
}) => {
  const t = diagramTokens
  const timeMs = time

  // Layout
  const startX = 40
  const filterX = 240
  const endX = 440
  const centerY = 100

  // Items
  // 0: Valid (Square)
  // 1: Invalid (Triangle)
  // 2: Invalid (Circle)
  // 3: Valid (Square)
  const ITEMS = [
    { id: 0, type: "valid", shape: Square, offset: 0 },
    { id: 1, type: "invalid", shape: Triangle, offset: 1000 },
    { id: 2, type: "invalid", shape: Circle, offset: 2000 },
    { id: 3, type: "valid", shape: Square, offset: 3000 },
  ]

  const totalLoop = 4000
  const localTime = timeMs % totalLoop

  const renderItems = ITEMS.map(item => {
    // Phases:
    // 0-1000: Travel to Filter
    // 1000-2000: Exit (if valid) or Bounce (if invalid)

    // Normalize time to item start
    let tCycle = localTime - item.offset
    if (tCycle < 0) tCycle += totalLoop // Handle wrap

    let x = 0,
      y = 0,
      opacity = 1,
      scale = 1,
      color = t.ink

    if (tCycle < 1000) {
      // Travel to Filter
      const p = tCycle / 1000
      x = startX + (filterX - startX) * p
      y = centerY
    } else {
      // Post-Filter
      const p = Math.min(1, (tCycle - 1000) / 1000)

      if (item.type === "valid") {
        // Pass through
        x = filterX + (endX - filterX) * p
        y = centerY
        color = "green"
      } else {
        // Bounce / Reject
        x = filterX - p * 40 // Bounce back left
        y = centerY + p * 60 // Fall down
        opacity = 1 - p
        color = "red"
        scale = 1 - p * 0.5
      }
    }

    return { ...item, x, y, opacity, scale, color }
  })

  const filterPulse = (Math.sin(timeMs / 200) + 1) / 2

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
      viewBox="0 40 480 140"
    >
      {/* Background Line */}
      <line
        x1={startX}
        y1={centerY}
        x2={endX}
        y2={centerY}
        stroke={t.surface2}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      {/* Filter Node */}
      <g transform={`translate(${filterX}, ${centerY})`}>
        {/* Gate Graphic */}
        <rect
          x={-20}
          y={-40}
          width={40}
          height={80}
          rx={4}
          fill={t.surface}
          stroke={t.primary}
          strokeWidth={2}
        />
        {/* Hole (Square) - Page background color, no outline */}
        <rect x={-10} y={-10} width={20} height={20} fill="var(--color-bg)" />

        {/* Label */}
        <text
          y={56}
          textAnchor="middle"
          fontSize="11"
          fill={t.primary}
          fontFamily="sans-serif"
        >
          Schema Validator
        </text>
      </g>

      {/* Start Label */}
      <text
        x={startX}
        y={centerY + 40}
        textAnchor="middle"
        fontSize="11"
        fill={t.muted}
        fontFamily="sans-serif"
      >
        Unknown Inputs
      </text>

      {/* End Label */}
      <text
        x={endX}
        y={centerY + 40}
        textAnchor="middle"
        fontSize="11"
        fill={t.muted}
        fontFamily="sans-serif"
      >
        Validated Data
      </text>

      {/* Items */}
      {renderItems.map(item => {
        const Shape = item.shape
        return (
          <g
            key={item.id}
            transform={`translate(${item.x}, ${item.y}) scale(${item.scale})`}
            opacity={item.opacity}
          >
            <g transform="translate(-12, -12)">
              <Shape
                size={24}
                color={item.color}
                fill={t.surface}
                strokeWidth={2}
              />
            </g>
          </g>
        )
      })}
    </svg>
  )
}

export default VisualValidationDiagram
