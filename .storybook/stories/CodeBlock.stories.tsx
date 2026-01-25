import type { Meta, StoryObj } from "@storybook/react"
import { AnimatedCodeBlock } from "../../src/components/animated/AnimatedCodeBlock"

// Decorator to force background colors
const withForcedBackground = (backgroundColor: string) => (Story: any) =>
  (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Story />
    </div>
  )

/**
 * CodeBlock stories for auditioning components in different contexts.
 *
 * Each component has three story variants:
 * 1. Website Light Mode - How it appears on the website in light mode
 * 2. Website Dark Mode - How it appears on the website in dark mode
 * 3. Video Mode - How it appears in videos (light mode, with 4K canvas and guides)
 *
 * These stories use the same Remotion composition across all contexts,
 * ensuring consistent animation behavior.
 */
const meta = {
  title: "Video Components/CodeBlock",
  component: AnimatedCodeBlock,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AnimatedCodeBlock>

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Hello World - Three Variants
// ============================================================================

const helloWorldBaseArgs = {
  label: "Hello World in Tactus",
  code: `print("Hello, World!")`,
  filename: "hello_world.tac",
  hint: "Basic output",
  startTime: 0,
  language: "tactus",
  showTypewriter: true,
  typewriterDelay: 0.5,
  typewriterSpeed: 0.25,
  typewriterLoop: true, // Loop the typing: types, pauses, restarts
  typewriterEndDelay: 1.5, // 1.5 second pause after typing before restarting
  controls: false,
  autoPlay: true,
  playbackRate: 1,
}

/**
 * Hello World - Website Light Mode
 * How the component appears on the website in light mode.
 */
export const HelloWorldWebsiteLight: Story = {
  args: {
    ...helloWorldBaseArgs,
    blockHeight: 300,
    blockWidth: 800,
    width: 800,
    height: 300,
    theme: "light",
  },
  decorators: [withForcedBackground("#fdfdfd")],
}

/**
 * Hello World - Website Dark Mode
 * How the component appears on the website in dark mode.
 */
export const HelloWorldWebsiteDark: Story = {
  args: {
    ...helloWorldBaseArgs,
    blockHeight: 300,
    blockWidth: 800,
    width: 800,
    height: 300,
    theme: "dark",
  },
  decorators: [withForcedBackground("#18181b")],
}

/**
 * Hello World - Video Mode
 * How the component appears in videos (4K canvas with guides).
 */
export const HelloWorldVideo: Story = {
  args: {
    ...helloWorldBaseArgs,
    blockHeight: 300,
    blockWidth: 1000,
    width: 1000,
    height: 300,
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
}

// ============================================================================
// Multi-line Example - Three Variants
// ============================================================================

const multiLineBaseArgs = {
  label: "Function Definition",
  code: `fn greet(name: String) -> String {
  return "Hello, " + name + "!"
}

let message = greet("World")
print(message)`,
  filename: "greet.tac",
  hint: "Function",
  startTime: 0,
  language: "tactus",
  showTypewriter: true,
  typewriterDelay: 0.5,
  typewriterSpeed: 0.25,
  typewriterLoop: false, // Don't loop - type once and stay visible
  typewriterEndDelay: 2.0, // Show completed text for 2 seconds (not used when loop=false)
  controls: false,
  autoPlay: true,
  playbackRate: 1,
}

/**
 * Multi-line Example - Website Light Mode
 */
export const MultiLineWebsiteLight: Story = {
  args: {
    ...multiLineBaseArgs,
    blockHeight: 500,
    blockWidth: 900,
    width: 900,
    height: 500,
    theme: "light",
  },
  decorators: [withForcedBackground("#fdfdfd")],
}

/**
 * Multi-line Example - Website Dark Mode
 */
export const MultiLineWebsiteDark: Story = {
  args: {
    ...multiLineBaseArgs,
    blockHeight: 500,
    blockWidth: 900,
    width: 900,
    height: 500,
    theme: "dark",
  },
  decorators: [withForcedBackground("#18181b")],
}

/**
 * Multi-line Example - Video Mode
 */
export const MultiLineVideo: Story = {
  args: {
    ...multiLineBaseArgs,
    blockHeight: 500,
    blockWidth: 1000,
    width: 1000,
    height: 500,
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
}

// ============================================================================
// Static Example - Three Variants
// ============================================================================

const staticBaseArgs = {
  label: "Data Structures",
  code: `struct Point {
  x: Float
  y: Float
}

let origin = Point { x: 0.0, y: 0.0 }`,
  filename: "point.tac",
  hint: "Struct",
  startTime: 0,
  language: "tactus",
  showTypewriter: false, // No animation - display immediately
  controls: false,
  autoPlay: false,
  playbackRate: 1,
  durationFrames: 1, // Static, no animation
}

/**
 * Static Example - Website Light Mode
 */
export const StaticWebsiteLight: Story = {
  args: {
    ...staticBaseArgs,
    blockHeight: 450,
    blockWidth: 850,
    width: 850,
    height: 450,
    theme: "light",
  },
  decorators: [withForcedBackground("#fdfdfd")],
}

/**
 * Static Example - Website Dark Mode
 */
export const StaticWebsiteDark: Story = {
  args: {
    ...staticBaseArgs,
    blockHeight: 450,
    blockWidth: 850,
    width: 850,
    height: 450,
    theme: "dark",
  },
  decorators: [withForcedBackground("#18181b")],
}

/**
 * Static Example - Video Mode
 */
export const StaticVideo: Story = {
  args: {
    ...staticBaseArgs,
    blockHeight: 450,
    blockWidth: 1000,
    width: 1000,
    height: 450,
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
}

// ============================================================================
// Fast Typing - Three Variants
// ============================================================================

const fastTypingBaseArgs = {
  label: "Quick Example",
  code: `let numbers = [1, 2, 3, 4, 5]
let doubled = numbers.map(n => n * 2)
print(doubled)`,
  filename: "map.tac",
  hint: "Array operations",
  startTime: 0,
  language: "tactus",
  showTypewriter: true,
  typewriterDelay: 0.2,
  typewriterSpeed: 0.5, // Faster typing speed
  typewriterLoop: true, // Loop the fast typing: types, pauses, restarts
  typewriterEndDelay: 1.0, // 1 second pause after typing before restarting
  controls: false,
  autoPlay: true,
  playbackRate: 1,
}

/**
 * Fast Typing - Website Light Mode
 */
export const FastTypingWebsiteLight: Story = {
  args: {
    ...fastTypingBaseArgs,
    blockHeight: 350,
    blockWidth: 850,
    width: 850,
    height: 350,
    theme: "light",
  },
  decorators: [withForcedBackground("#fdfdfd")],
}

/**
 * Fast Typing - Website Dark Mode
 */
export const FastTypingWebsiteDark: Story = {
  args: {
    ...fastTypingBaseArgs,
    blockHeight: 350,
    blockWidth: 850,
    width: 850,
    height: 350,
    theme: "dark",
  },
  decorators: [withForcedBackground("#18181b")],
}

/**
 * Fast Typing - Video Mode
 */
export const FastTypingVideo: Story = {
  args: {
    ...fastTypingBaseArgs,
    blockHeight: 350,
    blockWidth: 1000,
    width: 1000,
    height: 350,
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
}
