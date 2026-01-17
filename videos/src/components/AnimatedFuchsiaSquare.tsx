import React from "react"
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion"
import { FuchsiaSquare, FuchsiaSquareProps } from "./primitives/FuchsiaSquare"

export interface AnimatedFuchsiaSquareProps extends Omit<FuchsiaSquareProps, "strokeWidth"> {
  /**
   * Minimum stroke width
   * @default 2
   */
  minStrokeWidth?: number

  /**
   * Maximum stroke width
   * @default 20
   */
  maxStrokeWidth?: number

  /**
   * Frame at which animation starts
   * @default 0
   */
  startFrame?: number

  /**
   * Animation duration in frames (if not using spring)
   * @default 60
   */
  durationFrames?: number

  /**
   * Whether to use spring animation (true) or linear interpolation (false)
   * @default true
   */
  useSpring?: boolean
}

/**
 * Animated version of FuchsiaSquare for use in Remotion videos.
 * Uses Remotion's spring() and interpolate() for frame-based animations.
 *
 * The stroke width animates between min and max values based on the current frame.
 */
export const AnimatedFuchsiaSquare: React.FC<AnimatedFuchsiaSquareProps> = ({
  minStrokeWidth = 2,
  maxStrokeWidth = 20,
  startFrame = 0,
  durationFrames = 60,
  useSpring: shouldUseSpring = true,
  size = 200,
  ...props
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Calculate stroke width based on animation type
  const strokeWidth = React.useMemo(() => {
    const relativeFrame = frame - startFrame

    if (relativeFrame < 0) {
      return minStrokeWidth
    }

    if (shouldUseSpring) {
      // Use spring animation for smooth, natural motion
      const animation = spring({
        frame: relativeFrame,
        fps,
        config: {
          damping: 100,
          stiffness: 200,
          mass: 0.5,
        },
      })

      return interpolate(
        animation,
        [0, 1],
        [minStrokeWidth, maxStrokeWidth]
      )
    } else {
      // Use linear interpolation for predictable timing
      return interpolate(
        relativeFrame,
        [0, durationFrames / 2, durationFrames],
        [minStrokeWidth, maxStrokeWidth, minStrokeWidth],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    }
  }, [frame, startFrame, fps, shouldUseSpring, minStrokeWidth, maxStrokeWidth, durationFrames])

  return <FuchsiaSquare size={size} strokeWidth={strokeWidth} {...props} />
}

export default AnimatedFuchsiaSquare
