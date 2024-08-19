"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignOutButton() {
  return (
    <Button
      variant={"destructive"}
      onClick={() => signOut({ callbackUrl: "/" })}
      className='w-full rounded-xl'>
      Sign out
    </Button>
  );
}
