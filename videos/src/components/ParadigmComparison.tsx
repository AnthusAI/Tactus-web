import React from "react"
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion"
import { Layout } from "./Layout"
import { Body, H2, TitleBlock } from "./Typography"
import { secondsToFrames } from "@/babulus/utils"
import { colors, fonts } from "../lib/theme"

const animIn = (t: number) =>
  interpolate(t, [0, 0.35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

export type ParadigmComparisonProps = {
  title: string
  oldWay: React.ReactNode
  newWay: React.ReactNode
  sceneStartSec: number
  ttsStartsSec: number[]
}

/**
 * Reusable component showing "Old Way" -> "New Way" push transition.
 * Used in both Intro and Why New Language videos.
 */
export const ParadigmComparison: React.FC<ParadigmComparisonProps> = ({
  title,
  oldWay,
  newWay,
  sceneStartSec,
  ttsStartsSec,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const localSec = frame / fps
  const sceneLocalFrame = frame
  const sceneLocalSec = localSec
  const cueStartsLocal = ttsStartsSec.map(s => s - sceneStartSec)
  const beat1 = cueStartsLocal[0] ?? 0
  const beat2Fallback = cueStartsLocal[cueStartsLocal.length - 1] ?? beat1 + 3

  // We expect the VO to spell out the "new way" as 4 short beats:
  // agent → tool → procedure → guardrails.
  // Use the start of that phrase to trigger the slide-in + build animation.
  const phraseBeatCount = 4
  const phraseStartSec =
    cueStartsLocal.length >= phraseBeatCount
      ? cueStartsLocal[cueStartsLocal.length - phraseBeatCount]
      : beat2Fallback

  // Extend the build time to match the voiceover length (approx first 2 segments)
  // If we have timing info, use the start of the 2nd segment as the end of the build.
  // Otherwise default to 12s as requested.
  const oldWayBuildEnd =
    cueStartsLocal.length >= 2 ? cueStartsLocal[1] - 0.5 : 12

  const phraseLastSec =
    cueStartsLocal[cueStartsLocal.length - 1] ?? phraseStartSec + 1.2
  const phrasePrevSec =
    cueStartsLocal[cueStartsLocal.length - 2] ?? phraseStartSec
  const lastGapSec = Math.max(0.2, phraseLastSec - phrasePrevSec)
  const phraseEndSec = phraseLastSec + Math.min(1.0, Math.max(0.55, lastGapSec))

  const titleSpring = spring({
    frame: sceneLocalFrame,
    fps,
    config: {
      damping: 120,
      stiffness: 200,
      mass: 0.8,
      overshootClamping: true,
    },
  })
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const titleY = interpolate(titleSpring, [0, 1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  // Diagrams should "build in" quickly at scene start, then stay stable.
  // We do this independently of TTS timing so it's always visible.
  const oldWayBuildProgress = interpolate(
    sceneLocalSec,
    [0.15, oldWayBuildEnd],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )

  const newWayBuildProgress = interpolate(
    sceneLocalSec,
    [phraseStartSec, phraseEndSec],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  )

  const withProgress = (node: React.ReactNode, progress: number) => {
    if (!React.isValidElement(node)) return node
    if (typeof node.type === "string") return node
    return React.cloneElement(
      node as React.ReactElement<{ progress?: number }>,
      { progress }
    )
  }

  const startFrame = secondsToFrames(Math.max(0, phraseStartSec), fps)
  const progress = spring({
    frame: sceneLocalFrame - startFrame,
    fps,
    config: { damping: 90, stiffness: 160, mass: 0.9 },
  })

  const p = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const fromOpacity = interpolate(p, [0, 0.15, 1], [1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const toOpacity = interpolate(p, [0, 0.15, 1], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const oldWayRendered = withProgress(oldWay, oldWayBuildProgress)
  const newWayRendered = withProgress(newWay, newWayBuildProgress)

  const colWidth = 520
  const colGap = 120
  const twoColWidth = colWidth * 2 + colGap
  const leftX = -(colWidth / 2 + colGap / 2)
  const rightX = colWidth / 2 + colGap / 2
  const newOffscreenX = rightX + colWidth + colGap

  const oldX = interpolate(p, [0, 1], [0, leftX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })
  const newX = interpolate(p, [0, 1], [newOffscreenX, rightX], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })

  const labelStyle: React.CSSProperties = {
    fontFamily: fonts.sans,
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.05,
    textAlign: "center",
    paddingTop: 22,
    color: colors.text,
  }
  const columnHeight = 610
  const labelBoxHeight = 90

  return (
    <Layout>
      <H2
        style={{
          opacity: titleOpacity,
          transform: `translate3d(0, ${titleY}px, 0)`,
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        <TitleBlock>{title}</TitleBlock>
      </H2>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          opacity: animIn(sceneLocalSec - beat1),
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            height: 720,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: twoColWidth,
              maxWidth: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateX(${oldX}px)`,
                opacity: fromOpacity,
              }}
            >
              <div
                style={{
                  width: colWidth,
                  maxWidth: "100%",
                  height: columnHeight,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: columnHeight - labelBoxHeight,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%" }}>{oldWayRendered}</div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: labelBoxHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={labelStyle}>The Old Way</div>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translateX(${newX}px)`,
                opacity: toOpacity,
              }}
            >
              <div
                style={{
                  width: colWidth,
                  maxWidth: "100%",
                  height: columnHeight,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: columnHeight - labelBoxHeight,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%" }}>{newWayRendered}</div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: labelBoxHeight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ ...labelStyle, color: colors.primary }}>
                    The New Way
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
