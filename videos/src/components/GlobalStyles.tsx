import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/SourceSans3";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadMono } from "@remotion/google-fonts/SourceCodePro";
import { colors } from "../lib/theme";

// Load Google Fonts
const { fontFamily: sourceSans } = loadFont();
const { fontFamily: sourceSerif } = loadSerif();
const { fontFamily: sourceMono } = loadMono();

interface GlobalStylesProps {
  children: React.ReactNode;
  backgroundColor?: string;
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
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: sourceSerif,
        color: colors.text,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Export font families for use in other components
export const fontFamilies = {
  sans: sourceSans,
  serif: sourceSerif,
  mono: sourceMono,
};
