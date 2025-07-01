"use client"

import { ReactNode, useState } from "react"
import { Card } from "./card"

interface InteractiveCardProps {
  children: ReactNode
  rotation: string
  className?: string
}

export function InteractiveCard({ children, rotation, className = "" }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className={`hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer transform ${className}`}
      style={{
        transform: isHovered 
          ? `scale(1.05) rotate(${rotation})` 
          : "scale(1) rotate(0deg)",
        transition: "all 0.3s ease-in-out"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Card>
  )
}
