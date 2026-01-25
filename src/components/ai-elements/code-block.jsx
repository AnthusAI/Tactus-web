"use client"
import { cn } from "@/lib/utils"
import * as React from "react"

export const CodeBlock = ({ code, className, ...props }) => (
  <pre
    className={cn(
      "overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5 text-foreground",
      className
    )}
    {...props}
  >
    <code>{code}</code>
  </pre>
)
