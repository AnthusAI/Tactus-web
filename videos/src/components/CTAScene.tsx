import React from "react";
import { Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Layout } from "./Layout";
import { Body, Code, H2, TitleBlock } from "./Typography";
import iconImg from "../assets/images/icon.png";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const iconAnimation = spring({
    frame: frame - 60,
    fps,
    config: { damping: 100, stiffness: 150, mass: 0.6 },
  });

  return (
    <Layout justify="space-evenly">
      <H2
        style={{
          opacity: animation,
          transform: `scale(${0.9 + animation * 0.1})`,
        }}
      >
        <TitleBlock>Get Started</TitleBlock>
      </H2>

      <Body
        size="lg"
        style={{
          opacity: animation,
          textAlign: "center",
        }}
      >
        Visit <Code inline style={{ fontSize: "1em" }}>https://tactus.anth.us</Code> to learn more
      </Body>

      {iconAnimation > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={iconImg}
            style={{
              width: 210,
              opacity: iconAnimation,
              transform: `scale(${iconAnimation})`,
            }}
          />
        </div>
      )}
    </Layout>
  );
};
