import React from "react";
import { Sequence, useVideoConfig, spring, useCurrentFrame } from "remotion";
import { GlobalStyles } from "../../components/GlobalStyles";
import { Layout } from "../../components/Layout";
import { Body, H2, TitleBlock } from "../../components/Typography";
import { Card } from "../../components/Card";
import type { Scene, Script } from "@/babulus/types";
import { secondsToFrames } from "@/babulus/utils";
import procedureSandboxingScript from "./procedure-sandboxing.script.json";
import ContainerSandboxDiagram from "../../components/diagrams/ContainerSandboxDiagram";

export type ProcedureSandboxingVideoProps = {
  script?: Script;
};

export const ProcedureSandboxingVideo: React.FC<ProcedureSandboxingVideoProps> = ({
  script = procedureSandboxingScript as Script,
}) => {
  const { fps } = useVideoConfig();

  const renderScene = (scene: Scene) => {
    switch (scene.id) {
      case "title_card":
        return <TitleCardScene />;
      case "threat_model":
        return <ThreatModelScene />;
      case "diagram":
        return <DiagramScene />;
      case "takeaways":
        return <TakeawaysScene />;
      default:
        return null;
    }
  };

  return (
    <GlobalStyles>
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

const TitleCardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const anim = spring({ frame, fps, config: { damping: 120, stiffness: 240, mass: 0.6 } });

  return (
    <Layout>
      <H2 style={{ opacity: anim, transform: `scale(${0.92 + anim * 0.08})` }}>
        <TitleBlock>Sandboxed Procedures</TitleBlock>
      </H2>
      <Body size="lg" style={{ opacity: anim, marginTop: 28, textAlign: "center" }}>
        Lua sandboxing + container isolation + a secretless broker boundary
      </Body>
    </Layout>
  );
};

const ThreatModelScene: React.FC = () => {
  return (
    <Layout>
      <H2>
        <TitleBlock>What we’re defending against</TitleBlock>
      </H2>
      <Card style={{ marginTop: 34, width: 1300 }}>
        <Body size="lg">
          If an agent runtime has API keys, a prompt injection can try to make it <strong>steal</strong> them and ship them to the
          internet. Containers help, but the real question is: <em>where are the secrets?</em>
        </Body>
        <div style={{ height: 18 }} />
        <Body>
          • Treat orchestration as untrusted
          <br />
          • Remove ambient authority (no broad filesystem/network access)
          <br />
          • Keep credentials out of the runtime entirely
        </Body>
      </Card>
    </Layout>
  );
};

const DiagramScene: React.FC = () => {
  return (
    <Layout>
      <H2>
        <TitleBlock>Lua sandbox inside a container</TitleBlock>
      </H2>
      <div style={{ marginTop: 36, width: 1500 }}>
        <ContainerSandboxDiagram theme="light" />
      </div>
    </Layout>
  );
};

const TakeawaysScene: React.FC = () => {
  return (
    <Layout>
      <H2>
        <TitleBlock>Takeaways</TitleBlock>
      </H2>
      <Card style={{ marginTop: 34, width: 1300 }}>
        <Body size="lg">
          1) Lua sandboxing constrains what untrusted orchestration code can do.
          <br />
          2) Containers reduce blast radius and cross-run leakage.
          <br />
          3) A secretless, networkless runtime forces privileged work through a trusted broker.
        </Body>
      </Card>
    </Layout>
  );
};
