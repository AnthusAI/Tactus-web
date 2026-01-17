import * as React from "react";

export interface FuchsiaSquareProps {
  size?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
  className?: string;
}

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
  );
};

export default FuchsiaSquare;

