"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LiveSessionHeaderProps {
  dayLabel: string
  elapsed: string
  setsLogged: number
  currentBlock: number
  totalBlocks: number
  onBack?: () => void
}

export function LiveSessionHeader({
  dayLabel,
  elapsed,
  setsLogged,
  currentBlock,
  totalBlocks,
  onBack,
}: LiveSessionHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="relative flex items-center px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="relative z-10 size-9 text-muted-foreground"
        >
          <ArrowLeft className="size-5" />
        </Button>

        {/* Absolutely centered title + stats */}
        <div className="absolute inset-x-0 flex flex-col items-center pointer-events-none">
          <p className="text-sm font-semibold text-foreground">{dayLabel}</p>
          <p className="text-[11px] tabular-nums text-muted-foreground">
            {elapsed} &middot; {setsLogged} sets
          </p>
        </div>
      </div>

      {/* Block progress bar */}
      <div className="flex gap-1 px-4 pb-2.5">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < currentBlock
                ? "bg-primary"
                : i === currentBlock
                  ? "bg-primary/50"
                  : "bg-secondary"
            }`}
          />
        ))}
      </div>
    </header>
  )
}
