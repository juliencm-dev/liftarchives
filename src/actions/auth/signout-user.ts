"use server";

import { signOut } from "next-auth/react";

export async function signOutUser() {
  await signOut({ callbackUrl: "/signin" });
}
