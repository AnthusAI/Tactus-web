import * as React from "react"
import { createRoot } from "react-dom/client"

import AnimatedCodeBlock from "../../src/components/animated/AnimatedCodeBlock"
import AnimatedAIEngineersToolboxDiagram from "../../src/components/diagrams/AnimatedAIEngineersToolboxDiagram"
import AnimatedGuardrailsStackDiagram from "../../src/components/diagrams/AnimatedGuardrailsStackDiagram"
import ContainerSandboxDiagram from "../../src/components/diagrams/ContainerSandboxDiagram"
import AnimatedVisualEvaluationsDiagram from "../../src/components/diagrams/AnimatedVisualEvaluationsDiagram"
import AnimatedVisualSpecificationsDiagram from "../../src/components/diagrams/AnimatedVisualSpecificationsDiagram"
import AnimatedVisualValidationDiagram from "../../src/components/diagrams/AnimatedVisualValidationDiagram"
import EmbeddedRuntimeDiagram from "../../src/components/diagrams/EmbeddedRuntimeDiagram"
import EvaluationsDiagram from "../../src/components/diagrams/EvaluationsDiagram"
import HitlReturnsAllDiagram from "../../src/components/diagrams/HitlReturnsAllDiagram"
import LevelZeroEscalationDiagram from "../../src/components/diagrams/LevelZeroEscalationDiagram"
import ProgrammableToolGatewayDiagram from "../../src/components/diagrams/ProgrammableToolGatewayDiagram"
import LeastPrivilegeDiagram from "../../src/components/diagrams/LeastPrivilegeDiagram"
import PromptEngineeringCeilingDiagram from "../../src/components/diagrams/PromptEngineeringCeilingDiagram"
import SpecificationsDiagram from "../../src/components/diagrams/SpecificationsDiagram"

const ISLANDS = {
  AnimatedAIEngineersToolboxDiagram,
  AnimatedCodeBlock,
  AnimatedGuardrailsStackDiagram,
  ContainerSandboxDiagram,
  AnimatedVisualEvaluationsDiagram,
  AnimatedVisualSpecificationsDiagram,
  AnimatedVisualValidationDiagram,
  EmbeddedRuntimeDiagram,
  EvaluationsDiagram,
  HitlReturnsAllDiagram,
  LeastPrivilegeDiagram,
  LevelZeroEscalationDiagram,
  PromptEngineeringCeilingDiagram,
  ProgrammableToolGatewayDiagram,
  SpecificationsDiagram,
}

const useColorScheme = () => {
  const [theme, setTheme] = React.useState("light")
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const update = () => setTheme(query.matches ? "dark" : "light")
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return theme
}

const Island = ({ Component, props, code }) => {
  const theme = useColorScheme()
  const codeProps = code === null ? {} : { code }
  return <Component theme={theme} {...props} {...codeProps} />
}

const RELEASES_URL = "https://api.github.com/repos/AnthusAI/Tactus/releases/latest"
const RELEASE_ASSETS = { mac: ".dmg", windows: ".exe", linux: ".appimage" }
const RELEASE_LABELS = { mac: "Download for Mac", windows: "Download for Windows", linux: "Download for Linux" }

const enhanceReleaseLinks = element => {
  fetch(RELEASES_URL)
    .then(response => response.json())
    .then(release => {
      const version = release.tag_name || release.name
      if (version) {
        const label = document.createElement("p")
        label.setAttribute("aria-label", "Latest version")
        label.innerHTML = "<strong>Latest version</strong> "
        label.append(version)
        element.append(label)
      }
      Object.entries(RELEASE_ASSETS).forEach(([platform, extension]) => {
        const asset = (release.assets || []).find(item => item.name.toLowerCase().endsWith(extension))
        const link = document.querySelector(`a[href$="releases/latest#${platform}"]`)
        if (asset && link) {
          link.href = asset.browser_download_url
          link.textContent = RELEASE_LABELS[platform]
        }
      })
    })
    .catch(error => console.error("Failed to fetch release", error))
}

const ENHANCERS = { ReleaseLinks: enhanceReleaseLinks }

const mountIsland = element => {
  if (ENHANCERS[element.dataset.island]) {
    ENHANCERS[element.dataset.island](element)
    return
  }
  const Component = ISLANDS[element.dataset.island]
  if (!Component) {
    console.error(`No island is registered as ${element.dataset.island}`)
    return
  }
  const props = JSON.parse(element.dataset.props || "{}")
  const codeElement = element.querySelector("pre code")
  const code = codeElement ? codeElement.textContent.replace(/\n$/, "") : null
  createRoot(element).render(<Island Component={Component} props={props} code={code} />)
}

document.querySelectorAll("[data-island]").forEach(mountIsland)
