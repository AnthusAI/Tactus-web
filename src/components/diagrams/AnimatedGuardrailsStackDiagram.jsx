import * as React from "react"
import GuardrailsStackDiagram from "./GuardrailsStackDiagram"

const AnimatedGuardrailsStackDiagram = (props) => {
  const [progress, setProgress] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef(null)

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
    // Use state to track accumulated time if we want to pause/resume, 
    // but for simple looping, performance.now() is fine.
    // We want it to loop continuously once started.
    const start = performance.now()
    const durationMs = 24000 // 3s per layer * 8 layers = 24s cycle

    const tick = (now) => {
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
      <GuardrailsStackDiagram {...props} progress={progress} />
    </div>
  )
}

export default AnimatedGuardrailsStackDiagram
