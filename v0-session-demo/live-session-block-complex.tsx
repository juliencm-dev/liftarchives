"use client"

import { useState } from "react"
import {
  Minus,
  Plus,
  Play,
  FileText,
  History,
  ChevronRight,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ComplexMovement {
  name: string
  reps: number
  imageUrl?: string
}

interface ComplexBlockProps {
  /** Movements in this complex */
  movements: ComplexMovement[]
  /** Total sets for the block */
  totalSets: number
  /** Currently on set number */
  currentSet: number
  /** "Up to" intensity info */
  intensityLabel?: string
  /** Optional block note (e.g., "Every 90sec") */
  note?: string
  onLogSet?: (data: {
    movementReps: number[]
    weight: number
    feel: "hard" | "normal" | "easy"
  }) => void
}

export function LiveSessionBlockComplex({
  movements: initialMovements,
  totalSets,
  currentSet,
  intensityLabel,
  note,
  onLogSet,
}: ComplexBlockProps) {
  const [movementReps, setMovementReps] = useState(
    initialMovements.map((m) => m.reps)
  )
  const [weight, setWeight] = useState(20)
  const [feel, setFeel] = useState<"hard" | "normal" | "easy" | null>(null)
  const [activeMovement, setActiveMovement] = useState(0)

  function updateReps(index: number, delta: number) {
    setMovementReps((prev) =>
      prev.map((r, i) => (i === index ? Math.max(1, r + delta) : r))
    )
  }

  function handleLog() {
    onLogSet?.({ movementReps, weight, feel: feel ?? "normal" })
    setFeel(null)
  }

  const activeMove = initialMovements[activeMovement]

  // Build the compact complex notation, e.g., "1+2+2"
  const repsNotation = initialMovements.map((m) => m.reps).join("+")

  return (
    <div className="flex flex-1 flex-col">
      {/* Video/demo area for active movement */}
      <div className="relative mx-4 mt-3 overflow-hidden rounded-xl bg-secondary/60">
        {activeMove?.imageUrl ? (
          <img
            src={activeMove.imageUrl}
            alt={activeMove.name}
            className="aspect-[2/1] w-full object-cover"
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

      {/* Active movement name + block info */}
      <div className="mt-5 px-4 text-center">
        <h2 className="text-xl font-bold text-foreground">
          {activeMove?.name}
        </h2>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span className="font-mono text-sm text-muted-foreground">
            {totalSets}x ({repsNotation})
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
              <span className="text-xs italic text-muted-foreground">
                {note}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Movement reps breakdown - tap name to select */}
      <div className="mx-4 mt-5 rounded-xl border border-border/50 bg-secondary/30">
        {initialMovements.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-4 py-3 transition-colors",
              i < initialMovements.length - 1 && "border-b border-border/30",
              i === activeMovement && "bg-primary/[0.04]"
            )}
          >
            {/* Connector dot */}
            <div
              className={cn(
                "size-2 shrink-0 rounded-full transition-colors",
                i === activeMovement ? "bg-primary" : "bg-muted-foreground/20"
              )}
            />
            <button
              onClick={() => setActiveMovement(i)}
              className={cn(
                "flex-1 text-left text-sm transition-colors",
                i === activeMovement
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.name}
            </button>

            {/* Inline reps stepper */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateReps(i, -1)}
                className="flex size-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-6 text-center font-mono text-sm font-bold text-foreground">
                {movementReps[i]}
              </span>
              <button
                onClick={() => updateReps(i, 1)}
                className="flex size-7 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                <Plus className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shared weight stepper */}
      <div className="mt-5 flex flex-col items-center gap-1 px-4">
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

      {/* Feel scale */}
      <div className="mt-5 px-4">
        <p className="mb-2.5 text-center text-xs text-muted-foreground">
          How hard was that?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              {
                key: "hard" as const,
                icon: ThumbsDown,
                label: "Hard",
                color:
                  "text-destructive border-destructive/30 bg-destructive/10",
              },
              {
                key: "normal" as const,
                icon: Minus,
                label: "Normal",
                color:
                  "text-muted-foreground border-border bg-secondary/50",
              },
              {
                key: "easy" as const,
                icon: ThumbsUp,
                label: "Easy",
                color: "text-green-500 border-green-500/30 bg-green-500/10",
              },
            ] as const
          ).map(({ key, icon: Icon, label, color }) => (
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
      <div className="mt-5 flex items-center gap-4 px-4">
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
