"use server";

import { updateUserInformation } from "@/db/data-access/users";
import { ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateUserInformationAction({
  liftsUnit,
}: {
  liftsUnit: "lbs" | "kg";
}): Promise<ServerResponseMessage> {
  try {
    await updateUserInformation({
      liftsUnit,
    });

    revalidatePath("/account");
    revalidatePath("/lifts");
    revalidatePath("/programs");
    revalidatePath("/dashboard");

    return {
      message: "User information updated successfully",
      status: 200,
    };
  } catch (error: any) {
    return {
      message: error.message,
      status: 500,
    };
  }
}
