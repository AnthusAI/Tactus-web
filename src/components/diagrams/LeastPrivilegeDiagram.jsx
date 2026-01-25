import * as React from "react"
import { Wrench, Database, WifiOff, Lock, Clock } from "lucide-react"

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

// Helper for clamping
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

const LeastPrivilegeDiagram = ({
  theme = "light",
  progress = 0,
  style,
  className,
}) => {
  const t = diagramTokens
  const p = clamp(progress, 0, 1)

  const dimensions = [
    {
      name: "Minimal Toolsets",
      description: "Only tools needed for the task",
      Icon: Wrench,
    },
    {
      name: "Curated Context",
      description: "Limited information, not everything",
      Icon: Database,
    },
    {
      name: "Network Isolation",
      description: "Default networkless execution",
      Icon: WifiOff,
    },
    {
      name: "API Boundaries",
      description: "Secretless broker keeps credentials out",
      Icon: Lock,
    },
    {
      name: "Temporal Gating",
      description: "Tools available only when workflow stage requires",
      Icon: Clock,
    },
  ]

  // Calculate which dimension is active based on progress
  const totalDimensions = dimensions.length
  const floatIndex = p * totalDimensions
  const activeIndex = Math.min(Math.floor(floatIndex), totalDimensions - 1)

  // Layout constants - matching GuardrailsStackDiagram aspect ratio (960x400)
  const width = 960
  const height = 400
  const cardWidth = 280
  const cardHeight = 150
  const gapX = 20
  const gapY = 20

  // Grid layout helper
  const getPosition = index => {
    // Top row: 3 items
    // Bottom row: 2 items (centered)

    if (index < 3) {
      // Row 1
      const rowCount = 3
      const totalRowWidth = rowCount * cardWidth + (rowCount - 1) * gapX
      const startX = (width - totalRowWidth) / 2

      const contentHeight = 2 * cardHeight + gapY
      const startY = (height - contentHeight) / 2

      return {
        x: startX + index * (cardWidth + gapX),
        y: startY,
      }
    } else {
      // Row 2
      const rowCount = 2
      const totalRowWidth = rowCount * cardWidth + (rowCount - 1) * gapX
      const startX = (width - totalRowWidth) / 2
      const colIndex = index - 3

      const contentHeight = 2 * cardHeight + gapY
      const startY = (height - contentHeight) / 2

      return {
        x: startX + colIndex * (cardWidth + gapX),
        y: startY + cardHeight + gapY,
      }
    }
  }

  return (
    <svg
      className={className}
      style={{
        ...getDiagramThemeVars(theme),
        display: "block",
        width: "100%",
        height: "auto",
        background: t.bg,
        ...style,
      }}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Diagram showing how Tactus enforces least privilege across five dimensions: minimal toolsets, curated context, network isolation, API boundaries, and temporal gating."
    >
      {/* Dimensions Grid */}
      {dimensions.map((dim, i) => {
        const { x, y } = getPosition(i)
        const isActive = i === activeIndex

        return (
          <g
            key={dim.name}
            transform={`translate(${x}, ${y})`}
            style={{ transition: "opacity 0.3s" }}
          >
            {/* Card Background */}
            <rect
              width={cardWidth}
              height={cardHeight}
              rx={12}
              fill={t.surface}
              stroke={isActive ? t.primary : t.surface2}
              strokeWidth={isActive ? 3 : 1}
              opacity={isActive ? 1 : 0.6}
            />

            {/* Icon */}
            <g transform="translate(24, 24)">
              {React.createElement(dim.Icon, {
                size: 32,
                color: isActive ? t.primary : t.muted,
                strokeWidth: 2,
              })}
            </g>

            {/* Title */}
            <text
              x={24}
              y={84}
              fill={isActive ? t.ink : t.muted}
              fontSize="18"
              fontWeight="700"
              fontFamily={t.fontSans}
            >
              {dim.name}
            </text>

            {/* Description */}
            <foreignObject x="24" y="94" width={cardWidth - 48} height="50">
              <div
                style={{
                  fontFamily: t.fontSans,
                  fontSize: "14px",
                  fontWeight: "500",
                  color: isActive ? t.inkSecondary : t.muted,
                  lineHeight: "1.4",
                }}
              >
                {dim.description}
              </div>
            </foreignObject>
          </g>
        )
      })}
    </svg>
  )
}

export default LeastPrivilegeDiagram
