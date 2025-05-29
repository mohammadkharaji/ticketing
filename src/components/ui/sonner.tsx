"use client"

import React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: [
            // success
            "group-[.toast][data-type=success]:bg-green-400 group-[.toast][data-type=success]:text-black",
            // error/destructive
            "group-[.toast][data-type=error]:bg-red-500 group-[.toast][data-type=error]:text-black",
            "group-[.toast][data-type=destructive]:bg-red-500 group-[.toast][data-type=destructive]:text-black",
            // warning
            "group-[.toast][data-type=warning]:bg-yellow-300 group-[.toast][data-type=warning]:text-black",
            // default (yellow)
            "group toast group-[.toaster]:bg-yellow-300 group-[.toaster]:text-black group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          ].join(" "),
          description: "group-[.toast]:text-black",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
