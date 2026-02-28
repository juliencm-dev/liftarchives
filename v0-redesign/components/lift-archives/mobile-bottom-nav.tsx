"use client"

import { Home, Dumbbell, TrendingUp, CalendarDays, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon: React.ElementType
  href: string
}

const navItems: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Training", icon: Dumbbell, href: "/training" },
  { label: "Lifts", icon: TrendingUp, href: "/lifts" },
  { label: "Programs", icon: CalendarDays, href: "/programs" },
  { label: "Profile", icon: User, href: "/profile" },
]

interface MobileBottomNavProps {
  activeTab?: string
  onTabChange?: (href: string) => void
}

export function MobileBottomNav({
  activeTab = "/",
  onTabChange,
}: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.href
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => onTabChange?.(item.href)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
