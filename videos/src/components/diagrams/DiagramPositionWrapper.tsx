import React from "react"

export type DiagramPositionWrapperProps = {
  children: React.ReactNode
  x?: number
  y?: number
  scale?: number
  containerWidth?: number
  containerHeight?: number
}

export const DiagramPositionWrapper: React.FC<DiagramPositionWrapperProps> = ({
  children,
  x,
  y,
  scale = 1,
  containerWidth,
  containerHeight,
}) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: x ?? 0,
    top: y ?? 0,
    width: containerWidth ?? "100%",
    height: containerHeight ?? "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transformOrigin: "center",
  }

  const transforms: string[] = []
  if (x !== undefined || y !== undefined) {
    transforms.push("translate(-50%, -50%)")
  }
  if (scale !== 1) {
    transforms.push(`scale(${scale})`)
  }
  if (transforms.length > 0) {
    style.transform = transforms.join(" ")
  }

  return <div style={style}>{children}</div>
}

export default DiagramPositionWrapper
