import * as React from "react"
import SpotlightSection from "./spotlight-section"

const WhyNewLanguageSpotlight = ({ id = "why-new-language", eyebrow = "Learn More" }) => {
  return (
    <SpotlightSection
      id={id}
      eyebrow={eyebrow}
      title="Why a New Language?"
      lede="A historical, practical argument for why tool-using agents don’t fit cleanly into the imperative programming model—and why structure, specifications, and evaluation need to be first-class."
      to="/why-new-language/"
      ctaText="Read: Why a New Language?"
    />
  )
}

export default WhyNewLanguageSpotlight

