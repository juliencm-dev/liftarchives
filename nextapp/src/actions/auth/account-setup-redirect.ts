"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/db/data-access/users";

export async function accountSetupRedirect() {
  const currentUser = await getCurrentUser();

  if (currentUser.accountSetupAt === "") {
    return redirect("/account/setup");
  }
}
