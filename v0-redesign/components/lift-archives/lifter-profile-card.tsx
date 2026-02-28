"use client"

import { useState } from "react"
import { Dumbbell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface LifterProfileCardProps {
  hasProfile?: boolean
  dateOfBirth?: string
  weight?: string
  gender?: string
  unit?: string
  division?: string
  onCreateProfile?: (data: {
    dateOfBirth: string
    weight: string
    gender: string
    unit: string
    division: string
  }) => void
}

export function LifterProfileCard({
  hasProfile = false,
  dateOfBirth: initialDob = "",
  weight: initialWeight = "",
  gender: initialGender = "male",
  unit: initialUnit = "kg",
  division: initialDivision = "senior",
  onCreateProfile,
}: LifterProfileCardProps) {
  const [dob, setDob] = useState(initialDob)
  const [weight, setWeight] = useState(initialWeight)
  const [gender, setGender] = useState(initialGender)
  const [unit, setUnit] = useState(initialUnit)
  const [division, setDivision] = useState(initialDivision)

  const handleSubmit = () => {
    onCreateProfile?.({
      dateOfBirth: dob,
      weight,
      gender,
      unit,
      division,
    })
  }

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Dumbbell className="size-4 text-primary" />
          Lifter Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasProfile && (
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Dumbbell className="size-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              No lifter profile yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Set up your profile to start tracking lifts and progress.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="dob" className="text-sm text-muted-foreground">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              placeholder="yyyy-mm-dd"
              className="h-10 rounded-lg border-border/60 bg-secondary/50 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="weight" className="text-sm text-muted-foreground">
              Weight
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight"
              className="h-10 rounded-lg border-border/60 bg-secondary/50 text-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-10 w-full rounded-lg border-border/60 bg-secondary/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="h-10 w-full rounded-lg border-border/60 bg-secondary/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm text-muted-foreground">Division</Label>
              <Select value={division} onValueChange={setDivision}>
                <SelectTrigger className="h-10 w-full rounded-lg border-border/60 bg-secondary/50 text-foreground focus:border-primary/50 focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="mt-2 h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground shadow-[0_0_20px_rgba(212,168,83,0.15)] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(212,168,83,0.25)]"
          >
            {hasProfile ? "Update Profile" : "Create Lifter Profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
