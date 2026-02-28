"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ChangePasswordCardProps {
  onChangePassword?: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => void
}

export function ChangePasswordCard({
  onChangePassword,
}: ChangePasswordCardProps) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = () => {
    onChangePassword?.({
      currentPassword,
      newPassword,
      confirmPassword,
    })
  }

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lock className="size-4 text-primary" />
          Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="current-pw" className="text-sm text-muted-foreground">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-pw"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="h-10 rounded-lg border-border/60 bg-secondary/50 pr-10 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="new-pw" className="text-sm text-muted-foreground">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-pw"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="h-10 rounded-lg border-border/60 bg-secondary/50 pr-10 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-pw" className="text-sm text-muted-foreground">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-pw"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="h-10 rounded-lg border-border/60 bg-secondary/50 pr-10 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="mt-2 h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-[0_0_20px_rgba(212,168,83,0.15)] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(212,168,83,0.25)]"
          >
            Change Password
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
