"use client"

import { Plus, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ProgramDay {
  id: string
  name: string
}

interface ProgramStepDaysProps {
  days: ProgramDay[]
  onAddDay: () => void
  onRemoveDay: (id: string) => void
  onDuplicateDay: (id: string) => void
  onRenameDay: (id: string, name: string) => void
}

export function ProgramStepDays({
  days,
  onAddDay,
  onRemoveDay,
  onDuplicateDay,
  onRenameDay,
}: ProgramStepDaysProps) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-3">
      {days.map((day, index) => (
        <div
          key={day.id}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/20"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
            {index + 1}
          </div>

          <Input
            value={day.name}
            onChange={(e) => onRenameDay(day.id, e.target.value)}
            className="h-10 flex-1 border-border bg-input text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
          />

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onDuplicateDay(day.id)}
              className="size-9 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
              aria-label={`Duplicate ${day.name}`}
            >
              <Copy className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveDay(day.id)}
              disabled={days.length <= 1}
              className={cn(
                "size-9 transition-opacity",
                days.length <= 1
                  ? "text-muted-foreground/30"
                  : "text-destructive opacity-0 hover:text-destructive group-hover:opacity-100"
              )}
              aria-label={`Remove ${day.name}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAddDay}
        className="h-12 w-full gap-2 border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
      >
        <Plus className="size-4" />
        Add Day
      </Button>
    </div>
  )
}
