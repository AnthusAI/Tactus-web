import React from "react"

export type NutshellContentProps = {
  frame?: number
  fps?: number
}

export const NutshellContent: React.FC<NutshellContentProps> = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 100,
      }}
    >
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 50,
          fontWeight: 600,
          color: "#c7007e",
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        A programming language for getting things done with agents
      </div>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: 50,
          fontWeight: 600,
          color: "#c7007e",
          textAlign: "center",
          maxWidth: 1200,
        }}
      >
        Give the agent tools and a procedure—keep it sandboxed and contained
      </div>
    </div>
  )
}

export default NutshellContent
