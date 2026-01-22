import React from "react";
import { Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GlobalStyles } from "../../components/GlobalStyles";
import { Layout } from "../../components/Layout";
import { Body, H2, TitleBlock } from "../../components/Typography";
import type { Scene, Script } from "@/babulus/types";
import { secondsToFrames } from "@/babulus/utils";
import guardrailsScript from "@/videos/guardrails/guardrails.script.json";
import { AudioTimelineLayer } from "@/babulus/AudioTimeline";
import guardrailsTimeline from "./guardrails.timeline.json";
import type { GeneratedTimeline } from "@/babulus/audioTypes";
import GuardrailsStackDiagram from "../../components/diagrams/GuardrailsStackDiagram";
import LeastPrivilegeDiagram from "../../components/diagrams/LeastPrivilegeDiagram";
import PromptEngineeringCeilingDiagram from "../../components/diagrams/PromptEngineeringCeilingDiagram";
import ContainerSandboxDiagram from "../../components/diagrams/ContainerSandboxDiagram";
import { CTAScene } from "../../components/CTAScene";

export type GuardrailsVideoProps = {
  audioSrc?: string | null;
  script?: Script;
  timeline?: GeneratedTimeline | null;
};

export const GuardrailsVideo: React.FC<GuardrailsVideoProps> = ({
  audioSrc = null,
  script = guardrailsScript as Script,
  timeline = guardrailsTimeline as GeneratedTimeline,
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
      case "paradox":
        return <ParadoxScene />;
      case "patterns":
        return <PatternsScene />;
      case "prompt_ceiling":
        return <PromptCeilingScene />;
      case "manual_assembly":
        return <ManualAssemblyScene />;
      case "defense_in_depth":
        return <DefenseInDepthScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "defense_in_depth")} />;
      case "least_privilege":
        return <LeastPrivilegeScene scene={scene} ttsStartsSec={getCueTtsStarts(scene.id, "least_privilege")} />;
      case "sandbox_broker":
        return <SandboxBrokerScene />;
      case "example":
        return <ExampleScene />;
      case "closing":
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

const useIntroAnim = (delayFrames = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: Math.max(0, frame - delayFrames),
    fps,
    config: { damping: 120, stiffness: 240, mass: 0.6 },
  });
};

const ParadoxScene: React.FC = () => {
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(12);

  return (
    <Layout>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>You can’t drive fast without brakes</TitleBlock>
      </H2>
      <div style={{ marginTop: 34, width: 1500, opacity: anim2 }}>
        <Body size="lg">
          If agents can take real actions with side effects, guardrails stop being a nice-to-have. They become the price of admission.
        </Body>
        <Body>
          • Prompts are suggestions, not controls.
          <br />
          • Guardrails are enforceable boundaries.
          <br />
          • Start with a threat model: assets, entry points, trust boundaries, and controls.
        </Body>
      </div>
    </Layout>
  );
};

const PatternsScene: React.FC = () => {
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(12);

  return (
    <Layout>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>The pattern repeats across domains</TitleBlock>
      </H2>

      <div style={{ display: "flex", gap: 28, marginTop: 32, opacity: anim2 }}>
        <div style={{ width: 470 }}>
          <Body size="lg" weight={700} style={{ marginBottom: 10 }}>
            Aviation
          </Body>
          <Body>
            Hard limits, checklists, and layered safety didn’t reduce autonomy — they made delegation safe at scale.
          </Body>
        </div>
        <div style={{ width: 470 }}>
          <Body size="lg" weight={700} style={{ marginBottom: 10 }}>
            Medicine
          </Body>
          <Body>
            Protocols and checklists aren’t an insult to expertise. They’re how experts avoid catastrophic misses under pressure.
          </Body>
        </div>
        <div style={{ width: 470 }}>
          <Body size="lg" weight={700} style={{ marginBottom: 10 }}>
            Organizations
          </Body>
          <Body>
            Delegation requires boundaries: budgets, approval gates, audits, and reviews. Constraints enable autonomy.
          </Body>
        </div>
      </div>
    </Layout>
  );
};

const PromptCeilingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(14);
  const diagramProgress = interpolate(localSec, [1.1, 12.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Layout justify="flex-start" style={{ paddingTop: 45 }}>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>The prompt-engineering ceiling</TitleBlock>
      </H2>
      <Body size="sm" style={{ opacity: anim2, textAlign: "center", maxWidth: 1500 }}>
        Prompts can reduce misbehavior — but not with enough reliability to safely scale in production.
      </Body>
      <div
        style={{
          marginTop: 0,
          width: "100%",
          maxWidth: 1400,
          opacity: anim2,
        }}
      >
        <PromptEngineeringCeilingDiagram theme="light" progress={diagramProgress} style={{ width: "100%", height: "auto" }} />
      </div>
    </Layout>
  );
};

const ManualAssemblyScene: React.FC = () => {
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(12);

  return (
    <Layout>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>The manual assembly problem</TitleBlock>
      </H2>
      <div style={{ marginTop: 34, width: 1500, opacity: anim2 }}>
        <Body size="lg">
          Many teams already add guardrails in Python — schemas, validation, retries, approval gates, sandboxing, secrets hygiene.
        </Body>
        <Body>
          But it’s easy to miss a layer when you’re assembling everything by convention across mismatched systems.
        </Body>
        <Body>
          • Tool schemas + deterministic validation
          <br />
          • Policy enforcement (allowlists, limits, invariants)
          <br />
          • Approval gates for irreversible actions
          <br />
          • Sandboxing + isolation for code and files
          <br />
          • Secrets isolation to prevent credential theft
        </Body>
      </div>
    </Layout>
  );
};

const DefenseInDepthScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(14);

  // Convert to scene-local times
  const cueStartsLocal = ttsStartsSec.map(s => s - scene.startSec);

  // We have 9 segments total (intro + 7 layers)
  // Segments 0-1: intro
  // Segments 2-8: the 7 layers (Cost, Prompt, Context, Model, ToolSelection, Code, Container)
  const introEnd = cueStartsLocal[1] ?? 3;
  const layerStarts = cueStartsLocal.slice(2, 9); // 7 layer start times

  // Map time to progress (0-1) - sweep through all 7 layers
  const lastLayerStart = layerStarts[6] ?? introEnd + 20;
  const diagramProgress = interpolate(
    localSec,
    [introEnd, lastLayerStart + 1.5],  // Start after intro, end after last layer
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Layout justify="flex-start" style={{ paddingTop: 62 }}>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>Guardrails as first-class architecture</TitleBlock>
      </H2>
      <Body style={{ opacity: anim2, textAlign: "center", maxWidth: 1500 }}>
        No single technique solves everything. Guardrails work as defense in depth — layers that each reduce a different class of risk.
      </Body>
      <div style={{ marginTop: -70, width: 1600, opacity: anim2 }}>
        <GuardrailsStackDiagram theme="light" progress={diagramProgress} />
      </div>
    </Layout>
  );
};

const LeastPrivilegeScene: React.FC<{ scene: Scene; ttsStartsSec: number[] }> = ({ scene, ttsStartsSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localSec = frame / fps;
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(14);

  // Convert to scene-local times
  const cueStartsLocal = ttsStartsSec.map(s => s - scene.startSec);

  // We have 6 segments: intro + 5 dimensions
  const introEnd = cueStartsLocal[0] ?? 0;
  const dimensionStarts = cueStartsLocal.slice(1, 6); // 5 dimension start times

  // Map time to progress (0-1) - sweep through all 5 dimensions
  const lastDimensionStart = dimensionStarts[4] ?? introEnd + 10;
  const diagramProgress = interpolate(
    localSec,
    [introEnd + 0.5, lastDimensionStart + 1],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <Layout justify="flex-start" style={{ paddingTop: 62 }}>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>Least privilege by design</TitleBlock>
      </H2>
      <Body style={{ opacity: anim2, textAlign: "center", maxWidth: 1500 }}>
        Tactus enforces least privilege across multiple dimensions—not just tool access, but holistic minimal capability.
      </Body>
      <div style={{ marginTop: 12, width: 1600, opacity: anim2 }}>
        <LeastPrivilegeDiagram theme="light" progress={diagramProgress} />
      </div>
    </Layout>
  );
};

const SandboxBrokerScene: React.FC = () => {
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(14);

  return (
    <Layout justify="flex-start" style={{ paddingTop: 62 }}>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>Keep the monkey in the box</TitleBlock>
      </H2>
      <Body style={{ opacity: anim2, textAlign: "center", maxWidth: 1500 }}>
        Sandbox untrusted orchestration. Keep secrets out of the runtime. Broker privileged calls behind a narrow, auditable boundary.
      </Body>
      <div style={{ marginTop: -34, width: 1600, opacity: anim2 }}>
        <ContainerSandboxDiagram theme="light" />
      </div>
    </Layout>
  );
};

const ExampleScene: React.FC = () => {
  const anim = useIntroAnim(0);
  const anim2 = useIntroAnim(12);

  return (
    <Layout>
      <H2 style={{ opacity: anim, textAlign: "center" }}>
        <TitleBlock>A concrete example: recap emails</TitleBlock>
      </H2>
      <div style={{ marginTop: 34, width: 1500, opacity: anim2 }}>
        <Body size="lg">A safe delegation pattern</Body>
        <Body>
          1) Draft with read-only tools (no side effects).
          <br />
          2) Durable human review: approve / edit / reject.
          <br />
          3) Only after approval does the send tool become available.
        </Body>
      </div>
    </Layout>
  );
};
