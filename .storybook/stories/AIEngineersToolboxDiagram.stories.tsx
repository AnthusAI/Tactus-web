import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import AIEngineersToolboxDiagram from "../../src/components/diagrams/AIEngineersToolboxDiagram";
import { getDiagramThemeVars } from "../../src/components/diagrams/diagramTheme";

const withForcedBackground = (theme: "light" | "dark") => (Story: any) => (
  <div
    style={{
      ...getDiagramThemeVars(theme),
      width: "100vw",
      height: "100vh",
      backgroundColor: "var(--color-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      boxSizing: "border-box",
    }}
  >
    <div style={{ width: "min(1100px, 96vw)" }}>
      <Story />
    </div>
  </div>
);

const meta = {
  title: "Diagrams/AIEngineersToolboxDiagram",
  component: AIEngineersToolboxDiagram,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AIEngineersToolboxDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper for animation
const AnimatedDemo = ({ theme }: { theme: "light" | "dark" }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const durationMs = 16000; // 4 tools * 4s each = 16s

    const tick = (now: number) => {
      const t = ((now - start) % durationMs) / durationMs;
      setProgress(t);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <AIEngineersToolboxDiagram theme={theme} progress={progress} />;
};

export const WebsiteLight: Story = {
  render: () => <AnimatedDemo theme="light" />,
  decorators: [withForcedBackground("light")],
};

export const WebsiteDark: Story = {
  render: () => <AnimatedDemo theme="dark" />,
  decorators: [withForcedBackground("dark")],
};

export const Video: Story = {
  args: {
    theme: "light",
    progress: 0,
  },
  parameters: {
    videoCanvas: {
      enabled: true,
      showGuides: true,
      width: 3840,
      height: 2160,
    },
  },
};
