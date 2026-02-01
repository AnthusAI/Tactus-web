import React from "react"
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "../babulus-api"
import { CodeBlock } from "./CodeBlock"

// Utility function: convert seconds to frame number
const secondsToFrames = (seconds: number, fps: number): number => Math.round(seconds * fps);

export type CodePushTransitionProps = {
  fromLabel: string
  fromCode: string
  toLabel: string
  toCode: string
  transitionStartSec: number
  containerWidth?: number
  containerHeight?: number
  transitionDurationSec?: number
  x?: number
  y?: number
  sceneStartSec?: number
}

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
  x = 960,
  y = 540,
  sceneStartSec = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps, width: videoWidth } = useVideoConfig()

  const absoluteTransitionSec = sceneStartSec + transitionStartSec
  const startFrame = secondsToFrames(Math.max(0, absoluteTransitionSec), fps)

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 90, stiffness: 160, mass: 0.9 },
  })

  const p = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const gap = 120
  const sidePadding = 140
  const maxTotalWidth = Math.max(0, videoWidth - sidePadding * 2 - gap)
  const blockWidth = Math.min(containerWidth, maxTotalWidth / 2)
  const blockHeight = containerHeight
  const baseLeft = Math.max(sidePadding, (videoWidth - (blockWidth * 2 + gap)) / 2)

  const slideOffset = interpolate(p, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const fromOpacity = interpolate(p, [0, 0.9, 1], [1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const toOpacity = interpolate(p, [0, 0.15, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y - blockHeight / 2,
        width: videoWidth,
        height: blockHeight,
        overflow: "visible",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: baseLeft,
            width: blockWidth,
            height: blockHeight,
            opacity: fromOpacity,
            zIndex: 1,
          }}
        >
          <CodeBlock
            label={fromLabel}
            code={fromCode}
            startTime={0}
            showTypewriter={false}
            height={containerHeight}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: interpolate(
              slideOffset,
              [0, 1],
              [videoWidth + gap, baseLeft + blockWidth + gap],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            ),
            width: blockWidth,
            height: blockHeight,
            opacity: toOpacity,
            zIndex: 2,
          }}
        >
          <CodeBlock
            label={toLabel}
            code={toCode}
            startTime={0}
            showTypewriter={false}
            height={containerHeight}
          />
        </div>
      </div>
    </div>
  )
}
