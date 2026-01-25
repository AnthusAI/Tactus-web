import React from "react"
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion"
import { FuchsiaSquare } from "../primitives/FuchsiaSquare"

export interface AnimatedFuchsiaSquareProps {
  size?: number
  minStrokeWidth?: number
  maxStrokeWidth?: number
  durationFrames?: number
  useSpring?: boolean
}

/**
 * Remotion composition for animated fuchsia square.
 * This component uses Remotion hooks and works in BOTH:
 * - Video rendering (via Remotion CLI)
 * - Web embedding (via Remotion Player)
 *
 * The Player component provides the Remotion context (useCurrentFrame, useVideoConfig)
 * so this component works identically in both contexts.
 */
export const AnimatedFuchsiaSquareComposition: React.FC<
  AnimatedFuchsiaSquareProps
> = ({
  size = 200,
  minStrokeWidth = 2,
  maxStrokeWidth = 20,
  durationFrames = 90,
  useSpring: shouldUseSpring = true,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const strokeWidth = React.useMemo(() => {
    if (shouldUseSpring) {
      const animation = spring({
        frame,
        fps,
        config: {
          damping: 100,
          stiffness: 200,
          mass: 0.5,
        },
      })

      return interpolate(animation, [0, 1], [minStrokeWidth, maxStrokeWidth])
    } else {
      return interpolate(
        frame,
        [0, durationFrames / 2, durationFrames],
        [minStrokeWidth, maxStrokeWidth, minStrokeWidth],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    }
  }, [
    frame,
    fps,
    shouldUseSpring,
    minStrokeWidth,
    maxStrokeWidth,
    durationFrames,
  ])

  return <FuchsiaSquare size={size} strokeWidth={strokeWidth} />
}
