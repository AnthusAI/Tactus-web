import * as React from "react";
import {
  ShieldAlert,
  Brain,
  FileText,
  Database,
  Box,
  Container,
  Lock,
  CircleDollarSign,
} from "lucide-react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

// Helper for clamping
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const GuardrailsStackDiagram = ({
  theme = "light",
  progress = 0, // 0 to 1
  style,
  className,
}) => {
  const t = diagramTokens;
  // Ensure progress is 0-1
  const p = clamp(progress, 0, 1);

  const layers = [
    {
      name: "Cost & Limits",
      desc: "Hard quotas prevent runaway loops and billing surprises before they happen.",
      Icon: CircleDollarSign,
    },
    {
      name: "Prompt Engineering",
      desc: "Structured instructions and personas guide model behavior and reduce error rates.",
      Icon: FileText,
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
      name: "Tool Boundaries",
      desc: "Strict schemas, validation, and policies at the edge where the agent touches the world.",
      Icon: ShieldAlert,
    },
    {
      name: "Code Sandboxing",
      desc: "Execution in isolated environments (Lua) prevents unauthorized system access.",
      Icon: Box,
    },
    {
      name: "Container Isolation",
      desc: "Ephemeral containers ensure no state or contamination persists between runs.",
      Icon: Container,
    },
    {
      name: "Secretless Broker",
      desc: "Credentials live outside the sandbox. The agent requests work, but never holds the keys.",
      Icon: Lock,
    },
  ];

  // Timing logic
  const totalLayers = layers.length;
  // Map progress 0..1 to 0..totalLayers
  const floatIndex = p * totalLayers;
  const activeIndex = Math.min(Math.floor(floatIndex), totalLayers - 1);
  const activeLayer = layers[activeIndex];

  // Local progress within the layer (0..1)
  const localP = floatIndex - activeIndex; // fractional part
  
  const dwellTime = 0.75; 
  // Move happens from 0.75 to 1.0
  
  // Easing for movement
  const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  
  let pointerIndex = activeIndex;
  
  if (localP > dwellTime && activeIndex < totalLayers - 1) {
     const moveP = (localP - dwellTime) / (1 - dwellTime);
     pointerIndex = activeIndex + easeInOut(moveP);
  }

  // Layout
  const width = 960;
  const height = 400;
  
  // Left stack
  const stackWidth = 340;
  const stackX = 40;
  const layerHeight = 40;
  const gap = 6;
  const stackHeight = totalLayers * (layerHeight + gap) - gap;
  const startY = (height - stackHeight) / 2;

  // Detail panel
  const detailX = 440;
  const detailWidth = 480;
  const detailY = startY;
  const detailHeight = stackHeight;

  // Pointer
  const pointerX = stackX + stackWidth + 10;
  const pointerSize = 12;
  const pointerY = startY + pointerIndex * (layerHeight + gap) + layerHeight / 2;

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
      <defs>
        {/* Gradients or filters if needed */}
      </defs>

      {/* Stack Layers */}
      <g transform={`translate(${stackX}, ${startY})`}>
        {layers.map((layer, i) => {
          const isActive = i === activeIndex;
          const y = i * (layerHeight + gap);

          return (
            <g key={i} transform={`translate(0, ${y})`} style={{ transition: "opacity 0.2s" }}>
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
          );
        })}
      </g>

      {/* Moving Pointer (Triangle) */}
      <path
        d={`M ${pointerX} ${pointerY} L ${pointerX + pointerSize} ${pointerY - pointerSize/1.5} L ${pointerX + pointerSize} ${pointerY + pointerSize/1.5} Z`}
        fill={t.primary}
      />

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
            <rect
              width={detailWidth}
              height={4}
              fill={t.surface2}
              rx={2}
            />
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
                    strokeWidth: 1.5
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
                fontWeight: "400"
              }}
            />
         </g>
      </g>

    </svg>
  );
};

// Simple text wrapper component for SVG
const WrappedText = ({ x, y, width, lineHeight, text, style }) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if ((currentLine + " " + word).length * 9 < width) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  return (
    <text x={x} y={y} {...style}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

export default GuardrailsStackDiagram;
