"use client"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import * as Collapsible from "@radix-ui/react-collapsible"
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react"
import * as React from "react"
import { CodeBlock } from "./code-block"

const STATUS_LABELS = {
  "input-streaming": "Pending",
  "input-available": "Running",
  "approval-requested": "Awaiting Approval",
  "approval-responded": "Responded",
  "output-available": "Completed",
  "output-error": "Error",
  "output-denied": "Denied",
}

const STATUS_ICONS = {
  "input-streaming": <CircleIcon className="size-4" />,
  "input-available": <ClockIcon className="size-4 animate-pulse" />,
  "approval-requested": <ClockIcon className="size-4 text-yellow-600" />,
  "approval-responded": <CheckCircle2Icon className="size-4 text-blue-600" />,
  "output-available": <CheckCircle2Icon className="size-4 text-green-600" />,
  "output-error": <XCircleIcon className="size-4 text-red-600" />,
  "output-denied": <XCircleIcon className="size-4 text-orange-600" />,
}

export const getStatusBadge = status => (
  <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
    {STATUS_ICONS[status]}
    {STATUS_LABELS[status]}
  </Badge>
)

export const Tool = ({ className, ...props }) => (
  <Collapsible.Root
    className={cn("group not-prose w-full rounded-md", className)}
    {...props}
  />
)

export const ToolContent = ({ className, ...props }) => (
  <Collapsible.Content
    className={cn(
      "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    )}
    {...props}
  />
)

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  toolName,
  ...props
}) => {
  const displayName =
    type === "dynamic-tool" ? toolName : type?.split("-").slice(1).join("-")

  return (
    <Collapsible.Trigger
      className={cn(
        "flex w-full items-center justify-between gap-4 py-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <WrenchIcon className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm">{title ?? displayName}</span>
        {state ? getStatusBadge(state) : null}
      </div>
      <ChevronDownIcon className="size-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
    </Collapsible.Trigger>
  )
}

export const ToolInput = ({ className, input, ...props }) => (
  <div className={cn("space-y-2 overflow-hidden py-3", className)} {...props}>
    <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-md bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} />
    </div>
  </div>
)

export const ToolOutput = ({ className, output, errorText, ...props }) => {
  if (!(output || errorText)) return null

  let outputNode = <div>{output}</div>

  if (typeof output === "string") {
    outputNode = <CodeBlock code={output} />
  } else if (
    output &&
    typeof output === "object" &&
    !React.isValidElement(output)
  ) {
    outputNode = <CodeBlock code={JSON.stringify(output, null, 2)} />
  }

  return (
    <div className={cn("space-y-2 py-3", className)} {...props}>
      <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? "Error" : "Result"}
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-md text-xs [&_table]:w-full",
          errorText
            ? "bg-destructive/10 text-destructive"
            : "bg-muted/50 text-foreground"
        )}
      >
        {errorText ? <div>{errorText}</div> : null}
        {outputNode}
      </div>
    </div>
  )
}
