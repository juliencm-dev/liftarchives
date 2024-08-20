"use client";

import { signOut } from "next-auth/react";
import { ChevronRight, LogOut } from "lucide-react";
import { Label } from "../ui/label";

export default function SignOutButton() {
  return (
    <div className="flex items-center justify-between text-foreground hover:text-red-500 cursor-pointer transition-colors" onClick={() => signOut({ callbackUrl: "/" })}>
      <div className="flex items-center gap-6 ">
        <LogOut />
        <Label className="text-base cursor-pointer">Sign Out</Label>
      </div>
      <ChevronRight />
    </div>
  );
}
