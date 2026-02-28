"use client"

import { useState } from "react"
import { Minus, Plus, Play, FileText, History, ChevronRight, ThumbsDown, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SingleBlockProps {
  exerciseName: string
  /** Placeholder image path for the exercise */
  imageUrl?: string
  /** Prescribed reps for this movement */
  prescribedReps: number
  /** Total sets for the block */
  totalSets: number
  /** Currently on set number */
  currentSet: number
  /** "Up to" intensity info */
  intensityLabel?: string
  /** Optional block note (e.g., "Every 90sec") */
  note?: string
  onLogSet?: (data: { reps: number; weight: number; feel: "hard" | "normal" | "easy" }) => void
}

export function LiveSessionBlockSingle({
  exerciseName,
  imageUrl,
  prescribedReps,
  totalSets,
  currentSet,
  intensityLabel,
  note,
  onLogSet,
}: SingleBlockProps) {
  const [reps, setReps] = useState(prescribedReps)
  const [weight, setWeight] = useState(20)
  const [feel, setFeel] = useState<"hard" | "normal" | "easy" | null>(null)

  function handleLog() {
    onLogSet?.({ reps, weight, feel: feel ?? "normal" })
    setFeel(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Exercise media area */}
      <div className="relative mx-4 mt-3 overflow-hidden rounded-xl bg-secondary/60">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={exerciseName}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[2/1] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10">
                <Play className="size-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Tap to watch demo</p>
            </div>
          </div>
        )}
      </div>

      {/* Exercise info */}
      <div className="mt-5 px-4 text-center">
        <h2 className="text-xl font-bold text-foreground">{exerciseName}</h2>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            {totalSets}x{prescribedReps}
          </span>
          {intensityLabel && (
            <>
              <div className="h-3 w-px bg-border" />
              <span className="text-xs text-primary">{intensityLabel}</span>
            </>
          )}
          {note && (
            <>
              <div className="h-3 w-px bg-border" />
              <span className="text-xs italic text-muted-foreground">{note}</span>
            </>
          )}
        </div>
      </div>

      {/* Reps and Weight steppers */}
      <div className="mt-6 flex items-stretch justify-center gap-6 px-4">
        {/* Reps stepper */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReps(Math.max(1, reps - 1))}
              className="size-11 rounded-full"
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-12 text-center font-mono text-4xl font-bold text-foreground">
              {reps}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setReps(reps + 1)}
              className="size-11 rounded-full"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Reps
          </span>
        </div>

        {/* Divider */}
        <div className="my-2 w-px bg-border" />

        {/* Weight stepper */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeight(Math.max(0, weight - 1))}
              className="size-11 rounded-full"
            >
              <Minus className="size-4" />
            </Button>
            <span className="w-16 text-center font-mono text-4xl font-bold text-foreground">
              {weight}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeight(weight + 1)}
              className="size-11 rounded-full"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            KG
          </span>
        </div>
      </div>

      {/* Feel scale */}
      <div className="mt-6 px-4">
        <p className="mb-2.5 text-center text-xs text-muted-foreground">
          How hard was that?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {([
            { key: "hard" as const, icon: ThumbsDown, label: "Hard", color: "text-destructive border-destructive/30 bg-destructive/10" },
            { key: "normal" as const, icon: Minus, label: "Normal", color: "text-muted-foreground border-border bg-secondary/50" },
            { key: "easy" as const, icon: ThumbsUp, label: "Easy", color: "text-green-500 border-green-500/30 bg-green-500/10" },
          ]).map(({ key, icon: Icon, label, color }) => (
            <button
              key={key}
              onClick={() => setFeel(feel === key ? null : key)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all",
                feel === key
                  ? color
                  : "border-border/50 bg-transparent text-muted-foreground/60 hover:border-border hover:text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Log button and set counter */}
      <div className="mt-6 flex items-center gap-4 px-4">
        <span className="font-mono text-sm text-muted-foreground">
          Set {currentSet}/{totalSets}
        </span>
        <Button
          onClick={handleLog}
          className="h-12 flex-1 rounded-xl text-base font-bold"
        >
          Log Set
        </Button>
      </div>

      {/* Action links */}
      <div className="mt-4 divide-y divide-border/40 border-t border-border/40 px-4">
        {[
          { icon: FileText, label: "Movement description" },
          { icon: History, label: "View history" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex w-full items-center gap-3 py-3.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon className="size-4" />
            <span className="flex-1">{label}</span>
            <ChevronRight className="size-4 text-muted-foreground/40" />
          </button>
        ))}
      </div>
    </div>
  )
}
