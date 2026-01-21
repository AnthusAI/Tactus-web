import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

/**
 * Helper to convert seconds to frames
 */
const secondsToFrames = (seconds: number, fps: number): number => {
  return Math.round(seconds * fps);
};

export type CodeBlockCompositionProps = {
  label: string;
  code: string;
  startTime: number;
  language?: string;
  showTypewriter?: boolean;
  typewriterDelay?: number;
  typewriterSpeed?: number;
  typewriterLoop?: boolean;     // Whether typing should loop (erase and retype)
  typewriterEndDelay?: number;  // Delay in seconds after typing completes before restarting
  height?: number;
  width?: number;
  theme?: 'light' | 'dark';
  filename?: string;  // Optional filename to show on left (e.g., "hello_world.tac")
  hint?: string;      // Optional hint/comment to show on right (e.g., "Agent")
  hideTitleBar?: boolean;
};

/**
 * Remotion composition for displaying code blocks with optional typewriter animation.
 *
 * This component uses Remotion hooks and works identically in:
 * - Video rendering (via Remotion CLI)
 * - Web embedding (via Remotion Player)
 * - Storybook stories (via Remotion Player in decorators)
 *
 * The typewriter effect displays characters progressively based on frame timing,
 * with a blinking cursor during typing.
 *
 * Looping Logic:
 * When typewriterLoop is true, the composition uses modulo arithmetic to cycle:
 * - Types all characters (variable delays for realism)
 * - Shows complete text for typewriterEndDelay seconds
 * - Wraps currentFrame back to 0 using modulo operator
 * - Restarts typing seamlessly
 * This is entirely self-contained - the Player never loops (always loop=false).
 *
 * Color System:
 * These colors mirror the CSS custom properties defined in src/components/layout.css.
 * Since Remotion compositions can't access CSS variables directly (they render in Node.js),
 * we duplicate the values here with clear documentation of their source.
 */
export const CodeBlockComposition: React.FC<CodeBlockCompositionProps> = ({
  label,
  code,
  startTime,
  language = "javascript",
  showTypewriter = false,
  typewriterDelay = 0.5,
  typewriterSpeed = 0.25,  // Slower default: 0.25 chars per frame (about 7.5 chars/sec at 30fps)
  typewriterLoop = false,
  typewriterEndDelay = 1.0,  // Default 1 second pause after typing completes
  height = 600,
  width = 1400,
  theme = 'light',
  filename,
  hint,
  hideTitleBar = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Theme colors mirroring layout.css CSS custom properties
  const colors = theme === 'dark' ? {
    bg: '#27272a',                    // --color-code-bg (dark) = --color-surface-2
    text: '#e4e4e7',                  // --color-code (dark)
    titleBarBg: '#1f1f23',            // --color-card-title (dark) - 8 units from bg
    titleText: '#d4d4d8',             // --color-text-secondary (dark)
  } : {
    bg: '#ededed',                    // --color-code-bg (light) = --color-surface-2 (237)
    text: '#27272a',                  // --color-code (light) = --color-text
    titleBarBg: '#f5f5f5',            // --color-card-title (light) - 8 units from surface-2 (245)
    titleText: '#3f3f46',             // --color-text-secondary (light)
  };

  // Typewriter effect with variable keystroke delays for realistic typing
  const typewriterText = React.useMemo(() => {
    if (!showTypewriter) return code;

    const startFrame = secondsToFrames(Math.max(0, startTime + typewriterDelay), fps);

    // Calculate total frames needed for typing
    let totalTypingFrames = 0;
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const variation = ((charCode * 17) % 100) / 100;
      const delayFactor = 0.3 + (variation * 2.0);
      totalTypingFrames += 1 / (typewriterSpeed * delayFactor);
    }

    const endDelayFrames = secondsToFrames(typewriterEndDelay, fps);
    const cycleLength = totalTypingFrames + endDelayFrames;

    // Current position in the animation
    let currentFrame = frame - startFrame;

    // If before animation starts, show empty
    if (currentFrame < 0) {
      return "";
    }

    // Apply looping if enabled (wrap around after one complete cycle)
    if (typewriterLoop && currentFrame >= cycleLength) {
      currentFrame = currentFrame % cycleLength;
    }

    // If not looping and past the typing phase, always show full code
    if (!typewriterLoop && currentFrame >= totalTypingFrames) {
      return code;
    }

    // If in the end delay period (after typing completes), show full code
    if (currentFrame >= totalTypingFrames) {
      return code;
    }

    // Calculate character position with variable delays
    let charIndex = 0;
    let frameCounter = currentFrame;

    while (charIndex < code.length && frameCounter > 0) {
      // Variable delay: extreme variation for natural human rhythm with pauses
      const charCode = code.charCodeAt(charIndex);
      const variation = ((charCode * 17) % 100) / 100;
      const delayFactor = 0.3 + (variation * 2.0);
      const framesPerChar = 1 / (typewriterSpeed * delayFactor);

      frameCounter -= framesPerChar;
      charIndex++;
    }

    const charsToShow = Math.max(0, Math.min(charIndex, code.length));
    const base = code.slice(0, charsToShow);
    const isTyping = charsToShow < code.length;
    const showCursor = isTyping && Math.floor(frame / 15) % 2 === 0;
    return base + (showCursor ? "|" : "");
  }, [frame, fps, code, startTime, typewriterDelay, typewriterSpeed, typewriterLoop, typewriterEndDelay, showTypewriter]);

  return (
    <div
      style={{
        width: width,
        height: height,
        display: "flex",
        flexDirection: "column",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Title Bar */}
      {!hideTitleBar && (
        <div
          style={{
            background: colors.titleBarBg,
            padding: '16px 24px',
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Filename (or label if no filename) */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              fontFamily: "monospace",
              color: colors.titleText,
            }}
          >
            {filename || label}
          </div>

          {/* Right: Hint (muted comment) */}
          {hint && (
            <div
              style={{
                fontSize: 14,
                fontFamily: "sans-serif",
                color: theme === 'dark' ? '#a1a1aa' : '#52525b', // --color-text-muted
              }}
            >
              {hint}
            </div>
          )}
        </div>
      )}
      {/* Code Block */}
      <div
        style={{
          flex: 1,
          background: colors.bg,
          padding: 24,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <pre
          style={{
            fontSize: 24,
            lineHeight: 1.4,
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            color: colors.text,
            margin: 0,
            flex: 1,
            overflow: "hidden",
            border: "none",
          }}
        >
          {typewriterText}
        </pre>
      </div>
    </div>
  );
};
