export type AudioClipFile = {
  id: string
  kind: "file"
  startSec: number
  src: string
  durationSec?: number
  volume?: number
  volumeEnvelope?: Array<{ atSec: number; volume: number }>
}

export type GeneratedAudioVariant = {
  variant: number
  seed: number
  path: string
  durationSec: number
}

export type AudioClipSfx = {
  id: string
  kind: "sfx"
  startSec: number
  volume?: number
  volumeEnvelope?: Array<{ atSec: number; volume: number }>
  src?: string | null
  chosen?: GeneratedAudioVariant
  selectionPath?: string
  variants?: GeneratedAudioVariant[]
}

export type AudioClipMusic = {
  id: string
  kind: "music"
  startSec: number
  volume?: number
  volumeEnvelope?: Array<{ atSec: number; volume: number }>
  src?: string | null
  chosen?: GeneratedAudioVariant
  variants?: GeneratedAudioVariant[]
  playThrough?: boolean
}

export type AudioTrack = {
  id: string
  kind: string
  clips: Array<AudioClipFile | AudioClipSfx | AudioClipMusic>
}

export type AudioTimeline = {
  tracks: AudioTrack[]
}

export type GeneratedTimeline = {
  items: unknown[]
  audio?: AudioTimeline
}
