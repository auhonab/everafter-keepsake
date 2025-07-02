"use client"

import { ImageIcon } from "lucide-react"

interface ImagePlaceholderProps {
  className?: string
  text?: string
  height?: number
  width?: number
}

export function ImagePlaceholder({
  className = "",
  text = "Image",
  height = 200,
  width = 300,
}: ImagePlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-muted/30 rounded-md ${className}`}
      style={{ height: `${height}px`, width: `${width}px` }}
    >
      <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
      <p className="text-xs text-muted-foreground mt-2">{text}</p>
    </div>
  )
}
