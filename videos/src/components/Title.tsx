import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface TitleProps {
  text: string;
  subtitle?: string;
}

export const Title: React.FC<TitleProps> = ({ text, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnimation = spring({
    frame,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const subtitleAnimation = spring({
    frame: frame - 10,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        backgroundColor: "#1a1a2e",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: 120,
          fontWeight: "bold",
          margin: 0,
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 50}px)`,
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 48,
            margin: "20px 0 0 0",
            opacity: subtitleAnimation,
            transform: `translateY(${(1 - subtitleAnimation) * 30}px)`,
            color: "#16c79a",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
