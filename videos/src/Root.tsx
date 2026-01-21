import { Composition } from "remotion";
import { IntroVideo } from "./videos/intro/IntroVideo";
import { WhyNewLanguageVideo } from "./videos/why-new-language/WhyNewLanguageVideo";
import { GuardrailsVideo } from "./videos/guardrails/GuardrailsVideo";
import { getScriptDurationInFrames } from "@/babulus/utils";
import introScript from "@/videos/intro/intro.script.json";
import whyNewLanguageScript from "@/videos/why-new-language/why-new-language.script.json";
import guardrailsScript from "@/videos/guardrails/guardrails.script.json";

const FPS = 24;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={IntroVideo}
        durationInFrames={getScriptDurationInFrames(introScript, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
      <Composition
        id="WhyNewLanguage"
        component={WhyNewLanguageVideo}
        durationInFrames={getScriptDurationInFrames(whyNewLanguageScript, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
      <Composition
        id="Guardrails"
        component={GuardrailsVideo}
        durationInFrames={getScriptDurationInFrames(guardrailsScript, FPS)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
    </>
  );
};
