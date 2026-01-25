export const DIAGRAM_THEME_VARS = {
  light: {
    "--color-primary": "#c7007e",
    "--color-primary-ink": "#ffffff",
    "--color-bg": "#fdfdfd",
    "--color-surface": "#ffffff",
    "--color-card-title": "#f5f5f5",
    "--color-surface-2": "#ededed",
    "--color-text": "#27272a",
    "--color-text-secondary": "#3f3f46",
    "--color-text-muted": "#52525b",
    "--color-code-bg": "#ededed",
    "--color-code": "#27272a",
    "--border-radius": "8px",
    "--font-sans":
      '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "--font-serif":
      '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    "--font-mono":
      '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  dark: {
    "--color-primary": "#c7007e",
    "--color-primary-ink": "#ffffff",
    "--color-bg": "#18181b",
    "--color-surface": "#27272a",
    "--color-card-title": "#1f1f23",
    "--color-surface-2": "#27272a",
    "--color-text": "#e4e4e7",
    "--color-text-secondary": "#d4d4d8",
    "--color-text-muted": "#a1a1aa",
    "--color-code-bg": "#27272a",
    "--color-code": "#e4e4e7",
    "--border-radius": "8px",
    "--font-sans":
      '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    "--font-serif":
      '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    "--font-mono":
      '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
}

export const diagramTokens = {
  bg: "transparent",
  primary: "var(--color-primary)",
  primaryInk: "var(--color-primary-ink)",
  surface: "var(--color-surface)",
  surface2: "var(--color-surface-2)",
  cardTitle: "var(--color-card-title)",
  ink: "var(--color-text)",
  inkSecondary: "var(--color-text-secondary)",
  muted: "var(--color-text-muted)",
  codeBg: "var(--color-code-bg)",
  code: "var(--color-code)",
  fontSans:
    'var(--font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
  fontSerif:
    'var(--font-serif, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif)',
  fontMono:
    'var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
}

export const getDiagramThemeVars = theme => {
  if (theme === "dark") return DIAGRAM_THEME_VARS.dark
  return DIAGRAM_THEME_VARS.light
}
