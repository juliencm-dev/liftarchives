"use client"

import { Dumbbell, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrainingExercise {
  id: string
  name: string
  sets: number
  reps: string
  weight: string
}

interface TodaysTrainingCardProps {
  exercises?: TrainingExercise[]
  programName?: string
}

export function TodaysTrainingCard({
  exercises = [],
  programName,
}: TodaysTrainingCardProps) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Dumbbell className="size-4 text-primary" />
          {"Today's Training"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <CalendarDays className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No training scheduled for today
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Set up a program to see your daily plan
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {programName && (
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-primary">
                {programName}
              </p>
            )}
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/50 p-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {exercise.name}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {exercise.sets}x{exercise.reps} @ {exercise.weight}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
