"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "../page-header"
import { ProgramWizardStepper } from "../program-wizard-stepper"
import { ProgramStepInfo } from "../program-step-info"
import { ProgramStepDays, type ProgramDay } from "../program-step-days"
import { ProgramStepExercises, type DayExercises, type ProgramBlock } from "../program-step-exercises"
import { ProgramStepReview } from "../program-step-review"
import { ProgramCard, type ProgramSummary } from "../program-card"
import { ProgramDetailView } from "../program-detail-view"
import { ProgramsEmptyState } from "../programs-empty-state"

// Demo data for a completed program
const demoDays: ProgramDay[] = [
  { id: "demo-day-1", name: "Day 1" },
  { id: "demo-day-2", name: "Day 2" },
  { id: "demo-day-3", name: "Day 3" },
]
const demoDayExercises: DayExercises[] = [
  {
    dayId: "demo-day-1",
    blocks: [
      {
        id: "block-a",
        label: "A",
        sets: "5",
        upTo: false,
        upToPercent: "",
        upToRpe: "",
        notes: "",
        movements: [
          { id: "m1", name: "Pull", reps: "1" },
          { id: "m2", name: "Panda Pull", reps: "1" },
          { id: "m3", name: "High Hang Clean", reps: "2" },
        ],
      },
      {
        id: "block-b",
        label: "B",
        sets: "5",
        upTo: false,
        upToPercent: "",
        upToRpe: "",
        notes: "",
        movements: [
          { id: "m4", name: "Panda Pull", reps: "1" },
          { id: "m5", name: "Clean", reps: "2" },
        ],
      },
      {
        id: "block-c",
        label: "C",
        sets: "8",
        upTo: true,
        upToPercent: "80",
        upToRpe: "",
        notes: "Every 90sec",
        movements: [
          { id: "m6", name: "Clean", reps: "2" },
        ],
      },
      {
        id: "block-d",
        label: "D",
        sets: "8",
        upTo: true,
        upToPercent: "80",
        upToRpe: "",
        notes: "Every 90sec",
        movements: [
          { id: "m7", name: "Jerk", reps: "2" },
        ],
      },
    ],
  },
  { dayId: "demo-day-2", blocks: [] },
  { dayId: "demo-day-3", blocks: [] },
]

type ViewState =
  | { view: "list" }
  | { view: "wizard" }
  | { view: "detail"; programId: string }

interface ProgramsViewProps {
  onBack?: () => void
}

export function ProgramsView({ onBack }: ProgramsViewProps) {
  // Top-level view state
  const [viewState, setViewState] = useState<ViewState>({ view: "list" })

  // Program list (starts with one demo program)
  const [programs, setPrograms] = useState<
    {
      summary: ProgramSummary
      days: ProgramDay[]
      dayExercises: DayExercises[]
    }[]
  >([
    {
      summary: {
        id: "demo-1",
        name: "Snatch Focus",
        daysPerWeek: 3,
        isActive: false,
      },
      days: demoDays,
      dayExercises: demoDayExercises,
    },
  ])

  // Wizard state
  const [wizardStep, setWizardStep] = useState(1)
  const [programName, setProgramName] = useState("")
  const [programDescription, setProgramDescription] = useState("")
  const [days, setDays] = useState<ProgramDay[]>([
    { id: crypto.randomUUID(), name: "Day 1" },
    { id: crypto.randomUUID(), name: "Day 2" },
    { id: crypto.randomUUID(), name: "Day 3" },
  ])
  const [dayExercises, setDayExercises] = useState<DayExercises[]>([])

  function resetWizard() {
    setWizardStep(1)
    setProgramName("")
    setProgramDescription("")
    setDays([
      { id: crypto.randomUUID(), name: "Day 1" },
      { id: crypto.randomUUID(), name: "Day 2" },
      { id: crypto.randomUUID(), name: "Day 3" },
    ])
    setDayExercises([])
  }

  function openWizard() {
    resetWizard()
    setViewState({ view: "wizard" })
  }

  function createProgram() {
    const newProgram = {
      summary: {
        id: crypto.randomUUID(),
        name: programName || "Untitled Program",
        daysPerWeek: days.length,
        description: programDescription,
        isActive: false,
      },
      days: [...days],
      dayExercises: [...dayExercises],
    }
    setPrograms((prev) => [...prev, newProgram])
    setViewState({ view: "list" })
  }

  function deleteProgram(id: string) {
    setPrograms((prev) => prev.filter((p) => p.summary.id !== id))
  }

  function toggleActivate(id: string) {
    setPrograms((prev) =>
      prev.map((p) =>
        p.summary.id === id
          ? { ...p, summary: { ...p.summary, isActive: !p.summary.isActive } }
          : p
      )
    )
  }

  // Day management
  function addDay() {
    setDays((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: `Day ${prev.length + 1}` },
    ])
  }
  function removeDay(id: string) {
    setDays((prev) => prev.filter((d) => d.id !== id))
    setDayExercises((prev) => prev.filter((d) => d.dayId !== id))
  }
  function duplicateDay(id: string) {
    const day = days.find((d) => d.id === id)
    if (!day) return
    const newId = crypto.randomUUID()
    setDays((prev) => [...prev, { id: newId, name: `${day.name} (copy)` }])
    const existingDay = dayExercises.find((d) => d.dayId === id)
    if (existingDay) {
      const newBlocks = existingDay.blocks.map((b) => ({
        ...b,
        id: crypto.randomUUID(),
        movements: b.movements.map((m) => ({
          ...m,
          id: crypto.randomUUID(),
        })),
      }))
      setDayExercises((prev) => [
        ...prev,
        { dayId: newId, blocks: newBlocks },
      ])
    }
  }
  function renameDay(id: string, name: string) {
    setDays((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)))
  }

  const canGoNext = (() => {
    switch (wizardStep) {
      case 1:
        return programName.trim().length > 0
      case 2:
        return days.length > 0
      case 3:
        return true
      default:
        return false
    }
  })()

  // ─── DETAIL VIEW ───
  if (viewState.view === "detail") {
    const program = programs.find((p) => p.summary.id === viewState.programId)
    if (!program) {
      setViewState({ view: "list" })
      return null
    }
    return (
      <ProgramDetailView
        name={program.summary.name}
        days={program.days}
        dayExercises={program.dayExercises}
        isActive={program.summary.isActive}
        onBack={() => setViewState({ view: "list" })}
        onEdit={() => {/* could open wizard in edit mode */}}
        onActivate={() => toggleActivate(program.summary.id)}
        onDelete={() => {
          deleteProgram(program.summary.id)
          setViewState({ view: "list" })
        }}
      />
    )
  }

  // ─── WIZARD VIEW ───
  if (viewState.view === "wizard") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-6">
        <div className="mb-8">
          <ProgramWizardStepper currentStep={wizardStep} />
        </div>

        <div className="min-h-[320px]">
          {wizardStep === 1 && (
            <ProgramStepInfo
              name={programName}
              description={programDescription}
              onNameChange={setProgramName}
              onDescriptionChange={setProgramDescription}
            />
          )}
          {wizardStep === 2 && (
            <ProgramStepDays
              days={days}
              onAddDay={addDay}
              onRemoveDay={removeDay}
              onDuplicateDay={duplicateDay}
              onRenameDay={renameDay}
            />
          )}
          {wizardStep === 3 && (
            <ProgramStepExercises
              days={days}
              dayExercises={dayExercises}
              onDayExercisesChange={setDayExercises}
            />
          )}
          {wizardStep === 4 && (
            <ProgramStepReview
              name={programName}
              description={programDescription}
              days={days}
              dayExercises={dayExercises}
            />
          )}
        </div>

        <Separator className="my-6 bg-border" />

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              if (wizardStep === 1) {
                setViewState({ view: "list" })
              } else {
                setWizardStep((s) => s - 1)
              }
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            {wizardStep === 1 ? "Cancel" : "Back"}
          </Button>

          {wizardStep < 4 ? (
            <Button
              onClick={() => setWizardStep((s) => s + 1)}
              disabled={!canGoNext}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={createProgram}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Create Program
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ─── LIST VIEW ───
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="Programs"
          description="Create and manage your training programs"
          backLabel="Back to Dashboard"
          onBack={onBack}
        />
        {programs.length > 0 && (
          <Button
            onClick={openWizard}
            className="shrink-0 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Program</span>
          </Button>
        )}
      </div>

      {programs.length === 0 ? (
        <ProgramsEmptyState onCreateProgram={openWizard} />
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <ProgramCard
              key={p.summary.id}
              program={p.summary}
              onView={() =>
                setViewState({ view: "detail", programId: p.summary.id })
              }
              onEdit={() => {/* could open wizard in edit mode */}}
              onActivate={() => toggleActivate(p.summary.id)}
              onDelete={() => deleteProgram(p.summary.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
