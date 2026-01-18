import * as React from "react"
import { Brain, User, AlertCircle } from "lucide-react"
import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

// --- Helper: Pseudo-Random Generator ---
const mulberry32 = (a) => {
    return () => {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// --- Helper: Gaussian Generator ---
const gaussian = (rng, mean, stdDev) => {
    const u1 = rng();
    const u2 = rng();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
}

// --- Constants ---
const SPEED = 0.003 // rad/ms
const SPAWN_DURATION = 1000
const TRAVEL_DURATION = 1000
const EXIT_DURATION = 1000
const CYCLE_DURATION = 15000

// --- Helper Components ---
const QueueVisual = ({ x, yTop, yBottom, isOverloaded, t }) => (
    <g>
        <path d={`M ${x - 25},${yTop - 10} L ${x - 25},${yBottom + 20}`} stroke={isOverloaded ? t.primary : t.surface2} strokeWidth={4} fill="none" strokeLinecap="round" style={{ transition: "stroke 0.3s" }} />
        <path d={`M ${x + 25},${yTop - 10} L ${x + 25},${yBottom + 20}`} stroke={isOverloaded ? t.primary : t.surface2} strokeWidth={4} fill="none" strokeLinecap="round" style={{ transition: "stroke 0.3s" }} />
        
        {/* Overload Indicator */}
        <g 
            transform={`translate(${x}, ${yBottom + 35})`} 
            opacity={isOverloaded ? 1 : 0}
            style={{ transition: "opacity 0.3s" }}
        >
            <circle r={12} fill="var(--color-primary)" opacity={0.2} >
                <animate attributeName="r" values="12;16;12" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1s" repeatCount="indefinite" />
            </circle>
            <AlertCircle size={20} color="var(--color-primary)" style={{ transform: "translate(-10px, -10px)" }} />
        </g>
    </g>
)

// Helper for Quadratic Bezier
const getQuadBezierPoint = (t, p0, p1, p2) => {
  const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x
  const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y
  return { x, y }
}

const snapOrbit = (minDuration, startAngle, targetAngle) => {
    let target = targetAngle
    while (target <= startAngle) target += 2 * Math.PI
    const minAngle = minDuration * SPEED
    const diff = target - startAngle
    const N = Math.ceil((minAngle - diff) / (2 * Math.PI))
    const totalAngle = diff + N * 2 * Math.PI
    return totalAngle / SPEED
}

// --- Helper: Scenario Generation ---
const generateScenario = (config) => {
    const {
        seed = 123,
        itemCount = 5,
        autoProcessRate = 0.4,
        returnToAgentRate = 0.5,
        minOrbitTime = 1000,
        maxOrbitTime = 3000,
        queueTime = 1500, // Human Processing Time
        agentProcessingTime = 500, // Agent Processing Time (Input Queue)
        outageStart = null,
        outageDuration = 0,
        stepBackAfterItems = undefined,
        maxInFlight = 100, // Max items in 'orbit' phase concurrently
        supervisionMean,
        supervisionStdDev = 500
    } = config

    const rng = mulberry32(seed)
    const items = []
    
    const interval = CYCLE_DURATION / itemCount
    
    // For sequential processing
    let humanNextFreeTime = 0
    let agentNextFreeTime = 0 // For input queue
    let manualItemCount = 0
    let computedOutageStart = outageStart
    
    // CRITICAL: For maxInFlight=1, track when the loop is actually free
    // This is the ABSOLUTE time when the last item exits the loop
    let absoluteLoopFreeTime = 0
    
    // Track active orbit intervals for capacity check
    // Array of { start, end }
    const orbitIntervals = []

    // Helper: Find earliest slot for orbit start
    const findEarliestSlot = (minTime, duration) => {
        // HARD LIMIT: If maxInFlight is 1, use simple serial queue
        if (maxInFlight === 1) {
            // Just return minTime - the loopFreeTime gate handles serialization
            return minTime
        }
        
        // For maxInFlight > 1, use interval overlap logic
        const candidates = [minTime, ...orbitIntervals.map(i => i.end)]
        candidates.sort((a, b) => a - b)
        
        for (const t of candidates) {
            if (t < minTime) continue
            
            const pStart = t
            const pEnd = t + duration
            
            let overlapCount = 0
            
            for (const existing of orbitIntervals) {
                if (pStart < existing.end && existing.start < pEnd) {
                    overlapCount++
                }
                
                if (pEnd > CYCLE_DURATION) {
                    const wrapEnd = pEnd - CYCLE_DURATION
                    if (existing.start < wrapEnd) {
                        overlapCount++
                    }
                }
                
                if (existing.end > CYCLE_DURATION) {
                    const existingWrapEnd = existing.end - CYCLE_DURATION
                    if (pStart < existingWrapEnd) {
                        overlapCount++
                    }
                }
            }
            
            if (overlapCount + 1 <= maxInFlight) {
                return t
            }
        }
        return minTime 
    }

    // First pass: Pre-calculate computedOutageStart
    let tempRng = mulberry32(seed)
    let tempManualCount = 0
    let foundOutageStart = outageStart
    
    if (stepBackAfterItems !== undefined) {
        for (let i = 0; i < itemCount; i++) {
            const start = i * interval + (tempRng() * 500)
            const rollAuto = tempRng()
            const isAuto = rollAuto < autoProcessRate
            const orbitDur = minOrbitTime + tempRng() * (maxOrbitTime - minOrbitTime)
             // consume other RNG calls to stay in sync
            if (!isAuto || supervisionMean) {
                 // For supervised, assume orbit + supervision
                 const supDur = supervisionMean ? supervisionMean : 0
                 const approxQueueArrival = start + SPAWN_DURATION + agentProcessingTime + TRAVEL_DURATION + orbitDur + supDur + TRAVEL_DURATION
                 
                 if (tempManualCount < stepBackAfterItems) {
                     tempManualCount++
                     if (tempManualCount === stepBackAfterItems) {
                         // Found it
                         // For supervised, it's roughly when this item would start supervision?
                         // Let's stick to approx timing
                         foundOutageStart = approxQueueArrival + queueTime + 500
                         break 
                     }
                 }
                 // consume return RNG
                 tempRng() 
            } else {
                 // Auto path
            }
        }
    }
    
    computedOutageStart = foundOutageStart
    
    // Main Pass
    for (let i = 0; i < itemCount; i++) {
        const start = i * interval + (rng() * 500)
        
        // 1. Input Queue Processing
        const inputArrival = start + SPAWN_DURATION
        
        // Initial ingest times (before capacity check)
        const agentStartTime = Math.max(inputArrival, agentNextFreeTime)
        const agentEndTime = agentStartTime + agentProcessingTime
        
        // 2. Check Auto-Process (Agent Decision)
        const rollAuto = rng()
        const isAuto = rollAuto < autoProcessRate
        
        // Determine orbit params early for capacity check
        const orbitDurRaw = minOrbitTime + rng() * (maxOrbitTime - minOrbitTime)
        
        if (supervisionMean) {
            // --- Closely Supervised Path ---
            // Orbit 1: PI -> 0 (Right Side)
            const orbitDur1 = snapOrbit(minOrbitTime / 2, Math.PI, 2 * Math.PI)
            
            // Supervision
            let supervisionDur = Math.max(200, gaussian(rng, supervisionMean, supervisionStdDev))
            
            // Orbit 2: 0 -> 1.5 PI (Top)
            const orbitDur2 = snapOrbit(minOrbitTime * 0.75, 0, 1.5 * Math.PI)
            
            // Capacity Check: Can we enter orbit?
            // Orbit starts after travel_to_agent (1s)
            // But we must check availability starting from 'travel_to_agent' to ensure no two items are "In Flight" towards or in the loop if maxInFlight=1.
            // Critical Section Duration (CSD) = TRAVEL + ORBIT (+ Supervision/Exits)
            
            // For Closely Supervised:
            // CSD = TRAVEL_DURATION + orbitDur1 + supervisionDur + orbitDur2 + EXIT_DURATION
            
            const taskDur = TRAVEL_DURATION + orbitDur1 + supervisionDur + orbitDur2 + EXIT_DURATION
            
            // HARD GATE: If maxInFlight=1, cannot leave queue until loop is free
            let actualQueueExit = agentEndTime
            if (maxInFlight === 1) {
                actualQueueExit = Math.max(agentEndTime, absoluteLoopFreeTime)
                absoluteLoopFreeTime = actualQueueExit + taskDur
            } else {
                actualQueueExit = findEarliestSlot(agentEndTime, taskDur)
            }
            
            // Block Input Queue until actualQueueExit
            const finalDurationInputQueue = actualQueueExit - inputArrival
            agentNextFreeTime = actualQueueExit // Blocks next item from even leaving the queue

            // Derived start times
            const startTravel = actualQueueExit
            const actualOrbitStart = startTravel + TRAVEL_DURATION
            
            // Check Outage Intersection (Re-check because outage might extend supervision)
            if (computedOutageStart !== null) {
                const supervisionStart = actualOrbitStart + orbitDur1
                const outageEnd = computedOutageStart + outageDuration
                
                // If supervisionStart is before outageEnd and ends after outageStart
                if (supervisionStart < outageEnd && (supervisionStart + supervisionDur) > computedOutageStart) {
                     // Add wait time
                     supervisionDur += outageDuration
                     
                     // Re-calculate with new duration
                     const newTaskDur = TRAVEL_DURATION + orbitDur1 + supervisionDur + orbitDur2 + EXIT_DURATION
                     const newActualQueueExit = findEarliestSlot(agentEndTime, newTaskDur)
                     
                     // Update all variables
                     const newFinalDurationInputQueue = newActualQueueExit - inputArrival
                     agentNextFreeTime = newActualQueueExit
                     
                     // Register interval
                     orbitIntervals.push({ start: newActualQueueExit, end: newActualQueueExit + newTaskDur })

                     const steps = []
                     steps.push({ type: 'spawn' })
                     steps.push({ type: 'travel_to_input' })
                     steps.push({ type: 'input_queue', duration: newFinalDurationInputQueue })
                     steps.push({ type: 'travel_to_agent' })
                     steps.push({ type: 'orbit', min: orbitDurRaw, startAng: Math.PI, targetAng: 2 * Math.PI, duration: orbitDur1 }) 
                     steps.push({ type: 'supervision', duration: supervisionDur })
                     steps.push({ type: 'orbit', min: orbitDurRaw, startAng: 0, targetAng: 1.5 * Math.PI, duration: orbitDur2 })
                     steps.push({ type: 'exit_final' })
                     
                     items.push({ id: i + 1, start, steps })
                     continue // Skip to next item
                }
            }

            // Normal path (no outage overlap or already handled)
            orbitIntervals.push({ start: actualQueueExit, end: actualQueueExit + taskDur })
            
            const steps = []
            steps.push({ type: 'spawn' })
            steps.push({ type: 'travel_to_input' })
            steps.push({ type: 'input_queue', duration: finalDurationInputQueue })
            steps.push({ type: 'travel_to_agent' })
            steps.push({ type: 'orbit', min: orbitDurRaw, startAng: Math.PI, targetAng: 2 * Math.PI, duration: orbitDur1 }) 
            steps.push({ type: 'supervision', duration: supervisionDur })
            steps.push({ type: 'orbit', min: orbitDurRaw, startAng: 0, targetAng: 1.5 * Math.PI, duration: orbitDur2 })
            steps.push({ type: 'exit_final' })
            
            items.push({ id: i + 1, start, steps })
            
        } else {
            // --- Standard Flow ---
            let startAng = Math.PI
            let targetAng = isAuto ? 2.0 * Math.PI : 1.5 * Math.PI // Always aim for Apex (Top) for both manual (to queue) and auto (exit over queue)
            const orbitDur = snapOrbit(orbitDurRaw, startAng, targetAng)

            // Capacity Check: Can we enter orbit?
            // CRITICAL: Include ALL time in the agent loop system:
            // - TRAVEL_DURATION (to agent)
            // - orbitDur (orbiting)
            // - TRAVEL_DURATION (to human queue OR exit)
            // - EXIT_DURATION (if auto-processing and exiting)
            const taskDur = TRAVEL_DURATION + orbitDur + TRAVEL_DURATION + (isAuto ? EXIT_DURATION : 0)
            
            // HARD GATE: If maxInFlight=1, cannot leave queue until loop is free
            let actualQueueExit = agentEndTime
            if (maxInFlight === 1) {
                actualQueueExit = Math.max(agentEndTime, absoluteLoopFreeTime)
                absoluteLoopFreeTime = actualQueueExit + taskDur
            } else {
                actualQueueExit = findEarliestSlot(agentEndTime, taskDur)
            }
            
            const finalDurationInputQueue = actualQueueExit - inputArrival
            agentNextFreeTime = actualQueueExit
            
            const actualOrbitStart = actualQueueExit + TRAVEL_DURATION
            
            orbitIntervals.push({ start: actualQueueExit, end: actualQueueExit + taskDur })
            
            const steps = []
            
            // Step 1: Spawn -> Input Queue
            steps.push({ type: 'spawn' })
            steps.push({ type: 'travel_to_input' })
            
            steps.push({ type: 'input_queue', duration: finalDurationInputQueue })
            
            // Step 3: Travel to Agent Loop
            steps.push({ type: 'travel_to_agent' })
            
            if (isAuto) {
                // Auto-process: Orbit -> Exit Right (Apex Exit)
                steps.push({ type: 'orbit', min: orbitDurRaw, startAng: Math.PI, targetAng: 1.5 * Math.PI })
                steps.push({ type: 'exit_final' })
            } else {
                // Manual: Orbit -> Human Queue
                const humanQueueArrival = actualOrbitStart + orbitDur + TRAVEL_DURATION
                
                // --- Human Processing Logic ---
                let effectiveStartTime = Math.max(humanQueueArrival, humanNextFreeTime)
                
                // Check Outage
                if (computedOutageStart !== null) {
                    const outageEnd = computedOutageStart + outageDuration
                    if (effectiveStartTime >= computedOutageStart && effectiveStartTime < outageEnd) {
                        effectiveStartTime = outageEnd
                    }
                    if (outageEnd > CYCLE_DURATION) {
                        const wrappedEnd = outageEnd - CYCLE_DURATION
                        if (effectiveStartTime < wrappedEnd) {
                            effectiveStartTime = wrappedEnd
                        }
                    }
                }
                
                const effectiveEndTime = effectiveStartTime + queueTime
                const durationInHumanQueue = effectiveEndTime - humanQueueArrival
                humanNextFreeTime = effectiveEndTime

                steps.push({ type: 'orbit', min: orbitDurRaw, startAng: Math.PI, targetAng: 1.5 * Math.PI })
                steps.push({ type: 'to_queue' })
                steps.push({ type: 'queue', duration: durationInHumanQueue })
                
                const rollReturn = rng()
                const isReturned = rollReturn < returnToAgentRate
                
                if (isReturned) {
                    // Return Logic: New Orbit
                    const retOrbitDurRaw = 2000
                    const retStartAng = 2.5 * Math.PI // Bottom
                    const retTargetAng = 1.5 * Math.PI // Top (Apex)
                    const retOrbitDur = snapOrbit(retOrbitDurRaw, retStartAng, retTargetAng)
                    
                    // Return from Human Queue also consumes capacity
                    // CSD = TRAVEL_DURATION + Orbit + EXIT_DURATION
                    const retTaskDur = TRAVEL_DURATION + retOrbitDur + EXIT_DURATION
                    
                    // HARD GATE: If maxInFlight=1, cannot leave queue until loop is free
                    let actualReturnExit = effectiveEndTime
                    if (maxInFlight === 1) {
                        actualReturnExit = Math.max(effectiveEndTime, absoluteLoopFreeTime)
                        absoluteLoopFreeTime = actualReturnExit + retTaskDur
                    } else {
                        actualReturnExit = findEarliestSlot(effectiveEndTime, retTaskDur)
                    }
                    
                    // Delay must be absorbed in Human Queue
                    const returnDelay = actualReturnExit - effectiveEndTime
                    
                    // Update Human Queue Duration and Next Free Time
                    const finalEffectiveEndTime = actualReturnExit
                    const finalDurationInHumanQueue = durationInHumanQueue + returnDelay
                    
                    // Mutate the 'queue' step we just pushed
                    steps[steps.length - 1].duration = finalDurationInHumanQueue
                    humanNextFreeTime = finalEffectiveEndTime // Blocks next human item
                    
                    // Register Interval
                    orbitIntervals.push({ start: actualReturnExit, end: actualReturnExit + retTaskDur })

                    // Now proceed with Return
                    steps.push({ type: 'return' })
                    steps.push({ type: 'orbit', min: retOrbitDurRaw, startAng: retStartAng, targetAng: retTargetAng })
                    steps.push({ type: 'exit_final' })
                } else {
                    // Exit from queue
                    steps.push({ type: 'exit' })
                }
            }
            
            items.push({ id: i + 1, start, steps })
        }
    }
    
    return { items, outageStart: computedOutageStart }
}


const HumanInTheLoopDiagram = ({ 
  theme = "light", 
  time = 0, 
  scenario = "efficient",
  config = {}, 
  style, 
  className 
}) => {
  const t = diagramTokens
  const timeMs = time

  // --- Layout Constants ---
  // Shifted Right to accommodate Input Queue
  const inputQueueX = 60
  const agentCenter = { x: 180, y: 200 }
  const agentRadius = 40
  const humanQueueX = 300
  const humanCenter = { x: 350, y: 200 }
  
  const queueTopY = 170
  const queueBottomY = 230
  
  // Agent Nodes
  const pAgentTop = { x: agentCenter.x, y: agentCenter.y - agentRadius }
  const pAgentBottom = { x: agentCenter.x, y: agentCenter.y + agentRadius }
  const pAgentLeft = { x: agentCenter.x - agentRadius, y: agentCenter.y }
  
  // Input Queue Nodes
  const pInputQueueTop = { x: inputQueueX, y: queueTopY }
  const pInputQueueBottom = { x: inputQueueX, y: queueBottomY }
  
  // Human Queue Nodes
  const pHumanQueueTop = { x: humanQueueX, y: queueTopY }
  const pHumanQueueBottom = { x: humanQueueX, y: queueBottomY }
  
  // Exit Nodes
  const pExitFinal = { x: 440, y: 160 } // Exit from Agent (Apex)
  const pExitHuman = { x: 440, y: 230 } // Exit from Human

  // Control Points
  // Input -> Agent
  const cToAgent = { x: (inputQueueX + agentCenter.x) / 2, y: 200 } 
  // Input Queue Bottom -> Agent Left
  const cInputToAgent = { x: (inputQueueX + pAgentLeft.x) / 2, y: 260 } 

  // Agent -> Human Queue
  const cToHumanQueue = { x: (agentCenter.x + humanQueueX) / 2, y: 140 }
  
  // Human Queue -> Agent (Return)
  const cFromHumanQueue = { x: (humanQueueX + agentCenter.x) / 2, y: 260 }

  // Agent Exit (Arc OVER Human Queue)
  const cAgentExit = { x: 300, y: 80 } 

  // Human Exit (Short arc to right)
  const cHumanExit = { x: 370, y: 240 }

  // Visual offsets for path gaps (Human Queue)
  const vToQueueStart = { x: pAgentTop.x + 12, y: pAgentTop.y - 4 }
  const vToQueueEnd = { x: pHumanQueueTop.x - 12, y: pHumanQueueTop.y - 4 }
  const vFromQueueStart = { x: pHumanQueueBottom.x - 12, y: pHumanQueueBottom.y + 4 }
  const vFromQueueEnd = { x: pAgentBottom.x + 12, y: pAgentBottom.y + 4 }
  
  // Visual offsets for Agent Exit
  const vAgentExitStart = { x: pAgentTop.x + 10, y: pAgentTop.y - 5 }
  const vAgentExitEnd = { x: pExitFinal.x - 10, y: pExitFinal.y }

  // Visual offsets for Human Exit
  const vHumanExitStart = { x: pHumanQueueBottom.x + 12, y: pHumanQueueBottom.y }
  const vHumanExitEnd = { x: pExitHuman.x - 10, y: pExitHuman.y }
  
  // Visual offsets for Input -> Agent
  const vInputToAgentStart = { x: pInputQueueBottom.x + 8, y: pInputQueueBottom.y }
  const vInputToAgentEnd = { x: pAgentLeft.x - 8, y: pAgentLeft.y }


  // --- Configuration ---
  const PRESETS = {
      efficient: { itemCount: 5, autoProcessRate: 0.4, returnToAgentRate: 0.5, queueTime: 1000, agentProcessingTime: 500, minOrbitTime: 2000 },
      backlog:   { itemCount: 12, autoProcessRate: 0.05, returnToAgentRate: 0.5, queueTime: 1000, agentProcessingTime: 500, minOrbitTime: 1000 }, 
      burst:     { itemCount: 8, autoProcessRate: 0.5, returnToAgentRate: 0.5, queueTime: 1000, agentProcessingTime: 300, minOrbitTime: 1000 },
      steps_back: { 
          itemCount: 10, 
          autoProcessRate: 0.2, 
          returnToAgentRate: 0.5, 
          queueTime: 1000, 
          agentProcessingTime: 500,
          minOrbitTime: 1000,
          stepBackAfterItems: 4,
          outageDuration: 10000
      },
      agent_overload: {
          itemCount: 15,
          autoProcessRate: 0.5, // High auto rate to keep human queue clear
          returnToAgentRate: 0.1,
          queueTime: 500,       // Fast human
          agentProcessingTime: 2000, // Slow agent -> Bottleneck
          minOrbitTime: 1000
      },
      low_capacity: {
          itemCount: 6,
          autoProcessRate: 0.5,
          returnToAgentRate: 0.1,
          queueTime: 500,
          agentProcessingTime: 500, // Fast ingestion
          minOrbitTime: 1000,
          maxInFlight: 1 // Capacity Bottleneck (set to 1 as requested)
      },
      autonomous: {
          itemCount: 8,
          autoProcessRate: 1.0, // 100% Autonomous
          returnToAgentRate: 0,
          queueTime: 0,
          agentProcessingTime: 500,
          minOrbitTime: 2000
      },
      closely_supervised: {
          itemCount: 15,
          autoProcessRate: 0.0, 
          returnToAgentRate: 0.0,
          queueTime: 0,
          agentProcessingTime: 500, // Fast ingestion
          minOrbitTime: 1000,
          maxInFlight: 1,
          supervisionMean: 1500,
          supervisionStdDev: 500
      }
  }
  
  // Memoize generated items
  const activeRaw = React.useMemo(() => {
      const baseConfig = PRESETS[scenario] || PRESETS.efficient
      const finalConfig = { ...baseConfig, ...config }
      return generateScenario(finalConfig)
  }, [scenario, config.itemCount, config.autoProcessRate, config.returnToAgentRate, config.queueTime, config.agentProcessingTime, config.minOrbitTime, config.seed, config.outageStart, config.outageDuration, config.stepBackAfterItems, config.maxInFlight])

  const { items: activeItems, outageStart: effectiveOutageStart } = activeRaw

  const cycleIndex = Math.floor(timeMs / CYCLE_DURATION)
  const cycleTime = timeMs % CYCLE_DURATION
  
  // Check if Autonomous Mode
  const activeConfig = PRESETS[scenario] || {}
  const mergedConfig = { ...activeConfig, ...config }
  const isAutonomous = mergedConfig.autoProcessRate === 1.0
  const isCloselySupervised = !!mergedConfig.supervisionMean

  // --- Processor ---
  const processScenario = (items, timeOffset, idPrefix) => {
    return items.map(item => {
        let currentTime = item.start + timeOffset
        const processedSteps = item.steps.map(step => {
            const startTime = currentTime
            let duration = 0
            
            switch (step.type) {
                case 'spawn':
                case 'travel_to_input': // Fast move to queue
                    duration = 500
                    break
                case 'travel_to_agent': // 1s
                    duration = TRAVEL_DURATION
                    break
                case 'orbit':
                    duration = snapOrbit(step.min, step.startAng, step.targetAng)
                    break
                case 'to_queue':
                case 'return':
                    duration = TRAVEL_DURATION
                    break
                case 'input_queue':
                case 'queue':
                case 'supervision':
                    duration = step.duration
                    break
                case 'exit':
                case 'exit_final':
                    duration = EXIT_DURATION
                    break
            }
            
            currentTime += duration
            return { ...step, startTime, endTime: currentTime, duration }
        })
        
        return { 
            id: `${idPrefix}-${item.id}`,
            steps: processedSteps,
            endTime: currentTime,
            tInputQueueEntry: processedSteps.find(s => s.type === 'input_queue')?.startTime,
            tInputQueueExit: processedSteps.find(s => s.type === 'input_queue')?.endTime,
            tQueueEntry: processedSteps.find(s => s.type === 'queue')?.startTime,
            tQueueExit: processedSteps.find(s => s.type === 'queue')?.endTime,
        }
    })
  }

  // Calculate items for current and previous cycles
  const currentItems = processScenario(activeItems, cycleIndex * CYCLE_DURATION, `c${cycleIndex}`)
  const prevItems = cycleIndex > 0 ? processScenario(activeItems, (cycleIndex - 1) * CYCLE_DURATION, `c${cycleIndex-1}`) : []
  const prevItems2 = cycleIndex > 1 ? processScenario(activeItems, (cycleIndex - 2) * CYCLE_DURATION, `c${cycleIndex-2}`) : []
  
  const allActiveItems = [...prevItems2, ...prevItems, ...currentItems]

  // --- Queue Slot Logic (Human) ---
  const itemsInHumanQueue = allActiveItems.filter(item => 
      item.tQueueEntry !== undefined && 
      timeMs >= item.tQueueEntry && 
      timeMs <= item.tQueueExit
  )
  itemsInHumanQueue.sort((a, b) => a.tQueueEntry - b.tQueueEntry)
  const humanQueueMap = new Map()
  itemsInHumanQueue.forEach((item, index) => humanQueueMap.set(item.id, index))
  const isHumanOverloaded = itemsInHumanQueue.length > 5

  // --- Queue Slot Logic (Input) ---
  const itemsInInputQueue = allActiveItems.filter(item => 
    item.tInputQueueEntry !== undefined && 
    timeMs >= item.tInputQueueEntry && 
    timeMs <= item.tInputQueueExit
  )
  itemsInInputQueue.sort((a, b) => a.tInputQueueEntry - b.tInputQueueEntry)
  const inputQueueMap = new Map()
  itemsInInputQueue.forEach((item, index) => inputQueueMap.set(item.id, index))
  const isInputOverloaded = itemsInInputQueue.length > 5


  // --- Human Availability Logic ---
  
  let isHumanAway = false
  const finalOutageStart = effectiveOutageStart ?? mergedConfig.outageStart
  
  if (finalOutageStart !== undefined && finalOutageStart !== null) {
      const start = finalOutageStart
      const end = start + mergedConfig.outageDuration
      // Handle wrapping in visual
      if (end <= CYCLE_DURATION) {
         if (cycleTime >= start && cycleTime < end) isHumanAway = true
      } else {
         const wrappedEnd = end % CYCLE_DURATION
         if (cycleTime >= start || cycleTime < wrappedEnd) isHumanAway = true
      }
  }

  // --- HARD CAPACITY ENFORCEMENT ---
  // First pass: count items currently in the loop
  const itemsCurrentlyInLoop = new Set()
  if (mergedConfig.maxInFlight === 1) {
    for (const item of allActiveItems) {
      if (timeMs > item.endTime || timeMs < item.steps[0].startTime) continue
      const step = item.steps.find(s => timeMs >= s.startTime && timeMs < s.endTime)
      if (!step) continue
      // An item is IN the loop if it's in any of these phases
      if (['travel_to_agent', 'orbit', 'supervision', 'return', 'exit_final'].includes(step.type)) {
        itemsCurrentlyInLoop.add(item.id)
      }
    }
    
    if (itemsCurrentlyInLoop.size > 1) {
      console.error(`VIOLATION at ${timeMs}: ${itemsCurrentlyInLoop.size} items in loop:`, Array.from(itemsCurrentlyInLoop))
    }
  }

  // --- Render with HARD CAPACITY GATE ---
  const renderItems = allActiveItems.map(item => {
    if (timeMs > item.endTime) return null
    if (timeMs < item.steps[0].startTime) return null

    const activeStep = item.steps.find(s => timeMs >= s.startTime && timeMs < s.endTime)
    if (!activeStep) return null
    
    // HARD GATE: Enforce capacity limit
    let effectiveStep = activeStep
    let effectiveP = (timeMs - activeStep.startTime) / activeStep.duration
    let isBlocked = false
    
    if (mergedConfig.maxInFlight === 1) {
      const loopPhases = ['travel_to_agent', 'orbit', 'supervision', 'return', 'exit_final']
      const otherInLoop = Array.from(itemsCurrentlyInLoop).filter(id => id !== item.id)
      
      // If this item is in ANY loop phase and loop is occupied by another item
      if (otherInLoop.length >= 1 && loopPhases.includes(activeStep.type)) {
        // Find the last queue step before this loop phase
        const stepIndex = item.steps.indexOf(activeStep)
        
        // Search backwards for a queue step
        for (let i = stepIndex - 1; i >= 0; i--) {
          const prevStep = item.steps[i]
          if (prevStep.type === 'input_queue' || prevStep.type === 'queue') {
            effectiveStep = prevStep
            effectiveP = 1.0 // Stay at bottom of queue
            isBlocked = true
            break
          }
        }
        
        // If no queue found, just don't render this item
        if (!isBlocked) {
          return null
        }
      }
    }
    
    const p = effectiveP
    let x = 0, y = 0, opacity = 1, phase = effectiveStep.type
    let transitionStyle = "opacity 0.2s" // Default

    // Slot position logic
    const humanSlotIndex = humanQueueMap.get(item.id) ?? 0
    const inputSlotIndex = inputQueueMap.get(item.id) ?? 0
    const SLOT_SPACING = 12
    const humanSlotY = pHumanQueueBottom.y - (humanSlotIndex * SLOT_SPACING) 
    const inputSlotY = pInputQueueBottom.y - (inputSlotIndex * SLOT_SPACING)

    switch (effectiveStep.type) {
        case 'spawn':
             // Initial appearance far left?
             x = (inputQueueX - 60) + p * 20
             y = pInputQueueTop.y - 40 // Start high up?
             opacity = p
             break
        case 'travel_to_input':
             // From spawn point to Input Queue Top
             const pSpawnEnd = { x: inputQueueX - 40, y: pInputQueueTop.y - 40 }
             const pt0 = getQuadBezierPoint(p, pSpawnEnd, { x: inputQueueX, y: pInputQueueTop.y - 40 }, pInputQueueTop)
             x = pt0.x; y = pt0.y
             opacity = 1
             phase = "traveling_input"
             break
        case 'input_queue':
             x = pInputQueueTop.x
             y = inputSlotY
             phase = "queued_input"
             transitionStyle = "cy 0.3s ease-out, opacity 0.2s"
             break
        case 'travel_to_agent':
             // Input Queue Bottom -> Agent Left
             const ptAgent = getQuadBezierPoint(p, pInputQueueBottom, cInputToAgent, pAgentLeft)
             x = ptAgent.x; y = ptAgent.y
             phase = "traveling_agent"
             break
        case 'orbit':
            // ORBIT FIX: Ensure smooth circular motion
            const angle = activeStep.startAng + p * (activeStep.duration * SPEED)
            x = agentCenter.x + agentRadius * Math.cos(angle)
            y = agentCenter.y + agentRadius * Math.sin(angle)
            // No specialized transition for orbit (needs to be instant frame-by-frame)
            transitionStyle = "none" 
            break
        case 'supervision':
            // Static at Right Side
            x = agentCenter.x + agentRadius
            y = agentCenter.y
            phase = "supervised"
            transitionStyle = "none"
            break
        case 'to_queue':
            const pt1 = getQuadBezierPoint(p, pAgentTop, cToHumanQueue, pHumanQueueTop)
            x = pt1.x; y = pt1.y
            phase = "traveling_to"
            break
        case 'queue':
            x = pHumanQueueTop.x
            y = humanSlotY
            phase = "queued"
            transitionStyle = "cy 0.3s ease-out, opacity 0.2s" // Smooth sliding
            break
        case 'return':
            const pt2 = getQuadBezierPoint(p, pHumanQueueBottom, cFromHumanQueue, pAgentBottom)
            x = pt2.x; y = pt2.y
            phase = "returning"
            break
        case 'exit': 
             // Exiting from Human Queue
             const ptExitHuman = getQuadBezierPoint(p, pHumanQueueBottom, cHumanExit, pExitHuman)
             x = ptExitHuman.x; y = ptExitHuman.y
             opacity = 1 - p
             phase = "exiting"
             break
        case 'exit_final':
             // Exiting from Agent (Apex)
             const ptExitFinal = getQuadBezierPoint(p, pAgentTop, cAgentExit, pExitFinal)
             x = ptExitFinal.x; y = ptExitFinal.y
             opacity = 1 - p
             phase = "exiting_final"
             break
    }

    // Force opacity to 1 if not explicitly fading (spawn/exit)
    if (phase !== 'spawn' && phase !== 'exiting' && phase !== 'exiting_final' && phase !== 'traveling_input') {
        opacity = 1
    }

    return { ...item, x, y, opacity, phase, transitionStyle }
  }).filter(Boolean)

  const showToPath = renderItems.some(i => i.phase === "traveling_to")
  const showFromPath = renderItems.some(i => i.phase === "returning")
  const showInputPath = renderItems.some(i => i.phase === "traveling_agent")
  const showAgentExitPath = renderItems.some(i => i.phase === "exiting_final")
  const showHumanExitPath = renderItems.some(i => i.phase === "exiting")
  
  const targetHumanX = isCloselySupervised ? agentCenter.x + 80 : humanCenter.x

  return (
    <svg
      className={className}
      data-diagram-renderer="d3"
      style={{
        ...getDiagramThemeVars(theme),
        display: "block",
        width: "100%",
        height: "auto",
        background: "transparent",
        ...style,
      }}
      viewBox="0 0 460 400"
    >
      <defs>
        <marker id="hitlArrow" viewBox="0 -5 10 10" refX={8} refY={0} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,-4L10,0L0,4" fill={t.primary} />
        </marker>
      </defs>

      <circle cx={agentCenter.x} cy={agentCenter.y} r={agentRadius} fill="none" stroke={t.primary} strokeWidth={2} opacity={0.3} />
      
      {/* Input Queue */}
      <QueueVisual x={inputQueueX} yTop={queueTopY} yBottom={queueBottomY} isOverloaded={isInputOverloaded} t={t} />

      {/* Human Queue - HIDDEN IN AUTONOMOUS MODE OR CLOSELY SUPERVISED */}
      {!isAutonomous && !isCloselySupervised && (
          <QueueVisual x={humanQueueX} yTop={queueTopY} yBottom={queueBottomY} isOverloaded={isHumanOverloaded} t={t} />
      )}

      {/* Path: Input -> Agent */}
      <path d={`M ${vInputToAgentStart.x},${vInputToAgentStart.y} Q ${cInputToAgent.x},${cInputToAgent.y} ${vInputToAgentEnd.x},${vInputToAgentEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s" }} opacity={showInputPath ? 0.4 : 0} />

      {/* Path: Agent -> Human Queue */}
      {!isAutonomous && (
        <path d={`M ${vToQueueStart.x},${vToQueueStart.y} Q ${cToHumanQueue.x},${cToHumanQueue.y} ${vToQueueEnd.x},${vToQueueEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s" }} opacity={showToPath ? 0.4 : 0} />
      )}
      
      {/* Path: Human Queue -> Agent */}
      {!isAutonomous && (
        <path d={`M ${vFromQueueStart.x},${vFromQueueStart.y} Q ${cFromHumanQueue.x},${cFromHumanQueue.y} ${vFromQueueEnd.x},${vFromQueueEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s" }} opacity={showFromPath ? 0.4 : 0} />
      )}

      {/* Path: Agent -> Exit (Over Human Queue) */}
      <path d={`M ${vAgentExitStart.x},${vAgentExitStart.y} Q ${cAgentExit.x},${cAgentExit.y} ${vAgentExitEnd.x},${vAgentExitEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s" }} opacity={showAgentExitPath ? 0.4 : 0} />

      {/* Path: Human -> Exit */}
      {!isAutonomous && (
        <path d={`M ${vHumanExitStart.x},${vHumanExitStart.y} Q ${cHumanExit.x},${cHumanExit.y} ${vHumanExitEnd.x},${vHumanExitEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s" }} opacity={showHumanExitPath ? 0.4 : 0} />
      )}

      <g transform={`translate(${agentCenter.x - 32}, ${agentCenter.y - 32})`}><Brain size={64} color={t.primary} strokeWidth={1.5} /></g>
      
      {/* Human Icon with 'Steps Back' Animation */}
      {!isAutonomous && (
          <g 
            transform={`translate(${targetHumanX - 32}, ${humanCenter.y - 32})`}
            style={{
                transform: `translate(${targetHumanX - 32 + (isHumanAway ? 60 : 0)}px, ${humanCenter.y - 32}px)`,
                opacity: isHumanAway ? 0.3 : 1,
                transition: "transform 1s ease-in-out, opacity 1s ease-in-out"
            }}
          >
            <User size={64} color={t.inkSecondary} strokeWidth={1.5} />
          </g>
      )}

      {renderItems.map(item => (
        <circle 
            key={item.id} 
            cx={item.x} 
            cy={item.y} 
            r={6} 
            fill={t.ink} 
            stroke={t.surface} 
            strokeWidth={1} 
            opacity={item.opacity}
            style={{ transition: item.transitionStyle }} 
        />
      ))}
    </svg>
  )
}

export default HumanInTheLoopDiagram
