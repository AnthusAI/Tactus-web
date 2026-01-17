import { Composition } from "remotion";
import { IntroVideo } from "./videos/intro/IntroVideo";
import { WhyNewLanguageVideo } from "./videos/why-new-language/WhyNewLanguageVideo";
import { ProcedureSandboxingVideo } from "./videos/procedure-sandboxing/ProcedureSandboxingVideo";
import { getScriptDurationInFrames } from "@/babulus/utils";
import introScript from "@/videos/intro/intro.script.json";
import whyNewLanguageScript from "@/videos/why-new-language/why-new-language.script.json";
import procedureSandboxingScript from "@/videos/procedure-sandboxing/procedure-sandboxing.script.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={IntroVideo}
        durationInFrames={getScriptDurationInFrames(introScript, 30)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
      <Composition
        id="WhyNewLanguage"
        component={WhyNewLanguageVideo}
        durationInFrames={getScriptDurationInFrames(whyNewLanguageScript, 30)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
      <Composition
        id="ProcedureSandboxing"
        component={ProcedureSandboxingVideo}
        durationInFrames={getScriptDurationInFrames(procedureSandboxingScript, 30)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
