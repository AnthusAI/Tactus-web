import * as React from "react";
import * as d3 from "d3";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (t) => t * t * (3 - 2 * t);
const between = (t, a, b) => {
  if (a === b) return t >= b ? 1 : 0;
  const u = clamp01((t - a) / (b - a));
  return smoothstep(u);
};

const PromptExampleChip = ({ x, y, text, opacity, t }) => {
  const paddingX = 12;
  const height = 30;
  const fontSize = 13;

  const approxCharWidth = fontSize * 0.6;
  const width = Math.max(120, Math.min(260, paddingX * 2 + text.length * approxCharWidth));

  return (
    <g style={{ opacity }}>
      <rect x={x} y={y} width={width} height={height} rx="var(--border-radius)" fill={t.surface2} />
      <text
        x={x + width / 2}
        y={y + height / 2 + 4}
        textAnchor="middle"
        fill={t.ink}
        fontSize={fontSize}
        fontWeight="900"
        fontFamily={t.fontSans}
      >
        {text}
      </text>
    </g>
  );
};

const PromptEngineeringCeilingDiagram = ({
  theme = "light",
  style,
  className,
  progress = 1,
}) => {
  const t = diagramTokens;

  const width = 700;
  const height = 400;
  const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear().domain([0, 100]).range([0, chartWidth]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([chartHeight, 0]);

  const productionLevel = 85;
  const plateauLevel = 65;

  const curveData = React.useMemo(() => {
    const data = [];
    for (let x = 0; x <= 100; x += 2) {
      const y = plateauLevel * (1 - Math.exp(-x / 20));
      data.push({ x, y });
    }
    return data;
  }, []);

  const curvePath = React.useMemo(() => {
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);
    return line(curveData) ?? "";
  }, []);

  const p = clamp01(progress);
  const productionT = between(p, 0.05, 0.22);
  const curveT = between(p, 0.25, 0.78);
  const plateauT = between(p, 0.34, 0.82);
  const gapT = between(p, 0.78, 1.0);

  const gapX = xScale(82);
  const gapTop = yScale(productionLevel);
  const gapTopInsetPx = 4;
  const gapBottomInsetPx = 3;
  const gapTopInsetY = gapTop + gapTopInsetPx;
  const gapBottom = yScale(plateauLevel) - gapBottomInsetPx;
  const gapY2 = lerp(gapBottom, gapTopInsetY, gapT);

  const chipDefs = React.useMemo(
    () => [
      { key: "one-sentence", text: "1 sentence", x: 18, y: 18, dx: 10, dy: 188 },
      { key: "json-only", text: "JSON only", x: 30, y: 28, dx: 28, dy: 152 },
      { key: "english", text: "English only", x: 44, y: 22, dx: 60, dy: 6 },
      { key: "three-options", text: "Provide 3 options", x: 58, y: 34, dx: -10, dy: -6 },
      { key: "avoid-flowery", text: 'Answer either "YES" or "NO".', x: 56, y: 44, dx: -90, dy: -14 },

      // "Gap" examples: keep them higher + more left, so they're clearly above the plateau.
      { key: "no-secrets", text: "Don’t look at secrets", x: 58, y: 80, dx: -320, dy: 6 },
      { key: "no-deletes", text: "Don’t delete important files", x: 62, y: 80, dx: -150, dy: -4 },
    ],
    [],
  );

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
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Diagram showing a curve where prompt engineering increases reliability but plateaus below a production reliability threshold, leaving a gap that guardrails must close."
    >
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <rect
          x="0"
          y="0"
          width={chartWidth}
          height={chartHeight}
          fill={t.surface}
          rx="var(--border-radius)"
        />

        <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke={t.inkSecondary} strokeWidth="2" />
        <line x1="0" y1="0" x2="0" y2={chartHeight} stroke={t.inkSecondary} strokeWidth="2" />

        <text
          x={chartWidth / 2}
          y={chartHeight + 45}
          textAnchor="middle"
          fill={t.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily={t.fontSans}
        >
          Prompt engineering effort →
        </text>
        <text
          x={-chartHeight / 2}
          y={-50}
          textAnchor="middle"
          transform="rotate(-90)"
          fill={t.muted}
          fontSize="14"
          fontWeight="800"
          fontFamily={t.fontSans}
        >
          Reliability →
        </text>

        <g style={{ opacity: productionT }}>
          <line
            x1="0"
            y1={yScale(productionLevel)}
            x2={chartWidth}
            y2={yScale(productionLevel)}
            stroke={t.inkSecondary}
            strokeWidth="3"
            strokeDasharray="12 6"
          />
          <text
            x={chartWidth - 8}
            y={yScale(productionLevel) - 10}
            textAnchor="end"
            fill={t.inkSecondary}
            fontSize="13"
            fontWeight="900"
            fontFamily={t.fontSans}
          >
            Production reliability threshold
          </text>
        </g>

        <g style={{ opacity: plateauT }}>
          <line
            x1="0"
            y1={yScale(plateauLevel)}
            x2={chartWidth}
            y2={yScale(plateauLevel)}
            stroke={t.surface2}
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text
            x={chartWidth - 8}
            y={yScale(plateauLevel) + 16}
            textAnchor="end"
            fill={t.muted}
            fontSize="12"
            fontWeight="800"
            fontFamily={t.fontSans}
          >
            Prompt engineering ceiling
          </text>
        </g>

        <path
          d={curvePath}
          fill="none"
          stroke={t.primary}
          strokeWidth="4"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - curveT}
          opacity={curveT > 0 ? 1 : 0}
        />

        {/* Prompt examples (pithy; appear as the curve draws) */}
        {chipDefs.map((chip) => {
          const revealAt = chip.x / 100;
          const chipOpacity = between(curveT, revealAt - 0.12, revealAt + 0.02);
          const cx = xScale(chip.x) + chip.dx;
          const cy = yScale(chip.y) + chip.dy;
          return <PromptExampleChip key={chip.key} x={cx} y={cy} text={chip.text} opacity={chipOpacity} t={t} />;
        })}

        <g style={{ opacity: gapT }}>
          <line x1={gapX} y1={gapBottom} x2={gapX} y2={gapY2} stroke={t.primary} strokeWidth="3" strokeLinecap="round" />
          <line
            x1={gapX - 8}
            y1={gapBottom}
            x2={gapX + 8}
            y2={gapBottom}
            stroke={t.primary}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1={gapX - 8}
            y1={gapTopInsetY}
            x2={gapX + 8}
            y2={gapTopInsetY}
            stroke={t.primary}
            strokeWidth="3"
            strokeLinecap="round"
            opacity={between(gapT, 0.55, 1)}
          />
          <text
            x={gapX + 16}
            y={(gapTopInsetY + gapBottom) / 2 + 5}
            fill={t.primary}
            fontSize="13"
            fontWeight="900"
            fontFamily={t.fontSans}
            opacity={between(gapT, 0.55, 1)}
          >
            Gap
          </text>
        </g>
      </g>
    </svg>
  );
};

export default PromptEngineeringCeilingDiagram;
