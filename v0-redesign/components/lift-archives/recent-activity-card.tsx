"use client"

import { Clock, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ActivityItem {
  id: string
  type: string
  title: string
  subtitle: string
  timestamp: string
}

interface RecentActivityCardProps {
  activities?: ActivityItem[]
}

export function RecentActivityCard({ activities = [] }: RecentActivityCardProps) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Clock className="size-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <Activity className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No recent activity
            </p>
            <p className="mt-1 text-xs text-muted-foreground/70">
              Start logging sessions to see your activity here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-secondary/50 p-3 transition-colors hover:bg-secondary"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.subtitle}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
