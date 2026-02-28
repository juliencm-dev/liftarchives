"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface RestTimerProps {
  /** Default rest duration in seconds */
  defaultDuration?: number
  /** What set we just completed */
  completedSet: number
  /** Total sets */
  totalSets: number
  /** Block label (A, B, C...) */
  blockLabel: string
  /** Called when timer ends or user skips */
  onComplete: () => void
}

export function LiveSessionRestTimer({
  defaultDuration = 120,
  completedSet,
  totalSets,
  blockLabel,
  onComplete,
}: RestTimerProps) {
  const [duration, setDuration] = useState(defaultDuration)
  const [remaining, setRemaining] = useState(defaultDuration)
  const [isRunning, setIsRunning] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progress = 1 - remaining / duration

  // Countdown
  useEffect(() => {
    if (!isRunning || remaining <= 0) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setIsRunning(false)
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, remaining])

  // Auto-complete when timer hits 0
  useEffect(() => {
    if (remaining === 0 && !isRunning) {
      const timeout = setTimeout(onComplete, 800)
      return () => clearTimeout(timeout)
    }
  }, [remaining, isRunning, onComplete])

  const addTime = useCallback(
    (seconds: number) => {
      setDuration((d) => Math.max(10, d + seconds))
      setRemaining((r) => Math.max(0, r + seconds))
    },
    [],
  )

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60

  // SVG circle dimensions
  const size = 200
  const strokeWidth = 6
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      {/* Context info */}
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">Rest</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Set {completedSet}/{totalSets} complete -- Block {blockLabel}
        </p>
      </div>

      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="-rotate-90"
          viewBox={`0 0 ${size} ${size}`}
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-secondary"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            className={cn(
              "transition-[stroke-dashoffset] duration-1000 ease-linear",
              remaining === 0 ? "text-green-500" : "text-primary"
            )}
          />
        </svg>

        {/* Time display */}
        <div className="absolute flex flex-col items-center">
          <span
            className={cn(
              "font-mono text-5xl font-bold tabular-nums tracking-tight transition-colors",
              remaining === 0 ? "text-green-500" : "text-foreground"
            )}
          >
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
          {remaining === 0 && (
            <span className="mt-1 text-sm font-medium text-green-500">
              Go!
            </span>
          )}
        </div>
      </div>

      {/* Adjust time buttons */}
      <div className="mt-8 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTime(-15)}
          className="h-9 gap-1.5 rounded-full px-4 text-xs"
          disabled={remaining <= 15}
        >
          <Minus className="size-3" />
          15s
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsRunning(!isRunning)
          }}
          className="h-9 rounded-full px-5 text-xs font-semibold"
        >
          {isRunning ? "Pause" : "Resume"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTime(15)}
          className="h-9 gap-1.5 rounded-full px-4 text-xs"
        >
          <Plus className="size-3" />
          15s
        </Button>
      </div>

      {/* Skip button */}
      <Button
        variant="ghost"
        onClick={onComplete}
        className="mt-6 gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        Skip rest
        <SkipForward className="size-4" />
      </Button>
    </div>
  )
}
