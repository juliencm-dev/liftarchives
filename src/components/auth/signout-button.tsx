"use client";

import { signOut } from "next-auth/react";
import { ChevronRight, LogOut } from "lucide-react";
import { Label } from "../ui/label";

export default function SignOutButton() {
  return (
    <div
      className='flex items-center justify-between'
      onClick={() => signOut({ callbackUrl: "/" })}>
      <div className='flex items-center gap-6'>
        <LogOut />
        <Label className='text-base text-muted-foreground'>Sign Out</Label>
      </div>
      <ChevronRight />
    </div>
  );
}
