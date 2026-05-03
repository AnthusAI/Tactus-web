import React from "react"
import { colors } from "../lib/theme"

// Font families loaded via Google Fonts CDN
const sourceSans = "'Source Sans 3', sans-serif"
const sourceSerif = "'Source Serif 4', serif"
const sourceMono = "'Source Code Pro', monospace"

interface GlobalStylesProps {
  children: React.ReactNode
  backgroundColor?: string
}

/**
 * GlobalStyles component that applies Tactus branding
 * Loads fonts and provides a styled container for video content
 */
export const GlobalStyles: React.FC<GlobalStylesProps> = ({
  children,
  backgroundColor = colors.bg,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor,
        fontFamily: sourceSerif,
        color: colors.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@600;700;800&family=Source+Serif+4:wght@400;600;700;800;900&family=Source+Code+Pro:wght@400;600&display=swap');
        *,*::before,*::after{transition:none !important;animation:none !important;}
      `}</style>
      {children}
    </div>
  )
}

// Export font families for use in other components
export const fontFamilies = {
  sans: sourceSans,
  serif: sourceSerif,
  mono: sourceMono,
}
