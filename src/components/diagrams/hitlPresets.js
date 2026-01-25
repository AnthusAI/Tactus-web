import presets from "../../../shared/hitlPresets.json"

export const HITL_PRESETS = presets

export const getHitlPreset = name => {
  const preset = HITL_PRESETS[name]
  if (!preset) {
    throw new Error(`Unknown HITL preset: ${name}`)
  }
  return preset
}
