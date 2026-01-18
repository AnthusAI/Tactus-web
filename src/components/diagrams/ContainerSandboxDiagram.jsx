import * as React from "react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const ContainerSandboxDiagram = ({
  theme = "light",
  title = "Lua sandbox inside a container",
  subtitle = "Keep secrets out of the sandbox, and broker privileged calls.",
  style,
  className,
}) => {
  const t = diagramTokens;
  const showHeader = Boolean(title || subtitle);
  const headerLift = showHeader ? 0 : -90;

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
      viewBox="0 0 1200 650"
      role="img"
      aria-label="Diagram showing a host, a container, a Lua sandbox, and a broker boundary that holds API keys."
    >
      <defs>
        <marker
          id="csdArrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={t.primary} />
        </marker>
      </defs>

      {/* Title (optional) */}
      {showHeader ? (
        <g transform="translate(80, 70)">
          {title ? (
            <text x="0" y="0" fill={t.ink} fontSize="40" fontWeight="800" fontFamily={t.fontSans}>
              {title}
            </text>
          ) : null}
          {subtitle ? (
            <text
              x="0"
              y={title ? 38 : 0}
              fill={t.muted}
              fontSize="18"
              fontWeight="500"
              fontFamily={t.fontSans}
            >
              {subtitle}
            </text>
          ) : null}
        </g>
      ) : null}

      {/* Host */}
      <rect x="60" y={140 + headerLift} width="1080" height="460" rx="var(--border-radius)" fill={t.cardTitle} />
      <text
        x="92"
        y={185 + headerLift}
        fill={t.muted}
        fontSize="16"
        fontWeight="700"
        fontFamily={t.fontSans}
      >
        Host (your machine / cluster node)
      </text>

      {/* Container */}
      <g>
        <rect x="100" y={210 + headerLift} width="640" height="350" rx="var(--border-radius)" fill={t.surface} />
        <text
          x="130"
          y={250 + headerLift}
          fill={t.muted}
          fontSize="15"
          fontWeight="700"
          fontFamily={t.fontSans}
        >
          Runtime container (ephemeral, networkless by default)
        </text>
      </g>

      {/* Lua sandbox */}
      <g>
        <rect x="140" y={285 + headerLift} width="560" height="240" rx="var(--border-radius)" fill={t.cardTitle} />
        <text
          x="170"
          y={325 + headerLift}
          fill={t.ink}
          fontSize="18"
          fontWeight="800"
          fontFamily={t.fontSans}
        >
          Lua sandbox (untrusted)
        </text>
        <text
          x="170"
          y={356 + headerLift}
          fill={t.muted}
          fontSize="15"
          fontWeight="600"
          fontFamily={t.fontSans}
        >
          • `.tac` orchestration code
        </text>
        <text
          x="170"
          y={380 + headerLift}
          fill={t.muted}
          fontSize="15"
          fontWeight="600"
          fontFamily={t.fontSans}
        >
          • No ambient filesystem / OS / network
        </text>
        <text
          x="170"
          y={404 + headerLift}
          fill={t.muted}
          fontSize="15"
          fontWeight="600"
          fontFamily={t.fontSans}
        >
          • I/O only via explicit tools
        </text>

        {/* Procedure code box */}
        <rect x="170" y={430 + headerLift} width="500" height="70" rx="var(--border-radius)" fill={t.surface} />
        <text
          x="200"
          y={472 + headerLift}
          fill={t.ink}
          fontSize="16"
          fontWeight="700"
          fontFamily={t.fontMono}
        >
          procedure code calls tools →
        </text>
      </g>

      {/* Broker box */}
      <rect x="780" y={210 + headerLift} width="320" height="220" rx="var(--border-radius)" fill={t.surface} />
      <rect x="780" y={210 + headerLift} width="320" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
      <rect x="780" y={210 + headerLift} width="10" height="54" rx="var(--border-radius)" fill={t.primary} />
      <text
        x="812"
        y={250 + headerLift}
        fill={t.ink}
        fontSize="18"
        fontWeight="900"
        fontFamily={t.fontSans}
      >
        Broker (trusted)
      </text>
      <text
        x="812"
        y={278 + headerLift}
        fill={t.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily={t.fontSans}
      >
        Holds credentials + policy
      </text>

      <rect x="812" y={300 + headerLift} width="256" height="46" rx="var(--border-radius)" fill={t.cardTitle} />
      <text
        x="830"
        y={330 + headerLift}
        fill={t.ink}
        fontSize="14"
        fontWeight="800"
        fontFamily={t.fontSans}
      >
        API keys live here (not in sandbox)
      </text>

      <rect x="812" y={358 + headerLift} width="256" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
      <text
        x="830"
        y={388 + headerLift}
        fill={t.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily={t.fontSans}
      >
        • Validate tool requests
      </text>
      <text
        x="830"
        y={408 + headerLift}
        fill={t.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily={t.fontSans}
      >
        • Enforce least privilege
      </text>

      {/* External agents */}
      <rect x="780" y={450 + headerLift} width="320" height="110" rx="var(--border-radius)" fill={t.surface} />
      <rect x="780" y={450 + headerLift} width="320" height="54" rx="var(--border-radius)" fill={t.cardTitle} />
      <rect x="780" y={450 + headerLift} width="10" height="54" rx="var(--border-radius)" fill={t.primary} />
      <text
        x="812"
        y={490 + headerLift}
        fill={t.ink}
        fontSize="18"
        fontWeight="900"
        fontFamily={t.fontSans}
      >
        AI agents + APIs
      </text>
      <text
        x="812"
        y="518"
        fill={t.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily={t.fontSans}
      >
        Called by the broker, not the sandbox
      </text>

      {/* Arrows */}
      <path
        d="M 620 465 C 720 470 720 330 780 330"
        fill="none"
        stroke={t.primary}
        strokeWidth="6"
        markerEnd="url(#csdArrow)"
      />
      <path
        d="M 940 430 C 940 440 940 440 940 450"
        fill="none"
        stroke={t.primary}
        strokeWidth="6"
        markerEnd="url(#csdArrow)"
      />

      {/* Footer note */}
      <g transform="translate(100, 590)">
        <rect x="0" y="0" width="640" height="44" rx="var(--border-radius)" fill={t.cardTitle} />
        <text
          x="18"
          y="28"
          fill={t.muted}
          fontSize="14"
          fontWeight="700"
          fontFamily={t.fontSans}
        >
          Secretless runtime: when there’s nothing to steal, a whole class of attacks collapses.
        </text>
      </g>
    </svg>
  );
};

export default ContainerSandboxDiagram;
