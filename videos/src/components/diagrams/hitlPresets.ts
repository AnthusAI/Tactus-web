import presets from "../../../../shared/hitlPresets.json"

export const HITL_PRESETS = presets as Record<
  string,
  {
    id: string
    label: string
    scenario: string
    config: Record<string, unknown>
    recommendedStartAtMs?: number
  }
>
