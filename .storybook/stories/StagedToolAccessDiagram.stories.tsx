import type { Meta, StoryObj } from "@storybook/react";
import StagedToolAccessDiagram from "../../src/components/diagrams/StagedToolAccessDiagram";

const withForcedBackground = (backgroundColor: string) => (Story: any) => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      backgroundColor,
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
  decorators: [withForcedBackground("#fdfdfd")],
};

export const WebsiteDark: Story = {
  args: {
    theme: "dark",
  },
  decorators: [withForcedBackground("#18181b")],
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

