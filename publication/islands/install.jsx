import * as React from "react"

const INSTALL_COMMAND = "pip install tactus"

export const InstallCommand = () => {
  const [copied, setCopied] = React.useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error("Clipboard unavailable", error)
    }
  }
  return (
    <div
      role="group"
      aria-label="Install Tactus"
      style={{ display: "inline-flex", gap: "0.75rem", alignItems: "center", padding: "0.5rem 0.75rem", border: "1px solid var(--color-surface-2)", borderRadius: "999px", fontFamily: "monospace" }}
    >
      <span aria-hidden="true">$</span>
      <code>{INSTALL_COMMAND}</code>
      <button type="button" onClick={copy} aria-label={copied ? "Copied" : "Copy install command"} style={{ cursor: "pointer", border: 0, background: "none", color: "var(--color-primary)", font: "inherit" }}>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}
