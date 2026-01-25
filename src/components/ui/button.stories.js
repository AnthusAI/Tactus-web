import * as React from "react"
import Button from "./button"
import { Github } from "lucide-react"

export default {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
    size: {
      control: "select",
      options: ["medium", "large"],
    },
    shadow: {
      control: "boolean",
    },
  },
}

export const Primary = {
  args: {
    children: "Get Started",
    variant: "primary",
    size: "medium",
  },
}

export const PrimaryWithShadow = {
  args: {
    children: "Get Started",
    variant: "primary",
    size: "medium",
    shadow: true,
  },
}

export const Secondary = {
  args: {
    children: "View code",
    variant: "secondary",
    size: "medium",
  },
}

export const SecondaryWithShadow = {
  args: {
    children: "View code",
    variant: "secondary",
    size: "medium",
    shadow: true,
  },
}

export const Large = {
  args: {
    children: "Get Started",
    variant: "primary",
    size: "large",
  },
}

// Wrapper to show both themes
const ThemeWrapper = ({ theme, children }) => {
  const style =
    theme === "dark"
      ? {
          "--color-bg": "#18181b",
          "--color-surface": "#27272a",
          "--color-surface-2": "#27272a",
          "--color-card-title": "#1f1f23",
          "--color-text": "#e4e4e7",
          "--color-primary": "#c7007e",
          "--color-primary-ink": "#ffffff",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          padding: "2rem",
        }
      : {
          "--color-bg": "#fdfdfd",
          "--color-surface": "#ffffff",
          "--color-surface-2": "#ededed", // Ensure this is distinct
          "--color-card-title": "#f5f5f5",
          "--color-text": "#27272a",
          "--color-primary": "#c7007e",
          "--color-primary-ink": "#ffffff",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          padding: "2rem",
        }

  return <div style={style}>{children}</div>
}

export const LightModeGrid = () => (
  <ThemeWrapper theme="light">
    <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="primary" shadow>
          Primary (Shadow)
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" shadow>
          Secondary (Shadow)
        </Button>
      </div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button variant="primary" size="large">
          Large
        </Button>
        <Button variant="primary" size="large" shadow>
          Large (Shadow)
        </Button>
        <Button variant="secondary" size="large">
          Secondary
        </Button>
        <Button variant="secondary" size="large" shadow>
          Secondary (Shadow)
        </Button>
      </div>
    </div>
  </ThemeWrapper>
)

export const DarkModeGrid = () => (
  <ThemeWrapper theme="dark">
    <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="primary" shadow>
          Primary (Shadow)
        </Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" shadow>
          Secondary (Shadow)
        </Button>
      </div>
    </div>
  </ThemeWrapper>
)
