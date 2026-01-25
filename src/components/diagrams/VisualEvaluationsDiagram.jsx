import * as React from "react"
import { Brain, FileText, Check, X } from "lucide-react"
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

const ITEM_COUNT = 100

// --- Easing ---
const clamp01 = v => Math.min(1, Math.max(0, v))
const easeOutCubic = t => 1 - Math.pow(1 - t, 3)

const VisualEvaluationsDiagram = ({
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
  const agentX = 180
  const endX = 320
  const scoreboardX = 420
  const centerY = 120

  const pStart = { x: startX, y: centerY }
  const pAgent = { x: agentX, y: centerY }
  const pEnd = { x: endX, y: centerY }

  const LOOP_DURATION = 14000
  const cycleIndex = Math.floor(timeMs / LOOP_DURATION)
  const isGoodRun = cycleIndex % 2 === 0
  const localTime = timeMs % LOOP_DURATION

  // Batch Definition
  // 100 items in 10 seconds.
  // Items spawn every 100ms.
  // Re-generate items based on the current cycle type
  const ITEMS = React.useMemo(() => {
    return Array.from({ length: ITEM_COUNT }).map((_, i) => {
      let isFail = false
      if (isGoodRun) {
        // 98% success (2 failures)
        isFail = i === 23 || i === 78
      } else {
        // 48% success (52 failures)
        // Use a larger prime multiplier to scatter the failures more randomly
        // (i * 37 + 11) % 100 covers the range [0, 99] with a step of 37,
        // preventing clustering of successes/failures.
        isFail = (i * 37 + 11) % 100 < 52
      }
      return {
        id: i,
        type: isFail ? "fail" : "pass",
        spawnOffset: i * 100,
      }
    })
  }, [isGoodRun])

  // Render Items
  const renderItems = ITEMS.map(item => {
    // Each item:
    // 0-400ms: Travel to Agent
    // 400-600ms: Process
    // 600-1000ms: Travel to End
    const itemStart = item.spawnOffset

    if (localTime < itemStart) return null
    const itemTime = localTime - itemStart

    let x = 0,
      y = 0,
      opacity = 1,
      status = "neutral"

    if (itemTime < 400) {
      // Travel to Agent
      const p = itemTime / 400
      x = startX + (agentX - startX) * p
      y = centerY
    } else if (itemTime < 600) {
      // Processing
      x = agentX
      y = centerY
      // Jiggle
      x += Math.random() * 4 - 2
      y += Math.random() * 4 - 2
    } else if (itemTime < 1000) {
      // Travel to End
      const p = (itemTime - 600) / 400
      x = agentX + (endX - agentX) * p
      y = centerY
      if (p > 0.1) status = item.type

      // Fan out at end
      if (status === "pass") {
        y -= p * 20
      } else {
        y += p * 20
      }
      opacity = 1 - p // Fade out
    } else {
      return null
    }

    return { ...item, x, y, opacity, status }
  }).filter(Boolean)

  // Calculate Score
  // Count how many items have passed the 1000ms mark
  // Also keep score from previous loops if we want continuity, but for now simple loop is fine.
  const completedItems = ITEMS.filter(
    item => localTime > item.spawnOffset + 1000
  )
  const passCount = completedItems.filter(i => i.type === "pass").length
  const failCount = completedItems.filter(i => i.type === "fail").length
  const totalCount = completedItems.length

  // Scoreboard Value (reset at loop start)
  const score =
    totalCount === 0 ? 0 : Math.round((passCount / totalCount) * 100)

  // Gauge Rotation (-90 to 90)
  const gaugeAngle = -90 + (score / 100) * 180

  const agentPulse = (Math.sin(timeMs / 100) + 1) / 2

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
      viewBox="0 40 480 160"
    >
      {/* Background Track */}
      <line
        x1={startX}
        y1={centerY}
        x2={endX}
        y2={centerY}
        stroke={t.surface2}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      {/* Nodes */}
      <g transform={`translate(${pStart.x}, ${pStart.y})`}>
        <circle r={20} fill={t.surface} stroke={t.surface2} strokeWidth={2} />
        <text
          y={36}
          textAnchor="middle"
          fontSize="10"
          fill={t.muted}
          fontFamily="sans-serif"
        >
          Dataset
        </text>
      </g>

      <g transform={`translate(${pAgent.x}, ${pAgent.y})`}>
        <circle
          r={30}
          fill={t.surface}
          stroke={t.primary}
          strokeWidth={2}
          strokeOpacity={0.5 + agentPulse * 0.5}
        />
        <g transform="translate(-15, -15)">
          <Brain size={30} color={t.primary} />
        </g>
        <text
          y={46}
          textAnchor="middle"
          fontSize="10"
          fill={t.primary}
          fontFamily="sans-serif"
        >
          Agent
        </text>
      </g>

      {/* Scoreboard Panel - Taller to fit gauge */}
      <g transform={`translate(${scoreboardX}, ${centerY})`}>
        <rect
          x={-50}
          y={-60}
          width={100}
          height={140}
          rx={8}
          fill={t.surface}
          stroke={t.surface2}
          strokeWidth={1}
        />

        {/* Title */}
        <text
          x={0}
          y={-40}
          textAnchor="middle"
          fontSize="10"
          fill={t.muted}
          fontFamily="sans-serif"
          fontWeight="600"
        >
          RELIABILITY
        </text>

        {/* Score - Moved up */}
        <text
          x={0}
          y={-5}
          textAnchor="middle"
          fontSize="32"
          fill={t.ink}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {score}%
        </text>

        {/* Counts - Moved up */}
        <text
          x={0}
          y={15}
          textAnchor="middle"
          fontSize="10"
          fill={t.muted}
          fontFamily="sans-serif"
        >
          {passCount} / {totalCount} passed
        </text>

        {/* Gauge - Moved down */}
        <g transform="translate(0, 55)">
          {/* Gauge Arc */}
          <path
            d="M -30 0 A 30 30 0 0 1 30 0"
            fill="none"
            stroke={t.surface2}
            strokeWidth={4}
          />
          {/* Needle */}
          <g transform={`rotate(${gaugeAngle})`}>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-26}
              stroke={t.primary}
              strokeWidth={2}
              strokeLinecap="round"
            />
            <circle r={3} fill={t.primary} />
          </g>
        </g>
      </g>

      {/* Items */}
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
          <g
            key={item.id}
            transform={`translate(${item.x}, ${item.y})`}
            opacity={item.opacity}
          >
            <circle r={12} fill={t.bg} stroke={color} strokeWidth={2} />
            <g transform="translate(-6, -6)">
              <Icon size={12} color={color} />
            </g>
          </g>
        )
      })}
    </svg>
  )
}

export default VisualEvaluationsDiagram
