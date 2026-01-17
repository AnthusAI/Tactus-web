const { spawn } = require("node:child_process")
const path = require("node:path")

const gatsbyBin = path.join(
  process.cwd(),
  "node_modules",
  ".bin",
  process.platform === "win32" ? "gatsby.cmd" : "gatsby"
)

const child = spawn(gatsbyBin, ["build"], {
  stdio: ["ignore", "pipe", "pipe"],
  env: process.env,
})

let sawDone = false
let tail = ""
let terminateTimer = null
let killTimer = null

const scheduleTerminate = () => {
  if (terminateTimer) return

  terminateTimer = setTimeout(() => {
    if (child.exitCode !== null) return
    child.kill("SIGTERM")
    killTimer = setTimeout(() => {
      if (child.exitCode !== null) return
      child.kill("SIGKILL")
    }, 4000)
    killTimer.unref?.()
  }, 1200)

  terminateTimer.unref?.()
}

const onOutput = (chunk) => {
  const text = chunk.toString()
  process.stdout.write(text)

  tail = (tail + text).slice(-20000)
  if (!sawDone && /Done building in/i.test(tail)) {
    sawDone = true
    scheduleTerminate()
  }
}

const onErrorOutput = (chunk) => {
  const text = chunk.toString()
  process.stderr.write(text)
  tail = (tail + text).slice(-20000)
}

child.stdout.on("data", onOutput)
child.stderr.on("data", onErrorOutput)

child.on("error", (err) => {
  process.stderr.write(String(err) + "\n")
  process.exit(1)
})

child.on("exit", (code, signal) => {
  if (terminateTimer) clearTimeout(terminateTimer)
  if (killTimer) clearTimeout(killTimer)

  if (signal) {
    process.exit(sawDone ? 0 : 1)
  }
  process.exit(code === null ? 1 : code)
})

