import { defineDefaults, defineEnv, pause } from "babulus/dsl";
import type { PauseSpec } from "babulus/dsl";

const env = defineEnv();

export const sharedDefaults = defineDefaults({
  voiceover: {
    provider: env.value("openai", { aws: "aws", azure: "azure", production: "elevenlabs" }),
    model: env.value<string | null>(null, { development: "gpt-4o-mini-tts", production: "eleven_v3" }),
    voice: env.value<string | null>(null, { development: "echo", production: "iE8bC87uXfqLphg7Abzw" }),
    sampleRateHz: env.value(24000, { aws: 16000, production: 44100 }),
    leadInSeconds: 0.25,
    trimEndSeconds: 0,
    pauseBetweenItems: pause(0.18, 0.07, { min: 0.06, max: 0.5 }),
    pronunciationDictionary: { name: "tactus" },
    pronunciations: [
      { grapheme: "Tactus", phoneme: "T AE1 K T AH0 S", alphabet: "cmu-arpabet" },
    ],
  },
  audioProviders: {
    sfx: env.value("dry-run", { production: "elevenlabs" }),
    music: env.value("dry-run", { production: "elevenlabs" }),
  },
});

export type VoiceToken = string | number | PauseSpec;

const isPauseSpec = (value: unknown): value is PauseSpec => {
  if (!value || typeof value !== "object") return false;
  const spec = value as PauseSpec;
  return spec.kind === "pause" && (spec.mode === "fixed" || spec.mode === "gaussian");
};

export const voiceSegments = (
  voice: {
    say: (text: string, opts?: { trimEndSeconds?: number }) => void;
    pause: (seconds: number, std?: number, clamp?: { min?: number; max?: number }) => void;
  },
  segments: VoiceToken[],
): void => {
  for (const seg of segments) {
    if (typeof seg === "string") {
      voice.say(seg);
      continue;
    }
    if (typeof seg === "number") {
      voice.pause(seg);
      continue;
    }
    if (isPauseSpec(seg)) {
      if (seg.mode === "fixed") {
        voice.pause(seg.seconds);
      } else {
        voice.pause(seg.mean, seg.std, { min: seg.min, max: seg.max });
      }
    }
  }
};

export const t = (strings: TemplateStringsArray, ...values: Array<string | number>): string => {
  let out = "";
  for (let i = 0; i < strings.length; i += 1) {
    out += strings[i] ?? "";
    if (i < values.length) {
      out += String(values[i] ?? "");
    }
  }
  return out.replace(/\s*\n\s*/g, " ").trim();
};
