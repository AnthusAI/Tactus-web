import * as React from "react"
import HumanInTheLoopDiagram from "./HumanInTheLoopDiagram"

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

const AnimatedHumanInTheLoopDiagram = ({
  theme: themeProp,
  scenario = "efficient",
  config = {},
  startAtMs = 0,
  className,
  style,
  cycleMonkey = false,
}) => {
  const preferredTheme = usePreferredTheme()
  const theme = themeProp ?? preferredTheme
  const [time, setTime] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [showMonkey, setShowMonkey] = React.useState(false)
  const ref = React.useRef(null)

  // Intersection observer to start
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
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

  // Monkey cycling animation (5s brain, 5s monkey, repeat)
  React.useEffect(() => {
    if (!isVisible || !cycleMonkey) return

    const interval = setInterval(() => {
      setShowMonkey(prev => !prev)
    }, 5000)

    return () => clearInterval(interval)
  }, [isVisible, cycleMonkey])

  // Infinite time animation
  React.useEffect(() => {
    if (!isVisible) return
    let raf = 0
    let start = performance.now()

    const tick = now => {
      const elapsed = now - start
      setTime(startAtMs + elapsed)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVisible, startAtMs])

  return (
    <div ref={ref}>
      <HumanInTheLoopDiagram
        theme={theme}
        time={time}
        scenario={scenario}
        config={config}
        className={className}
        style={style}
        showMonkey={cycleMonkey && showMonkey}
      />
    </div>
  )
}

export default AnimatedHumanInTheLoopDiagram
