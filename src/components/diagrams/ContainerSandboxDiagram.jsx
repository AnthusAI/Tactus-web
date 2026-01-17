import * as React from "react";

const COLORS = {
  light: {
    bg: "transparent",
    surface: "#ffffff",
    surface2: "#f4f4f5", // zinc-100
    surface3: "#e4e4e7", // zinc-200
    ink: "#111827", // gray-900
    muted: "#52525b", // zinc-600
    magenta: "#c30073",
    magentaSoft: "#f9e6f3",
    ok: "#16a34a",
  },
  dark: {
    bg: "transparent",
    surface: "#18181b", // zinc-900
    surface2: "#27272a", // zinc-800
    surface3: "#3f3f46", // zinc-700
    ink: "#f4f4f5", // zinc-100
    muted: "#a1a1aa", // zinc-400
    magenta: "#ff4fb5",
    magentaSoft: "#3f0a2a",
    ok: "#22c55e",
  },
};

const ContainerSandboxDiagram = ({
  theme = "light",
  title = "Lua sandbox inside a container",
  subtitle = "Keep secrets out of the sandbox, and broker privileged calls.",
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
      viewBox="0 0 1200 650"
      role="img"
      aria-label="Diagram showing a host, a container, a Lua sandbox, and a broker boundary that holds API keys."
    >
      <defs>
        <filter id="csdShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <marker
          id="csdArrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.magenta} />
        </marker>
      </defs>

      {/* Title */}
      <g transform="translate(80, 70)">
        <text x="0" y="0" fill={c.ink} fontSize="40" fontWeight="800" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          {title}
        </text>
        <text
          x="0"
          y="38"
          fill={c.muted}
          fontSize="18"
          fontWeight="500"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          {subtitle}
        </text>
      </g>

      {/* Host */}
      <g filter="url(#csdShadow)">
        <rect x="60" y="140" width="1080" height="460" rx="28" fill={c.surface2} />
      </g>
      <text
        x="92"
        y="185"
        fill={c.muted}
        fontSize="16"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        Host (your machine / cluster node)
      </text>

      {/* Container */}
      <g>
        <rect x="100" y="210" width="640" height="350" rx="24" fill={c.surface} />
        <text
          x="130"
          y="250"
          fill={c.muted}
          fontSize="15"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          Runtime container (ephemeral, networkless by default)
        </text>
      </g>

      {/* Lua sandbox */}
      <g>
        <rect x="140" y="285" width="560" height="240" rx="22" fill={c.surface3} opacity={theme === "light" ? 0.65 : 0.8} />
        <text
          x="170"
          y="325"
          fill={c.ink}
          fontSize="18"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          Lua sandbox (untrusted)
        </text>
        <text
          x="170"
          y="356"
          fill={c.muted}
          fontSize="15"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          • `.tac` orchestration code
        </text>
        <text
          x="170"
          y="380"
          fill={c.muted}
          fontSize="15"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          • No ambient filesystem / OS / network
        </text>
        <text
          x="170"
          y="404"
          fill={c.muted}
          fontSize="15"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          • I/O only via explicit tools
        </text>

        {/* Procedure code box */}
        <rect x="170" y="430" width="500" height="70" rx="18" fill={c.surface} opacity={theme === "light" ? 0.9 : 0.7} />
        <text
          x="200"
          y="472"
          fill={c.ink}
          fontSize="16"
          fontWeight="700"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
        >
          procedure code calls tools →
        </text>
      </g>

      {/* Broker box */}
      <g filter="url(#csdShadow)">
        <rect x="780" y="210" width="320" height="220" rx="22" fill={c.magentaSoft} />
      </g>
      <text
        x="812"
        y="250"
        fill={c.ink}
        fontSize="18"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        Broker (trusted)
      </text>
      <text
        x="812"
        y="278"
        fill={c.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        Holds credentials + policy
      </text>

      <rect x="812" y="300" width="256" height="46" rx="14" fill={c.surface} opacity={theme === "light" ? 0.9 : 0.7} />
      <text
        x="830"
        y="330"
        fill={c.ink}
        fontSize="14"
        fontWeight="800"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        API keys live here (not in sandbox)
      </text>

      <rect x="812" y="358" width="256" height="54" rx="14" fill={c.surface} opacity={theme === "light" ? 0.9 : 0.7} />
      <text
        x="830"
        y="388"
        fill={c.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        • Validate tool requests
      </text>
      <text
        x="830"
        y="408"
        fill={c.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        • Enforce least privilege
      </text>

      {/* External agents */}
      <g filter="url(#csdShadow)">
        <rect x="780" y="450" width="320" height="110" rx="22" fill={c.surface} />
      </g>
      <text
        x="812"
        y="490"
        fill={c.ink}
        fontSize="18"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        AI agents + APIs
      </text>
      <text
        x="812"
        y="518"
        fill={c.muted}
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
      >
        Called by the broker, not the sandbox
      </text>

      {/* Arrows */}
      <path
        d="M 620 465 C 720 470 720 330 780 330"
        fill="none"
        stroke={c.magenta}
        strokeWidth="6"
        markerEnd="url(#csdArrow)"
        opacity={0.9}
      />
      <path
        d="M 940 430 C 940 440 940 440 940 450"
        fill="none"
        stroke={c.magenta}
        strokeWidth="6"
        markerEnd="url(#csdArrow)"
        opacity={0.9}
      />

      {/* Footer note */}
      <g transform="translate(100, 590)">
        <rect x="0" y="0" width="640" height="44" rx="16" fill={c.surface} opacity={theme === "light" ? 0.8 : 0.65} />
        <text
          x="18"
          y="28"
          fill={c.muted}
          fontSize="14"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          Secretless runtime: when there’s nothing to steal, a whole class of attacks collapses.
        </text>
      </g>
    </svg>
  );
};

export default ContainerSandboxDiagram;
