import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Layout } from "./Layout";
import { H2, TitleBlock } from "./Typography";
import { secondsToFrames } from "@/babulus/utils";
import { CodePushTransition } from "./CodePushTransition";

const animIn = (t: number) =>
  interpolate(t, [0, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export type ParadigmComparisonProps = {
  title: string;
  oldWayCode: string;
  newWayCode: string;
  sceneStartSec: number;
  ttsStartsSec: number[];
};

/**
 * Reusable component showing "Old Way" -> "New Way" push transition.
 * Used in both Intro and Why New Language videos.
 */
export const ParadigmComparison: React.FC<ParadigmComparisonProps> = ({
  title,
  oldWayCode,
  newWayCode,
  sceneStartSec,
  ttsStartsSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - sceneStartSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[cueStartsLocal.length - 1] ?? beat1 + 3;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 32,
          textAlign: "center",
        }}
      >
        <TitleBlock>{title}</TitleBlock>
      </H2>

      <div style={{ width: "100%", display: "flex", justifyContent: "center", opacity: animIn(localSec - beat1) }}>
        <CodePushTransition
          fromLabel="The Old Way"
          fromCode={oldWayCode}
          toLabel="The New Way"
          toCode={newWayCode}
          transitionStartSec={beat2}
          containerWidth={1400}
          containerHeight={720}
        />
      </div>
    </Layout>
  );
};
