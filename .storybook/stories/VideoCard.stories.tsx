import type { Meta, StoryObj } from "@storybook/react"
import VideoCard from "../../src/components/media/VideoCard"
import { getDiagramThemeVars } from "../../src/components/diagrams/diagramTheme"

const meta = {
  title: "Media/VideoCard",
  component: VideoCard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VideoCard>

export default meta
type Story = StoryObj<typeof meta>

const withPage = (theme: "light" | "dark") => (StoryComponent: any) => (
  <div
    style={{
      ...getDiagramThemeVars(theme),
      minHeight: "100vh",
      backgroundColor: "var(--color-bg)",
      padding: 24,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
    }}
  >
    <div style={{ width: "min(520px, 96vw)" }}>
      <StoryComponent />
    </div>
  </div>
)

export const Light: Story = {
  args: {
    title: "Why a New Language?",
    meta: "7 min",
    description: "The evolution of programming paradigms and why Tactus was created for the age of AI agents.",
    poster: "why-new-language-poster.jpg",
    to: "/videos/#why-new-language",
  },
  decorators: [withPage("light")],
}

export const Compact: Story = {
  args: {
    title: "Guardrails for Agent Autonomy",
    description: "Why constraints enable autonomy: staged tools, human gates, and a secretless broker boundary.",
    poster: "intro-poster.jpg",
    to: "/videos/#guardrails",
    variant: "compact",
  },
  decorators: [withPage("light")],
}

