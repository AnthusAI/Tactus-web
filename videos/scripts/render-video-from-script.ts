#!/usr/bin/env tsx

// CRITICAL: Register custom components BEFORE any other Babulus imports
// Use the same import path that ComposableRenderer now uses
import { registerComponent, listComponents } from "babulus/renderer/components/registry";

// Import and register all custom components directly
import TestComponent from "../src/components/TestComponent.tsx";
import { ParadigmComparison } from "../src/components/ParadigmComparison.tsx";
import AnimatedFuchsiaSquare from "../src/components/AnimatedFuchsiaSquare.tsx";
import OldWayFlowchartDiagram from "../src/components/diagrams/OldWayFlowchartDiagram.tsx";
import NewWayFlowchartDiagram from "../src/components/diagrams/NewWayFlowchartDiagram.tsx";
import HumanInTheLoopDiagram from "../src/components/diagrams/HumanInTheLoopDiagram.tsx";
import ContainerSandboxDiagram from "../src/components/diagrams/ContainerSandboxDiagram.tsx";
import GuardrailsStackDiagram from "../src/components/diagrams/GuardrailsStackDiagram.tsx";
import PromptEngineeringCeilingDiagram from "../src/components/diagrams/PromptEngineeringCeilingDiagram.tsx";
import { Card } from "../src/components/Card.tsx";
import { Body, Code, H2, Subtitle } from "../src/components/Typography.tsx";
import { TitleComponent } from "../src/components/TitleComponent.tsx";
import { CTASceneBabulus } from "../src/components/CTASceneBabulus.tsx";
import { EndScene } from "../src/components/EndScene.tsx";
import { HelloWorldScene } from "../src/components/HelloWorldScene.tsx";
import { NutshellContent } from "../src/components/NutshellContent.tsx";
import { CodePushTransition } from "../src/components/CodePushTransition.tsx";

console.error("[Render Script] Registering components...");
registerComponent("TestComponent", TestComponent);
registerComponent("ParadigmComparison", ParadigmComparison);
registerComponent("AnimatedFuchsiaSquare", AnimatedFuchsiaSquare);
registerComponent("OldWayFlowchartDiagram", OldWayFlowchartDiagram);
registerComponent("NewWayFlowchartDiagram", NewWayFlowchartDiagram);
registerComponent("HumanInTheLoopDiagram", HumanInTheLoopDiagram);
registerComponent("ContainerSandboxDiagram", ContainerSandboxDiagram);
registerComponent("GuardrailsStackDiagram", GuardrailsStackDiagram);
registerComponent("PromptEngineeringCeilingDiagram", PromptEngineeringCeilingDiagram);
registerComponent("Card", Card);
registerComponent("Body", Body);
registerComponent("Code", Code);
registerComponent("H2", H2);
registerComponent("Title", TitleComponent);
registerComponent("Subtitle", Subtitle);
registerComponent("CTAScene", CTASceneBabulus);
registerComponent("EndScene", EndScene);
registerComponent("HelloWorldScene", HelloWorldScene);
registerComponent("NutshellContent", NutshellContent);
registerComponent("CodePushTransition", CodePushTransition);

const registered = listComponents();
console.error(`[Render Script] Registered ${registered.length} components:`, registered);

// Now safe to import renderer and other modules
import { Command } from "../node_modules/babulus/node_modules/commander/index.js";
import { readFileSync } from "fs";
import { resolve } from "path";
import { renderVideoFromScript } from "../node_modules/babulus/packages/renderer/src/video-render.js";
import type { ScriptData } from "../node_modules/babulus/packages/shared/src/video.js";
import type { TimelineData } from "../node_modules/babulus/packages/shared/src/timeline.js";

const program = new Command();

program
  .name("babulus-render-video")
  .description("Render an MP4 video from a script.json")
  .requiredOption("--script <path>", "Path to script.json")
  .requiredOption("--frames <dir>", "Output directory for PNG frames")
  .requiredOption("--out <path>", "Output MP4 path")
  .option("--timeline <path>", "Optional timeline.json for duration data")
  .option("--audio <path>", "Optional audio file path")
  .option("--title <text>", "Storyboard title")
  .option("--subtitle <text>", "Storyboard subtitle")
  .option("--start <number>", "Start frame", (value) => Number(value), 0)
  .option("--end <number>", "End frame (inclusive)")
  .option("--pattern <pattern>", "Frame filename pattern", "frame-%06d.png")
  .option("--scale <number>", "Device scale factor", (value) => Number(value), 1)
  .option("--workers <number>", "Parallel frame workers (set 1 to disable)", (value) => Number(value))
  .option(
    "--ffmpeg-arg <arg>",
    "Extra ffmpeg argument (repeat for multiple)",
    (value: string, previous: string[]) => [...previous, value],
    [],
  )
  .option("--fps <number>", "Override fps")
  .option("--width <number>", "Override width")
  .option("--height <number>", "Override height")
  .option("--duration <number>", "Override duration frames")
  .option("--no-clean", "Skip cleaning existing frames before rendering (default: clean)")
  .option("--ffmpeg <path>", "ffmpeg binary path", "ffmpeg")
  .action(async (opts) => {
    const scriptPath = resolve(process.cwd(), opts.script);
    const framesDir = resolve(process.cwd(), opts.frames);
    const outputPath = resolve(process.cwd(), opts.out);
    const audioPath = opts.audio ? resolve(process.cwd(), opts.audio) : null;
    const timelinePath = opts.timeline ? resolve(process.cwd(), opts.timeline) : null;

    const script = JSON.parse(readFileSync(scriptPath, "utf8")) as ScriptData;
    const timeline = timelinePath ? (JSON.parse(readFileSync(timelinePath, "utf8")) as TimelineData) : null;
    const endFrame = opts.end == null ? undefined : Number(opts.end);
    const fps = opts.fps == null ? undefined : Number(opts.fps);
    const width = opts.width == null ? undefined : Number(opts.width);
    const height = opts.height == null ? undefined : Number(opts.height);
    const duration = opts.duration == null ? undefined : Number(opts.duration);
    const startFrame = opts.start == null ? undefined : Number(opts.start);
    const workers = opts.workers == null ? undefined : Number(opts.workers);
    const scale = opts.scale == null ? undefined : Number(opts.scale);

    await renderVideoFromScript({
      script,
      timeline,
      title: opts.title,
      subtitle: opts.subtitle,
      framesDir,
      outputPath,
      audioPath,
      framePattern: opts.pattern,
      startFrame,
      endFrame,
      deviceScaleFactor: scale,
      workers,
      ffmpegPath: opts.ffmpeg,
      ffmpegArgs: opts.ffmpegArg,
      fps,
      width,
      height,
      durationFrames: duration,
      cleanFrames: opts.clean !== false, // Commander's --no-clean sets opts.clean to false
    });
    console.error(`write: ${outputPath}`);
  });

program.parse(process.argv);
