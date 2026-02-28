"use client"

import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
}

export function StatCard({ label, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-primary">{trend}</span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </div>
  )
}
