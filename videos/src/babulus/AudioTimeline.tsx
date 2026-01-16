import React from "react";
import { Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { secondsToFrames } from "@/babulus/utils";
import type { AudioClipFile, AudioClipSfx, AudioClipMusic, AudioTrack, GeneratedTimeline } from "@/babulus/audioTypes";

const resolveClipSrc = (clip: AudioClipFile | AudioClipSfx | AudioClipMusic) => {
  if (clip.kind === "file") {
    return clip.src;
  }
  return clip.src ?? null;
};

const volumeAt = (base: number, envelope: Array<{ atSec: number; volume: number }>, localSec: number) => {
  if (envelope.length === 0) {
    return base;
  }
  const points = envelope;
  if (localSec <= points[0].atSec) {
    return points[0].volume;
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (localSec >= a.atSec && localSec <= b.atSec) {
      const span = b.atSec - a.atSec;
      if (span <= 1e-9) {
        return b.volume;
      }
      const t = (localSec - a.atSec) / span;
      return a.volume + t * (b.volume - a.volume);
    }
  }
  return points[points.length - 1].volume;
};

const AudioClipPlayer: React.FC<{
  clip: AudioClipFile | AudioClipSfx | AudioClipMusic;
  src: string;
}> = ({ clip, src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const baseVolume = clip.volume ?? 1;
  const envelope = clip.volumeEnvelope ?? [];
  // `useCurrentFrame()` is relative to the nearest <Sequence />, so inside the per-clip Sequence
  // it is already "clip-local" (0 at clip start).
  const localSec = frame / fps;
  const v = envelope.length ? volumeAt(baseVolume, envelope, localSec) : baseVolume;
  return <Audio src={staticFile(src)} volume={v} />;
};

export const AudioTimelineLayer: React.FC<{ timeline: GeneratedTimeline }> = ({ timeline }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const tracks = timeline.audio?.tracks ?? [];

  return (
    <>
      {tracks.flatMap((track: AudioTrack) =>
        track.clips.map((clip: AudioClipFile | AudioClipSfx | AudioClipMusic) => {
          const src = resolveClipSrc(clip);
          if (!src) {
            return null;
          }
          const from = secondsToFrames(clip.startSec, fps);
          const volume = clip.volume ?? 1;
          const envelopeKey = clip.volumeEnvelope ? JSON.stringify(clip.volumeEnvelope) : "";
          const remaining = Math.max(1, durationInFrames - from);
          const clipDuration = (() => {
            if ((clip.kind === "sfx" || clip.kind === "music") && clip.chosen?.durationSec != null) {
              return Math.max(1, secondsToFrames(clip.chosen.durationSec, fps));
            }
            if (clip.kind === "file" && clip.durationSec != null) {
              return Math.max(1, secondsToFrames(clip.durationSec, fps));
            }
            return remaining;
          })();
          return (
            <Sequence
              // Include src/volume to force remount on regenerated assets or DSL edits during `babulus generate --watch`.
              key={`${track.id}:${clip.id}:${src}:${volume}:${envelopeKey}`}
              from={from}
              durationInFrames={Math.min(remaining, clipDuration)}
            >
              <AudioClipPlayer clip={clip} src={src} />
            </Sequence>
          );
        })
      )}
    </>
  );
};
