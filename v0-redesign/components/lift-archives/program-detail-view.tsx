"use client"

import { useState } from "react"
import {
  Pencil,
  Play,
  Trash2,
  Dumbbell,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PageHeader } from "./page-header"
import type { ProgramDay } from "./program-step-days"
import type { DayExercises, ProgramBlock } from "./program-step-exercises"

function BlockDetailCard({ block }: { block: ProgramBlock }) {
  const isComplex = block.movements.length > 1
  const intensityParts: string[] = []
  if (block.upTo) {
    if (block.upToPercent) intensityParts.push(`${block.upToPercent}%`)
    if (block.upToRpe) intensityParts.push(`RPE ${block.upToRpe}`)
  }

  return (
    <div className={cn(
      "overflow-hidden rounded-xl border",
      isComplex ? "border-primary/20 bg-secondary/10" : "border-border/60 bg-secondary/30"
    )}>
      {/* Block header */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-2.5",
        isComplex && "border-b border-primary/10 bg-primary/[0.03]"
      )}>
        <div className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold",
          isComplex ? "bg-primary/15 text-primary" : "bg-secondary text-foreground"
        )}>
          {block.label}
        </div>

        <span className="font-mono text-sm font-semibold text-foreground">
          {block.sets}x
        </span>

        {isComplex && (
          <Badge className="border-0 bg-primary/15 text-[9px] font-bold uppercase tracking-widest text-primary">
            Complex
          </Badge>
        )}

        {intensityParts.length > 0 && (
          <>
            <div className="h-3.5 w-px bg-border" />
            <span className="text-xs text-primary">
              {"up to "}
              <span className="font-mono font-semibold">
                {intensityParts.join(" / ")}
              </span>
            </span>
          </>
        )}

        {block.notes && (
          <>
            <div className="h-3.5 w-px bg-border" />
            <span className="text-xs text-muted-foreground italic">
              {block.notes}
            </span>
          </>
        )}
      </div>

      {/* Movements */}
      {isComplex ? (
        <div className="relative px-4 py-2.5">
          {/* Vertical connector */}
          {block.movements.length > 1 && (
            <div className="absolute bottom-5 left-[1.65rem] top-5 w-px bg-primary/20" />
          )}
          <div className="space-y-0">
            {block.movements.map((m) => (
              <div key={m.id} className="group relative flex items-center gap-3 py-1.5">
                <div className="relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-card">
                  <div className="size-1.5 rounded-full bg-primary/50" />
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {m.name}
                </span>
                <span className="shrink-0 font-mono text-sm text-muted-foreground">
                  {m.reps} <span className="text-xs">rep{parseInt(m.reps) !== 1 ? "s" : ""}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4 py-2.5">
          {block.movements.map((m) => (
            <div key={m.id} className="flex items-center gap-3">
              <span className="flex-1 text-sm font-semibold text-foreground">
                {m.name}
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                {m.reps} <span className="text-xs">rep{parseInt(m.reps) !== 1 ? "s" : ""}</span>
              </span>
            </div>
          ))}
          {block.movements.length === 0 && (
            <p className="text-sm text-muted-foreground/60">No movements</p>
          )}
        </div>
      )}
    </div>
  )
}

interface ProgramDetailViewProps {
  name: string
  days: ProgramDay[]
  dayExercises: DayExercises[]
  isActive?: boolean
  onBack: () => void
  onEdit?: () => void
  onActivate?: () => void
  onDelete?: () => void
}

export function ProgramDetailView({
  name,
  days,
  dayExercises,
  isActive = false,
  onBack,
  onEdit,
  onActivate,
  onDelete,
}: ProgramDetailViewProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(
    new Set(days.map((d) => d.id))
  )

  function toggleDay(dayId: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(dayId)) next.delete(dayId)
      else next.add(dayId)
      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader title={name} backLabel="Back to Programs" onBack={onBack} />

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="gap-2 border-border text-foreground hover:border-primary/30"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onActivate}
            className="gap-2 border-border text-foreground hover:border-primary/30"
          >
            <Play className="size-3.5" />
            {isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Day cards */}
      <div className="mt-8 space-y-4">
        {days.map((day) => {
          const dayData = dayExercises.find((d) => d.dayId === day.id)
          const blocks = dayData?.blocks ?? []
          const isExpanded = expandedDays.has(day.id)

          return (
            <Card key={day.id} className="border-border bg-card">
              <CardHeader className="p-0">
                <button
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <Dumbbell className="size-4.5 text-primary" />
                    <span className="text-base font-semibold text-foreground">
                      {day.name}
                    </span>
                    {blocks.length > 0 && (
                      <Badge
                        variant="secondary"
                        className="border-0 bg-primary/10 text-[10px] font-bold text-primary"
                      >
                        {blocks.length} {blocks.length === 1 ? "block" : "blocks"}
                      </Badge>
                    )}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="size-4.5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4.5 text-muted-foreground" />
                  )}
                </button>
              </CardHeader>

              {isExpanded && (
                <CardContent className="border-t border-border px-5 pt-4">
                  {blocks.length === 0 ? (
                    <p className="py-2 text-sm text-muted-foreground">
                      No exercises for this day.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {blocks.map((block) => (
                        <BlockDetailCard key={block.id} block={block} />
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
