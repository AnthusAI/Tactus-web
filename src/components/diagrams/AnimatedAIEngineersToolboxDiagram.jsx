import * as React from "react"
import AIEngineersToolboxDiagram from "./AIEngineersToolboxDiagram"

const AnimatedAIEngineersToolboxDiagram = props => {
  const [progress, setProgress] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)
  const ref = React.useRef(null)

  // Mobile detection
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const checkMobile = () => setIsMobile(window.innerWidth < 800)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Observer to start animation when visible
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 } // Start when 10% visible
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (!isVisible) return

    let raf = 0
    const start = performance.now()
    const durationMs = 16000 // 4 tools * 4s each = 16s cycle

    const tick = now => {
      const elapsed = now - start
      const t = (elapsed % durationMs) / durationMs
      setProgress(t)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isVisible])

  return (
    <div ref={ref} className={props.className} style={props.style}>
      <AIEngineersToolboxDiagram
        {...props}
        progress={progress}
        isMobile={isMobile}
      />
    </div>
  )
}

export default AnimatedAIEngineersToolboxDiagram
