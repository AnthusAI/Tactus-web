// Tactus-web Custom Components Bundle
// This bundle extends the Babulus standard library with project-specific components.
// It assumes window.Babulus is already loaded with the standard components.

// Import all custom components
import TestComponent from '../src/components/TestComponent';
import { ParadigmComparison } from '../src/components/ParadigmComparison';
import AnimatedFuchsiaSquare from '../src/components/AnimatedFuchsiaSquare';
import OldWayFlowchartDiagram from '../src/components/diagrams/OldWayFlowchartDiagram';
import NewWayFlowchartDiagram from '../src/components/diagrams/NewWayFlowchartDiagram';
import HumanInTheLoopDiagram from '../src/components/diagrams/HumanInTheLoopDiagram';
import ContainerSandboxDiagram from '../src/components/diagrams/ContainerSandboxDiagram';
import GuardrailsStackDiagram from '../src/components/diagrams/GuardrailsStackDiagram';
import PromptEngineeringCeilingDiagram from '../src/components/diagrams/PromptEngineeringCeilingDiagram';
import { Card } from '../src/components/Card';
import { Body, Code, H2, Subtitle } from '../src/components/Typography';
import { TitleComponent } from '../src/components/TitleComponent';
import { CTASceneBabulus } from '../src/components/CTASceneBabulus';
import { EndScene } from '../src/components/EndScene';
import { HelloWorldScene } from '../src/components/HelloWorldScene';
import { NutshellContent } from '../src/components/NutshellContent';
import { CodePushTransition } from '../src/components/CodePushTransition';

// Use Babulus registration function from the standard bundle
const { registerComponent } = (window as any).Babulus;

if (!registerComponent) {
  throw new Error('Babulus standard bundle must be loaded first (window.Babulus.registerComponent not found)');
}

// Register all Tactus-web custom components
registerComponent('TestComponent', TestComponent);
registerComponent('ParadigmComparison', ParadigmComparison);
registerComponent('AnimatedFuchsiaSquare', AnimatedFuchsiaSquare);
registerComponent('OldWayFlowchartDiagram', OldWayFlowchartDiagram);
registerComponent('NewWayFlowchartDiagram', NewWayFlowchartDiagram);
registerComponent('HumanInTheLoopDiagram', HumanInTheLoopDiagram);
registerComponent('ContainerSandboxDiagram', ContainerSandboxDiagram);
registerComponent('GuardrailsStackDiagram', GuardrailsStackDiagram);
registerComponent('PromptEngineeringCeilingDiagram', PromptEngineeringCeilingDiagram);
registerComponent('Card', Card);
registerComponent('Body', Body);
registerComponent('Code', Code);
registerComponent('H2', H2);
registerComponent('Title', TitleComponent);
registerComponent('Subtitle', Subtitle);
registerComponent('CTAScene', CTASceneBabulus);
registerComponent('EndScene', EndScene);
registerComponent('HelloWorldScene', HelloWorldScene);
registerComponent('NutshellContent', NutshellContent);
registerComponent('CodePushTransition', CodePushTransition);

console.log('[Tactus-web] Custom components registered:', (window as any).Babulus.listComponents());
