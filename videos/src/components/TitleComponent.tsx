import React from "react"
import { H2, TitleBlock } from "./Typography"

interface TitleProps {
  text: string
  x?: number
  y?: number
  textAlign?: "left" | "center" | "right"
}

export const TitleComponent: React.FC<TitleProps> = ({
  text,
  x,
  y,
  textAlign = "center",
}) => {
  const content = (
    <H2 style={{ textAlign }}>
      <TitleBlock>{text}</TitleBlock>
    </H2>
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
    transforms.push("translateX(-50%)")
  }

  if (y !== undefined) {
    positionStyle.top = y
    transforms.push("translateY(-50%)")
  }

  if (transforms.length > 0) {
    positionStyle.transform = transforms.join(" ")
  }

  return <div style={positionStyle}>{content}</div>
}
