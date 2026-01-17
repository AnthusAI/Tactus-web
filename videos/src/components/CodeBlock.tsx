import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Card } from "./Card";
import { Body, Code } from "./Typography";
import { secondsToFrames } from "@/babulus/utils";

export type CodeBlockProps = {
  label: string;
  code: string;
  startTime: number;
  language?: string;
  showTypewriter?: boolean;
  typewriterDelay?: number;
  typewriterSpeed?: number;
  height?: number;
};

/**
 * Reusable component for displaying code blocks with optional typewriter animation.
 * The block maintains a fixed height regardless of content length.
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  label,
  code,
  startTime,
  showTypewriter = false,
  typewriterDelay = 0.5,
  typewriterSpeed = 0.8,
  height = 600,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typewriter effect
  const typewriterText = React.useMemo(() => {
    if (!showTypewriter) return code;

    const startFrame = secondsToFrames(Math.max(0, startTime + typewriterDelay), fps);
    const charsToShow = Math.min(Math.max(0, (frame - startFrame) * typewriterSpeed), code.length);
    const base = code.slice(0, charsToShow);
    const isTyping = charsToShow < code.length;
    const showCursor = isTyping && Math.floor(frame / 15) % 2 === 0;
    return base + (showCursor ? "|" : "");
  }, [frame, fps, code, startTime, typewriterDelay, typewriterSpeed, showTypewriter]);

  return (
    <Card variant="muted" padding={5} style={{ height, width: "100%" }}>
      <Body style={{ fontSize: 28, fontWeight: 900, marginBottom: 16 }}>
        {label}
      </Body>
      <Code style={{ fontSize: 24, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
        {typewriterText}
      </Code>
    </Card>
  );
};

export type CodeSequenceItem = {
  label: string;
  code: string;
  startTime: number;
};

export type CodeSequenceProps = {
  items: CodeSequenceItem[];
  endTime?: number;
  containerWidth?: number;
  containerHeight?: number;
  enableTypewriter?: boolean;
};

/**
 * Displays a sequence of code blocks that slide in one after another.
 * Each block fully replaces the previous one with a slide animation.
 */
export const CodeSequence: React.FC<CodeSequenceProps> = ({
  items,
  endTime,
  containerWidth = 1400,
  containerHeight = 600,
  enableTypewriter = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;

  // Determine which code block is currently active
  const activeIndex = items.findIndex((item, i) => {
    const nextStart = items[i + 1]?.startTime ?? (endTime ?? Infinity);
    return localSec >= item.startTime && localSec < nextStart;
  });

  return (
    <div style={{ width: "100%", maxWidth: containerWidth, position: "relative", height: containerHeight }}>
      {items.map((item, i) => {
        const isActive = activeIndex === i;
        const isPast = activeIndex > i;
        const isFuture = activeIndex < i;

        // Slide animation
        const slideProgress = spring({
          frame: frame - secondsToFrames(item.startTime, fps),
          fps,
          config: { damping: 100, stiffness: 180, mass: 0.8 },
        });

        // Calculate position and opacity
        let translateX = 0;
        let opacity = 0;

        if (isFuture) {
          translateX = 100; // Off-screen right
          opacity = 0;
        } else if (isPast) {
          translateX = -100; // Off-screen left
          opacity = 0;
        } else if (isActive) {
          translateX = interpolate(slideProgress, [0, 1], [100, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          opacity = slideProgress; // Fade in as it slides
        }

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              opacity,
              transform: `translateX(${translateX}%)`,
            }}
          >
            <CodeBlock
              label={item.label}
              code={item.code}
              startTime={item.startTime}
              showTypewriter={isActive && enableTypewriter}
              height={containerHeight}
            />
          </div>
        );
      })}
    </div>
  );
};
