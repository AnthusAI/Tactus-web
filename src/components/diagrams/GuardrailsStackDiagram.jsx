import * as React from "react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const GuardrailsStackDiagram = ({
  theme = "light",
  title = "Guardrails that enable autonomy",
  subtitle = "You can’t drive fast without brakes: powerful tools require strong boundaries.",
  style,
  className,
}) => {
  const t = diagramTokens;
  const showHeader = Boolean(title || subtitle);
  const headerLift = showHeader ? 0 : -90;

  const layers = [
    {
      name: "Capability control",
      desc: "Default-deny tools + least privilege per stage",
    },
    {
      name: "Tool boundaries",
      desc: "Schemas + deterministic validation at the interface",
    },
    {
      name: "Human gates",
      desc: "Durable HITL checkpoints for high-stakes actions",
    },
    {
      name: "Execution isolation",
      desc: "Lua sandbox + container isolation for filesystem/code safety",
    },
    {
      name: "Secretless runtime",
      desc: "Brokered model calls + credentialed tools (keys stay outside)",
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
      viewBox="0 0 1200 720"
      role="img"
      aria-label="Diagram showing a stack of guardrails: capability control, tool boundaries, human gates, execution isolation, and a secretless runtime."
    >
      <defs>
        <marker id="gsdArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={t.primary} />
        </marker>
      </defs>

      {/* Title (optional) */}
      {showHeader ? (
        <g transform="translate(80, 72)">
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

      {/* Outer card */}
      <rect x="60" y={150 + headerLift} width="1080" height="520" rx="var(--border-radius)" fill={t.cardTitle} />

      {/* Stack */}
      <g transform={`translate(120, ${210 + headerLift})`}>
        <rect x="0" y="0" width="720" height="420" rx="var(--border-radius)" fill={t.surface} />
        <text
          x="24"
          y="44"
          fill={t.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily={t.fontSans}
        >
          Guardrails stack (defense in depth)
        </text>

        {layers.map((layer, i) => {
          const y = 72 + i * 68;
          return (
            <g key={layer.name} transform={`translate(24, ${y})`}>
              <rect x="0" y="0" width="672" height="56" rx="var(--border-radius)" fill={t.cardTitle} />
              <rect x="0" y="0" width="10" height="56" rx="var(--border-radius)" fill={t.primary} />
              <text
                x="24"
                y="24"
                fill={t.ink}
                fontSize="16"
                fontWeight="900"
                fontFamily={t.fontSans}
              >
                {layer.name}
              </text>
              <text
                x="24"
                y="44"
                fill={t.muted}
                fontSize="14"
                fontWeight="700"
                fontFamily={t.fontSans}
              >
                {layer.desc}
              </text>
            </g>
          );
        })}
      </g>

      {/* Context box */}
      <g transform={`translate(870, ${210 + headerLift})`}>
        <rect x="0" y="0" width="240" height="420" rx="var(--border-radius)" fill={t.surface} />
        <text x="20" y="44" fill={t.ink} fontSize="16" fontWeight="900" fontFamily={t.fontSans}>
          What’s untrusted?
        </text>
        <text x="20" y="74" fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          • Agent behavior
        </text>
        <text x="20" y="98" fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          • `.tac` code
        </text>
        <text x="20" y="122" fill={t.muted} fontSize="14" fontWeight="700" fontFamily={t.fontSans}>
          • Inputs/tools output
        </text>

        <rect x="20" y="158" width="200" height="88" rx="var(--border-radius)" fill={t.cardTitle} />
        <rect x="20" y="158" width="10" height="88" rx="var(--border-radius)" fill={t.primary} />
        <text x="34" y="188" fill={t.ink} fontSize="14" fontWeight="900" fontFamily={t.fontSans}>
          What must not leak
        </text>
        <text x="34" y="212" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          • API keys
        </text>
        <text x="34" y="234" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          • Customer data
        </text>

        <rect x="20" y="270" width="200" height="140" rx="var(--border-radius)" fill={t.cardTitle} />
        <text x="34" y="300" fill={t.ink} fontSize="14" fontWeight="900" fontFamily={t.fontSans}>
          The point
        </text>
        <text x="34" y="326" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          Autonomy comes
        </text>
        <text x="34" y="346" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          from giving the
        </text>
        <text x="34" y="366" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          agent power.
        </text>
        <text x="34" y="392" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          Guardrails make
        </text>
        <text x="34" y="412" fill={t.muted} fontSize="13" fontWeight="700" fontFamily={t.fontSans}>
          it safe.
        </text>
      </g>

      {/* Arrow between stack and context */}
      <path
        d={`M 840 ${420 + headerLift} C 850 ${420 + headerLift} 858 ${420 + headerLift} 870 ${420 + headerLift}`}
        fill="none"
        stroke={t.primary}
        strokeWidth="6"
        markerEnd="url(#gsdArrow)"
      />
    </svg>
  );
};

export default GuardrailsStackDiagram;
