"use client"

import { Dumbbell, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  userName?: string
  userInitial?: string
  onProfileClick?: () => void
  onSignOutClick?: () => void
}

export function DashboardHeader({
  userName = "Julien Coulombe-Morency",
  userInitial = "J",
  onProfileClick,
  onSignOutClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/15">
            <Dumbbell className="size-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            LiftArchives
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full p-1 pr-3 transition-colors hover:bg-secondary">
              <Avatar className="size-8 border border-primary/30">
                <AvatarFallback className="bg-primary/15 text-sm font-semibold text-primary">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-foreground md:inline-block">
                {userName}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onProfileClick}>
              <User className="mr-2 size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOutClick}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
