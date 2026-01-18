import React, { CSSProperties } from "react";
import { colors, spacing, lineHeights, borderRadius } from "../lib/theme";
import { fontFamilies } from "./GlobalStyles";

export const TitleBlock: React.FC<{ children: React.ReactNode; style?: CSSProperties }> = ({ 
  children, 
  style 
}) => (
  <span style={{ 
    display: "inline-block", 
    padding: "0.18em 0.22em", 
    backgroundColor: colors.primary, 
    color: colors.primaryInk,
    lineHeight: 1,
    ...style
  }}>
    {children}
  </span>
);

interface HeadingProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

/**
 * H1 component - Uses Source Serif 4
 */
export const H1: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h1
      style={{
        fontFamily: fontFamilies.serif,
        fontSize: 120,
        fontWeight: 700,
        lineHeight: lineHeights.dense,
        letterSpacing: "-0.02em",
        color: colors.text,
        margin: 0,
        marginBottom: spacing[5],
        ...style,
      }}
    >
      {children}
    </h1>
  );
};

/**
 * H2 component - Uses Source Sans 3
 */
export const H2: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h2
      style={{
        fontFamily: fontFamilies.sans,
        fontSize: 90,
        fontWeight: 700,
        lineHeight: lineHeights.dense,
        letterSpacing: "-0.02em",
        color: colors.text,
        margin: 0,
        marginBottom: spacing[3],
        ...style,
      }}
    >
      {children}
    </h2>
  );
};

/**
 * H3 component - Uses Source Sans 3
 */
export const H3: React.FC<HeadingProps> = ({ children, style }) => {
  return (
    <h3
      style={{
        fontFamily: fontFamilies.sans,
        fontSize: 60,
        fontWeight: 700,
        lineHeight: lineHeights.dense,
        letterSpacing: "-0.02em",
        color: colors.text,
        margin: 0,
        marginBottom: spacing[3],
        ...style,
      }}
    >
      {children}
    </h3>
  );
};

interface BodyProps {
  children: React.ReactNode;
  size?: "lg" | "md" | "sm" | "xl";
  weight?: number;
  style?: CSSProperties;
}

/**
 * Body text component - Uses Source Serif 4
 */
export const Body: React.FC<BodyProps> = ({ children, size = "md", weight = 400, style }) => {
  const fontSize = size === "xl" ? 60 : size === "lg" ? 50 : size === "md" ? 40 : 32;

  return (
    <p
      style={{
        fontFamily: fontFamilies.serif,
        fontSize,
        fontWeight: weight,
        lineHeight: lineHeights.loose,
        color: colors.text,
        margin: 0,
        marginBottom: spacing[3],
        ...style,
      }}
    >
      {children}
    </p>
  );
};

interface CodeProps {
  children: React.ReactNode;
  inline?: boolean;
  style?: CSSProperties;
}

/**
 * Code component - Uses Source Code Pro
 */
export const Code: React.FC<CodeProps> = ({
  children,
  inline = false,
  style,
}) => {
  if (inline) {
    return (
      <code
        style={{
          fontFamily: fontFamilies.mono,
          fontSize: "0.85em",
          backgroundColor: colors.codeBg,
          color: colors.codeInline,
          padding: "0.2em 0.4em",
          borderRadius: 4,
          ...style,
        }}
      >
        {children}
      </code>
    );
  }

  return (
    <pre
      style={{
        fontFamily: fontFamilies.mono,
        fontSize: 32,
        lineHeight: lineHeights.normal,
        backgroundColor: colors.codeBg,
        color: colors.code,
        padding: spacing[4],
        borderRadius,
        margin: 0,
        overflow: "auto",
        ...style,
      }}
    >
      <code>{children}</code>
    </pre>
  );
};

interface SubtitleProps {
  children: React.ReactNode;
  style?: CSSProperties;
}

/**
 * Subtitle component - Uses Source Sans 3 with primary color
 */
export const Subtitle: React.FC<SubtitleProps> = ({ children, style }) => {
  return (
    <p
      style={{
        fontFamily: fontFamilies.sans,
        fontSize: 50,
        fontWeight: 600,
        lineHeight: lineHeights.normal,
        color: colors.primary,
        margin: 0,
        ...style,
      }}
    >
      {children}
    </p>
  );
};
