import * as React from "react"
import { Player } from "@remotion/player"
import { AnimatedFuchsiaSquareComposition } from "../remotion/AnimatedFuchsiaSquareComposition"

export interface GatsbyAnimatedFuchsiaSquareProps {
  size?: number
  minStrokeWidth?: number
  maxStrokeWidth?: number
  durationFrames?: number
  useSpring?: boolean
  width?: number | string
  height?: number | string
  controls?: boolean
  loop?: boolean
  autoPlay?: boolean
  playbackRate?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Gatsby wrapper for AnimatedFuchsiaSquare using Remotion Player.
 *
 * This follows the official Remotion pattern:
 * 1. Import the composition component directly (no lazy loading)
 * 2. Pass it to Player component
 * 3. Player provides Remotion context (useCurrentFrame, useVideoConfig)
 * 4. Works in SSR/hydration naturally
 */
export const AnimatedFuchsiaSquare: React.FC<
  GatsbyAnimatedFuchsiaSquareProps
> = ({
  size = 200,
  minStrokeWidth = 2,
  maxStrokeWidth = 20,
  durationFrames = 90,
  useSpring = true,
  width = 200,
  height = 200,
  controls = false,
  loop = true,
  autoPlay = true,
  playbackRate = 1,
  className,
  style,
}) => {
  return (
    <Player
      component={AnimatedFuchsiaSquareComposition}
      inputProps={{
        size,
        minStrokeWidth,
        maxStrokeWidth,
        durationFrames,
        useSpring,
      }}
      durationInFrames={durationFrames}
      fps={30}
      compositionWidth={size}
      compositionHeight={size}
      controls={controls}
      loop={loop}
      autoPlay={autoPlay}
      playbackRate={playbackRate}
      acknowledgeRemotionLicense={true}
      style={{
        width,
        height,
        ...style,
      }}
      className={className}
    />
  )
}

export default AnimatedFuchsiaSquare
