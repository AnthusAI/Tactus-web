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
const SPAWN_DURATION = 300  // Faster spawn animation
const TRAVEL_TO_INPUT_DURATION = 300  // Faster initial travel
const TRAVEL_TO_AGENT_DURATION = 500  // Faster transition from queue to agent loop
const TRAVEL_DURATION = 500  // Agent to human queue travel (matching agent entry speed)
const EXIT_DURATION = 400  // Faster ejection animation
const CYCLE_DURATION = 15000

// --- Helper Components ---
const QueueVisual = ({ x, yTop, yBottom, isOverloaded, t }) => (
    <g>
        <path d={`M ${x - 25},${yTop - 10} L ${x - 25},${yBottom + 20}`} stroke={isOverloaded ? t.primary : t.surface2} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d={`M ${x + 25},${yTop - 10} L ${x + 25},${yBottom + 20}`} stroke={isOverloaded ? t.primary : t.surface2} strokeWidth={4} fill="none" strokeLinecap="round" />
        
        {/* Overload Indicator */}
        <g
            transform={`translate(${x}, ${yBottom + 23})`}
            opacity={isOverloaded ? 1 : 0}
        >
            <circle r={12} fill="var(--color-primary)" opacity={0.2} >
                <animate attributeName="r" values="12;16;12" dur="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.5;0.2" dur="1s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(-10, -10)">
                <AlertCircle size={20} color="var(--color-primary)" />
            </g>
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

// --- Helper: Generate Raw Items (intrinsic timing only, no scheduling) ---
// This produces items with their natural spawn times and step definitions,
// but WITHOUT any queue wait times or loop capacity delays baked in.
// All scheduling decisions are made later by scheduleItems().
const generateRawItems = (config) => {
    const {
        seed = 123,
        itemCount = 5,
        spawnJitterMs = 500,
        autoProcessRate = 0.4,
        returnToAgentRate = 0.5,
        minOrbitTime = 1000,
        maxOrbitTime = 3000,
        queueTime = 1500,
        supervisionMean,
        supervisionStdDev = 500,
        outageStart = null,
        stepBackAfterItems = undefined,
        useRampingSpawn = false,  // For autonomous scenario: ramp up spawn rate
    } = config

    const rng = mulberry32(seed)
    const items = []
    const interval = CYCLE_DURATION / itemCount

    // No longer pre-calculate outage start - this will be handled dynamically in the scheduler
    let computedOutageStart = outageStart

    for (let i = 0; i < itemCount; i++) {
        let start
        if (useRampingSpawn) {
            // Ramp up spawn rate: start moderate, accelerate to "ludicrous speed" (dense), then plateau
            // Use a curve that accelerates: more items spawn later in the cycle
            // Map item index to time using an exponential-like curve
            const t = i / (itemCount - 1) // 0 to 1 (progress through items)

            // Use cubic easing for dramatic acceleration
            // Start at ~20% of cycle, end at ~95% of cycle, with most items in the final third
            const tCubed = t * t * t // Cubic acceleration
            const startRatio = 0.1  // Start at 10% through cycle (1.5s)
            const endRatio = 0.95   // End at 95% through cycle (14.25s)
            const mappedT = startRatio + (tCubed * (endRatio - startRatio))

            start = mappedT * CYCLE_DURATION + (rng() * spawnJitterMs * 0.3)
        } else {
            start = i * interval + (rng() * spawnJitterMs)
        }
        if (start >= CYCLE_DURATION - SPAWN_DURATION) break

        const rollAuto = rng()
        const isAuto = rollAuto < autoProcessRate
        const orbitDurRaw = minOrbitTime + rng() * (maxOrbitTime - minOrbitTime)

        if (supervisionMean) {
            // --- Closely Supervised Path ---
            const orbitDur1 = snapOrbit(minOrbitTime / 2, Math.PI, 2 * Math.PI)
            const supervisionDur = Math.max(200, gaussian(rng, supervisionMean, supervisionStdDev))
            const orbitDur2 = snapOrbit(minOrbitTime * 0.75, 0, 1.5 * Math.PI)

            items.push({
                id: i + 1,
                spawnTime: start,
                flowType: 'supervised',
                intrinsicSteps: [
                    { type: 'spawn', duration: SPAWN_DURATION },
                    { type: 'travel_to_input', duration: TRAVEL_TO_INPUT_DURATION },
                    { type: 'input_queue', duration: 0 }, // Placeholder - scheduler sets actual duration
                    { type: 'travel_to_agent', duration: TRAVEL_TO_AGENT_DURATION },
                    { type: 'orbit', startAng: Math.PI, targetAng: 2 * Math.PI, duration: orbitDur1 },
                    { type: 'supervision', duration: supervisionDur },
                    { type: 'orbit', startAng: 0, targetAng: 1.5 * Math.PI, duration: orbitDur2 },
                    { type: 'exit_final', duration: EXIT_DURATION },
                ],
            })
        } else if (isAuto) {
            // --- Autonomous Path ---
            const orbitDur = snapOrbit(orbitDurRaw, Math.PI, 1.5 * Math.PI)

            items.push({
                id: i + 1,
                spawnTime: start,
                flowType: 'auto',
                intrinsicSteps: [
                    { type: 'spawn', duration: SPAWN_DURATION },
                    { type: 'travel_to_input', duration: TRAVEL_TO_INPUT_DURATION },
                    { type: 'input_queue', duration: 0 },
                    { type: 'travel_to_agent', duration: TRAVEL_TO_AGENT_DURATION },
                    { type: 'orbit', startAng: Math.PI, targetAng: 1.5 * Math.PI, duration: orbitDur },
                    { type: 'exit_final', duration: EXIT_DURATION },
                ],
            })
        } else {
            // --- Manual Path (to human queue) ---
            const orbitDur = snapOrbit(orbitDurRaw, Math.PI, 1.5 * Math.PI)
            const rollReturn = rng()
            const isReturned = rollReturn < returnToAgentRate

            const steps = [
                { type: 'spawn', duration: SPAWN_DURATION },
                { type: 'travel_to_input', duration: TRAVEL_TO_INPUT_DURATION },
                { type: 'input_queue', duration: 0 },
                { type: 'travel_to_agent', duration: TRAVEL_TO_AGENT_DURATION },
                { type: 'orbit', startAng: Math.PI, targetAng: 1.5 * Math.PI, duration: orbitDur },
                { type: 'to_queue', duration: TRAVEL_DURATION },
                { type: 'queue', duration: queueTime }, // Base duration, scheduler may extend
            ]

            if (isReturned) {
                const retOrbitDur = snapOrbit(2000, 2.5 * Math.PI, 1.5 * Math.PI)
                steps.push({ type: 'return', duration: TRAVEL_DURATION })
                steps.push({ type: 'orbit', startAng: 2.5 * Math.PI, targetAng: 1.5 * Math.PI, duration: retOrbitDur })
                steps.push({ type: 'exit_final', duration: EXIT_DURATION })
            } else {
                steps.push({ type: 'exit', duration: EXIT_DURATION })
            }

            items.push({
                id: i + 1,
                spawnTime: start,
                flowType: 'manual',
                isReturned,
                intrinsicSteps: steps,
            })
        }
    }

    return { items, outageStart: computedOutageStart }
}

// --- Unified Scheduler ---
// Makes all timing decisions in one pass, based on current state at each moment.
// This replaces the old generateScenario scheduling + applyInputThrottle + applyLoopCapacityThrottle.
//
// IMPORTANT: For `stepBackAfterItems` scenarios, this scheduler does NOT pre-calculate
// human outages. Instead, items are scheduled with their natural processing times,
// and human availability is determined at RENDER TIME based on actual queue state.
const scheduleItems = (rawItems, config) => {
    const {
        maxInputQueueCapacity = 6,
        maxInFlight = 100,
        inputIntervalMs,
        agentProcessingTime = 500,
        queueTime = 1500,
        outageStart = null,
        outageDuration = 0,
        stepBackAfterItems = undefined,
    } = config

    // Default input interval based on item count if not specified
    const interval = inputIntervalMs ?? Math.max(50, CYCLE_DURATION / Math.max(1, rawItems.length))

    // Sort by natural spawn time
    const sorted = [...rawItems].sort((a, b) => a.spawnTime - b.spawnTime)

    // PRE-COMPUTATION: For supervised items with stepBackAfterItems and maxInFlight=1,
    // we need to calculate actual completion times accounting for human absence.
    // This mirrors the render-time state machine logic.
    const schedulerCompletionTimes = new Map() // item.id -> actualCompletionTime

    if (stepBackAfterItems !== undefined && maxInFlight === 1) {
        const supervisedItems = sorted.filter(raw => raw.flowType === 'supervised')

        let humanPresent = true
        let sessionProcessedCount = 0
        let humanBusyUntil = 0
        let loopFreeAtPrecomp = -Infinity  // Track when loop is free in pre-computation
        const absencePeriods = []

        for (const raw of supervisedItems) {
            const supervisionStep = raw.intrinsicSteps.find(s => s.type === 'supervision')
            if (!supervisionStep) continue

            // Calculate when this item reaches the input queue (spawn + travel_to_input)
            let inputQueueArrival = raw.spawnTime
            for (const step of raw.intrinsicSteps) {
                if (step.type === 'input_queue') break
                inputQueueArrival += step.duration
            }

            // Item is ready to enter loop after agentProcessingTime
            const readyTime = inputQueueArrival + agentProcessingTime

            // With maxInFlight=1, must wait for loop to be free
            const loopEntryTime = Math.max(readyTime, loopFreeAtPrecomp)

            // Calculate when item reaches supervision position
            let supervisionStart = loopEntryTime
            let reachedSupervision = false
            for (const step of raw.intrinsicSteps) {
                if (step.type === 'travel_to_agent') reachedSupervision = true
                if (!reachedSupervision) continue
                if (step.type === 'supervision') break
                supervisionStart += step.duration
            }

            const supervisionDuration = supervisionStep.duration

            // Can only start processing when human is free and item has arrived
            let processingStart = Math.max(supervisionStart, humanBusyUntil)

            // If human is currently away, skip to when they return
            for (const absence of absencePeriods) {
                if (processingStart >= absence.start && processingStart < absence.end) {
                    processingStart = absence.end
                }
            }

            // Complete processing
            const processingEnd = processingStart + supervisionDuration
            humanBusyUntil = processingEnd
            sessionProcessedCount++

            // Record when this item actually completes supervision
            schedulerCompletionTimes.set(raw.id, processingEnd)

            // Calculate when loop becomes free (after item exits)
            // Time from supervision completion to exit
            let postSupervisionDuration = 0
            let foundSupervision = false
            for (const step of raw.intrinsicSteps) {
                if (step.type === 'supervision') foundSupervision = true
                else if (foundSupervision) postSupervisionDuration += step.duration
            }
            loopFreeAtPrecomp = processingEnd + postSupervisionDuration

            // After completing this item, check if human should step away
            if (sessionProcessedCount >= stepBackAfterItems) {
                // Human pauses for 1 second, then steps away for 3 seconds, then takes 1 second to return
                const pauseDuration = 1000
                const absenceDuration = 3000
                const returnTransitionDuration = 1000  // Time for human to visually return to position
                absencePeriods.push({
                    start: processingEnd + pauseDuration,
                    end: processingEnd + pauseDuration + absenceDuration
                })
                sessionProcessedCount = 0
                // Human is busy until they fully return (absence + return transition)
                humanBusyUntil = processingEnd + pauseDuration + absenceDuration + returnTransitionDuration
            }
        }
    }

    // State tracking
    let nextInputAdmission = -Infinity  // When we can next admit an item to input queue
    let loopFreeAt = -Infinity          // When agent loop becomes available
    let humanFreeAt = -Infinity         // When human becomes available
    const inputQueueExits = []          // Track when items leave input queue (for capacity)

    const scheduled = []

    for (const raw of sorted) {
        // 1. ADMISSION TO INPUT QUEUE
        // Respect: spawn time, input interval, and queue capacity
        let admitTime = Math.max(raw.spawnTime, nextInputAdmission)

        // Prune exits that have already happened
        while (inputQueueExits.length > 0 && inputQueueExits[0] <= admitTime) {
            inputQueueExits.shift()
        }

        // If queue is at capacity, wait for a slot to free up
        // AND add a delay (3x interval) after capacity frees to show the overload state clearing
        if (inputQueueExits.length >= maxInputQueueCapacity) {
            const earliestExit = inputQueueExits.shift()
            // Add 3x interval delay after queue drops below capacity to clearly show non-overloaded state
            admitTime = Math.max(admitTime, earliestExit + (interval * 3))
        }

        // 2. TIME IN INPUT QUEUE
        // Item is "ready" after agentProcessingTime, but can't leave until loop is free
        const readyTime = admitTime + agentProcessingTime
        let loopEntryTime = readyTime

        // If maxInFlight constraint, wait for loop to be free
        if (maxInFlight === 1) {
            loopEntryTime = Math.max(readyTime, loopFreeAt)
        }

        // 3. CALCULATE LOOP DURATION
        // Find how long this item occupies the loop (from travel_to_agent start to exit)
        let loopDuration = 0
        let inLoop = false
        for (const step of raw.intrinsicSteps) {
            if (step.type === 'travel_to_agent') inLoop = true
            if (inLoop) {
                loopDuration += step.duration
                // Loop ends at exit_final or to_queue (for manual path)
                if (step.type === 'exit_final' || step.type === 'to_queue') {
                    break
                }
            }
        }

        // Update loop free time
        if (maxInFlight === 1) {
            // For supervised items with stepBackAfterItems, use the pre-computed
            // actual completion time (which accounts for human absence)
            const actualCompletion = schedulerCompletionTimes.get(raw.id)
            if (actualCompletion !== undefined && raw.flowType === 'supervised') {
                // Calculate time from supervision completion to exit
                let postSupervisionDuration = 0
                let foundSupervision = false
                for (const step of raw.intrinsicSteps) {
                    if (step.type === 'supervision') foundSupervision = true
                    else if (foundSupervision) postSupervisionDuration += step.duration
                }
                loopFreeAt = actualCompletion + postSupervisionDuration
            } else {
                loopFreeAt = loopEntryTime + loopDuration
            }
        }

        // 4. RECORD INPUT QUEUE EXIT for capacity tracking
        inputQueueExits.push(loopEntryTime)
        inputQueueExits.sort((a, b) => a - b)

        // 5. BUILD SCHEDULED STEPS with computed times
        const inputQueueDuration = loopEntryTime - admitTime
        let currentTime = raw.spawnTime

        const scheduledSteps = []
        for (const step of raw.intrinsicSteps) {
            const startTime = currentTime
            let duration = step.duration

            // Override input_queue duration with computed value
            if (step.type === 'input_queue') {
                duration = inputQueueDuration
            }

            // Handle human queue timing for manual path
            // For stepBackAfterItems scenarios, schedule items normally - human availability
            // is determined at render time, not here.
            if (step.type === 'queue' && raw.flowType === 'manual') {
                const humanArrival = currentTime

                let effectiveStart = Math.max(humanArrival, humanFreeAt)

                // Use fixed outage window if provided (only for non-dynamic mode)
                if (outageStart !== null && outageStart !== undefined && stepBackAfterItems === undefined) {
                    const outageEnd = outageStart + outageDuration
                    if (humanArrival < outageEnd) {
                        effectiveStart = Math.max(effectiveStart, outageEnd)
                    }
                }

                const effectiveEnd = effectiveStart + queueTime
                duration = effectiveEnd - humanArrival
                humanFreeAt = effectiveEnd

                // If item returns to agent, check loop capacity again
                if (raw.isReturned && maxInFlight === 1) {
                    // Find return loop duration
                    let returnLoopDur = 0
                    let foundReturn = false
                    for (const s of raw.intrinsicSteps) {
                        if (s.type === 'return') foundReturn = true
                        if (foundReturn) returnLoopDur += s.duration
                    }

                    const returnTime = Math.max(effectiveEnd, loopFreeAt)
                    const returnDelay = returnTime - effectiveEnd
                    duration += returnDelay
                    humanFreeAt = effectiveEnd + returnDelay
                    loopFreeAt = returnTime + returnLoopDur
                }
            }

            scheduledSteps.push({
                ...step,
                startTime,
                endTime: startTime + duration,
                duration,
            })

            currentTime += duration
        }

        // Shift all steps by the admission delay
        const admissionDelay = admitTime - raw.spawnTime
        if (admissionDelay > 0) {
            for (const step of scheduledSteps) {
                step.startTime += admissionDelay
                step.endTime += admissionDelay
            }
        }

        scheduled.push({
            id: raw.id,
            flowType: raw.flowType,
            isReturned: raw.isReturned,
            steps: scheduledSteps,
            endTime: scheduledSteps[scheduledSteps.length - 1]?.endTime ?? currentTime,
            tInputAdmission: scheduledSteps.find(s => s.type === 'travel_to_input')?.startTime,
            tInputQueueEntry: scheduledSteps.find(s => s.type === 'input_queue')?.startTime,
            tInputQueueExit: scheduledSteps.find(s => s.type === 'input_queue')?.endTime,
            tQueueEntry: scheduledSteps.find(s => s.type === 'queue')?.startTime,
            tQueueExit: scheduledSteps.find(s => s.type === 'queue')?.endTime,
        })

        // 6. UPDATE NEXT ADMISSION TIME
        nextInputAdmission = admitTime + interval
    }

    // Return scheduled items (human outage is determined at render time for stepBackAfterItems)
    return {
        items: scheduled,
    }
}


const HumanInTheLoopDiagram = ({
  theme = "light",
  time = 0,
  scenario = "efficient",
  config = {},
  style,
  className,
  showMonkey = false
}) => {
  const t = diagramTokens
  const timeMs = time

  // --- Layout Constants ---
  // Shifted Right to accommodate Input Queue
  const inputQueueX = 60
  const agentCenter = { x: 180, y: 176 }
  const agentRadius = 40
  const humanQueueX = 300
  const humanCenter = { x: 360, y: 176 }

  const queueTopY = 146
  const queueBottomY = 206
  
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
  const pExitFinal = { x: 440, y: 120 } // Exit from Agent (Apex) - raised to clear human icon
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
  const vToQueueStart = { x: pAgentTop.x + 12, y: pAgentTop.y }
  const vToQueueEnd = { x: pHumanQueueTop.x - 12, y: pHumanQueueTop.y }
  const vFromQueueStart = { x: pHumanQueueBottom.x - 12, y: pHumanQueueBottom.y }
  const vFromQueueEnd = { x: pAgentBottom.x + 12, y: pAgentBottom.y }
  
  // Visual offsets for Agent Exit
  const vAgentExitStart = { x: pAgentTop.x + 10, y: pAgentTop.y }
  const vAgentExitEnd = { x: pExitFinal.x - 10, y: pExitFinal.y }

  // Visual offsets for Human Exit
  const vHumanExitStart = { x: pHumanQueueBottom.x + 12, y: pHumanQueueBottom.y }
  const vHumanExitEnd = { x: pExitHuman.x - 10, y: pExitHuman.y }
  
  // Visual offsets for Input -> Agent
  const vInputToAgentStart = { x: pInputQueueBottom.x + 8, y: pInputQueueBottom.y + 6 }
  const vInputToAgentEnd = { x: pAgentLeft.x - 8, y: pAgentLeft.y }


  // --- Configuration ---
  const PRESETS = {
      efficient: { itemCount: 12, autoProcessRate: 0.4, returnToAgentRate: 0.5, queueTime: 1000, agentProcessingTime: 500, minOrbitTime: 2000 },
      backlog:   { itemCount: 12, autoProcessRate: 0.05, returnToAgentRate: 0.5, queueTime: 1000, agentProcessingTime: 500, minOrbitTime: 1000 },
      burst:     { itemCount: 8, autoProcessRate: 0.5, returnToAgentRate: 0.5, queueTime: 1000, agentProcessingTime: 300, minOrbitTime: 1000 },
      steps_back: {
          itemCount: 12,
          autoProcessRate: 0.2,
          returnToAgentRate: 0.5,
          queueTime: 1000,
          agentProcessingTime: 500,
          minOrbitTime: 1000,
          stepBackAfterItems: 4,
          outageDuration: 10000
      },
      agent_overload: {
          itemCount: 40,  // Many more items to create sustained backlog
          autoProcessRate: 0.5, // High auto rate to keep human queue clear
          returnToAgentRate: 0.1,
          queueTime: 500,       // Fast human
          agentProcessingTime: 2000, // Slow agent -> Bottleneck
          minOrbitTime: 1000,
          inputIntervalMs: 200,  // Very fast input rate to overwhelm slow agent
          spawnJitterMs: 50  // Tight clustering for consistent pressure
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
      unsupervised: {
          itemCount: 30,  // More items for dramatic ramp-up effect
          autoProcessRate: 1.0, // 100% Autonomous
          returnToAgentRate: 0,
          queueTime: 0,
          agentProcessingTime: 500,
          minOrbitTime: 2000,
          useRampingSpawn: true,  // Ramp up spawn rate over the cycle
          spawnJitterMs: 100  // Reduced jitter for cleaner ramp
      },
      closely_supervised: {
          // Closely supervised: Items wait at 3 o'clock for supervision
          // Human is always present to supervise each item
          itemCount: 50,
          spawnJitterMs: 0,
          inputIntervalMs: 350,
          autoProcessRate: 0.0,
          returnToAgentRate: 0.0,
          queueTime: 0,
          agentProcessingTime: 500,
          minOrbitTime: 1000,
          maxInFlight: 1,
          supervisionMean: 1500,  // Items wait at 3 o'clock for supervision
          supervisionStdDev: 500
          // Note: stepBackAfterItems is NOT set here - human always present
          // The "absence" variant adds stepBackAfterItems via config override
      }
  }
  
  // Check if Autonomous Mode
  const activeConfig = PRESETS[scenario] || {}
  const mergedConfig = { ...activeConfig, ...config }
  const isAutonomous = mergedConfig.autoProcessRate === 1.0
  const isCloselySupervised = !!mergedConfig.supervisionMean

  // Memoize raw items (intrinsic timing only, no scheduling)
  const { items: rawItems, outageStart: effectiveOutageStart } = React.useMemo(() => {
      const baseConfig = PRESETS[scenario] || PRESETS.efficient
      const finalConfig = { ...baseConfig, ...config }
      return generateRawItems(finalConfig)
  }, [scenario, config.itemCount, config.autoProcessRate, config.returnToAgentRate, config.queueTime, config.agentProcessingTime, config.minOrbitTime, config.seed, config.outageStart, config.outageDuration, config.stepBackAfterItems, config.maxInFlight, config.supervisionMean, config.supervisionStdDev, config.useRampingSpawn, config.spawnJitterMs, config.inputIntervalMs])

  const cycleIndex = Math.floor(timeMs / CYCLE_DURATION)
  const cycleTime = timeMs % CYCLE_DURATION

  // Build all active items using the unified scheduler
  // This generates items across multiple cycles and schedules them all together,
  // ensuring consistent timing decisions across cycle boundaries.
  const schedulerResult = React.useMemo(() => {
    const LOOKBACK_CYCLES = 6
    const LOOKAHEAD_CYCLES = 10

    // Generate raw items for all relevant cycles
    const allRawItems = []
    for (
      let idx = Math.max(0, cycleIndex - LOOKBACK_CYCLES);
      idx <= cycleIndex + LOOKAHEAD_CYCLES;
      idx++
    ) {
      const cycleOffset = idx * CYCLE_DURATION
      for (const item of rawItems) {
        allRawItems.push({
          ...item,
          id: `c${idx}-${item.id}`,
          spawnTime: item.spawnTime + cycleOffset,
          intrinsicSteps: item.intrinsicSteps.map(s => ({ ...s })),
        })
      }
    }

    // Schedule all items together using unified scheduler
    const result = scheduleItems(allRawItems, {
      ...mergedConfig,
      outageStart: effectiveOutageStart,
    })

    // Return both items and computed outage info
    return result
  }, [rawItems, cycleIndex, mergedConfig, effectiveOutageStart])

  const capacityConstrainedItems = schedulerResult.items

  // --- Queue Slot Logic (Input) ---
  // Input "queue" occupancy is counted from the moment an item is admitted into the
  // input pipeline (starts traveling toward the queue) until it leaves the queue.
  // This keeps the overload indicator perfectly aligned with the throttle switch:
  // if the indicator is off, the system is accepting new items (at least into the
  // input pipeline), and if it is on, admissions are blocked.
  // Only count items that have actually landed in the queue (tInputQueueEntry), not those still traveling
  const itemsInInputQueue = capacityConstrainedItems.filter((item) => {
    const entry = item.tInputQueueEntry
    const exit = item.tInputQueueExit
    if (entry === undefined || exit === undefined) return false
    return timeMs >= entry && timeMs < exit
  })
  itemsInInputQueue.sort((a, b) => {
    const ea = a.tInputAdmission ?? a.tInputQueueEntry ?? 0
    const eb = b.tInputAdmission ?? b.tInputQueueEntry ?? 0
    return ea - eb
  })
  const inputQueueMap = new Map()
  itemsInInputQueue.forEach((item, index) => inputQueueMap.set(item.id, index))
  const isInputOverloaded = itemsInInputQueue.length >= (mergedConfig.maxInputQueueCapacity ?? 6)


  // --- Human Availability Logic (RENDER-TIME DECISION) ---
  // For stepBackAfterItems scenarios, human availability is determined NOW based on
  // current queue state, not pre-scheduled. This makes decisions "in the moment".
  //
  // Rules:
  // 1. Human processes items when present
  // 2. Human steps away when queue becomes empty (after processing N items)
  // 3. Items pile up while human is away (NOT processed)
  // 4. Human returns when queue becomes overloaded (>5 items)

  let isHumanAway = false
  let humanQueueMap = new Map()
  let itemsInHumanQueue = []
  let processedItemExitTimes = new Map() // For dynamic mode: item.id -> time when processing completed
  let supervisedCompletionTimes = new Map() // For dynamic mode: item.id -> time when supervision completed

  const stepBackAfterItems = mergedConfig.stepBackAfterItems

  if (stepBackAfterItems !== undefined) {
    // DYNAMIC MODE: Simulate human availability by replaying events up to current time
    // This is the "in the moment" decision model - we walk through time and make
    // decisions based on what we see at each moment.

    // For supervised scenarios with stepBackAfterItems, track supervised item completions
    const supervisedItems = capacityConstrainedItems.filter(item => item.flowType === 'supervised')
      .sort((a, b) => {
        const aSupervisionStep = a.steps.find(s => s.type === 'supervision')
        const bSupervisionStep = b.steps.find(s => s.type === 'supervision')
        return (aSupervisionStep?.startTime ?? 0) - (bSupervisionStep?.startTime ?? 0)
      })

    // State machine for supervised items: track human availability
    // Build a timeline of when human is present/away AND track completion times
    let humanPresent = true
    let sessionProcessedCount = 0
    let humanBusyUntil = 0
    const absencePeriods = [] // Array of {start, end} when human is away

    // First pass: determine absence periods and completion times by processing items in order
    for (const item of supervisedItems) {
      const supervisionStep = item.steps.find(s => s.type === 'supervision')
      if (!supervisionStep) continue

      const supervisionStart = supervisionStep.startTime
      const supervisionDuration = supervisionStep.duration

      // Can only start processing when human is free and item has arrived
      let processingStart = Math.max(supervisionStart, humanBusyUntil)

      // If human is currently away, skip to when they return
      for (const absence of absencePeriods) {
        if (processingStart >= absence.start && processingStart < absence.end) {
          processingStart = absence.end
        }
      }

      // Complete processing
      const processingEnd = processingStart + supervisionDuration
      humanBusyUntil = processingEnd
      sessionProcessedCount++

      // Record when this item's processing starts AND completes
      supervisedCompletionTimes.set(item.id, {
        processingStart: processingStart,
        completionTime: processingEnd
      })

      // After completing this item, check if human should step away
      if (sessionProcessedCount >= stepBackAfterItems) {
        // Human pauses for 1 second, then steps away for 3 seconds, then takes 1 second to return
        const pauseDuration = 1000
        const absenceDuration = 3000
        const returnTransitionDuration = 1000  // Time for human to visually return to position
        absencePeriods.push({
          start: processingEnd + pauseDuration,
          end: processingEnd + pauseDuration + absenceDuration
        })
        sessionProcessedCount = 0
        // Human is busy until they fully return (absence + return transition)
        humanBusyUntil = processingEnd + pauseDuration + absenceDuration + returnTransitionDuration
      }
    }

    // Second pass: determine current human state at timeMs
    humanPresent = true
    for (const absence of absencePeriods) {
      if (timeMs >= absence.start && timeMs < absence.end) {
        humanPresent = false
        break
      }
    }

    // For manual items, run a separate state machine if there are any
    const manualItems = capacityConstrainedItems.filter(item =>
      item.flowType === 'manual' && item.tQueueEntry !== undefined
    ).sort((a, b) => (a.tQueueEntry ?? 0) - (b.tQueueEntry ?? 0))

    const processed = new Map() // item.id -> exitTime (for manual items)

    // If there are manual items, process them with the manual queue state machine
    if (manualItems.length > 0) {
      // Reset state machine for manual items
      let manualHumanPresent = true
      let manualSessionProcessedCount = 0
      let manualLastSessionStart = -Infinity
      let manualHumanBusyUntil = 0
      let manualCurrentlyProcessingItem = null
      const manualWaitingQueue = []

      // Process manual item arrivals in order
      for (const item of manualItems) {
        const arrivalTime = item.tQueueEntry
        if (!arrivalTime || arrivalTime > timeMs) break

        // Before processing this arrival, check if any items completed
        while (manualHumanBusyUntil <= arrivalTime && manualHumanBusyUntil <= timeMs) {
          if (manualCurrentlyProcessingItem) {
            processed.set(manualCurrentlyProcessingItem.id, manualHumanBusyUntil)
            if (manualHumanBusyUntil >= manualLastSessionStart) {
              manualSessionProcessedCount++
            }
            manualCurrentlyProcessingItem = null

            if (manualSessionProcessedCount >= stepBackAfterItems && manualWaitingQueue.length === 0) {
              manualHumanPresent = false
              manualSessionProcessedCount = 0
            }
          }

          if (manualHumanPresent && manualWaitingQueue.length > 0 && !manualCurrentlyProcessingItem) {
            manualCurrentlyProcessingItem = manualWaitingQueue.shift()
            manualHumanBusyUntil = manualHumanBusyUntil + mergedConfig.queueTime
          } else {
            break
          }
        }

        manualWaitingQueue.push(item)

        if (!manualHumanPresent && manualWaitingQueue.length > 5) {
          manualHumanPresent = true
          manualSessionProcessedCount = 0
          manualLastSessionStart = arrivalTime
          manualHumanBusyUntil = arrivalTime
        }

        if (manualHumanPresent && !manualCurrentlyProcessingItem && manualWaitingQueue.length > 0) {
          manualCurrentlyProcessingItem = manualWaitingQueue.shift()
          const startTime = Math.max(arrivalTime, manualHumanBusyUntil)
          manualHumanBusyUntil = startTime + mergedConfig.queueTime
        }
      }

      // After all arrivals, continue processing until current time
      while (manualHumanBusyUntil <= timeMs) {
        if (manualCurrentlyProcessingItem) {
          processed.set(manualCurrentlyProcessingItem.id, manualHumanBusyUntil)
          if (manualHumanBusyUntil >= manualLastSessionStart) {
            manualSessionProcessedCount++
          }
          manualCurrentlyProcessingItem = null

          if (manualSessionProcessedCount >= stepBackAfterItems && manualWaitingQueue.length === 0) {
            manualHumanPresent = false
            manualSessionProcessedCount = 0
          }
        }

        if (manualHumanPresent && manualWaitingQueue.length > 0 && !manualCurrentlyProcessingItem) {
          manualCurrentlyProcessingItem = manualWaitingQueue.shift()
          manualHumanBusyUntil = manualHumanBusyUntil + mergedConfig.queueTime
        } else {
          break
        }
      }

      // Use manual human presence state
      humanPresent = manualHumanPresent
    }

    // Final check: is human present right now?
    isHumanAway = !humanPresent

    // Now build the current queue visualization
    // Items in queue are those that have arrived and haven't STARTED their exit animation
    // This keeps items visible in the queue until their exit animation begins,
    // preventing the timing gap where items would vanish
    itemsInHumanQueue = manualItems.filter(item => {
      if (item.tQueueEntry > timeMs) return false // hasn't arrived yet
      const exitTime = processed.get(item.id)
      if (exitTime !== undefined && timeMs >= exitTime) return false // exit animation started
      return true // in queue (either not processed, or processed but exit not started)
    })
    itemsInHumanQueue.sort((a, b) => a.tQueueEntry - b.tQueueEntry)
    itemsInHumanQueue.forEach((item, index) => humanQueueMap.set(item.id, index))

    // Expose processed exit times for render logic
    processedItemExitTimes = processed

  } else {
    // NON-DYNAMIC MODE: Use pre-scheduled queue times
    itemsInHumanQueue = capacityConstrainedItems.filter(item =>
      item.tQueueEntry !== undefined &&
      timeMs >= item.tQueueEntry &&
      timeMs < item.tQueueExit
    )
    itemsInHumanQueue.sort((a, b) => a.tQueueEntry - b.tQueueEntry)
    itemsInHumanQueue.forEach((item, index) => humanQueueMap.set(item.id, index))

    // Fixed outage window mode
    const finalOutageStart = effectiveOutageStart ?? mergedConfig.outageStart
    if (finalOutageStart !== undefined && finalOutageStart !== null) {
      const start = finalOutageStart
      const end = start + (mergedConfig.outageDuration ?? 0)
      // Handle wrapping in visual
      if (end <= CYCLE_DURATION) {
         if (cycleTime >= start && cycleTime < end) isHumanAway = true
      } else {
         const wrappedEnd = end % CYCLE_DURATION
         if (cycleTime >= start || cycleTime < wrappedEnd) isHumanAway = true
      }
    }
  }

  const isHumanOverloaded = itemsInHumanQueue.length > 5
  
  const renderItems = capacityConstrainedItems.map(item => {
    const processedExitTime = processedItemExitTimes.get(item.id)

    // For dynamic mode: items have complex lifecycle that doesn't match pre-scheduled endTime
    if (stepBackAfterItems !== undefined && item.flowType === 'manual') {
      // Manual items in dynamic mode:
      // - If processed: show exit animation (or filter out if animation done)
      // - If arrived but not processed: show in queue
      // - If not yet at queue: render normally
      if (processedExitTime !== undefined) {
        // Item was processed - check if exit animation is still playing
        const exitDuration = EXIT_DURATION + TRAVEL_DURATION
        if (timeMs > processedExitTime + exitDuration) return null
      } else if (item.tQueueEntry !== undefined) {
        // Item should be in queue or traveling to queue
        // Filter out items that arrived too long ago - they should have been processed
        // (This catches items from old cycles that the state machine missed)
        const maxQueueAge = CYCLE_DURATION * 2 // Max time an item can sit in queue
        if (timeMs > item.tQueueEntry + maxQueueAge) return null
      }
    } else if (stepBackAfterItems !== undefined && item.flowType === 'supervised') {
      // Supervised items in dynamic mode:
      // - If completed: check if all post-supervision animations are done
      // - If in supervision: show at 3 o'clock (frozen if human away)
      const timingInfo = supervisedCompletionTimes.get(item.id)
      const completionTime = timingInfo?.completionTime
      const supervisionIndex = item.steps.findIndex(s => s.type === 'supervision')

      if (completionTime !== undefined && supervisionIndex >= 0) {
        // Calculate total duration of all steps after supervision (orbit + exit_final)
        const stepsAfterSupervision = item.steps.slice(supervisionIndex + 1)
        const totalPostSupervisionDuration = stepsAfterSupervision.reduce((sum, s) => sum + s.duration, 0)

        if (timeMs > completionTime + totalPostSupervisionDuration) {
          return null // All animations done
        }
      } else if (item.steps.find(s => s.type === 'supervision')) {
        // Item hasn't completed yet - keep showing it (don't time out)
        // This prevents items from vanishing while waiting for human
      }
    } else {
      // Non-dynamic mode or other items: use normal endTime check
      if (timeMs > item.endTime) return null
    }
    if (timeMs < item.steps[0].startTime) return null

    let activeStep = item.steps.find(s => timeMs >= s.startTime && timeMs < s.endTime)

    // For dynamic mode: handle manual items based on arrival/processed state
    // This is authoritative - don't rely solely on humanQueueMap
    if (stepBackAfterItems !== undefined && item.flowType === 'manual') {
      if (processedExitTime !== undefined) {
        // Item was processed
        if (timeMs >= processedExitTime) {
          // Exit animation has started - show exit animation
          const exitStep = item.steps.find(s => s.type === 'exit')
          const returnStep = item.steps.find(s => s.type === 'return')
          const animStep = item.isReturned ? returnStep : exitStep
          if (animStep) {
            activeStep = {
              ...animStep,
              startTime: processedExitTime,
              endTime: processedExitTime + animStep.duration,
            }
          }
        } else {
          // Exit animation hasn't started yet - keep showing in queue position
          // This handles the gap between when state machine marks item as processed
          // and when the exit animation actually begins
          const queueStep = item.steps.find(s => s.type === 'queue')
          if (queueStep) {
            activeStep = { ...queueStep, type: 'queue' }
          }
        }
      } else if (item.tQueueEntry !== undefined && timeMs >= item.tQueueEntry) {
        // Item has arrived at human queue but not processed yet
        // ALWAYS force to queue position - the pre-scheduled steps assume continuous
        // human availability, but in dynamic mode the item may wait much longer
        const queueStep = item.steps.find(s => s.type === 'queue')
        if (queueStep) {
          activeStep = { ...queueStep, type: 'queue' }
        }
      }
    }

    // For dynamic mode: handle supervised items based on actual completion times
    if (stepBackAfterItems !== undefined && item.flowType === 'supervised') {
      const supervisionStep = item.steps.find(s => s.type === 'supervision')
      if (supervisionStep) {
        const timingInfo = supervisedCompletionTimes.get(item.id)
        const completionTime = timingInfo?.completionTime

        // If item hasn't started supervision yet, render normally
        if (timeMs < supervisionStep.startTime) {
          // Use normal rendering
        } else if (completionTime === undefined || timeMs < completionTime) {
          // Item is waiting for human OR being processed - stay at 3 o'clock
          // Force to supervision position (progress = 0, which is 3 o'clock)
          activeStep = {
            ...supervisionStep,
            startTime: timeMs,  // Force progress to 0
            endTime: timeMs + 1000,  // Arbitrary duration, progress will be 0
          }
        } else {
          // Item has completed supervision - now animate the remaining steps
          // Steps after supervision: orbit (3 o'clock → 12 o'clock), then exit_final
          const supervisionIndex = item.steps.findIndex(s => s.type === 'supervision')
          const stepsAfterSupervision = item.steps.slice(supervisionIndex + 1)

          // Calculate cumulative timing for steps after supervision
          let stepStartTime = completionTime
          for (const step of stepsAfterSupervision) {
            const stepEndTime = stepStartTime + step.duration
            if (timeMs >= stepStartTime && timeMs < stepEndTime) {
              activeStep = {
                ...step,
                startTime: stepStartTime,
                endTime: stepEndTime,
              }
              break
            }
            stepStartTime = stepEndTime
          }
        }
      }
    }

    if (!activeStep) return null

    const effectiveStep = activeStep
    const effectiveP = Math.min(1, Math.max(0, (timeMs - activeStep.startTime) / activeStep.duration))

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
             transitionStyle = "cy 0.15s ease-out, opacity 0.2s"
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
      viewBox="0 70 460 220"
    >
      <defs>
        <marker id="hitlArrow" viewBox="0 -5 10 10" refX={8} refY={0} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,-4L10,0L0,4" fill="currentColor" />
        </marker>
      </defs>

      {/* Monkey image - behind everything in the agent loop */}
      {showMonkey && (
        <image
          href="/og/monkey.png"
          x={agentCenter.x - 34}
          y={agentCenter.y - 34}
          width={68}
          height={68}
          opacity={1}
          style={{ 
            transition: "opacity 0.5s ease-in-out",
            filter: theme === "dark" ? "invert(1)" : "none"
          }}
        />
      )}

      <circle cx={agentCenter.x} cy={agentCenter.y} r={agentRadius} fill="none" stroke={t.primary} strokeWidth={2} opacity={0.3} />
      
      {/* Input Queue */}
      <QueueVisual x={inputQueueX} yTop={queueTopY} yBottom={queueBottomY} isOverloaded={isInputOverloaded} t={t} />

      {/* Human Queue - HIDDEN IN AUTONOMOUS MODE OR CLOSELY SUPERVISED */}
      {!isAutonomous && !isCloselySupervised && (
          <QueueVisual x={humanQueueX} yTop={queueTopY} yBottom={queueBottomY} isOverloaded={isHumanOverloaded} t={t} />
      )}

      {/* Path: Input -> Agent */}
      <path d={`M ${vInputToAgentStart.x},${vInputToAgentStart.y} Q ${cInputToAgent.x},${cInputToAgent.y} ${vInputToAgentEnd.x},${vInputToAgentEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s", color: t.primary }} opacity={showInputPath ? 0.2 : 0} />

      {/* Path: Agent -> Human Queue */}
      {!isAutonomous && (
        <path d={`M ${vToQueueStart.x},${vToQueueStart.y} Q ${cToHumanQueue.x},${cToHumanQueue.y} ${vToQueueEnd.x},${vToQueueEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s", color: t.primary }} opacity={showToPath ? 0.2 : 0} />
      )}

      {/* Path: Human Queue -> Agent */}
      {!isAutonomous && (
        <path d={`M ${vFromQueueStart.x},${vFromQueueStart.y} Q ${cFromHumanQueue.x},${cFromHumanQueue.y} ${vFromQueueEnd.x},${vFromQueueEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s", color: t.primary }} opacity={showFromPath ? 0.2 : 0} />
      )}

      {/* Path: Agent -> Exit (Over Human Queue) */}
      <path d={`M ${vAgentExitStart.x},${vAgentExitStart.y} Q ${cAgentExit.x},${cAgentExit.y} ${vAgentExitEnd.x},${vAgentExitEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s", color: t.primary }} opacity={showAgentExitPath ? 0.2 : 0} />

      {/* Path: Human -> Exit */}
      {!isAutonomous && (
        <path d={`M ${vHumanExitStart.x},${vHumanExitStart.y} Q ${cHumanExit.x},${cHumanExit.y} ${vHumanExitEnd.x},${vHumanExitEnd.y}`} fill="none" stroke={t.primary} strokeWidth={2} strokeDasharray="4 4" markerEnd="url(#hitlArrow)" style={{ transition: "opacity 0.3s", color: t.primary }} opacity={showHumanExitPath ? 0.2 : 0} />
      )}

      {/* Brain icon - fades out when monkey is shown */}
      <g
        transform={`translate(${agentCenter.x - 32}, ${agentCenter.y - 32})`}
        opacity={showMonkey ? 0 : 1}
        style={{ transition: "opacity 0.5s ease-in-out" }}
      >
        <Brain size={64} color={t.primary} strokeWidth={1.5} />
      </g>
      
      {/* Human Icon with 'Steps Back' Animation */}
      {!isAutonomous && (
          <>
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
            <text
              x={targetHumanX}
              y={256}
              textAnchor="middle"
              fontSize="11"
              fill={t.inkSecondary}
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="-0.5"
              style={{
                  transform: `translate(${isHumanAway ? 60 : 0}px, 0)`,
                  opacity: isHumanAway ? 0.3 : 1,
                  transition: "transform 1s ease-in-out, opacity 1s ease-in-out"
              }}
            >
              Human
            </text>
          </>
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

      {/* Labels */}
      <text x={inputQueueX} y={256} textAnchor="middle" fontSize="12" fill={t.inkSecondary} fontFamily="system-ui, -apple-system, sans-serif">
        Input Queue
      </text>
      <text x={agentCenter.x} y={256} textAnchor="middle" fontSize="12" fill={t.inkSecondary} fontFamily="system-ui, -apple-system, sans-serif">
        Agent
      </text>
      {!isAutonomous && !isCloselySupervised && (
        <text x={humanQueueX} y={256} textAnchor="middle" fontSize="11" fill={t.inkSecondary} fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">
          Human Queue
        </text>
      )}
    </svg>
  )
}

export default HumanInTheLoopDiagram
