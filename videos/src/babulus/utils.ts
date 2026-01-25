import type { CuePoint, Scene, Script } from "@/babulus/types"

export const secondsToFrames = (seconds: number, fps: number) =>
  Math.round(seconds * fps)

export const slugifyId = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled"

export const getScriptEndSec = (script: Script) => {
  if (script.scenes.length === 0) {
    throw new Error("Script has no scenes")
  }
  return Math.max(...script.scenes.map(s => s.endSec))
}

export const getScriptDurationInFrames = (script: Script, fps: number) =>
  secondsToFrames(getScriptEndSec(script), fps)

export const getSceneById = (script: Script, id: string) => {
  const scene = script.scenes.find(s => s.id === id)
  if (!scene) {
    throw new Error(`Scene not found: ${id}`)
  }
  return scene
}

export const getCueById = (scene: Scene, id: string) => {
  const cue = scene.cues.find(c => c.id === id)
  if (!cue) {
    throw new Error(`Cue not found: ${scene.id}.${id}`)
  }
  return cue
}

export const getActiveCue = (
  scene: Scene,
  timeSec: number
): CuePoint | null => {
  for (const cue of scene.cues) {
    if (timeSec >= cue.startSec && timeSec < cue.endSec) {
      return cue
    }
  }
  return null
}
