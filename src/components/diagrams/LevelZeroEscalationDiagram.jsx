import * as React from "react"

import { diagramTokens, getDiagramThemeVars } from "./diagramTheme"

const ArrowUp = ({ color = diagramTokens.primary }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    aria-hidden="true"
    focusable="false"
    style={{ display: "block" }}
  >
    <path d="M14 24V6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path
      d="M8.5 11.5L14 6l5.5 5.5"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const LevelCard = ({ level, title, subtitle }) => {
  const t = diagramTokens

  return (
    <div
      style={{
        background: t.surface2,
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: t.cardTitle,
          padding: "var(--space-2) var(--space-3)",
        }}
      >
        <div
          style={{
            fontFamily: t.fontSans,
            fontWeight: 900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: 12,
            color: t.muted,
          }}
        >
          Level {level}
        </div>
      </div>
      <div style={{ padding: "var(--space-3)" }}>
        <div
          style={{
            fontFamily: t.fontSerif,
            fontWeight: 800,
            fontSize: 18,
            color: t.ink,
            marginBottom: "var(--space-1)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: t.fontSans,
            fontSize: 14,
            lineHeight: 1.5,
            color: t.muted,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  )
}

const LevelZeroEscalationDiagram = ({ theme = "light", style, className }) => {
  const t = diagramTokens

  const levels = [
    {
      level: 4,
      title: "Level 4 / Vendor / Platform (human)",
      subtitle:
        "Escalate to upstream owners when the root cause lies outside your organization.",
    },
    {
      level: 3,
      title: "Level 3 Engineer (human)",
      subtitle:
        "Fix underlying defects, deploy changes, and coordinate cross-team resolution.",
    },
    {
      level: 2,
      title: "Level 2 Specialist (human)",
      subtitle:
        "Deeper diagnosis and remediation with more system context and access.",
    },
    {
      level: 1,
      title: "Level 1 Operator (human)",
      subtitle:
        "Triage, acknowledge, coordinate communications, and execute the first runbook steps.",
    },
    {
      level: 0,
      title: "Level Zero Operator (agent)",
      subtitle:
        "Investigate immediately, summarize, propose safe next steps, and enforce SOPs before escalation.",
    },
  ]

  return (
    <div
      className={className}
      style={{
        ...getDiagramThemeVars(theme),
        width: "100%",
        maxWidth: 920,
        margin: "var(--space-4) auto",
        padding: "var(--space-4)",
        background: t.surface,
        borderRadius: "var(--border-radius)",
        ...style,
      }}
      role="img"
      aria-label="A vertical set of cards labeled Level 0 through Level 4 showing how incidents escalate through operator levels."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "var(--space-2)",
        }}
      >
        {levels.map((item, idx) => (
          <React.Fragment key={item.level}>
            <LevelCard
              level={item.level}
              title={item.title}
              subtitle={item.subtitle}
            />
            {idx < levels.length - 1 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "var(--space-1) 0",
                }}
              >
                <ArrowUp />
              </div>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      <div
        style={{
          marginTop: "var(--space-4)",
          background: t.surface2,
          borderRadius: "var(--border-radius)",
          padding: "var(--space-3)",
          fontFamily: t.fontSans,
          color: t.muted,
          lineHeight: 1.5,
          fontSize: 14,
        }}
      >
        Escalate only when the incident record is complete: impact + timeline,
        evidence links, runbook steps attempted, and approvals recorded for
        disruptive actions.
      </div>
    </div>
  )
}

export default LevelZeroEscalationDiagram
