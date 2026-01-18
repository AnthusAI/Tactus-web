import type { Meta, StoryObj } from "@storybook/react"
import BookCard from "../../src/components/media/BookCard"
import { BOOKS } from "../../src/content/books"
import { getDiagramThemeVars } from "../../src/components/diagrams/diagramTheme"

const meta = {
  title: "Media/BookCard",
  component: BookCard,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BookCard>

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

export const LearningTactus: Story = {
  args: {
    title: BOOKS[0].title,
    description: BOOKS[0].description,
    coverSrc: BOOKS[0].coverSrc,
    href: BOOKS[0].href,
    pdf: BOOKS[0].pdf,
    repo: BOOKS[0].repo,
  },
  decorators: [withPage("light")],
}

