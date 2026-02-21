import React from "react"
import { spring } from "remotion"
import { Layout } from "./Layout"
import { Body, Code, H2, TitleBlock } from "./Typography"
import { Card } from "./Card"

const HELLO_WORLD_CODE = `agent World = Claude()

procedure Main() {
  return World("Hello, World!").response
}`

const HELLO_WORLD_COMMAND = `tactus run examples/hello-world.tac`
const HELLO_WORLD_OUTPUT = `Hello, I'm World. Nice to meet you!`

const typewriter = (opts: {
  currentFrame: number
  fps: number
  startSeconds: number
  text: string
  charsPerFrame?: number
}) => {
  const { currentFrame, fps, startSeconds, text, charsPerFrame = 3 } = opts
  const startFrame = Math.round(Math.max(0, startSeconds) * fps)
  const charsToShow = Math.min(
    Math.max(0, (currentFrame - startFrame) * charsPerFrame),
    text.length
  )
  const base = text.slice(0, charsToShow)
  const isTyping = charsToShow < text.length
  const showCursor = isTyping && Math.floor(currentFrame / 15) % 2 === 0
  return base + (showCursor ? "|" : "")
}

const animIn = (t: number) => Math.max(0, Math.min(1, t / 0.35))

export type HelloWorldSceneProps = {
  frame?: number
  fps?: number
  scene?: { startSec?: number }
}

export const HelloWorldScene: React.FC<HelloWorldSceneProps> = ({
  frame = 0,
  fps = 24,
  scene,
}) => {
  const sceneStartSec = scene?.startSec ?? 0
  const sceneStartFrame = Math.round(sceneStartSec * fps)
  const sceneFrame = frame - sceneStartFrame
  const localSec = sceneFrame / fps

  const beat1 = 0
  const beat2 = 12
  const beat3 = 27

  const titleAnimation = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  })

  const codeText = typewriter({
    currentFrame: sceneFrame,
    fps,
    startSeconds: beat1,
    text: HELLO_WORLD_CODE,
    charsPerFrame: 3,
  })

  const typeAt = (text: string, startSeconds: number, charsPerSecond: number) => {
    const t = localSec - startSeconds
    if (t <= 0) return ""
    const n = Math.floor(t * charsPerSecond)
    return text.slice(0, Math.max(0, Math.min(text.length, n)))
  }

  const cmdStart = beat2 + 0.3
  const cmdTypeStart = beat2 + 0.55
  const cmdAvailable = Math.max(0.7, beat3 - cmdTypeStart - 0.2)
  const cmdSpeed = Math.min(
    70,
    Math.max(22, HELLO_WORLD_COMMAND.length / cmdAvailable)
  )
  const cmdTyped = typeAt(HELLO_WORLD_COMMAND, cmdTypeStart, cmdSpeed)
  const cmdDone = cmdTyped.length >= HELLO_WORLD_COMMAND.length

  const thinkingStart = Math.max(beat3 + 0.25, cmdTypeStart + 1.1)
  const outputStart = beat3 + 0.7
  const outputTyped = typeAt(HELLO_WORLD_OUTPUT, outputStart, 40)

  return (
    <Layout>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 24,
        }}
      >
        <TitleBlock>Hello, World</TitleBlock>
      </H2>

      <div
        style={{
          width: "100%",
          maxWidth: 1600,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <Card variant="muted" padding={5} style={{ height: 410 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(39, 39, 42, 0.08)",
                border: "1px solid rgba(39, 39, 42, 0.12)",
                pointerEvents: "none",
              }}
            >
              <Code
                inline
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  backgroundColor: "transparent",
                  color: "rgba(39, 39, 42, 0.9)",
                  padding: 0,
                }}
              >
                examples/hello-world.tac
              </Code>
            </div>
            <Code
              style={{
                fontSize: 34,
                lineHeight: 1.2,
                height: 330,
                overflow: "hidden",
                whiteSpace: "pre-wrap",
                paddingRight: 360,
              }}
            >
              {codeText}
            </Code>
          </div>
        </Card>

        <div
          style={{
            width: "100%",
            opacity: animIn(localSec - beat2),
            transform: `translateY(${(1 - animIn(localSec - beat2)) * 14}px)`,
          }}
        >
          <Code
            style={{
              fontSize: 34,
              lineHeight: 1.25,
              height: 260,
              whiteSpace: "pre-wrap",
              backgroundColor: "rgba(39, 39, 42, 0.03)",
              border: "1px solid rgba(39, 39, 42, 0.10)",
              color: "rgba(39, 39, 42, 0.92)",
            }}
          >
            <span style={{ opacity: localSec >= cmdStart ? 1 : 0 }}>$</span>
            <span style={{ opacity: localSec >= cmdTypeStart ? 1 : 0 }}>
              {" "}
              {cmdTyped}
            </span>
            {cmdDone ? "\n" : ""}
            <span style={{ opacity: localSec >= thinkingStart ? 0.65 : 0 }}>
              ...
            </span>
            {outputTyped ? "\n" : ""}
            <span style={{ opacity: localSec >= outputStart ? 1 : 0 }}>
              {outputTyped}
            </span>
          </Code>
        </div>
      </div>
    </Layout>
  )
}

export default HelloWorldScene
