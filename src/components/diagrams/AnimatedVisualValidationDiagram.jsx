import * as React from "react"
import VisualValidationDiagram from "./VisualValidationDiagram"

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

const AnimatedVisualValidationDiagram = ({
  theme: themeProp,
  startAtMs = 0,
  className,
  style,
}) => {
  const preferredTheme = usePreferredTheme()
  const theme = themeProp ?? preferredTheme
  const [time, setTime] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef(null)

  // Intersection observer
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Animation Loop
  React.useEffect(() => {
    if (!isVisible) return
    let raf = 0
    let start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      setTime(startAtMs + elapsed)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVisible, startAtMs])

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <VisualValidationDiagram
        theme={theme}
        time={time}
        className={className}
        style={style}
      />
    </div>
  )
}

export default AnimatedVisualValidationDiagram
