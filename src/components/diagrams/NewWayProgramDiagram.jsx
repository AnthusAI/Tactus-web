import * as React from "react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (t) => t * t * (3 - 2 * t);

const appear = (progress, start, duration = 0.12) => {
  const t = clamp01((progress - start) / duration);
  return smoothstep(t);
};

const NewWayProgramDiagram = ({ theme = "light", progress = 1, style, className }) => {
  const t = diagramTokens;
  const p = clamp01(progress);
  const strokeWidth = 4;

  const aProcedure = appear(p, 0.05);
  const aAgent = appear(p, 0.20);
  const aGate = appear(p, 0.36);
  const aTools = appear(p, 0.50);
  const aArrows = appear(p, 0.62, 0.12);

  const agentCx = 200;
  const agentCy = 214;
  const agentR = 52;

  const procedure = { x: 50, y: 150, w: 124, h: 140, r: 16 };
  const tools = { x: 276, y: 150, w: 124, h: 140, r: 16 };
  const gate = { x: 256, y: agentCy - 18, w: 22, h: 22, r: 11 };

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
      viewBox="0 0 400 420"
      role="img"
      aria-label="Abstract diagram showing a procedure orchestrating an agent with tool access mediated by guardrails."
    >
      <defs>
        <marker
          id="newWayArrow"
          viewBox="0 0 10 10"
          refX="11"
          refY="5"
          markerWidth="12"
          markerHeight="12"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={t.ink} />
        </marker>
      </defs>

      {/* Procedure */}
      <g opacity={aProcedure}>
        <rect x={procedure.x} y={procedure.y} width={procedure.w} height={procedure.h} rx={procedure.r} fill={t.surface2} />
        <rect x={procedure.x + 18} y={procedure.y + 30} width={procedure.w - 36} height="16" rx="8" fill={t.surface} />
        <rect x={procedure.x + 18} y={procedure.y + 62} width={procedure.w - 52} height="16" rx="8" fill={t.surface} />
        <rect x={procedure.x + 18} y={procedure.y + 94} width={procedure.w - 44} height="16" rx="8" fill={t.surface} />
      </g>

      {/* Agent */}
      <g opacity={aAgent}>
        <circle cx={agentCx} cy={agentCy} r={agentR} fill={t.primary} />
        <circle cx={agentCx} cy={agentCy} r="16" fill={t.primaryInk} opacity="0.95" />
      </g>

      {/* Guardrails gate */}
      <g opacity={aGate}>
        <rect x={gate.x} y={gate.y} width={gate.w} height={gate.h} rx={gate.r} fill={t.primary} />
        <path
          d={`M ${gate.x + 5} ${gate.y + 12} L ${gate.x + 9} ${gate.y + 16} L ${gate.x + 17} ${gate.y + 6}`}
          fill="none"
          stroke={t.primaryInk}
          strokeWidth={strokeWidth + 1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Tools */}
      <g opacity={aTools}>
        <rect x={tools.x} y={tools.y} width={tools.w} height={tools.h} rx={tools.r} fill={t.surface2} />
        <rect x={tools.x + 18} y={tools.y + 28} width={tools.w - 36} height="30" rx="12" fill={t.surface} />
        <rect x={tools.x + 18} y={tools.y + 70} width={tools.w - 36} height="30" rx="12" fill={t.surface} />
        <rect x={tools.x + 18} y={tools.y + 112} width={tools.w - 36} height="30" rx="12" fill={t.surface} />
      </g>

      {/* Arrows (procedure -> agent, agent <-> tools) */}
      <g
        opacity={aArrows}
        stroke={t.ink}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        <path
          d={`M ${procedure.x + procedure.w} ${agentCy} H ${agentCx - agentR}`}
          markerEnd="url(#newWayArrow)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${agentCx + agentR} ${agentCy - 10} H ${tools.x}`}
          markerEnd="url(#newWayArrow)"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={`M ${tools.x} ${agentCy + 34} H ${agentCx + agentR}`}
          markerEnd="url(#newWayArrow)"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
};

export default NewWayProgramDiagram;
