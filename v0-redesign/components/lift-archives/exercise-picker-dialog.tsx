"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ExerciseCategory {
  label: string
  exercises: string[]
}

const exerciseLibrary: ExerciseCategory[] = [
  {
    label: "OLYMPIC",
    exercises: [
      "Behind the Neck Jerk",
      "Block Clean",
      "Block Snatch",
      "Clean",
      "Clean Deadlift",
      "Clean from Blocks",
      "Clean High Pull",
      "Clean & Jerk",
      "Clean Pull",
      "Deficit Clean",
      "Deficit Snatch",
      "Hang Clean",
      "Hang Power Clean",
      "Hang Power Snatch",
      "Hang Snatch",
      "Jerk",
      "Jerk Dip",
      "Muscle Clean",
      "Muscle Snatch",
      "Power Clean",
      "Power Jerk",
      "Power Snatch",
      "Push Press",
      "Snatch",
      "Snatch Deadlift",
      "Snatch from Blocks",
      "Snatch High Pull",
      "Snatch Pull",
      "Split Jerk",
      "Squat Jerk",
    ],
  },
  {
    label: "POWERLIFTING",
    exercises: [
      "Bench Press",
      "Close Grip Bench Press",
      "Deadlift",
      "Floor Press",
      "Incline Bench Press",
      "Paused Bench Press",
      "Romanian Deadlift",
      "Sumo Deadlift",
    ],
  },
  {
    label: "SQUATS",
    exercises: [
      "Back Squat",
      "Front Squat",
      "Overhead Squat",
      "Pause Squat",
      "Pin Squat",
      "Tempo Squat",
    ],
  },
  {
    label: "ACCESSORY",
    exercises: [
      "Back Extension",
      "Barbell Row",
      "Bulgarian Split Squat",
      "Good Morning",
      "Hip Thrust",
      "Lat Pulldown",
      "Lunge",
      "Pendlay Row",
      "Pull Up",
      "Step Up",
      "Strict Press",
    ],
  },
]

interface ExercisePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (exerciseName: string) => void
  onCreateNew?: (name: string) => void
}

export function ExercisePickerDialog({
  open,
  onOpenChange,
  onSelect,
}: ExercisePickerDialogProps) {
  const [search, setSearch] = useState("")

  const filteredCategories = exerciseLibrary
    .map((cat) => ({
      ...cat,
      exercises: cat.exercises.filter((ex) =>
        ex.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((cat) => cat.exercises.length > 0)

  function handleSelect(exercise: string) {
    onSelect(exercise)
    setSearch("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] border-border bg-card sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Add Exercise
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search lifts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 border-primary/40 bg-input pl-10 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/20"
            autoFocus
          />
        </div>

        <div className="-mx-2 max-h-[50dvh] overflow-y-auto px-2">
          {filteredCategories.map((category, catIndex) => (
            <div key={category.label}>
              {catIndex > 0 && <Separator className="my-2 bg-border" />}
              <p className="mb-1 px-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {category.label}
              </p>
              {category.exercises.map((exercise) => (
                <button
                  key={exercise}
                  type="button"
                  onClick={() => handleSelect(exercise)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2.5 text-left text-sm text-foreground transition-colors",
                    "hover:bg-primary/15 hover:text-primary"
                  )}
                >
                  {exercise}
                </button>
              ))}
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No exercises found</p>
            </div>
          )}
        </div>

        <Separator className="bg-border" />

        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground hover:text-primary"
          onClick={() => {
            if (search.trim()) {
              handleSelect(search.trim())
            }
          }}
        >
          <Plus className="size-4" />
          Create new lift
        </Button>
      </DialogContent>
    </Dialog>
  )
}
