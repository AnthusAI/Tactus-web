import * as React from "react"
import AnthusFooter from "anthus-footer"
import { StaticImage } from "gatsby-plugin-image"

const Footer = () => {
  const theme = {
    background: "hsl(var(--background))",
    groupedBackground: "hsl(var(--secondary))",
    panelBackground: "hsl(var(--card))",
    foreground: "hsl(var(--foreground))",
    mutedForeground: "hsl(var(--muted-foreground))",
    link: "hsl(var(--foreground))",
    fontFamilyBody: "var(--font-sans)",
    fontFamilyHeading: "var(--font-sans)",
    maxWidth: "62rem",
  }

  return (
    <AnthusFooter
      className="footer"
      siteId="tactus"
      mode="auto"
      subtitle="Part of the Anthus Platform"
      description="Tactus is a programming language and runtime for durable AI agent procedures with checkpointing, sandboxing, and built-in human-in-the-loop controls."
      byline="Designed cybernetically by Ryan Porter"
      theme={theme}
      logo={
        <StaticImage
          src="../images/favicon.png"
          alt="Tactus icon"
          layout="fixed"
          width={48}
          height={48}
          placeholder="none"
        />
      }
      additionalColumns={[
        {
          title: "Product",
          links: [
            { label: "Getting Started", href: "/getting-started", external: false },
            { label: "Features", href: "/features", external: false },
            { label: "GitHub", href: "https://github.com/AnthusAI/Tactus" },
          ],
        },
      ]}
    />
  )
}

export default Footer
