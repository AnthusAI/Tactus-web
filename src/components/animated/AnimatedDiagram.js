import * as React from "react"

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

const AnimatedDiagram = ({
  Diagram,
  durationMs = 3200,
  autoPlay = true,
  loop = true,
  holdProgress = 1.0,
  className,
  style,
}) => {
  const theme = usePreferredTheme()
  const [progress, setProgress] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const containerRef = React.useRef(null)

  // Intersection Observer to detect when component is visible
  React.useEffect(() => {
    const currentRef = containerRef.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true)
            if (!loop) {
              setHasAnimated(true)
            }
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(currentRef)
    return () => {
      observer.disconnect()
    }
  }, [loop, hasAnimated])

  // Animation loop
  React.useEffect(() => {
    if (!autoPlay || !isVisible) return

    let raf = 0
    const start = performance.now()

    const tick = now => {
      const elapsed = (now - start) % durationMs
      const t = elapsed / durationMs

      const normalizedProgress =
        holdProgress < 1.0 && t < holdProgress ? t / holdProgress : 1.0

      setProgress(normalizedProgress)

      if (loop) {
        raf = requestAnimationFrame(tick)
      } else if (t < 1.0) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [autoPlay, isVisible, loop, durationMs, holdProgress])

  if (!Diagram) return null

  return (
    <div ref={containerRef}>
      <Diagram
        theme={theme}
        progress={isVisible ? progress : 1}
        className={className}
        style={style}
      />
    </div>
  )
}

export default AnimatedDiagram
