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
import { CodeSequence } from "../../components/CodeBlock";
import OldWayFlowchartDiagram from "../../components/diagrams/OldWayFlowchartDiagram";
import AgentGuardrailsDiagram from "../../components/diagrams/AgentGuardrailsDiagram";
import HumanInTheLoopDiagram from "../../components/diagrams/HumanInTheLoopDiagram";
import iconImg from "../../assets/images/icon.png";
import type { Scene, Script } from "@/babulus/types";
import { secondsToFrames } from "@/babulus/utils";
import whyNewLanguageScript from "@/videos/why-new-language/why-new-language.script.json";
import { AudioTimelineLayer } from "@/babulus/AudioTimeline";
import whyNewLanguageTimeline from "./why-new-language.timeline.json";
import type { GeneratedTimeline } from "@/babulus/audioTypes";

// For the ParadigmComparison scene
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

const PYTHON_CODE = `async def process_with_agent(input_data):
    try:
        result = await openai.chat.completions.create(...)
        # Now what? How do we checkpoint?
        # How do we test this?
        # How do we prevent it from reading /etc/passwd?
        return result
    except Exception as e:
        pass`;

const TACTUS_CODE = `Procedure {
  function(input)
    local result = agent {
      instruction = "Process this input",
      data = input
    }
    -- Checkpointed automatically
    -- Runs in sandbox by default
    -- Testable with specs
    return result
  end
}`;

const HITL_RETURNS_ALL_CONFIG = {
  autoProcessRate: 0.1,
  returnToAgentRate: 1.0,
  itemCount: 6,
  queueTime: 1000,
};

export type WhyNewLanguageVideoProps = {
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
  const { frame, fps, startSeconds, text, charsPerFrame = 0.8 } = opts; // Slowed down
  const startFrame = secondsToFrames(Math.max(0, startSeconds), fps);
  const charsToShow = Math.min(Math.max(0, (frame - startFrame) * charsPerFrame), text.length);
  const base = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length;
  const showCursor = isTyping && Math.floor(frame / 15) % 2 === 0;
  return base + (showCursor ? "|" : "");
};

export const WhyNewLanguageVideo: React.FC<WhyNewLanguageVideoProps> = ({
  audioSrc = null,
  script = whyNewLanguageScript as Script,
  timeline = whyNewLanguageTimeline as GeneratedTimeline,
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
    if (!timeline) return [];
    const itemsUnknown = (timeline as unknown as { items?: unknown }).items;
    if (!Array.isArray(itemsUnknown)) return [];

    const cueItem = itemsUnknown.find(
      (it): it is CueTimelineItem =>
        isCueTimelineItem(it) && it.type === "tts" && it.sceneId === sceneId && it.cueId === cueId,
    );
    if (!cueItem?.segments) return [];
    return cueItem.segments.filter((seg) => seg.type === "tts").map((seg) => seg.startSec);
  };

  const renderScene = (scene: Scene) => {
    switch (scene.id) {
      case "title_card":
        return <TitleCardScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "title")} />;
      case "paradigm":
        return <ParadigmScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "paradigm_shift")} />;
      case "machine_code_era":
        return <MachineCodeScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "history")} />;
      case "control_flow":
        return <ControlFlowScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "shift")} />;
      case "tools_strain":
        return <ToolsStrainScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "python_problem")} />;
      case "practices_collapse":
        return <PracticesCollapseScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "testing_breaks")} />;
      case "beyond_mlops":
        return <BeyondMLOpsScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "mlops_comparison")} />;
      case "specifications":
        return <SpecificationsScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "specs_and_evals")} />;
      case "props":
        return <PrOpsScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "procedures")} />;
      case "new_language":
        return <NewLanguageScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "first_class_primitives")} />;
      case "evolution":
        return <EvolutionScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "conclusion")} />;
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

// Scene Components

const TitleCardScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const animation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout>
      <H2
        style={{
          opacity: animation,
          transform: `scale(${0.9 + animation * 0.1})`,
        }}
      >
        <TitleBlock>Why a New Language?</TitleBlock>
      </H2>
      <Body
        size="lg"
        style={{
          opacity: animation,
          marginTop: 32,
          textAlign: "center",
        }}
      >
        What’s wrong with Python?
      </Body>
    </Layout>
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

const MachineCodeScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);

  // Map beats to the TTS segments
  // history segments (see `videos/content/why-new-language.babulus.yml`, cue `machine_code_era.history`)
  const beat0 = cueStartsLocal[0] ?? 0; // machine code
  const beat1 = cueStartsLocal[1] ?? beat0 + 8; // hex
  const beat2 = cueStartsLocal[2] ?? beat1 + 7; // assembly / assemblers
  const beat3 = cueStartsLocal[3] ?? beat2 + 7; // two-step workflow (assembler + your program)
  const beat4 = cueStartsLocal[4] ?? beat3 + 6; // translation explanation
  const beat5 = cueStartsLocal[5] ?? beat4 + 6; // "key step" meta insight
  const beat6 = cueStartsLocal[6] ?? beat5 + 7; // early high-level languages (Lisp, etc.)
  const beat7 = cueStartsLocal[7] ?? beat6 + 7; // C
  const beat8 = cueStartsLocal[8] ?? beat7 + 8; // C++
  const beat9 = cueStartsLocal[9] ?? beat8 + 8; // Ruby
  const beat10 = cueStartsLocal[10] ?? beat9 + 9; // paradigm constant
  const beat11 = cueStartsLocal[11] ?? beat10 + 10; // AI parallel
  const beat12 = cueStartsLocal[12] ?? beat11 + 9; // Tactus
  const beat13 = cueStartsLocal[13] ?? beat12 + 9; // the difference

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  // Update the title as the narrative moves from machine code → assemblers → higher-level languages.
  const titleSwap12 = interpolate(localSec, [Math.max(0, beat2 - 0.6), beat2 + 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleSwap23 = interpolate(localSec, [Math.max(0, beat6 - 0.6), beat6 + 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const title1Opacity = (1 - titleSwap12) * (1 - titleSwap23);
  const title2Opacity = titleSwap12 * (1 - titleSwap23);
  const title3Opacity = titleSwap23;

  // Code examples for each era
  const MACHINE_CODE = `01001000 10001001 11100101
01001000 10000011 11101100 00001000
10001011 00000101 00000000 00000000
00000000 00000000`;

  const HEX_CODE = `48 89 E5
48 83 EC 08
8B 05 00 00 00 00`;

  const ASSEMBLY_CODE = `section .data
    msg db 'Hello, World!', 0

section .text
    global _start

_start:
    mov rax, 1
    mov rdi, 1
    mov rsi, msg
    mov rdx, 13
    syscall`;

  const LISP_CODE = `(defun hello-world ()
  (format t "Hello, World!~%"))

(hello-world)`;

  const C_CODE = `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`;

  const CPP_CODE = `class Greeter {
private:
    std::string name;

public:
    Greeter(std::string n) : name(n) {}

    void greet() {
        std::cout << "Hello, " << name << "!" << std::endl;
    }
};`;

  const RUBY_CODE = `class Greeter
  def initialize(name)
    @name = name
  end

  def greet
    puts "Hello, #{@name}!"
  end
end

Greeter.new("World").greet`;

  const TACTUS_HELLO_WORLD_CODE = `World = Agent {
    provider = "openai",
    model = "gpt-4o-mini",
    system_prompt = "Your name is World."
}

return World("Hello, World!").response`;

  const codeExamples = [
    { label: "1940s: Machine Code", code: MACHINE_CODE, startTime: beat0 },
    { label: "1940s: Hexadecimal", code: HEX_CODE, startTime: beat1 },
    { label: "1950s: Assembly", code: ASSEMBLY_CODE, startTime: beat2 },
    { label: "1958: Lisp", code: LISP_CODE, startTime: beat6 },
    { label: "1970s: C", code: C_CODE, startTime: beat7 },
    { label: "1980s: C++", code: CPP_CODE, startTime: beat8 },
    { label: "1990s: Ruby", code: RUBY_CODE, startTime: beat9 },
    { label: "Today: Tactus", code: TACTUS_HELLO_WORLD_CODE, startTime: beat12 },
  ];

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
          }}
        >
          <span style={{ gridArea: "1 / 1", opacity: title1Opacity, display: "flex", justifyContent: "center", width: "100%" }}>
            <TitleBlock>In the beginning...</TitleBlock>
          </span>
          <span style={{ gridArea: "1 / 1", opacity: title2Opacity, display: "flex", justifyContent: "center", width: "100%" }}>
            <TitleBlock>Metacomputing</TitleBlock>
          </span>
          <span style={{ gridArea: "1 / 1", opacity: title3Opacity, display: "flex", justifyContent: "center", width: "100%" }}>
            <TitleBlock>Higher-level languages</TitleBlock>
          </span>
        </span>
      </H2>

      <CodeSequence
        items={codeExamples}
        endTime={beat13}
        containerWidth={1400}
        containerHeight={600}
        enableTypewriter={true}
      />
    </Layout>
  );
};

const ControlFlowScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[2] ?? beat1 + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <TitleBlock>Control Flow Has Changed</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1700, display: "flex", gap: 32, alignItems: "stretch" }}>
        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat1),
            transform: `translateY(${(1 - animIn(localSec - beat1)) * 20}px)`,
          }}
        >
          <Body style={{ fontSize: 28, fontWeight: 900, marginBottom: 16, color: "#666" }}>Traditional</Body>
          <Body size="lg" style={{ fontSize: 30, lineHeight: 1.5 }}>
            Same input → Same output
            <br />
            <br />
            Deterministic
            <br />
            <br />
            Programmer specifies every step
          </Body>
        </Card>

        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat2),
            transform: `translateY(${(1 - animIn(localSec - beat2)) * 20}px)`,
          }}
        >
          <Body style={{ fontSize: 28, fontWeight: 900, marginBottom: 16, color: "#c7007e" }}>AI-Driven</Body>
          <Body size="lg" style={{ fontSize: 30, lineHeight: 1.5 }}>
            Same input → Varying outputs
            <br />
            <br />
            Probabilistic
            <br />
            <br />
            Decisions emerge from models
          </Body>
        </Card>
      </div>
    </Layout>
  );
};

const ToolsStrainScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[3] ?? beat1 + 5;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 100 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 40,
        }}
      >
        <TitleBlock>The Problem with Python</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1600, display: "flex", gap: 28, alignItems: "stretch" }}>
        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat1),
            transform: `translateY(${(1 - animIn(localSec - beat1)) * 14}px)`,
          }}
        >
          <Body style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Python</Body>
          <Code style={{ fontSize: 24, lineHeight: 1.3, whiteSpace: "pre-wrap" }}>{PYTHON_CODE}</Code>
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
          <Body style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Tactus</Body>
          <Code style={{ fontSize: 24, lineHeight: 1.3, whiteSpace: "pre-wrap" }}>{TACTUS_CODE}</Code>
        </Card>
      </div>
    </Layout>
  );
};

const PracticesCollapseScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const practices = [
    "Unit tests with exact assertions",
    "100% code coverage",
    "Regression tests",
    "Debuggers with replay",
    "Binary pass/fail gates",
  ];

  return (
    <Layout justify="flex-start" style={{ paddingTop: 100 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <TitleBlock>Traditional Best Practices Break</TitleBlock>
      </H2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          width: "100%",
          maxWidth: 1600,
        }}
      >
        {practices.map((practice, i) => {
          const delay = i * 10;
          const anim = spring({
            frame: frame - delay,
            fps,
            config: { damping: 100, stiffness: 180, mass: 0.6 },
          });
          return (
            <Card
              key={i}
              variant="muted"
              padding={4}
              style={{
                opacity: anim,
                transform: `translateX(${(1 - anim) * -30}px)`,
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <Body style={{ fontSize: 44, color: "#c7007e" }}>✗</Body>
              <Body size="lg" style={{ fontSize: 28, flex: 1, lineHeight: 1.35 }}>
                {practice}
              </Body>
            </Card>
          );
        })}
      </div>
    </Layout>
  );
};

const BeyondMLOpsScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const cueStartsLocal = ttsStartsSec.map((s) => s - scene.startSec);
  const beat1 = cueStartsLocal[0] ?? 0;
  const beat2 = cueStartsLocal[2] ?? beat1 + 4;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <TitleBlock>Beyond MLOps</TitleBlock>
      </H2>

      <div style={{ width: "100%", maxWidth: 1700, display: "flex", gap: 32 }}>
        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat1),
            transform: `translateY(${(1 - animIn(localSec - beat1)) * 20}px)`,
          }}
        >
          <Body style={{ fontSize: 32, fontWeight: 900, marginBottom: 24 }}>MLOps</Body>
          <Body size="lg" style={{ fontSize: 26, lineHeight: 1.6 }}>
            Train models
            <br />
            Evaluate on test sets
            <br />
            Compare metrics
            <br />
            Deploy best model
            <br />
            <br />
            Focus: <strong>Model Quality</strong>
          </Body>
        </Card>

        <Card
          variant="muted"
          padding={5}
          style={{
            flex: 1,
            opacity: animIn(localSec - beat2),
            transform: `translateY(${(1 - animIn(localSec - beat2)) * 20}px)`,
          }}
        >
          <Body style={{ fontSize: 32, fontWeight: 900, marginBottom: 24, color: "#c7007e" }}>PrOps</Body>
          <Body size="lg" style={{ fontSize: 26, lineHeight: 1.6 }}>
            Define procedures
            <br />
            Write specifications
            <br />
            Run evaluations
            <br />
            Deploy with guardrails
            <br />
            <br />
            Focus: <strong>System Behavior</strong>
          </Body>
        </Card>
      </div>
    </Layout>
  );
};

const SpecificationsScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const textAnimation = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100, stiffness: 180, mass: 0.6 },
  });

  const specCode = `Feature: Contact import works reliably

  Scenario: Handles varied formats
    Given 100 contact records
    When the agent imports them
    Then at least 95% should succeed`;

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <TitleBlock>Behavioral Specifications</TitleBlock>
      </H2>

      <Card
        variant="muted"
        padding={5}
        style={{
          maxWidth: 1200,
          opacity: textAnimation,
          transform: `translateY(${(1 - textAnimation) * 20}px)`,
        }}
      >
        <Code style={{ fontSize: 28, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>{specCode}</Code>
      </Card>

      <Body
        size="lg"
        style={{
          marginTop: 48,
          fontSize: 32,
          textAlign: "center",
          maxWidth: 1000,
          opacity: textAnimation,
        }}
      >
        Specs + Evaluations = Alignment
      </Body>
    </Layout>
  );
};

const PrOpsScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 120 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 32,
        }}
      >
        <TitleBlock>PrOps: Procedure Operations</TitleBlock>
      </H2>

      <Body
        size="lg"
        style={{
          fontSize: 32,
          textAlign: "center",
          maxWidth: 1200,
          lineHeight: 1.6,
          opacity: titleAnimation,
        }}
      >
        DevOps operates <strong>programs</strong>
        <br />
        MLOps trains <strong>models</strong>
        <br />
        <br />
        <span style={{ color: "#c7007e", fontSize: "1.2em" }}>PrOps operates procedures</span>
      </Body>
    </Layout>
  );
};

const NewLanguageScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const timeMs = localSec * 1000;

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const features = [
    "Durability by default",
    "Sandboxing by default",
    "Tool capability control",
    "Human approval gates",
    "Behavioral testing",
    "Observable execution",
  ];

  return (
    <Layout justify="flex-start" style={{ paddingTop: 100 }}>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `translateY(${(1 - titleAnimation) * 40}px)`,
          marginBottom: 48,
        }}
      >
        <TitleBlock>First-Class Primitives</TitleBlock>
      </H2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          maxWidth: 1600,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {features.map((feature, i) => {
            const delay = i * 8;
            const anim = spring({
              frame: frame - delay,
              fps,
              config: { damping: 100, stiffness: 180, mass: 0.6 },
            });
            return (
              <Card
                key={i}
                variant="muted"
                padding={4}
                style={{
                  opacity: anim,
                  transform: `scale(${0.95 + anim * 0.05})`,
                }}
              >
                <Body size="lg" style={{ fontSize: 32, fontWeight: 800, color: "#c7007e" }}>
                  {feature}
                </Body>
              </Card>
            );
          })}
        </div>

        <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 6 }}>
          <div style={{ width: "100%", maxWidth: 760 }}>
            <HumanInTheLoopDiagram theme="light" time={timeMs} scenario="custom" config={HITL_RETURNS_ALL_CONFIG} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const EvolutionScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnimation = spring({
    frame,
    fps,
    config: { damping: 100, stiffness: 200, mass: 0.5 },
  });

  const textAnimation = spring({
    frame: frame - 30,
    fps,
    config: { damping: 100, stiffness: 180, mass: 0.6 },
  });

  return (
    <Layout>
      <H2
        style={{
          opacity: titleAnimation,
          transform: `scale(${0.9 + titleAnimation * 0.1})`,
        }}
      >
        <TitleBlock>This is Evolution</TitleBlock>
      </H2>

      <Body
        size="lg"
        style={{
          opacity: textAnimation,
          marginTop: 48,
          textAlign: "center",
          fontSize: 36,
          lineHeight: 1.6,
          maxWidth: 1200,
        }}
      >
        Languages follow mental models.
        <br />
        <br />
        When the mental model changes,
        <br />
        new languages emerge.
      </Body>
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
    frame: frame - 30,
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
        <TitleBlock>Learn More</TitleBlock>
      </H2>

      <Body
        size="lg"
        style={{
          opacity: animation,
          marginTop: 32,
          textAlign: "center",
          fontSize: 32,
        }}
      >
        Visit <Code inline style={{ fontSize: "1em" }}>tactus.anth.us</Code>
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
