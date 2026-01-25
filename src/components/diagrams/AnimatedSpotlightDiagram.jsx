import * as React from "react"
import SpotlightDiagram from "./SpotlightDiagram"

// Hooks for theme detection (duplicated from other components, ideally should be a shared hook)
const usePreferredTheme = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

const AnimatedSpotlightDiagram = ({
  theme: themeProp,
  config,
  steps,
  stepDurationMs = 2500,
  autoPlay = true,
  frame,
  fps = 30,
  className,
  style,
}) => {
  const preferredTheme = usePreferredTheme()
  const theme = themeProp ?? preferredTheme
  
  const [time, setTime] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const containerRef = React.useRef(null)

  // Intersection observer
  React.useEffect(() => {
    if (typeof frame === "number") return
    const element = containerRef.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 } // Wait until a bit more visible
    )
    
    observer.observe(element)
    return () => observer.disconnect()
  }, [frame])

  // Animation Loop
  React.useEffect(() => {
    if (typeof frame === "number") return
    if (!isVisible || !autoPlay) return

    let raf = 0
    let start = performance.now()
    
    const tick = now => {
      const elapsed = now - start
      setTime(elapsed)
      raf = requestAnimationFrame(tick)
    }
    
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVisible, autoPlay, frame])

  // Calculate current step state
  const totalSteps = steps.length
  const totalCycleDuration = totalSteps * stepDurationMs
  
  const timeMs = typeof frame === "number" ? (frame / fps) * 1000 : time
  const cycleTime = timeMs % totalCycleDuration
  const globalStepProgress = cycleTime / stepDurationMs
  const stepIndex = Math.floor(globalStepProgress) % totalSteps
  const stepProgress = globalStepProgress % 1

  return (
    <div ref={containerRef}>
      <SpotlightDiagram
        theme={theme}
        config={config}
        steps={steps}
        stepIndex={stepIndex}
        stepProgress={stepProgress}
        className={className}
        style={style}
      />
    </div>
  )
}

export default AnimatedSpotlightDiagram
