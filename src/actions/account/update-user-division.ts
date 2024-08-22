"use server";

import { updateUserDivisionInformation } from "@/db/data-access/users";
import { ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function updateUserDivisionAction({
  division,
}: {
  division: "senior" | "master";
}): Promise<ServerResponseMessage> {
  try {
    await updateUserDivisionInformation({
      division,
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
