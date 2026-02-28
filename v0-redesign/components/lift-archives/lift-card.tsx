"use client"

import { useState } from "react"
import { Plus, TrendingUp, Trophy, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface LiftRecord {
  weight: number
  unit: string
  date: string
}

interface LiftCardProps {
  name: string
  category: "olympic" | "powerlifting" | "squat"
  currentPR?: LiftRecord | null
  previousPR?: LiftRecord | null
  isSelected?: boolean
  onSelect?: () => void
  onAddPR?: (weight: number, date: string) => void
  unit?: string
}

const categoryColors = {
  olympic: "bg-primary/15 text-primary border-primary/20",
  powerlifting: "bg-red-500/15 text-red-400 border-red-500/20",
  squat: "bg-blue-500/15 text-blue-400 border-blue-500/20",
}

const categoryLabels = {
  olympic: "Olympic",
  powerlifting: "Powerlifting",
  squat: "Squat",
}

export function LiftCard({
  name,
  category,
  currentPR,
  previousPR,
  isSelected = false,
  onSelect,
  onAddPR,
  unit = "kg",
}: LiftCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newWeight, setNewWeight] = useState("")
  const [newDate, setNewDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const improvement =
    currentPR && previousPR ? currentPR.weight - previousPR.weight : null

  function handleSubmit() {
    const weight = parseFloat(newWeight)
    if (!isNaN(weight) && weight > 0) {
      onAddPR?.(weight, newDate)
      setNewWeight("")
      setNewDate(new Date().toISOString().split("T")[0])
      setIsAdding(false)
    }
  }

  function handleCancel() {
    setIsAdding(false)
    setNewWeight("")
    setNewDate(new Date().toISOString().split("T")[0])
  }

  return (
    <Card
      className={cn(
        "group relative cursor-pointer gap-0 overflow-hidden border py-0 transition-all duration-200 hover:border-border/80 hover:bg-card/80",
        isSelected
          ? "border-primary/50 bg-primary/[0.03] ring-1 ring-primary/20"
          : "border-border/50"
      )}
      onClick={() => !isAdding && onSelect?.()}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isAdding) onSelect?.()
      }}
    >
      {/* Top section */}
      <div className="flex items-start justify-between p-4 pb-0">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">{name}</h3>
          <span
            className={cn(
              "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              categoryColors[category]
            )}
          >
            {categoryLabels[category]}
          </span>
        </div>

        {/* Add PR button */}
        {!isAdding && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              setIsAdding(true)
            }}
            aria-label={`Add PR for ${name}`}
          >
            <Plus className="size-3.5" />
          </Button>
        )}
      </div>

      {/* PR Display or Add Form */}
      <div className="p-4 pt-3">
        {isAdding ? (
          <div
            className="flex flex-col gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Weight"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="h-8 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit()
                  if (e.key === "Escape") handleCancel()
                }}
              />
              <span className="text-xs text-muted-foreground">{unit}</span>
            </div>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="h-8 text-sm"
            />
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                className="h-7 flex-1 text-xs"
                onClick={handleSubmit}
              >
                <Check className="size-3" />
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={handleCancel}
              >
                <X className="size-3" />
              </Button>
            </div>
          </div>
        ) : currentPR ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tabular-nums text-foreground">
                {currentPR.weight}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                {currentPR.unit}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {currentPR.date}
              </span>
              {improvement !== null && improvement > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-400">
                  <TrendingUp className="size-3" />
                  {"+"}
                  {improvement}
                  {currentPR.unit}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 py-2">
            <Trophy className="size-4 text-muted-foreground/50" />
            <span className="text-xs text-muted-foreground">No records yet</span>
          </div>
        )}
      </div>

      {/* Selected indicator line */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
      )}
    </Card>
  )
}
