import * as React from "react"
import { Player, PlayerRef } from "@remotion/player"
import { CodeBlockComposition } from "../remotion/CodeBlockComposition"

export interface GatsbyAnimatedCodeBlockProps {
  label: string
  code: string
  startTime?: number
  language?: string
  showTypewriter?: boolean
  typewriterDelay?: number
  typewriterSpeed?: number
  typewriterLoop?: boolean // Whether typing should loop (restart after completion)
  typewriterEndDelay?: number // Delay in seconds after typing completes before restarting
  blockHeight?: number
  blockWidth?: number
  width?: number | string
  height?: number | string
  controls?: boolean
  loop?: boolean
  autoPlay?: boolean
  playbackRate?: number
  durationFrames?: number
  className?: string
  style?: React.CSSProperties
  theme?: "light" | "dark"
  filename?: string // Optional filename to show on left
  hint?: string // Optional hint/comment to show on right
  hideTitleBar?: boolean
  autoHeight?: boolean
}

/**
 * Gatsby wrapper for AnimatedCodeBlock using Remotion Player with programmatic control.
 *
 * Playback Control Strategy:
 * - Uses Player ref to control playback imperatively
 * - When typewriterLoop=true: Listens for frame updates, seeks back to 0 when cycle completes
 * - When typewriterLoop=false: Plays once, pauses on final frame showing complete text
 * - Provides full programmatic control over the animation
 */
export const AnimatedCodeBlock: React.FC<GatsbyAnimatedCodeBlockProps> = ({
  label,
  code,
  startTime = 0,
  language = "javascript",
  showTypewriter = true,
  typewriterDelay = 0.5,
  typewriterSpeed = 0.25,
  typewriterLoop = false,
  typewriterEndDelay = 1.0,
  blockHeight = 600,
  blockWidth = 1400,
  width = 1400,
  height = 600,
  controls = false,
  loop = false,
  autoPlay = true,
  playbackRate = 1,
  durationFrames,
  className,
  style,
  theme,
  filename,
  hint,
  hideTitleBar = false,
  autoHeight = false,
}) => {
  const playerRef = React.useRef<PlayerRef>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)

  // Detect system color scheme if theme not explicitly provided
  const [detectedTheme, setDetectedTheme] = React.useState<"light" | "dark">(
    "light"
  )
  const [measuredHeight, setMeasuredHeight] = React.useState<number | null>(
    null
  )
  const [windowWidth, setWindowWidth] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)
      const handleResize = () => setWindowWidth(window.innerWidth)
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  React.useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const updateTheme = () => {
      setDetectedTheme(mediaQuery.matches ? "dark" : "light")
    }

    // Set initial theme
    updateTheme()

    // Listen for changes
    mediaQuery.addEventListener("change", updateTheme)

    return () => {
      mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [])

  // Use explicit theme if provided, otherwise use detected theme
  const activeTheme = theme || detectedTheme

  const fps = 30

  const effectiveBlockWidth = React.useMemo(() => {
    // If on mobile (and the requested block is large), use a smaller composition width
    // to "zoom in" and keep the text readable.
    if (windowWidth !== null && blockWidth > 800) {
      if (windowWidth < 640) {
        return 680
      } else if (windowWidth < 1024) {
        return 960
      }
    }
    return blockWidth
  }, [windowWidth, blockWidth])

  // Measure full-content height (in composition pixels) to avoid cropping on web pages.
  // We render an invisible clone with the full code to "hold the box open" even while
  // the typewriter animation is still typing (or empty).
  React.useLayoutEffect(() => {
    if (!autoHeight) return
    if (typeof window === "undefined") return

    const node = measureRef.current
    if (!node) return

    const h = Math.ceil(node.getBoundingClientRect().height)
    const safe = Math.max(120, h + 2) // +2px avoids subpixel clipping on the last line
    setMeasuredHeight(safe)
  }, [autoHeight, code, hideTitleBar, filename, hint, effectiveBlockWidth])

  // Calculate the frame where typing completes
  const typingCompleteFrame = React.useMemo(() => {
    if (!showTypewriter) return 0

    const baseDelayFrames = Math.ceil(
      Math.max(0, startTime + typewriterDelay) * fps
    )

    let typingFrames = 0
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i)
      const variation = ((charCode * 17) % 100) / 100
      const delayFactor = 0.3 + variation * 2.0
      typingFrames += 1 / (typewriterSpeed * delayFactor)
    }
    typingFrames = Math.ceil(typingFrames)

    return baseDelayFrames + typingFrames
  }, [code, showTypewriter, startTime, typewriterDelay, typewriterSpeed])

  // Calculate full cycle length for looping
  const cycleLength = React.useMemo(() => {
    const endDelayFrames = Math.ceil(typewriterEndDelay * fps)
    return typingCompleteFrame + endDelayFrames
  }, [typingCompleteFrame, typewriterEndDelay, fps])

  // Duration: Always set to cycleLength, we'll control playback manually
  const computedDurationFrames = React.useMemo(() => {
    if (typeof durationFrames === "number") return durationFrames
    if (!showTypewriter) return fps
    return cycleLength
  }, [durationFrames, showTypewriter, fps, cycleLength])

  const effectiveBlockHeight =
    autoHeight && measuredHeight ? measuredHeight : blockHeight

  const rootStyle: React.CSSProperties | undefined = autoHeight
    ? {
        position: "relative",
        width,
        aspectRatio: `${effectiveBlockWidth} / ${effectiveBlockHeight}`,
        ...style,
      }
    : style

  const playerStyle: React.CSSProperties = autoHeight
    ? { width: "100%", height: "100%" }
    : {
        width,
        height,
        ...style,
      }

  // Programmatic playback control
  React.useEffect(() => {
    if (!playerRef.current || !autoPlay) return

    const handleFrame = (frame: number) => {
      if (typewriterLoop && frame >= cycleLength - 1) {
        // Loop: seek back to start
        playerRef.current?.seekTo(0)
        playerRef.current?.play()
      } else if (!typewriterLoop && !loop && frame >= typingCompleteFrame) {
        // Non-loop: pause on the frame showing complete text
        playerRef.current?.pause()
      }
    }

    // Listen to frame updates
    const player = playerRef.current
    player.addEventListener("frameupdate", e => {
      handleFrame((e as CustomEvent).detail.frame)
    })

    return () => {
      // Cleanup not needed as player handles it
    }
  }, [typewriterLoop, cycleLength, typingCompleteFrame, autoPlay, loop])

  if (!autoHeight) {
    return (
      <Player
        ref={playerRef}
        component={CodeBlockComposition}
        inputProps={{
          label,
          code,
          startTime,
          language,
          showTypewriter,
          typewriterDelay,
          typewriterSpeed,
          typewriterLoop: false, // Composition doesn't loop - we control it here
          typewriterEndDelay,
          height: effectiveBlockHeight,
          width: effectiveBlockWidth,
          theme: activeTheme,
          filename,
          hint,
          hideTitleBar,
        }}
        durationInFrames={computedDurationFrames}
        fps={fps}
        compositionWidth={effectiveBlockWidth}
        compositionHeight={effectiveBlockHeight}
        controls={controls}
        loop={!typewriterLoop && loop} // When looping typewriter, we control it programmatically
        autoPlay={autoPlay}
        playbackRate={playbackRate}
        acknowledgeRemotionLicense={true}
        style={playerStyle}
        className={className}
      />
    )
  }

  return (
    <div className={className} style={rootStyle}>
      <div
        style={{
          position: "absolute",
          left: -100000,
          top: 0,
          width: effectiveBlockWidth,
          visibility: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div
          ref={measureRef}
          style={{
            width: effectiveBlockWidth,
            display: "flex",
            flexDirection: "column",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {!hideTitleBar && (
            <div
              style={{
                padding: "16px 24px",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                {filename || label}
              </div>
              {hint && (
                <div
                  style={{
                    fontSize: 14,
                    fontFamily: "sans-serif",
                  }}
                >
                  {hint}
                </div>
              )}
            </div>
          )}
          <div
            style={{
              padding: 24,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <pre
              style={{
                fontSize: 24,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
                margin: 0,
                border: "none",
              }}
            >
              {code}
            </pre>
          </div>
        </div>
      </div>

      <Player
        ref={playerRef}
        component={CodeBlockComposition}
        inputProps={{
          label,
          code,
          startTime,
          language,
          showTypewriter,
          typewriterDelay,
          typewriterSpeed,
          typewriterLoop: false, // Composition doesn't loop - we control it here
          typewriterEndDelay,
          height: effectiveBlockHeight,
          width: effectiveBlockWidth,
          theme: activeTheme,
          filename,
          hint,
          hideTitleBar,
        }}
        durationInFrames={computedDurationFrames}
        fps={fps}
        compositionWidth={effectiveBlockWidth}
        compositionHeight={effectiveBlockHeight}
        controls={controls}
        loop={!typewriterLoop && loop} // When looping typewriter, we control it programmatically
        autoPlay={autoPlay}
        playbackRate={playbackRate}
        acknowledgeRemotionLicense={true}
        style={playerStyle}
      />
    </div>
  )
}

export default AnimatedCodeBlock
