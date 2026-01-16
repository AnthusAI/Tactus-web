# Tactus Video Components

Reusable components implementing the Tactus brand design system.

## Theme System

All design tokens are defined in `../lib/theme.ts`:
- Colors (primary, background, text, code)
- Fonts (Source Sans 3, Source Serif 4, Source Code Pro)
- Spacing (1-6 scale)
- Typography scales

## Core Components

### GlobalStyles

Wraps video content, loads Google Fonts, and applies base styling.

```tsx
import { GlobalStyles } from "../../components/GlobalStyles";

<GlobalStyles>
  {/* Your video content */}
</GlobalStyles>
```

### Layout Components

**Layout** - Flexbox container with consistent spacing:
```tsx
import { Layout } from "../../components/Layout";

<Layout padding={5} align="center" justify="center">
  {/* Content */}
</Layout>
```

**Container** - Width-constrained container:
```tsx
import { Container } from "../../components/Layout";

<Container maxWidth={1200}>
  {/* Content */}
</Container>
```

### Typography Components

**H1** - Large serif heading (72px):
```tsx
import { H1 } from "../../components/Typography";

<H1>Main Title</H1>
```

**H2** - Medium sans-serif heading (48px):
```tsx
import { H2 } from "../../components/Typography";

<H2>Section Title</H2>
```

**H3** - Small sans-serif heading (32px):
```tsx
import { H3 } from "../../components/Typography";

<H3>Subsection</H3>
```

**Body** - Serif body text with size variants:
```tsx
import { Body } from "../../components/Typography";

<Body size="lg">Large body text</Body>
<Body size="md">Medium body text (default)</Body>
<Body size="sm">Small body text</Body>
```

**Subtitle** - Sans-serif text in primary color:
```tsx
import { Subtitle } from "../../components/Typography";

<Subtitle>Highlighted subtitle</Subtitle>
```

**Code** - Monospace code with inline/block variants:
```tsx
import { Code } from "../../components/Typography";

<Code inline>inline code</Code>

<Code>
  {`function example() {
  return "block code";
}`}
</Code>
```

### Surface Components

**Card** - White surface with shadow:
```tsx
import { Card } from "../../components/Card";

<Card padding={4}>
  {/* Card content */}
</Card>
```

**CodeBlock** - Code background container:
```tsx
import { CodeBlock } from "../../components/Card";

<CodeBlock padding={4}>
  {/* Code content */}
</CodeBlock>
```

## Animation Pattern

Use Remotion's spring animations with the components:

```tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

const animation = spring({
  frame,
  fps,
  config: { damping: 100, stiffness: 200, mass: 0.5 },
});

<H1 style={{
  opacity: animation,
  transform: `translateY(${(1 - animation) * 50}px)`
}}>
  Animated Title
</H1>
```

## Complete Example

```tsx
import React from "react";
import { Sequence, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { GlobalStyles } from "../../components/GlobalStyles";
import { Layout } from "../../components/Layout";
import { H1, Body, Code } from "../../components/Typography";
import { Card } from "../../components/Card";

export const ExampleVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleAnim = spring({ frame, fps, config: { damping: 100 } });

  return (
    <GlobalStyles>
      <Sequence from={0} durationInFrames={150}>
        <Layout>
          <H1 style={{ opacity: titleAnim }}>
            Welcome to Tactus
          </H1>
          <Body>
            A modern programming language designed for clarity.
          </Body>
          <Card>
            <Code inline>let x = 42</Code>
          </Card>
        </Layout>
      </Sequence>
    </GlobalStyles>
  );
};
```
