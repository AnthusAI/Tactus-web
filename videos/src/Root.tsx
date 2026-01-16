import { Composition } from "remotion";
import { IntroVideo } from "./videos/intro/IntroVideo";
import { getScriptDurationInFrames } from "@/babulus/utils";
import introScript from "@/videos/intro/intro.script.json";

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
    </>
  );
};
