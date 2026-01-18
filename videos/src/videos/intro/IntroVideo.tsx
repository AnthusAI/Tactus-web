import React from "react";
import {
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { GlobalStyles } from "../../components/GlobalStyles";
import { Layout } from "../../components/Layout";
import { Body, Code, H2, TitleBlock } from "../../components/Typography";
import { Card } from "../../components/Card";
import { ParadigmComparison } from "../../components/ParadigmComparison";
import OldWayFlowchartDiagram from "../../components/diagrams/OldWayFlowchartDiagram";
import AgentGuardrailsDiagram from "../../components/diagrams/AgentGuardrailsDiagram";
import monkeyImg from "../../assets/images/monkey.png";
import coverAnimalImg from "../../assets/images/cover-animal.png";
import nutshellCoverAnimalImg from "../../assets/images/nutshell-cover-animal.png";
import iconImg from "../../assets/images/icon.png";
import type { Scene, Script } from "@/babulus/types";
import { secondsToFrames } from "@/babulus/utils";
import introScript from "@/videos/intro/intro.script.json";
import { AudioTimelineLayer } from "@/babulus/AudioTimeline";
import introTimeline from "./intro.timeline.json";
import type { GeneratedTimeline } from "@/babulus/audioTypes";

const OLD_WAY_CODE = `def import_contact(row):
    email = (
        row.get("email")
        or row.get("e-mail")
        or row.get("correo")
    )
    if not email:
        raise ValueError("Missing email")

    name = row.get("name") or ""
    if "," in name:
        last, first = name.split(",", 1)
    else:
        first = row.get("First Name")
        last = row.get("Last Name")
    if not (first and last):
        raise ValueError("Missing name")

    return create_contact(first, last, email)`;

const NEW_WAY_BULLETS = [
  "Give an agent a tool",
  "Give it a procedure to follow",
  "Put guardrails around it",
];

const NEW_WAY_CODE = NEW_WAY_BULLETS.map((b) => `• ${b}`).join("\n");

const HELLO_WORLD_CODE = `World = Agent {
    provider = "openai",
    model = "gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").response`;

const HELLO_WORLD_COMMAND = `tactus run examples/hello-world.tac`;
const HELLO_WORLD_OUTPUT = `Hello, I'm World. Nice to meet you!`;

export type IntroVideoProps = {
  audioSrc?: string | null;
  script?: Script;
  timeline?: GeneratedTimeline | null;
};

const animIn = (t: number) =>
  interpolate(t, [0, 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const typewriter = (opts: {
  frame: number;
  fps: number;
  startSeconds: number;
  text: string;
  charsPerFrame?: number;
}) => {
  const { frame, fps, startSeconds, text, charsPerFrame = 3 } = opts;
  const startFrame = secondsToFrames(Math.max(0, startSeconds), fps);
  const charsToShow = Math.min(Math.max(0, (frame - startFrame) * charsPerFrame), text.length);
  const base = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length;
  const showCursor = isTyping && Math.floor(frame / 15) % 2 === 0;
  return base + (showCursor ? "|" : "");
};

export const IntroVideo: React.FC<IntroVideoProps> = ({
  audioSrc = null,
  script = introScript as Script,
  timeline = introTimeline as GeneratedTimeline,
}) => {
  const { fps } = useVideoConfig();

  type CueTimelineSegment = { type: string; startSec: number };
  type CueTimelineItem = {
    type: string;
    sceneId?: string;
    cueId?: string;
    segments?: CueTimelineSegment[];
  };

  const isCueTimelineSegment = (v: unknown): v is CueTimelineSegment => {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    return typeof o.type === "string" && typeof o.startSec === "number";
  };

  const isCueTimelineItem = (v: unknown): v is CueTimelineItem => {
    if (!v || typeof v !== "object") return false;
    const o = v as Record<string, unknown>;
    if (typeof o.type !== "string") return false;
    if (o.sceneId != null && typeof o.sceneId !== "string") return false;
    if (o.cueId != null && typeof o.cueId !== "string") return false;
    if (o.segments != null) {
      if (!Array.isArray(o.segments)) return false;
      if (!(o.segments as unknown[]).every(isCueTimelineSegment)) return false;
    }
    return true;
  };

  const getCueTtsStarts = (sceneId: string, cueId: string): number[] => {
    const unknownItems: unknown = (timeline as unknown as { items?: unknown }).items;
    const items = Array.isArray(unknownItems) ? unknownItems.filter(isCueTimelineItem) : [];
    const cueItem = items.find((it) => it.type === "tts" && it.sceneId === sceneId && it.cueId === cueId);
    const segs = cueItem?.segments ?? [];
    return segs.filter((s) => s.type === "tts").map((s) => s.startSec);
  };

  const renderScene = (scene: Scene) => {
    switch (scene.id) {
      case "paradigm":
        return <ParadigmScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "paradigm")} />;
      case "hello_world":
        return <HelloWorldScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "hello_world")} />;
      case "tools":
        return <ToolsScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "tools")} />;
      case "security":
        return <SecurityScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "security")} />;
      case "guardrails":
        return <GuardrailsScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "guardrails")} />;
      case "hitl":
        return <HitlScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "hitl")} />;
      case "graphs":
        return <GraphsScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "graphs")} />;
      case "nutshell":
        return <NutshellScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "nutshell")} />;
      case "cta":
        return <CTAScene />;
      default:
        return null;
    }
  };

  return (
    <GlobalStyles>
      {audioSrc ? <Audio src={staticFile(audioSrc)} /> : null}
      {timeline ? <AudioTimelineLayer timeline={timeline} /> : null}
      {script.scenes.map((scene) => {
        const from = secondsToFrames(scene.startSec, fps);
        const to = secondsToFrames(scene.endSec, fps);
        return (
          <Sequence key={scene.id} from={from} durationInFrames={to - from}>
            {renderScene(scene)}
          </Sequence>
        );
      })}
    </GlobalStyles>
  );
};

const ParadigmScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  return (
    <ParadigmComparison
      title="A New Kind of Computer Program"
      oldWay={<OldWayFlowchartDiagram theme="light" progress={1} />}
      newWay={<AgentGuardrailsDiagram theme="light" progress={1} />}
      sceneStartSec={scene.startSec}
      ttsStartsSec={ttsStartsSec}
    />
  );
};

const HelloWorldScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 3;
  const beat3 = cueStartsLocal[2] ?? beat2 + 3;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const codeText = typewriter({
    frame,
    fps,
    startSeconds: beat1,
    text: HELLO_WORLD_CODE,
    charsPerFrame: 3,
  });

  const typeAt = (text: string, startSeconds: number, charsPerSecond: number) => {
    const t = localSec - startSeconds;
    if (t <= 0) return "";
    const n = Math.floor(t * charsPerSecond);
    return text.slice(0, Math.max(0, Math.min(text.length, n)));
  };

  const cmdStart = beat2 + 0.3;
  const cmdTypeStart = beat2 + 0.55;
  const cmdAvailable = Math.max(0.7, beat3 - cmdTypeStart - 0.2);
  const cmdSpeed = Math.min(70, Math.max(22, HELLO_WORLD_COMMAND.length / cmdAvailable));
  const cmdTyped = typeAt(HELLO_WORLD_COMMAND, cmdTypeStart, cmdSpeed);
  const cmdDone = cmdTyped.length >= HELLO_WORLD_COMMAND.length;

  const thinkingStart = Math.max(beat3 + 0.25, cmdTypeStart + 1.1);
  const outputStart = beat3 + 0.7;
  const outputTyped = typeAt(HELLO_WORLD_OUTPUT, outputStart, 40);

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

      <div style={{ width: "100%", maxWidth: 1600, display: "flex", flexDirection: "column", gap: 24 }}>
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
            <span style={{ opacity: localSec >= cmdTypeStart ? 1 : 0 }}> {cmdTyped}</span>
            {cmdDone ? "\n" : ""}
            <span style={{ opacity: localSec >= thinkingStart ? 0.65 : 0 }}>...</span>
            {outputTyped ? "\n" : ""}
            <span style={{ opacity: localSec >= outputStart ? 1 : 0 }}>{outputTyped}</span>
          </Code>
        </div>
      </div>
    </Layout>
  );
};

const ToolsScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 2;
  const beat3 = cueStartsLocal[2] ?? beat2 + 2;
  const beat4 = cueStartsLocal[3] ?? beat3 + 2;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const rows = [
    {
      label: "Pure Tactus (stdlib + dependencies)",
      code: `local done = require("tactus.tools.done")
worker = Agent {provider = "openai", tools = {done}}`,
      beat: beat1,
    },
    {
      label: "Shell commands (bash tools)",
      code: `local shell = Tool.get("shell")
shell({command = "git status"})`,
      beat: beat2,
    },
    {
      label: "MCP tools (local or remote)",
      code: `local web_search = Tool.get("web_search")
web_search({query = "tactus"})`,
      beat: beat3,
    },
  ];

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 28,
        }}
      >
        <TitleBlock>Tools Everywhere</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1600, display: "flex", flexDirection: "column", gap: 22 }}>
        {rows.map((row) => (
          <Card
            key={row.label}
            variant="muted"
            padding={5}
            style={{
              opacity: animIn(localSec - row.beat),
              transform: `translateY(${(1 - animIn(localSec - row.beat)) * 14}px)`,
            }}
          >
            <Body style={{ marginBottom: 10, fontSize: 28, fontWeight: 800 }}>{row.label}</Body>
            <Code style={{ fontSize: 30, lineHeight: 1.25, whiteSpace: "pre-wrap" }}>{row.code}</Code>
          </Card>
        ))}

        <Body
          size="lg"
          style={{
            marginTop: 6,
            opacity: animIn(localSec - beat4),
            transform: `translateY(${(1 - animIn(localSec - beat4)) * 12}px)`,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          It stays simple and visible—and if a tool is untrusted, you can run it in a container.
        </Body>
      </div>
    </Layout>
  );
};

const SecurityScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 2.5;
  const beat3 = cueStartsLocal[2] ?? beat2 + 2.5;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const bodyAnimation = spring({
    frame: frame - secondsToFrames(Math.max(0, beat1), fps),
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const monkeyAnimation = spring({
    frame: frame - secondsToFrames(Math.max(0, beat2), fps),
    fps,
    config: { damping: 100, stiffness: 120, mass: 0.8 },
  });

  return (
    <Layout>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <TitleBlock>Tools Are Sharp</TitleBlock>
      </H2>

      <div
        style={{
          width: "100%",
          maxWidth: 1700,
          display: "flex",
          gap: 70,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: 1.2, maxWidth: 900 }}>
          <Body
            size="xl"
            style={{
              opacity: bodyAnimation,
              transform: `translateX(${(1 - bodyAnimation) * -30}px)`,
              textAlign: "left",
              lineHeight: 1.35,
              marginBottom: 20,
            }}
          >
            <span style={{ opacity: animIn(localSec - beat1) }}>
              Tool-using agents are <span style={{ fontWeight: 800 }}>useful</span>—and{" "}
              <span style={{ fontWeight: 800 }}>dangerous</span>. Run them{" "}
              <span style={{ fontWeight: 800 }}>unattended</span> and you're giving a{" "}
              <span style={{ fontWeight: 800 }}>monkey</span> a{" "}
              <span style={{ fontWeight: 800 }}>razor blade</span> and hoping for the best.
            </span>{" "}
            <span style={{ opacity: animIn(localSec - beat3) }}>
              Without strong guardrails, you can turn your laptop—or your cloud account—into a{" "}
              <span style={{ fontWeight: 900, color: "#c7007e" }}>crime scene</span>.
            </span>
          </Body>
        </div>

        <div style={{ flex: 0.8, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Img
            src={monkeyImg}
            style={{
              width: 600,
              opacity: monkeyAnimation,
              transform: `translateX(${(1 - monkeyAnimation) * 200}px)`,
              marginBottom: 24,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Body
              size="md"
              weight={700}
              style={{
                opacity: monkeyAnimation,
                transform: `translateX(${(1 - monkeyAnimation) * 200}px)`,
                color: "#c7007e",
                textAlign: "center",
                fontFamily: '"Source Sans 3", sans-serif',
                margin: 0,
                fontSize: 32,
              }}
            >
              Tools are sharp.
            </Body>
            <Body
              size="md"
              weight={700}
              style={{
                opacity: monkeyAnimation,
                transform: `translateX(${(1 - monkeyAnimation) * 200}px)`,
                color: "#c7007e",
                textAlign: "center",
                fontFamily: '"Source Sans 3", sans-serif',
                margin: 0,
                fontSize: 32,
              }}
            >
              Guardrails are not optional.
            </Body>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const GuardrailsScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 3;
  const beat3 = cueStartsLocal[2] ?? beat2 + 3;
  const beat4 = cueStartsLocal[3] ?? beat3 + 3;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const diagramAnimation = spring({
    frame: frame - 12,
    fps,
    config: { damping: 90, stiffness: 160, mass: 0.7 },
  });

  const panelStyle: React.CSSProperties = {
    border: "2px solid rgba(39, 39, 42, 0.18)",
    borderRadius: 28,
    padding: 28,
    background: "rgba(253, 253, 253, 0.8)",
  };

  const panelTitleStyle: React.CSSProperties = {
    fontFamily: '"Source Sans 3", sans-serif',
    fontWeight: 900,
    letterSpacing: "-0.02em",
    fontSize: 30,
    marginBottom: 12,
  };

  const layerBox = (opts: {
    title: string;
    subtitle: string;
    borderColor: string;
    background: string;
    padding: number;
    opacity: number;
    children?: React.ReactNode;
  }) => {
    const { title, subtitle, borderColor, background, padding, opacity, children } = opts;
    return (
      <div
        style={{
          border: `6px solid ${borderColor}`,
          borderRadius: 28,
          padding,
          background,
          opacity,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
          <Body style={{ marginBottom: 0, fontSize: 28, fontWeight: 900 }}>{title}</Body>
          <Body style={{ marginBottom: 0, fontSize: 22, opacity: 0.75, fontWeight: 700 }}>{subtitle}</Body>
        </div>
        {children ? <div style={{ marginTop: 16 }}>{children}</div> : null}
      </div>
    );
  };

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 40,
        }}
      >
        <TitleBlock>Sandboxed and Contained</TitleBlock>
      </H2>

      <div
        style={{
          opacity: diagramAnimation,
          transform: `translateY(${(1 - diagramAnimation) * 24}px)`,
          width: "100%",
          maxWidth: 1700,
          display: "flex",
          flexDirection: "row",
          gap: 28,
          alignItems: "stretch",
        }}
      >
        <div style={{ ...panelStyle, flex: 1 }}>
          <div style={panelTitleStyle}>Nested isolation</div>
          <Body size="lg" style={{ marginBottom: 18, lineHeight: 1.35 }}>
            The agent code runs inside a sandbox, inside a container, inside your host.
          </Body>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {layerBox({
              title: "Host",
              subtitle: "trusted machine",
              borderColor: "rgba(39, 39, 42, 0.25)",
              background: "rgba(253, 253, 253, 0.9)",
              padding: 18,
              opacity: animIn(localSec - beat1),
              children: layerBox({
                title: "Container",
                subtitle: "isolated run",
                borderColor: "rgba(199, 0, 126, 0.45)",
                background: "rgba(199, 0, 126, 0.05)",
                padding: 18,
                opacity: animIn(localSec - beat2),
                children: layerBox({
                  title: "Lua sandbox",
                  subtitle: "restricted code",
                  borderColor: "rgba(199, 0, 126, 0.85)",
                  background: "rgba(199, 0, 126, 0.09)",
                  padding: 18,
                  opacity: animIn(localSec - beat2),
                  children: (
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <Card variant="muted" padding={3} style={{ flex: "1 1 240px" }}>
                        <Body style={{ marginBottom: 0, fontSize: 24 }}>contained filesystem</Body>
                      </Card>
                      <Card variant="muted" padding={3} style={{ flex: "1 1 240px" }}>
                        <Body style={{ marginBottom: 0, fontSize: 24 }}>no network access</Body>
                      </Card>
                    </div>
                  ),
                }),
              }),
            })}
          </div>
        </div>

        <div style={{ ...panelStyle, flex: 1.1 }}>
          <div style={panelTitleStyle}>Broker</div>
          <Body size="lg" style={{ marginBottom: 18, lineHeight: 1.35, opacity: animIn(localSec - beat3) }}>
            Anything sensitive stays outside the sandbox. The runtime asks a trusted broker to do privileged work.
          </Body>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: animIn(localSec - beat3) }}>
            {layerBox({
              title: "Broker / tool runner",
              subtitle: "trusted side",
              borderColor: "rgba(39, 39, 42, 0.25)",
              background: "rgba(253, 253, 253, 0.9)",
              padding: 18,
              opacity: 1,
              children: (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Card variant="muted" padding={4} style={{ flex: "1 1 240px" }}>
                      <Body style={{ marginBottom: 0, fontSize: 26 }}>model calls</Body>
                    </Card>
                    <Card variant="muted" padding={4} style={{ flex: "1 1 240px" }}>
                      <Body style={{ marginBottom: 0, fontSize: 26 }}>API tools</Body>
                    </Card>
                  </div>
                  <Card variant="muted" padding={4} style={{ width: "100%" }}>
                    <Body style={{ marginBottom: 0, fontSize: 26 }}>API keys</Body>
                  </Card>
                </div>
              ),
            })}
          </div>
        </div>
      </div>

      {/* No bottom tagline; this will be its own scene. */}
    </Layout>
  );
};

const HitlScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 4;
  const beat3 = cueStartsLocal[2] ?? beat2 + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const box: React.CSSProperties = {
    borderRadius: 28,
    border: "2px solid rgba(39, 39, 42, 0.16)",
    background: "rgba(253, 253, 253, 0.85)",
    padding: 28,
  };

  const monkeyAnim = spring({
    frame: frame - secondsToFrames(Math.max(0, beat1 + 0.1), fps),
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.7 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 36,
        }}
      >
        <TitleBlock>Human in the Loop</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1700, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", gap: 28, alignItems: "stretch" }}>
          <div style={{ ...box, flex: 1, opacity: animIn(localSec - beat1) }}>
            <Body style={{ fontSize: 30, fontWeight: 900, marginBottom: 14 }}>Draft</Body>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card variant="muted" padding={4}>
                <Body style={{ marginBottom: 0, fontSize: 28 }}>Write a post</Body>
              </Card>
              <Card variant="muted" padding={4}>
                <Body style={{ marginBottom: 0, fontSize: 28 }}>Prepare publish step</Body>
              </Card>
            </div>
          </div>

          <div style={{ ...box, flex: 1, opacity: animIn(localSec - beat2) }}>
            <Body style={{ fontSize: 30, fontWeight: 900, marginBottom: 14 }}>Ask a human</Body>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card variant="muted" padding={4}>
                <Body style={{ marginBottom: 0, fontSize: 28 }}>Approve publishing</Body>
              </Card>
              <Card variant="muted" padding={4}>
                <Body style={{ marginBottom: 0, fontSize: 28 }}>Or request edits</Body>
              </Card>
            </div>
          </div>

          <div style={{ ...box, flex: 1, opacity: animIn(localSec - beat3) }}>
            <Body style={{ fontSize: 30, fontWeight: 900, marginBottom: 14 }}>Publish</Body>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Card variant="muted" padding={4}>
                <Body style={{ marginBottom: 0, fontSize: 28 }}>Pause while waiting</Body>
              </Card>
              <Card variant="muted" padding={4}>
                <Body style={{ marginBottom: 0, fontSize: 28 }}>Resume and publish</Body>
              </Card>
            </div>
          </div>
        </div>

        <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img
            src={coverAnimalImg}
            style={{
              height: 300,
              opacity: monkeyAnim,
              transformOrigin: "top center",
              transform: `scale(${(0.9 + monkeyAnim * 0.1) * 1.2}) rotate(${(1 - monkeyAnim) * -6}deg)`,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

const GraphsScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const graphCode = `# Graph-style workflow (example)
add_node("work", work)
add_node("approve", approve)
add_edge("work", "approve")
add_conditional_edge("approve", {
  yes = "work",
  no = "end"
})
checkpoint(...)`;

  const tactusCode = `local done = require("tactus.tools.done")

worker = Agent {provider="openai", tools={done}}

Procedure {
  function(input)
    worker()
    local ok = Human.approve({message="Continue?"})
    if ok then worker() end
  end
}`;

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 34,
        }}
      >
        <TitleBlock>No Graphs Required</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1700, display: "flex", gap: 28, alignItems: "stretch" }}>
        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat1),
            transform: `translateY(${(1 - animIn(localSec - beat1)) * 14}px)`,
          }}
        >
          <Body style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Graph workflow</Body>
          <Code style={{ fontSize: 28, lineHeight: 1.25, whiteSpace: "pre-wrap" }}>{graphCode}</Code>
        </Card>

        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat2),
            transform: `translateY(${(1 - animIn(localSec - beat2)) * 14}px)`,
          }}
        >
          <Body style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Tactus code</Body>
          <Code style={{ fontSize: 28, lineHeight: 1.25, whiteSpace: "pre-wrap" }}>{tactusCode}</Code>
        </Card>
      </div>
    </Layout>
  );
};

const NutshellScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const imageAnim = spring({
    frame: frame - secondsToFrames(Math.max(0, beat1 + 0.15), fps),
    fps,
    config: { damping: 16, stiffness: 180, mass: 0.8 },
  });

  const textAnim = (t: number) => animIn(localSec - t);

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 28,
        }}
      >
        <TitleBlock>Tactus in a Nutshell</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1700, display: "flex", gap: 40, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Img
            src={nutshellCoverAnimalImg}
            style={{
              height: 560,
              opacity: imageAnim,
              transformOrigin: "top center",
              transform: `scale(${0.98 + imageAnim * 0.04})`,
            }}
          />
        </div>

        <div style={{ flex: 1.1, maxWidth: 760 }}>
          <Card
            variant="muted"
            padding={5}
            style={{
              opacity: textAnim(beat1),
              transform: `translateY(${(1 - textAnim(beat1)) * 14}px)`,
            }}
          >
            <Body size="lg" style={{ marginBottom: 0, fontSize: 34, lineHeight: 1.25 }}>
              A programming language for getting things done with agents.
            </Body>
          </Card>

          <div style={{ height: 18 }} />

          <Card
            variant="muted"
            padding={5}
            style={{
              opacity: textAnim(beat2),
              transform: `translateY(${(1 - textAnim(beat2)) * 14}px)`,
            }}
          >
            <Body size="lg" style={{ marginBottom: 0, fontSize: 34, lineHeight: 1.25 }}>
              Give the agent tools and a procedure—
              <br />
              keep it sandboxed and contained.
            </Body>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

const CTAScene: React.FC = () => {
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
    <Layout>
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
          marginTop: 24,
          textAlign: "center",
        }}
      >
        Visit <Code inline style={{ fontSize: "1em" }}>https://tactus.anth.us</Code> to learn more
      </Body>

      {iconAnimation > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
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
