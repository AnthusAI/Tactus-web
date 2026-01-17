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
    ok: "#16a34a",
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
    ok: "#22c55e",
  },
};

const ToolboxDiagram = ({
  theme = "light",
  title = "Tools are explicit capabilities",
  subtitle = "Schema-first, inspectable, and controllable — not arbitrary callbacks.",
  style,
  className,
}) => {
  const c = COLORS[theme];

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
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Diagram showing an agent proposing tool calls, a typed tool boundary, and deterministic tool implementations."
    >
      <defs>
        <filter id="tbdShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <marker id="tbdArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.magenta} />
        </marker>
      </defs>

      {/* Title */}
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

      {/* Outer surface */}
      <g filter="url(#tbdShadow)">
        <rect x="60" y="140" width="1080" height="470" rx="28" fill={c.surface2} />
      </g>

      {/* Agent */}
      <g transform="translate(110, 210)">
        <rect x="0" y="0" width="300" height="320" rx="24" fill={c.surface} />
        <rect x="0" y="0" width="300" height="54" rx="24" fill={c.magentaSoft} opacity={theme === "light" ? 0.9 : 0.85} />
        <text x="22" y="36" fill={c.ink} fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Agent (LLM)
        </text>
        <text x="22" y="96" fill={c.muted} fontSize="14" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Proposes a tool call
        </text>
        <rect x="22" y="120" width="256" height="112" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.6 : 0.85} />
        <text
          x="40"
          y="150"
          fill={c.ink}
          fontSize="13"
          fontWeight="800"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        >
          tool = send_email
        </text>
        <text
          x="40"
          y="172"
          fill={c.ink}
          fontSize="13"
          fontWeight="800"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        >
          args = {"{...}"}
        </text>
        <text x="22" y="272" fill={c.muted} fontSize="14" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Non-deterministic
        </text>
        <text x="22" y="296" fill={c.muted} fontSize="14" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          behavior
        </text>
      </g>

      {/* Tool boundary */}
      <g transform="translate(450, 210)">
        <rect x="0" y="0" width="300" height="320" rx="24" fill={c.surface} />
        <rect x="0" y="0" width="300" height="54" rx="24" fill={c.surface3} opacity={theme === "light" ? 0.7 : 0.9} />
        <text x="22" y="36" fill={c.ink} fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Tool boundary
        </text>
        <text x="22" y="96" fill={c.muted} fontSize="14" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Deterministic controls
        </text>

        <rect x="22" y="120" width="256" height="64" rx="18" fill={c.magentaSoft} opacity={theme === "light" ? 0.9 : 0.85} />
        <text x="40" y="150" fill={c.ink} fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Schema + validation
        </text>
        <text x="40" y="172" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Reject malformed calls
        </text>

        <rect x="22" y="196" width="256" height="64" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.6 : 0.85} />
        <text x="40" y="226" fill={c.ink} fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Policy + staging
        </text>
        <text x="40" y="248" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Least privilege gates
        </text>

        <text x="22" y="292" fill={c.muted} fontSize="14" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Inspectable: called(), last_call()
        </text>
      </g>

      {/* Tool implementations */}
      <g transform="translate(790, 210)">
        <rect x="0" y="0" width="330" height="320" rx="24" fill={c.surface} />
        <rect x="0" y="0" width="330" height="54" rx="24" fill={c.magentaSoft} opacity={theme === "light" ? 0.9 : 0.85} />
        <text x="22" y="36" fill={c.ink} fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Tools (deterministic)
        </text>
        <text x="22" y="96" fill={c.muted} fontSize="14" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Do the work
        </text>

        <rect x="22" y="120" width="286" height="80" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.6 : 0.85} />
        <text x="40" y="150" fill={c.ink} fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          File / data tools
        </text>
        <text x="40" y="172" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Read &amp; write with scoped access
        </text>

        <rect x="22" y="214" width="286" height="94" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.6 : 0.85} />
        <text x="40" y="244" fill={c.ink} fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Credentialed tools
        </text>
        <text x="40" y="266" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Run behind a broker boundary
        </text>
        <text x="40" y="288" fill={c.muted} fontSize="13" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          so keys never reach the agent
        </text>
      </g>

      {/* Arrows */}
      <path d="M 410 370 C 425 370 435 370 450 370" fill="none" stroke={c.magenta} strokeWidth="6" markerEnd="url(#tbdArrow)" />
      <path d="M 750 370 C 765 370 775 370 790 370" fill="none" stroke={c.magenta} strokeWidth="6" markerEnd="url(#tbdArrow)" />

      {/* Footer note */}
      <g transform="translate(110, 560)">
        <rect x="0" y="0" width="1010" height="44" rx="16" fill={c.surface} opacity={theme === "light" ? 0.8 : 0.65} />
        <text
          x="18"
          y="28"
          fill={c.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          Pattern: agents propose → deterministic code enforces → tools do work (safely, audibly, repeatably).
        </text>
      </g>
    </svg>
  );
};

export default ToolboxDiagram;

