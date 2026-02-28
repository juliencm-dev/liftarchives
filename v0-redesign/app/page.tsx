"use client"

import { useState } from "react"
import { DashboardView } from "@/components/lift-archives/views/dashboard-view"
import { ProfileView } from "@/components/lift-archives/views/profile-view"
import { LiftsView } from "@/components/lift-archives/views/lifts-view"
import { ProgramsView } from "@/components/lift-archives/views/programs-view"
import { DashboardHeader } from "@/components/lift-archives/dashboard-header"
import { MobileBottomNav } from "@/components/lift-archives/mobile-bottom-nav"

export default function Page() {
  const [activeTab, setActiveTab] = useState("/programs")

  function renderView() {
    switch (activeTab) {
      case "/profile":
        return <ProfileView onBack={() => setActiveTab("/")} />
      case "/lifts":
        return <LiftsView onBack={() => setActiveTab("/")} />
      case "/programs":
        return <ProgramsView onBack={() => setActiveTab("/")} />
      default:
        return <DashboardView />
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <DashboardHeader
        onProfileClick={() => setActiveTab("/profile")}
      />

      <main className="flex-1 pb-20 md:pb-0">
        {renderView()}
      </main>

      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
