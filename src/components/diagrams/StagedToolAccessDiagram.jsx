import * as React from "react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const StagedToolAccessDiagram = ({
  theme = "light",
  title = "Least privilege, applied per stage",
  subtitle = "Give the right tools at the right time — and remove them when you don’t need them.",
  style,
  className,
}) => {
  const t = diagramTokens;
  const showHeader = Boolean(title || subtitle);
  const headerLift = showHeader ? 0 : -90;

  const stages = [
    {
      name: "Draft",
      tools: ["Read-only tools", "Planning", "Draft output"],
      note: "No side effects",
    },
    {
      name: "Review",
      tools: ["Human.approve()", "Diff/preview"],
      note: "Durable checkpoint",
    },
    {
      name: "Commit",
      tools: ["Deploy/Send tool"],
      note: "Only after approval",
    },
  ];

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
      viewBox="0 0 1200 620"
      role="img"
      aria-label="Diagram showing staged tool access: draft, review with human approval, and commit with side effects."
    >
      <defs>
        <marker id="stadArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={t.primary} />
        </marker>
      </defs>

      {showHeader ? (
        <g transform="translate(80, 70)">
          {title ? (
            <text x="0" y="0" fill={t.ink} fontSize="40" fontWeight="900" fontFamily={t.fontSans}>
              {title}
            </text>
          ) : null}
          {subtitle ? (
            <text
              x="0"
              y={title ? 38 : 0}
              fill={t.muted}
              fontSize="18"
              fontWeight="600"
              fontFamily={t.fontSans}
            >
              {subtitle}
            </text>
          ) : null}
        </g>
      ) : null}

      <rect x="60" y={140 + headerLift} width="1080" height="420" rx="var(--border-radius)" fill={t.cardTitle} />

      {/* Stage cards */}
      {stages.map((stage, i) => {
        const x = 120 + i * 360;
        const y = 200 + headerLift;
        return (
          <g key={stage.name} transform={`translate(${x}, ${y})`}>
            <rect x="0" y="0" width="300" height="280" rx="var(--border-radius)" fill={t.surface} />
            <rect x="0" y="0" width="300" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
            <rect x="0" y="0" width="10" height="54" rx="var(--border-radius)" fill={t.primary} />
            <text x="22" y="36" fill={t.ink} fontSize="18" fontWeight="900" fontFamily={t.fontSans}>
              {stage.name}
            </text>

            <text x="22" y="90" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
              Allowed tools
            </text>

            {stage.tools.map((tool, j) => (
              <text
                key={tool}
                x="22"
                y={120 + j * 26}
                fill={t.ink}
                fontSize="14"
                fontWeight="700"
                fontFamily={t.fontSans}
              >
                • {tool}
              </text>
            ))}

            <rect x="22" y="220" width="256" height="44" rx="var(--border-radius)" fill={t.cardTitle} />
            <text x="38" y="248" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
              {stage.note}
            </text>
          </g>
        );
      })}

      {/* Arrows */}
      <path
        d={`M 450 ${340 + headerLift} C 480 ${340 + headerLift} 500 ${340 + headerLift} 520 ${340 + headerLift}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="6"
        markerEnd="url(#stadArrow)"
      />
      <path
        d={`M 810 ${340 + headerLift} C 840 ${340 + headerLift} 860 ${340 + headerLift} 880 ${340 + headerLift}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="6"
        markerEnd="url(#stadArrow)"
      />

      {/* Gate highlight under Review */}
      <g>
        <path
          d={`M 560 ${500 + headerLift} C 610 ${540 + headerLift} 710 ${540 + headerLift} 760 ${500 + headerLift}`}
          fill="none"
          stroke={t.primary}
          strokeWidth="6"
        />
        <text
          x="660"
          y={585 + headerLift}
          textAnchor="middle"
          fill={t.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily={t.fontSans}
        >
          approvals are first-class + durable
        </text>
      </g>
    </svg>
  );
};

export default StagedToolAccessDiagram;
