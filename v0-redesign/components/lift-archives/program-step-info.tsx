"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ProgramStepInfoProps {
  name: string
  description: string
  onNameChange: (name: string) => void
  onDescriptionChange: (description: string) => void
}

export function ProgramStepInfo({
  name,
  description,
  onNameChange,
  onDescriptionChange,
}: ProgramStepInfoProps) {
  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="program-name" className="text-sm font-medium text-foreground">
          Program Name <span className="text-primary">*</span>
        </Label>
        <Input
          id="program-name"
          placeholder="e.g. Strength Block 1"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="h-12 border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="program-description" className="text-sm font-medium text-foreground">
          Description
        </Label>
        <Textarea
          id="program-description"
          placeholder="Optional description for this program..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={4}
          className="resize-y border-border bg-input text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
        />
      </div>
    </div>
  )
}
