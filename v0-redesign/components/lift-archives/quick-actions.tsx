"use client"

import { Plus, TrendingUp, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuickActionsProps {
  onLogSession?: () => void
  onViewLifts?: () => void
  onBrowsePrograms?: () => void
}

export function QuickActions({
  onLogSession,
  onViewLifts,
  onBrowsePrograms,
}: QuickActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button
        onClick={onLogSession}
        className="h-11 flex-1 gap-2 rounded-xl bg-primary font-semibold text-primary-foreground shadow-[0_0_20px_rgba(212,168,83,0.15)] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(212,168,83,0.25)]"
      >
        <Plus className="size-4" />
        Log Session
      </Button>
      <Button
        variant="outline"
        onClick={onViewLifts}
        className="h-11 flex-1 gap-2 rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/5"
      >
        <TrendingUp className="size-4" />
        View Lifts
      </Button>
      <Button
        variant="outline"
        onClick={onBrowsePrograms}
        className="h-11 flex-1 gap-2 rounded-xl border-border/60 hover:border-primary/30 hover:bg-primary/5"
      >
        <CalendarDays className="size-4" />
        Browse Programs
      </Button>
    </div>
  )
}
