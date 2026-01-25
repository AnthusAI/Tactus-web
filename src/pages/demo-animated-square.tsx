import * as React from "react"
import Layout from "../components/layout"
import AnimatedFuchsiaSquare from "../components/animated/AnimatedFuchsiaSquare"

const DemoAnimatedSquarePage = () => {
  return (
    <Layout>
      <h1>Animated Fuchsia Square Demo</h1>

      <p>
        This page demonstrates a unified animation architecture where the SAME
        animation logic is used in both the Gatsby website and Remotion videos.
        No duplication!
      </p>

      <h2>How It Works</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Shared Primitive Component</h3>
        <p>
          <code>src/components/primitives/FuchsiaSquare.tsx</code> - A pure
          presentational component with no animation logic. It accepts props for
          size, strokeWidth, and styling.
        </p>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Single Animation Implementation</h3>
        <p>
          <code>videos/src/components/AnimatedFuchsiaSquare.tsx</code> -
          Contains ALL the animation logic using Remotion primitives
          (useCurrentFrame, spring, interpolate). This same code works in:
        </p>
        <ul>
          <li>
            <strong>Remotion Studio</strong> - For developing animations
          </li>
          <li>
            <strong>Video Rendering</strong> - For exporting to MP4/WebM
          </li>
          <li>
            <strong>Gatsby Website</strong> - Via Remotion Player (this page!)
          </li>
        </ul>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h3>Gatsby Wrapper (This Page)</h3>
        <p>
          <code>src/components/animated/AnimatedFuchsiaSquare.tsx</code> - A
          thin wrapper around Remotion Player that embeds the animation
          composition. No animation logic here, just Player configuration!
        </p>
      </div>

      <h2>Demo</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "3rem",
          alignItems: "center",
          marginTop: "3rem",
          marginBottom: "3rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3>Default Animation</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
            Stroke width animates using Remotion's spring animation. This is the
            exact same code that renders in videos.
          </p>
          <AnimatedFuchsiaSquare />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>With Playback Controls</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
            Shows Remotion Player's built-in controls. Try pausing, seeking, or
            changing playback speed.
          </p>
          <AnimatedFuchsiaSquare controls />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>Larger Size</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
            Same animation logic, different size parameter.
          </p>
          <AnimatedFuchsiaSquare size={300} width={300} height={300} />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>Custom Stroke Range</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
            Animation parameters passed through to the composition.
          </p>
          <AnimatedFuchsiaSquare
            minStrokeWidth={5}
            maxStrokeWidth={30}
            durationFrames={120}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>Slow Motion</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
            Playback rate controls let you slow down or speed up the animation.
          </p>
          <AnimatedFuchsiaSquare playbackRate={0.5} controls />
        </div>

        <div style={{ textAlign: "center" }}>
          <h3>Linear Interpolation</h3>
          <p style={{ maxWidth: "400px", margin: "0 auto 1rem" }}>
            Same component, different animation style (no spring physics).
          </p>
          <AnimatedFuchsiaSquare useSpring={false} controls />
        </div>
      </div>

      <h2>Benefits of This Architecture</h2>

      <ul style={{ maxWidth: "600px", lineHeight: "1.8" }}>
        <li>
          <strong>Zero duplication</strong> - Animation logic exists in exactly
          one place
        </li>
        <li>
          <strong>Consistency guaranteed</strong> - Web animations and video
          renders are pixel-perfect identical
        </li>
        <li>
          <strong>No framework lock-in</strong> - Animation code uses only
          Remotion primitives, works everywhere
        </li>
        <li>
          <strong>Video-ready by default</strong> - Any animation can be
          rendered to video without changes
        </li>
        <li>
          <strong>Frame-precise control</strong> - Deterministic animations for
          reliable playback
        </li>
        <li>
          <strong>Type safety</strong> - TypeScript ensures parameter
          consistency across all contexts
        </li>
        <li>
          <strong>No Framer Motion needed</strong> - One animation system for
          everything
        </li>
      </ul>

      <h2>Comparison: Before vs After</h2>

      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <h3>❌ Old Approach (Duplication)</h3>
        <pre
          style={{
            background: "var(--color-code-bg)",
            padding: "1.5rem",
            borderRadius: "8px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`// Gatsby version (Framer Motion)
const GatsbyAnimated = () => {
  const controls = useAnimationControls();
  controls.start({
    strokeWidth: [2, 20, 2],
    transition: { duration: 2, ease: "easeInOut" }
  });
  // ... animation logic
};

// Remotion version (spring/interpolate)
const RemotionAnimated = () => {
  const frame = useCurrentFrame();
  const strokeWidth = spring({
    frame,
    config: { damping: 100 }
  });
  // ... DUPLICATED animation logic
};

❌ Two implementations to maintain
❌ Can drift out of sync
❌ Bugs need fixing twice`}
        </pre>
      </div>

      <div style={{ marginTop: "2rem", marginBottom: "2rem" }}>
        <h3>✅ New Approach (Single Source of Truth)</h3>
        <pre
          style={{
            background: "var(--color-code-bg)",
            padding: "1.5rem",
            borderRadius: "8px",
            overflow: "auto",
            fontSize: "0.875rem",
          }}
        >
          {`// Animation logic (ONE place)
// videos/src/components/AnimatedFuchsiaSquare.tsx
const AnimatedFuchsiaSquare = () => {
  const frame = useCurrentFrame();
  const strokeWidth = spring({
    frame,
    config: { damping: 100 }
  });
  return <FuchsiaSquare strokeWidth={strokeWidth} />;
};

// Gatsby wrapper (thin Player config)
// src/components/animated/AnimatedFuchsiaSquare.tsx
<Player
  component={AnimatedFuchsiaSquare}
  durationInFrames={90}
  fps={30}
/>

// Remotion video uses it directly
<Composition
  component={AnimatedFuchsiaSquare}
  durationInFrames={90}
/>

✅ Animation logic written once
✅ Always in sync
✅ Fix bugs in one place`}
        </pre>
      </div>

      <h2>File Structure</h2>

      <pre
        style={{
          background: "var(--color-code-bg)",
          padding: "1.5rem",
          borderRadius: "8px",
          overflow: "auto",
          fontSize: "0.875rem",
        }}
      >
        {`/Users/ryan.porter/Projects/Tactus-web/
├── src/
│   ├── components/
│   │   ├── primitives/
│   │   │   └── FuchsiaSquare.tsx           # Pure presentation (no animation)
│   │   └── animated/
│   │       └── AnimatedFuchsiaSquare.tsx   # Thin Player wrapper (Gatsby)
│   └── pages/
│       └── demo-animated-square.tsx        # This page
│
└── videos/
    └── src/
        └── components/
            └── AnimatedFuchsiaSquare.tsx   # SINGLE SOURCE OF TRUTH
                                            # - Uses Remotion primitives
                                            # - Works in Studio
                                            # - Works in video rendering
                                            # - Works in Player (web)
                                            # - Imports FuchsiaSquare primitive`}
      </pre>

      <h2>Why No Framer Motion?</h2>

      <p>
        Framer Motion is excellent for UI interactions, but it creates a
        fundamental problem:{" "}
        <strong>you have to implement animations twice</strong>.
      </p>

      <p>By using Remotion Player everywhere, we get:</p>
      <ul>
        <li>One animation system to learn</li>
        <li>One implementation to maintain</li>
        <li>Video rendering capability built-in</li>
        <li>Frame-precise control for complex animations</li>
        <li>Deterministic, reproducible results</li>
      </ul>

      <p>
        The trade-off is bundle size (~100KB for Remotion Player), but the
        benefits of zero duplication far outweigh this cost.
      </p>
    </Layout>
  )
}

export default DemoAnimatedSquarePage

export const Head = () => <title>Animated Square Demo | Tactus</title>
