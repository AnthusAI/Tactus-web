import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { secondsToFrames } from "@/babulus/utils";
import { CodeBlock } from "./CodeBlock";

export type CodePushTransitionProps = {
  fromLabel: string;
  fromCode: string;
  toLabel: string;
  toCode: string;
  transitionStartSec: number;
  containerWidth?: number;
  containerHeight?: number;
  transitionDurationSec?: number;
};

/**
 * Push transition between two code blocks.
 * The "to" block slides in from the right while pushing the "from" block off-screen left.
 */
export const CodePushTransition: React.FC<CodePushTransitionProps> = ({
  fromLabel,
  fromCode,
  toLabel,
  toCode,
  transitionStartSec,
  containerWidth = 1400,
  containerHeight = 720,
  transitionDurationSec = 0.9,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = secondsToFrames(Math.max(0, transitionStartSec), fps);

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 90, stiffness: 160, mass: 0.9 },
  });

  const p = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fromX = interpolate(p, [0, 1], [0, -120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toX = interpolate(p, [0, 1], [120, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fromOpacity = interpolate(p, [0, 0.9, 1], [1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const toOpacity = interpolate(p, [0, 0.15, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        maxWidth: containerWidth,
        margin: "0 auto",
        height: containerHeight,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateX(${fromX}%)`,
          opacity: fromOpacity,
        }}
      >
        <CodeBlock label={fromLabel} code={fromCode} startTime={0} height={containerHeight} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: `translateX(${toX}%)`,
          opacity: toOpacity,
        }}
      >
        <CodeBlock label={toLabel} code={toCode} startTime={0} height={containerHeight} />
      </div>
    </div>
  );
};
