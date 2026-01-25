import * as React from "react"
import NewWayFlowchartDiagram from "./NewWayFlowchartDiagram"

const usePreferredTheme = () => {
  const [theme, setTheme] = React.useState("light")

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const updateTheme = () => setTheme(mediaQuery.matches ? "dark" : "light")
    updateTheme()
    mediaQuery.addEventListener("change", updateTheme)
    return () => mediaQuery.removeEventListener("change", updateTheme)
  }, [])

  return theme
}

const AnimatedNewWayFlowchartDiagram = ({
  durationMs = 3200,
  className,
  style,
}) => {
  const theme = usePreferredTheme()
  const [progress, setProgress] = React.useState(0)
  const [hasStarted, setHasStarted] = React.useState(false)
  const ref = React.useRef(null)

  // Intersection observer to trigger animation when visible
  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasStarted])

  // Animation loop
  React.useEffect(() => {
    if (!hasStarted) return

    let raf = 0
    const start = performance.now()

    const tick = now => {
      const elapsed = now - start
      const t = Math.min(elapsed / durationMs, 1)
      setProgress(t)

      if (elapsed < durationMs) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, hasStarted])

  return (
    <div ref={ref}>
      <NewWayFlowchartDiagram
        theme={theme}
        progress={progress}
        className={className}
        style={style}
      />
    </div>
  )
}

export default AnimatedNewWayFlowchartDiagram
