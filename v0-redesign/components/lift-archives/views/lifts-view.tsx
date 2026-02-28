"use client"

import { useState } from "react"
import { Flame, Dumbbell, ArrowDownUp } from "lucide-react"
import { PageHeader } from "@/components/lift-archives/page-header"
import { LiftCard, type LiftRecord } from "@/components/lift-archives/lift-card"
import { LiftCategorySection } from "@/components/lift-archives/lift-category-section"
import { ProgressionChart, type ChartDataPoint } from "@/components/lift-archives/progression-chart"

type LiftCategory = "olympic" | "powerlifting" | "squat"

interface LiftDefinition {
  id: string
  name: string
  category: LiftCategory
}

// Organized lift definitions by category
const olympicLifts: LiftDefinition[] = [
  { id: "snatch", name: "Snatch", category: "olympic" },
  { id: "clean-and-jerk", name: "Clean & Jerk", category: "olympic" },
  { id: "clean", name: "Clean", category: "olympic" },
  { id: "jerk", name: "Jerk", category: "olympic" },
]

const powerliftingLifts: LiftDefinition[] = [
  { id: "bench-press", name: "Bench Press", category: "powerlifting" },
  { id: "deadlift", name: "Deadlift", category: "powerlifting" },
]

const squatLifts: LiftDefinition[] = [
  { id: "back-squat", name: "Back Squat", category: "squat" },
  { id: "front-squat", name: "Front Squat", category: "squat" },
  { id: "overhead-squat", name: "Overhead Squat", category: "squat" },
]

// Demo data for progression chart
const demoChartData: Record<string, ChartDataPoint[]> = {
  "clean-and-jerk": [
    { date: "2026-01-15", weight: 95, label: "Jan 15" },
    { date: "2026-01-28", weight: 98, label: "Jan 28" },
    { date: "2026-02-05", weight: 100, label: "Feb 5" },
    { date: "2026-02-12", weight: 100, label: "Feb 12" },
    { date: "2026-02-19", weight: 103, label: "Feb 19" },
    { date: "2026-02-27", weight: 105, label: "Feb 27" },
  ],
  snatch: [
    { date: "2026-01-20", weight: 70, label: "Jan 20" },
    { date: "2026-02-03", weight: 73, label: "Feb 3" },
    { date: "2026-02-17", weight: 75, label: "Feb 17" },
  ],
}

// Demo PR data
const demoPRs: Record<string, { current: LiftRecord; previous?: LiftRecord }> = {
  "clean-and-jerk": {
    current: { weight: 105, unit: "kg", date: "2026-02-27" },
    previous: { weight: 103, unit: "kg", date: "2026-02-19" },
  },
  snatch: {
    current: { weight: 75, unit: "kg", date: "2026-02-17" },
    previous: { weight: 73, unit: "kg", date: "2026-02-03" },
  },
}

interface LiftsViewProps {
  onBack?: () => void
}

export function LiftsView({ onBack }: LiftsViewProps) {
  const [selectedLift, setSelectedLift] = useState<string | null>(
    "clean-and-jerk"
  )
  const [prData, setPrData] = useState(demoPRs)
  const [chartData, setChartData] = useState(demoChartData)

  const selectedLiftDef = [...olympicLifts, ...powerliftingLifts, ...squatLifts].find(
    (l) => l.id === selectedLift
  )

  function handleAddPR(liftId: string, weight: number, date: string) {
    const unit = "kg"

    setPrData((prev) => ({
      ...prev,
      [liftId]: {
        current: { weight, unit, date },
        previous: prev[liftId]?.current ?? undefined,
      },
    }))

    setChartData((prev) => {
      const existing = prev[liftId] || []
      const labelDate = new Date(date)
      const label = labelDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      return {
        ...prev,
        [liftId]: [...existing, { date, weight, label }].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      }
    })

    // Auto-select the lift we just added a PR to
    setSelectedLift(liftId)
  }

  function renderCategory(
    lifts: LiftDefinition[],
    title: string,
    description: string,
    icon: React.ReactNode,
    accentClass: string
  ) {
    return (
      <LiftCategorySection
        title={title}
        description={description}
        icon={icon}
        accentClass={accentClass}
      >
        {lifts.map((lift) => (
          <LiftCard
            key={lift.id}
            name={lift.name}
            category={lift.category}
            currentPR={prData[lift.id]?.current ?? null}
            previousPR={prData[lift.id]?.previous ?? null}
            isSelected={selectedLift === lift.id}
            onSelect={() =>
              setSelectedLift(selectedLift === lift.id ? null : lift.id)
            }
            onAddPR={(weight, date) => handleAddPR(lift.id, weight, date)}
          />
        ))}
      </LiftCategorySection>
    )
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-8">
        <PageHeader
          title="Lifts"
          description="Track your personal records and monitor progression across all your lifts."
          onBack={onBack}
        />
      </div>

      {/* Progression Chart - Top, full width */}
      <div className="mb-8">
        <ProgressionChart
          liftName={selectedLiftDef?.name}
          data={selectedLift ? (chartData[selectedLift] || []) : []}
        />
      </div>

      {/* Lift Categories */}
      <div className="flex flex-col gap-8">
        {renderCategory(
          olympicLifts,
          "Olympic Weightlifting",
          "Snatch and Clean & Jerk variations",
          <Flame className="size-4" />,
          "text-primary"
        )}
        {renderCategory(
          powerliftingLifts,
          "Powerlifting",
          "Bench Press and Deadlift",
          <Dumbbell className="size-4" />,
          "text-red-400"
        )}
        {renderCategory(
          squatLifts,
          "Squats",
          "Back, Front, and Overhead Squat",
          <ArrowDownUp className="size-4" />,
          "text-blue-400"
        )}
      </div>
    </div>
  )
}
