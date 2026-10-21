import "@anthus/tactus-hitl-components/styles.css"
import "./hitl.css"

import { HitlDiagram } from "./hitl-diagram"
import { InstallCommand } from "./install"
import { enhanceReleaseLinks } from "./release-links"
import AnimatedNewWayFlowchartDiagram from "../../src/components/diagrams/AnimatedNewWayFlowchartDiagram"
import AnimatedOldWayFlowchartDiagram from "../../src/components/diagrams/AnimatedOldWayFlowchartDiagram"
import DeepIntegrationDiagram from "../../src/components/diagrams/DeepIntegrationDiagram"
import { coerceValue, lazyIsland, mountReact, reactIsland, registerIslands, takeFollowingCode } from "./mount"
import AnimatedCodeBlock from "../../src/components/animated/AnimatedCodeBlock"
import AnimatedAIEngineersToolboxDiagram from "../../src/components/diagrams/AnimatedAIEngineersToolboxDiagram"
import AnimatedGuardrailsStackDiagram from "../../src/components/diagrams/AnimatedGuardrailsStackDiagram"
import ContainerSandboxDiagram from "../../src/components/diagrams/ContainerSandboxDiagram"
import AnimatedVisualEvaluationsDiagram from "../../src/components/diagrams/AnimatedVisualEvaluationsDiagram"
import AnimatedVisualSpecificationsDiagram from "../../src/components/diagrams/AnimatedVisualSpecificationsDiagram"
import AnimatedVisualValidationDiagram from "../../src/components/diagrams/AnimatedVisualValidationDiagram"
import EmbeddedRuntimeDiagram from "../../src/components/diagrams/EmbeddedRuntimeDiagram"
import EvaluationsDiagram from "../../src/components/diagrams/EvaluationsDiagram"
import HitlReturnsAllDiagram from "../../src/components/diagrams/HitlReturnsAllDiagram"
import LevelZeroEscalationDiagram from "../../src/components/diagrams/LevelZeroEscalationDiagram"
import ProgrammableToolGatewayDiagram from "../../src/components/diagrams/ProgrammableToolGatewayDiagram"
import LeastPrivilegeDiagram from "../../src/components/diagrams/LeastPrivilegeDiagram"
import PromptEngineeringCeilingDiagram from "../../src/components/diagrams/PromptEngineeringCeilingDiagram"
import SidecarChatDiagram from "../../src/components/diagrams/SidecarChatDiagram"
import SpecificationsDiagram from "../../src/components/diagrams/SpecificationsDiagram"

const CODE_BLOCK_DEFAULTS = {
  showTypewriter: false,
  typewriterLoop: false,
  autoHeight: true,
  width: "100%",
  autoPlay: false,
  controls: false,
  loop: false,
}

// The fenced block after the island is the code; AnimatedCodeBlock replaces it.
const codeBlockIsland = (element, props) => {
  const { code, language } = takeFollowingCode(element)
  const attributes = Object.fromEntries(Object.entries(props).map(([name, value]) => [name, coerceValue(value)]))
  mountReact(element, AnimatedCodeBlock, { ...CODE_BLOCK_DEFAULTS, language, ...attributes, code })
}

registerIslands({
  AnimatedAIEngineersToolboxDiagram: reactIsland(AnimatedAIEngineersToolboxDiagram),
  AnimatedNewWayFlowchartDiagram: reactIsland(AnimatedNewWayFlowchartDiagram),
  AnimatedOldWayFlowchartDiagram: reactIsland(AnimatedOldWayFlowchartDiagram),
  DeepIntegrationDiagram: reactIsland(DeepIntegrationDiagram),
  InstallCommand: reactIsland(InstallCommand),
  HitlDiagram: reactIsland(HitlDiagram),
  AnimatedCodeBlock: codeBlockIsland,
  AnimatedGuardrailsStackDiagram: reactIsland(AnimatedGuardrailsStackDiagram),
  ContainerSandboxDiagram: reactIsland(ContainerSandboxDiagram),
  AnimatedVisualEvaluationsDiagram: reactIsland(AnimatedVisualEvaluationsDiagram),
  AnimatedVisualSpecificationsDiagram: reactIsland(AnimatedVisualSpecificationsDiagram),
  AnimatedVisualValidationDiagram: reactIsland(AnimatedVisualValidationDiagram),
  EmbeddedRuntimeDiagram: reactIsland(EmbeddedRuntimeDiagram),
  EvaluationsDiagram: reactIsland(EvaluationsDiagram),
  HitlReturnsAllDiagram: reactIsland(HitlReturnsAllDiagram),
  HitlDemo: lazyIsland(() => import("./hitl-demo")),
  LeastPrivilegeDiagram: reactIsland(LeastPrivilegeDiagram),
  LevelZeroEscalationDiagram: reactIsland(LevelZeroEscalationDiagram),
  PromptEngineeringCeilingDiagram: reactIsland(PromptEngineeringCeilingDiagram),
  ProgrammableToolGatewayDiagram: reactIsland(ProgrammableToolGatewayDiagram),
  ReleaseLinks: enhanceReleaseLinks,
  SidecarChatDiagram: reactIsland(SidecarChatDiagram),
  SpecificationsDiagram: reactIsland(SpecificationsDiagram),
})
