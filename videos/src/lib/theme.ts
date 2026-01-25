/**
 * Tactus Brand Theme
 * Design tokens from Tactus website (light mode)
 */

export const colors = {
  // Brand
  primary: "#c7007e",
  primaryInk: "#ffffff",

  // Surfaces - Softened "Paper" Tones
  bg: "#fdfdfd",
  surface: "#ffffff",
  surface2: "#f4f4f5",
  text: "#27272a",
  textMuted: "#52525b",

  // Code
  codeBg: "#f4f4f5",
  code: "#27272a",
  codeInline: "#c7007e",
} as const

export const fonts = {
  // Source Sans 3 for UI/Headers
  sans: '"Source Sans 3", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  // Source Serif 4 for Body/Reading
  serif:
    '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  // Source Code Pro for Code
  mono: '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
} as const

export const fontSizes = {
  lg: 18,
  md: 16,
  sm: 14,
  sx: 12,
} as const

export const lineHeights = {
  loose: 1.75,
  normal: 1.6,
  dense: 1.1,
} as const

export const spacing = {
  1: 4,
  2: 8,
  3: 16,
  4: 24,
  5: 32,
  6: 64,
} as const

export const borderRadius = 8

export const theme = {
  colors,
  fonts,
  fontSizes,
  lineHeights,
  spacing,
  borderRadius,
} as const

export type Theme = typeof theme
