import { HitlDiagram } from "./hitl-diagram"
import { InstallCommand } from "./install"
import AnimatedNewWayFlowchartDiagram from "../../src/components/diagrams/AnimatedNewWayFlowchartDiagram"
import AnimatedOldWayFlowchartDiagram from "../../src/components/diagrams/AnimatedOldWayFlowchartDiagram"
import DeepIntegrationDiagram from "../../src/components/diagrams/DeepIntegrationDiagram"
import { ENHANCERS, mountIslands } from "./mount"
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

const ISLANDS = {
  AnimatedAIEngineersToolboxDiagram,
  AnimatedNewWayFlowchartDiagram,
  AnimatedOldWayFlowchartDiagram,
  DeepIntegrationDiagram,
  InstallCommand,
  HitlDiagram,
  AnimatedCodeBlock,
  AnimatedGuardrailsStackDiagram,
  ContainerSandboxDiagram,
  AnimatedVisualEvaluationsDiagram,
  AnimatedVisualSpecificationsDiagram,
  AnimatedVisualValidationDiagram,
  EmbeddedRuntimeDiagram,
  EvaluationsDiagram,
  HitlReturnsAllDiagram,
  LeastPrivilegeDiagram,
  LevelZeroEscalationDiagram,
  PromptEngineeringCeilingDiagram,
  ProgrammableToolGatewayDiagram,
  SidecarChatDiagram,
  SpecificationsDiagram,
}


mountIslands(ISLANDS, ENHANCERS)
