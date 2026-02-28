"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  backLabel?: string
  onBack?: () => void
}

export function PageHeader({
  title,
  description,
  backLabel = "Back to Dashboard",
  onBack,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="-ml-2 mb-2 h-auto w-fit gap-1.5 px-2 py-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </Button>
      )}
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
