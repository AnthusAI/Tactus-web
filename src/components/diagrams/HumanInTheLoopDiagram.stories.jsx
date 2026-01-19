import * as React from "react"
import HumanInTheLoopDiagram from "./HumanInTheLoopDiagram"
import { HITL_PRESETS } from "./hitlPresets"

export default {
  title: "Diagrams/HumanInTheLoopDiagram",
  component: HumanInTheLoopDiagram,
  argTypes: {
    scenario: {
      control: { type: 'select', options: ['defaults', 'efficient', 'backlog', 'burst', 'steps_back', 'agent_overload', 'low_capacity', 'autonomous', 'closely_supervised', 'unsupervised'] }
    }
  }
}

function Frame({ children, theme = "light" }) {
  return (
    <div
      style={{
        background: theme === "dark" ? "#1a1a1a" : "#ffffff",
        padding: "2rem",
        minHeight: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  )
}

function AnimatedDemo({ theme, scenario = "efficient", config = {} }) {
  const [time, setTime] = React.useState(0)

  React.useEffect(() => {
    let raf = 0
    const start = performance.now()

    const tick = (now) => {
      const elapsed = now - start
      setTime(elapsed)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <Frame theme={theme}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
        <HumanInTheLoopDiagram theme={theme} time={time} scenario={scenario} config={config} />
        <div style={{ marginTop: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.6 }}>
          Scenario: {scenario} | Time: {(time / 1000).toFixed(1)}s
        </div>
      </div>
    </Frame>
  )
}

export const LightMode = () => (
  <Frame theme="light">
    <HumanInTheLoopDiagram theme="light" time={5000} />
  </Frame>
)

export const DarkMode = () => (
  <Frame theme="dark">
    <HumanInTheLoopDiagram theme="dark" time={5000} />
  </Frame>
)

export const VideoMode = () => (
  <div
    style={{
      background: "transparent",
      padding: "2rem",
      minHeight: "500px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <HumanInTheLoopDiagram theme="light" time={5000} />
  </div>
)

// Standard Scenarios
export const ScenarioEfficient = () => (
  <AnimatedDemo theme="light" scenario={HITL_PRESETS.DURABLE_DEFAULT.scenario} config={HITL_PRESETS.DURABLE_DEFAULT.config} />
)
export const ScenarioBacklog = () => <AnimatedDemo theme="light" scenario="backlog" />
export const ScenarioBurst = () => <AnimatedDemo theme="light" scenario="burst" />

// Educational Scenarios

// 1. High Autonomy (90% auto, human barely involved)
export const EduHighAutonomy = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="custom" 
    config={{ 
      autoProcessRate: 0.9, 
      itemCount: 8 
    }} 
  />
)

// 2. Human Approves All (0% return to agent)
// Queued items exit directly to the right.
export const EduHumanApprovesAll = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="custom" 
    config={{ 
      autoProcessRate: 0.1, // Most go to queue
      returnToAgentRate: 0.0, // ALL exit from queue
      itemCount: 6,
      queueTime: 1000
    }} 
  />
)

// 3. Human Returns All (100% return to agent)
// Queued items always go back to agent loop.
export const EduHumanReturnsAll = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="custom" 
    config={{ 
      autoProcessRate: 0.1, // Most go to queue
      returnToAgentRate: 1.0, // ALL loop back
      itemCount: 6,
      queueTime: 1000
    }} 
  />
)

// 4. Bottleneck (Slow human, low autonomy)
export const EduLowAutonomy = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="custom" 
    config={{ 
      autoProcessRate: 0.0, 
      returnToAgentRate: 0.5,
      itemCount: 8,
      queueTime: 5000 // Slow processing
    }} 
  />
)

// 5. Defaults (Balanced 50/50 settings)
export const EduDefaults = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="defaults" 
  />
)
EduDefaults.storyName = "Defaults"

// 6. High Rejection (Most items sent back)
export const EduHighRejection = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="custom" 
    config={{ 
      autoProcessRate: 0.1, 
      returnToAgentRate: 0.95, // 95% return rate
      itemCount: 6,
      queueTime: 1000
    }} 
  />
)

// 7. Human Steps Back (Outage simulation)
export const EduHumanStepsBack = () => (
  <AnimatedDemo 
    theme="light" 
    scenario={HITL_PRESETS.HUMAN_STEPS_BACK.scenario}
    config={HITL_PRESETS.HUMAN_STEPS_BACK.config}
  />
)

// 8. Slow Input Handling (Input queue backlog with throttling)
export const EduSlowInputHandling = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="agent_overload"
    config={{
      maxInputQueueCapacity: 5 // Explicit capacity limit
    }}
  />
)
EduSlowInputHandling.storyName = "Input Queue Throttling"

// 8. Low System Capacity (Limited concurrent orbits)
export const EduLowSystemCapacity = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="low_capacity" 
  />
)

// 9. Fully Autonomous (No human involved)
export const EduAutonomous = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="autonomous" 
  />
)
EduAutonomous.storyName = "Fully Autonomous"

// 10. Closely Supervised (Human watches agent loop directly)
export const EduCloselySupervised = () => (
  <AnimatedDemo 
    theme="light" 
    scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
    config={HITL_PRESETS.CLOSELY_SUPERVISED.config}
  />
)
EduCloselySupervised.storyName = "Closely Supervised"

// 11. Closely Supervised + Outage (Human steps away)
export const EduCloselySupervisedOutage = () => (
  <AnimatedDemo 
    theme="light" 
    scenario={HITL_PRESETS.CLOSELY_SUPERVISED.scenario}
    config={{
        stepBackAfterItems: 4,
        outageDuration: 8000
    }}
  />
)
EduCloselySupervisedOutage.storyName = "Closely Supervised (Outage)"

// 12. Unsupervised (No human, ramping speed)
export const EduUnsupervised = () => (
  <AnimatedDemo 
    theme="light" 
    scenario="unsupervised" 
  />
)
EduUnsupervised.storyName = "Unsupervised"

// Interactive Playground
export const InteractivePlayground = () => {
  const [autoProcessRate, setAutoProcessRate] = React.useState(0.1)
  const [returnToAgentRate, setReturnToAgentRate] = React.useState(0.5)
  const [itemCount, setItemCount] = React.useState(12)
  const [queueTime, setQueueTime] = React.useState(1000)
  const [agentProcessingTime, setAgentProcessingTime] = React.useState(500)
  const [minOrbitTime, setMinOrbitTime] = React.useState(1000)
  const [stepBackAfterItems, setStepBackAfterItems] = React.useState(4)
  const [outageDuration, setOutageDuration] = React.useState(10000)
  const [enableOutage, setEnableOutage] = React.useState(true)
  
  const [maxInFlight, setMaxInFlight] = React.useState(100)
  
  return (
    <div>
      <AnimatedDemo 
        theme="light" 
        scenario="custom" 
        config={{
          autoProcessRate,
          returnToAgentRate,
          itemCount,
          queueTime,
          agentProcessingTime,
          minOrbitTime,
          stepBackAfterItems: enableOutage ? stepBackAfterItems : undefined,
          outageDuration,
          maxInFlight,
          seed: 123
        }}
      />
      <div style={{ padding: "1rem", background: "#f5f5f5", fontFamily: "sans-serif", fontSize: "0.9rem" }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>Simulation Parameters</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0", opacity: 0.7 }}>Traffic & Agent</h4>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Traffic Volume (Items/Cycle):</span>
                <span>{itemCount}</span>
              </label>
              <input type="range" min="1" max="20" step="1" value={itemCount} onChange={e => setItemCount(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Agent Processing Time (Input Queue):</span>
                <span>{agentProcessingTime}ms</span>
              </label>
              <input type="range" min="100" max="3000" step="100" value={agentProcessingTime} onChange={e => setAgentProcessingTime(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Auto-Process Rate (Agent):</span>
                <span>{Math.round(autoProcessRate * 100)}%</span>
              </label>
              <input type="range" min="0" max="1" step="0.1" value={autoProcessRate} onChange={e => setAutoProcessRate(parseFloat(e.target.value))} style={{ width: "100%" }} />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Min Orbit Time (ms):</span>
                <span>{minOrbitTime}ms</span>
              </label>
              <input type="range" min="500" max="5000" step="500" value={minOrbitTime} onChange={e => setMinOrbitTime(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Max Concurrent In-Flight:</span>
                <span>{maxInFlight}</span>
              </label>
              <input type="range" min="1" max="15" step="1" value={maxInFlight} onChange={e => setMaxInFlight(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>

          <div>
             <h4 style={{ margin: "0 0 0.5rem 0", opacity: 0.7 }}>Human Processing</h4>
             <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Human Processing Time (per item):</span>
                <span>{queueTime}ms</span>
              </label>
              <input type="range" min="500" max="5000" step="100" value={queueTime} onChange={e => setQueueTime(parseInt(e.target.value))} style={{ width: "100%" }} />
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Return to Agent Rate:</span>
                <span>{Math.round(returnToAgentRate * 100)}%</span>
              </label>
              <input type="range" min="0" max="1" step="0.1" value={returnToAgentRate} onChange={e => setReturnToAgentRate(parseFloat(e.target.value))} style={{ width: "100%" }} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: "0", opacity: 0.7 }}>Human "Steps Back" (Outage)</h4>
                <label style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" checked={enableOutage} onChange={e => setEnableOutage(e.target.checked)} style={{ marginRight: '0.5rem' }} />
                    Enable Outage
                </label>
             </div>
             
             {enableOutage && (
                 <>
                    <div style={{ marginBottom: "0.5rem" }}>
                      <label style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Step Back After N Items:</span>
                        <span>{stepBackAfterItems}</span>
                      </label>
                      <input type="range" min="0" max={itemCount} step="1" value={stepBackAfterItems} onChange={e => setStepBackAfterItems(parseInt(e.target.value))} style={{ width: "100%" }} />
                    </div>

                    <div style={{ marginBottom: "0.5rem" }}>
                      <label style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>Outage Duration (ms):</span>
                        <span>{outageDuration}ms</span>
                      </label>
                      <input type="range" min="1000" max="15000" step="1000" value={outageDuration} onChange={e => setOutageDuration(parseInt(e.target.value))} style={{ width: "100%" }} />
                    </div>
                 </>
             )}
        </div>

      </div>
    </div>
  )
}

export const ProgressSteps = () => {
  const [time, setTime] = React.useState(0)
  const [scenario, setScenario] = React.useState("efficient")

  return (
    <div>
      <Frame theme="light">
        <HumanInTheLoopDiagram theme="light" time={time} scenario={scenario} />
      </Frame>
      <div style={{ padding: "1rem", background: "#f5f5f5" }}>
        <div style={{ marginBottom: "1rem" }}>
           <label>Scenario: 
             <select value={scenario} onChange={e => setScenario(e.target.value)} style={{ marginLeft: "0.5rem" }}>
               <option value="efficient">Efficient</option>
               <option value="backlog">Backlog</option>
               <option value="burst">Burst</option>
               <option value="steps_back">Steps Back</option>
               <option value="agent_overload">Slow Input Handling</option>
               <option value="low_capacity">Low System Capacity</option>
               <option value="autonomous">Fully Autonomous</option>
               <option value="closely_supervised">Closely Supervised</option>
             </select>
           </label>
        </div>
        <label>
          Time: {(time / 1000).toFixed(1)}s
          <input
            type="range"
            min="0"
            max="30000"
            step="100"
            value={time}
            onChange={(e) => setTime(parseFloat(e.target.value))}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
        </label>
      </div>
    </div>
  )
}
