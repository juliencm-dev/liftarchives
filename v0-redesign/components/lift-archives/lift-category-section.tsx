"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface LiftCategorySectionProps {
  title: string
  description?: string
  icon: ReactNode
  accentClass?: string
  children: ReactNode
  className?: string
}

export function LiftCategorySection({
  title,
  description,
  icon,
  accentClass = "text-primary",
  children,
  className,
}: LiftCategorySectionProps) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary",
            accentClass
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  )
}
