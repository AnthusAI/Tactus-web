import * as React from "react"
import {
  ApprovalPanel,
  EscalationAlert,
  FileUpload,
  HITLInputsPanel,
  ReviewPanel,
  SelectMultiple,
  SelectSingle,
  TextInput,
  ThemeProvider,
} from "@anthus/tactus-hitl-components"

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "../../src/components/ai-elements/chain-of-thought"
import { Conversation, ConversationContent } from "../../src/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "../../src/components/ai-elements/message"
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "../../src/components/ai-elements/tool"
import * as styles from "./hitl.module.css"

const noop = () => {}

const requestFields = (prefix, procedureName, subject, elapsedSeconds, inputSummary) => ({
  request_id: `req_${prefix}`,
  procedure_id: procedureName.toLowerCase().replace(/ /g, "-"),
  procedure_name: procedureName,
  invocation_id: `inv_${prefix}`,
  subject,
  elapsed_seconds: elapsedSeconds,
  input_summary: inputSummary,
})

const componentsBase = {
  request_id: "req_123",
  procedure_id: "customer-intake",
  procedure_name: "Customer Intake",
  invocation_id: "inv_456",
  subject: "John Doe",
  elapsed_seconds: 120,
  input_summary: { customer_name: "John Doe", request_type: "Support" },
}

const projectsBase = {
  request_id: "req_projects_01",
  procedure_id: "copilot-project",
  procedure_name: "Copilot Project",
  invocation_id: "inv_projects_01",
  subject: "Copilot Project",
  elapsed_seconds: 0,
  input_summary: { app: "Your product" },
}

const gettingStartedBase = {
  request_id: "req_getting_started_01",
  procedure_id: "getting-started",
  procedure_name: "Getting Started",
  invocation_id: "inv_getting_started_01",
  subject: "Getting Started",
  elapsed_seconds: 0,
  input_summary: { surface: "IDE" },
}

const opsCopilotBase = {
  request_id: "req_901",
  procedure_id: "ops-copilot",
  procedure_name: "Ops Copilot",
  invocation_id: "inv_4b12",
  subject: "Production",
  elapsed_seconds: 87,
  input_summary: { channel: "in-app-chat", user: "Alex" },
}

const acmeBase = requestFields("2471", "Acme Copilot", "Acme Copilot", 42, { channel: "in-app-chat", user: "Sam" })
acmeBase.request_id = "req_2471"
acmeBase.procedure_id = "acme-copilot"
acmeBase.invocation_id = "inv_92a1"

const approvalRequest = (base, message, options, artifactType, artifact) => ({
  ...base,
  request_type: "approval",
  message,
  options,
  metadata: { artifact_type: artifactType, artifact },
})

const projectInputs = {
  ...projectsBase,
  request_type: "inputs",
  message: "Fill in the last details (Tool: create_task)",
  items: [
    {
      item_id: "title",
      label: "Task title",
      request_type: "input",
      message: "Give this task a short title",
      required: true,
      metadata: { placeholder: "e.g., Update help center article" },
    },
    {
      item_id: "owner",
      label: "Owner",
      request_type: "select",
      message: "Who should own this?",
      required: true,
      options: [
        { label: "Support", value: "support" },
        { label: "Engineering", value: "engineering" },
        { label: "Sales", value: "sales" },
      ],
      metadata: { mode: "single", style: "radio" },
    },
  ],
}

const PANELS = {
  "components-approval": [
    ApprovalPanel,
    {
      ...componentsBase,
      request_type: "approval",
      message: "Approve the proposed response?",
      options: [
        { label: "Approve", value: true, style: "primary" },
        { label: "Reject", value: false, style: "danger" },
      ],
    },
  ],
  "components-escalation": [
    EscalationAlert,
    {
      ...componentsBase,
      request_type: "escalation",
      message: "Manual intervention required",
      metadata: { severity: "warning", context: { reason: "Ambiguous policy exception", attempts: 2 } },
    },
  ],
  "components-text": [
    TextInput,
    {
      ...componentsBase,
      request_type: "input",
      message: "Capture a short reason for the decision",
      metadata: { placeholder: "Add a note for the audit log..." },
    },
  ],
  "components-select-single": [
    SelectSingle,
    {
      ...componentsBase,
      request_type: "select",
      message: "Choose a deployment target",
      options: [
        { label: "Development", value: "dev" },
        { label: "Staging", value: "staging" },
        { label: "Production", value: "prod", style: "danger" },
      ],
      metadata: { mode: "single", style: "radio" },
    },
  ],
  "components-select-multiple": [
    SelectMultiple,
    {
      ...componentsBase,
      request_type: "select",
      message: "Select features to enable",
      options: [
        { label: "Analytics", value: "analytics" },
        { label: "Notifications", value: "notifications" },
        { label: "Export", value: "export" },
      ],
      metadata: { mode: "multiple", min: 1, max: 2 },
    },
  ],
  "components-review": [
    ReviewPanel,
    {
      ...componentsBase,
      request_type: "review",
      message: "Review the draft response",
      options: [
        { label: "Approve", value: "approve", style: "primary" },
        { label: "Request changes", value: "changes", style: "secondary" },
        { label: "Reject", value: "reject", style: "danger" },
      ],
      metadata: {
        artifact_type: "document",
        artifact:
          "Thank you for reaching out. We can offer a partial refund and expedited shipping on your replacement item.",
      },
    },
  ],
  "components-upload": [
    FileUpload,
    {
      ...componentsBase,
      request_type: "upload",
      message: "Upload supporting documents",
      metadata: { accept: [".pdf", ".docx"], max_size: 10 * 1024 * 1024, multiple: true },
    },
  ],
  "components-inputs": [
    HITLInputsPanel,
    {
      ...componentsBase,
      request_type: "inputs",
      message: "Deployment checklist",
      items: [
        {
          item_id: "target",
          label: "Target",
          request_type: "select",
          message: "Choose target environment",
          options: [
            { label: "Dev", value: "dev" },
            { label: "Staging", value: "staging" },
            { label: "Prod", value: "prod" },
          ],
          metadata: { mode: "single", style: "radio" },
          required: true,
        },
        { item_id: "confirm", label: "Confirm", request_type: "approval", message: "Confirm the rollout window", required: true },
        {
          item_id: "notes",
          label: "Notes",
          request_type: "input",
          message: "Deployment notes (optional)",
          required: false,
          metadata: { placeholder: "Add notes...", multiline: true },
        },
      ],
    },
  ],
  "projects-approval": [
    ApprovalPanel,
    approvalRequest(
      projectsBase,
      "Approve publishing this change? (Tool: publish_release)",
      [
        { label: "Publish", value: true, style: "primary" },
        { label: "Hold", value: false, style: "secondary" },
      ],
      "release_note",
      "Release v0.1.1: Improve onboarding copy and add a new copilot use case page."
    ),
  ],
  "projects-inputs": [HITLInputsPanel, projectInputs],
  "getting-started-approval": [
    ApprovalPanel,
    approvalRequest(
      gettingStartedBase,
      "Approve sending this message? (Tool: send_message)",
      [
        { label: "Send", value: true, style: "primary" },
        { label: "Cancel", value: false, style: "secondary" },
      ],
      "chat_message",
      "I can draft the reply and prepare the tool call. You approve before I send anything."
    ),
  ],
  "hitl-review": [
    ReviewPanel,
    {
      ...opsCopilotBase,
      request_type: "review",
      message: "Review the rollout announcement before sending",
      options: [
        { label: "Send", value: "send", style: "primary" },
        { label: "Return for edits", value: "return", style: "secondary" },
      ],
      metadata: {
        artifact_type: "message",
        artifact:
          "Heads up: we will run a database migration tonight at 2:00am UTC. Expect brief write locks. We'll update when complete.",
      },
    },
  ],
}

const ChatFooter = () => (
  <div className={styles.chatFooter}>
    <div className={styles.footerHint}>
      These are the same HITL components used by the <a href="/download/">Tactus IDE</a> and documented in{" "}
      <a href="/resources/components/">Resources → Components</a>.
    </div>
  </div>
)

const OpsChat = () => (
  <div className={styles.chatShell} aria-label="HITL chat demo">
    <div className={styles.chatHeader}>
      <div className={styles.chatTitle}>Ops Copilot</div>
      <div className={styles.chatMeta}>Agent runs until it hits a checkpoint.</div>
    </div>
    <Conversation>
      <ConversationContent className={styles.chatLog} scrollClassName={styles.chatScroll}>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse from="assistant">
              Tell me what you want to do. I'll propose an action and ask for approval before any side effects.
            </MessageResponse>
          </MessageContent>
        </Message>
        <Message from="user">
          <MessageContent>
            <MessageResponse from="user">Schedule the database migration for tonight.</MessageResponse>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse from="assistant">
              I'm ready to schedule it. Please confirm the window before I proceed.
            </MessageResponse>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent className={styles.fullWidthMessage}>
            <ApprovalPanel
              request={{
                ...opsCopilotBase,
                request_type: "approval",
                message: "Schedule the migration window? (Tool: schedule_migration)",
                options: [
                  { label: "Approve", value: true, style: "primary" },
                  { label: "Cancel", value: false, style: "secondary" },
                ],
                metadata: {
                  artifact_type: "plan",
                  artifact:
                    "Schedule: 2:00–2:30am UTC. Notify on-call, lock writes, run migration, verify, unlock writes.",
                },
              }}
              onRespond={noop}
              showContext={false}
            />
          </MessageContent>
        </Message>
      </ConversationContent>
    </Conversation>
    <ChatFooter />
  </div>
)

const CopilotChat = () => (
  <div className={styles.chatShell} aria-label="Copilot chat demo">
    <div className={styles.chatHeader}>
      <div className={styles.chatTitle}>Acme Copilot</div>
      <div className={styles.chatMeta}>Chat UI + Tactus runtime + HITL components</div>
    </div>
    <Conversation>
      <ConversationContent className={styles.chatLog} scrollClassName={styles.chatScroll}>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse from="assistant">
              I can help you draft responses, look up context via tools, and propose actions. You stay in control of
              side effects.
            </MessageResponse>
          </MessageContent>
        </Message>
        <Message from="user">
          <MessageContent>
            <MessageResponse from="user">Draft a short reply to the customer and send it.</MessageResponse>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <MessageResponse from="assistant">
              Here’s a draft. Before I send anything, I’ll ask for an explicit approval.
            </MessageResponse>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <ApprovalPanel
              request={approvalRequest(
                acmeBase,
                "Send this reply to the customer? (Tool: send_email)",
                [
                  { label: "Send", value: true, style: "primary" },
                  { label: "Cancel", value: false, style: "secondary" },
                ],
                "email",
                "Thanks for reaching out — we can replace the item and waive shipping. If you confirm the order number, I’ll get it started."
              )}
              onRespond={noop}
              showContext={false}
            />
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent className={styles.fullWidthMessage}>
            <ChainOfThought defaultOpen={false}>
              <ChainOfThoughtHeader>Agent reasoning</ChainOfThoughtHeader>
              <ChainOfThoughtContent>
                <ChainOfThoughtStep label="Approval received" status="complete">
                  The human approved sending the reply to the customer.
                </ChainOfThoughtStep>
              </ChainOfThoughtContent>
            </ChainOfThought>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent className={styles.fullWidthMessage}>
            <Tool defaultOpen={false}>
              <ToolHeader title="send_email" type="tool-send_email" state="output-available" />
              <ToolContent>
                <ToolInput
                  input={{
                    to: "customer@acme.com",
                    subject: "Replacement order confirmation",
                    body: "Thanks for reaching out — we can replace the item and waive shipping. If you confirm the order number, I’ll get it started.",
                  }}
                />
                <ToolOutput output={{ status: "sent", message_id: "msg_4810" }} />
              </ToolContent>
            </Tool>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent className={styles.fullWidthMessage}>
            <MessageResponse from="assistant">
              Done. Next, I can open a replacement ticket — I just need two details.
            </MessageResponse>
          </MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            <HITLInputsPanel
              request={{
                ...acmeBase,
                request_type: "inputs",
                message: "Create a replacement ticket (Tool: create_ticket)",
                items: [
                  {
                    item_id: "order_id",
                    label: "Order ID",
                    request_type: "input",
                    message: "What is the order number?",
                    required: true,
                    metadata: { placeholder: "e.g., 104829" },
                  },
                  {
                    item_id: "priority",
                    label: "Priority",
                    request_type: "select",
                    message: "How urgent is this?",
                    required: true,
                    options: [
                      { label: "Low", value: "low" },
                      { label: "Normal", value: "normal" },
                      { label: "High", value: "high" },
                    ],
                    metadata: { mode: "single", style: "radio" },
                  },
                ],
              }}
              onRespond={noop}
              showContext={false}
            />
          </MessageContent>
        </Message>
      </ConversationContent>
    </Conversation>
    <ChatFooter />
  </div>
)

const CHATS = { "ops-chat": OpsChat, "copilot-chat": CopilotChat }

export const HitlDemo = ({ theme, demo }) => {
  const Chat = CHATS[demo]
  const [Panel, request] = PANELS[demo] || []
  if (!Chat && !Panel) throw new Error(`No HITL demo named ${demo}`)
  return (
    <ThemeProvider defaultTheme={theme}>
      {Chat ? <Chat /> : <Panel request={request} onRespond={noop} showContext={false} />}
    </ThemeProvider>
  )
}
