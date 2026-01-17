import * as React from "react";

const COLORS = {
  light: {
    bg: "transparent",
    surface: "#ffffff",
    surface2: "#f4f4f5", // zinc-100
    surface3: "#e4e4e7", // zinc-200
    ink: "#111827", // gray-900
    muted: "#52525b", // zinc-600
    magenta: "#c7007e",
    magentaSoft: "#f9e6f3",
    ok: "#16a34a",
  },
  dark: {
    bg: "transparent",
    surface: "#27272a", // zinc-800/900 mix
    surface2: "#3f3f46", // zinc-700
    surface3: "#52525b", // zinc-600
    ink: "#f4f4f5",
    muted: "#a1a1aa",
    magenta: "#ff4fb5",
    magentaSoft: "#3f0a2a",
    ok: "#22c55e",
  },
};

const GuardrailsStackDiagram = ({
  theme = "light",
  title = "Guardrails that enable autonomy",
  subtitle = "You can’t drive fast without brakes: powerful tools require strong boundaries.",
  style,
  className,
}) => {
  const c = COLORS[theme];

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
        display: "block",
        width: "100%",
        height: "auto",
        background: c.bg,
        ...style,
      }}
      viewBox="0 0 1200 720"
      role="img"
      aria-label="Diagram showing a stack of guardrails: capability control, tool boundaries, human gates, execution isolation, and a secretless runtime."
    >
      <defs>
        <filter id="gsdShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <marker id="gsdArrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c.magenta} />
        </marker>
      </defs>

      {/* Title */}
      <g transform="translate(80, 72)">
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

      {/* Outer card */}
      <g filter="url(#gsdShadow)">
        <rect x="60" y="150" width="1080" height="520" rx="28" fill={c.surface2} />
      </g>

      {/* Stack */}
      <g transform="translate(120, 210)">
        <rect x="0" y="0" width="720" height="420" rx="24" fill={c.surface} />
        <text
          x="24"
          y="44"
          fill={c.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
        >
          Guardrails stack (defense in depth)
        </text>

        {layers.map((layer, i) => {
          const y = 72 + i * 68;
          return (
            <g key={layer.name} transform={`translate(24, ${y})`}>
              <rect x="0" y="0" width="672" height="56" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.65 : 0.85} />
              <rect x="0" y="0" width="10" height="56" rx="10" fill={c.magenta} opacity={0.9} />
              <text
                x="24"
                y="24"
                fill={c.ink}
                fontSize="16"
                fontWeight="900"
                fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
              >
                {layer.name}
              </text>
              <text
                x="24"
                y="44"
                fill={c.muted}
                fontSize="14"
                fontWeight="700"
                fontFamily="system-ui, -apple-system, Segoe UI, sans-serif"
              >
                {layer.desc}
              </text>
            </g>
          );
        })}
      </g>

      {/* Context box */}
      <g transform="translate(870, 210)">
        <rect x="0" y="0" width="240" height="420" rx="24" fill={c.surface} />
        <text x="20" y="44" fill={c.ink} fontSize="16" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          What’s untrusted?
        </text>
        <text x="20" y="74" fill={c.muted} fontSize="14" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          • Agent behavior
        </text>
        <text x="20" y="98" fill={c.muted} fontSize="14" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          • `.tac` code
        </text>
        <text x="20" y="122" fill={c.muted} fontSize="14" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          • Inputs/tools output
        </text>

        <rect x="20" y="158" width="200" height="88" rx="18" fill={c.magentaSoft} opacity={theme === "light" ? 0.9 : 0.85} />
        <text x="34" y="188" fill={c.ink} fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          What must not leak
        </text>
        <text x="34" y="212" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          • API keys
        </text>
        <text x="34" y="234" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          • Customer data
        </text>

        <rect x="20" y="270" width="200" height="140" rx="18" fill={c.surface3} opacity={theme === "light" ? 0.6 : 0.85} />
        <text x="34" y="300" fill={c.ink} fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          The point
        </text>
        <text x="34" y="326" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Autonomy comes
        </text>
        <text x="34" y="346" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          from giving the
        </text>
        <text x="34" y="366" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          agent power.
        </text>
        <text x="34" y="392" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          Guardrails make
        </text>
        <text x="34" y="412" fill={c.muted} fontSize="13" fontWeight="700" fontFamily="system-ui, -apple-system, Segoe UI, sans-serif">
          it safe.
        </text>
      </g>

      {/* Arrow between stack and context */}
      <path d="M 840 420 C 850 420 858 420 870 420" fill="none" stroke={c.magenta} strokeWidth="6" markerEnd="url(#gsdArrow)" />
    </svg>
  );
};

export default GuardrailsStackDiagram;

