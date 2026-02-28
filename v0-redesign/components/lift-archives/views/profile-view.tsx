"use client"

import { PageHeader } from "@/components/lift-archives/page-header"
import { ProfileHeaderCard } from "@/components/lift-archives/profile-header-card"
import { LifterProfileCard } from "@/components/lift-archives/lifter-profile-card"
import { ChangePasswordCard } from "@/components/lift-archives/change-password-card"

interface ProfileViewProps {
  onBack?: () => void
}

export function ProfileView({ onBack }: ProfileViewProps) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 lg:px-6 lg:py-8">
      <PageHeader
        title="Profile"
        description="Manage your account settings, personal details, and preferences."
        backLabel="Back to Dashboard"
        onBack={onBack}
      />

      <div className="mt-6 flex flex-col gap-6">
        <ProfileHeaderCard />

        <div className="grid gap-6 lg:grid-cols-2">
          <LifterProfileCard />
          <ChangePasswordCard />
        </div>
      </div>
    </div>
  )
}
