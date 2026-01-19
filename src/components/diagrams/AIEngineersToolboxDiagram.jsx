import * as React from "react";
import {
  FileCode,
  Terminal,
  Cable,
  Braces,
} from "lucide-react";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

// Helper for clamping
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const AIEngineersToolboxDiagram = ({
  theme = "light",
  progress = 0, // 0 to 1
  style,
  className,
}) => {
  const t = diagramTokens;
  const p = clamp(progress, 0, 1);

  const tools = [
    {
      id: "codex",
      name: "Tactus Code",
      icon: FileCode,
      desc: "Sandboxed Lua functions defined directly in your .tac file. Safe, inspectable, and fast.",
      lang: "lua",
      code: `send_email = Tool {
  function(args)
    return "Sent to " .. args.to
  end
}`
    },
    {
      id: "python",
      name: "Python Code",
      icon: Braces,
      desc: "Host-side Python functions with full access. Run outside the sandbox via the broker.",
      lang: "python",
      code: `@agent.tool
async def query_db(ctx, query: str):
    # Runs on host, not in sandbox
    # Safe access to DB credentials
    return await ctx.deps.db.fetch(query)`
    },
    {
      id: "bash",
      name: "Bash Commands",
      icon: Terminal,
      desc: "Execute shell commands inside the ephemeral container. Perfect for file ops and CLI tools.",
      lang: "lua",
      code: `local result = sh.run({
  command = "grep -r 'error' /var/logs",
  timeout = 5
})

if result.exit_code == 0 then
  Log.info("Found errors: " .. result.stdout)
end`
    },
    {
      id: "mcp",
      name: "MCP Servers",
      icon: Cable,
      desc: "Connect to external services via the Model Context Protocol. Standardized, secure integrations.",
      lang: "lua",
      code: `local fetch = Tool.get("brave_search")

-- Use standardized external tools
local results = fetch({
  q = "Tactus documentation",
  count = 5
})`
    },
  ];

  // Timing logic
  const totalTools = tools.length;
  const floatIndex = p * totalTools;
  const activeIndex = Math.min(Math.floor(floatIndex), totalTools - 1);
  const activeTool = tools[activeIndex];

  // Local progress for the bar (0..1)
  const localP = floatIndex - activeIndex;

  // Layout constants
  const width = 960;
  const height = 400;
  
  // Left Grid
  const gridX = 40;
  const gridY = 40;
  
  // 2x2 Grid
  const colCount = 2;
  const cellWidth = 170;
  const cellHeight = 150;
  const gap = 20;

  // Detail Panel (Right)
  const detailX = 440;
  const detailY = 40;
  const detailWidth = 480;
  const detailHeight = 320;

  return (
    <svg
      className={className}
      data-diagram-renderer="d3"
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
      aria-label={`AI Engineer's Toolbox diagram showing: ${activeTool.name}`}
    >
      <defs>
        {/* Gradients or filters if needed */}
      </defs>

      {/* Grid Area */}
      <g transform={`translate(${gridX}, ${gridY})`}>
        {tools.map((tool, i) => {
          const col = i % colCount;
          const row = Math.floor(i / colCount);
          const x = col * (cellWidth + gap);
          const y = row * (cellHeight + gap);
          const isActive = i === activeIndex;

          return (
            <g key={tool.id} transform={`translate(${x}, ${y})`} style={{ transition: "all 0.2s" }}>
              <rect
                width={cellWidth}
                height={cellHeight}
                rx={8}
                fill={isActive ? t.surface : t.surface2}
                stroke={isActive ? t.primary : "transparent"}
                strokeWidth={isActive ? 3 : 0}
                style={{ transition: "fill 0.2s, stroke 0.2s" }}
              />
              {/* Icon & Label */}
              <g transform={`translate(${cellWidth/2}, ${cellHeight/2 - 10})`}>
                 <g transform="translate(-24, -24)">
                    {React.createElement(tool.icon, {
                        size: 48,
                        color: isActive ? t.primary : t.muted,
                        strokeWidth: 1.5
                    })}
                 </g>
                 <text
                    x="0"
                    y="40"
                    textAnchor="middle"
                    fill={isActive ? t.ink : t.muted}
                    fontSize="16"
                    fontWeight="700"
                    fontFamily={t.fontSans}
                 >
                    {tool.name}
                 </text>
              </g>
            </g>
          );
        })}
      </g>

      {/* Detail Panel */}
      <g transform={`translate(${detailX}, ${detailY})`}>
         <rect
            width={detailWidth}
            height={detailHeight}
            rx={8}
            fill={t.surface}
            stroke={t.surface2}
            strokeWidth={1}
         />

         {/* Timer/Progress Bar at bottom of detail panel */}
         <g transform={`translate(0, ${detailHeight - 4})`}>
            <rect
              width={detailWidth}
              height={4}
              fill={t.surface2}
              rx={2}
            />
            <rect
              width={detailWidth * localP}
              height={4}
              fill={t.primary}
              rx={2}
              opacity={0.6}
            />
         </g>

         {/* Content */}
         <g key={activeIndex}>
            {/* Header */}
            <text
              x={30}
              y={40}
              fill={t.ink}
              fontSize="24"
              fontWeight="800"
              fontFamily={t.fontSans}
            >
              {activeTool.name}
            </text>

            {/* Description */}
            <WrappedText
              x={30}
              y={70}
              width={420}
              lineHeight={24}
              text={activeTool.desc}
              style={{
                fill: t.muted,
                fontSize: "16px",
                fontFamily: t.fontSerif, // Serif for body
                fontWeight: "400"
              }}
            />

            {/* Code Snippet Window */}
            <g transform="translate(30, 130)">
                <rect
                    width={420}
                    height={160}
                    rx={6}
                    fill={t.codeBg}
                />
                <foreignObject x="0" y="0" width="420" height="160">
                    <div style={{
                        padding: "16px",
                        fontFamily: t.fontMono,
                        fontSize: "13px",
                        lineHeight: "1.5",
                        color: t.code,
                        overflow: "hidden",
                        whiteSpace: "pre",
                        height: "100%",
                        boxSizing: "border-box"
                    }}>
                        {activeTool.code}
                    </div>
                </foreignObject>
            </g>
         </g>
      </g>

    </svg>
  );
};

// Simple text wrapper component for SVG
const WrappedText = ({ x, y, width, lineHeight, text, style }) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    // Rough character width estimation
    if ((currentLine + " " + word).length * 8 < width) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);

  return (
    <text x={x} y={y} {...style}>
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

export default AIEngineersToolboxDiagram;
