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
import NewWayFlowchartDiagram from "../../components/diagrams/NewWayFlowchartDiagram";
import HumanInTheLoopDiagram from "../../components/diagrams/HumanInTheLoopDiagram";
import ContainerSandboxDiagram from "../../components/diagrams/ContainerSandboxDiagram";
import GuardrailsStackDiagram from "../../components/diagrams/GuardrailsStackDiagram";
import AIEngineersToolboxDiagram from "../../components/diagrams/AIEngineersToolboxDiagram";
import LeastPrivilegeDiagram from "../../components/diagrams/LeastPrivilegeDiagram";
import { HITL_PRESETS } from "../../components/diagrams/hitlPresets";
import monkeyImg from "../../assets/images/monkey.png";
import nutshellCoverAnimalImg from "../../assets/images/nutshell-cover-animal.png";
import { CTAScene } from "../../components/CTAScene";
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
      case "interface":
        return <InterfaceScene 
          scene={scene} 
          supervisedStarts={getCueTtsStarts(scene.id, "interface_supervised")}
          unsupervisedStarts={getCueTtsStarts(scene.id, "interface_unsupervised")}
          hitlStarts={getCueTtsStarts(scene.id, "interface_hitl")}
        />;
      case "defense_layers":
        return <DefenseLayersScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "defense_layers")} />;
      case "sandboxing":
        return <SandboxingScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "sandboxing")} />;
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
      newWay={<NewWayFlowchartDiagram theme="light" progress={1} />}
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
  const beat2 = cueStartsLocal[1] ?? beat1 + 3;
  const beat3 = cueStartsLocal[2] ?? beat2 + 3;
  const beat4 = cueStartsLocal[3] ?? beat3 + 3;
  const endBeat = beat4 + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const diagramProgress = interpolate(
    localSec,
    [beat1, beat2, beat3, beat4, endBeat],
    [0, 0.25, 0.5, 0.75, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 28,
        }}
      >
        <TitleBlock>The AI Engineer's Toolbox</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1850, display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%" }}>
          <AIEngineersToolboxDiagram theme="light" progress={diagramProgress} />
        </div>
      </div>
    </Layout>
  );
};

const SecurityScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[1] ?? beat1 + 2.5;

  const titleAnimation = spring({
    frame,
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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

const DefenseLayersScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  
  // Segments:
  // 0: Intro ("Tactus uses defense...")
  // 1: Cost ("For example...")
  // 2: Prompt ("Beyond that...")
  // 3: Context ("Context engineering...")
  // 4: Models ("The models...")
  // 5: Secretless ("At deeper levels...")
  // 6: Sandbox ("It runs your code...")
  // 7: Container ("And it runs that sandbox...")
  
  const beatCost = cueStartsLocal[1] ?? 0;
  const beatPrompt = cueStartsLocal[2] ?? beatCost + 3;
  const beatContext = cueStartsLocal[3] ?? beatPrompt + 3;
  const beatModel = cueStartsLocal[4] ?? beatContext + 3;
  const beatSecretless = cueStartsLocal[5] ?? beatModel + 3;
  const beatSandbox = cueStartsLocal[6] ?? beatSecretless + 3;
  const beatContainer = cueStartsLocal[7] ?? beatSandbox + 3;
  const beatEnd = beatContainer + 4; // Allow time for reading final one

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

  // 7 layers total.
  // 0: Cost, 1: Prompt, 2: Context, 3: Model, 4: Secretless, 5: Sandbox, 6: Container
  const diagramProgress = interpolate(
    localSec,
    [beatCost, beatPrompt, beatContext, beatModel, beatSecretless, beatSandbox, beatContainer, beatEnd],
    [0, 1/7, 2/7, 3/7, 4/7, 5/7, 6/7, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 40,
        }}
      >
        <TitleBlock>Levels of Control</TitleBlock>
      </H2>

      <div
        style={{
          opacity: diagramAnimation,
          transform: `translateY(${(1 - diagramAnimation) * 24}px)`,
          width: "100%",
          maxWidth: 1850,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <GuardrailsStackDiagram theme="light" progress={diagramProgress} />
        </div>
      </div>
    </Layout>
  );
};

const LeastPrivilegeScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);

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

  // We have 7 segments total (intro + 5 dimensions + wrap)
  // Segments 0-1: intro ("Each of these...", "Tactus limits...")
  // Segment 2: Minimal toolsets
  // Segment 3: Curated context
  // Segment 4: Network isolation
  // Segment 5: Secretless broker
  // Segment 6: Temporal gating
  
  const dim1Start = cueStartsLocal[2] ?? 0;
  const dim2Start = cueStartsLocal[3] ?? dim1Start + 3;
  const dim3Start = cueStartsLocal[4] ?? dim2Start + 3;
  const dim4Start = cueStartsLocal[5] ?? dim3Start + 3;
  const dim5Start = cueStartsLocal[6] ?? dim4Start + 3;
  const dimEnd = dim5Start + 4;

  // Map time to progress (0-1) - sweep through all 5 dimensions
  const diagramProgress = interpolate(
    localSec,
    [dim1Start, dim2Start, dim3Start, dim4Start, dim5Start, dimEnd],
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Layout justify="flex-start" style={{ paddingTop: 80 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 32,
        }}
      >
        <TitleBlock>Least Privilege by Design</TitleBlock>
      </H2>

      <div
        style={{
          opacity: diagramAnimation,
          transform: `translateY(${(1 - diagramAnimation) * 24}px)`,
          width: "100%",
          maxWidth: 1850,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <LeastPrivilegeDiagram theme="light" progress={diagramProgress} />
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
          maxWidth: 1850,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <ContainerSandboxDiagram theme="light" />
        </div>
      </div>
    </Layout>
  );
};

const HitlScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const timeMs = localSec * 1000;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 36,
        }}
      >
        <TitleBlock>Human in the Loop</TitleBlock>
      </H2>

      <div
        style={{
          width: "100%",
          maxWidth: 1850,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: animIn(localSec - beat1),
          transform: `translateY(-48px)`,
        }}
      >
        <div style={{ width: "100%" }}>
          <HumanInTheLoopDiagram
            theme="light"
            time={timeMs}
            scenario={HITL_PRESETS.RETURNS_ALL.scenario}
            config={HITL_PRESETS.RETURNS_ALL.config}
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

  const graphCode = `graph = StateGraph(State)
graph.add_node("agent", agent)
graph.add_node("tools", tool_executor)

graph.add_edge(START, "agent")
graph.add_conditional_edges(
    "agent",
    should_continue,
    {
        "continue": "tools",
        "end": END
    }
)
graph.add_edge("tools", "agent")

app = graph.compile()`;

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

      <div style={{ width: "100%", maxWidth: 1700, display: "flex", gap: 40, alignItems: "center", paddingTop: 48 }}>
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

        <div style={{ flex: 1.1, maxWidth: 760, transform: "translateX(-48px)" }}>
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

const InterfaceScene: React.FC<{ 
  scene: Scene; 
  supervisedStarts: number[];
  unsupervisedStarts: number[];
  hitlStarts: number[];
}> = ({ scene, supervisedStarts, unsupervisedStarts, hitlStarts }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const timeMs = localSec * 1000;
  
  // Convert to scene-local times
  const supervisedLocal = supervisedStarts.map(s => s - scene.startSec);
  const unsupervisedLocal = unsupervisedStarts.map(s => s - scene.startSec);
  const hitlLocal = hitlStarts.map(s => s - scene.startSec);

  const supervisedStart = supervisedLocal[0] ?? 0;
  const unsupervisedStart = unsupervisedLocal[0] ?? supervisedStart + 8;
  const monkeyStart = unsupervisedLocal[1] ?? unsupervisedStart + 4;
  const hitlStart = hitlLocal[0] ?? monkeyStart + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const showSupervised = localSec >= supervisedStart && localSec < unsupervisedStart;
  const showUnsupervised = localSec >= unsupervisedStart && localSec < monkeyStart;
  const showMonkey = localSec >= monkeyStart && localSec < hitlStart;
  const showHitl = localSec >= hitlStart;

  const monkeyAnimation = spring({
    frame: frame - secondsToFrames(Math.max(0, monkeyStart), fps),
    fps,
    config: { damping: 100, stiffness: 120, mass: 0.8 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 36,
        }}
      >
        <TitleBlock>The Interface Layer</TitleBlock>
      </H2>

      {/* Closely Supervised */}
      {showSupervised && (
        <div
          style={{
            width: "100%",
            maxWidth: 1850,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: animIn(localSec - supervisedStart),
            transform: `translateY(12px)`,
          }}
        >
          <div style={{ width: "100%" }}>
            <HumanInTheLoopDiagram
              theme="light"
              time={timeMs - supervisedStart * 1000}
              scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
              config={{
                ...HITL_PRESETS.CLOSELY_SUPERVISED.config,
                stepBackAfterItems: 1,
                outageDuration: 8000
              }}
            />
          </div>
        </div>
      )}

      {/* Unsupervised Monkey */}
      {showUnsupervised && (
        <div
          style={{
            width: "100%",
            maxWidth: 1850,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: animIn(localSec - unsupervisedStart),
            transform: `translateY(12px)`,
          }}
        >
          <div style={{ width: "100%" }}>
            <HumanInTheLoopDiagram
              theme="light"
              time={timeMs - unsupervisedStart * 1000}
              scenario={HITL_PRESETS.UNSUPERVISED_MONKEY.scenario}
              config={HITL_PRESETS.UNSUPERVISED_MONKEY.config}
              cycleMonkey={HITL_PRESETS.UNSUPERVISED_MONKEY.cycleMonkey}
            />
          </div>
        </div>
      )}

      {/* Monkey with Razor Blade */}
      {showMonkey && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Img
              src={monkeyImg}
              style={{
                width: 600,
                opacity: monkeyAnimation,
                transform: `translateX(${(1 - monkeyAnimation) * 200}px)`,
                marginBottom: 24,
              }}
            />
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
              Like giving a monkey a razor blade
            </Body>
          </div>
        </div>
      )}

      {/* Human Steps Back (HITL) */}
      {showHitl && (
        <div
          style={{
            width: "100%",
            maxWidth: 1850,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: animIn(localSec - hitlStart),
            transform: `translateY(12px)`,
          }}
        >
          <div style={{ width: "100%" }}>
            <HumanInTheLoopDiagram
              theme="light"
              time={timeMs - hitlStart * 1000}
              scenario={HITL_PRESETS.HUMAN_STEPS_BACK.scenario}
              config={HITL_PRESETS.HUMAN_STEPS_BACK.config}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

const SandboxingScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;

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

  return (
    <Layout justify="flex-start" style={{ paddingTop: 96 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 40,
        }}
      >
        <TitleBlock>A Sandbox in a Container</TitleBlock>
      </H2>

      <div
        style={{
          opacity: diagramAnimation,
          transform: `translateY(${(1 - diagramAnimation) * 24}px)`,
          width: "100%",
          maxWidth: 1850,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ width: "100%" }}>
          <ContainerSandboxDiagram theme="light" />
        </div>
      </div>
    </Layout>
  );
};