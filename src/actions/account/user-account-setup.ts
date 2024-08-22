"use server";

import { UserInformationDto } from "@/db/data-access/dto/users/types";
import { addUserInformation } from "@/db/data-access/users";
import { ServerResponseMessage } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function userAccountSetupAction({
  userInformations,
}: {
  userInformations: UserInformationDto;
}): Promise<ServerResponseMessage> {
  try {
    await addUserInformation(userInformations);

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
