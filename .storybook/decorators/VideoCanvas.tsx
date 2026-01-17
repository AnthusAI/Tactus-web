import React from "react";

export interface VideoCanvasProps {
  children: React.ReactNode;
  showGuides?: boolean;
  width?: number;
  height?: number;
}

/**
 * Video Canvas decorator for Storybook stories.
 *
 * Provides a 4K aspect ratio canvas (16:9 - 3840x2160) to simulate how components
 * will appear in video presentations. The canvas maintains the correct aspect ratio
 * and scales to fit the viewport.
 *
 * Guide overlays include:
 * - Action Safe Area (90% - where important action should stay)
 * - Title Safe Area (80% - where text/titles should stay)
 * - Center cross-hairs for composition alignment
 */
export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  children,
  showGuides = true,
  width = 3840,
  height = 2160,
}) => {
  // Calculate guide boundaries as percentages
  const actionSafeMargin = 5; // 90% area (5% margin on each side)
  const titleSafeMargin = 10; // 80% area (10% margin on each side)

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1a1a",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "90vw",
          maxWidth: "90vh * 16 / 9",
          aspectRatio: "16 / 9",
          background: "#fdfdfd", // Light mode background (--color-bg)
          boxShadow: "0 0 40px rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Content */}
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {children}
        </div>

        {/* Guide Overlays */}
        {showGuides && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {/* Action Safe Area (90%) - Yellow */}
            <div
              style={{
                position: "absolute",
                top: `${actionSafeMargin}%`,
                left: `${actionSafeMargin}%`,
                right: `${actionSafeMargin}%`,
                bottom: `${actionSafeMargin}%`,
                border: "2px solid rgba(255, 255, 0, 0.5)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "10px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "rgba(255, 255, 0, 0.8)",
                  textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                Action Safe (90%)
              </div>
            </div>

            {/* Title Safe Area (80%) - Green */}
            <div
              style={{
                position: "absolute",
                top: `${titleSafeMargin}%`,
                left: `${titleSafeMargin}%`,
                right: `${titleSafeMargin}%`,
                bottom: `${titleSafeMargin}%`,
                border: "2px solid rgba(0, 255, 0, 0.5)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  left: "10px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  color: "rgba(0, 255, 0, 0.8)",
                  textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
                }}
              >
                Title Safe (80%)
              </div>
            </div>

            {/* Center Cross-hairs - Blue */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: "1px",
                background: "rgba(0, 150, 255, 0.4)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "rgba(0, 150, 255, 0.4)",
              }}
            />

            {/* Center marker */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "20px",
                height: "20px",
                border: "2px solid rgba(0, 150, 255, 0.6)",
                borderRadius: "50%",
              }}
            />

            {/* Dimension indicators */}
            <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "14px",
                fontFamily: "monospace",
                color: "rgba(255, 255, 255, 0.6)",
                textShadow: "0 0 4px rgba(0, 0, 0, 0.8)",
                textAlign: "right",
              }}
            >
              <div>{width} × {height}</div>
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                4K UHD (16:9)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Storybook decorator function that wraps stories in the VideoCanvas.
 * Only applies when videoCanvas is explicitly enabled in story parameters.
 */
export const withVideoCanvas = (Story: React.ComponentType, context: any) => {
  // Only use VideoCanvas if explicitly enabled
  const enabled = context.parameters?.videoCanvas?.enabled === true;

  if (!enabled) {
    return <Story />;
  }

  const showGuides = context.parameters?.videoCanvas?.showGuides !== false;
  const width = context.parameters?.videoCanvas?.width || 3840;
  const height = context.parameters?.videoCanvas?.height || 2160;

  return (
    <VideoCanvas showGuides={showGuides} width={width} height={height}>
      <Story />
    </VideoCanvas>
  );
};
