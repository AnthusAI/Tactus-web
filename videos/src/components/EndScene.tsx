import React from "react"
import { Img, spring } from "remotion"
import { Layout } from "./Layout"
import { Body, Code, H2, TitleBlock } from "./Typography"
import iconImg from "../assets/images/icon.png"

export type EndSceneProps = {
  frame?: number
  fps?: number
  scene?: { startSec?: number }
}

export const EndScene: React.FC<EndSceneProps> = ({
  frame = 0,
  fps = 24,
  scene,
}) => {
  const sceneStartSec = scene?.startSec ?? 0
  const sceneStartFrame = Math.round(sceneStartSec * fps)
  const sceneFrame = frame - sceneStartFrame

  const animation = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  })

  const iconAnimation = spring({
    frame: sceneFrame - 60,
    fps,
    config: { damping: 100, stiffness: 150, mass: 0.6 },
  })

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
        Visit{" "}
        <Code inline style={{ fontSize: "1em" }}>
          https://tactus.anth.us
        </Code>{" "}
        to learn more
      </Body>

      {iconAnimation > 0 && iconImg ? (
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
      ) : null}
    </Layout>
  )
}
