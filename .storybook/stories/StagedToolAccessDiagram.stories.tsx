import type { Meta, StoryObj } from "@storybook/react";
import StagedToolAccessDiagram from "../../src/components/diagrams/StagedToolAccessDiagram";
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
  title: "Diagrams/StagedToolAccessDiagram",
  component: StagedToolAccessDiagram,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StagedToolAccessDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebsiteLight: Story = {
  args: {
    theme: "light",
  },
  decorators: [withForcedBackground("light")],
};

export const WebsiteDark: Story = {
  args: {
    theme: "dark",
  },
  decorators: [withForcedBackground("dark")],
};

export const Video: Story = {
  args: {
    theme: "light",
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
