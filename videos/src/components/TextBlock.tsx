import React from "react"
import { colors, lineHeights } from "../lib/theme"
import { fontFamilies } from "./GlobalStyles"

export type TextBlockProps = {
  text: string
  size?: number
  weight?: number
  x?: number
  y?: number
  maxWidth?: number
  align?: "left" | "center" | "right"
  color?: string
  font?: "serif" | "sans" | "mono"
  lineHeight?: number
  background?: string
  padding?: number
  borderRadius?: number
  border?: string
  anchor?: "center" | "top-left"
  style?: React.CSSProperties
}

export const TextBlock: React.FC<TextBlockProps> = ({
  text,
  size = 40,
  weight = 400,
  x,
  y,
  maxWidth,
  align = "left",
  color = colors.text,
  font = "serif",
  lineHeight = lineHeights.loose,
  background,
  padding,
  borderRadius,
  border,
  anchor = "center",
  style,
}) => {
  const fontFamily =
    font === "mono"
      ? fontFamilies.mono
      : font === "sans"
      ? fontFamilies.sans
      : fontFamilies.serif

  const content = (
    <div
      style={{
        fontFamily,
        fontSize: size,
        fontWeight: weight,
        lineHeight,
        color,
        textAlign: align,
        maxWidth,
        whiteSpace: "pre-wrap",
        background,
        padding,
        borderRadius,
        border,
        ...style,
      }}
    >
      {text}
    </div>
  )

  if (x === undefined && y === undefined) {
    return content
  }

  const positionStyle: React.CSSProperties = {
    position: "absolute",
  }

  const transforms: string[] = []

  if (x !== undefined) {
    positionStyle.left = x
    if (anchor === "center") {
      transforms.push("translateX(-50%)")
    }
  }

  if (y !== undefined) {
    positionStyle.top = y
    if (anchor === "center") {
      transforms.push("translateY(-50%)")
    }
  }

  if (transforms.length > 0) {
    positionStyle.transform = transforms.join(" ")
  }

  return <div style={positionStyle}>{content}</div>
}

export default TextBlock
