import * as React from "react";

const COLORS = {
  light: {
    bg: "transparent",
    surface: "#ffffff",
    surface2: "#f4f4f5",
    surface3: "#e4e4e7",
    ink: "#111827",
    muted: "#52525b",
    magenta: "#c7007e",
    magentaSoft: "#f9e6f3",
  },
  dark: {
    bg: "transparent",
    surface: "#27272a",
    surface2: "#3f3f46",
    surface3: "#52525b",
    ink: "#f4f4f5",
    muted: "#a1a1aa",
    magenta: "#ff4fb5",
    magentaSoft: "#3f0a2a",
  },
};

const StagedToolAccessDiagram = ({
  theme = "light",
  title = "Least privilege, applied per stage",
  subtitle = "Give the right tools at the right time — and remove them when you don’t need them.",
  style,
  className,
}) => {
  const c = COLORS[theme];

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
        display: "block",
        width: "100%",
        height: "auto",
        background: c.bg,
        ...style,
      }}
      viewBox="0 0 1200 620"
      role="img"
      aria-label="Diagram showing staged tool access: draft, review with human approval, and commit with side effects."
    >
      <defs>
        <filter id="stadShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <marker id="stadArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.magenta} />
        </marker>
      </defs>

      <g transform="translate(80, 70)">
        <text x="0" y="0" fill={c.ink} fontSize="40" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          {title}
        </text>
        <text
          x="0"
          y="38"
          fill={c.muted}
          fontSize="18"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          {subtitle}
        </text>
      </g>

      <g filter="url(#stadShadow)">
        <rect x="60" y="140" width="1080" height="420" rx="28" fill={c.surface2} />
      </g>

      {/* Stage cards */}
      {stages.map((stage, i) => {
        const x = 120 + i * 360;
        const y = 200;
        return (
          <g key={stage.name} transform={`translate(${x}, ${y})`}>
            <rect x="0" y="0" width="300" height="280" rx="24" fill={c.surface} />
            <rect x="0" y="0" width="300" height="54" rx="24" fill={c.magentaSoft} opacity={theme === "light" ? 0.9 : 0.85} />
            <text x="22" y="36" fill={c.ink} fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
              {stage.name}
            </text>

            <text x="22" y="90" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
              Allowed tools
            </text>

            {stage.tools.map((t, j) => (
              <text
                key={t}
                x="22"
                y={120 + j * 26}
                fill={c.ink}
                fontSize="14"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
              >
                • {t}
              </text>
            ))}

            <rect x="22" y="220" width="256" height="44" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.6 : 0.85} />
            <text x="38" y="248" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
              {stage.note}
            </text>
          </g>
        );
      })}

      {/* Arrows */}
      <path d="M 450 340 C 480 340 500 340 520 340" fill="none" stroke={c.magenta} strokeWidth="6" markerEnd="url(#stadArrow)" />
      <path d="M 810 340 C 840 340 860 340 880 340" fill="none" stroke={c.magenta} strokeWidth="6" markerEnd="url(#stadArrow)" />

      {/* Gate highlight under Review */}
      <g>
        <path
          d="M 560 500 C 610 540 710 540 760 500"
          fill="none"
          stroke={c.magenta}
          strokeWidth="6"
          opacity={0.9}
        />
        <text
          x="660"
          y="585"
          textAnchor="middle"
          fill={c.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          approvals are first-class + durable
        </text>
      </g>
    </svg>
  );
};

export default StagedToolAccessDiagram;

