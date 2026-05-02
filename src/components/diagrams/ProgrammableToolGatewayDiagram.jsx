import * as React from "react"
import {
  Boxes,
  Braces,
  Cpu,
  FileJson,
  MessageSquare,
  Package,
  Server,
} from "lucide-react"
import { getDiagramThemeVars } from "./diagramTheme"
import * as styles from "./ProgrammableToolGatewayDiagram.module.css"

const toolNames = [
  "customers.get",
  "customers.search",
  "orders.list",
  "orders.create",
  "invoices.get",
  "invoices.refund",
  "tickets.search",
  "tickets.reply",
  "docs.search",
  "files.upload",
  "reports.run",
  "users.invite",
  "permissions.set",
  "notifications.send",
  "workflows.start",
  "jobs.status",
  "records.update",
  "comments.add",
  "metrics.query",
  "audit.list",
]

const Layer = ({ icon: Icon, eyebrow, title, children, tone = "surface" }) => (
  <div className={`${styles.layer} ${styles[tone]}`}>
    <div className={styles.layerHeader}>
      <Icon className={styles.icon} aria-hidden="true" />
      <div>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <p className={styles.layerTitle}>{title}</p>
      </div>
    </div>
    {children ? <div className={styles.layerBody}>{children}</div> : null}
  </div>
)

const Connector = () => (
  <div className={styles.connector} aria-hidden="true">
    <span className={styles.connectorIcon}>v</span>
  </div>
)

const ProgrammableToolGatewayDiagram = ({
  theme,
  style,
  className,
}) => {
  const rootClassName = [styles.diagram, className].filter(Boolean).join(" ")
  const themeVars = theme ? getDiagramThemeVars(theme) : {}

  return (
    <div
      className={rootClassName}
      style={{ ...themeVars, ...style }}
      role="img"
      aria-label="Before and after architecture diagram comparing a large MCP tool catalog with one programmable Tactus gateway backed by a host module."
    >
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <p className={styles.panelEyebrow}>Old pattern</p>
          <h3 className={styles.panelTitle}>Many tool schemas</h3>
        </div>

        <div className={styles.stack}>
          <Layer icon={MessageSquare} eyebrow="Agent layer" title="MCP client" />
          <Connector />
          <Layer icon={Boxes} eyebrow="Interface layer" title="Large MCP tool catalog" tone="muted">
            <div className={styles.toolGrid} aria-label="Twenty separate MCP tools">
              {toolNames.map((name, index) => (
                <span key={`${name}-${index}`} className={styles.toolChip}>
                  {name}
                </span>
              ))}
            </div>
          </Layer>
          <Connector />
          <Layer icon={Server} eyebrow="Application layer" title="App SDKs and services" />
        </div>
      </div>

      <div className={`${styles.panel} ${styles.afterPanel}`}>
        <div className={styles.panelHeader}>
          <p className={styles.panelEyebrow}>New pattern</p>
          <h3 className={styles.panelTitle}>One programmable stack</h3>
        </div>

        <div className={styles.stack}>
          <Layer icon={MessageSquare} eyebrow="Agent layer" title="MCP client" />
          <Connector />
          <Layer
            icon={Boxes}
            eyebrow="Interface layer"
            title="Single MCP tool"
            tone="muted"
          >
            <div className={styles.singleTool} aria-label="One MCP tool">
              <span className={styles.toolChip}>execute_tactus</span>
            </div>
          </Layer>
          <Connector />
          <Layer icon={Braces} eyebrow="Runtime layer" title="Tactus runtime" tone="muted">
            <div className={styles.runtimeGrid}>
              <div className={styles.codeTile}>
                <FileJson className={styles.smallIcon} aria-hidden="true" />
                <span>task code</span>
              </div>
              <div className={styles.codeTile}>
                <Cpu className={styles.smallIcon} aria-hidden="true" />
                <span>optional Agent</span>
              </div>
            </div>
          </Layer>
          <Connector />
          <Layer
            icon={Package}
            eyebrow="API layer"
            title="Host application module"
            tone="surface"
          />
          <Connector />
          <Layer icon={Server} eyebrow="Application layer" title="SDKs, services, docs, data" />
        </div>
      </div>
    </div>
  )
}

export default ProgrammableToolGatewayDiagram
