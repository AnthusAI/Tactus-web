import * as React from "react"

const MissingDependencyNotice = ({ title, children }) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: 16,
        background: "rgba(0,0,0,0.06)",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{title}</div>
      <div style={{ fontSize: 14, lineHeight: 1.4 }}>
        {children || (
          <>
            This demo requires <code>@anthus/tactus-hitl-components</code>, which
            is not installed in this build environment.
          </>
        )}
      </div>
    </div>
  )
}

export const ThemeProvider = ({ children }) => <>{children}</>

export const ApprovalPanel = () => (
  <MissingDependencyNotice title="ApprovalPanel (shim)" />
)

export const EscalationAlert = () => (
  <MissingDependencyNotice title="EscalationAlert (shim)" />
)

export const TextInput = () => (
  <MissingDependencyNotice title="TextInput (shim)" />
)

export const SelectSingle = () => (
  <MissingDependencyNotice title="SelectSingle (shim)" />
)

export const SelectMultiple = () => (
  <MissingDependencyNotice title="SelectMultiple (shim)" />
)

export const ReviewPanel = () => (
  <MissingDependencyNotice title="ReviewPanel (shim)" />
)

export const FileUpload = () => (
  <MissingDependencyNotice title="FileUpload (shim)" />
)

export const HITLInputsPanel = () => (
  <MissingDependencyNotice title="HITLInputsPanel (shim)" />
)

