"use client"

import { useState } from "react"
import { Mail, Save, Check } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ProfileHeaderCardProps {
  displayName?: string
  email?: string
  initial?: string
  onSave?: (name: string) => void
}

export function ProfileHeaderCard({
  displayName = "Julien Coulombe-Morency",
  email = "hello@juliencm.dev",
  initial = "J",
  onSave,
}: ProfileHeaderCardProps) {
  const [name, setName] = useState(displayName)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    onSave?.(name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      {/* Banner */}
      <div className="relative h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent sm:h-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent" />
      </div>

      {/* Avatar + Info */}
      <div className="relative px-4 pb-6 sm:px-6">
        <div className="-mt-10 flex flex-col items-start gap-4 sm:-mt-12 sm:flex-row sm:items-end">
          <Avatar className="size-20 border-4 border-card shadow-lg sm:size-24">
            <AvatarFallback className="bg-primary/20 text-2xl font-bold text-primary sm:text-3xl">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-1">
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              {displayName}
            </h2>
            <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
              <Mail className="size-3.5" />
              <span className="text-sm">{email}</span>
            </div>
          </div>
        </div>

        {/* Display Name Field */}
        <div className="mt-6 flex flex-col gap-2">
          <Label htmlFor="display-name" className="text-sm text-muted-foreground">
            Display Name
          </Label>
          <div className="flex gap-2">
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 flex-1 rounded-lg border-border/60 bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
            />
            <Button
              onClick={handleSave}
              size="icon-lg"
              className="shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {saved ? <Check className="size-4" /> : <Save className="size-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
