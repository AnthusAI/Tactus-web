import React, { CSSProperties } from "react";
import { colors, spacing, borderRadius } from "../lib/theme";

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  variant?: "surface" | "muted";
  style?: CSSProperties;
}

/**
 * Card component - Surface with elevation
 */
export const Card: React.FC<CardProps> = ({
  children,
  padding = 4,
  variant = "surface",
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: variant === "muted" ? colors.surface2 : colors.surface,
        padding: spacing[padding],
        borderRadius,
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: variant === "muted" 
          ? "0 1px 3px rgba(0, 0, 0, 0.05)" 
          : "0 2px 8px rgba(0,0,0,0.05)",
        color: variant === "muted" ? colors.textMuted : colors.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface CodeBlockProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  style?: CSSProperties;
}

/**
 * CodeBlock component - Styled container for code
 */
export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  padding = 4,
  style,
}) => {
  return (
    <div
      style={{
        backgroundColor: colors.codeBg,
        padding: spacing[padding],
        borderRadius,
        border: "1px solid rgba(0,0,0,0.05)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
