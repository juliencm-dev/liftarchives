"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LiveSessionHeader } from "./live-session-header"
import { LiveSessionBlockSingle } from "./live-session-block-single"
import { LiveSessionBlockComplex } from "./live-session-block-complex"
import { LiveSessionRestTimer } from "./live-session-rest-timer"
import type { ProgramBlock } from "../program-step-exercises"

interface LiveSessionViewProps {
  dayLabel: string
  blocks: ProgramBlock[]
  onBack?: () => void
}

export function LiveSessionView({
  dayLabel,
  blocks,
  onBack,
}: LiveSessionViewProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
  const [currentSets, setCurrentSets] = useState<Record<string, number>>({})
  const [setsLogged, setSetsLogged] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [resting, setResting] = useState(false)

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }, [])

  const currentBlock = blocks[currentBlockIndex]
  if (!currentBlock) return null

  const isComplex = currentBlock.movements.length > 1
  const blockSetCount = parseInt(currentBlock.sets) || 1
  const currentSetNum = (currentSets[currentBlock.id] || 0) + 1

  function handleLogSet() {
    const newSetNum = currentSetNum
    setSetsLogged((n) => n + 1)
    setCurrentSets((prev) => ({
      ...prev,
      [currentBlock.id]: (prev[currentBlock.id] || 0) + 1,
    }))

    // If there are more sets remaining, show rest timer
    const isLastSetOfBlock = newSetNum >= blockSetCount
    if (!isLastSetOfBlock) {
      setResting(true)
    } else if (currentBlockIndex < blocks.length - 1) {
      // Last set of block -- brief rest then advance
      setResting(true)
    }
  }

  function handleRestComplete() {
    setResting(false)
    // If all sets of current block are done, advance
    const setsCompleted = (currentSets[currentBlock.id] || 0) + 1
    if (setsCompleted >= blockSetCount && currentBlockIndex < blocks.length - 1) {
      setCurrentBlockIndex((i) => i + 1)
    }
  }

  // Build intensity label
  let intensityLabel = ""
  if (currentBlock.upTo) {
    const parts: string[] = []
    if (currentBlock.upToPercent) parts.push(`up to ${currentBlock.upToPercent}%`)
    if (currentBlock.upToRpe) parts.push(`RPE ${currentBlock.upToRpe}`)
    intensityLabel = parts.join(" / ")
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <LiveSessionHeader
        dayLabel={dayLabel}
        elapsed={formatTime(elapsed)}
        setsLogged={setsLogged}
        currentBlock={currentBlockIndex}
        totalBlocks={blocks.length}
        onBack={onBack}
      />

      {/* Rest timer overlay */}
      {resting && (
        <div className="flex flex-1 flex-col">
          <LiveSessionRestTimer
            completedSet={Math.min(currentSetNum - 1, blockSetCount)}
            totalSets={blockSetCount}
            blockLabel={currentBlock.label}
            onComplete={handleRestComplete}
          />
        </div>
      )}

      {/* Block navigation arrows */}
      {!resting && (
      <div className="relative flex flex-1 flex-col">
        {/* Content */}
        <div className="flex flex-1 flex-col pb-6">
          {isComplex ? (
            <LiveSessionBlockComplex
              movements={currentBlock.movements.map((m) => ({
                name: m.name,
                reps: parseInt(m.reps) || 1,
              }))}
              totalSets={blockSetCount}
              currentSet={Math.min(currentSetNum, blockSetCount)}
              intensityLabel={intensityLabel || undefined}
              note={currentBlock.notes || undefined}
              onLogSet={handleLogSet}
            />
          ) : (
            <LiveSessionBlockSingle
              exerciseName={currentBlock.movements[0]?.name ?? ""}
              prescribedReps={parseInt(currentBlock.movements[0]?.reps ?? "1")}
              totalSets={blockSetCount}
              currentSet={Math.min(currentSetNum, blockSetCount)}
              intensityLabel={intensityLabel || undefined}
              note={currentBlock.notes || undefined}
              onLogSet={handleLogSet}
            />
          )}
        </div>

        {/* Bottom block nav */}
        <div className="sticky bottom-0 flex items-center justify-between border-t border-border/40 bg-background/95 px-4 py-3 backdrop-blur-sm">
          <button
            onClick={() => setCurrentBlockIndex((i) => Math.max(0, i - 1))}
            disabled={currentBlockIndex === 0}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors",
              currentBlockIndex === 0
                ? "text-muted-foreground/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <ChevronLeft className="size-4" />
            Prev
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-primary/15 px-2 py-0.5 font-mono text-xs font-bold text-primary">
              {currentBlock.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Block {currentBlockIndex + 1} of {blocks.length}
            </span>
          </div>

          <button
            onClick={() =>
              setCurrentBlockIndex((i) =>
                Math.min(blocks.length - 1, i + 1)
              )
            }
            disabled={currentBlockIndex === blocks.length - 1}
            className={cn(
              "flex items-center gap-1 text-sm transition-colors",
              currentBlockIndex === blocks.length - 1
                ? "text-muted-foreground/30"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      )}
    </div>
  )
}
