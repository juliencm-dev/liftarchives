"use client"

import { MoreVertical, Eye, Pencil, Play, Trash2, CalendarDays } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export interface ProgramSummary {
  id: string
  name: string
  daysPerWeek: number
  description?: string
  isActive?: boolean
}

interface ProgramCardProps {
  program: ProgramSummary
  onView?: () => void
  onEdit?: () => void
  onActivate?: () => void
  onDelete?: () => void
}

export function ProgramCard({
  program,
  onView,
  onEdit,
  onActivate,
  onDelete,
}: ProgramCardProps) {
  return (
    <Card className="group relative border-border bg-card transition-all hover:border-primary/25 hover:shadow-[0_0_20px_rgba(212,168,83,0.04)]">
      <div className="flex items-start justify-between p-5">
        <button
          type="button"
          onClick={onView}
          className="flex flex-1 flex-col gap-2 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <CalendarDays className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-foreground">
                {program.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {program.daysPerWeek} {program.daysPerWeek === 1 ? "day" : "days"}/week
              </p>
            </div>
          </div>
          {program.description && (
            <p className="line-clamp-2 pl-[52px] text-sm text-muted-foreground/70">
              {program.description}
            </p>
          )}
        </button>

        <div className="flex items-center gap-2">
          {program.isActive && (
            <Badge className="border-0 bg-primary/15 text-xs font-medium text-primary">
              Active
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Program options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-border bg-popover">
              <DropdownMenuItem onClick={onView} className="gap-2 text-foreground">
                <Eye className="size-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit} className="gap-2 text-foreground">
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onActivate} className="gap-2 text-foreground">
                <Play className="size-4" />
                {program.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={onDelete}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  )
}
