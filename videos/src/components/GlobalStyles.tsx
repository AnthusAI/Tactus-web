import React from "react";
import { AbsoluteFill, getRemotionEnvironment } from "remotion";
import { loadFont } from "@remotion/google-fonts/SourceSans3";
import { loadFont as loadSerif } from "@remotion/google-fonts/SourceSerif4";
import { loadFont as loadMono } from "@remotion/google-fonts/SourceCodePro";
import { colors } from "../lib/theme";

// Load Google Fonts
const { fontFamily: sourceSans } = loadFont("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});
const { fontFamily: sourceSerif } = loadSerif("normal", {
  weights: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const { fontFamily: sourceMono } = loadMono("normal", {
  weights: ["400", "600"],
  subsets: ["latin"],
});

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
  const { isRendering } = getRemotionEnvironment();
  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        fontFamily: sourceSerif,
        color: colors.text,
      }}
    >
      {isRendering ? (
        <style>{`*,*::before,*::after{transition:none !important;animation:none !important;}`}</style>
      ) : null}
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
