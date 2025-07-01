"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CountdownTimerProps {
  title: string
  date: string
}

interface TimeLeft {
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
}

function TimeValue({ value, unit }: { value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl font-bold text-primary">
        {value}
      </div>
      <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
        {unit}
      </div>
    </div>
  )
}

export function CountdownTimer({ title, date }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({})
  const [mounted, setMounted] = useState(false)

  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(date) - +new Date()
    let timeLeft: TimeLeft = {}

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  useEffect(() => {
    setMounted(true)
    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [date])

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) {
    return (
      <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-center text-xl font-headline text-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  const timerComponents: React.ReactElement[] = []

  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof TimeLeft
    if (timeLeft[key] !== undefined) {
      timerComponents.push(
        <TimeValue
          key={interval}
          value={timeLeft[key]!}
          unit={interval.toUpperCase()}
        />
      )
    }
  })

  return (
    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-center text-xl font-headline text-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {timerComponents.length ? (
          <div className="flex justify-center items-center gap-6">
            {timerComponents}
          </div>
        ) : (
          <div className="text-primary text-lg font-medium">
            The special day is here! 🎉
          </div>
        )}
      </CardContent>
    </Card>
  )
}
