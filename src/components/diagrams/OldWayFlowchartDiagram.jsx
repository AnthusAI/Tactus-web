import * as React from "react";
import * as d3 from "d3";

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme";

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (t) => t * t * (3 - 2 * t);

// Layout + routing directly from the user's D3 example.
const nodes = [
  { id: "start", type: "startEnd", x: 200, y: 35, width: 60, height: 30 },
  { id: "process1", type: "process", x: 200, y: 97, width: 50, height: 35 },
  { id: "decision1", type: "decision", x: 200, y: 175, size: 40 },
  { id: "processLeft", type: "process", x: 100, y: 240, width: 50, height: 35 },
  { id: "decision2", type: "decision", x: 300, y: 240, size: 40 },
  { id: "processRight", type: "process", x: 300, y: 315, width: 50, height: 35 },
  { id: "end", type: "startEnd", x: 200, y: 380, width: 60, height: 30 },
];

const edges = [
  { id: "e1", from: "start", to: "process1", fromSide: "bottom", toSide: "top" },
  { id: "e2", from: "process1", to: "decision1", fromSide: "bottom", toSide: "top" },
  { id: "e3", from: "decision1", to: "processLeft", fromSide: "left", toSide: "top" },
  { id: "e4", from: "decision1", to: "decision2", fromSide: "right", toSide: "top" },
  { id: "e5", from: "decision2", to: "processRight", fromSide: "bottom", toSide: "top" },
  { id: "e6", from: "decision2", to: "process1", fromSide: "right", toSide: "right", loop: true },
  { id: "e7", from: "processLeft", to: "end", fromSide: "bottom", toSide: "top" },
  { id: "e8", from: "processRight", to: "end", fromSide: "bottom", toSide: "top" },
];

const getNodeById = (id) => nodes.find((n) => n.id === id);

const getAnchorPoint = (node, side) => {
  if (node.type === "decision") {
    const half = node.size / 2;
    switch (side) {
      case "top":
        return { x: node.x, y: node.y - half };
      case "bottom":
        return { x: node.x, y: node.y + half };
      case "left":
        return { x: node.x - half, y: node.y };
      case "right":
        return { x: node.x + half, y: node.y };
      default:
        return { x: node.x, y: node.y };
    }
  }

  const halfW = node.width / 2;
  const halfH = node.height / 2;
  switch (side) {
    case "top":
      return { x: node.x, y: node.y - halfH };
    case "bottom":
      return { x: node.x, y: node.y + halfH };
    case "left":
      return { x: node.x - halfW, y: node.y };
    case "right":
      return { x: node.x + halfW, y: node.y };
    default:
      return { x: node.x, y: node.y };
  }
};

const generatePath = (edge) => {
  const fromNode = getNodeById(edge.from);
  const toNode = getNodeById(edge.to);
  const start = getAnchorPoint(fromNode, edge.fromSide);
  const end = getAnchorPoint(toNode, edge.toSide);

  if (edge.loop) {
    const loopX = 360;
    return `M ${start.x} ${start.y} H ${loopX} V ${end.y} H ${end.x}`;
  }

  if (edge.fromSide === "bottom" && edge.toSide === "top") {
    if (start.x === end.x) return `M ${start.x} ${start.y} V ${end.y}`;
    const midY = (start.y + end.y) / 2;
    return `M ${start.x} ${start.y} V ${midY} H ${end.x} V ${end.y}`;
  }

  if (edge.fromSide === "left" && edge.toSide === "top") {
    return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
  }

  if (edge.fromSide === "right" && edge.toSide === "top") {
    return `M ${start.x} ${start.y} H ${end.x} V ${end.y}`;
  }

  return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
};

// Normalized from the D3 example's ms delays (0..1).
const timeline = [
  { kind: "node", id: "start", at: 200 / 3600 },
  { kind: "edge", id: "e1", at: 600 / 3600 },
  { kind: "node", id: "process1", at: 900 / 3600 },
  { kind: "edge", id: "e2", at: 1200 / 3600 },
  { kind: "node", id: "decision1", at: 1500 / 3600 },
  { kind: "edge", id: "e3", at: 1800 / 3600 },
  { kind: "edge", id: "e4", at: 1800 / 3600 },
  { kind: "node", id: "processLeft", at: 2100 / 3600 },
  { kind: "node", id: "decision2", at: 2100 / 3600 },
  { kind: "edge", id: "e5", at: 2400 / 3600 },
  { kind: "edge", id: "e6", at: 2400 / 3600 },
  { kind: "node", id: "processRight", at: 2700 / 3600 },
  { kind: "edge", id: "e7", at: 3000 / 3600 },
  { kind: "edge", id: "e8", at: 3000 / 3600 },
  { kind: "node", id: "end", at: 3300 / 3600 },
];

const appear = (progress, start, duration = 0.10) => {
  const t = clamp01((progress - start) / duration);
  return smoothstep(t);
};

const OldWayFlowchartDiagram = ({ theme = "light", progress = 1, style, className }) => {
  const t = diagramTokens;
  const p = clamp01(progress);

  // Match the provided D3 example (stroke-width: 2).
  const strokeWidth = 2;

  const nodeScale = (id) => {
    const item = timeline.find((x) => x.kind === "node" && x.id === id);
    const a = appear(p, item?.at ?? 0);
    // Use D3 easing (same family as the snippet).
    return d3.easeBackOut.overshoot(1.2)(a);
  };

  const edgeDraw = (id) => {
    const item = timeline.find((x) => x.kind === "edge" && x.id === id);
    const d = appear(p, item?.at ?? 0, 0.10);
    return d >= 0.999 ? 1 : d;
  };

  return (
    <svg
      className={className}
      data-diagram-renderer="d3"
      style={{
        ...getDiagramThemeVars(theme),
        display: "block",
        width: "100%",
        height: "auto",
        background: "transparent",
        ...style,
      }}
      viewBox="0 0 400 420"
      role="img"
      aria-label="Abstract flowchart showing rigid imperative control flow with branches and loops."
    >
      <defs>
        <marker
          id="oldWayArrow"
          viewBox="0 -5 10 10"
          // Pull the arrowhead back so the tip doesn't intrude into shapes.
          refX={10}
          refY={0}
          markerWidth={6}
          markerHeight={6}
          orient="auto"
        >
          <path d="M0,-4L10,0L0,4" fill={t.ink} />
        </marker>
      </defs>

      <g className="nodes">
        {nodes.map((node) => {
          const s = nodeScale(node.id);
          const opacity = clamp01(s);
          const transform = `translate(${node.x}, ${node.y}) scale(${s}) translate(${-node.x}, ${-node.y})`;

          if (node.type === "startEnd") {
            return (
              <rect
                key={node.id}
                x={node.x - node.width / 2}
                y={node.y - node.height / 2}
                width={node.width}
                height={node.height}
                rx={node.height / 2}
                fill={t.ink}
                opacity={opacity}
                transform={transform}
              />
            );
          }

          if (node.type === "process") {
            return (
              <rect
                key={node.id}
                x={node.x - node.width / 2}
                y={node.y - node.height / 2}
                width={node.width}
                height={node.height}
                rx={8}
                fill={t.inkSecondary}
                fillOpacity={0.22}
                opacity={opacity}
                transform={transform}
              />
            );
          }

          const half = node.size / 2;
          return (
            <polygon
              key={node.id}
              points={`${node.x},${node.y - half} ${node.x + half},${node.y} ${node.x},${node.y + half} ${node.x - half},${node.y}`}
              fill={t.primary}
              opacity={opacity}
              transform={transform}
            />
          );
        })}
      </g>

      <g
        className="edges"
        stroke={t.ink}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        {edges.map((edge) => {
          const draw = edgeDraw(edge.id);
          return (
            <path
              key={edge.id}
              d={generatePath(edge)}
              markerEnd={draw === 1 ? "url(#oldWayArrow)" : undefined}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
              opacity={draw > 0 ? 1 : 0}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default OldWayFlowchartDiagram;
