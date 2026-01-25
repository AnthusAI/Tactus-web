import * as React from "react"
import {
  ShieldAlert,
  Brain,
  FileText,
  Database,
  Box,
  Container,
  CircleDollarSign,
  Wrench,
} from "lucide-react"

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

// lucide-react icons vary by version; keep a local icon so the diagram doesn't crash
// at runtime due to an undefined import.
const SquareCodeIcon = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <polyline points="10 9 7.5 12 10 15" />
    <polyline points="14 9 16.5 12 14 15" />
  </svg>
)

// Helper for clamping
const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

const GuardrailsStackDiagram = ({
  theme = "light",
  progress = 0, // 0 to 1
  style,
  className,
  isMobile = false,
}) => {
  const t = diagramTokens
  // Ensure progress is 0-1
  const p = clamp(progress, 0, 1)

  const layers = [
    {
      name: "Prompt Engineering",
      desc: "Structured instructions and personas guide model behavior — but prompts are suggestions, not controls.",
      Icon: FileText,
    },
    {
      name: "Cost & Limits",
      desc: "Hard quotas prevent runaway loops and billing surprises before they happen.",
      Icon: CircleDollarSign,
    },
    {
      name: "Context Engineering",
      desc: "Curated context and RAG ensure the model has the right information, not just all information.",
      Icon: Database,
    },
    {
      name: "Model Selection",
      desc: "Choosing the right model (and fine-tuning) for specific capabilities and safety profiles.",
      Icon: Brain,
    },
    {
      name: "Tool Selection",
      desc: "Give agents only the tools they need (and only when they need them). Capability boundaries are guardrails.",
      Icon: Wrench,
    },
    {
      name: "Code Sandboxing",
      desc: "Running agent code in a restricted environment so it can't cause damage.",
      Icon: SquareCodeIcon,
    },
    {
      name: "Container Isolation",
      desc: "Firewalling agent activity so it can't reach the network or touch your server.",
      Icon: Box,
    },
  ]

  // Timing logic
  const totalLayers = layers.length
  // Map progress 0..1 to 0..totalLayers
  const floatIndex = p * totalLayers
  const activeIndex = Math.min(Math.floor(floatIndex), totalLayers - 1)
  const activeLayer = layers[activeIndex]

  // Local progress within the layer (0..1)
  const localP = floatIndex - activeIndex // fractional part

  const dwellTime = 0.75
  // Move happens from 0.75 to 1.0

  // Easing for movement
  const easeInOut = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

  let pointerIndex = activeIndex

  if (localP > dwellTime && activeIndex < totalLayers - 1) {
    const moveP = (localP - dwellTime) / (1 - dwellTime)
    pointerIndex = activeIndex + easeInOut(moveP)
  }

  // --- Mobile Layout (Accordion) ---
  if (isMobile) {
    const width = 360
    const collapsedHeight = 50
    const expandedHeight = 240
    const gap = 8

    // Calculate total height: (N-1)*collapsed + 1*expanded + gaps
    const totalHeight =
      (totalLayers - 1) * collapsedHeight + expandedHeight + totalLayers * gap

    return (
      <svg
        className={className}
        style={{
          ...getDiagramThemeVars(theme),
          display: "block",
          width: "100%",
          height: "auto",
          background: "transparent", // Let page bg show through
          ...style,
        }}
        viewBox={`0 0 ${width} ${totalHeight}`}
        role="img"
        aria-label={`Guardrails stack diagram showing: ${activeLayer.name}`}
      >
        {/* Force background to match page background, overriding container surface color */}
        <rect width="100%" height="100%" fill="var(--color-bg)" />

        {layers.map((layer, i) => {
          const isActive = i === activeIndex

          // Calculate Y position
          // If this item is AFTER the active one, it needs to be pushed down by the expansion difference
          let y = i * (collapsedHeight + gap)
          if (i > activeIndex) {
            y += expandedHeight - collapsedHeight
          }

          // Animate the Y position smoothly as activeIndex changes
          // Note: SVG transitions are tricky, but since we re-render on activeIndex change,
          // simply transitioning the transform will work if the key is stable.

          return (
            <g
              key={i}
              transform={`translate(0, ${y})`}
              style={{
                transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            >
              <rect
                width={width}
                height={isActive ? expandedHeight : collapsedHeight}
                rx={8}
                fill={isActive ? "var(--color-bg)" : t.cardTitle}
                stroke={isActive ? t.primary : "none"}
                strokeWidth={isActive ? 2 : 0}
                style={{
                  transition:
                    "height 0.4s cubic-bezier(0.25, 1, 0.5, 1), fill 0.2s, stroke 0.2s",
                }}
              />

              {/* Collapsed/Header View */}
              <g
                transform="translate(16, 25)"
                opacity={isActive ? 0 : 1}
                style={{ transition: "opacity 0.2s" }}
              >
                <text
                  fill={t.ink} // Use regular text color for inactive
                  fontSize="16"
                  fontWeight="600"
                  fontFamily={t.fontSans}
                  dy="5" // Center vertically
                >
                  {layer.name}
                </text>
              </g>

              {/* Expanded/Active View */}
              <g
                opacity={isActive ? 1 : 0}
                style={{ transition: "opacity 0.3s 0.1s" }} // Delay fade-in
              >
                {/* Header inside expanded */}
                <text
                  x={20}
                  y={40}
                  fill={t.ink}
                  fontSize="18"
                  fontWeight="800"
                  fontFamily={t.fontSans}
                >
                  {layer.name}
                </text>

                {/* Icon - Top Right */}
                <g transform={`translate(${width - 68}, 20)`}>
                  {React.createElement(layer.Icon, {
                    size: 48,
                    color: t.ink,
                    strokeWidth: 1.5,
                  })}
                </g>

                {/* Description */}
                <WrappedText
                  x={20}
                  y={100}
                  width={320}
                  lineHeight={24}
                  text={layer.desc}
                  style={{
                    fill: t.muted,
                    fontSize: "16px",
                    fontFamily: t.fontSerif,
                    fontWeight: "400",
                  }}
                />

                {/* Progress Bar inside expanded card */}
                <rect
                  x={20}
                  y={expandedHeight - 12}
                  width={width - 40}
                  height={4}
                  fill={t.surface2}
                  rx={2}
                />
                <rect
                  x={20}
                  y={expandedHeight - 12}
                  width={(width - 40) * Math.min(localP / dwellTime, 1)}
                  height={4}
                  fill={t.primary}
                  rx={2}
                />
              </g>
            </g>
          )
        })}
      </svg>
    )
  }

  // Layout (Desktop)
  const width = 960
  const height = 400

  // Left stack
  const stackWidth = 340
  const stackX = 40
  const layerHeight = 40
  const gap = 6
  const stackHeight = totalLayers * (layerHeight + gap) - gap
  const startY = (height - stackHeight) / 2

  // Detail panel
  const detailX = 440
  const detailWidth = 480
  const detailY = startY
  const detailHeight = stackHeight

  // Pointer
  const pointerX = stackX + stackWidth + 10
  const pointerSize = 12
  const pointerY = startY + pointerIndex * (layerHeight + gap) + layerHeight / 2

  return (
    <svg
      className={className}
      data-diagram-renderer="d3"
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
      aria-label={`Guardrails stack diagram showing: ${activeLayer.name}`}
    >
      <defs>{/* Gradients or filters if needed */}</defs>

      {/* Stack Layers */}
      <g transform={`translate(${stackX}, ${startY})`}>
        {layers.map((layer, i) => {
          const isActive = i === activeIndex
          const y = i * (layerHeight + gap)

          return (
            <g
              key={i}
              transform={`translate(0, ${y})`}
              style={{ transition: "opacity 0.2s" }}
            >
              <rect
                width={stackWidth}
                height={layerHeight}
                rx={6}
                fill={isActive ? t.cardTitle : t.surface2}
                opacity={isActive ? 1 : 0.6}
              />
              {/* Highlight bar on left */}
              <rect
                width={6}
                height={layerHeight}
                rx={3}
                fill={t.primary}
                opacity={isActive ? 1 : 0}
              />
              <text
                x={20}
                y={layerHeight / 2 + 5}
                fill={isActive ? t.ink : t.muted}
                fontSize="16"
                fontWeight={isActive ? "700" : "500"}
                fontFamily={t.fontSans}
                style={{ transition: "fill 0.2s" }}
              >
                {layer.name}
              </text>
            </g>
          )
        })}
      </g>

      {/* Detail Panel */}
      <g transform={`translate(${detailX}, ${detailY})`}>
        <rect
          width={detailWidth}
          height={detailHeight}
          rx={8}
          fill={t.surface}
          stroke={t.surface2}
          strokeWidth={1}
        />

        {/* Timer/Progress Bar at bottom of detail panel */}
        <g transform={`translate(0, ${detailHeight - 4})`}>
          <rect width={detailWidth} height={4} fill={t.surface2} rx={2} />
          <rect
            width={detailWidth * Math.min(localP / dwellTime, 1)}
            height={4}
            fill={t.primary}
            rx={2}
            opacity={0.6}
          />
        </g>

        {/* Content */}
        <g key={activeIndex}>
          {/* Icon */}
          <g transform="translate(40, 40)">
            {React.createElement(activeLayer.Icon, {
              size: 64,
              color: t.primary,
              strokeWidth: 1.5,
            })}
          </g>

          {/* Title */}
          <text
            x={40}
            y={150}
            fill={t.ink}
            fontSize="28"
            fontWeight="800"
            fontFamily={t.fontSans}
          >
            {activeLayer.name}
          </text>

          <WrappedText
            x={40}
            y={190}
            width={400}
            lineHeight={28}
            text={activeLayer.desc}
            style={{
              fill: t.muted,
              fontSize: "18px",
              fontFamily: t.fontSerif,
              fontWeight: "400",
            }}
          />
        </g>
      </g>
    </svg>
  )
}

// Simple text wrapper component for SVG
const WrappedText = ({ x, y, width, lineHeight, text, style }) => {
  const words = text.split(" ")
  const lines = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const word = words[i]
    if ((currentLine + " " + word).length * 9 < width) {
      currentLine += " " + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  lines.push(currentLine)

  return (
    <text x={x} y={y} {...style}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  )
}

export default GuardrailsStackDiagram
