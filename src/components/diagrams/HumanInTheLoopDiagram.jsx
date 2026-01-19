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
const TRAVEL_DURATION = 1000
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
    } = config

    const rng = mulberry32(seed)
    const items = []
    const interval = CYCLE_DURATION / itemCount

    // Pre-calculate outage start if stepBackAfterItems is set
    let computedOutageStart = outageStart
    if (stepBackAfterItems !== undefined) {
        let tempRng = mulberry32(seed)
        let tempManualCount = 0
        for (let i = 0; i < itemCount; i++) {
            const start = i * interval + (tempRng() * spawnJitterMs)
            const rollAuto = tempRng()
            const isAuto = rollAuto < autoProcessRate
            tempRng() // consume orbit RNG
            if (!isAuto || supervisionMean) {
                tempManualCount++
                if (tempManualCount === stepBackAfterItems) {
                    computedOutageStart = start + 5000 // Approximate
                    break
                }
                tempRng() // consume return RNG
            }
        }
    }

    for (let i = 0; i < itemCount; i++) {
        const start = i * interval + (rng() * spawnJitterMs)
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
const scheduleItems = (rawItems, config) => {
    const {
        maxInputQueueCapacity = 6,
        maxInFlight = 100,
        inputIntervalMs,
        agentProcessingTime = 500,
        queueTime = 1500,
        outageStart = null,
        outageDuration = 0,
    } = config

    // Default input interval based on item count if not specified
    const interval = inputIntervalMs ?? Math.max(50, CYCLE_DURATION / Math.max(1, rawItems.length))

    // Sort by natural spawn time
    const sorted = [...rawItems].sort((a, b) => a.spawnTime - b.spawnTime)

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
            loopFreeAt = loopEntryTime + loopDuration
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
            if (step.type === 'queue' && raw.flowType === 'manual') {
                const humanArrival = currentTime
                let effectiveStart = Math.max(humanArrival, humanFreeAt)

                // Check outage
                if (outageStart !== null) {
                    const outageEnd = outageStart + outageDuration
                    if (effectiveStart >= outageStart && effectiveStart < outageEnd) {
                        effectiveStart = outageEnd
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

    return scheduled
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
          // Keep a steady inflow so the input throttle behaves like a real "switch"
          // (when not overloaded, items continue arriving).
          // Use a smooth (non-bursty) cadence so the queue never drains to zero
          // while the throttle is open.
          itemCount: 50,
          spawnJitterMs: 0,
          inputIntervalMs: 350,
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
  }, [scenario, config.itemCount, config.autoProcessRate, config.returnToAgentRate, config.queueTime, config.agentProcessingTime, config.minOrbitTime, config.seed, config.outageStart, config.outageDuration, config.stepBackAfterItems, config.maxInFlight, config.supervisionMean, config.supervisionStdDev])

  const cycleIndex = Math.floor(timeMs / CYCLE_DURATION)
  const cycleTime = timeMs % CYCLE_DURATION

  // Build all active items using the unified scheduler
  // This generates items across multiple cycles and schedules them all together,
  // ensuring consistent timing decisions across cycle boundaries.
  const capacityConstrainedItems = React.useMemo(() => {
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
    return scheduleItems(allRawItems, {
      ...mergedConfig,
      outageStart: effectiveOutageStart,
    })
  }, [rawItems, cycleIndex, mergedConfig, effectiveOutageStart])

  // --- Queue Slot Logic (Human) ---
  const itemsInHumanQueue = capacityConstrainedItems.filter(item => 
      item.tQueueEntry !== undefined && 
      timeMs >= item.tQueueEntry && 
      timeMs < item.tQueueExit
  )
  itemsInHumanQueue.sort((a, b) => a.tQueueEntry - b.tQueueEntry)
  const humanQueueMap = new Map()
  itemsInHumanQueue.forEach((item, index) => humanQueueMap.set(item.id, index))
  const isHumanOverloaded = itemsInHumanQueue.length > 5

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
  
  const renderItems = capacityConstrainedItems.map(item => {
    if (timeMs > item.endTime) return null
    if (timeMs < item.steps[0].startTime) return null

    const activeStep = item.steps.find(s => timeMs >= s.startTime && timeMs < s.endTime)
    if (!activeStep) return null
    
    const effectiveStep = activeStep
    const effectiveP = (timeMs - activeStep.startTime) / activeStep.duration
    
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
