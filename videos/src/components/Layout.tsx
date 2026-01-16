import React, { CSSProperties } from "react";
import { colors, spacing } from "../lib/theme";

interface LayoutProps {
  children: React.ReactNode;
  padding?: keyof typeof spacing;
  align?: "flex-start" | "center" | "flex-end";
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  style?: CSSProperties;
}

/**
 * Layout component for consistent spacing and alignment
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  padding = 5,
  align = "center",
  justify = "center",
  style,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        justifyContent: justify,
        width: "100%",
        height: "100%",
        padding: spacing[padding],
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  style?: CSSProperties;
}

/**
 * Container component for content width constraint
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 1200,
  style,
}) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth,
        margin: "0 auto",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
