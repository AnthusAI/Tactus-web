import { Composition } from "remotion"
import { IntroVideo } from "./videos/intro/IntroVideo"
import { WhyNewLanguageVideo } from "./videos/why-new-language/WhyNewLanguageVideo"
import { GuardrailsVideo } from "./videos/guardrails/GuardrailsVideo"
import { getScriptDurationInFrames } from "@/babulus/utils"
import introScript from "@/videos/intro/intro.script.json"
import whyNewLanguageScript from "@/videos/why-new-language/why-new-language.script.json"
import guardrailsScript from "@/videos/guardrails/guardrails.script.json"

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={IntroVideo}
        durationInFrames={getScriptDurationInFrames(
          introScript,
          introScript.fps ?? 24
        )}
        fps={introScript.fps ?? 24}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
      <Composition
        id="WhyNewLanguage"
        component={WhyNewLanguageVideo}
        durationInFrames={getScriptDurationInFrames(
          whyNewLanguageScript,
          whyNewLanguageScript.fps ?? 24
        )}
        fps={whyNewLanguageScript.fps ?? 24}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
      <Composition
        id="Guardrails"
        component={GuardrailsVideo}
        durationInFrames={getScriptDurationInFrames(
          guardrailsScript,
          guardrailsScript.fps ?? 24
        )}
        fps={guardrailsScript.fps ?? 24}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: null }}
      />
    </>
  )
}
