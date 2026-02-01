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
  timeSec,
  sceneStartSec,
  ttsStartsSec,
  segments, // NEW: segment-level timing from cue
  style,
  className,
}) => {
  const t = diagramTokens

  // If timing information is provided, use it for progressive reveal
  // Otherwise fall back to the old single-progress behavior
  let brainA, toolA, procedureA, railsA

  // Helper to get the nth TTS segment (ignoring pauses)
  const getTtsSegmentStart = (nthTts) => {
    if (!segments) return null
    const ttsSegs = segments.filter(s => s.type === "tts")
    return ttsSegs[nthTts]?.startSec ?? null
  }

  // Debug log once per second
  if (timeSec && Math.floor(timeSec) === 25 && Math.floor((timeSec % 1) * 10) === 0) {
    console.log('[NewWayFlowchart] T:', timeSec.toFixed(2), 'Segs:', segments?.length || 0, 'Brain:', getTtsSegmentStart(2))
  }

  if (timeSec !== undefined && segments?.length) {
    // Use segment-based progressive reveal
    // Actual voiceover structure:
    // Segment 2: "first you start with an agent... Then you give it a tool"
    // Segment 3: "And then you assign it a procedure"
    // Segment 4: "And then you put guardrails"
    const brainAndToolStart = getTtsSegmentStart(2)
    const procedureStart = getTtsSegmentStart(3)
    const railsStart = getTtsSegmentStart(4)

    const elementProgress = (startSec, duration = 0.5) => {
      if (startSec == null) return 1 // Show if no timing available
      if (timeSec < startSec) return 0
      if (timeSec > startSec + duration) return 1
      return (timeSec - startSec) / duration
    }

    // Brain and tool appear together since they're in the same segment
    brainA = smoothstep(clamp01(elementProgress(brainAndToolStart, 0.6)))
    toolA = smoothstep(clamp01(elementProgress(brainAndToolStart ? brainAndToolStart + 3.0 : null, 0.5)))
    procedureA = smoothstep(clamp01(elementProgress(procedureStart, 0.5)))
    railsA = smoothstep(clamp01(elementProgress(railsStart, 0.7)))
  } else if (timeSec !== undefined && sceneStartSec !== undefined) {
    // Fallback: Use timing-based progressive reveal with hardcoded offsets
    const sceneLocalSec = timeSec - sceneStartSec

    // Hard-coded timing based on voiceover (legacy fallback)
    // Brain ~21s, Tool ~28s, Procedure ~28.5s, Rails ~32s
    const elementProgress = (startTime, duration = 0.5) => {
      if (sceneLocalSec < startTime) return 0
      if (sceneLocalSec > startTime + duration) return 1
      return (sceneLocalSec - startTime) / duration
    }

    brainA = smoothstep(clamp01(elementProgress(21, 0.6)))
    toolA = smoothstep(clamp01(elementProgress(27.8, 0.5)))
    procedureA = smoothstep(clamp01(elementProgress(28.2, 0.5)))
    railsA = smoothstep(clamp01(elementProgress(31.5, 0.7)))
  } else {
    // Fallback to old behavior: single progress prop controls all elements
    const p = clamp01(progress)
    brainA = appear(p, 0.0, 0.22)
    toolA = appear(p, 0.22, 0.22)
    procedureA = appear(p, 0.44, 0.22)
    railsA = appear(p, 0.74, 0.26)
  }

  const centerX = 200
  const centerY = 200

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
