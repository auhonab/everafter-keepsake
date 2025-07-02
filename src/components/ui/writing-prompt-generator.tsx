"use client"

import { useState, useEffect } from "react"
import { PenTool, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"

const GENTLE_PROMPTS = [
  "Write about a friend who made you feel seen when you needed it most.",
  "What’s one moment with someone that made you believe in love a little more?",
  "Describe a day that reminded you how beautiful life can be.",
  "Who in your life brings out the softest parts of you?",
  "What’s a memory with a friend that still makes you laugh?",
  "Write about someone who stayed — even when they didn’t have to.",
  "What’s something your closest friend taught you without realizing it?",
  "Describe a moment that felt like pure belonging.",
  "Who is someone you want to grow old with — and why?",
  "Write about the kind of love that feels like coming home.",
  "What does loyalty look like in your life?",
  "Describe a friendship that has weathered many seasons.",
  "What’s something small a friend did that meant the world to you?",
  "Write about the first time you felt truly supported by someone.",
  "What’s a lesson love keeps teaching you again and again?",
  "Describe a time a simple conversation changed your entire day.",
  "Write a letter to the version of you that needed a friend the most.",
  "Who do you turn to when life gets heavy — and why?",
  "Describe a shared moment that felt like the beginning of forever.",
  "What makes someone unforgettable in your life?"
]

export default function WritingPromptGenerator() {
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [fadeClass, setFadeClass] = useState("opacity-100")
  const router = useRouter()

  // Get random prompt
  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * GENTLE_PROMPTS.length)
    return GENTLE_PROMPTS[randomIndex]
  }

  // Initialize with random prompt
  useEffect(() => {
    setCurrentPrompt(getRandomPrompt())
  }, [])

  // Handle new prompt with gentle fade animation
  const handleNewPrompt = () => {
    setIsLoading(true)
    setFadeClass("opacity-0")
    
    setTimeout(() => {
      setCurrentPrompt(getRandomPrompt())
      setFadeClass("opacity-100")
      setIsLoading(false)
    }, 300)
  }

  // Handle write about this
  const handleWriteAboutThis = () => {
    // Navigate to journal with the prompt as a query parameter
    const encodedPrompt = encodeURIComponent(currentPrompt)
    router.push(`/journal?prompt=${encodedPrompt}`)
  }

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="bg-card border border-accent/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-500 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-muted-foreground/70 text-sm font-body mb-2">
            <PenTool className="w-4 h-4" />
            <span>A gentle invitation to reflect</span>
          </div>
        </div>

        {/* Prompt Display */}
        <div className="min-h-[120px] flex items-center justify-center mb-8">
          <p 
            className={`text-foreground font-body text-lg leading-relaxed text-center transition-opacity duration-300 ${fadeClass}`}
            style={{ 
              fontStyle: 'italic',
              lineHeight: '1.6'
            }}
          >
            "{currentPrompt}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Write About This Button */}
          <button
            onClick={handleWriteAboutThis}
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-body font-medium py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            ✍️ Write About This
          </button>

          {/* New Prompt Button */}
          <button
            onClick={handleNewPrompt}
            disabled={isLoading}
            className="w-full bg-muted hover:bg-accent/50 text-muted-foreground hover:text-foreground font-body py-2 px-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            ↻ New Prompt
          </button>
        </div>
      </div>

      {/* Gentle decorative elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent/30 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-primary/40 rounded-full animate-pulse delay-1000 opacity-50"></div>
    </div>
  )
}
