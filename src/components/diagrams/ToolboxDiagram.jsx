import * as React from "react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const ToolboxDiagram = ({
  theme = "light",
  title = "Tools are explicit capabilities",
  subtitle = "Schema-first, inspectable, and controllable — not arbitrary callbacks.",
  style,
  className,
}) => {
  const t = diagramTokens;

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
      viewBox="0 0 1200 660"
      role="img"
      aria-label="Diagram showing an agent proposing tool calls, a typed tool boundary, and deterministic tool implementations."
    >
      <defs>
        <marker id="tbdArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={t.primary} />
        </marker>
      </defs>

      {/* Title */}
      <g transform="translate(80, 70)">
        <text x="0" y="0" fill={t.ink} fontSize="40" fontWeight="900" fontFamily={t.fontSans}>
          {title}
        </text>
        <text
          x="0"
          y="38"
          fill={t.muted}
          fontSize="18"
          fontWeight="600"
          fontFamily={t.fontSans}
        >
          {subtitle}
        </text>
      </g>

      {/* Outer surface */}
      <rect x="60" y="140" width="1080" height="470" rx="var(--border-radius)" fill={t.cardTitle} />

      {/* Agent */}
      <g transform="translate(110, 210)">
        <rect x="0" y="0" width="300" height="320" rx="var(--border-radius)" fill={t.surface} />
        <rect x="0" y="0" width="300" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
        <rect x="0" y="0" width="10" height="54" rx="var(--border-radius)" fill={t.primary} />
        <text x="22" y="36" fill={t.ink} fontSize="18" fontWeight="900" fontFamily={t.fontSans}>
          Agent (LLM)
        </text>
        <text x="22" y="96" fill={t.muted} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          Proposes a tool call
        </text>
        <rect x="22" y="120" width="256" height="112" rx="var(--border-radius)" fill={t.cardTitle} />
        <text
          x="40"
          y="150"
          fill={t.ink}
          fontSize="13"
          fontWeight="800"
          fontFamily={t.fontMono}
        >
          tool = send_email
        </text>
        <text
          x="40"
          y="172"
          fill={t.ink}
          fontSize="13"
          fontWeight="800"
          fontFamily={t.fontMono}
        >
          args = {"{...}"}
        </text>
        <text x="22" y="272" fill={t.muted} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          Non-deterministic
        </text>
        <text x="22" y="296" fill={t.muted} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          behavior
        </text>
      </g>

      {/* Tool boundary */}
      <g transform="translate(450, 210)">
        <rect x="0" y="0" width="300" height="320" rx="var(--border-radius)" fill={t.surface} />
        <rect x="0" y="0" width="300" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
        <rect x="0" y="0" width="10" height="54" rx="var(--border-radius)" fill={t.primary} />
        <text x="22" y="36" fill={t.ink} fontSize="18" fontWeight="900" fontFamily={t.fontSans}>
          Tool boundary
        </text>
        <text x="22" y="96" fill={t.muted} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          Deterministic controls
        </text>

        <rect x="22" y="120" width="256" height="64" rx="var(--border-radius)" fill={t.cardTitle} />
        <rect x="22" y="120" width="10" height="64" rx="var(--border-radius)" fill={t.primary} />
        <text x="40" y="150" fill={t.ink} fontSize="14" fontWeight="900" fontFamily={t.fontSans}>
          Schema + validation
        </text>
        <text x="40" y="172" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
          Reject malformed calls
        </text>

        <rect x="22" y="196" width="256" height="64" rx="var(--border-radius)" fill={t.cardTitle} />
        <text x="40" y="226" fill={t.ink} fontSize="14" fontWeight="900" fontFamily={t.fontSans}>
          Policy + staging
        </text>
        <text x="40" y="248" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
          Least privilege gates
        </text>

        <text x="22" y="292" fill={t.muted} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          Inspectable: called(), last_call()
        </text>
      </g>

      {/* Tool implementations */}
      <g transform="translate(790, 210)">
        <rect x="0" y="0" width="330" height="320" rx="var(--border-radius)" fill={t.surface} />
        <rect x="0" y="0" width="330" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
        <rect x="0" y="0" width="10" height="54" rx="var(--border-radius)" fill={t.primary} />
        <text x="22" y="36" fill={t.ink} fontSize="18" fontWeight="900" fontFamily={t.fontSans}>
          Tools (deterministic)
        </text>
        <text x="22" y="96" fill={t.muted} fontSize="14" fontWeight="800" fontFamily={t.fontSans}>
          Do the work
        </text>

        <rect x="22" y="120" width="286" height="80" rx="var(--border-radius)" fill={t.cardTitle} />
        <text x="40" y="150" fill={t.ink} fontSize="14" fontWeight="900" fontFamily={t.fontSans}>
          File / data tools
        </text>
        <text x="40" y="172" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
          Read &amp; write with scoped access
        </text>

        <rect x="22" y="214" width="286" height="94" rx="var(--border-radius)" fill={t.cardTitle} />
        <rect x="22" y="214" width="10" height="94" rx="var(--border-radius)" fill={t.primary} />
        <text x="40" y="244" fill={t.ink} fontSize="14" fontWeight="900" fontFamily={t.fontSans}>
          Credentialed tools
        </text>
        <text x="40" y="266" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
          Run behind a broker boundary
        </text>
        <text x="40" y="288" fill={t.muted} fontSize="13" fontWeight="800" fontFamily={t.fontSans}>
          so keys never reach the agent
        </text>
      </g>

      {/* Arrows */}
      <path d="M 410 370 C 425 370 435 370 450 370" fill="none" stroke={t.primary} strokeWidth="6" markerEnd="url(#tbdArrow)" />
      <path d="M 750 370 C 765 370 775 370 790 370" fill="none" stroke={t.primary} strokeWidth="6" markerEnd="url(#tbdArrow)" />

      {/* Footer note */}
      <g transform="translate(110, 560)">
        <rect x="0" y="0" width="1010" height="44" rx="var(--border-radius)" fill={t.cardTitle} />
        <text
          x="18"
          y="28"
          fill={t.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily={t.fontSans}
        >
          Pattern: agents propose → deterministic code enforces → tools do work (safely, audibly, repeatably).
        </text>
      </g>
    </svg>
  );
};

export default ToolboxDiagram;
