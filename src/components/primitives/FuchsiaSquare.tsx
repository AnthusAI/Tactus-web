import * as React from "react"

export interface FuchsiaSquareProps {
  /**
   * Size of the square in pixels
   */
  size?: number

  /**
   * Stroke width in pixels
   */
  strokeWidth?: number

  /**
   * Additional CSS properties for the container
   */
  style?: React.CSSProperties

  /**
   * Optional className for the container
   */
  className?: string
}

/**
 * A pure presentational component that renders a fuchsia square with a stroke.
 * This component is shared between the Gatsby website and Remotion videos.
 *
 * Animation is handled by wrapper components:
 * - For Gatsby: Use AnimatedFuchsiaSquare with Framer Motion
 * - For Remotion: Use AnimatedFuchsiaSquare with spring/interpolate
 */
export const FuchsiaSquare: React.FC<FuchsiaSquareProps> = ({
  size = 200,
  strokeWidth = 4,
  style = {},
  className = "",
}) => {
  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        ...style,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={size - strokeWidth}
          height={size - strokeWidth}
          fill="none"
          stroke="#c7007e"
          strokeWidth={strokeWidth}
          rx={8}
        />
      </svg>
    </div>
  )
}

export default FuchsiaSquare
