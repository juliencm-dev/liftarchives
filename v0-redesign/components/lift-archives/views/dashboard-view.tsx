"use client"

import { Activity, Trophy, CalendarDays, Target } from "lucide-react"
import { StatCard } from "@/components/lift-archives/stat-card"
import { QuickActions } from "@/components/lift-archives/quick-actions"
import { RecentActivityCard } from "@/components/lift-archives/recent-activity-card"
import { TodaysTrainingCard } from "@/components/lift-archives/todays-training-card"

interface DashboardViewProps {
  userName?: string
}

export function DashboardView({ userName = "Julien" }: DashboardViewProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {"Welcome back, "}
          <span className="text-primary">{userName}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {"Here's your training overview"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Sessions This Week"
          value="0"
          icon={Activity}
        />
        <StatCard
          label="Personal Records"
          value="--"
          icon={Trophy}
        />
        <StatCard
          label="Active Program"
          value="None"
          icon={CalendarDays}
        />
        <StatCard
          label="Next Competition"
          value="--"
          icon={Target}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        <RecentActivityCard
          activities={[
            {
              id: "1",
              type: "session",
              title: "Snatch Session",
              subtitle: "5 sets - 85kg top set",
              timestamp: "2h ago",
            },
            {
              id: "2",
              type: "pr",
              title: "Clean & Jerk PR",
              subtitle: "New personal record: 120kg",
              timestamp: "Yesterday",
            },
            {
              id: "3",
              type: "session",
              title: "Front Squat Session",
              subtitle: "4 sets of 3 - 140kg",
              timestamp: "2 days ago",
            },
          ]}
        />
        <TodaysTrainingCard
          programName="Competition Prep - Week 6"
          exercises={[
            {
              id: "1",
              name: "Snatch",
              sets: 5,
              reps: "2",
              weight: "80kg",
            },
            {
              id: "2",
              name: "Clean & Jerk",
              sets: 4,
              reps: "1+1",
              weight: "105kg",
            },
            {
              id: "3",
              name: "Back Squat",
              sets: 3,
              reps: "5",
              weight: "145kg",
            },
          ]}
        />
      </div>
    </div>
  )
}
